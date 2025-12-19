import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PrimeAccountRecoveryService, PrimeFetchRecoveryService } from '../../../utils/slayer/AmazonPrimeService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Loader from '../Loader/Loader';
import constants, { NOTIFICATION_RESPONSE, PRIME, PROVIDER_LIST } from '../../../utils/constants';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import LaunchProviderPopup from '../LaunchProviderPopup/LaunchProviderPopup';
import './PrimeJourneyModals.scss';
import { handleErrorMessage, keyCodeForBackFunctionality } from '../../../utils/util';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import { primeRedirectionPopupForgotAccount, primeRedirectionPopupForgotAccountFail, primeRedirectionPopupForgotAccountRetry } from '../../../utils/mixpanel/mixpanelService';


const PrimeJourneyModals = ( props ) => {

  const { primeRedirectionPopup, setPrimeRedirectionPopup, providerContentId, partnerDeepLinkUrl, tagID, parentalPinStatus, restorefocusKey } = props
  const [showforgotAccountPopup, setShowforgotAccountPopup] = useState( false )
  const [pollingAPILoader, setPollingAPILoader] = useState( false );
  const [launchProviderPopupToTrue, setLaunchProviderPopupToTrue] = useState( false );
  const [showQR, setShowQR] = useState( false )
  const [showErrorPopup, setShowErrorPopup] = useState( false )

  const forgotAccountPopupRef = useRef();
  const timerRef = useRef( null );
  const pollingAPIFrequencyCountRef = useRef( 0 )
  const accountRetrivalPopupCountRef = useRef( 0 )
  const launchProviderRef = useRef();
  const modalRefQR = useRef()
  const showErrorPopupRef = useRef()
  const isAccountRecoveyAPIFailed = useRef( false )
  const keyBackLaunchCountRef = useRef( 0 )
  const pollingAPILoaderRef = useRef( false )

  const { flexiPlanVerbiagesContext, isLoaderOnPrimeFetchDetails, isDeviceRemoved } = useMaintainPageState() || null

  const responseSubscription = useSubscriptionContext()
  const myPlanProps = responseSubscription?.responseData.currentPack

  const [primeAccountRecovery] = PrimeAccountRecoveryService();
  const { primeAccountRecoveryFetchData, primeAccountRecoveryResponse, primeAccountRecoveryError, primeAccountRecoveryLoading } = primeAccountRecovery;

  const [primeFetchRecovery] = PrimeFetchRecoveryService()
  const { primeFetchRecoveryFetchData, primeFetchRecoveryResponse, primeFetchRecoveryError, primeFetchRecoveryLoading } = primeFetchRecovery;

  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const amazonAccountRecoveryVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )

  const { ref } = useFocusable( {
    isFocusBoundary: true
  } );

  const showQrCodePopup = ()=>{
    if( isDeviceRemoved ){
      return
    }
    setShowQR( true )
    setTimeout( () => {
      modalRefQR.current?.showModal();
    }, 100 );
  }

  const hideQrCodepopup = ()=>{
    setShowQR( false )
    modalRefQR.current?.close();
    showLaunchProviderModal()
  }

  const showLoaderScreen = ()=>{
    setPollingAPILoader( true )
    setTimeout( ()=>{
      pollingAPILoaderRef?.current?.showModal();
    }, 100 )
  }

  const hideLoaderScreen = ()=>{
    setPollingAPILoader( false )
    pollingAPILoaderRef?.current?.close();
  }

  const hideLaunchProviderModal = ( isFromRetryPopup ) => {
    setPrimeRedirectionPopup( null )
    setLaunchProviderPopupToTrue( false )
    launchProviderRef?.current?.close();
    if( isFromRetryPopup ){
      restorefocusKey ? setTimeout( ()=> setFocus( restorefocusKey ), 100 ) : setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
    }
  };

  const showLaunchProviderModal = () => {
    setLaunchProviderPopupToTrue( true )
    setTimeout( () => {
      launchProviderRef?.current?.showModal();
    }, 100 );
    accountRetrivalPopupCountRef.current = 0
    pollingAPIFrequencyCountRef.current = 0
    keyBackLaunchCountRef.current = 0
  };

  const handleForgotAccount = () =>{
    primeAccountRecoveryFetchData( { primaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
    /* Mix Panel Event */
    primeRedirectionPopupForgotAccount( responseSubscription )
  }

  const openForgotAccountRetryPopup = ( isRetryPopUp ) => {
    hideLaunchProviderModal( false )
    if( isDeviceRemoved ){
      return
    }
    if( isRetryPopUp ){
      setShowforgotAccountPopup( true )
      setTimeout( ()=>{
        forgotAccountPopupRef?.current?.showModal();
      }, 100 )
      accountRetrivalPopupCountRef.current += 1
      /* Mix Panel Event */
      primeRedirectionPopupForgotAccountFail( responseSubscription )
    }
    else {
      setShowErrorPopup( true )
      setTimeout( ()=>{
        showErrorPopupRef?.current?.showModal();
      }, 100 )
    }
    setTimeout( ()=> setFocus( 'DONE_BUTTON' ), 100 )
  }

  const hideForgotAccountPopup = ( cancelButtonText ) => {
    setShowforgotAccountPopup( false )
    setShowErrorPopup( false )
    forgotAccountPopupRef?.current?.close()
    showErrorPopupRef?.current?.close()
    if( cancelButtonText === constants.RETRY_CTA_BUTTON_CLICK && accountRetrivalPopupCountRef.current <= 3 ){
      if( isAccountRecoveyAPIFailed.current ){
        primeAccountRecoveryFetchData( { primaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
        isAccountRecoveyAPIFailed.current = false
      }
      else {
        timerRef.current = setInterval( () => {
          pollingAPIFrequencyCountRef.current += 1
          primeFetchRecoveryFetchData( { primaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
        }, Number( config?.primeVerbiages?.primeFetchRecoveryPolling?.periodicFrequency ) || 5000 );
      }
      showLoaderScreen()
      /* Mix Panel Event */
      primeRedirectionPopupForgotAccountRetry( responseSubscription )
    }
    else if( cancelButtonText === constants.DONE || cancelButtonText === constants.RETRY_CTA_CANCEL ){
      showLaunchProviderModal()
    }
  }

  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( keyCodeForBackFunctionality( keyCode ) && isLoaderOnPrimeFetchDetails.current && keyBackLaunchCountRef.current === 0 ){
      clearInterval( timerRef.current )
      hideLoaderScreen()
      showLaunchProviderModal()
    }
    else if( keyCodeForBackFunctionality( keyCode ) ){
      keyBackLaunchCountRef.current ++
    }
  }, [] )

  const renderAccountPopupModal = () =>{
    if( accountRetrivalPopupCountRef.current === 3 ){
      setTimeout( ()=> showLaunchProviderModal(), 100 )
    }
    else {
      openForgotAccountRetryPopup( true )
    }
  }

  useEffect( ()=>{
    if( primeRedirectionPopup ){
      showLaunchProviderModal()
    }
  }, [primeRedirectionPopup] )

  useEffect( () =>{ // account Recovery API
    if( primeAccountRecoveryResponse && primeAccountRecoveryResponse.code === 0 ){
      clearInterval( timerRef.current )
      timerRef.current = setInterval( () => {
        pollingAPIFrequencyCountRef.current += 1
        primeFetchRecoveryFetchData( { primaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
      }, Number( config?.primeVerbiages?.primeFetchRecoveryPolling?.periodicFrequency ) || 5000 );
      showLoaderScreen()
      hideLaunchProviderModal( false )
    }
    else if( primeAccountRecoveryResponse && primeAccountRecoveryResponse.code !== 0 ){
      renderAccountPopupModal()
      isAccountRecoveyAPIFailed.current = true
    }
    else if( primeAccountRecoveryError ){
      openForgotAccountRetryPopup( false )
      clearInterval( timerRef.current )
    }
  }, [primeAccountRecoveryResponse, primeAccountRecoveryError] )

  useEffect( () =>{ // polling Fetch Recovery API
    if( primeFetchRecoveryResponse && primeFetchRecoveryResponse.code === 0 && primeFetchRecoveryResponse.data && primeFetchRecoveryResponse.data.recovery_url ){
      clearInterval( timerRef.current )
      hideLoaderScreen()
      hideLaunchProviderModal( false )
      showQrCodePopup()
    }
    else if( primeFetchRecoveryResponse && primeFetchRecoveryResponse.code === 0 && pollingAPIFrequencyCountRef.current === Number( config?.primeVerbiages?.primeFetchRecoveryPolling?.maxAttempt ) ){
      clearInterval( timerRef.current )
      hideLoaderScreen()
      pollingAPIFrequencyCountRef.current = 0
      renderAccountPopupModal()
    }
    else if( primeFetchRecoveryResponse && primeFetchRecoveryResponse.code !== 0 ){
      clearInterval( timerRef.current )
      hideLoaderScreen()
      renderAccountPopupModal()
    }
    else if( primeFetchRecoveryError ){
      openForgotAccountRetryPopup( false )
      clearInterval( timerRef.current )
      hideLoaderScreen()
    }
  }, [primeFetchRecoveryResponse, primeFetchRecoveryError] )

  useEffect( ()=>{
    if( pollingAPILoader ){
      setFocus( 'LOADER' )
      isLoaderOnPrimeFetchDetails.current = true
    }
    else {
      isLoaderOnPrimeFetchDetails.current = false
    }
  }, [pollingAPILoader] )

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  return (
    <div ref={ ref }>
      {
        launchProviderPopupToTrue &&
        <LaunchProviderPopup
          provider={ PROVIDER_LIST.PRIME }
          displayModal={ true }
          modalRef={ launchProviderRef }
          appLaunch={ true }
          parentalPinStatus={ parentalPinStatus }
          handleCancel={ ()=> hideLaunchProviderModal( true ) }
          providerName={ PROVIDER_LIST.PRIME }
          tagID={ tagID }
          contentId={ providerContentId }
          partnerDeepLinkUrl={ partnerDeepLinkUrl }
          handleForgotAccount={ handleForgotAccount }
        />
      }
      { showforgotAccountPopup &&
      <NotificationsPopUp
        opener={ forgotAccountPopupRef }
        modalRef={ forgotAccountPopupRef }
        handleCancel={ ()=>hideForgotAccountPopup( constants.RETRY_CTA_CANCEL ) }
        iconName={ NOTIFICATION_RESPONSE.alertIcon }
        flexiPlanHeaderMessage={ amazonAccountRecoveryVerbiages?.lsAccountRecoveryFailurePopup?.title }
        info={ handleErrorMessage( null, null, amazonAccountRecoveryVerbiages?.lsAccountRecoveryFailurePopup?.subTitle ) }
        buttonLabel={ amazonAccountRecoveryVerbiages?.lsAccountRecoveryFailurePopup?.primaryCTA }
        backButton={ constants.TOCLOSE }
        backIcon={ false }
        buttonClicked={ () => hideForgotAccountPopup( constants.RETRY_CTA_BUTTON_CLICK ) }
        focusShouldRetain={ 10 }
      /> }
      { showErrorPopup &&
      <NotificationsPopUp
        opener={ showErrorPopupRef }
        modalRef={ showErrorPopupRef }
        handleCancel={ ()=>hideForgotAccountPopup( constants.DONE ) }
        info={ handleErrorMessage( primeFetchRecoveryError || primeAccountRecoveryError, null, constants.ERROR_MSG ) }
        iconName={ NOTIFICATION_RESPONSE.iconName }
        message={ NOTIFICATION_RESPONSE.message }
        buttonLabel={ constants.DONE }
        backButton={ constants.TOCLOSE }
        backIcon={ constants.BACK_TEXT }
        buttonClicked={ () => hideForgotAccountPopup( constants.DONE ) }
        focusShouldRetain={ 10 }
      /> }
      { pollingAPILoader &&
      <NotificationsPopUp
        opener={ pollingAPILoaderRef }
        modalRef={ pollingAPILoaderRef }
        showLoader={ true }
        customClassName={ 'showLoaderOnPrimePage' }
        focusShouldRetain={ 0 }
      />
      }
      { showQR &&
      <QrCodePopUp
        modalRef={ modalRefQR }
        handleCancel={ () => hideQrCodepopup( ) }
        url={ primeFetchRecoveryResponse?.data?.recovery_url }
        primeInfo={ amazonAccountRecoveryVerbiages?.lsPrimeSubscriptionScanQrCodeVerbiage || PRIME.QRCODE_HEADER }
        primeAdditionalInfo={ amazonAccountRecoveryVerbiages?.lsPrimeSubscriptionClickBackVerbiage || PRIME.QRCODE_SUB_HEADER }
        doneCta={ constants.OK }
        showQRcode={ true }
        goBack={ constants.GOBACK }
        size={ 250 }
        customClassName={ 'QrCodePrimePopUpModal' }
      />
      }
    </div>
  )
}

export default PrimeJourneyModals