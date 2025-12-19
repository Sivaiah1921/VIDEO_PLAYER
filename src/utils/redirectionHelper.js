/* eslint-disable no-param-reassign */
import { getChannelPlayableStatus } from './commonHelper'
import constants, { PACKS, PAGE_TYPE, PROVIDER_LIST } from './constants'
import { getAllLoginPath, getCatalogFlag, getPiLevel, getProductName, getSearchFlag, setAllLoginPath, setLowerPlan, setZeroAppPlanPopupOnRefresh } from './localStorageHelper'
import { isDistroContent, isLiveContentType } from './slayer/PlayerService'
import { clearPILevelWhenComeBackToPI, handleDistroRedirection, setMixpanelData, storeAllPaths } from './util'

export const userHasLowerPlan = ( previousPathName, history ) => {
  previousPathName.isLowerPlanFirstTime = true
  setLowerPlan( true )
  history.push( {
    pathname: '/plan/current'
  } )
}

export const userComesFromSideMenu = ( history, myPlanProps ) => {
  history.push( {
    pathname: myPlanProps?.productId ? '/plan/current' : '/plan/subscription'
  } );
}

export const freemiumUserComesFromConfirmPurchase = ( history ) => {
  const indexRouter = getAllLoginPath().length
  history.go( -indexRouter )
  setAllLoginPath( [] )
}

export const paidUserComesFromConfirmPurchase = ( history ) => {
  history.push( {
    pathname: '/discover'
  } );
}

export const userComesFromPiPageOfSameRoute = ( previousPathName, metaData, history, myPlanProps ) => {
  const { liveChannelIds, subscriptionStatus } = myPlanProps || {};
  const route = previousPathName.current || previousPathName.navigationRouting
  const indexRouter = getAllLoginPath().length
  if( getCatalogFlag() === 'true' ){
    previousPathName.refreshPage = true
  }
  if( metaData && ( isLiveContentType( metaData.contentType ) || isDistroContent( metaData.provider ) ) && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, metaData.channelId ) ){
    setZeroAppPlanPopupOnRefresh( 0 )
    getCatalogFlag() === 'true' && setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.BROWSE_BY )
    getSearchFlag() === 'true' && setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.SEARCH )
    storeAllPaths( PAGE_TYPE.PLAYER )
    const args = {
      id: metaData.channelId,
      type: metaData.contentType,
      provider : metaData.provider
    }
    handleDistroRedirection( history, args )
  }
  else {
    history.go( -indexRouter )
    setAllLoginPath( [] )
  }
  const piLevelClear = getPiLevel()
  clearPILevelWhenComeBackToPI( piLevelClear, route )
}

export const userComesFromPiPageOfDifferentRoute = ( previousPathName, metaData, history, myPlanProps ) => {
  const { liveChannelIds, subscriptionStatus, appSelectionRequired, apps, maxCardinalityReached, addonPartnerList } = myPlanProps || {};
  const availablePartner = Array.isArray( apps ) ? apps.map( item => item?.title?.toLowerCase() ) : [];
  const route = previousPathName.current || previousPathName.navigationRouting
  const indexRouter = getAllLoginPath().length
  if( metaData && ( isLiveContentType( metaData.contentType ) || isDistroContent( metaData.provider ) ) && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, metaData.channelId ) ){
    setZeroAppPlanPopupOnRefresh( 0 )
    setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.DETAIL_SCREEN )
    storeAllPaths( '/content/detail' )
    storeAllPaths( PAGE_TYPE.PLAYER )
    const args = {
      id: metaData.channelId,
      type: metaData.contentType,
      provider : metaData.provider
    }
    handleDistroRedirection( history, args )
  }
  else {
    if( previousPathName.isFromPrimeMarketingAsset ){
      previousPathName.refreshPage = true
      if( appSelectionRequired || maxCardinalityReached ){ // Even Guest user Clicks PrimeMarketing Asset he needs to Land to HomePages Based on Eligibility
        history.push( '/discover' )
      }
      else if( getProductName() === PACKS.FREEMIUM ){
        previousPathName.primeRedirectionPage = PAGE_TYPE.SUBSCRIPTION
        history.push( '/plan/subscription' )
      }
      else if( getProductName() !== PACKS.FREEMIUM && ( availablePartner.includes( PROVIDER_LIST.PRIME ) || addonPartnerList?.map( String ).some( partner => partner.toLowerCase() === PROVIDER_LIST.PRIME ) ) ){
        history.push( '/discover' )
      }
      else {
        previousPathName.primeRedirectionPage = PAGE_TYPE.SUBSCRIPTION
        history.push( '/plan/subscription' )
      }
    }
    else {
      history.go( -indexRouter )
    }
    setAllLoginPath( [] )
  }
  const piLevelClear = getPiLevel()
  clearPILevelWhenComeBackToPI( piLevelClear, route )
}

export const userComesFromPiPageOfPreviousPathName = ( history, previousPathName ) => {
  setAllLoginPath( [] )
  history.push( {
    pathname: previousPathName.current || previousPathName.navigationRouting
  } )
  previousPathName.current = null
}

export const redirectToHome = ( history ) => {
  history.push( {
    pathname: '/discover'
  } );
}