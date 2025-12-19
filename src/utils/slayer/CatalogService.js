import { useAxios } from './useAxios';
const { SEARCH_URL, TA_LANGUAGE_RECOMMENDATION_URL,
  TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL,
  TA_GENRE_RECOMMENDATION_URL,
  TA_CONTENT_GENRE_RECOMMENDATION_URL,
  TA_CONTENT_GENRE_RECOMMENDATION_GUEST_URL,
  TA_CONTENT_LANGUAGE_RECOMMENDATION_GUEST_URL,
  TA_CONTENT_LANGUAGE_RECOMMENDATION_URL,
  TA_GENRE_RECOMMENDATION_GUEST_URL,
  LANGUAGE_LIST_URL,
  GENRE_LIST_URL
} = serviceConst;
import serviceConst from './serviceConst';
import { getAnonymousId, getAuthToken, getBaID, getBingeProduct, getDeviceInfo, getDthStatus, getProfileId, getRmn, getSubscriberId, getProductName } from '../localStorageHelper';
import constants, { ABMainFeature, COMMON_HEADERS, LAYOUT_TYPE, PACKS, recommendationUrlSuffixes } from '../constants';
import { ensureTrailingSlash, getABTestingFeatureConfig } from '../util';
const { MAX } = require( '../constants' ).default;

