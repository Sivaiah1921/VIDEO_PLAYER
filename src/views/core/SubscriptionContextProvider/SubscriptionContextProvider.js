/* eslint-disable no-console */
/**
 * The SubscriptionContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/SubscriptionContextProvider/SubscriptionContextProvider
 */
import React, { useContext, createContext, useEffect, useState, useRef, useMemo } from 'react';
import { getAuthToken, getBaID, getDthStatus, getLowerPlan, getProductName, getRmn, getSmartSubscriptionStatus, getSubscriberId, getUserInfo, removeSmartSubscriptionStatus, removeUserSelectedApps, removeZeroAppPlanPopupOnRefresh, removelowerPlan, setBingeProduct, setLowerPlan, setMaxCardinalityReachedValue, setProductName, setShowPromoBanner, setUserInfo, setUserSelectedApps } from '../../../utils/localStorageHelper';
import { MyPlanSetupService, formatResponse } from '../../../utils/slayer/MyPlanSetupService';
import { PackListCall } from '../../../utils/slayer/SubscriptionPackageService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useLoginContext } from '../../core/LoginContextProvider/LoginContextProvider';
import { useUserContext } from '../UserContextProvider/UserContextProvider';
import constants, { PACKS, PAGE_TYPE, SUBSCRIPTION_STATUS, USERS } from '../../../utils/constants';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { setBingeListPeopleProperties, setUserProperties } from '../../../utils/mixpanel/mixpanel';
import { BingeListCall } from '../../../utils/slayer/HomeService';
import { useMaintainPageState } from '../MaintainPageStateProvoder/MaintainPageStateProvoder';
import { smartSubscriptionRefresh } from '../../../utils/mixpanel/mixpanelService';
import { redirection } from '../../../utils/util';
import { useHistoryContext } from '../HistoryContextProvider/HistoryContextProvider';

/**
   * Represents a SubscriptionContextProvider component
   *
   * @method
   * @param { Object } props - React properties passed from composition
   * @returns SubscriptionContextProvider
   */
