/* eslint-disable no-console */
/* eslint-disable no-self-compare */
/**
 * The RegisterContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/RegisterContextProvider/RegisterContextProvider
 */
import React, { useContext, createContext, useEffect, useState, useMemo } from 'react';
import { GetScreenSaver, RegisterUserCall } from '../../../utils/slayer/AppContextService';
import { getAnonymousId, getAuthToken, getDeviceLaunchCount, getTVDeviceId, setAnonymousId, setDeviceInfo, setDeviceLaunchCount, setProfileId, setRegion, setTVDeviceId } from '../../../utils/localStorageHelper';
import { COMMON_HEADERS, SENTRY_LEVEL, SENTRY_TAG, samsungRemoteKeys } from '../../../utils/constants';
import { getTizenVersion, onLoadMixpanelConfiguration, sendExecptionToSentry } from '../../../utils/util';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import { initializeUserSubscriptionST } from '../../../utils/commonHelper';

/**
 * Util funtion that returns device id
 *
 * @method
 * @returns {undefined}
 */
export const getDeviceId = ( byPass = true ) => {
  try {
    if( window.webapis ){
      const devId = webapis.productinfo.getDuid() || 'tizentv';
      console.log( 'Samsung Device ID-- ', devId )
      COMMON_HEADERS.DEVICE_ID = devId;
      setTVDeviceId( devId )
    }
    else if( window.webOS ){
      webOS.service.request( 'luna://com.webos.service.sm', {
        method: 'deviceid/getIDs',
        parameters: {
          idType: ['LGUDID']
        },
        onSuccess: function( inResponse ){
          if( inResponse ){
            console.log( 'LG Device ID-- ', inResponse )
            const devId = inResponse.idList[0].idValue;
            COMMON_HEADERS.DEVICE_ID = devId;
            setTVDeviceId( devId )
          }
        },
        onFailure: function( inError ){
          sendExecptionToSentry( inError, `${ SENTRY_TAG.DEVICE_ID_ERROR }`, SENTRY_LEVEL.ERROR );
          console.log( 'Error in getting LG Device ID-- ', inError )
          const devId = '99999999999999999999911111111112';
          COMMON_HEADERS.DEVICE_ID = devId;
          setTVDeviceId( devId )
        }
      } );
    }
    else {
      console.log( 'LG & SAMSUNG not found Device ID -- ' )
      const devId = '99999999999999999999911111111112';
      COMMON_HEADERS.DEVICE_ID = devId;
      setTVDeviceId( devId )
    }
  }
  catch ( error ){
    console.log( 'Error in LG & Samsung Device ID -- ', error )
    sendExecptionToSentry( error, `${ SENTRY_TAG.DEVICE_ID_ERROR }`, SENTRY_LEVEL.ERROR );
    const devId = '99999999999999999999911111111112';
    COMMON_HEADERS.DEVICE_ID = devId;
    setTVDeviceId( devId )
  }
  finally {
    byPass && onLoadMixpanelConfiguration()
  }
}

export const getDeviceInfo = ( setDeviceName ) => {
  try {
    if( window.tizen ){
      tizen.systeminfo.getPropertyValue( 'BUILD', function( buildInfo ){
        var tvName = buildInfo.model;
        COMMON_HEADERS.DEVICE_NAME = `SAMSUNG SMART TV ${tvName}`
        setDeviceName( `SAMSUNG SMART TV ${tvName}` )
      }, function( error ){
        COMMON_HEADERS.DEVICE_NAME = `SAMSUNG SMART TV`
        setDeviceName( `SAMSUNG SMART TV` )
      } );
      tizen.tvinputdevice.registerKeyBatch( samsungRemoteKeys );
    }
    else if( window.webOS ){
      webOS.service.request( 'luna://com.webos.service.tv.systemproperty', {
        method: 'getSystemInfo',
        parameters: {
          keys: ['modelName']
        },
        onComplete: function( inResponse ){
          var isSucceeded = inResponse.returnValue;
          if( isSucceeded ){
            COMMON_HEADERS.DEVICE_NAME = `LG SMART TV ${ inResponse.modelName }`
            setDeviceName( `LG SMART TV ${ inResponse.modelName }` )
          }
          else {
            COMMON_HEADERS.DEVICE_NAME = `LG SMART TV`
            setDeviceName( `LG SMART TV` )
          }
        }
      } );
    }
    else {
      COMMON_HEADERS.DEVICE_NAME = `SMART TV`
      setDeviceName( `SMART TV` )
    }
  }
  catch ( error ){
    sendExecptionToSentry( error, `${ SENTRY_TAG.DEVICE_NAME_ERROR }`, SENTRY_LEVEL.INFO );
  }
};

/**
 * Util funtion that returns device id
 *
 * @method
 * @returns {undefined}
 */
