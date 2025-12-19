/* eslint-disable no-console */
import { serviceConst } from './serviceConst';
import {
  COMMON_HEADERS,
  PAGE_TYPE,
  LAYOUT_TYPE,
  PACKS,
  SECTION_SOURCE,
  ABMainFeature,
  recommendationUrlSuffixes
} from '../../utils/constants';
import { getAnonymousId, getAuthToken, getProfileId, getDthStatus, getBaID, getSubscriberId, getRmn, getBingeProduct, getUserSelectedApps } from '../localStorageHelper';
import axios from 'axios';
import { ensureTrailingSlash, getABTestingFeatureConfig } from '../util';

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

// keep track of the previous cancel token
let chipRailCancelToken;

export const RecommendedLangService = async() => {
  const authToken = getAuthToken();
  const isGuest = !authToken;
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const url = isGuest ? ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_PL :
    serviceConst.TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL ) :
    ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_PL :
      serviceConst.TA_LANGUAGE_RECOMMENDATION_URL );

  const headers = {
    ...( isGuest && { anonymousId: getAnonymousId() } ),
    profileId: getProfileId(),
    ...( authToken && {
      authorization: authToken,
      bingeproduct: getBingeProduct()
    } ),
    dthstatus: getDthStatus() || PACKS.GUEST,
    platform: COMMON_HEADERS.RECO_PLATFORM,
    ...( getBaID() && { baid: getBaID() } ),
    ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
    pagetype: PAGE_TYPE.DONGLE_HOMEPAGE,
    appVersion: COMMON_HEADERS.VERSION
  };

  const params = {
    layout: LAYOUT_TYPE.CIRCULAR
  };

  try {
    const response = await api.request( {
      url,
      method: 'POST',
      params,
      headers
    } );
    return response;
  }
  catch ( error ){
    console.error( 'RecommendedLangService error:', error );
    throw error;
  }
};

export const RecommendedGenreService = async() => {
  const authToken = getAuthToken();
  const isGuest = !authToken;
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const url = isGuest ?
    ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_GET_GENRE :
      serviceConst.TA_GENRE_RECOMMENDATION_GUEST_URL ) :
    ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_GET_GENRE :
      serviceConst.TA_GENRE_RECOMMENDATION_URL );

  const headers = {
    ...( isGuest && { anonymousId: getAnonymousId() } ),
    profileId: getProfileId(),
    ...( authToken && {
      authorization: authToken,
      bingeproduct: getBingeProduct()
    } ),
    dthstatus: getDthStatus() || PACKS.GUEST,
    platform: COMMON_HEADERS.RECO_PLATFORM,
    ...( getBaID() && { baid: getBaID() } ),
    ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
    pagetype: PAGE_TYPE.DONGLE_HOMEPAGE,
    appVersion: COMMON_HEADERS.VERSION
  };

  const params = {
    layout: LAYOUT_TYPE.LANDSCAPE
  };

  try {
    const response = await api.request( {
      url,
      method: 'POST',
      params,
      headers
    } );
    return response;
  }
  catch ( error ){
    console.error( 'RecommendedGenreService error:', error );
    throw error;
  }
};


export const RecentlyWatchedAPICallService = async() => {
  const authToken = getAuthToken();

  const params = {
    url: serviceConst.RECENTLY_WATCHED,
    method: 'POST',
    headers: {
      authorization: authToken,
      platform: COMMON_HEADERS.PLATFORM,
      'content-type': COMMON_HEADERS.CONTENT,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      appVersion: COMMON_HEADERS.VERSION
    },
    data: {
      subscriberId: getSubscriberId(),
      profileId: getProfileId(),
      continueWatching: true,
      max: 20,
      pagingState: null // TODO: dynamic pagingState implementation
    }
  };

  try {
    const response = await api.request( params );
    return response;
  }
  catch ( error ){
    console.error( 'RecentlyWatchedAPICallService error:', error );
    throw error;
  }
};

export const BingeListContentCallService = async() => {
  const authToken = getAuthToken();
  const subscriberId = getSubscriberId();
  const profileId = getProfileId();

  const params = {
    url: serviceConst.BINGE_LIST_SERVICE,
    method: 'GET',
    params: {
      subscriberId,
      profileId,
      pagingState: null // can be made dynamic in future
    },
    headers: {
      authorization: authToken,
      subscriberId,
      platform: COMMON_HEADERS.PLATFORM,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      appVersion: COMMON_HEADERS.VERSION
    }
  };

  try {
    const response = await api.request( params );
    return response;
  }
  catch ( error ){
    console.error( 'BingeListContentCallService error:', error );
    throw error;
  }
};

export const AppRailContentCallService = async( railData ) => {
  const authToken = getAuthToken();
  const subscriberId = getSubscriberId();
  const mobileNumber = getRmn();
  const anonymousId = getAnonymousId();

  const params = {
    url: serviceConst.DYNAMIC_RAIL_INFO,
    method: 'GET',
    params: {
      id: railData.id,
      limit: 20,
      offset: 20,
      platform: COMMON_HEADERS.PLATFORM
    },
    headers: {
      authorization: authToken,
      subscriberId,
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: mobileNumber,
      deviceType: 'WEB',
      anonymousId,
      appVersion: COMMON_HEADERS.VERSION,
      rule: COMMON_HEADERS.RULE
    }
  };

  try {
    const response = await api.request( params );
    return response;
  }
  catch ( error ){
    console.error( 'AppRailContentCallService error:', error );
    throw error;
  }
};

