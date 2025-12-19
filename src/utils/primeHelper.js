/* eslint-disable no-param-reassign */
import get from 'lodash/get'
import { getSubscriptionStatus, interstitialScreenRedirection } from './commonHelper'
import { InterstitialPage_Routes, PAGE_TYPE, PRIME, SUBSCRIPTION_STATUS, PROVIDER_LIST } from './constants'
import { getBingeListFlag, getCatalogFlag, getSearchFlag } from './localStorageHelper'
import { showToastMsg } from './util'

export const handlePrimeCTA = ( myPlanProps, entitlementStatusFetchData, parentalPinFetchData, handleSubscriptionRedirection ) => {
  const primePackStatus = [PRIME.PACK_STATUS.ENTITLED, PRIME.PACK_STATUS.PENDING, PRIME.PACK_STATUS.SUSPEND, PRIME.PACK_STATUS.EMPTY, PRIME.PACK_STATUS.CANCELLED]
  if( getPrimeNudgeStatus( {}, {}, myPlanProps ) ){
    parentalPinFetchData()
  }
  else if( getPrimeStatus( {}, myPlanProps?.apvDetails?.primePackStatus, PRIME.PACK_STATUS.CANCELLED ) && getSubscriptionStatus( myPlanProps, SUBSCRIPTION_STATUS.DEACTIVE ) && !( myPlanProps?.addonPartnerList?.map( String ).some( partner => partner.toLowerCase() === PROVIDER_LIST.PRIME ) ) ){
    handleSubscriptionRedirection();
  }
  else if( getPrimeStatus( {}, myPlanProps?.apvDetails?.primePackStatus, PRIME.PACK_STATUS.ACTIVATED ) ){
    parentalPinFetchData()
  }
  else if( primePackStatus.includes( myPlanProps?.apvDetails?.primePackStatus ) ){
    entitlementStatusFetchData( { primePrimaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } );
  }
}

export const handleStatusResponsePrime = ( entitlementStatusResponse, entitlementStatusError, history, config, myPlanProps, provider, providerContentId, type, pubnubStatus = {}, setNotificationIcon = () => {}, setNotificationMessage = () => {}, setShowNotification = () => {} ) => {
  if( entitlementStatusResponse?.data?.primeStatus && Object.keys( entitlementStatusResponse.data.primeStatus ).length > 0 ){
    const primeStatus = entitlementStatusResponse.data.primeStatus;
    switch ( true ){
      case getPrimeStatus( pubnubStatus, primeStatus.entitlement_status, PRIME.PACK_STATUS.ACTIVATED ):
        setTimeout( () => {
          showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeActivationVerbiage || PRIME.ACTIVATED_MSG )
        }, 1000 );
        break;
      case getPrimeStatus( pubnubStatus, primeStatus.entitlement_status, PRIME.PACK_STATUS.PENDING ):
      case getPrimeStatus( pubnubStatus, primeStatus.entitlement_status, PRIME.PACK_STATUS.SUSPEND ):
        showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeSubProcessMessage || PRIME.PENIDNG_MSG, setNotificationIcon )
        break;
      case getPrimeStatus( pubnubStatus, primeStatus.entitlement_status, PRIME.PACK_STATUS.ENTITLED ):
        if( primeStatus.activation_url ){
          interstitialScreenRedirection( history, primeStatus.activation_url, provider, providerContentId, type, InterstitialPage_Routes.prime )
        }
        else {
          showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeSubProcessMessage || PRIME.PENIDNG_MSG, setNotificationIcon )
        }
        break;
      case getPrimeStatus( pubnubStatus, primeStatus.entitlement_status, PRIME.PACK_STATUS.CANCELLED ):
        if( myPlanProps?.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE && primeStatus.activation_url ){
          interstitialScreenRedirection( history, primeStatus.activation_url, provider, providerContentId, type, InterstitialPage_Routes.prime )
        }
        else if( !primeStatus.activation_url ){
          showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeSubProcessMessage || PRIME.PENIDNG_MSG, setNotificationIcon )
        }
        break;
    }
  }
  else if( entitlementStatusError?.code !== 0 ){
    // todo set error
    showToastMsg( setShowNotification, setNotificationMessage, config?.primeVerbiages?.primeSubProcessMessage || PRIME.PENIDNG_MSG, setNotificationIcon )
  }
}

export const primeStatusToastMessage = ( pubnubPush, ref ) => {
  if( window.location.pathname.includes( PAGE_TYPE.CONTENT_DETAIL ) || Boolean( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' ) ){
    const apv = get( pubnubPush, 'apv', {} )
    if( apv && apv.status && apv.status !== PRIME.PACK_STATUS.ENTITLED ){
      ref.current = apv
    }
  }
}

export const getPrimeStatus = ( pubnubRes, primeStatus, statusRequired ) => {
  const data = [pubnubRes?.status, primeStatus];
  return data.includes( statusRequired ) || ( statusRequired === PRIME.PACK_STATUS.ENTITLED && ( pubnubRes?.status === '' || primeStatus === '' || primeStatus === null ) ) // TODO : can we use !primeStatus instead of  (primeStatus === '' || primeStatus === null)
}

export const getPrimeNudgeStatus = ( pubnubRes, apvStatus, myPlanProps ) => {
  return getPrimeStatus( pubnubRes, ( apvStatus?.data?.primeStatus?.entitlement_status || myPlanProps?.apvDetails?.primePackStatus ), PRIME.PACK_STATUS.ENTITLED ) && ( pubnubRes?.primeNudge || apvStatus?.data?.primeStatus?.primeNudge || myPlanProps?.apvDetails?.primeNudge );
}