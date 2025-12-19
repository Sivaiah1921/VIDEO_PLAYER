/* eslint-disable no-param-reassign */
import { interstitialScreenRedirection } from './commonHelper';
import { APPLETV, constants, APPLE_PRIME_ACTIVATION_JOURNEY, APPLE_REACTIVATION_KEYS, InterstitialPage_Routes, PROVIDER_LIST, APPLE_ERROR_STATUS_KEYS, PAGE_NAME, APPLE_REDIRECTION_KEYS } from './constants';
import { activateAppleTVSubscriptionClick, appleErrorInfo, applePlayCtaClicked } from './mixpanel/mixpanelService';
import { showToastMsg } from './util';

export const getAppleJourneyStatus = ( appledetails ) =>{
  if( APPLE_REACTIVATION_KEYS.includes( appledetails?.journey ) ){
    return appledetails.journey;
  }
  return APPLETV.CLAIM_STATUS.ENTITLED;
}

export const getAppleActivationFlagStatus = ( journeyStatus ) => {
  switch ( journeyStatus ){
    case APPLETV.CLAIM_STATUS.ENTITLED:
      return APPLETV.ACTIVATION;
    case APPLETV.CLAIM_STATUS.REACTIVATION_RENEW:
      return APPLETV.REACTIVATION;
    case APPLETV.CLAIM_STATUS.REACTIVATION_MIGRATION:
      return APPLETV.MIGRATION;
    default:
      return '';
  }
}

export const handleAppleInterstitialPageNav = ( redeemAppleUrl, history ) => {
  /** Mixpanel Events from PI PAGE & MediaCard & Series Details page */
  activateAppleTVSubscriptionClick( APPLE_PRIME_ACTIVATION_JOURNEY.PI_PAGE ) // Set Source value to PI-PAGE.
  interstitialScreenRedirection( history, redeemAppleUrl, PROVIDER_LIST.APPLETV, null, null, InterstitialPage_Routes.apple, false, false );
};

export const handleApplePlayBackLG = ( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon, responseSubscription, previousPathName, parentalPinFetchData, playEventFromPopupRef, metaData ) => {
  const journeyFlag = getAppleJourneyStatus( myPlanProps?.appleDetails )
  if( myPlanProps?.subscriptionStatus === constants.ACTIVE && APPLE_REDIRECTION_KEYS.includes( myPlanProps?.appleDetails?.entitlementStatus ) ){
    appleFetchData( { activationSource : APPLE_PRIME_ACTIVATION_JOURNEY.PI_PAGE, viaPopUp: getAppleActivationFlagStatus( journeyFlag ) } )
  }
  else if( myPlanProps?.subscriptionStatus === constants.ACTIVE && APPLE_ERROR_STATUS_KEYS.includes( myPlanProps?.appleDetails?.entitlementStatus ) ){
    showToastMsg( setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon )
    appleErrorInfo()
  }
  else if( myPlanProps?.subscriptionStatus === constants.ACTIVE && myPlanProps?.appleDetails?.entitlementStatus === APPLETV.CLAIM_STATUS.ACTIVATED ){
    playEventFromPopupRef.current = false
    parentalPinFetchData()
    /* Mixpanel-event */
    applePlayCtaClicked( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, previousPathName );
  }
}

export const handleApplePlayBackSamsung = ( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon ) => {
  const journeyFlag = getAppleJourneyStatus( myPlanProps?.appleDetails )
  if( myPlanProps?.subscriptionStatus === constants.ACTIVE && APPLE_REDIRECTION_KEYS.includes( myPlanProps?.appleDetails?.entitlementStatus ) ){
    appleFetchData( { activationSource : APPLE_PRIME_ACTIVATION_JOURNEY.PI_PAGE, viaPopUp: getAppleActivationFlagStatus( journeyFlag ) } )
  }
  else if( myPlanProps?.subscriptionStatus === constants.ACTIVE && myPlanProps?.appleDetails?.entitlementStatus === APPLETV.CLAIM_STATUS.ENTITLEMENT_INITIATED ){
    showToastMsg( setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon )
    appleErrorInfo()
  }
}