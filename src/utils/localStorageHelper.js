
export const setAuthToken = ( value ) => {
  localStorage.setItem( 'authorization token', value )
}

export const getAuthToken = () => {
  if( localStorage.getItem( 'authorization token' ) ){
    return `bearer ${localStorage.getItem( 'authorization token' )}`
  }
}

export const setBeforeLoginAuthToken = ( value ) => {
  localStorage.setItem( 'authorization token before', value )
}

export const getBeforeLoginAuthToken = () => {
  if( localStorage.getItem( 'authorization token before' ) ){
    return `bearer ${localStorage.getItem( 'authorization token before' )}`
  }
}

export const setDeviceToken = ( value ) => {
  localStorage.setItem( 'device token', value )
}

export const getDeviceToken = () => {
  return localStorage.getItem( 'device token' )
}

export const setBeforeLoginDeviceToken = ( value ) => {
  localStorage.setItem( 'device token before', value )
}

export const getBeforeLoginDeviceToken = () => {
  return localStorage.getItem( 'device token before' )
}

export const setRmn = ( value ) => {
  localStorage.setItem( 'RMN', value )
}

export const getRmn = () => {
  return localStorage.getItem( 'RMN' )
}

export const setBaID = ( value ) => {
  localStorage.setItem( 'baId', value )
}

export const getBaID = () => {
  return localStorage.getItem( 'baId' )
}

export const setLastRefreshedTime = ( value ) => {
  localStorage.setItem( 'lastRefreshed', value )
}

export const getLastRefreshedTime = () => {
  return localStorage.getItem( 'lastRefreshed' )
}

export const setPrevKey = ( value ) => {
  localStorage.setItem( 'prevKey', `${value}` )
}

export const getPrevKey = () => {
  return localStorage.getItem( 'prevKey' )
}

export const setDthStatus = ( value ) => {
  localStorage.setItem( 'dthStatus', value )
}

export const getDthStatus = () => {
  return localStorage.getItem( 'dthStatus' )
}

export const setAnonymousId = ( value ) => {
  localStorage.setItem( 'anonymousId', value )
}

export const getAnonymousId = () => {
  return localStorage.getItem( 'anonymousId' )
}

export const setProfileId = ( value ) => {
  localStorage.setItem( 'profileId', value )
}

export const getProfileId = () => {
  return localStorage.getItem( 'profileId' )
}

export const setSubscriberId = ( value ) => {
  localStorage.setItem( 'subscriberId', value )
}

export const getSubscriberId = () => {
  return localStorage.getItem( 'subscriberId' )
}

export const setBingeSubscriberId = ( value ) => {
  localStorage.setItem( 'bingeSubscriberId', value )
}

export const getBingeSubscriberId = () => {
  return localStorage.getItem( 'bingeSubscriberId' )
}

export const setLoginMsg = ( value ) => {
  localStorage.setItem( 'loginMsg', value )
}

export const getLoginMsg = () => {
  return localStorage.getItem( 'loginMsg' )
}

export const removeLoginMsg = () => {
  localStorage.removeItem( 'loginMsg' )
}

export const setLoginIcon = ( value ) => {
  localStorage.setItem( 'loginIcon', value )
}

export const getLoginIcon = () => {
  return localStorage.getItem( 'loginIcon' )
}

export const removeLoginIcon = () => {
  localStorage.removeItem( 'loginIcon' )
}

export const setLogoutMsg = ( val ) => {
  localStorage.setItem( 'logoutMsg', val );
}

export const getLogtoutMsg = () => {
  return localStorage.getItem( 'logoutMsg' );
}

export const removeLogoutMsg = () => {
  localStorage.removeItem( 'logoutMsg' );
}

export const setLogoutIcon = ( val ) => {
  localStorage.setItem( 'logoutIcon', val );
}
export const getLogoutIcon = () => {
  return localStorage.getItem( 'logoutIcon' );
}

export const removeLogoutIcon = () => {
  localStorage.removeItem( 'logoutIcon' )
}

export const setAgeRating = ( value ) => {
  localStorage.setItem( 'ageRating', value )
}

export const getAgeRating = () => {
  return localStorage.getItem( 'ageRating' )
}

export const setContentLangSet = ( val ) => {
  localStorage.setItem( 'contentLangSet', val )
}

export const getContentLangSet = () => {
  return localStorage.getItem( 'contentLangSet' );
}

export const removeContentLang = () => {
  localStorage.removeItem( 'contentLangSet' );
}


export const setLastCardIndex = ( value ) => {
  localStorage.setItem( 'lastCard', value )
}

export const getLastCardIndex = () => {
  return JSON.parse( localStorage.getItem( 'lastCard' ) )
}

