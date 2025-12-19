/* eslint-disable no-console */
/**
 * This component will provide the information about users subscription plan
 *
 * @module views/components/FlexiTenurePage
 * @memberof -Common
 */
import React, { useEffect, useRef, useState } from 'react';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import { UpgradeFlowStatus, UpgradeRechargeURL } from '../../../utils/slayer/MyPlanSetupService';
import { getOldStackSuccessfullPurchases, getOtherStackSuccessfullPurchasesStatus, getPubnubChannelName, handleDistroRedirection, showConfetti } from '../../../utils/util';
import { payment_success_continue_watching } from '../../../utils/mixpanel/mixpanelService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { getAllLoginPath, getBaID, getBingeListFlag, getCatalogFlag, getDthStatus, getLiveFlagLocal, getPiLevel, getSearchFlag, getSubscriberId, getUserInfo, setActivatePopUpModalFlag, setAllLoginPath, setPiLevel } from '../../../utils/localStorageHelper';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, PAGE_TYPE, PAYMENT_STATUS, USERS } from '../../../utils/constants';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { isDistroContent, isLiveContentType } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { getChannelPlayableStatus } from '../../../utils/commonHelper';
/**
    * Represents a FlexiTenurePage component
    *
    * @method
    * @param {object} props - React properties passed from composition
    * @returns FlexiTenurePage
    */
