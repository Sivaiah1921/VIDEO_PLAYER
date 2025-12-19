import { useAxios } from './useAxios';
const {
  TA_GENRE_RECOMMENDATION_URL,
  TA_GENRE_RECOMMENDATION_GUEST_URL,
  AUTOCOMPLETE_SUGGESTION, FETCH_SEARCH, CLEAR_ALL,
  LANGUAGE_LIST_URL,
  LIVE_RECOMMENDATION,
  GENRE_LIST_URL,
  TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL,
  TA_LANGUAGE_RECOMMENDATION_URL } = serviceConst;
import serviceConst from './serviceConst';
import { getAnonymousId, getAuthToken, getDthStatus, getProfileId, getSubscriberId, getBaID, getBingeProduct } from '../localStorageHelper';
import constants, { ABMainFeature, COMMON_HEADERS, LAYOUT_TYPE, PACKS, recommendationUrlSuffixes } from '../constants';
import { convertStringToCamelCase, ensureTrailingSlash, getABTestingFeatureConfig, getContentIdByType, splitByDash } from '../util';

const SearchService = () => {
  let languageRecommendation = {};
  let genreRecommendation = {};
  let languageList = {};
  let genreList = {};
  let searchStringResult = {};
  let autoCompleteResults = {};
  let fetchText = {};
  let clearAll = {};
  let liveRecommendation = {};
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const fetchLanguageRecParams = {
    url: getAuthToken() ? ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + recommendationUrlSuffixes.UC_PL : TA_LANGUAGE_RECOMMENDATION_URL ) : ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + recommendationUrlSuffixes.UC_PL : TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL ),
    method: 'POST',
    params: {
      layout : LAYOUT_TYPE.CIRCULAR
    },
    headers: {
      ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
      profileId: getProfileId(),
      ...( getAuthToken() && { authorization : getAuthToken(), bingeproduct: getBingeProduct() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } )
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
      ...( getAuthToken() && { authorization : getAuthToken(), bingeproduct: getBingeProduct() } ),
      dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
      platform: COMMON_HEADERS.RECO_PLATFORM,
      ...( getBaID() && { baid : getBaID() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } )
    }
  }

  const fetchLanguageParams = {
    url: LANGUAGE_LIST_URL,
    method: 'GET',
    params: { platform: COMMON_HEADERS.PLATFORM }

  }

  const fetchGenreParams = {
    url: GENRE_LIST_URL,
    method: 'GET',
    params: { platform: COMMON_HEADERS.PLATFORM }
  }

  const searchLAParams = {
    url: '',
    method: 'POST',
    headers:{},
    data: {}
  }
  const liveRelatedExperiment = getABTestingFeatureConfig( ABMainFeature.liveRelatedRecommendation )
  const fetchLiveRecommendionParams = {
    url: liveRelatedExperiment?.address ? ensureTrailingSlash( liveRelatedExperiment?.address ) : LIVE_RECOMMENDATION,
    method: 'GET',
    params: {
      genre : constants.NEWS_GENRE,
      lang: convertStringToCamelCase( constants.ENGLISH ),
      id: 139,
      limit: 10,
      offset: 20
    },
    headers: {
      platform: COMMON_HEADERS.PLATFORM,
      subscriberId: getSubscriberId()
    }
  }

  const { fetchData: liveRecommendationFetchData, response: liveRecommendationResponse, error: liveRecommendationError, loading: liveRecommendationLoading } = useAxios( {}, true );
  liveRecommendation = { liveRecommendationFetchData: ( props ) => liveRecommendationFetchData( Object.assign( fetchLiveRecommendionParams, { params: props } ) ), liveRecommendationResponse, liveRecommendationError, liveRecommendationLoading };

  const { fetchData: recommendationLanguageFetchData, response: recommendationLanguageResponse, error: recommendationLanguageError, loading: recommendationLanguageLoading } = useAxios( {}, true );
  languageRecommendation = { recommendationLanguageFetchData: () => recommendationLanguageFetchData( fetchLanguageRecParams ), recommendationLanguageResponse, recommendationLanguageError, recommendationLanguageLoading };

  const { fetchData: recommendationGenreFetchData, response: recommendationGenreResponse, error: recommendationGenreError, loading: recommendationGenreLoading } = useAxios( {}, true );
  genreRecommendation = { recommendationGenreFetchData: () => recommendationGenreFetchData( fetchGenreRecParams ), recommendationGenreResponse, recommendationGenreError, recommendationGenreLoading };

  const { fetchData: languageListFetchData, response: languageListResponse, error: languageListError, loading: languageListLoading } = useAxios( {}, true );
  languageList = { languageListFetchData: () => languageListFetchData( fetchLanguageParams ), languageListResponse, languageListError, languageListLoading };

  const { fetchData: genreListFetchData, response: genreListResponse, error: genreListError, loading: genreListLoading } = useAxios( {}, true );
  genreList = { genreListFetchData: () => genreListFetchData( fetchGenreParams ), genreListResponse, genreListError, genreListLoading };

  const { fetchData: autoCompleteFetchData, response: autoCompleteResponse, error: autoCompleteError, loading: autoCompleteLoading } = useAxios( {}, true );
  autoCompleteResults = {
    autoCompleteFetchData: ( searchParams ) => {
      autoCompleteFetchData( {
        url: AUTOCOMPLETE_SUGGESTION,
        method: 'GET',
        headers: {
          deviceType: COMMON_HEADERS.DEVICE_TYPE
        },
        params: {
          'queryString': searchParams.inputValue,
          'pageNumber': searchParams.pageNumber,
          'languages':  String( searchParams?.selectedLanguage ),
          'genres': String( searchParams?.selectedGenre ),
          ...( searchParams?.intent && { 'intent': searchParams.intent } )
        }
      } )
    }, autoCompleteResponse, autoCompleteError, autoCompleteLoading };

  const { fetchData: fetchTextFetchData, response: fetchTextResponse, error: fetchTextError, loading: fetchTextLoading } = useAxios( {}, true );
  fetchText = {
    fetchTextFetchData: ( fetchTextParams ) => {
      fetchTextFetchData( {
        url: FETCH_SEARCH,
        method: 'GET',
        headers: {
          'authorization': getAuthToken(),
          'profileId': getProfileId(),
          'counter':7, // Need to show only 7 recent search items
          'order':'DESC',
          'x-authenticated-userid':getSubscriberId()
        }
      } )
    }, fetchTextResponse, fetchTextError, fetchTextLoading };

  const { fetchData: clearTextFetchData, response: clearTextResponse, error: clearTextError, loading: clearTextLoading } = useAxios( {}, true );
  clearAll = {
    clearTextFetchData: ( clearTextParams ) => {
      clearTextFetchData( {
        url: CLEAR_ALL,
        method: 'DELETE',
        headers: {
          'x-authenticated-userid': getSubscriberId(),
          'authorization': getAuthToken(),
          contentType : COMMON_HEADERS.CONTENT
        },
        data: {
          'subscriberId':getSubscriberId(),
          'profileId': getProfileId()
        }
      } )
    }, clearTextResponse, clearTextError, clearTextLoading };

  return [languageList, genreList, searchStringResult, languageRecommendation, genreRecommendation, autoCompleteResults, fetchText, clearAll, liveRecommendation]
};