export const setMixPanelId = ( val ) => {
  localStorage.setItem( 'mixPanelId', val )
}

export const getMixPanelId = () => {
  return localStorage.getItem( 'mixPanelId' );
}

export const setGuestMixPanelId = ( val ) => {
  localStorage.setItem( 'guestMixPanelId', val )
}

export const getGuestMixPanelId = () => {
  return localStorage.getItem( 'guestMixPanelId' );
}

export const setUserInfo = ( val ) => {
  localStorage.setItem( 'userInfo', JSON.stringify( val ) )
}

export const getUserInfo = () => {
  return localStorage.getItem( 'userInfo' );
}

export const setDeviceList = ( val ) => {
  localStorage.setItem( 'deviceList', JSON.stringify( val ) )
}

export const getDeviceList = () => {
  return localStorage.getItem( 'deviceList' );
}

export const setContentRailPositionData = ( val )=>{
  localStorage.setItem( 'contentRailPositionData', JSON.stringify( val ) )
}

export const getContentRailPositionData = ( ) => {
  let value = localStorage.getItem( 'contentRailPositionData' )
  if( value ){
    return JSON.parse( value )
  }
  return {};
}

export const setFirstLaunch = ( val )=>{
  localStorage.setItem( 'firstLaunch', val )
}

export const getFirstLaunch = () => {
  return localStorage.getItem( 'firstLaunch' );
}

export const setProductName = ( val )=>{
  localStorage.setItem( 'productName', val )
}

export const getProductName = () => {
  return localStorage.getItem( 'productName' )
}

export const setLowerPlan = ( val )=>{
  localStorage.setItem( 'lowerPlan', val )
}

export const getLowerPlan = () => {
  return localStorage.getItem( 'lowerPlan' )
}

export const removelowerPlan = () => {
  localStorage.removeItem( 'lowerPlan' )
}

export const setCodeResponse = ( val )=>{
  localStorage.setItem( 'code', val )
}

export const getCodeResponse = () => {
  return JSON.parse( localStorage.getItem( 'code' ) )
}

export const removeCodeResponse = () => {
  localStorage.removeItem( 'code' )
}

export const setAllLoginPath = ( val ) => {
  localStorage.setItem( 'setAllLoginPath', JSON.stringify( val ) )
}

export const getAllLoginPath = () => {
  return JSON.parse( localStorage.getItem( 'setAllLoginPath' ) )
}

export const setTVDeviceId = ( val ) => {
  localStorage.setItem( 'deviceIdTV', val )
}

export const getTVDeviceId = () => {
  return localStorage.getItem( 'deviceIdTV' )
}

export const setMXPlayerError = ( val ) => {
  localStorage.setItem( 'MXPlayerError', val )
}

export const getMXPlayerError = () => {
  return localStorage.getItem( 'MXPlayerError' )
}

export const removeMXPlayerError = () => {
  localStorage.removeItem( 'MXPlayerError' );
}

export const setUserStatus = ( val ) => {
  localStorage.setItem( 'setUserStatus', val )
}

export const getUserStatus = () => {
  return localStorage.getItem( 'setUserStatus' )
}

export const setData = ( key, val ) => {
  localStorage.setItem( key, val )
}

export const getData = ( key ) => {
  return localStorage.getItem( key )
}

export const setCatalogFlagLocal = ( value ) => {
  localStorage.setItem( 'catalogFlag', value )
}

export const getCatalogFlag = () => {
  return localStorage.getItem( 'catalogFlag' )
}

export const setSearchFlagLocal = ( value ) => {
  localStorage.setItem( 'searchFlag', value )
}

export const getSearchFlag = () => {
  return localStorage.getItem( 'searchFlag' )
}

export const setBingeListFlagLocal = ( value ) => {
  localStorage.setItem( 'bingeFlag', value )
}

export const getBingeListFlag = () => {
  return localStorage.getItem( 'bingeFlag' )
}

export const setLiveFlagLocal = ( value ) => {
  localStorage.setItem( 'liveSearchFlag', value )
}

export const getLiveFlagLocal = () => {
  return localStorage.getItem( 'liveSearchFlag' )
}

export const setLastFocusedSynopsisID = ( value ) => {
  localStorage.setItem( 'LastFocusedSynopsisID', value )
}

export const getLastFocusedSynopsisID = () => {
  return localStorage.getItem( 'LastFocusedSynopsisID' )
}

export const removeLastFocusedSynopsisID = () => {
  localStorage.removeItem( 'LastFocusedSynopsisID' )
}

export const clearData = ( key ) => {
  return localStorage.removeItem( key );
}

