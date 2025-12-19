/* eslint-disable no-param-reassign */
import { APPLETV, APPLE_PRIME_ACTIVATION_JOURNEY, COMMON_HEADERS, PRIME, PROVIDER_LIST, SECTION_SOURCE, SUBSCRIPTION_STATUS, isTizen } from './constants';
import { getAppleToastInfo, getAuthToken, getBingeListFlag, getCatalogFlag, getDthStatus, getGuestMixPanelId, getSearchFlag, setGuestMixPanelId, setSmartTroubleshootingRefreshCount, setSmartTroubleshootingTrackEventCount } from './localStorageHelper';
import { identifyUser } from './mixpanel/mixpanel';
import { appActivationPopup } from './mixpanel/mixpanelService';
import { MIXPANEL_RAIL_TYPE } from './util';
import mixpanel from 'mixpanel-browser';
import * as Sentry from '@sentry/react';
import { getDeviceId, getWebosVersion } from '../views/core/RegisterContextProvider/RegisterContextProvider';


export const getSubscriptionStatus = ( myPlanProps, statusRequested ) => {
  return myPlanProps?.subscriptionStatus === statusRequested;
}

export const getProviderWithToken = ( provider, providerRequested ) => {
  return getAuthToken() && provider?.toLowerCase() === providerRequested
}

export const getProviderWithoutToken = ( provider, providerRequested ) => {
  return provider?.toLowerCase() === providerRequested
}

export const handlePopupCTA = ( entitlementStatusFetchData, myPlanProps ) => {
  const appsList = getAppList( myPlanProps );
  const partners = [PROVIDER_LIST.APPLETV, PROVIDER_LIST.PRIME]
    .filter( provider => appsList.includes( PROVIDER_LIST[provider.toUpperCase()] ) )
    .join( ',' );
  entitlementStatusFetchData( {
    primePrimaryIdentity: myPlanProps.current?.apvDetails?.primaryIdentity || '',
    partners: partners
  } );
}

export const getUpdatedStatusInfo = ( entitlementStatusResponse, myPlanProps ) => {
  const appsList = getAppList( myPlanProps )
  const appleStatus = appsList.includes( PROVIDER_LIST.APPLETV ) && entitlementStatusResponse?.data?.appleStatus?.entitlementStatus === APPLETV.CLAIM_STATUS.ENTITLED
  const primeStatus = appsList.includes( PROVIDER_LIST.PRIME ) && entitlementStatusResponse?.data?.primeStatus?.entitlement_status === PRIME.PACK_STATUS.ENTITLED
  const updatedStatusInfo = {
    hasApplePrimeEnabled: appleStatus && primeStatus,
    hasAppleEnabled: appleStatus,
    hasPrimeEnabled: primeStatus,
    primeActivation_url: entitlementStatusResponse?.data?.primeStatus?.activation_url,
    appleActivation_url: entitlementStatusResponse?.data?.appleStatus?.appleactivationUrl,
    primeEntitlementStatus: entitlementStatusResponse?.data?.primeStatus?.entitlement_status
  }
  /* Mixpanel-event */
  if( updatedStatusInfo.hasApplePrimeEnabled ){
    const combineProvider = `${APPLE_PRIME_ACTIVATION_JOURNEY.PRIME},${APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_TV}`
    appActivationPopup( combineProvider )
  }
  else if( updatedStatusInfo.hasPrimeEnabled ){
    appActivationPopup( APPLE_PRIME_ACTIVATION_JOURNEY.PRIME )
  }
  else if( updatedStatusInfo.hasAppleEnabled ){
    appActivationPopup( APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_TV )
  }
  return updatedStatusInfo
}

export const interstitialScreenRedirection = ( history, activation_url, provider, providerContentId, type, pathName, isFromActivationPopup, isFromHeroBanner ) => {
  const args = {
    activation_url: activation_url,
    provider: provider,
    providerContentId: providerContentId,
    type: type,
    isFromActivationPopup: isFromActivationPopup,
    isFromHeroBanner: isFromHeroBanner
  }
  history.push( {
    pathname: pathName,
    args: args
  } )
}

export const getAppList = ( myPlanProps ) => {
  return myPlanProps.current?.apps?.map( item => item.title?.toLowerCase() ) || [];
}

export const getRefreshUserSubscription = ( config ) => {
  return config?.smartTroubleShooting?.refreshUserSubscription;
}

export const getTrackMaTriggerFrequency = ( config ) => {
  return config?.smartTroubleShooting?.trackMaTriggerFrequency;
}

/**
 * Set Smart troubleshooting count and frequency to initial state on app launch...
 */
export const initializeUserSubscriptionST = () => {
  setSmartTroubleshootingRefreshCount( 0 );
  setSmartTroubleshootingTrackEventCount( 0 );
}

export const getRailTypeOnHome = ( rail ) => {
  if( rail.sectionSource === SECTION_SOURCE.CONTINUE_WATCHING ){
    return MIXPANEL_RAIL_TYPE.CONTINUE_WATCHING
  }
  return rail.railType || MIXPANEL_RAIL_TYPE.EDITORIAL
}

export const getActiveSubscriptionStatus = ( subscriptionStatus ) =>{
  return subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE
}

export const getChannelPlayableStatus = ( liveChannelIds, subscriptionStatus, currentChannel ) =>{
  return getActiveSubscriptionStatus( subscriptionStatus ) && liveChannelIds?.includes( currentChannel?.toString() );
}

export const checkAppleStatusExist = () => getAppleToastInfo() && Object.keys( getAppleToastInfo() ).length > 0;

export const updateHBRailWithBingeListFav = ( railItems, bingeListFavData ) => {
  if( railItems?.length > 0 && bingeListFavData?.length > 0 ){
    return railItems.map( railItem => (
      { ...railItem, isFavourite: bingeListFavData.find( item => item.contentId === railItem.id ) }
    ) )
  }
  return railItems;
}