export default SearchService;

export const SearchLA = ( props ) => {
  const type = splitByDash( props.taShowType ) || props.type
  const id = getContentIdByType( props )

  let searchLearnAction = {}
  let header = {}
  if( getAuthToken() ){
    header = {
      authorization: getAuthToken(),
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      provider: props.provider,
      dthstatus: getDthStatus(),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      profileid: getProfileId(),
      baid:  getBaID(),
      subscriberid:  getSubscriberId(),
      contentType: COMMON_HEADERS.CONTENT,
      hasSeriesID: true
    }
  }
  else {
    header = {
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      provider: props.provider,
      profileid: getProfileId(),
      anonymousid: getAnonymousId(),
      contentType: COMMON_HEADERS.CONTENT,
      dthstatus: PACKS.GUEST,
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      hasSeriesID: true
    }
  }
  const params = {
    url: getAuthToken() ? `${serviceConst.SEARCH_LA}${type}/${id}/VOD` : `${serviceConst.SEARCH_LA_GUEST}${type}/${id}/VOD`,
    method: 'POST',
    params: {
      refUsecase: '',
      platform:  COMMON_HEADERS.RECO_PLATFORM
    },
    headers:header,
    data: {}
  }

  const { fetchData: searchLAFetchData, response: searchLAResponse, error: searchLAError, loading: searchLALoading } = useAxios( {}, true );
  searchLearnAction = { searchLAFetchData: () => searchLAFetchData( params ), searchLAResponse, searchLAError, searchLALoading };

  return [searchLearnAction];
}


export const LiveSearchLA = ( props ) => {
  const type = 'CHANNEL'
  let liveSearchLAData = {}
  const params = {
    url: serviceConst.LIVE_SEARCH_LA + '/' + type + '/' + props.id + '/LIVE',
    method: 'POST',
    params: {
      refUsecase: props.refUsecase
    },
    headers:{
      authorization: getAuthToken(),
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      provider: props.provider,
      dthstatus: getDthStatus(),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      profileid: getProfileId(),
      baid:  getBaID(),
      subscriberid:  getSubscriberId(),
      contentType: COMMON_HEADERS.CONTENT
    },
    data: {}
  }

  const { fetchData: liveSearchLA, response: liveSearchLAResponse, error: liveSearchAError, loading:liveSearchLALoading } = useAxios( {}, true );
  liveSearchLAData = { liveSearchLA: ( newParams ) => liveSearchLA( Object.assign( params, newParams ) ), liveSearchLAResponse, liveSearchAError, liveSearchLALoading };
  return [liveSearchLAData];
}

