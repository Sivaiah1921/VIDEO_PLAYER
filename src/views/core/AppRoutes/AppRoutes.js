/* eslint-disable no-console */
/**
 * The common application route component is used for handling routing that need to be defined.
 *
 * @module views/core/AppRoutes
 */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import ROUTES, { RenderRoutes } from '../routes';
import LeftNavContainer from '../../components/LeftNavContainer/LeftNavContainer';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory, useLocation } from 'react-router-dom';
import '../../../global.scss';
import { useNavigationContext } from '../NavigationContextProvider/NavigationContextProvider';
import { useHistoryContext } from '../HistoryContextProvider/HistoryContextProvider';
import { usePubNubContext } from '../PubNubContextProvider/PubNubContextProvider';
import { getAllLoginPath, getAuthToken, getMXPlayerError, getProductName, setAllLoginPath, removeMXPlayerError, getCatalogFlag, getSearchFlag, getBingeListFlag, setPageNumberPagination, setCatalogFlagLocal, setSearchFlagLocal, setBingeListFlagLocal, getLiveFlagLocal, getPiLevel, setPiLevel, setAccountBaid, getDthStatus, getZeroAppPlanPopupOnRefresh, setZeroAppPlanPopupOnRefresh, removeInternetFailure, getInternetFailure, setInternetFailure, getIsLoginToggleState, getFromNewLoginState, getTVDeviceId, setFromSportsMediaCard, setFromAppMediaCard } from '../../../utils/localStorageHelper';
import constants, { PACKS, PAGE_TYPE, keyCodes, isTizen, FORCE_UPDATE_POPUP, COMMON_HEADERS, getPlatformTypeForTA, USERS } from '../../../utils/constants';
import { useRegisterContext } from '../RegisterContextProvider/RegisterContextProvider';
import { ErrorPage } from '../../components/ErrorPage/ErrorPage';
import { clearPILevelWhenComeBackToPI, compareBuildVersions, exitApp, handleErrorMessage, isKeyBoardVisibile, keyCodeForBackFunctionality, redirectToPlayStore, switchPubnubChannelHandling, trackMipanelEvents } from '../../../utils/util';
import { useMaintainPageState } from '../MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHomeContext } from '../HomePageContextProvider/HomePageContextProvider';
// import { removeMXSDK } from '../../../utils/slayer/PlayerService';
import Home from '../../components/Home/Home';
import './AppRoutes.scss'
import MultiLanguageList from '../../components/MultiLanguageList/MultiLanguageList';
import ForceUpdatePopup from '../../components/ForceUpdatePopup/ForceUpdatePopup';
import { useAppContext } from '../AppContextProvider/AppContextProvider';
import { PubnubHandling } from '../../../utils/slayer/SubscriberFormService';
import { INTERNET_CODE, INTERNET_ERROR, trackErrorEvents } from '../../../utils/logTracking';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { deviceremoveSkip } from '../../../utils/mixpanel/mixpanelService';
import { usePlayerContext } from '../PlayerContextProvider/PlayerContextProvider';
import Text from '../../components/Text/Text';
/**
 * Represents a AppRoutes component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns Routes
 */
