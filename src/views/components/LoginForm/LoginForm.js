/* eslint-disable no-console */
/**
 * This component provides the login facility with number keyboard
 *
 * @module views/components/LoginForm
 * @memberof -Common
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import './LoginForm.scss';
import { constants } from '../../../utils/constants';
import PreviouslyUsedLoginPane from '../PreviouslyUsedLoginPane/PreviouslyUsedLoginPane';
import { PreviouslyUsedLoginPaneService } from '../../../utils/slayer/PreviouslyUsedLoginPaneService';
import Loader from '../Loader/Loader';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { getAnonymousId, getPiLevel, getTVDeviceId, setAllLoginPath } from '../../../utils/localStorageHelper';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { loginExit, login_page_visit, previouslyRMNClickOnNewRMN, previouslyRMNLands } from '../../../utils/mixpanel/mixpanelService';
import { clearPILevelWhenComeBackToPI, removeSetAllLoginPath, storeAllPaths } from '../../../utils/util';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import LoginInterstitial from '../LoginInterstitial/LoginInterstitial';
import LoginToggle from '../LoginToggle/LoginToggle';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import get from 'lodash/get';
import { QrLoginService } from '../../../utils/slayer/QrLoginService';
/**
 * Represents a LoginForm component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LoginForm
 */

