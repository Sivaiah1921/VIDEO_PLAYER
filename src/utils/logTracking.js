/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
import axios from 'axios';
import constants, { COMMON_HEADERS, getPlatformType } from './constants';
import { getAccountBaid, getAuthToken, getDeviceInfo, getDthStatus, getIncorrectOTPData, getInternetFailure, getLogData, getLogOTPTime, getRmn, getSubscriberId, getTVDeviceId, removeIncorrectOTPData, removeLogOTPTime, setIncorrectOTPData, setLogData, setLogOTPTime } from './localStorageHelper'
import MIXPANELCONFIG, { LOG_TRACKING_EVENTS } from './mixpanelConfig';
import serviceConst from './slayer/serviceConst';

const LOG_INFO = 'info';
const LOG_ERROR = 'error';
const INCORRECT_OTP = 'Incorrect OTP';
const ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
export const INTERNET_ERROR = 'Internet Error';
export const INTERNET_CODE = '0';

export const LOG_ERROR_CODE_NOT_TRACKING = ['0', '19025', '63005', '60003']

const checkErrorExist = ( data ) => {
  return data?.some( item => item.type === LOG_ERROR )
}

export const handleIncorrectOtp = ( type, value, data ) => {
  // TODO need to modify this method...
  let otpData = getIncorrectOTPData() || []
  if( data?.some( a => a.type === LOG_INFO && a.data['EVENT-NAME'] === MIXPANELCONFIG.EVENT.LOGIN_OTP_ENTER ) && type === MIXPANELCONFIG.EVENT.LOGIN_OTP_ENTER ){
    // No need to add multiple same events. // do nothing...
  }
  else {
    if( value?.ERROR === INCORRECT_OTP || value?.[MIXPANELCONFIG.PARAMETER.ERROR_CODE] === ERR_BAD_REQUEST ){
      const updatedValue = { errorCode: value?.[MIXPANELCONFIG.PARAMETER.ERROR_CODE], errorMessage: value.ERROR, apiEndPoint: serviceConst.VALIDATE_OTP_URL }
      if( !checkErrorExist( otpData ) ){
        setLogOTPTime( new Date().getTime() )
      }
      otpData.push( { type: LOG_ERROR, data: updatedValue } )
      if( otpData.filter( a => a.type === LOG_ERROR )?.length > 2 ){
        if( ( ( new Date().getTime() - Number( getLogOTPTime() ) ) / 1000 ) <= 60 ){
          // setLogSendToBE( false ) // need to check
          setIncorrectOTPData( otpData )
          sendLogsToBEApi( )
          removeLogOTPTime()
          return;
        }
        else {
          setLogOTPTime( new Date().getTime() )
          removeIncorrectOTPData()
          otpData = getIncorrectOTPData() || []
          otpData.push( { type: LOG_ERROR, data: updatedValue } )
        }
      }

      setIncorrectOTPData( otpData )
    }
    else {
      if( LOG_TRACKING_EVENTS.includes( type ) ){
        if( type === MIXPANELCONFIG.EVENT.LOGIN_SUCCESS ){
          removeIncorrectOTPData();
          removeLogOTPTime();
        }
        trackLogEvents( type, { ...value, [MIXPANELCONFIG.EVENT.EVENT_NAME]: type }, false )
      }
    }
  }
}

export const trackLogEvents = ( type, value, forceIgnore = true ) => {
  let dataToBeUpdated = false;
  const data = getLogData()
  if( forceIgnore && ( type.includes( constants.LOGIN.toUpperCase() ) || type.includes( constants.OTP.toUpperCase() ) || type.includes( constants.RMN.toUpperCase() ) ) ){
    handleIncorrectOtp( type, value, data )
  }
  else {
    if( LOG_TRACKING_EVENTS.includes( type ) ){
      // Need to track this event incase of error so added below condition...
      if( type !== MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL ){
        data.push( {
          type: LOG_INFO,
          data: { ...value, [MIXPANELCONFIG.EVENT.EVENT_NAME]: type }
        } )
        dataToBeUpdated = true;
      }
    }
    if( data.length > 2 ){
      data.shift();
      dataToBeUpdated = true;
    }
  }
  dataToBeUpdated && setLogData( data )
}

