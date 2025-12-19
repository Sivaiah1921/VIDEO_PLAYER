/* eslint-disable no-console */
/**
 * The PubNubContextProvider component is used to integrate PubNub in your application: setting up a connection to PubNub, and sending and receiving messages.
 *
 * @module views/core/PubNubContextProvider/PubNubContextProvider
 */
import React, { useContext, createContext, useEffect, useState, useRef, useMemo } from 'react';
import PubNub from 'pubnub';
import { getSubscriberId, getAnonymousId, getProfileId, getBaID, getDthStatus, getAuthToken, setAgeRating, getAgeRating, getTVDeviceId, setDeBoardingPopupCount, getDeBoardingPopupCount, getProductName, getMaxCardinalityReachedValue, getActivatePopUpModalFlag, removeActivatePopUpModalFlag, getZeroAppPlanPopupOnRefresh, setZeroAppPlanPopupOnRefresh, setBingeSubscriberId, getBingeSubscriberId, setDthStatus, setAccountBaid, setActivatePopUpModalFlag, getSmartTroubleshootingTrackEventCount, setSmartTroubleshootingTrackEventCount, setSmartSubscriptionStatus, getSmartSubscriptionStatus, getRmn, getDeviceLaunchCount } from '../../../utils/localStorageHelper';
import { getOldStackAgeRating, getOldStackDeviceList, getOldStackSuccessfullPurchases, getOtherStackAgeRating, getOtherStackDeviceList, getOtherStackSuccessfullPurchasesStatus, getOtherStackSuccessfullPurchasesTransactionId, getPubnubChannelName, modalDom, modalDomClose, setMixpanelData, switchPubnubChannelHandling, showToastMsg, getOldStackPubnubDetaills, redirection } from '../../../utils/util';
import { PRIME, USERS, ZERO_PLAN_APPS_VERBIAGE, constants, PROVIDER_LIST, APPLE_PRIME_ACTIVATION_JOURNEY, PACKS, SubscriptionNotFoundData, SUBSCRIPTION_STATUS } from '../../../utils/constants';
import NotificationsPopUp from '../../components/NotificationsPopUp/NotificationsPopUp';
import { useHistoryContext } from '../HistoryContextProvider/HistoryContextProvider';
import { useFocusable, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useSubscriptionContext } from '../SubscriptionContextProvider/SubscriptionContextProvider';
import { useNavigationContext } from '../NavigationContextProvider/NavigationContextProvider';
import { appActivationPopupExit, device_removed, zeroAppMixpanelEvents } from '../../../utils/mixpanel/mixpanelService';
import { useHomeContext } from '../HomePageContextProvider/HomePageContextProvider';
import { useMaintainPageState } from '../MaintainPageStateProvoder/MaintainPageStateProvoder';
import { resetUserType, setBingePrimeStatusPeopleProperties, setExistingPrimePeopleProperties, unsetSuperProperties } from '../../../utils/mixpanel/mixpanel';
import { VerbiagesDetailApi } from '../../../utils/slayer/SubscriptionPackageService';
import { useAppContext } from '../AppContextProvider/AppContextProvider';
import { usePlayerContext } from '../PlayerContextProvider/PlayerContextProvider';
import mixpanel from 'mixpanel-browser';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { primeStatusToastMessage } from '../../../utils/primeHelper';
import ActivateJourneyPopUp from '../../components/ActivateJourneyPopUp/ActivateJourneyPopUp';
import { AppleAndPrimeService } from '../../../utils/slayer/AmazonPrimeService';
import { getAppList, getRefreshUserSubscription, getTrackMaTriggerFrequency, getUpdatedStatusInfo, handlePopupCTA } from '../../../utils/commonHelper';
import QRCodeSucess from '../../components/QRCodeSucess/QRCodeSucess';
import Notifications from '../../components/Notifications/Notifications';
import { PubnubHandling, PubNubWrapperService, CentrifugeTokenGenarator } from '../../../utils/slayer/SubscriberFormService';
import { useRegisterContext } from '../RegisterContextProvider/RegisterContextProvider';
import { useProfileContext } from '../ProfileContextProvider/ProfileContextProvider';
import { useImagePubNubContext } from './ImagePubNubContextProvider';
import { useLoginContext } from '../LoginContextProvider/LoginContextProvider';
import { onLogoutAction } from '../../../utils/logoutHelper';
import { getAppleJourneyStatus } from '../../../utils/appleHelper';
import { trackErrorEvents } from '../../../utils/logTracking';
import { useCentrifuge } from '../../../utils/slayer/useCentrifuge';