export const setPageNumberPagination = ( val ) => {
  localStorage.setItem( 'pagination', val )
}

export const getPageNumberPagination = () => {
  return localStorage.getItem( 'pagination' )
}

export const setDeviceLaunchCount = ( val ) => {
  localStorage.setItem( 'device-launch-count', val )
}

export const getDeviceLaunchCount = () => {
  return Number( localStorage.getItem( 'device-launch-count' ) )
}

export const setSmartTroubleshootingRefreshCount = ( val ) => {
  localStorage.setItem( 'smart-refresh-user-count', val )
}

export const getSmartTroubleshootingRefreshCount = () => {
  return Number( localStorage.getItem( 'smart-refresh-user-count' ) )
}

export const setSmartTroubleshootingTrackEventCount = ( val ) => {
  localStorage.setItem( 'smart-track-event-count', val )
}

export const getSmartTroubleshootingTrackEventCount = () => {
  return Number( localStorage.getItem( 'smart-track-event-count' ) )
}

export const setSmartSubscriptionStatus = ( val )=>{
  localStorage.setItem( 'smart-subscription-status', JSON.stringify( val ) )
}

export const getSmartSubscriptionStatus = () => {
  return JSON.parse( localStorage.getItem( 'smart-subscription-status' ) )
}

export const removeSmartSubscriptionStatus = () => {
  return localStorage.removeItem( 'smart-subscription-status' );
}

export const setReferenceID = ( value ) => {
  localStorage.setItem( 'referenceId', value );
}

export const getReferenceID = ( ) => {
  return localStorage.getItem( 'referenceId' );
}

export const setHotStarPopupCount = ( val )=>{
  localStorage.setItem( 'hotstar-popup-launch-count', val )
}

export const getHotStarPopupCount = () => {
  return Number( localStorage.getItem( 'hotstar-popup-launch-count' ) )
}

export const setPrimeRedirectionPopupCount = ( val ) => {
  localStorage.setItem( 'prime-popup-redirection-count', val )
}

export const getPrimeRedirectionPopupCount = () => {
  return Number( localStorage.getItem( 'prime-popup-redirection-count' ) )
}

export const setDeviceInfo = ( val )=>{
  localStorage.setItem( 'device-info', JSON.stringify( val ) )
}

export const getDeviceInfo = () => {
  return JSON.parse( localStorage.getItem( 'device-info' ) )
}

export const setPreferredLanguage = ( val ) => {
  localStorage.setItem( 'preferredLanguage', val );
}

export const getPrefferedLanguage = () => {
  return localStorage.getItem( 'preferredLanguage' );
}

export const setPreferredLanguageGuest = ( val ) => {
  localStorage.setItem( 'preferredLanguageGuest', val );
}

export const getPrefferedLanguageGuest = () => {
  return localStorage.getItem( 'preferredLanguageGuest' );
}

export const setBingeProduct = ( val ) => {
  localStorage.setItem( 'bingeProduct', val );
}

export const getBingeProduct = () => {
  return localStorage.getItem( 'bingeProduct' );
}

export const setMixpanelInforamtion = ( val ) => {
  localStorage.setItem( 'mixpanelInformation', JSON.stringify( val ) )
}

export const getMixpanelInforamtion = () => {
  return JSON.parse( localStorage.getItem( 'mixpanelInformation' ) )
}

export const setDeBoardingPopupCount = ( val )=>{
  localStorage.setItem( 'deBoardingPopupCount', val )
}

export const getDeBoardingPopupCount = () => {
  return Number( localStorage.getItem( 'deBoardingPopupCount' ) )
}

export const setMaxCardinalityReachedValue = ( val )=>{
  localStorage.setItem( 'MaxCardinalityReachedValue', val )
}

export const getMaxCardinalityReachedValue = () => {
  return localStorage.getItem( 'MaxCardinalityReachedValue' ) === 'true'
}

export const setValidationKey = ( val )=>{
  localStorage.setItem( 'validationKey', val )
}

export const getValidationKey = () => {
  return localStorage.getItem( 'validationKey' )
}

export const setDistroMeta = ( val )=>{
  localStorage.setItem( 'Distro_meta', JSON.stringify( val ) )
}

export const getDistroMeta = () => {
  return JSON.parse( localStorage.getItem( 'Distro_meta' ) ) || {}
}

export const setMixedRailData = ( val ) => {
  localStorage.setItem( 'recommendationData', JSON.stringify( val ) )
}

export const getMixedRailData = () => {
  return JSON.parse( localStorage.getItem( 'recommendationData' ) ) || []
}

export const setPiLevel = ( val )=>{
  localStorage.setItem( 'piLevel', val )
}

