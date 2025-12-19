/* eslint-disable no-console */
/**
 * This component provides the login facility with number keyboard
 *
 * @module views/components/RMN
 * @memberof -Common
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import '../LoginForm/LoginForm.scss';
import LoginPane from '../LoginPane/LoginPane';
import NumberKeyboard from '../NumberKeyboard/NumberKeyboard';
import { LoginFormService } from '../../../utils/slayer/LoginFormService';
import { constants } from '../../../utils/constants';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import parse from 'html-react-parser';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import Divider from '../Divider/Divider';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { setRmn, getRmn, getAllLoginPath } from '../../../utils/localStorageHelper';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { loginExit, login_get_otp, login_invalid_RMN, login_license_agreement, login_license_agreement_back, login_rmn_enter } from '../../../utils/mixpanel/mixpanelService';
import { storeAllPaths } from '../../../utils/util';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import LoginToggle from '../LoginToggle/LoginToggle';
import LoginInterstitial from '../LoginInterstitial/LoginInterstitial';
import get from 'lodash/get';
/**
 * Represents a RMN component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns RMN
 */

const TermsoFUseContent = ( { termAndConditionHtml, focusKeyRefrence, handleScroll } )=>{
  const scrollRef = useRef( null )
  const initRef = useRef( 0 )
  const { ref, focusSelf } = useFocusable( {
    onArrowPress:( direction )=>{
      const toTalHeight = document.querySelector( '.LoginForm__left' )?.clientHeight || 0
      const el = document.querySelector( '.LoginForm__scrollContent' )
      if( direction === 'down' && initRef.current <= toTalHeight ){
        initRef.current = initRef.current + document.querySelector( '.LoginForm__content' ).clientHeight - 200
        if( el ){
          el.scrollTop = initRef.current
        }

        handleScroll( toTalHeight, initRef.current )
      }
      if( direction === 'up' && initRef.current >= 0 ){
        initRef.current = initRef.current - document.querySelector( '.LoginForm__content' ).clientHeight + 200
        if( el ){
          el.scrollTop = initRef.current
        }
        handleScroll( toTalHeight, initRef.current )
      }
    }
  } );
  useEffect( ()=>{
    focusSelf()
  }, [] )

  return (
    <div className='LoginForm__scrollContent'
      ref={ scrollRef }
    >
      <div className='LoginForm__left'
        ref={ ref }
      >
        {
          termAndConditionHtml
        }
      </div>
    </div>
  )
}
const LoginModal = ( { modalRef, handleCancel, licenseAgreementTitle, termAndConditionHtml } ) => {

  const [arrowDown, setArrowDown] = useState( false );
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );

  const closeModal = ()=> {
    handleCancel()
  }

  const handleScroll = ( event, initValue ) => {
    initValue > 2 ? setArrowDown( true ) : setArrowDown( false )
  };

  const MouseWheelHandler = ( e ) => {
    const event = window.event || e;
    const delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
    delta >= 1 ? setArrowDown( true ) : setArrowDown( false )
    return false;
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )

  return (
    <Modal
      id='LoginFormModalId'
      customClassName='LoginForm__modal'
      ref={ modalRef }
      // opener={ props.opener }
      closeModalFn={ handleCancel }
    >
      <div ref={ ref }>
        <FocusContext.Provider value={ focusKey }>
          { licenseAgreementTitle &&
          <div className='LoginForm__title'>
            <Text
              textAlign='left'
              textStyle='title-3'
            >
              { licenseAgreementTitle }
            </Text>
          </div> }
          <div className={
            classNames( 'LoginForm__content',
              {
                'LoginForm__content--arrowdown': arrowDown,
                'LoginForm__contentArrowUp': !arrowDown
              } )
          }
          >

            <TermsoFUseContent termAndConditionHtml={ termAndConditionHtml }
              setArrowDown={ setArrowDown }
              handleScroll={ handleScroll }
            />

            <div className='LoginForm__right'>
              <Divider vertical={ true } />
              <Icon name='ArrowDown'
                className={
                  classNames( 'LoginForm__arrow',
                    { 'LoginForm__arrowDownRotate180': arrowDown
                    } )
                }
              />
            </div>
          </div>
          <div className='LoginForm__closeButton' >
            <Button
              label={ constants.BACK_TO_CLOSE }
              iconLeft={ true }
              iconLeftImage='Path'
              size='medium'
              onClick={ closeModal }
            // disabled={ true }
            />
          </div>
        </FocusContext.Provider>
      </div>
    </Modal>
  )
};
export const RMN = function( props ){
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const enableQrLoginJourney = useMemo( () => get( config, 'qrLoginJourney.enable' ), [config] );
  const { loginVerbiages, isLoginToggle, setIsLoginToggle, isQrCodeJourney, QrError, localQRData, setShowSeconds, showSeconds, setInitiateTimer } = useMaintainPageState()
  const { numberPressed, setNumberPressed } = useHomeContext()
  const [inputValue, setValue] = useState( '' );
  const [isDisable, setDisabled] = useState( true );
  const [errorMessage, setErrorMessage] = useState();
  const [focusRetain, setFocusRetain] = useState( false );
  const modalRef = useRef();
  const [genOtp, valOtp, licenseAgreementData] = LoginFormService( { inputValue: inputValue || getRmn(), otpValue: '', newOtpFlow: config?.newOtpFlow } );
  const { genOTPFetchData, genOTPResponse, genOTPError, genOTPLoading } = genOtp;
  const { licenseAgreementFetchData, licenseAgreementResponse, licenseAgreementError, licenseAgreementLoading } = licenseAgreementData;
  const history = useHistory();
  const newLogin = useRef( false );
  const [modalPopup, setModalPopup] = useState( false )

  const { ref, focusKey } = useFocusable( {
    focusable: true,
    isFocusBoundary: true
  } );

  useEffect( ()=>{
    const loginPaths = Array.isArray( getAllLoginPath() ) ? getAllLoginPath() : [];
    storeAllPaths( window.location.pathname )
    return () => {
      setNumberPressed( {} )
      if( !loginPaths.includes( '/login' ) && !loginPaths.includes( '/new-rmn' ) ){
        setInitiateTimer( false );
      }
    }
  }, [] )

  useEffect( () => {
    if( genOTPResponse?.code === 0 ){
      setFocusRetain( true )
      setErrorMessage( );
      if( genOTPResponse && genOTPResponse.data && Object.keys( genOTPResponse.data ).length > 0 ){
        loginVerbiages.current = {
          resendOTPVerbiage: genOTPResponse.data.resendOtpInVerbiage,
          enterOtpVerbiage: genOTPResponse.data.enterOtpVerbiage,
          resendOtpVerbiageAfterResend: genOTPResponse.data.resendOtpVerbiage,
          secondsVerbiage: genOTPResponse.data.secondsVerbiage,
          resendOtpHeading: genOTPResponse.data.resendOtpHeading
        }
      }
      history.push( {
        pathname: `/verify-otp`
      } )
      /* Mixpanel-event */
      login_get_otp();
    }
    if( genOTPResponse?.code === 20090 ){
      setErrorMessage( genOTPResponse?.message )
      /* Mixpanel-events */
      login_invalid_RMN()
    }
  }, [genOTPResponse] );

  const configEulaUrl = config?.url?.eulaUrl;
  const licenseAgreementTitle = config?.licenseAgreement?.subTitle || 'Licence Agreement';
  const obj = licenseAgreementResponse?.split( 'eula2": "' );
  const termAndConditionHtml = obj && obj.length > 1 && parse( obj[1] ) || parse( `${licenseAgreementResponse?.data?.eula2}` )
  const BackgroundImage = config?.welcomeScreen?.backgroundImage;

  const onChangeHandler = () => {
    setIsLoginToggle( !isLoginToggle )
  };

  const changeState = ( o, data ) => {
    if( ( o + data ).length <= 10 ){
      ( o + data ).length === 10 && (
        setRmn( o + data ),
        setDisabled( false ),
        setFocus( 'BUTTON_PRIMARY' ),
        setNumberPressed( {} )
      )
      return o + data
    }
    else {
      return o
    }
  }

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setValue( o => changeState( o, numberPressed.keyValue ) )
    }
  }, [numberPressed] )

  useEffect( () => {
    licenseAgreementFetchData( { configEulaUrl } );
  }, [configEulaUrl] );

  const onKeyboardPress = ( newValue ) => {
    if( !inputValue || inputValue?.length <= 9 ){
      setValue( inputValue + newValue );
      newLogin.current = true
    }
    if( ( inputValue + newValue )?.length === 10 ){
      setDisabled( false );
      setRmn( inputValue + newValue )
      setFocus( 'BUTTON_PRIMARY' )
      setNumberPressed( {} )
    }
    if( inputValue?.length === 10 ){
      setFocus( 'BUTTON_PRIMARY' )
      setNumberPressed( {} )
    }

  }
  const onClear = () => {
    setValue( '' );
    setErrorMessage( '' )
  }
  const onRemove = () => {
    setValue( inputValue?.slice( 0, -1 ) )
    setErrorMessage( '' )
  }
  const openModal = () => { // need to check
    setModalPopup( true )
    if( modalRef.current && !modalRef.current.open ){
      modalRef.current.showModal();
    }
    /* Mixpanel-event */
    login_license_agreement();
  };
  const hideModal = () => {
    setModalPopup( false )
    setTimeout( ()=> setFocus( 'TERMS_BUTTON' ) )
    /* Mixpanel-event */
    login_license_agreement_back()
  };

  const onProceedClick = () => {
    /* Mixpanel-event */
    login_rmn_enter()
    genOTPFetchData();
  }

  return (
    <div className='LoginForm'
      ref={ ref }
    >
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
              loginExit( MIXPANELCONFIG.VALUE.LOGIN_RMNENTRY_PAGE )
              if( isLoginToggle && getAllLoginPath().includes( '/login' ) ){
                setInitiateTimer( false )
                history.go( -2 );
              }
              else {
                history.goBack()
              }
            } }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.GOBACK }
          />
          <Icon
            name={ constants.MY_ACCOUNT.BINGE_LOGO }
          />
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey }>
        { enableQrLoginJourney ? (
          <div className='LoginForm__new_container'>
            <LoginToggle
              checked={ isLoginToggle }
              onChangeHandler={ onChangeHandler }
              loginMethodOne={ localQRData.current?.data?.verbiages?.loginMethodOne || constants.PREVIOUSLY_USED_LOGIN.USE_PHONE }
              loginMethodTwo={ localQRData.current?.data?.verbiages?.loginMethodTwo || constants.PREVIOUSLY_USED_LOGIN.USE_REMOTE }
              title={ localQRData.current?.data?.verbiages?.title || constants.PREVIOUSLY_USED_LOGIN.LOG_IN_INTER }
            />
            {
              isLoginToggle ? (
                <LoginInterstitial
                  QrError={ QrError }
                  seconds={ showSeconds }
                  setSeconds={ setShowSeconds }
                />
              ) : (
                <div className='LoginForm__rmnContent'>
                  <NumberKeyboard
                    onChange={ onKeyboardPress }
                    clearBtnLabel={ constants.CLEARBTN_LABEL }
                    deleteBtnLabel={ constants.DELETEBTN_LABEL }
                    onClear={ onClear }
                    onRemove={ onRemove }
                    focusRetain={ focusRetain }
                    enableQrLoginJourney={ enableQrLoginJourney }
                    fromQRLogin={ 'fromQrLogin' }
                  />
                  <LoginPane
                    mobInputLabel={ config?.rmn_screen || constants.ENTER_RMN }
                    loginTitle={ constants.LOGIN }
                    proceedBtnLabel2={ config?.loginAgreementVerbiage || constants.TNC_TEXT }
                    prefixValue={ constants.NUM_PREFIX }
                    btnLabel={ constants.LOGINBTN_NAME }
                    disabled={ isDisable }
                    value={ inputValue }
                    onProceedClick={ onProceedClick }
                    errorMessage={ errorMessage }
                    openModal={ openModal }
                    modalRef={ modalRef }
                    focusKeyRefrence={ 'CHECKBOX_PRIMARY' }
                    enableQrLoginJourney={ enableQrLoginJourney }
                  />
                </div>
              )
            }
          </div>
        ) : (
          <div className='LoginForm__container'>
            <NumberKeyboard
              onChange={ onKeyboardPress }
              clearBtnLabel={ constants.CLEARBTN_LABEL }
              deleteBtnLabel={ constants.DELETEBTN_LABEL }
              onClear={ onClear }
              onRemove={ onRemove }
              focusRetain={ focusRetain }
              enableQrLoginJourney={ enableQrLoginJourney }
              QrError={ QrError }
            />
            <LoginPane
              mobInputLabel={ config?.rmn_screen || constants.ENTER_RMN }
              loginTitle={ constants.LOGIN }
              proceedBtnLabel2={ config?.loginAgreementVerbiage || constants.TNC_TEXT }
              prefixValue={ constants.NUM_PREFIX }
              btnLabel={ constants.LOGINBTN_NAME }
              disabled={ isDisable }
              value={ inputValue }
              onProceedClick={ onProceedClick }
              errorMessage={ errorMessage }
              openModal={ openModal }
              modalRef={ modalRef }
              focusKeyRefrence={ 'CHECKBOX_PRIMARY' }
              enableQrLoginJourney={ enableQrLoginJourney }
              QrError={ QrError }
            />
          </div>
        ) }
        { modalPopup &&
          <LoginModal modalRef={ modalRef }
            licenseAgreementTitle={ licenseAgreementTitle }
            termAndConditionHtml={ termAndConditionHtml }
            handleCancel={ hideModal }
          /> }
      </FocusContext.Provider>
      <div className='LoginForm__background'></div>
    </div>
  )
}

export default RMN;
