/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react'
import ApplePopup from '../ApplePopup/ApplePopup';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import ActivateApplePopup from '../ActivateApplePopup/ActivateApplePopup';
import { setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { AppleCode } from '../../../utils/slayer/PlaybackInfoService';
import AppleKnowledgeVideoPopup from '../AppleKnowledgeVideoPopup/AppleKnowledgeVideoPopup';
import UpgradePlanPopup from '../UpgradePlanPopup/UpgradePlanPopup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { activateAppleTvSubscriptionClick, helpClicked } from '../../../utils/mixpanel/mixpanelService';
import constants, { APPLETV, PAGE_NAME } from '../../../utils/constants';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { handleRedirectionParentalPinSetup, redirection } from '../../../utils/util';
import { getAgeRating } from '../../../utils/localStorageHelper';

const AppleJourneyModals = ( props ) => {

  const { appleButtonClick, setAppleButtonClick, focusKeyRefrence, parentalPinFetchData, currentPlan, metaData, responseSubscription, setIsFocusOnEpisode } = props

  const [showApplePopup, setShowApplePopup] = useState( false ); // play button popup flag
  const [showActiveApplePopup, setshowActiveApplePopup] = useState( false ); // activate apple tv+ popup flag
  const [showAppleKnowledgeVideoPopup, setShowAppleKnowledgeVideoPopup] = useState( false ); // know more apple info video popup flag
  const [showUpgradePopup, setShowUpgradePopup] = useState( false ); // apple upgarde journey popup flag

  const activateAppleRef = useRef( null ); // active apple tv+ button model ref
  const modalAppleRef = useRef( null ); // play button apple popUp model ref
  const QRCodeDetails = useRef( null ); // used this flag for qr response
  const openAppleKnowledgeModalRef = useRef( false ); // used this flag for back naviagtion model sequence active appleTv+ button
  const appleKnowledgeVideoRef = useRef( null ); // Knowledge video pop up model ref
  const upgradePlanRef = useRef( null ); // upgrade user popupRef for apple provider

  const openActiveModalRef = useRef( false ); // used this flag for back naviagtion model sequence for play button

  const { configResponse, url } = useAppContext();
  const { config } = configResponse;

  const myPlanProps = responseSubscription?.responseData.currentPack

  const playButtonPopupInfo = config?.appleTVRedemptionDetails.filter( item => item.category === APPLETV.WATCH_APPLE_TV_NOW )
  const goldenButtonPopupInfo = config?.appleTVRedemptionDetails.filter( item => item.category === APPLETV.APPLE_ACTIVATION_POPUP_NEW )
  const knowMoreButtonPopupInfo = config?.appleTVRedemptionDetails.filter( item => item.category === APPLETV.WATCH_APPLE_TV_VIDEO )
  const upGradeButtonPopupInfo = config?.appleTVRedemptionDetails.filter( item => item.category === APPLETV.APPLE_UPGRADE_POPUP )

  const history = useHistory();
  const previousPathName = useNavigationContext()

  const { playEventFromPopupRef, episodePageData, selectedPackageCard } = useMaintainPageState() || null
  const { profileAPIResult } = useProfileContext()

  const [appleCodeRedemption] = AppleCode( true );
  const { appleFetchData, appleRedemptionResponse, appleError, appleRedemptionLoading } = appleCodeRedemption;

  let autoPlay = true;
  if( profileAPIResult && profileAPIResult.data?.autoPlayTrailer === false ){
    autoPlay = false;
  }


  useEffect( ()=>{
    if( appleRedemptionResponse && appleRedemptionResponse.data ){
      QRCodeDetails.current = appleRedemptionResponse.data?.redemption_url
      openModal2QR()
    }

  }, [appleRedemptionLoading] )

  useEffect( () => {
    if( appleButtonClick === APPLETV.PLAYBUTTON ){
      setShowApplePopup( true )
      setTimeout( ()=>{
        modalAppleRef.current?.showModal();
      }, 100 )
    }
    else if( appleButtonClick === APPLETV.ACTIVEPLUS ){
      handleActiveApplePlusFn( false )
    }
    else if( appleButtonClick === APPLETV.UPGRADEBUTTON ){
      setShowUpgradePopup( true )
      setTimeout( ()=>{
        upgradePlanRef.current?.showModal();
      }, 100 )
    }

  }, [appleButtonClick] )


  const openModal2QR = () => {
    setTimeout( () => {
      setshowActiveApplePopup( true )
      activateAppleRef.current?.showModal();
    }, 100 );
  };

  const callBackToActiveModal = () => {
    setShowApplePopup( false )
    modalAppleRef.current?.close()
    openActiveModalRef.current = true
    setFocus( 'BUTTON_PRIMARY_1' )
    handleActiveApplePlusFn( true )
  }

  const callBackForDeepLinkModal = ()=>{
    setShowApplePopup( false )
    modalAppleRef.current?.close()
    playEventFromPopupRef.current = true
    setTimeout( () => {
      parentalPinFetchData()
    }, 100 );
  }

  const handleActiveApplePlusFn = ( openFromPopup ) => {
    if( QRCodeDetails.current === null ){
      appleFetchData()
    }
    else {
      setTimeout( () => {
        setshowActiveApplePopup( true )
        activateAppleRef.current?.showModal();
      }, 100 );
    }
    /* Mixpanel-event */
    activateAppleTvSubscriptionClick( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, openFromPopup, autoPlay );
  };

  const hideAppleModal = () => {
    setAppleButtonClick( null )
    setIsFocusOnEpisode( false )
    setShowApplePopup( false )
    modalAppleRef.current?.close()
    if( focusKeyRefrence ){
      setTimeout( ()=> setFocus( focusKeyRefrence ), 100 )
    }
    else {
      setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
    }
  }

  const hideActivateAppleModal = () => {
    setAppleButtonClick( null )
    setIsFocusOnEpisode( false )
    setshowActiveApplePopup( false )
    activateAppleRef.current?.close()
    if( openActiveModalRef.current ){
      setShowApplePopup( true )
      setTimeout( ()=>{
        modalAppleRef.current?.showModal();
        openActiveModalRef.current = false
      }, 100 )
    }
    else {
      !!focusKeyRefrence === false ? setTimeout( ()=> setFocus( 'BUTTON_APPLETV' ), 100 ) : setTimeout( ()=> setFocus( focusKeyRefrence ), 100 )
    }
  }

  const callBackForKnowledgeModal = () => {
    setshowActiveApplePopup( false )
    activateAppleRef.current?.close()
    openAppleKnowledgeModalRef.current = true
    setShowAppleKnowledgeVideoPopup( true )
    setTimeout( ()=>{
      appleKnowledgeVideoRef.current?.showModal();
    }, 100 )
    /* Mixpanel-event */
    helpClicked( PAGE_NAME.CONTENT_DETAIL )
  }

  const hideAppleKnowledgeVideoModal = () => {
    setShowAppleKnowledgeVideoPopup( false )
    appleKnowledgeVideoRef.current?.close()
    if( openAppleKnowledgeModalRef.current ){
      setTimeout( ()=>{
        setshowActiveApplePopup( true )
        activateAppleRef.current?.showModal();
        openAppleKnowledgeModalRef.current = false
      }, 100 )
    }
    else {
      setTimeout( ()=> setFocus( 'BUTTON_APPLETV' ), 100 )
    }
  }

  const hideUpgradeModal = () => {
    setAppleButtonClick( null )
    setShowUpgradePopup( false )
    episodePageData.mediaCardRestoreId = null
    episodePageData.selectedSeason = null
    episodePageData.showKeyboard = null
    episodePageData.seriesInputValue = null
    episodePageData.episodePageNumber = null
    upgradePlanRef.current?.close()
    if( focusKeyRefrence ){
      setTimeout( ()=> setFocus( focusKeyRefrence ), 100 )
    }
    else {
      setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
      setIsFocusOnEpisode( false )
    }
  }

  const handleUpgradePlan = () => {
    selectedPackageCard.current = currentPlan
    previousPathName.current = window.location.pathname
    previousPathName.navigationRouting = window.location.pathname
    if( getAgeRating() && getAgeRating() !== constants.NO_RESTRICTION ){
      handleRedirectionParentalPinSetup( history, { subscriptionSuccess: true } )
    }
    else {
      history.push( redirection( myPlanProps ) )
    }
  }


  return (
    <>
      { showApplePopup &&
        <ApplePopup
          modalRef={ modalAppleRef }
          handleCancel={ () => hideAppleModal( ) }
          appleCodeRedemptionUrl={ QRCodeDetails.current }
          callBackToActiveModal={ callBackToActiveModal }
          callBackForDeepLinkModal={ callBackForDeepLinkModal }
          configInfo={ playButtonPopupInfo[0] }
        />
      }
      { showActiveApplePopup &&
      <ActivateApplePopup
        modalRef={ activateAppleRef }
        handleCancel={ () => hideActivateAppleModal( ) }
        callBackForKnowledgeModal={ callBackForKnowledgeModal }
        appleCodeRedemptionUrl={ QRCodeDetails.current }
        configInfo={ goldenButtonPopupInfo[0] }
        knowMoreVideoLink={ knowMoreButtonPopupInfo[0]?.others?.videoUrl }
      /> }
      { showAppleKnowledgeVideoPopup &&
      <AppleKnowledgeVideoPopup
        modalRef={ appleKnowledgeVideoRef }
        handleCancel={ () => hideAppleKnowledgeVideoModal( ) }
        configInfo={ knowMoreButtonPopupInfo[0] }
      /> }
      { showUpgradePopup &&
      <UpgradePlanPopup
        modalRef={ upgradePlanRef }
        handleCancel={ () => hideUpgradeModal( ) }
        handleUpgradePlan={ handleUpgradePlan }
        configInfo={ upGradeButtonPopupInfo[0] }
        metaData={ metaData }
      />
      }
    </>

  )
}

export default AppleJourneyModals