export const AppRoutes = function(){
  const location = useLocation()
  const { setCatalogFlag, setSearchFlag, setBingeListFlag, setNumberPressed, launchCount, setLiveSearchFlag, setContentParams } = useHomeContext()
  const { onLogin } = usePubNubContext()
  const previousPathName = useNavigationContext();
  const { screenSaverVisible, railsRestoreId, fromSideMenuSubscribe, isLoaderOnPrimeFetchDetails, isLoginToggle, setInitiateTimer, fromNewLogin, setIsLoginToggle, setOptionBba, isCWWatchingRailContentRef } = useMaintainPageState()
  const historyObject = useHistoryContext();
  const { ref, focusKey } = useFocusable( { isFocusBoundary: true, focusKey: 'APP_NAVIGATION' } );
  const history = useHistory();
  const { isOnline } = useRegisterContext( ) || {};
  const [showForceUpdatePopup, setshowForceUpdatePopup] = useState( false )
  const [isLoadedData, setIsLoadedData] = useState( false )

  const forceupdatePopupRef = useRef();
  const { configResponse } = useAppContext();

  const [pubnubHandle] = PubnubHandling();
  const { pubnubFetchData, pubnubResponse, pubnubError } = pubnubHandle;

  const { setStoredContentInfo } = usePlayerContext();

  const onKeyPress = useCallback( ( { keyCode, key } ) => {
    if( keyCodes.includes( keyCode ) && isKeyBoardVisibile() ){
      setNumberPressed( { keyValue: key } )
    }
    else if( isLoaderOnPrimeFetchDetails.current ){
      return null
    }
    else if( keyCodeForBackFunctionality( keyCode ) ){ //eslint-disable-line
      setNumberPressed( {} )
      handleNavigation();
    }
  }, [screenSaverVisible] )

  const handleNavigation = () => {
    const selector = document.querySelector( '.Modal' )
    const path_1 = previousPathName.navigationRouting
    switch ( getPagetypeNavigation( window.location.pathname, selector, path_1 ) ){
      case PAGE_TYPE.DO_NOT_REDIRECT:
        if( previousPathName.navigationSubRouting ){
          history.goBack()
          previousPathName.navigationSubRouting = false
        }
        break;

      case PAGE_TYPE.PI_SCREEN: // After LOGIN PI SCREEN
        if( getAllLoginPath() ){
          let indexRouter
          if( getAllLoginPath().some( str => str.includes( 'purchase' ) ) && getAllLoginPath().some( str => str.includes( 'login' ) ) ){
            indexRouter = getPiLevel()
          }
          else {
            indexRouter = getPiLevel()
          }
          railsRestoreId.current = null
          history.go( -indexRouter )
          setAllLoginPath( [] )
          setPiLevel( 0 )
        }
        previousPathName.navigationRouting = null
        break;

      case PAGE_TYPE.CONFIRM_PIRCHASES : // After LOGIN CONFIRM PURCHASE SCREEN OPENS
        if( previousPathName.tenurePagePath !== null ){
          history.push( previousPathName.tenurePagePath )
          previousPathName.tenurePagePath = null
        }
        else {
          history.push( PAGE_TYPE.SUBSCRIPTION_PAGE )
          previousPathName.tenurePagePath = null
        }
        break;

      case PAGE_TYPE.TENURE : // After LOGIN CONFIRM PURCHASE SCREEN OPENS AND PRESS BACK TENURE OPENS
        history.push( PAGE_TYPE.SUBSCRIPTION_PAGE )
        break;

      case PAGE_TYPE.SUBSCRIPTION : // After LOGIN CONFIRM PURCHASE SCREEN OPENS AND PRESS BACK SUBCRIPTION OPENS
        if( getProductName() !== PACKS.FREEMIUM && getAuthToken() ){
          history.push( '/plan/current' )
        }
        else {
          history.push( PAGE_TYPE.HOME )
          previousPathName.navigationRouting = null
        }
        break;

      case PAGE_TYPE.CURRENT_SUBSCRIPTION : // Press Back button from Lower Plan
        history.push( PAGE_TYPE.HOME )
        previousPathName.navigationRouting = null
        break;

      case PAGE_TYPE.CURRENT_SUBSCRIPTION_AFTER_LOGIN:
        history.push( PAGE_TYPE.HOME )
        previousPathName.navigationRouting = null
        break;

      case PAGE_TYPE.SCREEN_SAVER:
        break;

      case PAGE_TYPE.DEVICE_MANAGEMENT_SCEEN :
        /* MixPanel-Event */
        deviceremoveSkip()
        getAuthToken() ? history.goBack() : history.go( -2 )
        break;
      case PAGE_TYPE.MXPLAYER_SCREEN:
        if( getMXPlayerError() ){
          removeMXPlayerError();
          // removeMXSDK();
          history.goBack();
          const piLevelClear = getPiLevel()
          setPiLevel( piLevelClear - 1 )
        }
        break;

      case PAGE_TYPE.PLAYER_SCREEN:
        break;

      case PAGE_TYPE.CONTENT_LANGUAGE_SCREEN:
        previousPathName && previousPathName.current && previousPathName.current.includes( PAGE_TYPE.ACCOUNT_URL ) ? history.goBack() : (
          history.replace( '/discover' )
        )
        break;
      case PAGE_TYPE.PI_SCREEN_CATALOG_SEARCH:
        setContentParams( {} ) // CLearing data because after search if we open live PI page then causing problem.
        setCatalogFlag( false )
        setSearchFlag( false )
        setBingeListFlag( false )
        setAllLoginPath( [] )
        setPiLevel( 0 )
        setTimeout( ()=> setStoredContentInfo( null ), 100 );
        break;
      case PAGE_TYPE.FROM_SIDE_MENU_SUBSCRIBE:
        history.push( '/discover' )
        fromSideMenuSubscribe.current = false
        break;
      case PAGE_TYPE.FROM_PRIME_MARKETING_ASSET:
        previousPathName.isFromPrimeMarketingAsset = false
        previousPathName.primeRedirectionPage = null
        history.push( '/discover' )
        break;
      default:
        const data = getAllLoginPath()
        const piLevel = getPiLevel()
        setTimeout( ()=> setStoredContentInfo( null ), 100 );
        previousPathName.playerScreen = '';
        if( data && data.includes( window.location.pathname ) ){
          data.pop()
          setAllLoginPath( data )
        }
        if( Boolean( window.location.pathname.includes( PAGE_TYPE.BROSWSE_BY ) ) ){
          setContentParams( {} );
        }
        if( piLevel && Boolean( window.location.pathname.includes( PAGE_TYPE.SEARCH ) || window.location.pathname.includes( PAGE_TYPE.BROSWSE_BY ) || window.location.pathname.includes( PAGE_TYPE.BINGE_LIST ) || window.location.pathname.includes( PAGE_TYPE.CONTENT_DETAIL ) ) ){
          setSearchFlag( false )
          setCatalogFlag( false )
          setLiveSearchFlag( false )
          setBingeListFlag( false )
          history.go( -piLevel )
          setAllLoginPath( [] )
          setPiLevel( 0 )
        }
        else {
          trackMipanelEvents()
          if( getIsLoginToggleState() && getFromNewLoginState() ){
            setInitiateTimer( false )
            history.go( -2 );
          }
          else {
            history.goBack()
          }
          setTimeout( () => {
            const piLevelClear = getPiLevel()
            clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
          }, 10 );
        }
    }
  }

  const getPagetypeNavigation = ( path, selector, path_1 ) => {
    if( screenSaverVisible.current ){
      return PAGE_TYPE.SCREEN_SAVER
    }
    if( path.includes( PAGE_TYPE.OTHER_CATEGORIES ) ){
      return PAGE_TYPE.DO_NOT_REDIRECT
    }
    if( path.includes( PAGE_TYPE.HOME ) ){
      return PAGE_TYPE.DO_NOT_REDIRECT
    }
    if( selector !== null ){
      return PAGE_TYPE.DO_NOT_REDIRECT
    }
    if( path.includes( PAGE_TYPE.APP_EXIT_SCREEN ) ){
      return PAGE_TYPE.DO_NOT_REDIRECT
    }
    if( path.includes( PAGE_TYPE.SPLASH ) ){
      return PAGE_TYPE.DO_NOT_REDIRECT
    }
    if( path_1?.includes( PAGE_TYPE.CONTENT_DETAIL ) && path_1 === path && getAllLoginPath().length > 0 ){
      return PAGE_TYPE.PI_SCREEN
    }
    if( path_1 === path && path_1?.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
      return PAGE_TYPE.CONFIRM_PIRCHASES
    }
    if( path.includes( PAGE_TYPE.TENURE ) && path_1?.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
      return PAGE_TYPE.TENURE
    }

    if( path.includes( PAGE_TYPE.SUBSCRIPTION ) && path_1?.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
      return PAGE_TYPE.SUBSCRIPTION
    }
    if( path.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) && previousPathName.isLowerPlanFirstTime ){
      return PAGE_TYPE.CURRENT_SUBSCRIPTION
    }
    if( path.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) && path_1?.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
      return PAGE_TYPE.CURRENT_SUBSCRIPTION_AFTER_LOGIN
    }
    if( path.includes( PAGE_TYPE.DEVICE_MANAGEMENT ) ){
      return PAGE_TYPE.DEVICE_MANAGEMENT_SCEEN
    }
    if( path.includes( PAGE_TYPE.CONTENT_LANGUAGE ) ){
      return PAGE_TYPE.CONTENT_LANGUAGE_SCREEN
    }
    if( path.includes( PAGE_TYPE.MXPLAYER_SCREEN ) ){
      return PAGE_TYPE.MXPLAYER_SCREEN
    }
    if( path.includes( PAGE_TYPE.PLAYER ) || path.includes( PAGE_TYPE.TRAILER ) || path.includes( PAGE_TYPE.SUNNXT ) || path.includes( PAGE_TYPE.SONY_PLAYER_SCREEN ) || getLiveFlagLocal() === 'true' ){
      return PAGE_TYPE.PLAYER_SCREEN
    }
    if( Boolean( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' || getLiveFlagLocal() === 'true' ) && Boolean( window.location.pathname.includes( PAGE_TYPE.SEARCH ) || window.location.pathname.includes( PAGE_TYPE.BROSWSE_BY ) || window.location.pathname.includes( PAGE_TYPE.BINGE_LIST ) ) ){
      return PAGE_TYPE.PI_SCREEN_CATALOG_SEARCH
    }
    if( fromSideMenuSubscribe.current && ( window.location.pathname.includes( PAGE_TYPE.SUBSCRIPTION ) || window.location.pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) ) ){
      return PAGE_TYPE.FROM_SIDE_MENU_SUBSCRIBE
    }
    if( Boolean( getCatalogFlag() === 'false' ) && window.location.pathname.includes( PAGE_TYPE.BROSWSE_BY ) ){
      return PAGE_TYPE.BROSWSE_BY;
    }
    if( previousPathName.isFromPrimeMarketingAsset && ( window.location.pathname.includes( previousPathName.primeRedirectionPage ) ) ){
      return PAGE_TYPE.FROM_PRIME_MARKETING_ASSET
    }
  }


  useEffect( () => {
    historyObject.current = history;
    window.addEventListener( 'keydown', onKeyPress );
    return () => window.removeEventListener( 'keydown', onKeyPress );
  }, [] );

  useEffect( () => {
    if( getAuthToken() && onLogin ){
      if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        switchPubnubChannelHandling( getDthStatus(), pubnubFetchData, 'splash' ) // need to check for Both DTH and NonDTH users
      }
      else {
        onLogin( true )
      }
    }
    setAllLoginPath( [] )
    setPageNumberPagination( 1 )
  }, [] );

  useEffect( ()=>{
    setNumberPressed( {} )
    if( window.location.pathname.includes( 'discover' ) ){
      setAllLoginPath( [] )
      setPiLevel( 0 )
      setCatalogFlagLocal( false )
      setSearchFlagLocal( false )
      setBingeListFlagLocal( false )
      setPageNumberPagination( 1 )
      setIsLoginToggle( true )
      setOptionBba( false )
      setFromSportsMediaCard( false )
      setFromAppMediaCard( false )
      isCWWatchingRailContentRef.current = false
    }
  }, [window.location.pathname] )

  const showLeftNav = ROUTES.find( ( page ) => {
    return ( window.location.pathname.includes( 'discover' ) && launchCount > 1 ) || window.location.pathname.includes( 'other-categories' )
  } ) ;

  const openForceUpdatePopup = () => {
    setshowForceUpdatePopup( true )
    forceupdatePopupRef?.current?.showModal();
  }

  useEffect( () => {
    if( configResponse && configResponse.app ){
      if( compareBuildVersions( COMMON_HEADERS.VERSION, configResponse.app.appUpgrade[getPlatformTypeForTA()].forceUpgradeVersion ) ){
        setTimeout( () => {
          openForceUpdatePopup();
        }, 10 )
      }
      else {
        setIsLoadedData( true )
      }
    }
  }, [configResponse] )

  useEffect( ()=>{
    if( pubnubResponse && pubnubResponse.data ){
      if( pubnubResponse.data.enableAccountPubnubChannel ){
        setAccountBaid( pubnubResponse.data.channelName )
        onLogin( true )
      }
      else {
        onLogin( true )
      }
    }
    if( pubnubError ){
      onLogin( true )
    }
  }, [pubnubResponse, pubnubError] )

  useEffect( ()=>{
    if( getZeroAppPlanPopupOnRefresh() && +getZeroAppPlanPopupOnRefresh() === 0 ){
      setZeroAppPlanPopupOnRefresh( 1 )
    }
    else if( getZeroAppPlanPopupOnRefresh() && +getZeroAppPlanPopupOnRefresh() >= 1 ){
      setZeroAppPlanPopupOnRefresh( +getZeroAppPlanPopupOnRefresh() + 1 )
    }
  }, [] )

  useEffect( () => {
    if( isOnline ){
      if( getInternetFailure() ){
        removeInternetFailure()
        trackErrorEvents( MIXPANELCONFIG.EVENT.FAKE_ERROR )
      }
    }
    else {
      setInternetFailure( true );
      trackErrorEvents( MIXPANELCONFIG.EVENT.INTERNET_FAILURE, { message: INTERNET_ERROR, code: INTERNET_CODE } )
    }
  }, [isOnline] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <main ref={ ref }>
        {
          getTVDeviceId() ?
            showForceUpdatePopup ? (
              <ForceUpdatePopup
                opener={ forceupdatePopupRef }
                modalRef={ forceupdatePopupRef }
                handleCancel={ exitApp }
                header={ configResponse.app.appUpgrade[getPlatformTypeForTA()].forceUpgradeHeader || FORCE_UPDATE_POPUP.header1 }
                info={ configResponse.app.appUpgrade[getPlatformTypeForTA()].forceUpgradeMessage || FORCE_UPDATE_POPUP.info }
                {
                  ...( !isTizen && {
                    buttonLabel:  FORCE_UPDATE_POPUP.btn1,
                    buttonClicked1: redirectToPlayStore
                  } )
                }
                buttonLabel2={ FORCE_UPDATE_POPUP.btn2 }
                buttonClicked2={ exitApp }
                backIcon={ FORCE_UPDATE_POPUP.icon }
                focusKeyRefrence={ 'DONE_BUTTON' }
              />
            ) : isLoadedData && ( isOnline ?
              (
                <div className='main'>
                  { showLeftNav &&
                  <LeftNavContainer/>
                  }
                  <div className={
                    classNames( 'page', {
                      'page--leftMargin': showLeftNav
                    } )
                  }
                  >
                    <div
                      id='playerWrapper'
                      className='player-wrapper'
                    >
                    </div>
                    <RenderRoutes routes={ ROUTES } />
                    { launchCount > 1 ?
                      <div className={ window.location.pathname.includes( 'discover' ) ? 'show' : 'hide' }> <Home /></div> :
                      <MultiLanguageList />
                    }
                  </div>
                </div>
              ) :
              (
                <div className='main'>
                  <div>
                    <ErrorPage
                      error={ handleErrorMessage( null, null, constants.YOU_ARE_OFFLINE ) }
                      hideHeader={ true }
                    />
                  </div>
                </div>
              )

            ) : <div className='Splash__notFoundPage'> <Text>Page Not Found </Text></div>
        }
      </main>
    </FocusContext.Provider>
  )
}

export default AppRoutes;