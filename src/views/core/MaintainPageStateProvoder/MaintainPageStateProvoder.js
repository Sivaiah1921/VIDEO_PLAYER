/* eslint-disable no-console */
/**
 * The MaintainPageStateProvoder component is used to provide the user details to any component which needs it.
 *
 * @module views/core/MaintainPageStateProvoder/MaintainPageStateProvoder
 */
import React, { useContext, createContext, useState, useRef, useEffect, useMemo } from 'react';
import { PAGE_NAME } from '../../../utils/constants';
import { getAuthToken, setIsLoginToggleState, getIsLoginToggleState, setFromNewLoginState } from '../../../utils/localStorageHelper';
import get from 'lodash/get';
import { useAppContext } from '../AppContextProvider/AppContextProvider';
/**
 * Represents a MaintainPageStateProvoder component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns MaintainPageStateProvoder
 */
export const MaintainPageStateProvoder = function( { children } ){
  const railsRestoreId = useRef( null );
  const donglePageData = useRef( null );
  const homeDonglePageData = useRef( null );
  const availableProvidersList = useRef( [] );
  const checkRecRailRef = useRef( null );
  const railCardTitle = useRef( null );
  const railRestoreTitle = useRef( null );
  const catalogCardId = useRef( null );
  const searchCardId = useRef( null );
  const episodeCardId = useRef( null );
  const searchPageData = useRef( null );
  const episodePageData = useRef( null );
  const catalogPage = useRef( null );
  const catalogPagePatner = useRef( null );
  const seriesPage = useRef( null );
  const genereDirection = useRef( null );
  const genereRotationRef = useRef( null );
  const screenSaverVisible = useRef( false );
  const autoPlaytrailerScreenSaver = useRef( false );
  const piPageFocus = useRef( 'BUTTON_PRIMARY' );
  const trackRecord = useRef( null );
  const searchKeyBoardLastFocuskey = useRef( null );
  const scrollLeftMenu = useRef( null );
  const selectedGenreItem = useRef( null );
  const selectedGenrePosition = useRef( 0 );
  const selectedLaungueItem = useRef( null );
  const selectedLaunguePosition = useRef( 0 );
  const fromConfirmPurchase = useRef( false );
  const fromRenewPurchase = useRef( false );
  const loginVerbiages = useRef( {} );
  const storeRailData = useRef( null );
  const openActiveModalRef = useRef( false );
  const playEventFromPopupRef = useRef( false );
  const successFullPlanPurchasePubnub = useRef( false );
  const topPositionRailValueContext = useRef( null );
  const isActivatedAppleButtonClicked = useRef( false );
  const flexiPlanVerbiagesContext = useRef( null );
  const bbaRailRestoreId = useRef( null );
  const bbaContentListId = useRef( null );
  const receivePubnubAfterScanning = useRef( {} );
  const currentPlan = useRef( null );
  const primeManualBack = useRef( false );
  const fromSideMenuSubscribe = useRef( false );
  const restoreActivePopupKey = useRef( null )
  const hasPrimeCtaClicked = useRef( false )
  const selectedPackageCard = useRef( null )
  const isLoaderOnPrimeFetchDetails = useRef( null )
  const selectedDevicesIdsList  = useRef( [] )
  const localQRData = useRef( null )
  const selectedpartnerId = useRef( '' )
  const isPubnubWrapper = useRef( null );
  const isCWWatchingRailContentRef = useRef( false )

  const [searchTotalData, setSearchTotalData] = useState( [] );
  const [shuffleIndex, setshuffleIndex] = useState( [] );
  const [totalrailsList, setTotalrailsList] = useState( null );
  const [lastRailTitle, setLastRailTitle] = useState( null );
  const [lastFocusFrom, setLastFocusFrom] = useState( false );
  const [liveContent, setLiveContent] = useState( false );
  const [playerAction, setPlayerAction] = useState( '' );
  const [broadcastMode, setBroadcastMode] = useState( '' );
  const [bbaSelectedItem, setBBASelectedItem] = useState( 0 );
  const [bbaContents, setBbaContents] = useState( { bbaInitCount: true } );
  const [isActivePopUpOpen, setIsActivePopUpOpen] = useState( false )
  const [isDeviceRemoved, setIsDeviceRemoved] = useState( false );
  const [layoutType, setLayoutType] = useState( '' );
  const [cardSize, setCardSize] = useState( '' );
  const [isLoginToggle, setIsLoginToggle] = useState( getIsLoginToggleState() );
  const [isQrCodeJourney, setIsQrCodeJourney] = useState( false );
  const [QrLoginDetails, setQrLoginDetails] = useState( null );
  const [QrError, setQrError] = useState( false );
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const expiryTime = useMemo( () => get( config, 'qrLoginJourney.expiryTime' ), [config] );
  const [initiateTimer, setInitiateTimer] = useState( false );
  const [showSeconds, setShowSeconds] = useState( expiryTime );
  // const [localQRData, setLocalQrData] = useState( null );
  const [fromNewLogin, setFromNewLogin] = useState( null );
  const [subCatalogPagesInfo, setSubCatalogPagesInfo] = useState( [] );
  const [optionBba, setOptionBba] = useState( false )

  useEffect( () => {
    catalogPage.selectedGenre = null;
    catalogPage.selectedLanguage = null;
    catalogPage.totalCards = [];
    catalogPage.totalButtons = [];
    catalogPage.liveHeader = '';
    storeRailData.current = {};
    storeRailData.leftMenuClicked = PAGE_NAME.HOME;
    storeRailData.leftMenuClickedWithDongle = PAGE_NAME.HOME;
  }, [] );

  useEffect( () => {
    if( window.location.pathname.includes( '/discover' ) ){
      searchPageData.searchPageNumber = null;
      searchPageData.mediaCardRestoreId = null;
      searchPageData.leftPanelOpen = null;
      searchPageData.searchedInputValue = null;
      searchPageData.isFilterOpen = null;
      searchPageData.searchAutoCompleteRes = null;
      searchPageData.searchMaxCount = null;
      searchPageData.showFilter = null;
      searchPageData.selectedGen = null;
      searchPageData.selectedLang = null;
      searchPageData.railTitle = null;
      searchPageData.scrollTop = null;
      selectedGenreItem.current = null;
      selectedLaungueItem.current = null;
      selectedGenrePosition.current = null;
      selectedLaunguePosition.current = null;
    }
  }, [window.location.pathname] );

  useEffect( () => {
    let interval;
    if( initiateTimer ){
      interval = setInterval( () => {
        if( showSeconds > 1 ){
          setShowSeconds( prevSeconds => prevSeconds - 1 );
        }
        else if( showSeconds <= 1 ){
          setShowSeconds( expiryTime * 60 );
        }
      }, 1000 );
    }
    else {
      setShowSeconds( expiryTime * 60 )
    }
    return () => clearInterval( interval );
  }, [showSeconds, initiateTimer, expiryTime] );

  useEffect( () => {
    if( !getAuthToken() ){
      selectedPackageCard.current = null
    }
  }, [getAuthToken()] )

  useEffect( () => {
    setIsLoginToggleState( isLoginToggle );
  }, [isLoginToggle] );

  useEffect( () => {
    setFromNewLoginState( fromNewLogin );
  }, [fromNewLogin] );

  const pageStateContextValue = useMemo( () => ( {
    topPositionRailValueContext,
    scrollLeftMenu,
    trackRecord,
    catalogPage,
    catalogPagePatner,
    railsRestoreId,
    piPageFocus,
    checkRecRailRef,
    donglePageData,
    catalogCardId,
    searchPageData,
    searchCardId,
    episodeCardId,
    availableProvidersList,
    railRestoreTitle,
    railCardTitle,
    seriesPage,
    episodePageData,
    genereDirection,
    genereRotationRef,
    screenSaverVisible,
    autoPlaytrailerScreenSaver,
    searchKeyBoardLastFocuskey,
    selectedGenreItem,
    selectedGenrePosition,
    selectedLaungueItem,
    selectedLaunguePosition,
    fromConfirmPurchase,
    homeDonglePageData,
    loginVerbiages,
    storeRailData,
    openActiveModalRef,
    playEventFromPopupRef,
    successFullPlanPurchasePubnub,
    bbaRailRestoreId,
    bbaContentListId,
    fromRenewPurchase,
    flexiPlanVerbiagesContext,
    isActivatedAppleButtonClicked,
    receivePubnubAfterScanning,
    currentPlan,
    primeManualBack,
    searchTotalData, setSearchTotalData,
    shuffleIndex, setshuffleIndex,
    lastRailTitle, setLastRailTitle,
    lastFocusFrom, setLastFocusFrom,
    totalrailsList, setTotalrailsList,
    liveContent, setLiveContent,
    playerAction, setPlayerAction,
    broadcastMode, setBroadcastMode,
    bbaSelectedItem, setBBASelectedItem,
    bbaContents, setBbaContents,
    fromSideMenuSubscribe,
    isActivePopUpOpen, setIsActivePopUpOpen,
    restoreActivePopupKey,
    hasPrimeCtaClicked,
    isDeviceRemoved, setIsDeviceRemoved,
    selectedPackageCard,
    isLoaderOnPrimeFetchDetails,
    selectedDevicesIdsList,
    layoutType, setLayoutType,
    isLoginToggle, setIsLoginToggle,
    isQrCodeJourney, setIsQrCodeJourney,
    QrLoginDetails, setQrLoginDetails,
    localQRData,
    QrError, setQrError,
    showSeconds, setShowSeconds,
    initiateTimer, setInitiateTimer,
    fromNewLogin, setFromNewLogin,
    cardSize, setCardSize,
    subCatalogPagesInfo, setSubCatalogPagesInfo,
    selectedpartnerId,
    optionBba, setOptionBba,
    isPubnubWrapper,
    isCWWatchingRailContentRef
  } ), [
    topPositionRailValueContext,
    scrollLeftMenu,
    trackRecord,
    catalogPage,
    catalogPagePatner,
    railsRestoreId,
    piPageFocus,
    checkRecRailRef,
    donglePageData,
    catalogCardId,
    searchPageData,
    searchCardId,
    episodeCardId,
    availableProvidersList,
    railRestoreTitle,
    railCardTitle,
    seriesPage,
    episodePageData,
    genereDirection,
    genereRotationRef,
    screenSaverVisible,
    autoPlaytrailerScreenSaver,
    searchKeyBoardLastFocuskey,
    selectedGenreItem,
    selectedGenrePosition,
    selectedLaungueItem,
    selectedLaunguePosition,
    fromConfirmPurchase,
    homeDonglePageData,
    loginVerbiages,
    storeRailData,
    openActiveModalRef,
    playEventFromPopupRef,
    successFullPlanPurchasePubnub,
    bbaRailRestoreId,
    bbaContentListId,
    fromRenewPurchase,
    flexiPlanVerbiagesContext,
    isActivatedAppleButtonClicked,
    receivePubnubAfterScanning,
    currentPlan,
    primeManualBack,
    searchTotalData,
    shuffleIndex,
    lastRailTitle,
    lastFocusFrom,
    totalrailsList,
    liveContent,
    playerAction,
    broadcastMode,
    bbaSelectedItem,
    bbaContents,
    fromSideMenuSubscribe,
    isActivePopUpOpen,
    restoreActivePopupKey,
    hasPrimeCtaClicked,
    isDeviceRemoved,
    selectedPackageCard,
    isLoaderOnPrimeFetchDetails,
    selectedDevicesIdsList,
    layoutType,
    isLoginToggle,
    isQrCodeJourney,
    QrLoginDetails,
    localQRData,
    QrError,
    showSeconds,
    initiateTimer,
    fromNewLogin,
    cardSize,
    subCatalogPagesInfo,
    selectedpartnerId,
    optionBba,
    isPubnubWrapper
  ] );



  return (
    <PageStateContext.Provider
      value={ pageStateContextValue }
    >
      { children }
    </PageStateContext.Provider>
  );
};

export default MaintainPageStateProvoder;

/**
 * Context provider for react reuse
 * @type object
 */
export const PageStateContext = createContext();

/**
 * context provider
 * @type object
 */
export const useMaintainPageState = () => useContext( PageStateContext );