export const trackErrorEvents = ( type, error = {}, partnerName ) => {
  const response = error.response || {};
  const { config, data: _response } = response || {};
  const url = config?.url || error.url || '';
  if( !( typeof url === 'string' && ( url?.includes( 'ta-recommendation' ) || url?.includes( 'fetch/details' ) || url?.includes( 'box-subset' ) || url?.includes( 'https://i.jsrdn.com/i' ) ) ) ){
    const data = getLogData()
    if( LOG_TRACKING_EVENTS.includes( type ) ){
      if( type !== MIXPANELCONFIG.EVENT.FAKE_ERROR && data.length > 2 ){
        data.shift()
      }
      if( type === MIXPANELCONFIG.EVENT.FAKE_ERROR ){
        setLogData( data )
        sendLogsToBEApi( error.skipSteps )
      }
      else {
        data.push( {
          type: LOG_ERROR,
          data: {
            errorMessage: error.message || ( _response && ( _response.message || _response.error_description ) ) || partnerName + '-' + error.errorText || error,
            errorCode: ( _response && ( _response.error_code || _response.error || _response.code?.toString() ) ) || error.code?.toString() || error.errorCode,
            apiEndPoint: error.url || config?.url || error?.config?.url || ''
          },
          eventType: type
        } )
        setLogData( data )
        if( !getInternetFailure() ){
          sendLogsToBEApi( error.skipSteps )
        }
      }
    }

  }
}

const prepareLogTrackingData = ( data, otpFlag = false, errorData, skipSteps = false ) => {
  const steps = []
  let finalData = {}
  const device = getDeviceInfo() || {}
  const errData = otpFlag ? errorData : data;
  if( ( otpFlag && checkErrorExist( errorData ) ) || checkErrorExist( data ) ){
    !skipSteps && data?.forEach( element => {
      if( element.type === LOG_INFO ){
        steps.push( element.data )
      }
    } );
    finalData = {
      userProperties: {
        rmn: getRmn(),
        accountId: getAccountBaid() || '',
        platform: getPlatformType(),
        subscriberId: getSubscriberId() || '',
        deviceId: getTVDeviceId(),
        dthStatus: getDthStatus(),
        deviceModel: device.modelName,
        deviceResolution: device.screenWidth + ' * ' + device.screenHeight
      },
      steps,
      error: errData.filter( e => e.type === LOG_ERROR )?.[0].data // TODO: use find instead of filter
    }
    postApi( {
      data: { errorLog : JSON.stringify( finalData ) },
      url: getAuthToken() ? serviceConst.LOG_TRACKING_AUTH_USER : serviceConst.LOG_TRACKING_GUEST_USER,
      headers: {
        'content-type': COMMON_HEADERS.CONTENT,
        platform: getPlatformType(),
        appVersion: COMMON_HEADERS.VERSION,
        ...( getAuthToken() && { authorization: getAuthToken() } )
      }
    } )
    if( !otpFlag && data?.filter( e => e.type === LOG_ERROR )?.length >= 1 ){
      data.splice( data.findIndex( e => e.type === LOG_ERROR ), 1 )
      prepareLogTrackingData( data );
      setLogData( data );
    }
    // setLogSendToBE( true ); //need to check
    if( otpFlag ){
      removeIncorrectOTPData();
    }
  }
}

const sendLogsToBEApi = ( skipSteps = false ) => {
  if( getIncorrectOTPData()?.length >= 3 ){
    prepareLogTrackingData( getLogData(), true, getIncorrectOTPData() )
  }
  prepareLogTrackingData( getLogData(), false, null, skipSteps )
}

const postApi = async( config ) => {
  const { headers, data, url } = config || {}
  await axios.post( `${ process.env.REACT_APP_APIPATH }/${url}`, data, {
    headers: headers
  } ).then( ( res ) => {
    console.log( 'LOG TRACKING API RESPONSE', res )
  } ).catch( ( err ) => {
    console.log( 'LOG TRACKING API ERROR', err )
  } )
}