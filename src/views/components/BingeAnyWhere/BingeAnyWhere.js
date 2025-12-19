/* eslint-disable no-console */
/**
 * This component will provide the information about users subscription plan
 *
 * @module views/components/BingeAnyWhere
 * @memberof -Common
 */
import React, { useEffect, useRef, useState } from 'react';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import { MyPlanSetupService, UpgradeFlowStatus, UpgradeRechargeURL } from '../../../utils/slayer/MyPlanSetupService';
import { getOldStackSuccessfullPurchases, getPubnubChannelName, showConfetti } from '../../../utils/util';
import { payment_success_continue_watching } from '../../../utils/mixpanel/mixpanelService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { getBaID, getDthStatus, getSubscriberId, setActivatePopUpModalFlag } from '../../../utils/localStorageHelper';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY } from '../../../utils/constants';
/**
    * Represents a BingeAnyWhere component
    *
    * @method
    * @param {object} props - React properties passed from composition
    * @returns BingeAnyWhere
    */
export const BingeAnyWhere = function( props ){
  const { messages, onLogin } = usePubNubContext();
  const { setBaid, fetchPackList } = useSubscriptionContext();
  const responseSubscription = useSubscriptionContext();
  const previousPathName = useNavigationContext();

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
  const successPayment = useRef( null );
  const pubnubPush = useRef( true );

  const [upgradeLowerPack] =  UpgradeFlowStatus()
  const { UpgradePack, UpgradePackResponse, UpgradePackError, UpgradePackLoading } = upgradeLowerPack
  const [QRCode] =  UpgradeRechargeURL()
  const { fetchQRCode, QRcodeResponse, QRCodeError, QRcodeLoading } = QRCode
  const [currentPlan] = MyPlanSetupService( true )
  const { fetchData: fetchCurrentPlan, response: currentResponse, error: currentError, loading: currentLoading } = currentPlan || {}

  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const history = useHistory();

  const launchTime = get( config, 'addPackPollingPopup.launchTime', null );
  const periodicFrequency = get( config, 'addPackPollingPopup.periodicFrequency', null );
  const myPlanProps = responseSubscription?.responseData.currentPack

  useEffect( ()=>{
    hideModalQR();
    fetchQRCode();
  }, [] )

  useEffect( ()=>{
    if( QRcodeResponse && QRcodeResponse.data ){
      setTimeout( () => {
        openModalQR();
      }, 10 );
      const QRCodeDetails = {
        url: QRcodeResponse.data.thirdPartyQRUrl,
        size: '136',
        goBack: 'Go Back',
        info: QRcodeResponse.data.thirdPartyQRMsg

      }
      setQRcodeDetails( QRCodeDetails )
      timerRef.current = setInterval( () => UpgradePack(), 5000 );
      timerRef1.current = setTimeout( () => errorMsg(), launchTime && periodicFrequency ? ( launchTime * periodicFrequency ) * 1000 : 300000 )
    }
    return () => clearInterval( timerRef.current );
  }, [QRcodeResponse] )

  useEffect( ()=>{
    if( currentResponse && currentResponse.data && pubnubPush.current ){
      pubnubPush.current = false
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current )
      UpgradePack()
    }
  }, [currentResponse] )

  useEffect( ()=>{
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && !pubnubPush.current ){
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current )
      successMsg()
    }
  }, [UpgradePackResponse] )

  useEffect( () => {
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && pubnubPush.current ){
      if( UpgradePackResponse.code === 0 ){
        if( messages[getPubnubChannelName()]?.message ){
          const pubnubPush = messages[getPubnubChannelName()].message
          const userInfo = getOldStackSuccessfullPurchases( pubnubPush )
          if( userInfo && userInfo !== myPlanProps.productId ){
            successPayment.current = true
            fetchCurrentPlan( {
              'baId': getBaID(),
              'dthStatus': getDthStatus(),
              'accountId': getSubscriberId()
            } )
          }
          if( UpgradePackResponse.data?.paymentStatus === 'FAILED' ){
            successPayment.current = false
            failureMsg()
          }
        }
      }
      else {
        successPayment.current = false
        errorMsg( UpgradePackResponse.message )
      }
    }
    if( UpgradePackError ){
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
    setFocus( `SELECT_${previousPathName.selectedPlanType}` )
    clearInterval( timerRef.current )
    setShowQRcode( false )
    modalRefQR?.current?.close();
  };

  const successMsg = () => {
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
    const response =  QRcodeResponse && QRcodeResponse.data
    const responseToShow =  UpgradePackResponse && UpgradePackResponse.data
    const notification = {
      iconName: 'Success',
      message:  responseToShow?.header || response?.thirdPartyUpdradeHeader,
      info:  responseToShow?.message || response?.thirdPartyUpdradeMsg,
      buttonLabel: 'Done'
    }
    setNotification( notification )
    setModalPopup( true )
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )
    hideModalQR();
    openModal( !currentResponse.data.fdoRequested );
  }

  const failureMsg = ( ) => {
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )
    const notification = {
      iconName: 'AlertRed',
      message:   UpgradePackError?.message ? UpgradePackError?.message : constants.message,
      buttonLabel: 'Done',
      info: 'Please Try Again'
    }
    setNotification( notification )
    setModalPopup( true )
    hideModalQR();
    openModal( false );
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
    openModal( false );
  }

  const openModal = ( condition ) => {
    setTimeout( () => {
      setFocus( 'DONE_BUTTON' )
      setConfetti( condition )
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
    }, 500 );
  };

  const hideModal = () => {
    modalRef.current?.close();
  };

  const fetchPacks = () => {
    fetchPackList( {
      'baId': getBaID() ? getBaID() : null,
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }

  const handleCancelPopup = () =>{
    const response = UpgradePackResponse && UpgradePackResponse.data
    const pubnubPush = messages[getPubnubChannelName()].message
    const userInfo = getOldStackSuccessfullPurchases( pubnubPush )
    if( response?.paymentStatus === 'SUCCESS' || ( userInfo && userInfo !== myPlanProps.productId ) || successPayment.current ){
      previousPathName.subscriptionPath = null
      onLogin( false )
      setBaid( 0 )
      setTimeout( () => {
        setBaid( getBaID() )
      }, 0 );
      payment_success_continue_watching()
      history.push( '/discover' )
      setConfetti( false )
      setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
    }
    setModalPopup( false )
    hideModal();
    setFocus( `SELECT_${previousPathName.selectedPlanType}` )
    fetchPacks()
  }

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
      /> }
      { modalPopup &&
      <NotificationsPopUp
        modalRef={ modalRef }
        handleCancel={ () => handleCancelPopup() }
        opener={ buttonRef }
        showConfetti={ confetti }
        onConfettiComplete={ onConfettiComplete }
        buttonClicked={ () => {
          handleCancelPopup()
        } }
        { ...notification }
        focusKeyRefrence={ 'DONE_BUTTON' }
        showModalPopup={ modalPopup }
      /> }
    </div>
  )
}

export default BingeAnyWhere;