export const getPiLevel = () => {
  return +localStorage.getItem( 'piLevel' )
}

export const setUserSelectedApps = ( val )=>{
  localStorage.setItem( 'userSelectedApps', val )
}

export const getUserSelectedApps = () => {
  return localStorage.getItem( 'userSelectedApps' )
}

export const removeUserSelectedApps = () => {
  localStorage.removeItem( 'userSelectedApps' )
}

export const setAccountBaid = ( val )=>{
  localStorage.setItem( 'account-baid', val )
}

export const getAccountBaid = () => {
  return localStorage.getItem( 'account-baid' )
}

export const setShowPromoBanner = ( val )=>{
  localStorage.setItem( 'promoBanner', val )
}

export const getShowPromoBanner = () => {
  return localStorage.getItem( 'promoBanner' )
}

export const setActivatePopUpModalFlag = ( value ) => {
  localStorage.setItem( 'activatePopUpModalFlag', value )
}

export const getActivatePopUpModalFlag = () => {
  return localStorage.getItem( 'activatePopUpModalFlag' )
}

export const removeActivatePopUpModalFlag = () => {
  localStorage.removeItem( 'activatePopUpModalFlag' )
}

export const setZeroAppPlanPopupOnRefresh = ( val ) => {
  localStorage.setItem( 'zeroAppPlanPopup', val )
}

export const getZeroAppPlanPopupOnRefresh = () => {
  return localStorage.getItem( 'zeroAppPlanPopup' )
}

export const removeZeroAppPlanPopupOnRefresh = () => {
  localStorage.removeItem( 'zeroAppPlanPopup' )
}

export const setLogData = ( val ) => {
  localStorage.setItem( 'logData', JSON.stringify( val ) )
}

export const getLogData = () => {
  return JSON.parse( localStorage.getItem( 'logData' ) ) || []
}

export const setIncorrectOTPData = ( val ) => {
  localStorage.setItem( 'logIncorrectOtpData', JSON.stringify( val ) )
}

export const getIncorrectOTPData = () => {
  return JSON.parse( localStorage.getItem( 'logIncorrectOtpData' ) )
}

export const removeIncorrectOTPData = () => {
  return localStorage.removeItem( 'logIncorrectOtpData' )
}

export const setLogOTPTime = ( val ) => {
  localStorage.setItem( 'logOtpTime', val )
}

export const getLogOTPTime = () => {
  return localStorage.getItem( 'logOtpTime' )
}

export const removeLogOTPTime = () => {
  localStorage.removeItem( 'logOtpTime' )
}

export const setInternetFailure = ( val ) => {
  localStorage.setItem( 'internet-failure', val )
}

export const getInternetFailure = () => {
  return Boolean( localStorage.getItem( 'internet-failure' ) === 'true' )
}

export const removeInternetFailure = () => {
  localStorage.removeItem( 'internet-failure' )
}

export const setBufferDifference = ( val ) => {
  localStorage.setItem( 'bufferDifference', val )
}

export const getBufferDifference = () => {
  return localStorage.getItem( 'bufferDifference' )
}

export const setPrimeRetryPopupCount = ( val ) => {
  localStorage.setItem( 'prime-retry-popup-count', val )
}

export const getPrimeRetryPopupCount = () => {
  return Number( localStorage.getItem( 'prime-retry-popup-count' ) )
}

export const setEpisodeList = ( val ) => {
  localStorage.setItem( 'clickedEpisodes', JSON.stringify( val ) )
}

export const getEpisodeList = () => {
  return JSON.parse( localStorage.getItem( 'clickedEpisodes' ) ) || []
}

export const setAppEnv = ( val ) => {
  localStorage.setItem( 'appEnv', val )
}

export const getAppEnv = () => {
  return localStorage.getItem( 'appEnv' )
}

export const removeAppEnv = () => {
  localStorage.removeItem( 'appEnv' )
}

export const setRemovedDeviceNames = ( val ) => {
  localStorage.setItem( 'removeDeviceNames', val )
}

export const getRemovedDeviceNames = () => {
  return localStorage.getItem( 'removeDeviceNames' )
}

export const removeRemovedDeviceNames = () => {
  localStorage.removeItem( 'removeDeviceNames' )
}

export const setDeviceManagementFromLoginJourney = ( val ) => {
  localStorage.setItem( 'deviceManagementFromLoginJourney', val )
}

export const getDeviceManagementFromLoginJourney = () => {
  return Boolean( localStorage.getItem( 'deviceManagementFromLoginJourney' ) === 'true' )
}

