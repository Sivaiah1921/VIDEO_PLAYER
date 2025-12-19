/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/**
 * This component will show view for change plan purchase
 *
 * @module views/components/ConfirmPurchase
 * @memberof -Common
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import './ConfirmPurchase.scss';
import UpgradeMyPlan from '../UpgradeMyPlan/UpgradeMyPlan';
import { APPLE_PRIME_ACTIVATION_JOURNEY, CHANGE_PLAN_TYPE, COMMON_HEADERS, constants, PACKS, PAGE_TYPE, PAYMENT_STATUS, PROVIDER_LIST, SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE, USERS } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import { formatBalanceResponse, getPlanDetail, formatResponse, ProratedBalanceAPICall, PackValidationAPICall, AddPackAPI, ModifyPackAPI, ChargeRequestAPI, PaymentStatusAPICall } from '../../../utils/slayer/SubscriptionPackageService';
import { useHistory, useParams } from 'react-router-dom';
import PlanCard from '../PlanCard/PlanCard';
import Text from '../Text/Text';
import Button from '../Button/Button';
import parse from 'html-react-parser';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { getAllLoginPath, getAuthToken, getBaID, getBingeListFlag, getCatalogFlag, getDthStatus, getLiveFlagLocal, getPiLevel, getSearchFlag, getSubscriberId, getUserStatus, setAllLoginPath, setPiLevel, setUserStatus, setActivatePopUpModalFlag } from '../../../utils/localStorageHelper';
import { BalanceAPICall } from '../../../utils/slayer/MyAccountService';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp'
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import classNames from 'classnames';
import { add_pack_continue, login_confirm_pack, low_balance, pack_QR_code, pack_QR_code_proceed, payment_initiate, payment_success_continue_watching, subscription_fail, subscription_initiate, upgradePopup, upgradePopupCancel, upgradePopupUprade } from '../../../utils/mixpanel/mixpanelService';
import get from 'lodash/get';
import { getOldStackSuccessfullPurchases, getOtherStackSuccessfullPurchasesStatus, getPubnubChannelName, handleDistroRedirection, insufficientBalanceVerbiage, setMixpanelData, storeAllPaths, userIsSubscribed } from '../../../utils/util';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { MyPlanSetupService } from '../../../utils/slayer/MyPlanSetupService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import serviceConst from '../../../utils/slayer/serviceConst';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { isDistroContent, isLiveContentType } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import AppMediaCard from '../AppMediaCard/AppMediaCard';


/**
   * Represents a ConfirmPurchase component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns ConfirmPurchase
   */