export const convertHexToRgba = ( hex = '#000000', alpha = 0 ) => {
  const cleanHex = hex?.replace( '#', '' ) || '' ;
  const r = parseInt( cleanHex.substring( 0, 2 ), 16 );
  const g = parseInt( cleanHex.substring( 2, 4 ), 16 );
  const b = parseInt( cleanHex.substring( 4, 6 ), 16 );
  return `${ r }, ${ g }, ${ b }, ${ alpha }`;
};

export const getIcon = ( item ) => {
  switch ( item ){
    case '1 Month':
    case 'Monthly':
      return 'Monthly';
    case '3 Months':
    case 'Quarterly':
      return 'Quarterly';
    case '6 Months':
    case 'Semi Annually':
      return 'SemiAnnually';
    case '12 Months':
    case 'Yearly':
    case 'Annually':
      return 'Yearly';
  }
}

export const initializeAnalyticsEvents = () => {
  mixpanel.init( process.env.REACT_APP_MIXPANEL_KEY, {
    debug: process.env.REACT_APP_NODE_ENV !== 'production',
    loaded: async function( mixpanel ){
      if( getAuthToken() ){
        identifyUser()
      }
      else if( !getAuthToken() ){
        if( getGuestMixPanelId() ){
          mixpanel.identify( getGuestMixPanelId() );
        }
        else {
          mixpanel.register( { 'distinct_id': mixpanel.get_distinct_id() } )
          mixpanel.get_distinct_id() && setGuestMixPanelId( mixpanel.get_distinct_id() )
        }
      }
      getWebosVersion();
      getDeviceId();
    }
  } )

  // eslint-disable-next-line no-console
  console.log( 'isTizen', isTizen )

  const getSubPageInfo = () => {
    if( getBingeListFlag() === 'true' ){
      return 'BINGELIST_PAGE'
    }
    else if( getSearchFlag() === 'true' ){
      return 'SEARCH_PAGE'
    }
    else if( getCatalogFlag() === 'true' ){
      return 'CATALOG_PAGE'
    }
    else {
      return 'NA'
    }
  }

  function detectPlatform(){
    const agentKey = navigator.userAgent;
    if( window.location.hostname === 'localhost' ){
      return 'Local';
    }
    if( /Tizen/i.test( agentKey ) ){
      return 'Tizen';
    }
    if( /Web0S|webOS|LG|LG Browser/i.test( agentKey ) ){
      return 'LG';
    }
    return '';
  }

  function isLowEndDevice(){
    const { deviceMemory, hardwareConcurrency } = window.navigator;
    return deviceMemory < 2 || hardwareConcurrency < 2;
  }

  function safeParseLocalKeys( storageKey ){
    try {
      if( !window || !( 'localStorage' in window ) || !window.localStorage ){
        return null;
      }
      const storedValue = window.localStorage.getItem( storageKey );
      if( storedValue === null || storedValue === undefined ){
        return null;
      }
      return JSON.parse( storedValue );
    }
    catch ( e ){
      return null;
    }
  }

  const ignoreVideoErrors = [
    /AbortError.*video/i,
    /NotSupportedError.*codec/i,
    /QuotaExceededError/i,
    /buffer.*underflow/i
  ];
  // eslint-disable-next-line no-console
  Sentry.init( {
    dsn: isTizen ? process.env.REACT_APP_SENTRY_SAMSUNG : process.env.REACT_APP_SENTRY_LG,
    integrations: [new Sentry.BrowserProfilingIntegration(), new Sentry.BrowserTracing()],
    beforeSend( event, hint ){
      // const error = hint.originalException;
      const contentLevelInfo = safeParseLocalKeys( 'contentRailPositionData' ) || {};
      const PageLevelInfo = safeParseLocalKeys( 'mixpanelInformation' ) || {};

      event.contexts.contentErrorInfo = {
        location: window.location.pathname,
        SubPageInfo : getSubPageInfo(),
        platForm: detectPlatform(),
        RMN: JSON.parse( window.localStorage?.RMN ) || 'Guest User',
        pageType: PageLevelInfo?.optionValue || '',
        contentname: contentLevelInfo?.contentPartner || '',
        contentPosition: contentLevelInfo?.contentPosition || '',
        contentTitle: contentLevelInfo?.contentTitle || '',
        railTitle: contentLevelInfo?.railTitle || '',
        railPoision: contentLevelInfo?.railPosition || '',
        sectionSource: contentLevelInfo?.sectionSource || ''
      };

      // Skip performance monitoring on low-end devices
      if( isLowEndDevice() && ( event.type === 'transaction' || event.type === 'profile' ) ){
        return null;
      }

      if( ignoreVideoErrors.some( regex => regex.test( event.message ) ) ){
        return null;
      }

      // eslint-disable-next-line no-console
      console.log( 'SentryErros-\n EventInfo =>', event, '\n Hint =>', hint )
      // eslint-disable-next-line no-console
      return event;
    },
    tracesSampleRate: 0.1, // reducing sample rate to 20% due low end devices have impact on performace.
    profilesSampleRate: 0.01,
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 0.3,
    environment: process.env.REACT_APP_NODE_ENV,
    release: `binge@${ COMMON_HEADERS.VERSION }`,
    debug_mode: process.env.NODE_ENV !== 'production'
  } );
}

export const getStringToArray = ( content ) => {
  if( Array.isArray( content ) ){
    return content[0] || '';
  }

  if( typeof content === 'string' ){
    return content.split( ',' ).map( item => item.trim().replace( /^['"]|['"]$/g, '' ) ).filter( Boolean )[0] || '';
  }

  return '';
}