export const SubscriptionContextProvider = function( { children } ){
  const [baid, setBaid] = useState()
  const [result, setResult] = useState()
  const [resultForUnsubscribe, setResultForUnsubscribe] = useState()
  const [cardProps, setCardProps] = useState( [] )
  const [userDetails, setUserDetails] = useState( {} )
  const [currentUserInfo, setCurrentUserInfo] = useState( {} )
  const [bingeListRecord, setBingeListRecord] = useState( [] )

  const currentResponseCondition = useRef( {} )

  const [currentPlan] = MyPlanSetupService()
  const { fetchData, response, error, loading } = currentPlan || {}
  const [packList] = PackListCall();
  const { fetchData: fetchPackList } = packList || {}
  const { subscriber, setSubscriber } = useLoginContext( ) || {};
  const { user } = useUserContext() || {}
  const { profileAPIResult } = useProfileContext();
  const { flexiPlanVerbiagesContext } = useMaintainPageState() || null

  const [bingeListData] = BingeListCall()
  const { bingeListFetchData, bingeListResponse, bingeListError, bingeListLoading } = bingeListData
  const historyObject = useHistoryContext();

  useEffect( () => {
    if( getAuthToken() ){
      bingeListFetchData()
    }
    else {
      setCurrentUserInfo( {} )
      setUserDetails( {} )
      setResult( {} )
      setResultForUnsubscribe( {} )
      setCardProps( [] )
    }
  }, [getAuthToken()] )

  useEffect( ()=>{
    if( bingeListResponse && bingeListResponse.data ){
      setBingeListPeopleProperties( bingeListResponse.data.totalBingeListCount )
      setBingeListRecord( bingeListResponse.data.list )
    }
  }, [bingeListResponse] )

  useEffect( () => {
    if( Object.keys( user ).length ){
      const userDetails = {
        sid : user.subscriberId,
        lastPackType : user.lastPackType,
        lastPackPrice : user.lastPackPrice,
        lastPackName : user.lastPackName,
        lastBillingType : user.lastBillingType,
        totalPaidPackRenewal : user.totalPaidPackRenewal,
        firstPaidPackSubscriptionDate : user.firstPaidPackSubscriptionDate,
        deviceLoginCount : user.deviceLoginCount,
        firstTimeLoginDate : user.firstTimeLoginDate,
        mixpanelId: user.mixpanelid,
        profileName: user.profileName
      }
      setUserDetails( userDetails )
    }
  }, [user] )

  useEffect( ()=>{
    if( baid && baid !== 0 ){
      fetchData( {
        'baId': baid,
        'dthStatus': getDthStatus(),
        'accountId': getSubscriberId()
      } )
    }
  }, [baid] )

  useEffect( ()=>{
    fetchPackList( {
      'baId': baid,
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    } )
  }, [getAuthToken()] )

  useEffect( ()=>{
    if( getAuthToken() && response && response.data ){
      setBingeProduct( response.data.bingeProduct || '' )
      if( response.data.productId && response.data.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE ){
        setProductName( response.data.productName )
        response.data?.userSelectedApps ? setUserSelectedApps( response.data.userSelectedApps ) : removeUserSelectedApps()
        !response.data?.appSelectionRequired && removeZeroAppPlanPopupOnRefresh()
      }
      else {
        setProductName( PACKS.FREEMIUM )
      }
      response.data.maxCardinalityReached && setMaxCardinalityReachedValue( response.data?.maxCardinalityReached )
      response.data.apvDetails && setShowPromoBanner( response.data.apvDetails?.showPromoBanner )
      if( !window.location.pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) ){
        if( response.data.openFSUpgrade ){
          setLowerPlan( true )
        }
        else if( !response.data.openFSUpgrade ){
          if( getLowerPlan() ){
            removelowerPlan()
            fetchPackList( {
              'baId': getBaID() ? getBaID() : null,
              'dthStatus': getDthStatus(),
              'accountId': getSubscriberId()
            } )
          }
          else {
            removelowerPlan()
          }
        }
      }
      response.data.productId ? currentResponseCondition.current = true : currentResponseCondition.current = false
      const { myPlanProps, selectCardProps, myPlanPropsForNonSubscribe } = formatResponse( response, flexiPlanVerbiagesContext )
      setResult( myPlanProps )
      setResultForUnsubscribe( myPlanPropsForNonSubscribe )
      setCardProps( selectCardProps )
      const userData = response.data
      const currentPlanData = {
        rmn: getRmn(),
        stack: getDthStatus() === USERS.DTH_OLD_STACK_USER ? constants.SIEBEL : constants.COMVIVA,
        subscriptionType : userData.subscriptionType,
        packCreationDate : userData.packCreationDate,
        bingeAccountCount : 0,
        subscribed : ( getProductName() !== PACKS.FREEMIUM ) ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
        firstTimeLogin : userData?.firstTimeLogin,
        loginWith : subscriber?.login || 'RMN',
        planType: userData.subscriptionType || PACKS.ADD_PACK_FREEMIUM,
        subscriptionPlanType: userData.subscriptionPackType || PACKS.ADD_PACK_FREEMIUM,
        packPrice : userData.amountValue || '0.00',
        packName : userData.productName || PACKS.ADD_PACK_FREEMIUM,
        migrated : userData.migrated,
        freeTrialAvailed : userData.freeTrialTaken,
        freeTrialEligible: userData.freeTrialEligible,
        packRenewalDate : userData.rechargeDue,
        packEndDate : userData.expiryDateWithTime,
        packStartDate : userData.packCreationDate,
        packDuration: userData.packDuration,
        fireTV: MIXPANELCONFIG.VALUE.NO,
        burnType: userData.burnType,
        tsSid: getDthStatus() === USERS.NON_DTH_USER ? getRmn() : user.subscriberId,
        packType: userData.tenure?.[0]?.tenureName,
        renewalDueDate:  userData.expiryDate,
        packId: userData.productId || PACKS.ADD_PACK_FREEMIUM,
        tenure: userData.currentTenure || userData.currentTenureOpen || PACKS.ADD_PACK_FREEMIUM,
        appleCoupanStatus: userData.bingeAppleState,
        nonSubscribedPartnerList: userData.nonSubscribedPartnerList,
        deboardedPartnersList: userData.deboardedPartnersList || [],
        searchDeboardedPartnersList: userData.searchDeboardedPartnersList || [],
        marketingAssetList: userData.marketingAssetList || [],
        primeMixpanelInfo: userData.apvDetails?.primeMixpanelInfo || {},
        primeAddOn: userData.primeAddOn || {},
        addonPartnerList: userData.addonPartnerList || [],
        primeAddOnMixpanelInfo: userData.apvDetails?.primeAddOnMixpanelInfo || {},
        subscriptionStatus: userData.subscriptionStatus
      }
      setCurrentUserInfo( currentPlanData )
      if( getUserInfo() ){
        setUserInfo( { ...JSON.parse( getUserInfo() ), ...currentPlanData } )
        setUserProperties( JSON.parse( getUserInfo() ) )
      }

      console.log( 'Info--- get smart data subscription', getSmartSubscriptionStatus(), myPlanProps.productId, myPlanProps.subscriptionStatus )
      // MixPanel Event -- Smart Subscription Status
      if( getSmartSubscriptionStatus() ){
        const info = getSmartSubscriptionStatus();
        const { productId = constants.DEFAULT.toUpperCase(), subscriptionStatus = SUBSCRIPTION_STATUS.DEACTIVE } = myPlanProps;
        if( info.pkgId === productId && info.status === subscriptionStatus ){
          historyObject.current.push( redirection( myPlanProps ) );
        }
        else {
          smartSubscriptionRefresh( info.provider, subscriptionStatus );
        }
        removeSmartSubscriptionStatus();
      }
    }
  }, [response] )

  useEffect( ()=>{
    if( getAuthToken() && !getUserInfo() && profileAPIResult && profileAPIResult.data && currentUserInfo && Object.keys( currentUserInfo ).length > 0 && userDetails && Object.keys( userDetails ).length > 0 ){
      let profileDetails = {}
      if( profileAPIResult && profileAPIResult.data ){
        const profileResponse = profileAPIResult.data;
        profileDetails = {
          firstName: profileResponse.firstName,
          lastName: profileResponse.lastName,
          profileId: profileResponse.profileId,
          email: profileResponse.email,
          autoPlayTrailer: profileResponse.autoPlayTrailer
        }
      }
      setUserInfo( { ...currentUserInfo, ...userDetails, ...profileDetails } )
      setUserProperties( JSON.parse( getUserInfo() ) )
    }
  }, [userDetails, currentUserInfo, profileAPIResult] )

  const subscriptionContextValue = useMemo( () => ( {
    responseData: {
      currentPack: result,
      allPacks: packList,
      currentPackForUnsubscribe: resultForUnsubscribe
    },
    setBaid,
    setResult,
    setResultForUnsubscribe,
    currentResponseCondition,
    error,
    cardProps,
    response,
    setCardProps,
    loading,
    fetchPackList,
    bingeListRecord,
    setBingeListRecord
  } ), [
    result,
    packList,
    resultForUnsubscribe,
    currentResponseCondition,
    error,
    cardProps,
    response,
    loading,
    fetchPackList,
    bingeListRecord
  ] );
  return (
    <SubscriptionContext.Provider value={ subscriptionContextValue } >
      { children }
    </SubscriptionContext.Provider>
  )
}

export default SubscriptionContextProvider;

/**
   * Context provider for react reuse
   * @type object
   */
export const SubscriptionContext = createContext();

/**
   * context provider
   * @type object
   */
export const useSubscriptionContext = ( ) => useContext( SubscriptionContext );