export const ConfirmPurchase = function( props ){
  // States
  const [showQR, setShowQR] = useState( false );
  const [isConfetti, setConfetti] = useState( false );
  const [QRCodeDetails, setQRCodeDetails] = useState( {} )
  const [notification, setNotification] = useState( {} )
  const [modalPopup, setModalPopup] = useState( false );
  const [statusPubnub, setStatusPubnub] = useState( true );
  const [balanceDetails, setBalanceDetails] = useState( {} )
  const [fullLoader, setfullLoader] = useState( true )

  // Refs
  const timerRef = useRef( null );
  const timerRef1 = useRef( null );
  const modalRefQR = useRef();
  const buttonRefQR = useRef();
  const successPayment = useRef( false );
  const modalRef = useRef();
  const buttonRef = useRef();
  const newUserPurchase = useRef( true );

  // Hooks
  const { setCustomPageType, setDefaultPageType } = useHomeContext()
  const { fromConfirmPurchase, fromRenewPurchase, flexiPlanVerbiagesContext, setIsLoginToggle } = useMaintainPageState();
  const { messages, onLogin } = usePubNubContext()
  const previousPathName = useNavigationContext();
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const history = useHistory()
  const { title, type, tenure } = useParams();
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } )

  // API calls
  const { responseData, response: currentPackResponse, fetchPackList, setBaid } = useSubscriptionContext()
  const { fetchData, response, error, loading } = responseData.allPacks;

  const [currentPlan] = MyPlanSetupService( true )
  const { fetchData: fetchCurrentPlan, response: currentResponse, error: currentError, loading: currentLoading } = currentPlan || {}

  const [balanceData] = BalanceAPICall();
  const { fetchBalance, balanceResponse, balanceeError, balanceLoading } = balanceData || {}

  const [packValidation] = PackValidationAPICall( )
  const { fetchpackvalidation, packValidationResponse, packValidationError, packValidationLoading } = packValidation

  const [addPack] = AddPackAPI()
  const { fetchpack, addedPackResponse, addedPackError, addedPackLoading } =  addPack;

  const [modifyPack] = ModifyPackAPI()
  const { modifyPackRequest, modifiedPackResponse, modifiedPackError, modifiedPackLoading } =  modifyPack;

  const [chargeRequest] = ChargeRequestAPI()
  const { chargeRequestAPI, chargeRequestResponse, chargeRequestError, chargeRequestLoading } =  chargeRequest;

  const [paymentStatus] = PaymentStatusAPICall()
  const { fetchPaymentStatus, paymentStatusResponse, paymentStatusError, paymentStatusLoading }  = paymentStatus

  const [balance] = ProratedBalanceAPICall( );
  const { proratedFetchBalance, proratedBalanceResponse, proratedBalaceAPIError, proratedBalaceAPILoading } = balance;

  const { plancard } = formatResponse( response )
  const packInfo = getPlanDetail( plancard, title, tenure, responseData.currentPack, currentPackResponse, type, flexiPlanVerbiagesContext )

  const { balanceProps } = formatBalanceResponse( proratedBalanceResponse, packInfo.records?.amount )
  const { adjustmentText, adjustmentAmount, payableAmountText, payableAmount, payableAmountNew, proRateFooterMessage } = balanceProps;

  const { metaData } = usePlayerContext();

  const launchTime = useMemo( () => get( config, 'addPackPollingPopup.launchTime', null ), [config] );
  const periodicFrequency = useMemo( () => get( config, 'addPackPollingPopup.periodicFrequency', null ), [config] );
  const BackgroundImage = useMemo( () => config?.welcomeScreen?.backgroundImage, [config] );
  const appleSourceRefId = useMemo( () => packInfo.planDetail.apps?.find( item => item.title?.toLowerCase() === PROVIDER_LIST.APPLETV ) || {}, [packInfo] )

  const { primeAddOn = {} } = packInfo.currentTenure
  const myPlanProps = responseData.currentPack || {}
  const { addonPartnerList = [] } = myPlanProps

  const showLoader = () => {
    if( getAuthToken() ){
      if( getDthStatus() === USERS.NON_DTH_USER ){
        return ( proratedBalaceAPILoading || loading || packValidationLoading || ( addedPackLoading && modifiedPackLoading ) )
      }
      else {
        return proratedBalaceAPILoading || loading || packValidationLoading || balanceLoading || ( addedPackLoading && modifiedPackLoading )
      }
    }
    else {
      return loading
    }
  }

  const onSuccess = () => {
    previousPathName.selectedPlanCard = null
    previousPathName.selectedtenure = null
    successMsg()
  }

  const onFail = ( paymentStatusResponse ) => {
    /* MixPanel-Events */
    const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
    subscription_fail( packInfo, responseData, paymentStatusResponse.data, previousPathName, response )
    failureMsg()
  }

  const isSuccessfullPurchase = () => {
    setBaid( 0 )
    setTimeout( () => {
      setBaid( getBaID() )
    }, 0 );
  }

  const handlePurchase = ( ) =>{
    subscription_initiate( packInfo, responseData, previousPathName.current, title, tenure )
    login_confirm_pack( balanceDetails?.lowBalance, packInfo )
    const errorMessage = packValidationError || addedPackError || modifiedPackError || null
    if( errorMessage ){
      errorMsg( errorMessage.message )
    }
    else {
      const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
      /* mixpanel-events */
      if( response && ( response.modificationType === CHANGE_PLAN_TYPE.UPGRADE || !response.modificationType ) ){
        upgradePopup()
      }
      const paymentStatusData = {
        paymentTransaction: response && response.paymentTransactionId,
        baId: getBaID()
      }
      setTimeout( () => {
        openModelQR()
      }, 10 );
      timerRef.current = setInterval( () => fetchPaymentStatus( paymentStatusData ), 10000 );
      timerRef1.current = setTimeout( () => {
        errorMsg()
      }, launchTime && periodicFrequency ? ( launchTime * periodicFrequency ) * 1000 : 300000 )
    }

  }

  const confirmPurchase = () =>{
    previousPathName.current = window.location.pathname
    previousPathName.navigationRouting = window.location.pathname
    setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.SUBSCRIPTION_PAGE )
    setIsLoginToggle( true )
    history.push( '/login' );
    fromConfirmPurchase.current = true
  }

  const hideModal = () => {
    setModalPopup( false )
    modalRef.current?.close();
  };

  const openModal = ( condition ) => {
    setShowQR( false )
    modalRefQR.current?.close();
    condition && upgradePopupUprade()
    setTimeout( () => {
      setConfetti( condition )
      setModalPopup( true )
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
      isSuccessfullPurchase()
    }, 50 );
  };

  const onSuccessfull = () => {
    setConfetti( false )
    setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )

    previousPathName.focusedItem = null
    previousPathName.subscriptionPath = null
    previousPathName.selectedPlanCard = null
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanType = null
    if( isLiveContentType( metaData?.contentType ) || isDistroContent( metaData?.provider ) ){
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
      setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
      history.push( '/discover' )
    }
    if( !( isLiveContentType( metaData?.contentType ) || isDistroContent( metaData?.provider ) ) ){
      setAllLoginPath( [] )
    }

    previousPathName.current = null
    previousPathName.navigationRouting = null
    previousPathName.pageName = 'plan/current'

    payment_success_continue_watching()
    onLogin( false )
    successPayment.current = false;
    fetchPacks()
  }

  const fetchPacks = () => {
    fetchPackList( {
      'baId': getBaID(),
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }

  const handleCancelPopup = () =>{
    const response = paymentStatusResponse && paymentStatusResponse.data
    const pubnubPush = messages[getPubnubChannelName()].message || messages[getPubnubChannelName()]
    const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
    const oldStackSuccessfullPurchaseStatus = getOldStackSuccessfullPurchases( pubnubPush )
    console.log( pubnubPush, 'PUBSUB99->UpgradePackResponse-MEGA-Pack' )
    if( response?.paymentStatus === PAYMENT_STATUS.FAILED ){
      proratedFetchBalance( packInfo.params )
      fetchpackvalidation( { url: serviceConst.PACK_VALIDATION + '/' + packInfo.params?.baId + '/' + packInfo.params?.updatedPackId } )
    }
    else if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
      if( response?.paymentStatus === PAYMENT_STATUS.SUCCESS || ( oldStackSuccessfullPurchaseStatus && responseData?.currentPack?.productId && oldStackSuccessfullPurchaseStatus !== responseData.currentPack.productId ) || successPayment.current === true ){
        onSuccessfull()
      }
    }
    else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
      if( response?.paymentStatus === PAYMENT_STATUS.SUCCESS || otherStackSuccessfullPurchaseStatus === PAYMENT_STATUS.SUCCESS || successPayment.current === true ){
        onSuccessfull()
      }
    }
    hideModal()
    setFocus( 'CONFIRM_PURCHASE' )
  }

  const hideModalQR = ( boolean ) => {
    const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
    boolean && response && ( response.modificationType === CHANGE_PLAN_TYPE.UPGRADE || !response.modificationType ) ? (
      upgradePopupCancel()
    ) : null;
    setFocus( 'CONFIRM_PURCHASE' )
    clearInterval( timerRef.current )
    clearTimeout( timerRef1.current )

    setShowQR( false )
    modalRefQR.current?.close();
  };

  const openModelQR = () => {
    setShowQR( true )
    if( modalRefQR.current && !modalRefQR.current.open ){
      modalRefQR.current?.showModal();
    }
    setCustomPageType( '' )
  };

  const checkBalance = () => {
    fetchBalance( {
      'baId': getBaID()
    } )
    setFocus( 'CONFIRM_PURCHASE' )
    clearInterval( timerRef.current )
    clearTimeout( timerRef1.current )
    setShowQR( false )
    modalRefQR.current?.close()
  }

  const successMsg = () => {
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
    const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
    const notification = {
      iconName: 'Success',
      message:  response && response.paymentStatusVerbiage?.header || 'Plan Change Successful',
      info: response && response.paymentStatusVerbiage?.message || 'You have successfully upgraded your plan',
      additionalInfo: response && response.paymentStatusVerbiage?.footer || '',
      buttonLabel: constants.DONE_BTN,
      upgradeAppleInfo: response && response.appleUpgradeVerbiage || '',
      secondaryTitle: response && response.secondaryTitle || ''
    }
    setNotification( notification )
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )

    setStatusPubnub( false )
    if( response ){
      const paymentStatusData = {
        paymentTransaction: response.paymentTransactionId,
        baId: getBaID()
      }
      fetchPaymentStatus( paymentStatusData )
    }
    else {
      hideModalQR( false );
      openModal( !currentResponse.data.fdoRequested )
    }
  }

  const failureMsg = ( ) => {
    clearInterval( timerRef.current );
    const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
    const notification = {
      iconName: 'AlertRed',
      message:  response.paymentErrorVerbiages?.paymentFailureVerbiage,
      info: response.paymentErrorVerbiages?.transactionPendingVerbiage,
      additionalInfo: response.paymentErrorVerbiages?.userCancelledVerbiage,
      buttonLabel: constants.DONE_BTN
    }
    setNotification( notification )
    openModal( false );
  }

  const errorMsg = ( msg ) => {
    clearInterval( timerRef.current );
    const notification = {
      iconName: 'AlertRed',
      message:   msg ? msg : constants.message,
      info:  constants.TRY_AGAIN_VERBIAGE,
      buttonLabel: constants.DONE_BTN,
      backButton: constants.TOCLOSE,
      backIcon: 'GoBack'
    }

    setNotification( notification )
    openModal( false );
  }

  const onConfettiComplete = () => {
    setConfetti( false )
  }

  const renderBoldText = ( text = '' ) => {
    if( !text.includes( '<b>' ) ){
      return text;
    }

    const [left, rest] = text.split( '<b>' );
    const [bContent, right] = rest.split( '</b>' );

    return (
      <>
        { left.trimEnd() }{ '\u00A0' }<b>{ bContent.trim() }</b>{ '\u00A0' }{ right.trimStart() }
      </>
    );
  };

  useEffect( () => {
    if( packValidationResponse ){
      if( packValidationResponse.data && packValidationResponse.code === 0 ){
        const data = {
          sid: getSubscriberId(),
          baId: packInfo.params.baId,
          dsn: getBaID(),
          newPackId: packInfo.params.updatedPackId,
          packId: packInfo.params.updatedPackId,
          amount: packValidationResponse.data.totalAmount,
          startDate: packValidationResponse.data.term.startDate,
          endDate: packValidationResponse.data.term.endDate,
          return_url: `${process.env.REACT_APP_APIPATH}/subscription-transaction/status`,
          deviceType: 'WEB',
          language: constants.ENGLISH,
          subscriptionType:  responseData.currentPack?.subscriptionType || PACKS.ADD_PACK_FREEMIUM,
          currentPackId: responseData.currentPack?.productId || '',
          dthStatus: getDthStatus(),
          source: COMMON_HEADERS.SOURCE,
          unlocked: false,
          ...( responseData.currentPack?.productId && { journeySourceRefId:  appleSourceRefId.soureReferenceId } ),
          externalSourceMSales: false,
          ...( fromRenewPurchase.current && { isMyopRenew: true } )
        }
        if( responseData.currentPack?.upgradeMyPlanType && responseData.currentPack?.subscriptionStatus !== SUBSCRIPTION_STATUS.DEACTIVE ){
          modifyPackRequest( data )
        }
        else {
          /* MixPanel-Events */
          add_pack_continue()
          fetchpack( data )
        }
      }
    }
    else if( packValidationError ){
      const data = {
        sid: getSubscriberId(),
        baId:   packInfo.params.baId,
        dsn: getBaID(),
        newPackId:  packInfo.params.updatedPackId,
        packId: packInfo.params.updatedPackId,
        return_url: `${process.env.REACT_APP_APIPATH}/subscription-transaction/status`,
        deviceType: 'WEB',
        language: constants.ENGLISH,
        subscriptionType:  responseData.currentPack?.subscriptionType || PACKS.ADD_PACK_FREEMIUM,
        currentPackId: responseData.currentPack?.productId || '',
        dthStatus: getDthStatus(),
        source: COMMON_HEADERS.SOURCE,
        unlocked: false,
        ...( responseData.currentPack?.productId && { journeySourceRefId:  appleSourceRefId.soureReferenceId } ),
        externalSourceMSales: false,
        ...( fromRenewPurchase.current && { isMyopRenew: true } )
      }
      if( responseData.currentPack?.upgradeMyPlanType && responseData.currentPack?.subscriptionStatus !== SUBSCRIPTION_STATUS.DEACTIVE ){
        modifyPackRequest( data )
      }
      else {
        /* MixPanel-Events */
        add_pack_continue()
        fetchpack( data )
      }
    }
    previousPathName.subscriptionPath = 'subscription/currentPlan'
  }, [packValidationResponse, packValidationError] )

  useEffect( () => {
    if( balanceResponse && balanceResponse.code === 0 ){
      setBalanceDetails( balanceResponse.data )
      if( balanceResponse.data?.lowBalance ){
        low_balance( PAGE_TYPE.CONFIRM_PURCHASE )
      }
    }

  }, [balanceResponse] )

  useEffect( () => {
    const response =  addedPackResponse && addedPackResponse.data ? addedPackResponse.data : modifiedPackResponse?.data
    if( response ){
      if( addedPackResponse?.code === 0 || modifiedPackResponse?.code === 0 ){
        const QRCodeDetails = {
          url: getDthStatus() === USERS.DTH_OLD_STACK_USER && responseData.currentPack?.subscriptionType !== SUBSCRIPTION_TYPE.ANYWHERE ? response.rechargeUrl2 : response.rechargeUrl,
          size:'250',
          goBack:'Go Back',
          heading: getDthStatus() === USERS.DTH_OLD_STACK_USER ? response.openFSQRScreenDetails?.header : response.openFSQRScreenDetails?.thirdPartyQRMsg,
          info: response.openFSQRScreenDetails?.header,
          additionalInfo: response.openFSQRScreenDetails?.subHeader,
          balanceBtnLabel: constants.CHECK_BALANCE
        }
        setNotification( {} )
        setQRCodeDetails( QRCodeDetails )
        setfullLoader( false )

        /* mixpanel-events */
        pack_QR_code( responseData.currentPack )
        pack_QR_code_proceed()
      }

      const data = {
        billingbingeList: packInfo.params.amountWithoutCurrency,
        productId: packInfo.params.updatedPackId,
        productName: packInfo.params.productName,
        subscriberId: getSubscriberId(),
        baId: getBaID(),
        paymentTransactionId: response.paymentTransactionId
      }

      if( !balanceDetails?.lowBalance && getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        chargeRequestAPI( data )
      }

      if( ( addedPackResponse?.code === 0 || modifiedPackResponse?.code === 0 ) ){
        /* Mixpanel-event */
        payment_initiate( packInfo )
      }
    }
    if( addedPackError || modifiedPackError ){
      setfullLoader( false )
    }
    return () => {
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current );
    }
  }, [modifiedPackResponse, addedPackResponse, addedPackError, modifiedPackError] )

  useEffect( ()=>{
    if( currentResponse && currentResponse.code === 0 ){
      onSuccess()
    }
  }, [currentResponse] )

  useEffect( ()=>{
    if( paymentStatusResponse && paymentStatusResponse.code === 0 && paymentStatusResponse.data.paymentStatus === PAYMENT_STATUS.FAILED ){
      onFail( paymentStatusResponse )
    }
  }, [paymentStatusResponse] )


  useEffect( () => {
    if( statusPubnub && paymentStatusResponse && ( paymentStatusResponse.data || paymentStatusResponse.code === 0 ) ){
      if( messages[getPubnubChannelName()]?.message ){
        const pubnubPush = messages[getPubnubChannelName()].message
        if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
          const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
          if( paymentStatusResponse.data?.paymentStatus === PAYMENT_STATUS.SUCCESS || ( oldStackSuccessfullPurchase && responseData?.currentPack?.productId && oldStackSuccessfullPurchase !== responseData.currentPack.productId ) ){
            successPayment.current = true;
            fetchCurrentPlan( {
              'baId': getBaID(),
              'dthStatus': getDthStatus(),
              'accountId': getSubscriberId()
            } )
          }
        }
        else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
          const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
          if( paymentStatusResponse.data?.paymentStatus === PAYMENT_STATUS.SUCCESS || otherStackSuccessfullPurchaseStatus === PAYMENT_STATUS.SUCCESS ){
            successPayment.current = true;
            fetchCurrentPlan( {
              'baId': getBaID(),
              'dthStatus': getDthStatus(),
              'accountId': getSubscriberId()
            } )
          }
        }
      }
      else {
        if( paymentStatusResponse.data?.paymentStatus === PAYMENT_STATUS.SUCCESS ){
          successPayment.current = true;
          fetchCurrentPlan( {
            'baId': getBaID(),
            'dthStatus': getDthStatus(),
            'accountId': getSubscriberId()
          } )
        }
      }
    }
    if( !paymentStatusResponse && messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
        if( ( oldStackSuccessfullPurchase && responseData?.currentPack?.productId && oldStackSuccessfullPurchase !== responseData.currentPack.productId ) ){
          successPayment.current = true;
          fetchCurrentPlan( {
            'baId': getBaID(),
            'dthStatus': getDthStatus(),
            'accountId': getSubscriberId()
          } )
        }
      }
      else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
        if( otherStackSuccessfullPurchaseStatus === PAYMENT_STATUS.SUCCESS ){
          successPayment.current = true;
          fetchCurrentPlan( {
            'baId': getBaID(),
            'dthStatus': getDthStatus(),
            'accountId': getSubscriberId()
          } )
        }
      }
    }
    if( paymentStatusError ){
      // successPayment.current = false;
      clearInterval( timerRef.current );
    }
  }, [paymentStatusResponse, paymentStatusError, messages[getPubnubChannelName()]?.message] )

  useEffect( ()=>{
    if( getAuthToken() && getUserStatus() === constants.UPDATE_USER ){
      fetchpackvalidation( {
        url: serviceConst.PACK_VALIDATION + '/' + packInfo.params?.baId + '/' + packInfo.params?.updatedPackId
      } )
    }
    storeAllPaths( window.location.pathname )
    return () => {
      fromRenewPurchase.current = false
      getAuthToken() && setUserStatus( constants.UPDATE_USER )
    }
  }, [] )

  useEffect( ()=>{
    if( getAuthToken() && getUserStatus() === constants.NEW_USER ){
      setTimeout( () => {
        fetchPacks()
      }, 3000 );
    }
  }, [] )

  useEffect( ()=>{
    if( getAuthToken() && getUserStatus() === constants.NEW_USER && newUserPurchase.current && packInfo && packInfo.planDetail && packInfo.planDetail.apps && Array.isArray( packInfo.planDetail.apps ) && packInfo.planDetail.apps.length ){
      newUserPurchase.current = false
      proratedFetchBalance( packInfo.params )
      fetchpackvalidation( { url: serviceConst.PACK_VALIDATION + '/' + packInfo.params?.baId + '/' + packInfo.params?.updatedPackId } )
    }
  }, [packInfo] )

  useEffect( () => {
    if( !statusPubnub && paymentStatusResponse && ( paymentStatusResponse.data || paymentStatusResponse.code === 0 ) ){
      openModal( !currentResponse?.data?.fdoRequested )
    }
  }, [paymentStatusResponse] )

  useEffect( () => {
    if( response && response.code === 0 && getAuthToken() && getUserStatus() === constants.UPDATE_USER ){
      proratedFetchBalance( packInfo.params )
    }
  }, [response] )

  useEffect( () => {
    if( proratedBalanceResponse && proratedBalanceResponse.code === 0 ){
      if( getDthStatus() !== USERS.NON_DTH_USER ){
        fetchBalance( {
          'baId': getBaID(),
          'upgradePackId': packInfo.params.updatedPackId,
          'proratedAmount': proratedBalanceResponse.data?.amount
        } )
      }
    }
    setfullLoader( false )

  }, [proratedBalanceResponse] )

  useEffect( () => {
    if( proratedBalaceAPIError ){
      // errorMsg( proratedBalaceAPIError.message )
    }
  }, [proratedBalaceAPIError] );

  useEffect( () => {
    if( !showLoader() ){
      setTimeout( () => {
        setFocus( 'CONFIRM_PURCHASE' )
      }, 100 )
      if( !previousPathName.current?.includes( '/content/detail' ) ){
        previousPathName.current = window.location.pathname
      }
    }
  }, [showLoader()] )

  const showPaybleAmountVerbiage = () => {
    if( getAuthToken() ){
      const response =  addedPackResponse || modifiedPackResponse
      if( response && response.data && ( response.data.modificationType === CHANGE_PLAN_TYPE.UPGRADE || response.data.modificationType === CHANGE_PLAN_TYPE.RENEWAL ) ){
        return true
      }
    }
  }

  return (
    <div ref={ ref }>
      { showLoader() && fullLoader ? <Loader /> :
        (
          <div className='ConfirmPurchase'>
            <div className='TenurePlanPage__topSection'>
              <Button
                onClick={ ()=> history.goBack() }
                iconLeftImage='GoBack'
                iconLeft={ true }
                secondary={ true }
                label={ constants.GOBACK }
              />
              <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
            </div>
            <div>
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
                showConfetti={ isConfetti }
                onConfettiComplete={ onConfettiComplete }
                focusShouldRetain={ 500 }
              /> }
            </div>
            <div className='ConfirmPurchase__content'>
              <div className='ConfirmPurchase__leftSection'>
                <UpgradeMyPlan
                  { ...packInfo.planDetail }
                  confirmPurchase={ true }
                  // remaingApps={ true }
                  appsToShow={ 31 }
                  verbiageToShow={ 32 }
                  footerMsg={ proratedBalanceResponse && proratedBalanceResponse.data && proratedBalanceResponse.data.planRenewMessage ? proratedBalanceResponse.data.planRenewMessage : '' }
                  // footerMsg={ responseData.currentPack?.footerMsg?.includes( 'expired' ) ? '' : responseData.currentPack?.footerMsg }
                />
                <div className='ConfirmPurchase__leftSection--smalLVerbiage'>
                  {
                    ( packInfo.planDetail && packInfo.planDetail.jioCinemaFooterMessage ) && (
                      <div className='ConfirmPurchase__leftSection--tpBalance'>
                        <Text
                          textStyle='body-1'
                          color='white'
                        >{ packInfo.planDetail.jioCinemaFooterMessage }</Text>
                      </div>
                    )
                  }
                  {
                    ( packInfo.planDetail && packInfo.planDetail.ahaFooterMessage ) && (
                      <div className='ConfirmPurchase__leftSection--tpBalance'>
                        <Text
                          textStyle='body-1'
                          color='white'
                        >{ packInfo.planDetail.ahaFooterMessage }</Text>
                      </div>
                    )
                  }
                </div>
                {
                  myPlanProps?.primeAddOn?.addOnEligibility && primeAddOn?.text && addonPartnerList?.map( String ).some( partner => partner.toLowerCase() === PROVIDER_LIST.PRIME ) && (
                    <div className='ConfirmPurchase__PrimeLitefdoVerbiage'>
                      <AppMediaCard
                        title={ 'image' }
                        image={ primeAddOn?.logo || '' }
                        isSubscritionModule={ true }
                      />
                      <div className='ConfirmPurchase__PrimeLitefdoVerbiage--info'>
                        <div className='prime-line'>{ renderBoldText( primeAddOn?.text?.split( /\n|\r\n|\\n/ )[0] || '' ) }</div>
                        <div className='prime-line'>{ renderBoldText( primeAddOn?.text?.split( /\n|\r\n|\\n/ )[1] || '' ) }</div>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className='ConfirmPurchase__rightSection'>
                <PlanCard { ...packInfo.records }
                  type={ CHANGE_PLAN_TYPE.UPGRADE }
                />
                { /* {
                  insufficientBalanceVerbiage( balanceDetails, payableAmountNew ) && (
                    <div className='ConfirmPurchase__rightSection--insuffientbalance'>
                      <Text
                        textStyle='autoPlay-subtitle'
                        textAlign='center'
                      >
                        { balanceDetails.lowBalanceMessage ? balanceDetails.lowBalanceMessage : constants.LOW_BALANCE }
                      </Text>
                    </div>
                  )
                } */ }
                {
                  showPaybleAmountVerbiage() ? (
                    <>
                      { ( !getAuthToken() || !adjustmentAmount ) && <div className='ConfirmPurchase__rightSection--divider'></div> }
                      <div>
                        { parse( `${adjustmentAmount}` ) !== '₹0.00' && adjustmentText &&
                          <div className='ConfirmPurchase__rightSection--lastPay'>
                            <Text
                              textStyle='body-2'
                              color='white'
                            >
                              { adjustmentText + ' ' }
                            </Text>
                            <div className='ConfirmPurchase__rightSection--lastPaySection2'>
                              <Text
                                textStyle='body-2'
                                color='white'
                              >
                                { parse( `${adjustmentAmount}` ) }
                              </Text>
                            </div>
                          </div>
                        }
                        {
                          <div className='ConfirmPurchase__rightSection--payableAmount'>
                            <Text
                              textStyle='body-1'
                              color='white'
                            >
                              { getAuthToken() && payableAmountText ? payableAmountText : constants.PAYABLE_AMOUNT }
                            </Text>
                            <div className='ConfirmPurchase__rightSection--lastPaySection2'>
                              <Text
                                textStyle='body-2'
                                color='white'
                              >
                                { getAuthToken() && payableAmount ? parse( `${payableAmount}` ) : parse( `${packInfo.records?.amount}` ) }
                              </Text>
                            </div>
                          </div>
                        }
                        {
                          proRateFooterMessage && (
                            <div>
                              <Text
                                textStyle='body-2'
                                color='white'
                              >
                                { parse( proRateFooterMessage ) }
                              </Text>
                            </div>
                          )
                        }
                      </div>
                    </>
                  ) : null
                }
                <FocusContext.Provider value={ focusKey }>
                  { !getAuthToken() &&
                  <div className='ConfirmPurchase__rightSection--continueToPay'>
                    <Button
                      onFocus={ () => {
                        previousPathName.previousMediaCardFocusBeforeSplash = 'CONFIRM_PURCHASE'
                      } }
                      ref={ buttonRefQR }
                      label={ constants.CONFIRM_PURCHASE_CTA }
                      onClick={ () => confirmPurchase() }
                      className='ConfirmPurchase__rightSection--button'
                      focusKeyRefrence={ 'CONFIRM_PURCHASE' }
                    />
                  </div> }
                  { getAuthToken() &&
                  <div className='ConfirmPurchase__rightSection--continueToPay'>
                    <Button
                      ref={ buttonRefQR }
                      label={ getDthStatus === USERS.DTH_OLD_STACK_USER && balanceDetails?.lowBalance ? constants.RECHARGE_TEXT : constants.CONFIRM_PURCHASE_CTA }
                      onClick={ () => handlePurchase() }
                      className={
                        classNames( 'ConfirmPurchase__rightSection--button', 'ConfirmPurchase__rightSection--buttonSecond'
                        )
                      }
                      onFocus={ () => {
                        previousPathName.previousMediaCardFocusBeforeSplash = 'CONFIRM_PURCHASE'
                      } }
                      focusKeyRefrence={ 'CONFIRM_PURCHASE' }
                    />
                  </div>
                  }
                  { showQR &&
                  <QrCodePopUp
                    modalRef={ modalRefQR }
                    handleCancel={ () => hideModalQR( true ) }
                    handleClick={ () => checkBalance() }
                    opener={ buttonRefQR }
                    showQRcode={ showQR }
                    { ...QRCodeDetails }
                  />
                  }
                </FocusContext.Provider>
              </div>
            </div>
          </div>
        )
      }
      <BackgroundComponent
        bgImg={ BackgroundImage }
        alt='Login BackgroundImage'
        isGradient={ false }
      />
    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {object} selectedPlan - selected plan
   * @property {string} adjustmentText - adjustment text
   * @property {string} adjustmentAmount - adjustment amount
   * @property {string} PayableAmountText - payable amount text
   * @property {string} PayableAmount - payable amount
   * @property {string} btnLabel -  btn label
   */
export const propTypes =  {
  selectedPlan: PropTypes.object,
  adjustmentText: PropTypes.string,
  adjustmentAmount: PropTypes.string,
  PayableAmountText: PropTypes.string,
  PayableAmount: PropTypes.string,
  btnLabel: PropTypes.string
};

ConfirmPurchase.propTypes = propTypes;
export default ConfirmPurchase;