export const FlexiTenurePage = function( props ){
  const { planDetails } = props
  const { messages, onLogin } = usePubNubContext();
  const { setBaid, fetchPackList } = useSubscriptionContext();
  const previousPathName = useNavigationContext();
  const { selectedpartnerId } = useMaintainPageState() || null

  const [showQRcode, setShowQRcode] = useState( false );
  const [QRCodeDetails, setQRcodeDetails] = useState( {} );
  const [notification, setNotification] = useState( {} );
  const [modalPopup, setModalPopup] = useState( false );
  const [confetti, setConfetti] = useState( false )

  const modalRefQR = useRef();
  const buttonRef = useRef();
  const timerRef = useRef();
  const timerRef1 = useRef();
  const modalRef = useRef();
  const initializePayment = useRef( true );

  const [upgradeLowerPack] =  UpgradeFlowStatus()
  const { UpgradePack, UpgradePackResponse, UpgradePackError, UpgradePackLoading } = upgradeLowerPack
  const [QRCode] =  UpgradeRechargeURL()
  const { fetchQRCode, QRcodeResponse, QRCodeError, QRcodeLoading } = QRCode
  const { setCustomPageType, setDefaultPageType } = useHomeContext()
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const history = useHistory();
  const { metaData } = usePlayerContext();

  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack
  const { liveChannelIds, subscriptionStatus } = myPlanProps || {};
  const launchTime = get( config, 'addPackPollingPopup.launchTime', null );
  const periodicFrequency = get( config, 'addPackPollingPopup.periodicFrequency', null );

  useEffect( ()=>{
    if( planDetails?.productId ){
      fetchQRCode( {
        'baId': getBaID(),
        'dsn': getBaID(),
        'sid': getSubscriberId(),
        'flexiPlan': true,
        'changeTenure': true,
        'packId': planDetails.productId,
        ...( selectedpartnerId.current && {
          partnerId: selectedpartnerId.current,
          isContentDriven: true
        } )
      } );
    }
  }, [planDetails] )

  useEffect( ()=>{
    if( QRcodeResponse && QRcodeResponse.data ){
      let QRCodeDetails = {}
      if( QRcodeResponse.data.verbiage ){
        QRCodeDetails = {
          url: QRcodeResponse.data.thirdPartyQRUrl,
          size:'250',
          goBack:'Go Back',
          flexiCrown: QRcodeResponse.data.verbiage.crownImageIcon,
          flexiHeading: QRcodeResponse.data.verbiage.subscribeToFlexi,
          doneCta: QRcodeResponse.data.verbiage.doneCta,
          info: QRcodeResponse.data.verbiage.subscribeToFlexiDesc
        }
      }
      else {
        QRCodeDetails = {
          url: QRcodeResponse.data.thirdPartyQRUrl,
          size:'250',
          goBack:'Go Back',
          info:QRcodeResponse.data.thirdPartyQRMsg
        }
      }
      setTimeout( () => {
        openModalQR();
      }, 100 );
      setQRcodeDetails( QRCodeDetails )
      timerRef.current = setInterval( () => UpgradePack(), 5000 );
      timerRef1.current = setTimeout( () => errorMsg(), launchTime && periodicFrequency ? ( launchTime * periodicFrequency ) * 1000 : 300000 )
    }
  }, [QRcodeResponse] )

  useEffect( ()=>{
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && !initializePayment.current ){
      successMsg()
    }
  }, [UpgradePackResponse] )

  useEffect( () => {
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && initializePayment.current ){
      if( messages[getPubnubChannelName()]?.message || messages[getPubnubChannelName()]?.paymentStatus ){
        const pubnubPush = messages[getPubnubChannelName()].message || messages[getPubnubChannelName()]
        console.log( pubnubPush, 'PUBSUB99->UpgradePackResponse', messages[getPubnubChannelName()].message, messages[getPubnubChannelName()].paymentStatus )

        if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
          const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
          if( oldStackSuccessfullPurchase && myPlanProps?.productId && oldStackSuccessfullPurchase !== myPlanProps?.productId ){
            console.log( 'PUBSUB99->UpgradePackResponse=>PackUPDATE' )
            initializePayment.current = false
            UpgradePack();
          }
        }
        else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
          const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
          if( otherStackSuccessfullPurchaseStatus === PAYMENT_STATUS.SUCCESS ){
            console.log( 'PUBSUB99->UpgradePackResponse=>PackUPDATE' )
            initializePayment.current = false
            UpgradePack();
          }
        }
      }
    }
    else if( UpgradePackError ){
      errorMsg( UpgradePackError.message )
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current )
    }
  }, [UpgradePackResponse, UpgradePackError, messages[getPubnubChannelName()]?.message] )

  const openModalQR = () => {
    setShowQRcode( true )
    if( modalRefQR.current && !modalRefQR.current.open ){
      modalRefQR.current.showModal();
    }
  };

  const hideModalQR = () => {
    setFocus( `TENURE_${previousPathName.selectedtenure}` )
    clearInterval( timerRef.current )
    setShowQRcode( false )
    modalRefQR?.current?.close();
    props.closeFlexiQRPopup?.();
  };

  const successMsg = () => {
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
    const response =  QRcodeResponse && QRcodeResponse.data
    const responseToShow =  UpgradePackResponse && UpgradePackResponse.data // openfs paymentstatus API response
    const notification = {
      iconName: 'Success',
      message:  responseToShow?.header || response?.thirdPartyUpdradeHeader,
      info:  responseToShow?.message || response?.thirdPartyUpdradeMsg,
      additionalInfo: responseToShow?.footer,
      buttonLabel: 'Done',
      secondaryTitle: responseToShow?.secondaryTitle || ''
    }
    setNotification( notification )
    setModalPopup( true )
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )
    hideModalQR();
    setTimeout( () => {
      setConfetti( true )
      openModal();
    }, 500 );
    isSuccessfullPurchase();
  }

  const isSuccessfullPurchase = () => {
    setBaid( 0 )
    setTimeout( () => {
      setBaid( getBaID() )
    }, 0 );
  }

  const errorMsg = ( msg ) => {
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )
    const notification = {
      iconName: 'AlertRed',
      message:   msg ? msg : constants.message,
      info:  'Please try again',
      buttonLabel: 'Done',
      backButton: 'To Close',
      backIcon: 'GoBack'
    }
    setNotification( notification )
    setModalPopup( true )
    hideModalQR();
    setTimeout( () => {
      openModal( );
    }, 500 );
  }

  const openModal = ( ) => {
    setTimeout( () => {
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
    }, 500 );
  };

  const hideModal = () => {
    modalRef.current?.close();
    props.closeFlexiQRPopup?.();
  };

  const handleCancelPopup = () =>{

    const response = UpgradePackResponse && UpgradePackResponse.data

    if( response?.paymentStatus === 'SUCCESS' || UpgradePackResponse?.code === 0 ){
      setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
      setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
      previousPathName.focusedItem = null
      previousPathName.subscriptionPath = null
      previousPathName.selectedPlanCard = null
      previousPathName.selectedtenure = null
      previousPathName.selectedPlanType = null
      previousPathName.current = null
      previousPathName.pageName = 'plan/current'
      if( ( isLiveContentType( metaData?.contentType ) || isDistroContent( metaData?.provider ) ) && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, metaData?.channelId ) ){
        const args = {
          id: metaData?.channelId,
          type: metaData?.contentType,
          provider : metaData?.provider
        }
        handleDistroRedirection( history, args )
      }
      else if( previousPathName.navigationRouting?.includes( PAGE_TYPE.CONTENT_DETAIL ) ){
        const indexRouter = getAllLoginPath().length
        history.go( -indexRouter )
        const piLevelClear = getPiLevel()
        piLevelClear > 0 && setPiLevel( piLevelClear - 1 )
      }
      else if( previousPathName.navigationRouting?.includes( PAGE_TYPE.SERIES_DETAIL ) ){
        const indexRouter = getAllLoginPath().length
        history.go( -indexRouter )
      }
      else if( Boolean( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' || getLiveFlagLocal() === 'true' ) && Boolean( previousPathName.navigationRouting.includes( PAGE_TYPE.SEARCH ) || previousPathName.navigationRouting.includes( PAGE_TYPE.BROSWSE_BY ) || previousPathName.navigationRouting.includes( PAGE_TYPE.BINGE_LIST ) ) ){
        const indexRouter = getAllLoginPath().length
        history.go( -indexRouter )
        const piLevelClear = getPiLevel()
        piLevelClear > 0 && setPiLevel( piLevelClear - 1 )
      }
      else {
        notification.iconName === 'Success' && setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
        history.push( '/discover' )
      }
      previousPathName.navigationRouting = null
      if( !( isLiveContentType( metaData?.contentType ) || isDistroContent( metaData?.provider ) ) ){
        setAllLoginPath( [] )
      }
      payment_success_continue_watching()
      onLogin( false )
      fetchPackList( {
        'baId': getBaID(),
        'dthStatus': getDthStatus(),
        'accountId': getSubscriberId()
      } )
    }

    setModalPopup( false )
    hideModal();
    notification.iconName !== 'Success' && setFocus( `TENURE_${previousPathName.selectedtenure}` )
  }

  useEffect( ()=>{
    return () => {
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current );
      props.closeFlexiQRPopup?.();
    }
  }, [] )

  const onConfettiComplete = () => {
    setConfetti( false )
  }

  return (
    <div>
      { showQRcode &&
      <QrCodePopUp
        modalRef={ modalRefQR }
        handleCancel={ hideModalQR }
        opener={ buttonRef }
        { ...QRCodeDetails }
        showQRcode={ showQRcode }
        focusShouldRetain={ 100 }
      /> }
      { modalPopup &&
      <NotificationsPopUp
        modalRef={ modalRef }
        handleCancel={ () => handleCancelPopup() }
        opener={ buttonRef }
        buttonClicked={ () => {
          handleCancelPopup()
        } }
        { ...notification }
        focusKeyRefrence={ 'DONE_BUTTON' }
        showModalPopup={ modalPopup }
        showConfetti={ confetti }
        onConfettiComplete={ onConfettiComplete }
        focusShouldRetain={ 300 }
      /> }
    </div>
  )
}

export default FlexiTenurePage;
