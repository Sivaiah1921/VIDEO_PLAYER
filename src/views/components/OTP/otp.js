/**
 * This component provides the login facility with number keyboard
 *
 * @module views/components/LoginForm
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import { getRmn, setBeforeLoginAuthToken, setBeforeLoginDeviceToken, setDeviceToken } from '../../../utils/localStorageHelper';
import LoginOtpEnteringPane from '../LoginOtpEnteringPane/LoginOtpEnteringPane';
import '../LoginForm/LoginForm.scss';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import constants from '../../../utils/constants';
import NumberKeyboard from '../NumberKeyboard/NumberKeyboard';
import { loginOtpPageBack, login_failure, login_get_otp, login_invalid_RMN, login_otp_enter, login_otp_resend, onOTPScreen } from '../../../utils/mixpanel/mixpanelService';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useHistory, useLocation } from 'react-router-dom';
import { LoginFormService } from '../../../utils/slayer/LoginFormService';
import Image from '../Image/Image';
import Text from '../Text/Text';
import { lengthOfOtp, storeAllPaths } from '../../../utils/util';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';

export const OTP = function( ){
  const location = useLocation();
  const { loginVerbiages } = useMaintainPageState() || {};
  const [inputValue, setValue] = useState( '' );
  const [otpValue, setOtpValue] = useState( [] );
  const [errorMessage, setErrorMessage] = useState();
  const [resentClicked, setResentClicked] = useState( true );
  const [showResentMsg, setShowResentMsg] = useState( false );
  const [otpLoader, setOTPLoader] = useState( false );
  const [otpError, setOtpError] = useState( '' );
  const [focusRetain, setFocusRetain] = useState( false );
  const { numberPressed, setNumberPressed } = useHomeContext()
  const history = useHistory();
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const [genOtp, valOtp] = LoginFormService( { inputValue: inputValue || getRmn(), otpValue, newOtpFlow: config?.newOtpFlow } );
  const { genOTPFetchData, genOTPResponse, genOTPError, genOTPLoading } = genOtp;
  const { valOTPFetchData, valOTPResponse, valOTPError, valOTPLoading } = valOtp;

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setOtpValue( o=>o.concat( parseInt( numberPressed.keyValue, 10 ) ) )
    }
    else {
      setOtpValue( [] )
    }
  }, [numberPressed] )

  useEffect( ()=>{
    onOTPScreen()
    storeAllPaths( window.location.pathname )
    return () => {
      setNumberPressed( {} )
    }
  }, [] )

  useEffect( () => {
    if( otpValue.length > 0 ){
      const formattedOtpValue = otpValue?.join( '' )
      if( otpValue.length === lengthOfOtp( config ) ){
        setOTPLoader( true )
        valOTPFetchData( { inputValue, otpValue: formattedOtpValue } )
        /* Mixpanel-event */
        login_otp_enter()
      }
    }
  }, [otpValue] );
  useEffect( () => {
    setOTPLoader( false )
    if( valOTPResponse?.data?.userAuthenticateToken ){
      setBeforeLoginAuthToken( valOTPResponse.data.userAuthenticateToken )
      setBeforeLoginDeviceToken( valOTPResponse.data.deviceAuthenticateToken )
      setDeviceToken( valOTPResponse.data.deviceAuthenticateToken )
      history.push( {
        pathname: `/device/subscriber`
      } )
    }
    if( valOTPResponse && !valOTPResponse.data?.length > 0 ){
      setErrorMessage( valOTPResponse.message )
      setOtpValue( [] );
    }
    if( valOTPResponse && !valOTPResponse.data?.length && valOTPResponse.code !== 0 ){
      /* Mixpanel-event */
      login_failure( valOTPResponse.message || constants.SOMETHING_WENT_WRONG, valOTPResponse.code )
    }
    if( !valOTPResponse ){
      setOtpError()
    }
  }, [valOTPResponse] );

  useEffect( () => {
    if( otpError ){
      setTimeout( () => {
        setOtpError( '' )
      }, 3000 )
    }
  }, [otpError] )
  useEffect( () => {
    if( valOTPError ){
      setOTPLoader( false )
      setOtpError( constants.OTP_ERROR )
      setOtpValue( [] )
      /* Mixpanel-event */
      login_failure( valOTPError.message || constants.SOMETHING_WENT_WRONG, valOTPError.code )
    }
  }, [valOTPError] )
  useEffect( () => {
    if( genOTPResponse?.code === 0 ){
      setOTPLoader( false )
      setFocusRetain( true )
      setErrorMessage( );
      /* Mixpanel-event */
      login_get_otp();
    }
    if( genOTPResponse?.code === 20090 ){
      setErrorMessage( genOTPResponse?.message )
      /* Mixpanel-events */
      login_invalid_RMN()
    }
  }, [genOTPResponse] );
  const { ref, focusKey } = useFocusable( {
    focusable: true,
    isFocusBoundary: true
  } );
  const BackgroundImage = config?.welcomeScreen?.backgroundImage;
  const loaderPath = `${window.assetBasePath}loader.gif`;

  const onKeyboardPress = ( newValue ) => {
    if( otpValue?.length <= lengthOfOtp( config ) ){
      setErrorMessage()
      setShowResentMsg( false )
      const tempOTPValue = [...otpValue];
      tempOTPValue.push( newValue );
      setOtpValue( tempOTPValue );
      /* Mixpanel-event */
    }
  }
  const onClear = () => {
    setOtpValue( [] )
    setErrorMessage( '' )
  }
  const onRemove = () => {
    const tempOTPValue = [...otpValue];
    tempOTPValue.pop();
    setOtpValue( tempOTPValue );
    setErrorMessage( '' )
  }
  const onResentClick = ( ) => {
    if( !resentClicked ){
      setFocus( 'BUTTON_1' )
      setOtpValue( [] );
      setResentClicked( true );
      setShowResentMsg( true );
      setErrorMessage();
      setOTPLoader( true )
      genOTPFetchData();
      /* Mixpanel-event */
      login_otp_resend();
    }
  }
  return (
    <div className='LoginForm' >
      <BackgroundComponent
        bgImg={ BackgroundImage }
        alt='Login BackgroundImage'
        isGradient={ false }
      />
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='LoginForm__header'>
          <Button
            onClick={ ()=> {
              /* Mixpanel-event */
              loginOtpPageBack()
              history.goBack()
            } }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.GOBACK }
          />
          <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey } >
        <div className='LoginForm__container'
          ref={ ref }
        >
          {
            otpLoader && (
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='Loader otp-loader'>
                  <Image
                    src={ loaderPath }
                  />
                </div>
              </FocusContext.Provider>
            )
          }
          <NumberKeyboard
            onChange={ onKeyboardPress }
            clearBtnLabel={ constants.CLEARBTN_LABEL }
            deleteBtnLabel={ constants.DELETEBTN_LABEL }
            onClear={ onClear }
            onRemove={ onRemove }
            focusRetain={ focusRetain }
          />
          <LoginOtpEnteringPane
            title='Login'
            mobileNumber={ inputValue || getRmn() }
            resendBtnLabel={ loginVerbiages.current?.resendOtpHeading || constants.RESEND_OTP }
            value={ otpValue }
            errorMsg={ errorMessage }
            onResentClick={ onResentClick }
            setResentClicked={ setResentClicked }
            setShowResentMsg={ setShowResentMsg }
            resentClicked={ resentClicked }
            showResentMsg={ showResentMsg }
            { ...loginVerbiages.current }
          />
          { otpError &&
          <div className='LoginForm__otpError'>
            <Text
              color='bingeBlue-25'
              textStyle='subtitle-1'
            >
              { otpError }
            </Text>
          </div>
          }
        </div>
      </FocusContext.Provider>
      <div className='LoginForm__background'></div>
    </div>
  )
}

export default OTP;