export const removeDeviceManagementFromLoginJourney = () => {
  localStorage.removeItem( 'deviceManagementFromLoginJourney' )
}

export const setAppleToastInfo = ( data ) => {
  localStorage.setItem( 'apple-toast-info', JSON.stringify( data ) )
}

export const getAppleToastInfo = () => {
  return JSON.parse( localStorage.getItem( 'apple-toast-info' ) ) || {};
}

export const removeAppleToastInfo = () => {
  localStorage.removeItem( 'apple-toast-info' )
}

// export const setRegion = ( val ) => {
//   localStorage.setItem( 'region', val )
// }

// export const getRegion = () => {
//   return localStorage.getItem( 'region' ) || ''
// }

export const setIsLoginToggleState = ( value ) => {
  localStorage.setItem( 'isLoginToggle', JSON.stringify( value ) );
};

export const getIsLoginToggleState = () => {
  const storedValue = localStorage.getItem( 'isLoginToggle' );
  return storedValue ? JSON.parse( storedValue ) : true;
};

export const setSelectedPartner = ( val ) => {
  localStorage.setItem( 'selectedPartner', val )
}

export const getSelectedPartner = () => {
  return localStorage.getItem( 'selectedPartner' )
}
export const setFromNewLoginState = ( value ) => {
  localStorage.setItem( 'fromNewLogin', JSON.stringify( value ) );
};

export const getFromNewLoginState = () => {
  return JSON.parse( localStorage.getItem( 'fromNewLogin' ) );
};

export const getDebugMode = () => {
  return localStorage.getItem( 'debugMode' );
};

export const setFromAppMediaCard = ( val ) => {
  localStorage.setItem( 'BBA', JSON.stringify( val ) )
}

export const getFromAppMediaCard = () => {
  return JSON.parse( localStorage.getItem( 'BBA' ) )
}

export const setFromSportsMediaCard = ( val ) => {
  localStorage.setItem( 'BBS', JSON.stringify( val ) )
}

export const getFromSportsMediaCard = () => {
  return JSON.parse( localStorage.getItem( 'BBS' ) )
}

export const getkeyCodeFromLocalStorage = () => {
  return JSON.parse( localStorage.getItem( 'keyCode' ) )
}

export const setTrailerCTA = ( val ) =>{
  if( val !== undefined ){
    localStorage.setItem( 'trailerCTA', JSON.stringify( val ) );
  }
}

export const getTrailerCTA = () => {
  try {
    const storedVal = localStorage.getItem( 'trailerCTA' );
    return storedVal ? JSON.parse( storedVal ) : null;
  }
  catch {
    return null;
  }
};

export const setTrailerFromApi = ( val ) => {
  localStorage.setItem( 'TrailerFromAPI', JSON.stringify( val ) )
}

export const getTrailerFromApi = () => {
  try {
    const storedVal = localStorage.getItem( 'TrailerFromAPI' );
    return storedVal ? JSON.parse( storedVal ) : null;
  }
  catch {
    return null;
  }
}

export const setTrailerContentCategory = ( val ) => {
  localStorage.setItem( 'TrailerContentCategory', ( val ) )
}
export const getTrailerContentCategory = () => {
  try {
    const storedVal = localStorage.getItem( 'TrailerContentCategory' );
    return storedVal ? storedVal : null;
  }
  catch {
    return null;
  }
}

export const setTrailerResumeTime = ( val ) => {
  localStorage.setItem( 'TrailerResumeTime', ( val ) )
}

export const getTrailerResumeTime = () => {
  try {
    const storedVal = localStorage.getItem( 'TrailerResumeTime' );
    return storedVal ? storedVal : 0;
  }
  catch {
    return null;
  }
}

export const setChipData = ( name, position ) => {
  const data = { name, position }
  localStorage.setItem( 'chipData', JSON.stringify( data ) )
}

export const getChipData = () => {
  const data = localStorage.getItem( 'chipData' );
  return data ? JSON.parse( data ) : null;
};

export const setABTestingData = ( featureKey, config ) => {
  const existingData = JSON.parse( localStorage.getItem( 'abTestingData' ) ) || {};
  existingData[featureKey] = config;
  localStorage.setItem( 'abTestingData', JSON.stringify( existingData ) );
};

export const getABTestingData = () => {
  const data = localStorage.getItem( 'abTestingData' );
  return data ? JSON.parse( data ) : null;
};

export const setProviderName = ( name ) => {

  localStorage.setItem( 'provider', JSON.stringify( name ) )
}

export const getProviderName = () => {
  try {
    const data = localStorage.getItem( 'provider' );
    return data ? JSON?.parse( data ) : null;
  }
  catch {
    return null;
  }

};
