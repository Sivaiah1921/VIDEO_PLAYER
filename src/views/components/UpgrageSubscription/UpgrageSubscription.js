/**
 * Upgrage Subscription
 *
 * @module views/components/UpgrageSubscription
 * @memberof -Common
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './UpgrageSubscription.scss';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, PAGE_TYPE, USERS } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import { UpgradeFlowStatus, UpgradeRechargeURL } from '../../../utils/slayer/MyPlanSetupService';
import { useHistory } from 'react-router-dom';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { getOldStackSuccessfullPurchases, getOtherStackSuccessfullPurchasesStatus, getPubnubChannelName } from '../../../utils/util';
import { getAllLoginPath, getBaID, getBingeListFlag, getCatalogFlag, getDthStatus, getPiLevel, getSearchFlag, getSubscriberId, removelowerPlan, setAllLoginPath, setPiLevel, setActivatePopUpModalFlag } from '../../../utils/localStorageHelper';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { payment_success_continue_watching, upgradePopup, upgradePopupCancel, upgradePopupUprade } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import PackageCard from '../PackageCard/PackageCard';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';

/**
 * Represents a UpgrageSubscription component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns UpgrageSubscription
 */
export const UpgrageSubscription = function( props ){

  const [showQRcode, setshowQRcode] = useState( false )
  const [QRCodeDetails, setQRcodeDetails] = useState( {} )
  const [modalPopup, setModalPopup] = useState( false );
  const [notification, setNotification] = useState( {} );
  const [isConfetti, setConfetti] = useState( false );

  const modalRefQR = useRef();
  const modalRef = useRef();
  const buttonRef = useRef();
  const timerRef = useRef();
  const successPayment = useRef();

  const { messages, onLogin } = usePubNubContext()
  const { responseData, fetchPackList } = useSubscriptionContext()
  const previousPathName = useNavigationContext()
  const history = useHistory()
  const [QRCode] =  UpgradeRechargeURL()
  const { fetchQRCode, QRcodeResponse, QRCodeError, QRcodeLoading } = QRCode

  const [upgradeLowerPack] =  UpgradeFlowStatus()
  const { setCustomPageType, setDefaultPageType } = useHomeContext()
  const { UpgradePack, UpgradePackResponse, UpgradePackError, UpgradePackLoading } = upgradeLowerPack


  const { ref, focusKey } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true
  } );

  useEffect( () => {
    setTimeout( () => {
      setFocus( 'UPGRADE_BUTTON_UPDATE' )
    }, 500 )

  }, [] )

  const hideModalQR = ( boolean ) => {
    boolean && upgradePopupCancel()
    clearInterval( timerRef.current )
    setshowQRcode( false )
    modalRefQR?.current?.close();
    setFocus( 'UPGRADE_BUTTON_UPDATE' )
  };

  const openModalQR = () => {
    setshowQRcode( true )
    if( modalRefQR.current && !modalRefQR.current.open ){
      modalRefQR.current.showModal();
    }
    setFocus( 'UPGRADE_BUTTON_UPDATE' )
  };

  const handleQRcodeEvent = () =>{
    hideModalQR( false )
    setTimeout( () => {
      upgradePopup()
      openModalQR()
    }, 1000 )
    fetchQRCode();
  }

  useEffect( () => {
    if( QRcodeResponse && QRcodeResponse.data ){
      const QRCodeDetails = {
        url: QRcodeResponse.data.thirdPartyQRUrl,
        size:'250',
        goBack:'Go Back',
        info:QRcodeResponse.data.thirdPartyQRMsg

      }
      setQRcodeDetails( QRCodeDetails )
      // timerRef.current = setInterval( () => UpgradePack(), 5000 );
    }
    return () => clearInterval( timerRef.current );
  }, [QRcodeResponse] )

  const fetchPacks = () => {
    removelowerPlan()
    fetchPackList( {
      'baId': getBaID() ? getBaID() : null,
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }

  useEffect( ()=>{
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
        if( ( oldStackSuccessfullPurchase && responseData?.currentPack?.productId && oldStackSuccessfullPurchase !== responseData.currentPack.productId ) ){
          successPayment.current = true;
          UpgradePack()
        }
      }
      else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
        if( otherStackSuccessfullPurchaseStatus === 'SUCCESS' ){
          successPayment.current = true;
          UpgradePack()
        }
      }
    }
  }, [messages[getPubnubChannelName()]?.message] )

  useEffect( ()=>{
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) ){
      successMsg( UpgradePackResponse )
    }
    if( UpgradePackError ){
      successMsg()
    }
  }, [UpgradePackResponse, UpgradePackError] )

  const successMsg = ( UpgradePackResponse ) => {
    const response = UpgradePackResponse && UpgradePackResponse.data
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
    const notification = {
      iconName: 'Success',
      message:  response?.header || 'Plan Change Successful',
      info: response?.message || 'You have successfully upgraded your plan',
      buttonLabel: 'Done'
    }
    setNotification( notification )
    setModalPopup( true )
    clearInterval( timerRef.current );
    hideModalQR( false );
    openModal( true );
  }

  const failureMsg = ( ) => {
    clearInterval( timerRef.current );
    const notification = {
      iconName: 'AlertRed',
      message:  UpgradePackError?.message,
      buttonLabel: 'Done',
      info: 'Please Try Again'
    }
    setNotification( notification )
    setModalPopup( true )
    hideModalQR( false );
    openModal( false );
  }

  const errorMsg = ( msg ) => {
    clearInterval( timerRef.current );
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
    hideModalQR( false );
    hideModal();
    openModal( false );
  }

  const openModal = ( condition ) => {
    condition && upgradePopupUprade()
    setTimeout( () => {
      setConfetti( condition )
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
    }, 500 );
  };

  const onConfettiComplete = () => {
    setConfetti( false )
  }

  const hideModal = () => {
    modalRef.current?.close();
  };

  const onSuccessfull = () => {
    setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    previousPathName.focusedItem = null
    previousPathName.subscriptionPath = null
    previousPathName.selectedPlanCard = null
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanType = null
    previousPathName.current = null
    previousPathName.pageName = 'plan/current'
    previousPathName.subscriptionPath = null
    onLogin( false )
    payment_success_continue_watching()
    if( previousPathName.navigationRouting?.includes( PAGE_TYPE.CONTENT_DETAIL ) ){
      const indexRouter = getAllLoginPath().length
      history.go( -indexRouter )
      const piLevelClear = getPiLevel()
      piLevelClear > 0 && setPiLevel( piLevelClear - 1 )
    }
    else if( previousPathName.navigationRouting?.includes( PAGE_TYPE.SERIES_DETAIL ) ){
      const indexRouter = getAllLoginPath().length
      history.go( -indexRouter )
    }
    else if( Boolean( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' ) && Boolean( previousPathName.navigationRouting.includes( PAGE_TYPE.SEARCH ) || previousPathName.navigationRouting.includes( PAGE_TYPE.BROSWSE_BY ) || previousPathName.navigationRouting.includes( PAGE_TYPE.BINGE_LIST ) ) ){
      const indexRouter = getAllLoginPath().length
      history.go( -indexRouter )
      const piLevelClear = getPiLevel()
      piLevelClear > 0 && setPiLevel( piLevelClear - 1 )
    }
    else {
      setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
      history.push( '/discover' )
    }
    previousPathName.navigationRouting = null
    setAllLoginPath( [] )
    fetchPacks()
  }

  const handleCancelPopup = () =>{
    const response = UpgradePackResponse && UpgradePackResponse.data
    const pubnubPush = messages[getPubnubChannelName()]?.message
    const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
    const oldStackSuccessfullPurchaseStatus = getOldStackSuccessfullPurchases( pubnubPush )
    if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
      if( response?.paymentStatus === 'SUCCESS' || ( oldStackSuccessfullPurchaseStatus && responseData?.currentPack?.productId && oldStackSuccessfullPurchaseStatus !== responseData.currentPack.productId ) || successPayment.current === true ){
        onSuccessfull()
      }
    }
    else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
      if( response?.paymentStatus === 'SUCCESS' || otherStackSuccessfullPurchaseStatus === 'SUCCESS' || successPayment.current === true ){
        onSuccessfull()
      }
    }
    setModalPopup( false )
    hideModal()
    setFocus( 'UPGRADE_BUTTON_UPDATE' )
  }
  return (
    <div className='UpgrageSubscription'
      ref={ ref }
    >
      <FocusContext.Provider value={ focusKey }>
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div className='UpgrageSubscription__header'>
            <Button
              onClick={ ()=> {
                if( previousPathName.isLowerPlanFirstTime ){
                  history.push( PAGE_TYPE.HOME )
                  previousPathName.navigationRouting = null
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
            <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
          </div>
        </FocusContext.Provider>
        <div className='UpgrageSubscription__container'>
          <div className='UpgrageSubscription__content'>
            <div className='UpgrageSubscription__content--title'>
              <Text
                textAlign='center'
                textStyle='title-1'
                color='white'
              >
                { props.lowerPlanProps?.title }
              </Text>
            </div>
            <div className='UpgrageSubscription__content--subTitle'>
              <Text
                textAlign='center'
                textStyle='body-3'
                color='white'
              >
                { props.lowerPlanProps?.subTitle }
              </Text>
            </div>
            <div className='UpgrageSubscription__content--subTitle2'>
              <Text
                textAlign='center'
                textStyle='body-3'
                color='white'
              >
                { props.lowerPlanProps?.subTitle2 }
              </Text>
            </div>
            <div className='UpgrageSubscription__content--apps'>
              <PackageCard
                { ... props }
                title={ props.confirmPurchase ? props.upgradeMyPlan : props.upgradeMyPlanType }
                titlePremium={ true }
                titleIcon={ 'CrownWithBG' }
                appLabel={ 'apps' }
                deviceDetails={ props.deviceDetails }
                deviceIcon={ 'Devices' }
                monthlyPlan={ props.confirmPurchase ? '' : props?.upgradeMyPlan }
                apps={ props.lowerPlanProps?.apps }
                footerMsg={ props.proRateFooterMessage }
              />
            </div>

            <div className='UpgrageSubscription__content--button'>
              {
                Boolean( props.footerMsg && props.fdoRequested ) ? (
                  <div className='UpgrageSubscription__footer'>
                    <Text
                      textAlign='center'
                      textStyle='body-2'
                      color='purple-25'
                    >
                      { props.footerMsg }
                    </Text>
                  </div>
                ) : (
                  <Button
                    label={ constants.UPGRADE_SUBSCRIPTION }
                    size={ 'medium' }
                    onClick={ () => handleQRcodeEvent() }
                    focusKeyRefrence={ 'UPGRADE_BUTTON_UPDATE' }
                    onFocus={ ()=>previousPathName.previousMediaCardFocusBeforeSplash = 'UPGRADE_BUTTON_UPDATE' }
                  />
                ) }
            </div>
          </div>
        </div>

        <FocusContext.Provider focusable={ false }
          value=''
        >
          { showQRcode &&
          <QrCodePopUp
            modalRef={ modalRefQR }
            handleCancel={ ()=>hideModalQR( true ) }
            opener={ buttonRef }
            { ...QRCodeDetails }
            showQRcode={ showQRcode }
          /> }
          { modalPopup &&
          <NotificationsPopUp
            modalRef={ modalRef }
            handleCancel={ () => handleCancelPopup() }
            showConfetti={ isConfetti }
            onConfettiComplete={ onConfettiComplete }
            opener={ buttonRef }
            buttonClicked={ () => {
              handleCancelPopup()
            } }
            { ...notification }
            focusKeyRefrence={ 'DONE_BUTTON' }
            showModalPopup={ modalPopup }
          /> }
        </FocusContext.Provider>
      </FocusContext.Provider>
    </div>
  )
}

/**
    * Property type definitions
    *
    * @type {object}
    * @property {string} title - set the title
    * @property {string} subTitle - set the subTitle
    * @property {string} subTitle2 - set the subTitle
    * @property {array} apps - set the apps of the card
    */
export const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  subTitle2: PropTypes.string,
  apps: PropTypes.array
};

UpgrageSubscription.propTypes = propTypes;

export default UpgrageSubscription;