export const networkStateChangeListener = ( setNetworkStatus ) => {
  try {
    if( window.webapis ){
      webapis && webapis.network && webapis.network.addNetworkStateChangeListener( value => {
        if( value === webapis.network.NetworkState.GATEWAY_CONNECTED ){
          setNetworkStatus( true );
        }
        else if( value === webapis.network.NetworkState.GATEWAY_DISCONNECTED ){
          setNetworkStatus( false );
        }
      } );
    }
    else if( window.webOS ){
      webOS.service.request( 'luna://com.webos.service.connectionmanager', {
        method: 'getStatus',
        parameters: { 'subscribe': true },
        onSuccess: ( inResponse ) => {
          setNetworkStatus( inResponse.isInternetConnectionAvailable );
          navigator && navigator.connection?.addEventListener( 'change', () => setNetworkStatus( navigator.onLine ) );
        },
        onFailure: () => {
          // on webOS 1.0 - 3.0 SDK can fail to get ConnectionManager service
          // in this case script falls back to generic HTML5 online check
          navigator && navigator.connection?.addEventListener( 'change', () => setNetworkStatus( navigator.onLine ) );
        }
      } );
    }
    else {
      navigator && navigator.connection?.addEventListener( 'change', () => setNetworkStatus( navigator.onLine ) );
    }
  }
  catch ( error ){
    sendExecptionToSentry( error, `${ SENTRY_TAG.NETWORK_STATUS_ERROR }`, SENTRY_LEVEL.INFO );
  }
}

/**
 * Util funtion that returns model no & webos version of tv
 *
 * @method
 * @param {}
 * @returns { undefined } = Returns undefined
 */
export const getWebosVersion = () => {
  try {
    if( window.webOS ){
      window.webOS.deviceInfo( ( deviceInfo ) => {
        if( deviceInfo ){
          setDeviceInfo( deviceInfo );
        }
      } );
    }
    else if( window.webapis ){
      const deviceDetails = {
        uhd: webapis.productinfo.isUHDAModel(),
        modelName: webapis.productinfo.getRealModel(),
        sdkVersion: getTizenVersion(),
        version: webapis.productinfo.getFirmware(),
        screenWidth: window.screen.availWidth,
        screenHeight: window.screen.availHeight
      }
      setDeviceInfo( deviceDetails )
    }
  }
  catch ( error ){
    sendExecptionToSentry( error, `${ SENTRY_TAG.WEBOS_VERSION_ERROR }`, SENTRY_LEVEL.INFO )
  }
};

export const getLocation = () => {
  fetch( 'http://ip-api.com/json' )
    .then( ( response ) => response.json() )
    .then( ( data ) => {
      // setRegion( data.regionName );
    } )
    .catch( ( error ) => console.error( 'Error fetching location:', error ) );
}
/**
  * Represents a RegisterContextProvider component
  *
  * @method
  * @param { Object } props - React properties passed from composition
  * @returns RegisterContextProvider
  */
export const RegisterContextProvider = function( { children } ){
  const [deviceName, setDeviceName] = useState( null );
  const [networkStatus, setNetworkStatus] = useState( true );
  const [registerUserDetail, setRegisteredUser] = useState();
  const [screenSaverData, setScreenSaverData] = useState( [] );
  const [registerUser] = RegisterUserCall();
  const { fetchRegisterUser, registerUserResponse } = registerUser
  const [screensaverData] = GetScreenSaver();
  const { screenSaverFetchData, screenSaverResponse } = screensaverData
  const { filterRail } = useContentFilter()

  useEffect( () => {
    networkStateChangeListener( setNetworkStatus );
    getDeviceInfo( setDeviceName );
  }, [] )


  useEffect( () => {
    console.log( 'Device ID & Anonymous ID -- ', getAnonymousId(), getTVDeviceId(), getAuthToken() )
    if( getTVDeviceId() ){
      setDeviceLaunchCount( getDeviceLaunchCount() )
      initializeUserSubscriptionST();
      if( !getAnonymousId() || !getAuthToken() ){
        fetchRegisterUser();
      }
    }
  }, [getTVDeviceId()] )

  useEffect( () =>{
    if( getTVDeviceId() && getTVDeviceId() !== getTVDeviceId() ){
      // eslint-disable-next-line no-console
      setDeviceLaunchCount( 0 )
    }

  }, [getTVDeviceId()] )

  useEffect( () => {
    if( registerUserResponse && registerUserResponse.data ){
      setRegisteredUser( registerUserResponse.data )
      setAnonymousId( registerUserResponse.data.anonymousId )
      setProfileId( registerUserResponse.data.profileId )
    }
  }, [registerUserResponse] )

  useEffect( ()=>{
    screenSaverFetchData()
  }, [] )

  useEffect( ()=>{
    if( screenSaverResponse && screenSaverResponse.data && screenSaverResponse.data.items?.length > 0 ){
      const screenSaverfilterList = filterRail( screenSaverResponse.data.items[0].contentList ) || []
      screenSaverfilterList.length > 0 && screenSaverfilterList.map( ( data )=>{
        setScreenSaverData( s => s.concat( data.image ) )
      } )
    }
  }, [screenSaverResponse] )


  const registerContextValue = useMemo( () => ( {
    isOnline: networkStatus,
    registerUserDetail,
    screenSaverData,
    deviceName
  } ), [networkStatus, registerUserDetail, screenSaverData, deviceName] );


  return (
    <RegisterContext.Provider value={ registerContextValue }>
      { children }
    </RegisterContext.Provider>
  )
}

export default RegisterContextProvider;

/**
  * Context provider for react reuse
  * @type object
  */
export const RegisterContext = createContext();

/**
  * context provider
  * @type object
  */
export const useRegisterContext = ( ) => useContext( RegisterContext );
