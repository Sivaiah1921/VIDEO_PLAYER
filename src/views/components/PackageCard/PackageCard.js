/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * Free trial card
 *
 * @module views/components/PackageCard
 * @memberof -Common
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import './PackageCard.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import classNames from 'classnames';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import AppMediaCard from '../AppMediaCard/AppMediaCard';
import parse from 'html-react-parser';
import { useHistory, useParams } from 'react-router-dom';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, CHANGE_PLAN_TYPE, LAYOUT_TYPE, PACKS, PACK_LIST, PAGE_TYPE, PAYMENT_STATUS, SUBSCRIPTION_TYPE, USERS, isTizen, PROVIDER_LIST } from '../../../utils/constants';
import { getAllLoginPath, getAuthToken, getBaID, getBingeListFlag, getCatalogFlag, getDthStatus, getLiveFlagLocal, getPiLevel, getProductName, getSearchFlag, getSubscriberId, setActivatePopUpModalFlag, setAllLoginPath, setPiLevel } from '../../../utils/localStorageHelper';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { UpgradeFlowStatus, UpgradeRechargeURL } from '../../../utils/slayer/MyPlanSetupService';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { pack_selected, pack_selection_initiate, pack_selection_view, payment_success_continue_watching, renew_change_plan, startFreeTrial, subscription_page_proceed } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { cloudinaryCarousalUrl, getOldStackSuccessfullPurchases, getOtherStackSuccessfullPurchasesStatus, getPubnubChannelName, handleDistroRedirection, numberOfApps, setMixpanelData } from '../../../utils/util';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { isDistroContent, isLiveContentType } from '../../../utils/slayer/PlayerService';

/**
 * Represents a PackageCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PackageCard
 */