export const LoginForm = function( props ){
  const previousPathName = useNavigationContext();
  const { configResponse } = useAppContext();
  const { isLoginToggle, setIsLoginToggle, localQRData, QrError, setQrError, setShowSeconds, showSeconds, setInitiateTimer, setFromNewLogin } = useMaintainPageState()
  const { config } = configResponse;
  const enableQrLoginJourney = useMemo( () => get( config, 'qrLoginJourney.enable' ), [config] );
  const [isDisable, setDisabled] = useState( true );
  const [showPrevRMN, setShowPrevRMN] = useState( true );
  const [isLoading, setIsLoading] = useState( true );
  const [prevUsedRMN] = PreviouslyUsedLoginPaneService( );
  const { prevRMNFetchData, prevRMNResponse, prevRMNError, prevRMNLoading } = prevUsedRMN;
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState( '' );
  const prevRmnsPresent = useRef( false );
  const qrLoginJourney = useMemo( () => get( config, 'qrLoginJourney' ), [config] );
  const { expiryTime = 5 } = qrLoginJourney || {};
  const expiryTimeInSeconds = expiryTime * 60;
  const [generateLoginQr] = QrLoginService();
  const { generateQrFetchData, generateQrResponse, generateQrError, generateQrLoading } = generateLoginQr;
  const onChangeHandler = () => {
    setIsLoginToggle( !isLoginToggle )
  };

  useEffect( () => {
    setAllLoginPath( [] )
    previousPathName.subscriptionRootPage = 'LOGIN';
    storeAllPaths( window.location.pathname )
    setFromNewLogin( false )

    return ( () => {
      if( ! ( window.location.pathname.includes( 'login' ) || window.location.pathname.includes( 'verify-otp' ) || window.location.pathname.includes( 'new-rmn' ) ) ){
        setInitiateTimer( false )
      }
    } )
  }, [] );

  useEffect( () => {
    const fetchData = async() => {
      setIsLoading( true );
      try {
        if( getAnonymousId() && getTVDeviceId() ){
          await prevRMNFetchData();
          if( enableQrLoginJourney ){
            await generateQrFetchData();
          }
        }
      }
      catch ( error ){
      }
      finally {
        setIsLoading( false );
      }
    };

    fetchData();
  }, [] );

  const { ref, focusKey } = useFocusable( {
    focusable: true,
    isFocusBoundary: true
  } );

  useEffect( () => {
    if( isLoginToggle ){
      login_page_visit( isLoginToggle )
    }
  }, [isLoginToggle] )

  useEffect( () => {
    if( generateQrResponse && !generateQrLoading ){
      localQRData.current = generateQrResponse
      setQrError( false )
    }

    else if( generateQrResponse && !generateQrLoading && generateQrResponse?.code !== 0 ){
      setQrError( true )
    }

    else if( generateQrError ){
      setQrError( true )
    }

  }, [generateQrResponse, generateQrError, generateQrLoading] )

  useEffect( () => {
    if( prevRMNResponse && prevRMNResponse.data?.mobileNumbersList?.length > 0 && getAnonymousId() && !isLoginToggle && !isLoading ){
      /* Mixpanel Events */
      login_page_visit( isLoginToggle );
      previouslyRMNLands( isLoginToggle )
      setShowPrevRMN( true );
      prevRmnsPresent.current = true
    }
    if( prevRMNResponse && !prevRMNResponse.data?.mobileNumbersList?.length && getAnonymousId() ){
      setShowPrevRMN( false );
    }
    if( prevRMNResponse && prevRMNResponse.data?.mobileNumbersList?.length === 0 && getAnonymousId() && !isLoading ){
      login_page_visit( isLoginToggle );
      removeSetAllLoginPath()
      setIsLoginToggle( true )
      history.replace( '/new-rmn' )
    }
  }, [prevRMNResponse, isLoginToggle, isLoading] );

  useEffect( () => {
    if( prevRMNError && getAnonymousId() ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      setIsLoginToggle( true )
      login_page_visit( isLoginToggle );
      removeSetAllLoginPath()
      history.replace( '/new-rmn' )
    }
  }, [prevRMNError, isLoginToggle] )

  const BackgroundImage = config?.welcomeScreen?.backgroundImage;

  const newLoginClicked = () => {
    setFromNewLogin( true )
    setIsLoginToggle( false )
    login_page_visit( isLoginToggle );
    history.push( '/new-rmn' )
    /* Mixpanel-event */
    previouslyRMNClickOnNewRMN()
  }

  const mousePointerClick = () => {
    /* Mixpanel-event */
    loginExit( MIXPANELCONFIG.VALUE.LOGIN_EXISTINGRMN_PAGE )
    setIsLoginToggle( true )
    history.goBack()
    setAllLoginPath( [] )
    setTimeout( () => {
      const piLevelClear = getPiLevel()
      clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
    }, 10 );
  }

  useEffect( () => {
    setInitiateTimer( true )
  }, [expiryTimeInSeconds] )

  return (
    <div ref={ ref }>
      <FocusContext.Provider value={ focusKey }>
        { isLoading ? (
          <Loader />
        ) : (
          <div className='LoginForm'>
            { prevRMNLoading && generateQrLoading ? <Loader /> : (
              <>
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
                      onClick={ ()=> mousePointerClick() }
                      iconLeftImage='GoBack'
                      iconLeft={ true }
                      secondary={ true }
                      label={ constants.GOBACK }
                    />
                    <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
                  </div>
                </FocusContext.Provider>
                {
                  ( enableQrLoginJourney ) ? (
                    <div className='LoginForm__new_container'>
                      <LoginToggle
                        checked={ isLoginToggle }
                        onChangeHandler={ onChangeHandler }
                        loginMethodOne={ generateQrResponse?.data?.verbiages?.loginMethodOne || constants.PREVIOUSLY_USED_LOGIN.USE_PHONE }
                        loginMethodTwo={ generateQrResponse?.data?.verbiages?.loginMethodTwo || constants.PREVIOUSLY_USED_LOGIN.USE_REMOTE }
                        title={ generateQrResponse?.data?.verbiages?.title || constants.PREVIOUSLY_USED_LOGIN.LOG_IN_INTER }
                      />
                      {
                        isLoginToggle ? (
                          <LoginInterstitial
                            seconds={ showSeconds }
                            setSeconds={ setShowSeconds }
                            QrError={ QrError }
                          />
                        ) : (
                          showPrevRMN && (
                            prevRMNResponse?.data?.mobileNumbersList?.length > 0 && (
                              <PreviouslyUsedLoginPane
                                loginVerbiage={ prevRMNResponse?.data }
                                mobileNumbersList={ prevRMNResponse?.data?.mobileNumbersList }
                                newLoginClicked={ newLoginClicked }
                                enableQrLoginJourney={ enableQrLoginJourney }
                                fromQRLogin={ 'fromQRLogin' }
                              />
                            ) )
                        )
                      }

                    </div>
                  ) : (
                    <div className='LoginForm__container'>
                      { showPrevRMN && (
                        prevRMNResponse?.data?.mobileNumbersList?.length > 0 && (
                          <PreviouslyUsedLoginPane
                            loginVerbiage={ prevRMNResponse?.data }
                            mobileNumbersList={ prevRMNResponse?.data?.mobileNumbersList }
                            newLoginClicked={ newLoginClicked }
                            enableQrLoginJourney={ enableQrLoginJourney }
                            QrError={ QrError }
                          />
                        ) ) }
                    </div>
                  )
                }
                <div className='LoginForm__background'></div>
              </>
            ) }
          </div>
        ) }
      </FocusContext.Provider>
    </div>

  )
}


/**
 * Property type definitions
 *
 * @type {object}
 * @property {func} onChange - set the onChange
 * @property {string} deleteBtnLabel - set the deleteBtnLabel
 * @property {string} clearBtnLabel - set the clearBtnLabel
 * @property {func} onClear - clear input
 * @property {func} onRemove - remove single item from input
 * @property {string} mobInputLabel - set the mobInputLabel to use in icon
 * @property {string} btnLabel - set the btnLabel
 * @property {string} value - input value
 */
export const propTypes = {
  onChange: PropTypes.func,
  deleteBtnLabel: PropTypes.string,
  clearBtnLabel: PropTypes.string,
  onClear: PropTypes.func,
  onRemove: PropTypes.func,
  mobInputLabel: PropTypes.string,
  value: PropTypes.string,
  openModal: PropTypes.func,
  handleCancel: PropTypes.func,
  btnLabelModal: PropTypes.string
};

LoginForm.propTypes = propTypes;

export default LoginForm;
