import { useEffect, useRef, useState } from 'react';
import { appOldStackSelectionFlagPubnub, appSelectionFlagPubnub, getPubnubChannelName } from '../../../utils/util';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { getBaID, getDthStatus, getSubscriberId, removeZeroAppPlanPopupOnRefresh, setActivatePopUpModalFlag, setAllLoginPath } from '../../../utils/localStorageHelper';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, PAGE_TYPE, PAYMENT_STATUS, USERS, ZERO_PLAN_APPS_VERBIAGE } from '../../../utils/constants';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { UpgradeFlowStatus } from '../../../utils/slayer/MyPlanSetupService';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import { zeroAppMixpanelEvents } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHistory } from 'react-router-dom';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

const QRCodeSucess = ( props ) => {

  const { zeroAppsPlanCloseQrCode, zeroAppsPlanCloseSuccessPopup, myPlan } = props;

  const [showQR, setShowQR] = useState( false );
  const [successPopop, setSuccessPopop] = useState( false );
  const [notification, setNotification] = useState( {} )

  const qrRef = useRef( null );
  const successModalRef = useRef( null );

  const history = useHistory();

  const { messages } = usePubNubContext();
  const { responseData, setBaid, fetchPackList } = useSubscriptionContext();
  const { flexiPlanVerbiagesContext } = useMaintainPageState() || null
  const { setCustomPageType, setDefaultPageType } = useHomeContext()
  const previousPathName = useNavigationContext();

  const [upgradeLowerPack] = UpgradeFlowStatus()
  const { UpgradePack, UpgradePackResponse } = upgradeLowerPack

  const myPlanProps = responseData?.currentPack

  useEffect( () => {
    zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.ZERO_APPS_NUDGE_VIEW, myPlanProps )
    showQRCode();
  }, [] )

  useEffect( () => {
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        const appSelectionFlag = appOldStackSelectionFlagPubnub( pubnubPush )
        if( appSelectionFlag ){
          UpgradePack()
        }
      }
      else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        const appSelectionFlag = appSelectionFlagPubnub( pubnubPush )
        if( appSelectionFlag ){
          UpgradePack()
        }
      }
    }
  }, [messages[getPubnubChannelName()]?.message] )

  useEffect( ()=>{
    if( UpgradePackResponse && ( UpgradePackResponse.code === 0 || UpgradePackResponse.data ) ){
      if( UpgradePackResponse.data?.paymentStatus === PAYMENT_STATUS.SUCCESS ){
        document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
        const notification = {
          iconName: 'Success',
          message:  UpgradePackResponse.data?.header || ZERO_PLAN_APPS_VERBIAGE.POPUP_HEADER,
          info: UpgradePackResponse.data?.footer || ZERO_PLAN_APPS_VERBIAGE.POPUP_INFO,
          additionalInfo: UpgradePackResponse.data?.message,
          buttonLabel: 'Done'
        }
        setNotification( notification )
        hideQRCode()
        showModal()
      }
    }
  }, [UpgradePackResponse] )

  const hideQRCode = () => {
    setShowQR( false )
    qrRef.current?.close();
  }

  const showQRCode = () => {
    setShowQR( true )
    setTimeout( () => {
      qrRef.current?.showModal();
    }, 10 );
  }

  const hideModal = () => {
    setSuccessPopop( false )
    successModalRef.current?.close();
  }

  const showModal = () => {
    setTimeout( () => {
      zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.APPS_ADDED_SUCCESS_VIEW, myPlanProps )
    }, 5000 );
    setSuccessPopop( true )
    isYourSuccessfullPurChase()
    setTimeout( () => {
      successModalRef.current?.showModal();
    }, 10 );
    removeZeroAppPlanPopupOnRefresh()
  }

  const successPopupAction = () => {
    setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    previousPathName.focusedItem = null
    previousPathName.subscriptionPath = null
    previousPathName.selectedPlanCard = null
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanType = null
    previousPathName.current = null
    previousPathName.pageName = 'plan/current'
    if( window.location.pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) ){
      setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
      history.push( '/discover' )
      hideModal()
    }
    else {
      hideModal()
      window.location.pathname.includes( PAGE_TYPE.HOME ) && setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
      zeroAppsPlanCloseSuccessPopup && zeroAppsPlanCloseSuccessPopup()
    }
    previousPathName.navigationRouting = null
    setAllLoginPath( [] )
    zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.APPS_ADDED_SUCCESS_DONE, myPlanProps )
    fetchPackList( {
      'baId': getBaID(),
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }

  const isYourSuccessfullPurChase = () => {
    setBaid( 0 )
    setTimeout( () => {
      setBaid( getBaID() )
    }, 0 );
  }

  return (
    <>
      {
        showQR && (
          <QrCodePopUp
            modalRef={ qrRef }
            handleCancel={ ()=>{
              hideQRCode()
            } }
            zeroAppsPlanCloseQrCode={ zeroAppsPlanCloseQrCode }
            showQRcode={ showQR }
            url={ flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.qrCode }
            size='250'
            goBack={ constants.GOBACK }
            flexiCrown={ flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.crownImage }
            flexiHeading={ myPlan ? flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.chooseAppsTitle : flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.title }
            doneCta={ flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.primaryCTA }
            flexiInfo={ flexiPlanVerbiagesContext.current?.data?.lsAppSelectionPopupVerbiages?.subTitle }
            customClassName='QRCodeSuccess'
          />
        )
      }
      { successPopop &&
      <NotificationsPopUp
        modalRef={ successModalRef }
        handleCancel={ successPopupAction }
        buttonClicked={ successPopupAction }
        { ...notification }
        focusKeyRefrence={ 'DONE_BUTTON' }
        showModalPopup={ successPopop }
        focusShouldRetain={ 500 }
      /> }
    </>
  )
}

export default QRCodeSucess;