export const PackageCard = function( props ){
  const { onFocus, focusKeyRefrence, packCycle, title, amount, monthlyPlan, tag, tenureCount, productId, titlePremium, titleIcon, apps, appLabel, deviceIcon, balanceDetails, trialEndDate, deviceDetails, tenure, indexOfCard, flexiPlan, flexiPlanImageUrl, isFiberplan, addonVerbiageImage = false } = props;

  const [modalPopup, setModalPopup] = useState( false );
  const [notification, setNotification] = useState( {} )
  const [showQRcode, setshowQRcode] = useState( false )
  const [QRCodeDetails, setQRcodeDetails] = useState( {} )
  const [isConfetti, setConfetti] = useState( false );

  const modalRefQR = useRef();
  const modalRef = useRef();
  const buttonRef = useRef();
  const timerRef = useRef()
  const timerRef1 = useRef( null );
  const initializePayment = useRef( true );

  const primeAddOn = `${window.assetBasePath}plan-offer-tag.svg`;

  const { fromConfirmPurchase, flexiPlanVerbiagesContext, selectedPackageCard, setIsLoginToggle } = useMaintainPageState()
  const { option } = useParams()
  const { messages, onLogin } = usePubNubContext()
  const { setBaid, fetchPackList } = useSubscriptionContext()
  const previousPathName = useNavigationContext();
  const { setCustomPageType, setDefaultPageType } = useHomeContext()
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const launchTime = get( config, 'addPackPollingPopup.launchTime', null );
  const periodicFrequency = get( config, 'addPackPollingPopup.periodicFrequency', null );
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack

  const [QRCode] =  UpgradeRechargeURL()
  const { fetchQRCode, QRcodeResponse, QRCodeError, QRcodeLoading } = QRCode

  const [upgradeLowerPack] =  UpgradeFlowStatus()
  const { UpgradePack, UpgradePackResponse, UpgradePackError, UpgradePackLoading } = upgradeLowerPack

  const text = numberOfApps( deviceDetails ) || {}
  const history = useHistory();
  const { metaData } = usePlayerContext();


  const filteredPackApps = useMemo( ()=> {
    if( myPlanProps?.primeAddOn?.addOnEligibility ){
      return apps?.filter( app => app.title?.toLowerCase() !== PROVIDER_LIST.PRIME )
    }
    else {
      return apps
    }
  }, [apps, myPlanProps] )

  const onEnterPressCallbackFunction = () => {
    if( focusKeyRefrence === 'CANCELLED_PACKAGECARD' ){
      return
    }
    if( flexiPlan && tenureCount === 1 ){
      previousPathName.selectedPlanCard = indexOfCard
      if( getAuthToken() ){
        fetchQRCode( {
          'baId': getBaID(),
          'dsn': getBaID(),
          'sid': getSubscriberId(),
          'flexiPlan': true,
          'packId': props.productId
        } );
        return;
      }
      else {
        previousPathName.current = window.location.pathname
        previousPathName.navigationRouting = window.location.pathname
        setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.SUBSCRIPTION_PAGE )
        setIsLoginToggle( true )
        history.push( '/login' )
        fromConfirmPurchase.current = true
        return;
      }
    }
    option && renew_change_plan( responseSubscription?.responseData );
    previousPathName.selectedPlanCard = indexOfCard
    /* Mixpanel-event */
    subscription_page_proceed( previousPathName, title )
    pack_selection_initiate( previousPathName.current, myPlanProps )
    pack_selection_view( title )
    if( myPlanProps?.upgradeMyPlanType ){
      if( amount > myPlanProps.tenure?.[0]?.offeredPriceValue ){
        /* Mixpanel-event */
        pack_selected( title, MIXPANELCONFIG.VALUE.UPGRADE, amount, packCycle, false, responseSubscription?.responseData )
      }
      else {
        /* Mixpanel-event */
        pack_selected( title, MIXPANELCONFIG.VALUE.DOWNGRADE, amount, packCycle, false, responseSubscription?.responseData )
      }
    }
    else {
      /* Mixpanel-event */
      pack_selected( title, MIXPANELCONFIG.VALUE.FRESH, amount, packCycle, false, responseSubscription?.responseData )
    }

    if( myPlanProps?.subscriptionType === 'ANYWHERE' && !tag ){
      handleQRcodeEvent();
    }
    else {
      history.push( {
        pathname:  redirect( focusKeyRefrence ),
        args: {
          monthlyPlan: monthlyPlan
        }
      } )
    }
  }

  const isSuccessfullPurchase = () => {
    setBaid( 0 )
    setTimeout( () => {
      setBaid( getBaID() )
    }, 0 );
  }

  const { ref, focused } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    onFocus,
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onEnterPress:() => {
      onEnterPressCallbackFunction()
    },
    onArrowPress:( direction )=>{
      if( focusKeyRefrence === 'CANCELLED_PACKAGECARD' ){
        return false
      }
      if( direction === 'up' ){
        return false
      }
      if( direction === 'left' && focusKeyRefrence === 'PACKCARD0' ){
        return false
      }
    }

  } );

  const redirect = ( focusKeyRefrence ) => {
    previousPathName.tenurePagePath = tenureCount > 1 ? '/plan/change-tenure/' + productId + '/' + CHANGE_PLAN_TYPE.UPGRADE : null
    selectedPackageCard.current = focusKeyRefrence
    let path = ''
    if( tag && tag !== constants.RENEW_PLAN_VERBIAGE ){
      path = '/plan/current'
    }
    else if( tenureCount > 1 ){
      path = '/plan/change-tenure/' + productId + '/' + CHANGE_PLAN_TYPE.UPGRADE
    }
    else {
      path = '/plan/purchase/' + productId + '/' + CHANGE_PLAN_TYPE.UPGRADE + '/' + tenure[0]?.tenureId
    }
    return path ;
  }
  const splittedPrice = monthlyPlan && monthlyPlan.split( '/' )
  const price = splittedPrice && splittedPrice[0]
  const duration = splittedPrice && splittedPrice[1] ? '/' + splittedPrice[1] : null


  const hideModalQR = () => {
    clearInterval( timerRef.current )
    setshowQRcode( false )
    modalRefQR?.current?.close();
    setFocus( focusKeyRefrence )
    previousPathName.selectedPlanCard = null
  };

  const openModalQR = () => {
    setshowQRcode( true )
    modalRefQR?.current?.showModal();
  };

  const handleQRcodeEvent = () =>{
    fetchQRCode();
  }

  useEffect( () => {
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
      setQRcodeDetails( QRCodeDetails )
      setTimeout( () => {
        openModalQR()
      }, 100 );
      // timerRef.current = setInterval( () => UpgradePack(), launchTime ? launchTime * 1000 : 5000 );
      timerRef.current = setTimeout( () => UpgradePack(), 5000 );
      timerRef1.current = setTimeout( () => errorMsg(), launchTime && periodicFrequency ? ( launchTime * periodicFrequency ) * 1000 : 300000 )
    }
  }, [QRcodeResponse] )

  useEffect( () => {
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && initializePayment.current ){
      if( messages[getPubnubChannelName()]?.message ){
        const pubnubPush = messages[getPubnubChannelName()].message
        if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
          const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
          if( oldStackSuccessfullPurchase && myPlanProps.productId && oldStackSuccessfullPurchase !== myPlanProps.productId ){
            initializePayment.current = false
            UpgradePack();
          }
        }
        else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
          const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
          if( otherStackSuccessfullPurchaseStatus === PAYMENT_STATUS.SUCCESS ){
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

  useEffect( ()=>{
    if( UpgradePackResponse && ( UpgradePackResponse.data || UpgradePackResponse.code === 0 ) && !initializePayment.current ){
      successMsg()
    }
  }, [UpgradePackResponse] )

  const successMsg = () => {
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
    const response =  QRcodeResponse && QRcodeResponse.data
    const pollingAPIResponse =  UpgradePackResponse && UpgradePackResponse.data
    const notification = {
      iconName: 'Success',
      message: pollingAPIResponse?.header || response?.thirdPartyUpdradeHeader,
      info: pollingAPIResponse?.message || response?.thirdPartyUpdradeMsg,
      additionalInfo: pollingAPIResponse?.footer,
      buttonLabel: 'Done'
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

  const failureMsg = ( ) => {
    clearInterval( timerRef.current );
    clearTimeout( timerRef1.current )
    const notification = {
      iconName: 'AlertRed',
      message:  UpgradePackError?.message,
      buttonLabel: 'Done',
      info: 'Please Try Again'
    }
    setNotification( notification )
    setModalPopup( true )
    hideModalQR();
    openModal();
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
    openModal();
  }

  const openModal = () => {
    setTimeout( () => {
      modalRef.current?.showModal();
    }, 500 );
  };

  const hideModal = () => {
    modalRef.current?.close();
  };

  const handleCancelPopup = () =>{
    setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
    previousPathName.focusedItem = null
    previousPathName.subscriptionPath = null
    previousPathName.selectedPlanCard = null
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanType = null
    previousPathName.current = null
    previousPathName.pageName = 'plan/current'
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
      notification.iconName === 'Success' && setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED )
      history.push( '/discover' )
    }
    previousPathName.navigationRouting = null
    if( !( isLiveContentType( metaData?.contentType ) || isDistroContent( metaData?.provider ) ) ){
      setAllLoginPath( [] )
    }
    setModalPopup( false )
    hideModal();
    payment_success_continue_watching()
    onLogin( false )
    fetchPackList( {
      'baId': getBaID(),
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }

  useEffect( ()=>{
    monthlyPlan === PACKS.FREE_TRAIL && startFreeTrial( previousPathName.current )
    return () => {
      clearInterval( timerRef.current );
      clearTimeout( timerRef1.current );
    }
  }, [] )

  const onConfettiComplete = () => {
    setConfetti( false )
  }

  const flexiExpiryFooterMessage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages?.expiryFooterMessage, [flexiPlanVerbiagesContext.current] )

  return (
    <>
      <div className='PackageCard'>
        <div className={
          classNames( 'PackageCard__content',
            { 'PackageCard__content--withFocus': focused && focusKeyRefrence !== 'CANCELLED_PACKAGECARD' },
            { 'PackageCard__flexiContent': flexiPlan }
          ) }
        focused={ focused ? focused.toString() : undefined }
        ref={ ref }
        onMouseEnter={ props?.onMouseEnterCallBackFn }
        onMouseUp={ onEnterPressCallbackFunction }
        >
          {
            flexiPlan ? (
              <Image
                // src={ flexiPlanImageUrl }
                src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.FLEXI_PACKAGE_CARD, url ) }/${ flexiPlanImageUrl }` }
              />
            ) : (
              <>
                <div className='PackageCard__header'>
                  <div className={
                    classNames( 'PackageCard__header--title',
                      { 'PackageCard__header--titlePremium': titlePremium || PACK_LIST.includes( title ) }
                    ) }
                  >
                    <div className='PackageCard__header--titleRight'>
                      <Icon
                        name={ titleIcon }
                      />
                      <div className='PackageCard__header--titleRight--title'>
                        <Text
                          textAlign='left'
                          textStyle='body-2'
                          color='white'
                          htmlTag='span'
                        >
                          { title }
                        </Text>
                      </div>
                    </div>
                    <div className='PackageCard__header--titleRightPrice'>
                      {
                        price && !isFiberplan && (
                          <>
                            <span className='PackageCard--price'>{ parse( price ) }</span>
                          </>
                        )
                      }
                      <span className='PackageCard--month'>{ isFiberplan ? props.amountTimePeriod : duration }</span>
                    </div>
                  </div>
                </div>
                <div className='PackageCard__header--details'>

                  <div className='PackageCard__appCountText'>
                    <Icon name={ deviceIcon } />
                    <Text
                      textAlign='left'
                      textStyle='subtitle-3'
                      color='bingeBlue-100'
                    >
                      {
                        window.location.pathname.includes( '/plan/current' ) ? (
                          <>
                            <span className='PackageCard__appCountText--bold'>{ flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages?.numberOfAppsInfo || text.firstText }</span><span className='PackageCard__appCountText--normalText'>{ text.secondText }</span>
                          </>
                        ) : (
                          <>
                            <span className='PackageCard__appCountText--bold'>{ text.firstText }</span><span className='PackageCard__appCountText--normalText'>{ text.secondText }</span>
                          </>
                        )
                      }
                    </Text>
                  </div>
                </div>
                <div className='PackageCard__multiapps'>
                  {
                    props.remaingApps ? (
                      <>
                        {
                          filteredPackApps?.map( ( elm, index ) => {
                            if( index <= props.appsToShow ){
                              return (
                                <AppMediaCard
                                  key={ elm.title + '_' + index }
                                  title={ elm.title }
                                  image={ elm.image }
                                  isSubscritionModule={ true }
                                />
                              )
                            }
                          } )
                        }
                      </>
                    ) : (
                      <>
                        {
                          filteredPackApps?.map( ( elm, index ) => {
                            return (
                              <AppMediaCard
                                key={ elm.title + '_' + index }
                                title={ elm.title }
                                image={ elm.image }
                                isSubscritionModule={ true }
                              />
                            )
                          } )
                        }

                      </>
                    ) }
                </div>
                <div className='PackageCard__bottomSection'>
                  { ( props.remainingAppsAlwaysVisible || ( ( props.apps?.length > props.verbiageToShow ) && props.remaingApps ) ) &&
                  <div className={ classNames( 'PackageCard__remainingApps', {
                    'PackageCard__remainingApps--visibilityHidden' : !Boolean( props.apps?.length > props.verbiageToShow && props.remaingApps )
                  } ) }
                  >
                    <Text>{ `+${props.apps.length - props.verbiageToShow} More` }</Text>
                  </div>
                  }
                  { myPlanProps?.primeAddOn?.addOnEligibility && addonVerbiageImage && (
                    <div className='PackageCard__bottomSection--addOn'>
                      {
                        <Image
                          src={ primeAddOn }
                          alt='primeAddOn'
                        />
                      }
                    </div>
                  ) }
                </div>
                {
                  props.isFlexiPlan && flexiExpiryFooterMessage ? (
                    <div className='PackageCard__planExpired'>
                      <Text
                        textAlign='left'
                        textStyle='body-5'
                        color={ 'red' }
                      >
                        { parse( flexiExpiryFooterMessage ) }
                      </Text>
                    </div>
                  ) :
                    (
                      <>
                        {
                          props.packValidityMessage && props.selectCardProps?.length === 0 && (
                            <div className='PackageCard__planExpired'>
                              <Text
                                textAlign='left'
                                textStyle='body-5'
                                color={ 'purple-40' }
                              >
                                { props.packValidityMessage }
                              </Text>
                            </div>
                          )
                        }
                        {
                          props.expiryFooterMessage && myPlanProps.subscriptionType !== SUBSCRIPTION_TYPE.ATV && (
                            <div className='PackageCard__planExpired'>
                              <Text
                                textAlign='left'
                                textStyle='body-5'
                                color={ props.expiryFooterMessage?.toLowerCase().includes( 'expired' ) ? 'red' : 'purple-40' }
                              >
                                { parse( props.expiryFooterMessage ) }
                              </Text>
                            </div>
                          )
                        }
                      </>
                    )
                }
                <div className={
                  classNames( 'PackageCard__bottom',
                    { 'PackageCard__bottom--monthlyPlan': monthlyPlan && !balanceDetails }
                  ) }
                >
                  { balanceDetails && (
                    <>
                      <Text
                        textAlign='left'
                        textStyle='subtitle-3'
                        color='purple-25'
                      >
                        { trialEndDate }
                      </Text>
                      <Text
                        textAlign='left'
                        textStyle='subtitle-3'
                        color='purple-25'
                      >
                        { balanceDetails }
                      </Text>
                    </>
                  )
                  }
                </div>
                {
                  ( !isTizen && props?.nonAvailablePartners ) && (
                    <div className='PackageCard__Verbiage'>
                      <Text
                        textStyle='body-5'
                        textAlign='left'
                        color='purple-40'
                        htmlTag='li'
                      >{ props?.nonAvailablePartners }</Text>
                    </div>
                  )
                }
                {
                  ( isTizen && props?.nonAvailablePartnersSamsung ) && (
                    <div className='PackageCard__Verbiage'>
                      <Text
                        textStyle='body-5'
                        textAlign='left'
                        color='purple-40'
                        htmlTag='li'
                      >{ props?.nonAvailablePartnersSamsung }</Text>
                    </div>
                  )
                }
                { props.fdoChangesPlanVerbiages && props.fdoChangesPlanVerbiages.partnerChangeFDORaised &&
                <div className='PackageCard__fdoVerbiage'>
                  <AppMediaCard
                    title={ 'image' }
                    image={ props.fdoChangesPlanVerbiages?.partnerChangeImage }
                    isSubscritionModule={ true }
                  />
                  <div className='PackageCard__fdoVerbiage--info'>
                    { props.fdoChangesPlanVerbiages?.partnerChangeRequestMessage } <span className='PackageCard__fdoVerbiage--dateInfo'>
                      { props.fdoChangesPlanVerbiages?.partnerChangeRequestDate }
                    </span>
                  </div>
                </div>
                }
                <div className='PackageCard__topGradient'>
                </div>
              </>
            )
          }
        </div>
      </div>
      <FocusContext.Provider focusable={ false }
        value=''
      >
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
          buttonClicked={ () => {
            handleCancelPopup()
          } }
          { ...notification }
          focusKeyRefrence={ 'DONE_BUTTON' }
          showModalPopup={ modalPopup }
          showConfetti={ isConfetti }
          onConfettiComplete={ onConfettiComplete }
        /> }
      </FocusContext.Provider>
    </>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - set the title of the card
 * @property {string} tag - set the tag of the card
 * @property {string} deviceIcon - set the deviceIcon of the card
 * @property {string} deviceDetails - set the deviceDetails of the card
 * @property {string} trialEndDate - set the trialEndDate of the card
 * @property {string} balanceDetails - set the balanceDetails of the card
 * @property {string} appLabel - set the appLabel of the card
 * @property {bool} titlePremium - set the titlePremium of the card
 * @property {array} apps - set the apps of the card
 */
export const propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string,
  titlePremium: PropTypes.bool,
  titleIcon: PropTypes.string,
  deviceIcon: PropTypes.string,
  appLabel: PropTypes.string,
  trialEndDate: PropTypes.string,
  balanceDetails: PropTypes.string,
  apps: PropTypes.array
};


PackageCard.propTypes = propTypes;

export default PackageCard;