const CatalogService = ( props ) => {
  const listType = props?.listType?.toLowerCase().includes( 'genre' ) ? 'genre' : 'language'
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const fetchLanguageRecParams = {
    url: getAuthToken() ? ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_PL : TA_LANGUAGE_RECOMMENDATION_URL ) : ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_PL : TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL ),
    method: 'POST',
    params: {
      layout: LAYOUT_TYPE.CIRCULAR
    },
    headers: {
      ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      ...( getAuthToken() && { authorization : getAuthToken() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      ...( getSubscriberId() && { cl_subscriberid : getSubscriberId() } ),
      device_details: JSON.stringify( getDeviceInfo() )
    }
  }

  const fetchGenreRecParams = {
    url: getAuthToken() ? ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_GET_GENRE : TA_GENRE_RECOMMENDATION_URL ) : ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_GET_GENRE : TA_GENRE_RECOMMENDATION_GUEST_URL ),
    method: 'POST',
    params: {
      layout: LAYOUT_TYPE.LANDSCAPE
    },
    headers: {
      ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      ...( getAuthToken() && { authorization : getAuthToken() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      ...( getSubscriberId() && { cl_subscriberid : getSubscriberId() } ),
      device_details: JSON.stringify( getDeviceInfo() )
    }
  }

  const fetchContentRecForGenreParams = {
    url: getAuthToken() ? ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_BBG : TA_CONTENT_GENRE_RECOMMENDATION_URL ) : ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_BBG : TA_CONTENT_GENRE_RECOMMENDATION_GUEST_URL ),
    method: 'POST',
    params: {
      layout: LAYOUT_TYPE.LANDSCAPE,
      max: MAX
    },
    headers: {
      ...( props?.selectedLanguage?.length && { 'filterLanguage': props.selectedLanguage } ),
      ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      freetoggle:false,
      profileId: getProfileId(),
      subgenre: [props?.title],
      ...( getAuthToken() && { authorization : getAuthToken() } ),
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  }

  const fetchContentRecForLanguageParams = {
    url: getAuthToken() ? ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_BBL : TA_CONTENT_LANGUAGE_RECOMMENDATION_URL ) : ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_BBL : TA_CONTENT_LANGUAGE_RECOMMENDATION_GUEST_URL ),
    method: 'POST',
    params: {
      layout: LAYOUT_TYPE.LANDSCAPE,
      max: MAX
    },
    headers: {
      filterLanguage: [props?.title],
      ...( props?.selectedGenre?.length && { 'subGenre': props.selectedGenre } ),
      ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      freetoggle:false,
      profileId: getProfileId(),
      ...( getAuthToken() && { authorization : getAuthToken() } ),
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  }

  const fetchLanguageGenreParams = {
    url: listType?.toLowerCase() === 'language' ? GENRE_LIST_URL : LANGUAGE_LIST_URL,
    method: 'GET',
    params: {
      platform: COMMON_HEADERS.PLATFORM
    }
  }

  const searchLiveFetchContentParams = {
    url: serviceConst.DYNAMIC_RAIL_INFO,
    method: 'GET',
    params: {},
    headers:{
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: getRmn(),
      deviceType: 'WEB',
      anonymousId: getAnonymousId(),
      rule: COMMON_HEADERS.RULE
    }
  }

  const searchChannelFetchContentParams = {
    url: serviceConst.CHANNEL_LIST_URL,
    method: 'GET',
    params: {},
    headers:{
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: getRmn(),
      deviceType: COMMON_HEADERS.RECO_PLATFORM,
      rule: COMMON_HEADERS.RULE,
      ...( getAuthToken() && { dthstatus: getDthStatus(), authorization: getAuthToken(), subscriptionType: getProductName() } )
    }
  }


  let languageGenreList = {};
  let searchResult = {};
  let languageRecommendation = {};
  let genreRecommendation = {};
  let contentForGenreRecommendation = {};
  let contentForLanguageRecommendation = {};
  let searchLiveFetchContent = {};
  let searchChannelFetchContent = {};


  const { fetchData: languageGenreListFetchData, response: languageGenreListResponse, error: languageGenreListError, loading: languageGenreListLoading } = useAxios( {}, true );
  languageGenreList = { languageGenreListFetchData: () => languageGenreListFetchData( fetchLanguageGenreParams ), languageGenreListResponse, languageGenreListError, languageGenreListLoading };

  const { fetchData: searchFetchData, response: searchResponse, error: searchError, loading: searchLoading } = useAxios( {}, true );
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )

  searchResult = {
    searchFetchData: ( searchParams ) => {
      searchFetchData( {
        url: searchConfig?.address ? ensureTrailingSlash( searchConfig.address ) : SEARCH_URL,
        method: 'POST',
        headers: {
          deviceType: COMMON_HEADERS.DEVICE_TYPE
        },
        data: { 'filter':true,
          ...( listType?.toLowerCase() === 'genre' && { 'filterGenre': [props?.title] } ),
          ...( listType?.toLowerCase() === 'language' && { 'filterLanguage': [props?.title] } ),
          ...( props?.selectedGenre?.length && { 'filterGenre': props.selectedGenre } ),
          ...( props?.selectedLanguage?.length && { 'filterLanguage': props.selectedLanguage } ),
          'pageName':'Home',
          'pageNumber': searchParams.pageNumber,
          'queryString':'',
          'freeToggle':false,
          'preferLang':[],
          'preferGenre':[]
        }
      } )
    }, searchResponse, searchError, searchLoading };

  const { fetchData: searchLiveFetchData, response: searchLiveResponse, error: searchLiveError, loading: searchLiveLoading } = useAxios( {}, true );
  searchLiveFetchContent = {
    searchLiveFetchData: ( railId, genreFilters, offsetValue = 0 ) => {
      const searchLiveParams = {
        'id': railId,
        'limit': 36,
        'offset': offsetValue,
        'platform':COMMON_HEADERS.PLATFORM,
        ...( genreFilters?.toLowerCase() !== constants.LIVE_CHANNELS_ALL ) && {
          genreFilters: genreFilters
        }
      }
      searchLiveFetchData( Object.assign( searchLiveFetchContentParams, { params: searchLiveParams } ) )
    }, searchLiveResponse, searchLiveError, searchLiveLoading };

  const { fetchData: searchChannelFetchData, response: searchChannelResponse, error: searchChannelError, loading: searchChannelLoading } = useAxios( {}, true );
  searchChannelFetchContent = {
    searchChannelFetchData: ( railId, offsetValue = 0 ) => {
      const searchChannelParams = {
        'channelId': railId,
        'limit': 20,
        'offset': offsetValue
      }
      searchChannelFetchData( Object.assign( searchChannelFetchContentParams, { params: searchChannelParams } ) )
    }, searchChannelResponse, searchChannelError, searchChannelLoading };



  const { fetchData: recommendationLanguageFetchData, response: recommendationLanguageResponse, error: recommendationLanguageError, loading: recommendationLanguageLoading } = useAxios( {}, true );
  languageRecommendation = { recommendationLanguageFetchData: () => recommendationLanguageFetchData( fetchLanguageRecParams ), recommendationLanguageResponse, recommendationLanguageError, recommendationLanguageLoading };

  const { fetchData: recommendationGenreFetchData, response: recommendationGenreResponse, error: recommendationGenreError, loading: recommendationGenreLoading } = useAxios( {}, true );
  genreRecommendation = { recommendationGenreFetchData: () => recommendationGenreFetchData( fetchGenreRecParams ), recommendationGenreResponse, recommendationGenreError, recommendationGenreLoading };

  const { fetchData: recommendationContentGenreFetchData, response: recommendationContentGenreResponse, error: recommendationContentGenreError, loading: recommendationContentGenreLoading } = useAxios( {}, true );
  contentForGenreRecommendation = { recommendationContentGenreFetchData: () => recommendationContentGenreFetchData( fetchContentRecForGenreParams ), recommendationContentGenreResponse, recommendationContentGenreError, recommendationContentGenreLoading };

  const { fetchData: recommendationContentLanguageFetchData, response: recommendationContentLanguageResponse, error: recommendationContentLanguageError, loading: recommendationContentLanguageLoading } = useAxios( {}, true );
  contentForLanguageRecommendation = { recommendationContentLanguageFetchData: () => recommendationContentLanguageFetchData( fetchContentRecForLanguageParams ), recommendationContentLanguageResponse, recommendationContentLanguageError, recommendationContentLanguageLoading };

  // eslint-disable-next-line no-sequences
  return [languageGenreList, searchResult, languageRecommendation, genreRecommendation, contentForGenreRecommendation, contentForLanguageRecommendation, searchLiveFetchContent, searchChannelFetchContent] ;

};

export default CatalogService;