export const TAHeroBannerService = async( placeHolderValue, pageTypeValue, count ) => {
  const authToken = getAuthToken();
  const placeHolder = placeHolderValue || 'TA_HERO_BANNER_HOMEPAGE';
  const pageType = pageTypeValue || 'DONGLE_HOMEPAGE';
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const taBannerParams = {
    url: authToken ?
      `${recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL}${placeHolder}` :
      `${recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL}${placeHolder}`,
    method: 'POST',
    params: {
      layout: LAYOUT_TYPE.LANDSCAPE,
      max: count
    },
    headers: {
      ...( !authToken && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      dthstatus: getDthStatus() || PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid: getBaID() } ),
      ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
      pagetype: pageType,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      ...( authToken && {
        authorization: authToken,
        bingeproduct: getBingeProduct(),
        ...( getUserSelectedApps() ?
          { ticktick: true, partners: getUserSelectedApps() } :
          { ticktick: false } )
      } ),
      appVersion: COMMON_HEADERS.VERSION
    }
  };

  try {
    const response = await api.request( taBannerParams );
    return response;
  }
  catch ( error ){
    console.error( 'TAHeroBannerService error:', error );
    throw error;
  }
};

export const chipRailAPICallService = async( railData, selectedChipData ) => {
  if( chipRailCancelToken && railData === null ){
    chipRailCancelToken.cancel( 'Cancelled previous chipRail API request' );
  }
  // Create new cancel token for this request
  chipRailCancelToken = axios.CancelToken.source();
  // const { taContentUseCase, indexPosition } = railData || selectedChipData || {};

  const authToken = getAuthToken();
  const subscriberId = getSubscriberId();
  const mobileNumber = getRmn();
  const anonymousId = getAnonymousId();

  const pageType = selectedChipData?.pageType || railData?.pageType || PAGE_TYPE.DONGLE_HOMEPAGE ;
  const taContentUseCase = selectedChipData?.taContentUseCase || railData?.taContentUseCase || 'HOME_UC_NEW_RELEASES';
  const chipConfigurationType = selectedChipData?.chipConfigurationType || railData?.chipConfigurationType
  const layoutType = selectedChipData?.layoutType || railData?.layoutType || LAYOUT_TYPE.LANDSCAPE
  const chipId = selectedChipData?.chipId || railData?.chipList[0]?.chipId
  const chipName = selectedChipData?.chipName.trim() || railData?.chipList[0]?.chipName
  const railId = selectedChipData?.chipRailId || railData?.id
  const chipIndexValue = selectedChipData?.chipIndex || railData?.chipList[0]?.chipIndex
  const offsetVlaue = 0

  const queryStringChipContent = `?limit=500&offset=${offsetVlaue}&railId=${railId}&chipId=${chipId}`;
  const queryStringForTAChipContent = `?max=30&layout=${layoutType}&chipIndex=${chipIndexValue}&chipName=${chipName}`;

  const getChipBaseURL = () => {
    const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
    const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
    if( chipConfigurationType === SECTION_SOURCE.EDITORIAL ){
      return `${serviceConst.CHIP_RAIL_URL}${queryStringChipContent}`;
    }
    else if( chipConfigurationType === SECTION_SOURCE.RECOMMENDATION ){
      if( authToken ){
        return `${recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL}${taContentUseCase}${queryStringForTAChipContent}`;
      }
      return `${recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL}${taContentUseCase}${queryStringForTAChipContent}`;
    }
  };

  const editorialChipParams = {
    url: getChipBaseURL(),
    method: 'GET',
    headers: {
      authorization: authToken,
      subscriberId,
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: mobileNumber,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      anonymousId,
      appVersion: COMMON_HEADERS.VERSION,
      rule: COMMON_HEADERS.RULE
    },
    cancelToken: chipRailCancelToken.token
  };

  const tAChipParams = {
    url: getChipBaseURL(),
    method: 'POST',
    headers: {
      ...( !authToken && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      dthstatus: getDthStatus() || PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid: getBaID() } ),
      ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
      pagetype: pageType,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      ...( authToken && {
        authorization: authToken,
        bingeproduct: getBingeProduct(),
        ...( getUserSelectedApps() ?
          { ticktick: true, partners: getUserSelectedApps() } :
          { ticktick: false } )
      } ),
      appVersion: COMMON_HEADERS.VERSION
    },
    cancelToken: chipRailCancelToken.token
  };

  try {
    const response = await api.request( chipConfigurationType === SECTION_SOURCE.EDITORIAL ? editorialChipParams : tAChipParams );
    return response;
  }
  catch ( error ){
    if( axios.isCancel( error ) ){
      return;
    }
    console.error( 'chipRailAPICallService error:', error );
    throw error;
  }
};


export const TAChipListReccoCallService = async( railData ) => {
  const authToken = getAuthToken();
  const taChipUseCase = railData?.taChipUseCase.trim();
  const layoutType = railData?.layoutType || LAYOUT_TYPE.LANDSCAPE
  const taqueryString = `?max=30&layout=${layoutType}`;
  const pageType = railData?.pageType || 'DONGLE_HOMEPAGE';

  const getChipBaseURL = () => {
    const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
    const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
    if( authToken ){
      return `${recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL}${taChipUseCase}${taqueryString}`;
    }
    return `${recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL}${taChipUseCase}${taqueryString}`;
  };

  const params = {
    url: getChipBaseURL(),
    method: 'POST',
    headers: {
      ...( !authToken && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      dthstatus: getDthStatus() || PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid: getBaID() } ),
      ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
      pagetype: pageType,
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      ...( authToken && {
        authorization: authToken,
        bingeproduct: getBingeProduct(),
        ...( getUserSelectedApps() ?
          { ticktick: true, partners: getUserSelectedApps() } :
          { ticktick: false } )
      } ),
      appVersion: COMMON_HEADERS.VERSION
    }
  };

  try {
    const response = await api.request( params );
    return response;
  }
  catch ( error ){
    console.error( 'TAChipListReccoCallService error:', error );
    throw error;
  }
};