/**
  * Represents a PubNubContextProvider component
  *
  * @method
  * @param { Object } props - React properties passed from composition
  * @returns PubNubContextProvider
  */
export const PubNubContextProvider = function( { children } ){
  const { ref, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } );
  const [messages, setMessages] = useState( {} );
  const [channel, setChannel] = useState( null );
  const [showActivatedModalJourney, setShowActivatedModalJourney] = useState( false )
  const [isFlexiPlanVerbiages, setIsFlexiPlanVerbiages] = useState( false );
  const [qrCodeSuccess, setQRCodeSuccess] = useState( false );
  const [showNotification, setShowNotification] = useState( false );
  const [notificationMessage, setNotificationMessage] = useState( '' )

  const modalRef = useRef();
  const buttonRef = useRef();
  const listnerObj = useRef();
  const modalFlexiPlanRef = useRef();
  const myPlanProps = useRef();
  const deboardingPopupVerbiagesRef = useRef( null )
  const activateModalJourneyRef = useRef()
  const restoreFocusKeyRef = useRef( null )
  const statusOfPrimeAndAppleInfo = useRef()
  const focusReference = useRef();
  const changedDthStatus = useRef( null )

  const { onLogoutImage } = useImagePubNubContext() || {};
  const { setSubscriber } = useLoginContext() || {};
  const historyObject = useHistoryContext();
  const previousPathName = useNavigationContext();
  const { setCustomPageType, setDefaultPageType, setSidebarList } = useHomeContext()
  const { successFullPlanPurchasePubnub, flexiPlanVerbiagesContext, primeManualBack, receivePubnubAfterScanning, isActivePopUpOpen, setIsActivePopUpOpen, restoreActivePopupKey, hasPrimeCtaClicked, isDeviceRemoved, setIsDeviceRemoved, setIsQrCodeJourney, setInitiateTimer, isPubnubWrapper, setQrLoginDetails } = useMaintainPageState() || null
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const { setResult, setResultForUnsubscribe, setBaid, setCardProps, responseData, currentResponseCondition, setBingeListRecord } = useSubscriptionContext()
  const [verbiageDetails] = VerbiagesDetailApi()
  const { fetchverbiageDetails, verbiageDetailsResponse } = verbiageDetails
  const { setMetaData, setSonyLivPartnerToken } = usePlayerContext()
  const [entitlementStatus] = AppleAndPrimeService();
  const { entitlementStatusFetchData, entitlementStatusResponse, entitlementStatusError } = entitlementStatus;
  const [pubnubHandle] = PubnubHandling();
  const { pubnubFetchData, pubnubResponse, pubnubError } = pubnubHandle;
  const { isOnline }  = useRegisterContext( );
  const { setProfileAPIResult, setResponse } = useProfileContext() || {};

  const applePrimePopupVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage?.lsApplePrime, [flexiPlanVerbiagesContext.current] )
  const [pubNubDetail] = PubNubWrapperService();
  const { pubNubDetailFetchData, pubNubDetailResponse, pubNubDetailError } = pubNubDetail;
  const [smartSubscriptionRefresh, setSmartSubscriptionRefresh] = useState()

  const isAuthReady = Boolean( getAuthToken() );
  const swicthingChannelName = config?.pubsub && config?.pubsub.includes( constants.CENTRIFUGO ) ? constants.CENTRIFUGO : constants.PUBNUB; // Need to Modify still not received final switch_channel Value not coming from BE -- Re: Ticket Update - As per contract

  const [centrifugeTokenGenarator] = CentrifugeTokenGenarator();
  const { fetchCentrifugeToken, centrifugeTokenResponse } = centrifugeTokenGenarator;

  const centrifugeClient = useCentrifuge( {
    enabled: !!isAuthReady && swicthingChannelName === constants.CENTRIFUGO,

    getToken: async() => {
      const apiPayload = await fetchCentrifugeToken(); // fetch the direct API payload to avoid stale state reads
      const data = apiPayload?.data || apiPayload || centrifugeTokenResponse;

      console.log( '[Centrifuge] Token Response', data, swicthingChannelName );
      if( !data?.token || !data?.serverUrl || !data?.expiry ){
        throw new Error( '[Centrifuge] Invalid centrifuge token response' );
      }

      return {
        token: data.token,
        expiry: data.expiry,
        serverUrl: data.serverUrl.replace( /^ws:/, 'wss:' )
      };
    },

    onMessage: message => {
      setMessages( { [channel]: message } )
      pushFromPubnub( '[Centrifuge] MESSAGES FROM EVENT', message )
    }
  } )

  const getuuid = () => {
    if( getSubscriberId() ){
      return getSubscriberId()
    }
    else if( getAnonymousId() ){
      return getAnonymousId()
    }
    else {
      return 'TATAPLAY_BINGE'
    }
  }

  useEffect( () => {
    if( responseData.currentPack && responseData.currentPack.productId ){
      myPlanProps.current = responseData.currentPack
      if( !myPlanProps.current?.appSelectionRequired && myPlanProps.current?.isFlexiPlan ){
        fetchverbiageDetails( { journey: getAppleJourneyStatus( myPlanProps.current?.appleDetails ) } )
      }
      if( myPlanProps.current?.primeAddOn?.addOnEligibility ){
        fetchverbiageDetails( { journey: getAppleJourneyStatus( myPlanProps.current?.appleDetails ) } )
      }
      const appsList = getAppList( myPlanProps );
      if( appsList.includes( PROVIDER_LIST.PRIME ) && myPlanProps.current.apvDetails.primaryIdentity ){
        initiateApplePrimeActivationPopup( appsList, myPlanProps );
      }
      else if( appsList.includes( PROVIDER_LIST.APPLETV ) && !appsList.includes( PROVIDER_LIST.PRIME ) ){
        initiateApplePrimeActivationPopup( appsList, myPlanProps );
      }
    }
  }, [responseData.currentPack, getActivatePopUpModalFlag(), isOnline] )

  const initiateApplePrimeActivationPopup = ( appsList, myPlanProps ) => {
    if( getActivatePopUpModalFlag() === APPLE_PRIME_ACTIVATION_JOURNEY.DONE_CTA_CLICKED && isOnline ){
      setActivatePopUpModalFlag( APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_PRIME_POPUP_INITIATED )
      const hasPrimeOrAppleAvaialble = appsList.includes( PROVIDER_LIST.PRIME ) || appsList.includes( PROVIDER_LIST.APPLETV )
      if( hasPrimeOrAppleAvaialble && !myPlanProps.current.downgradeRequested ){
        setTimeout( ()=> handlePopupCTA( entitlementStatusFetchData, myPlanProps ), 100 )
      }
      else {
        removeActivatePopUpModalFlag()
      }
    }
    else if( !isOnline ){
      handleCancelPopup()
    }
  }

  useEffect( () => {
    if( getProductName() ){
      setTimeout( () => {
        fetchverbiageDetails( { journey: getAppleJourneyStatus( myPlanProps.current?.appleDetails ) } )
      }, 3500 );
    }
  }, [getProductName()] )

  useEffect( ( )=>{
    if( verbiageDetailsResponse && isOnline ){
      flexiPlanVerbiagesContext.current = verbiageDetailsResponse
      const deboardingPopupVerbiages = verbiageDetailsResponse.data?.deboardingPopupVerbiages
      if( deboardingPopupVerbiages !== null && getMaxCardinalityReachedValue() && window.location.pathname.includes( '/discover' ) && getDeBoardingPopupCount() < configResponse?.deboardingPartnerPopupFrequency && getDeviceLaunchCount() !== getDeBoardingPopupCount() ){ // getDeviceLaunchCount() !== getDeBoardingPopupCount() -- details API is calling multiple times after login -- we need to show popup after login based upon configResponse?.deboardingPartnerPopupFrequency so added this check
        deboardingPopupVerbiagesRef.current = deboardingPopupVerbiages
        setDeBoardingPopupCount( getDeBoardingPopupCount() + 1 )
        focusReference.current = getCurrentFocusKey() ? getCurrentFocusKey() : 'HOME_CONTAINER'
        setIsFlexiPlanVerbiages( true )
        setTimeout( () => {
          if( modalFlexiPlanRef.current && !modalFlexiPlanRef.current.open ){
            modalFlexiPlanRef.current.showModal();
          }
        }, 0 );
      }
      else if( +getZeroAppPlanPopupOnRefresh() >= 1 && +getZeroAppPlanPopupOnRefresh() <= configResponse.flexiAppSelectionPopupFrequency ){
        setMixpanelData( 'zeroAppSource', 'APPLAUNCH' )
        focusReference.current = getCurrentFocusKey()
        setQRCodeSuccess( true )
      }
      else if( getZeroAppPlanPopupOnRefresh() === ZERO_PLAN_APPS_VERBIAGE.DURING_LOGIN_POPUP ){
        setMixpanelData( 'zeroAppSource', 'LOGIN' )
        focusReference.current = getCurrentFocusKey()
        setQRCodeSuccess( true )
        setZeroAppPlanPopupOnRefresh( 0 )
      }
      if( isPubnubWrapper.current ){
        setTimeout( () => {
          onLogin( true ); // Calling pubnub detail api after getting verbiage detail response as BE suggested
        }, 1000 ) // Adding 1 sec delay for wrapper call on login

        isPubnubWrapper.current = false
      }
    }
    else if( verbiageDetailsResponse && !isOnline ){
      hideFlexiModal()
    }
  }, [verbiageDetailsResponse, isOnline] )

  const hideFlexiModal = ( isDeviceRemovedOccurs ) =>{
    modalFlexiPlanRef.current?.close();
    setIsFlexiPlanVerbiages( false )
    if( !modalDom() ){
      setFocus( focusReference.current )
    }
    if( isDeviceRemovedOccurs ){
      setIsDeviceRemoved( true )
      setTimeout( () => {
        modalRef.current?.showModal();
      }, 10 );
    }
  }

  const pubnub = new PubNub( {
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    uuid: getuuid(),
    origin: 'tatasky.pubnubapi.com'
  } );

  const subscribeChannels = () => {
    pubnub.subscribe( {
      channels: [channel]
    } );

    const listener = {
      message( msg ){
        setMessages( {
          [channel]: msg
        } );
        pushFromPubnub( '[PUBNUB] MESSAGES FROM EVENT', msg )
      }
    };
    pubnub.addListener( listener );
    return listener;
  };

  const unsubscribePubNubChannels = listener => {
    pubnub.removeListener( listener );
    pubnub.unsubscribeAll();
  };

  // Subscribe to centrifugo once the client is connected and channel is ready
  useEffect( () => {
    if( swicthingChannelName === constants.CENTRIFUGO && !!isAuthReady && centrifugeClient.isConnected && !centrifugeClient.isSubscribed ){
      const channelName = getPubnubChannelName();
      if( channelName ){
        centrifugeClient.subscribe( channelName );
      }
    }
  }, [centrifugeClient.isConnected, centrifugeClient.isSubscribed] );

  useEffect( () => {
    if( channel ){
      let listener = null;
      if( swicthingChannelName === constants.PUBNUB ){
        listener = subscribeChannels();
      }
      listnerObj.current = listener
      return () => {
        unsubscribePubNubChannels( listener )
      }
    }
  }, [channel] );

  const send = message => {
    const publishConfig = {
      channel: channel,
      message
    };
    pubnub.publish( publishConfig, ( status, response ) => {
      // You can handle errors here
      console.log( 'Pubnub Error', status, response )
    } );
  }

  const fetchMessages = async( channel ) => {
    const res = await pubnub.fetchMessages( {
      channels: [channel],
      includeUUID: true,
      count: 1
    } )
    const messages = res && res.channels && res.channels[channel] && Array.isArray( res.channels[channel] ) && res.channels[channel][0] ? res.channels[channel][0] : {}
    return messages;
  }

  const isYourDeviceRemoved = () => {
    device_removed();
    document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;

    if( document.querySelector( '.NotificationsPopUpModal' ) ){
      hideFlexiModal( true )
    }
    else if( document.querySelector( '.ForceUpdatePopup__content' ) ){
      // ..
    }
    else {
      setQRCodeSuccess( false )
      setIsDeviceRemoved( true )
      setTimeout( () => {
        if( modalRef.current && !modalRef.current.open ){
          modalRef.current.showModal();
        }
      }, 10 );
    }
  }

  const isYourSuccessfullPurChase = ( boolean ) => {
    boolean && onLogin( false )
    setBaid( 0 )
    setTimeout( () => {
      setBaid( getBaID() )
    }, 0 );
  }

  const isYourAgeRatingUpdated = ( findProfileId ) => {
    findProfileId.ageRatingMasterMapping && setAgeRating( findProfileId.ageRatingMasterMapping )
  }

  const onUserLogout = () => {
    setQrLoginDetails( null );
    onLogoutAction( mixpanel, setProfileAPIResult, setResult, setResultForUnsubscribe, setCardProps, currentResponseCondition, historyObject.current, setCustomPageType, setDefaultPageType, previousPathName, successFullPlanPurchasePubnub, setSidebarList, setBaid, onLogout, onLogoutImage, setSubscriber, setResponse, setMetaData, setSonyLivPartnerToken, setBingeListRecord, setIsQrCodeJourney, setInitiateTimer )
  }

  const onLogout = () => {
    setChannel( null )
    setMessages( {} )
    setIsDeviceRemoved( false )
    modalRef.current?.close();
    centrifugeClient.disconnect?.(); // centrifuge disconnects on logout
    unsubscribePubNubChannels( listnerObj.current );
  }

  const onLogin = async( boolean, smartSubscriptionRefresh ) => {
    let header;
    const channelName = getPubnubChannelName()
    setChannel( channelName )
    if( channelName?.includes( 'rmn' ) ){
      header = {
        'rmn':  getRmn(),
        'pubnubCase': 'rmn'
      }
    }
    else if( channelName?.includes( 'sub' ) ){
      header = {
        'pubnubCase': 'sid'
      }
    }
    else if( channelName?.includes( 'acct' ) ){
      header = {
        'rmn':  getRmn(),
        'pubnubCase': 'account',
        'baId': getBaID()
      }
    }
    if( boolean ){
      pubNubDetailFetchData( header )
      setSmartSubscriptionRefresh( smartSubscriptionRefresh )
    }
    else {
      setMessages( {
        [channelName]: {}
      } );
    }
  }

  const pushFromPubnub = ( log, msg, smartSubscriptionRefresh = {} ) => {
    const pubnubPush = msg?.message || msg || {}
    const dthStatus = getDthStatus()
    const tvDeviceId = getTVDeviceId()
    const authToken = getAuthToken();
    const { playCTAClicked, provider } = smartSubscriptionRefresh;
    console.log( log, msg, authToken, tvDeviceId, myPlanProps, pubnubPush )
    if( pubnubPush ){
      if( primeManualBack.current ){
        primeManualBack.current = false
        primeStatusToastMessage( pubnubPush, receivePubnubAfterScanning )
      }
      if( Object.keys( pubnubPush ).length > 0 ){
        if( pubnubPush.enableAccountPubnubChannel ){ // if this is true then will go for swicthing to account based on this email -- Re: Ticket Update - Re: LG - Device Removal Behaviour is not as per expectation [#INC-584544]
          changedDthStatus.current = pubnubPush.dthStatus
          switchPubnubChannelHandling( pubnubPush.dthStatus, pubnubFetchData, constants.PUBNUB )
        }
        else if( dthStatus === USERS.DTH_OLD_STACK_USER ){ // dthstatus is not same with pubnub dth status because old vs new stack so removed else if and make if to else if here  -- Re: Ticket Update - Re: LG - Device Removal Behaviour is not as per expectation [#INC-584544]
          const oldStackDeviceList = getOldStackDeviceList( pubnubPush )
          const oldStackAgeRating = getOldStackAgeRating( pubnubPush )
          const oldStackSuccessfullPurchase = getOldStackSuccessfullPurchases( pubnubPush )
          const pubnubHistorydetails = getOldStackPubnubDetaills( pubnubPush );
          const ageRating = oldStackAgeRating && Array.isArray( oldStackAgeRating ) && oldStackAgeRating.find( data => data.profileId === getProfileId() )
          // ******************** Device ManagementPage Event ********************
          if( authToken && tvDeviceId && oldStackDeviceList && !oldStackDeviceList.find( data=> data.deviceId === tvDeviceId ) ){
            isYourDeviceRemoved()
          }
          // ******************** Sucessfull Purchase Event ********************
          else if( oldStackSuccessfullPurchase && myPlanProps.current?.productId && oldStackSuccessfullPurchase !== myPlanProps.current?.productId ){
            successFullPlanPurchasePubnub.current = true
            isYourSuccessfullPurChase( true )
          }
          // ******************** Age Rating Event ********************
          else if( ageRating && ageRating.ageRatingMasterMapping !== getAgeRating() ){
            isYourAgeRatingUpdated( ageRating )
          }
          // ******************** Smart Troubleshooting Mismatch Event ********************
          else if( playCTAClicked ){
            handleSubscriptionLogs( pubnubHistorydetails, myPlanProps.current, config, provider )
          }
          // ******************** Plan Expiry Event ********************
          else {
            isYourSuccessfullPurChase( false )
          }
          setBingePrimeStatusPeopleProperties( pubnubPush.apv?.status || PRIME.PACK_STATUS.NOT_ELIGIBLE )
          pubnubPush.apv?.primeNudge ? setExistingPrimePeopleProperties( MIXPANELCONFIG.VALUE.YES ) : setExistingPrimePeopleProperties( MIXPANELCONFIG.VALUE.NO )
        }
        else if( dthStatus !== USERS.DTH_OLD_STACK_USER ){
          const otherStackDeviceList = getOtherStackDeviceList( pubnubPush )
          const otherStackAgeRating = getOtherStackAgeRating( pubnubPush )
          const otherStackSuccessfullPurchaseStatus = getOtherStackSuccessfullPurchasesStatus( pubnubPush )
          const otherStackSuccessfullPurchaseTransactionId = getOtherStackSuccessfullPurchasesTransactionId( pubnubPush )
          const pubnubHistorydetails = getOldStackPubnubDetaills( pubnubPush );
          const ageRating = otherStackAgeRating && Array.isArray( otherStackAgeRating ) && otherStackAgeRating.find( data => data.profileId === getProfileId() )
          !getBingeSubscriberId() && pubnubPush.accountId && setBingeSubscriberId( pubnubPush.accountId )
          // ******************** Device ManagementPage Event ********************
          if( authToken && tvDeviceId && otherStackDeviceList && !otherStackDeviceList.find( data => data.deviceId === tvDeviceId ) ){
            isYourDeviceRemoved()
          }
          // ******************** Sucessfull Purchase Event ********************
          else if( otherStackSuccessfullPurchaseStatus === 'SUCCESS' && otherStackSuccessfullPurchaseTransactionId ){
            successFullPlanPurchasePubnub.current = true
            isYourSuccessfullPurChase( true )
          }
          // ******************** Age Rating Event ********************
          else if( ageRating && ageRating.ageRatingMasterMapping && ageRating.ageRatingMasterMapping !== getAgeRating() ){
            isYourAgeRatingUpdated( ageRating )
          }
          // ******************** Smart Troubleshooting Mismatch Event ********************
          else if( playCTAClicked ){
            handleSubscriptionLogs( pubnubHistorydetails, myPlanProps.current, config, provider )
          }
          // ******************** Plan Expiry Event ********************
          else {
            isYourSuccessfullPurChase( false )
          }
          setBingePrimeStatusPeopleProperties( pubnubPush.apv?.status || PRIME.PACK_STATUS.NOT_ELIGIBLE )
          pubnubPush.apv?.primeNudge ? setExistingPrimePeopleProperties( MIXPANELCONFIG.VALUE.YES ) : setExistingPrimePeopleProperties( MIXPANELCONFIG.VALUE.NO )
        }
      }
    }
  }

  const handleSubscriptionLogs = ( pubnubHistorydetails, myPlanProps, config, provider ) => {
    const { pkgId, subscriptionStatus } = pubnubHistorydetails || {}
    const { subscriptionStatus: newSubscriptionStatus = SUBSCRIPTION_STATUS.DEACTIVE, productId = constants.DEFAULT.toUpperCase() } = myPlanProps || {};
    if( ( subscriptionStatus === newSubscriptionStatus && pkgId === productId ) ){
      const refreshUserSubscription = getRefreshUserSubscription( config );
      const trackMaTriggerFrequency = getTrackMaTriggerFrequency( config );
      if( trackMaTriggerFrequency === 0 || ( trackMaTriggerFrequency >= 1 && getSmartTroubleshootingTrackEventCount() < trackMaTriggerFrequency && refreshUserSubscription > getSmartTroubleshootingTrackEventCount() ) ){
        trackMaTriggerFrequency !== 0 && setSmartTroubleshootingTrackEventCount( getSmartTroubleshootingTrackEventCount() + 1 );
        trackErrorEvents( MIXPANELCONFIG.EVENT.SUBSCRIBE_DETAILS_MATCHED, { ...SubscriptionNotFoundData } )
      }
      historyObject.current.push( redirection( myPlanProps ) );
    }
    else {
      console.log( 'Info--- set smart data pubnub', newSubscriptionStatus, productId, provider )
      setSmartSubscriptionStatus( { status: newSubscriptionStatus, pkgId: productId, provider: provider } );
      console.log( 'Info--- get smart data pubnub', getSmartSubscriptionStatus() )
      isYourSuccessfullPurChase( false );
    }
  }

  const closePopup = ( type ) => {
    setFocus( focusReference.current )
    setQRCodeSuccess( false )
    type === constants.QRCODE && zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.ZERO_APPS_NUDGE_CLOSE, myPlanProps.current )
  }

  const handleCancelPopup = () => {
    activateModalJourneyRef.current?.close();
    setShowActivatedModalJourney( false )
  }

  const hideJouneyModal = () =>{
    /* Mixpanel-event */
    if( statusOfPrimeAndAppleInfo.current.hasApplePrimeEnabled ){
      const combineProvider = `${APPLE_PRIME_ACTIVATION_JOURNEY.PRIME},${APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_TV}`
      appActivationPopupExit( combineProvider )
    }
    else if( statusOfPrimeAndAppleInfo.current.hasPrimeEnabled ){
      appActivationPopupExit( APPLE_PRIME_ACTIVATION_JOURNEY.PRIME )
    }
    else if( statusOfPrimeAndAppleInfo.current.hasAppleEnabled ){
      appActivationPopupExit( APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_TV )
    }
    setFocus( restoreFocusKeyRef.current )
    setIsActivePopUpOpen( null )
    removeActivatePopUpModalFlag()
    restoreActivePopupKey.current = null
    statusOfPrimeAndAppleInfo.current = {}
    handleCancelPopup()
  }

  const openActivateModalFn = () =>{
    modalDomClose()
    if( isDeviceRemoved ){
      return
    }
    restoreFocusKeyRef.current = getCurrentFocusKey() ? getCurrentFocusKey() : 'HOME_CONTAINER'
    setShowActivatedModalJourney( true )
    setTimeout( ()=>{
      if( activateModalJourneyRef.current && !activateModalJourneyRef.current.open ){
        activateModalJourneyRef.current.showModal();
      }
    }, 100 )
  }

  useEffect( ()=>{
    if( isActivePopUpOpen ){
      handlePopupCTA( entitlementStatusFetchData, myPlanProps )
    }
  }, [isActivePopUpOpen] )

  useEffect( () => {
    if( entitlementStatusResponse || entitlementStatusError ){
      if( entitlementStatusResponse && entitlementStatusResponse.data ){
        const updatedStatusInfo =  getUpdatedStatusInfo( entitlementStatusResponse, myPlanProps )
        if( updatedStatusInfo.primeEntitlementStatus === PRIME.PACK_STATUS.ACTIVATED && hasPrimeCtaClicked.current ){
          showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeActivationVerbiage || PRIME.ACTIVATED_MSG )
          hasPrimeCtaClicked.current = false
        }
        if( updatedStatusInfo.hasAppleEnabled || updatedStatusInfo.hasPrimeEnabled ){
          statusOfPrimeAndAppleInfo.current = { ...statusOfPrimeAndAppleInfo, ...updatedStatusInfo }
          openActivateModalFn()
        }
        else {
          removeActivatePopUpModalFlag()
        }
      }
    }
  }, [entitlementStatusResponse, entitlementStatusError] )

  useEffect( ()=>{
    if( pubnubResponse && pubnubResponse.data ){
      if( pubnubResponse.data.enableAccountPubnubChannel ){
        setDthStatus( changedDthStatus.current )
        setAccountBaid( pubnubResponse.data.channelName )
        onLogin( false )
      }
    }
    if( pubnubError ){
      onLogin( false )
    }
  }, [pubnubResponse, pubnubError] )

  useEffect( ()=>{
    if( pubNubDetailResponse && pubNubDetailResponse.data && pubNubDetailResponse.data.length > 1 ){
      const message =  pubNubDetailResponse.data[0]?.[0];
      setMessages( {
        [channel]: message
      } );
      pushFromPubnub( 'MESSAGES FROM RELOAD', message, smartSubscriptionRefresh )
    }
    else if( pubNubDetailError ){
      onLogin( false )
    }
  }, [pubNubDetailResponse, pubNubDetailError, smartSubscriptionRefresh] )

  const pubnubContextValue = useMemo( () => ( {
    messages,
    setMessages,
    send,
    onLogout,
    onLogin
  } ), [messages, setMessages, send, onLogout, onLogin] )

  return (
    <PubNubContext.Provider value={ pubnubContextValue }>
      <div ref={ ref }>
        {
          isOnline && (
            <>
              {
                isDeviceRemoved && (
                  <div>
                    <NotificationsPopUp
                      modalRef={ modalRef }
                      opener={ buttonRef }
                      iconName='Logout80x81'
                      message={ `Your device has been removed. You will be logged out` }
                      buttonLabel={ constants.DONE }
                      backButton={ constants.TOCLOSE }
                      showModalPopup={ isDeviceRemoved }
                      handleCancel={ onUserLogout }
                      buttonClicked={ onUserLogout }
                      focusShouldRetain={ 50 }
                    >
                    </NotificationsPopUp>
                  </div>
                )
              }
              {
                isFlexiPlanVerbiages && (
                  <div>
                    <NotificationsPopUp
                      modalRef={ modalFlexiPlanRef }
                      opener={ buttonRef }
                      iconName='CrownGoldForward24x24'
                      flexiPlanHeaderMessage={ deboardingPopupVerbiagesRef.current?.title }
                      flexiPlanSubHeaderMessage={ deboardingPopupVerbiagesRef.current?.subTitle }
                      buttonLabel={ deboardingPopupVerbiagesRef.current?.primaryButtonText }
                      backButton={ constants.TOCLOSE }
                      showModalPopup={ isFlexiPlanVerbiages }
                      handleCancel={ () => {
                        hideFlexiModal( false )
                      } }
                      buttonClicked={ () => {
                        hideFlexiModal( false )
                      } }
                      focusShouldRetain={ 0 }
                    >
                    </NotificationsPopUp>
                  </div>
                )
              }
              {
                showActivatedModalJourney && (
                  <div>
                    <ActivateJourneyPopUp
                      modalRef={ activateModalJourneyRef }
                      handleCancel={ () => handleCancelPopup( ) }
                      skipActivateJouneyModal={ hideJouneyModal }
                      historyObject={ historyObject }
                      applePrimePopupVerbiages={ applePrimePopupVerbiages }
                      entitlementStatusData={ statusOfPrimeAndAppleInfo.current }
                    />
                  </div>
                )
              }
              {
                showNotification && (
                  <div className='DeviceManagementPage__notification'>
                    <Notifications
                      iconName={ 'Success' }
                      message={ notificationMessage }
                    />
                  </div>
                )
              }
              {
                qrCodeSuccess && flexiPlanVerbiagesContext.current && myPlanProps.current && (
                  <QRCodeSucess
                    zeroAppsPlanCloseQrCode={ ()=> {
                      closePopup( constants.QRCODE )
                    } }
                    zeroAppsPlanCloseSuccessPopup={ ()=> {
                      closePopup( constants.SUCCESS )
                    } }
                    myPlan={ false }
                  />
                )
              }
            </>
          )
        }
        { children }
      </div>
    </PubNubContext.Provider>
  )
}

export default PubNubContextProvider;

/**
  * Context provider for react reuse
  * @type object
  */
export const PubNubContext = createContext();

/**
  * context provider
  * @type object
  */
export const usePubNubContext = ( ) => useContext( PubNubContext );
