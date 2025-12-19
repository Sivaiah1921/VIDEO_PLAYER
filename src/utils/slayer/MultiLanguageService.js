import { useAxios } from './useAxios';
import serviceConst from './serviceConst';
import { COMMON_HEADERS } from '../constants';
import { getAnonymousId, getAuthToken, getBaID, getRmn, getSubscriberId, getDthStatus } from '../localStorageHelper';
const { POST_SELECTED_LANGUAGE_LIST, GET_DEFAULT_SELECTED, LANGUAGE_LIST_URL, LOGGED_IN_USER_SAVE_LANGUAGES } = serviceConst;


export const LanguageListCall = ( ) => {
  let langaugeList = {};
  const LanguageParams = {
    url: LANGUAGE_LIST_URL,
    method: 'GET',
    params: { platform: COMMON_HEADERS.PLATFORM }
  }

  const { fetchData: fetchLanguageList, response: getLanguagesResponse, error: getLanguagesError, loading: getLanguagesLoading } = useAxios( LanguageParams )
  langaugeList = { fetchLanguageList: ( newParams ) => {
    fetchLanguageList( Object.assign( LanguageParams, newParams ) )
  }, getLanguagesResponse, getLanguagesError, getLanguagesLoading };

  return [langaugeList];

};


export const SavePreferedLanguagesforGuestUsers = ( props ) => {
  let updateLanguage = { }
  const preferredLanguageParams = {
    url: POST_SELECTED_LANGUAGE_LIST,
    method: 'POST',
    headers: {
      deviceId: COMMON_HEADERS.DEVICE_ID,
      anonymousId: getAnonymousId(),
      'authorization': getAuthToken()
    },
    data: {
      languageId: props,
      mobileNumber: getRmn(),
      bingeSubscriberId: getSubscriberId(),
      baId: getBaID(),
      subscriberId: getSubscriberId()
    }
  }

  const { fetchData: saveLanguagesPostData, response: saveLanguagesResponse, error: saveLanguagesError, loading: saveLanguagesLoading } = useAxios( preferredLanguageParams, true );
  updateLanguage = { saveLanguagesPostData: ( newParams ) => {
    saveLanguagesPostData( Object.assign( preferredLanguageParams, { data: { languageId : newParams, mobileNumber: getRmn(),
      bingeSubscriberId: getSubscriberId(), baId: getBaID() } } ) )
  }, saveLanguagesResponse, saveLanguagesError, saveLanguagesLoading };

  return [updateLanguage];
}

export const DefaultSelectedLanguageCall = ( props ) => {
  let defaultLanguages = { }
  const defaultLanguageParams = {
    url: GET_DEFAULT_SELECTED,
    headers: {
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      anonymousId: getAnonymousId()
    },
    method: 'POST',
    data: {
      baId: getBaID(),
      'bingeSubscriberId': getSubscriberId(),
      'mobileNumber': getRmn()
    }
  }

  const { fetchData: fetchDefaultLangaues, response: selectedLanguagesResponse, error: selectedLanguagesError, loading: selectedLanguagesLoading } = useAxios( defaultLanguageParams, true );
  defaultLanguages = { fetchDefaultLangaues: ( newParams ) => {
    fetchDefaultLangaues( Object.assign( defaultLanguageParams, { data: newParams } ) )
  }, selectedLanguagesResponse, selectedLanguagesError, selectedLanguagesLoading };

  return [defaultLanguages];
}

export const SavePreferedLanguagesforAuthUsers = ( props ) => {
  let authUserlanguages = { }
  const params = {
    url: LOGGED_IN_USER_SAVE_LANGUAGES,
    method: 'POST',
    headers: {
      anonymousId: getAnonymousId(),
      'authorization': getAuthToken(),
      contentType: 'application/json',
      dthStatus: getDthStatus(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      loadTesting: false,
      platform: COMMON_HEADERS.PLATFORM
    },
    data: {
      languageId: props,
      mobileNumber: getRmn(),
      bingeSubscriberId: getSubscriberId(),
      baId: getBaID()
    }
  }

  const { fetchData: saveAuthUserLanguage, response: authUserLanguage, error: authUserLanguageError, loading: authUserLanguageLoading } = useAxios( params, true );
  authUserlanguages = { saveAuthUserLanguage: ( newParams ) => {
    saveAuthUserLanguage( Object.assign( params, { data: { languageId : newParams, mobileNumber: getRmn(),
      bingeSubscriberId: getSubscriberId(), baId: getBaID() } } ) )
  }, authUserLanguage, authUserLanguageError, authUserLanguageLoading };

  return [authUserlanguages];
}
