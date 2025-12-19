/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { useAxios } from './useAxios';
import md5 from 'md5';
import constants, { COMMON_HEADERS, PROVIDER_LIST, PLAYER_PARTNERS, CONTENT_TYPE, getPlatformType, SUNNXT_CONSTANTS, isTizen } from '../constants';
import serviceConst from './serviceConst';
import { getAuthToken, getBaID, getProfileId, getSubscriberId, getDthStatus, getDeviceToken, getAnonymousId, getTVDeviceId, getReferenceID, getDeviceInfo } from '../localStorageHelper';
import { checkAuthType } from './PlaybackInfoService';
import { getJWTToken } from '../../views/components/Player/PlayerNew/JWTToken';
import { getDrmToken } from '../../views/components/Player/PlayerNew/DrmToken';
import { getNoAuthUrl } from '../../views/components/Player/PlayerNew/NoAuthPlaybackUrl';
import isEmpty from 'lodash/isEmpty';

/* Get smart url for shemarrome */
export const getSmartUrl = ( deepLinkUrl, config ) => {
  let shemarromeConfig = config;
  if( !shemarromeConfig ){
    shemarromeConfig = {
      entryId: PLAYER_PARTNERS.SHEMAROO_ME_APP_KEY,
      serviceId: PLAYER_PARTNERS.SHEMAROO_ME_SERVICE_ID
    }
  }
  const accessToken = shemarromeConfig.entryId;
  const params = `${ deepLinkUrl }?service_id=${ shemarromeConfig.serviceId }&play_url=yes&protocol=hls&us=`;
  const encryptedToken = md5( `${ accessToken }${ params }` );
  return `${ deepLinkUrl }?service_id=${ shemarromeConfig.serviceId }&play_url=yes&protocol=hls&us=${ encryptedToken }`;
};

/* Events API call */
export const PlayingEventApiCalling = ( props, skip ) => {
  let playerEventObj = {};
  let eventPayload = {
    contentType: props.metaData?.vodContentType || props.metaData?.contentType || props?.contentType,
    id: props.metaData?.brandId || props.metaData?.vodId || props?.contentID,
    profileId:getProfileId(),
    subscriberId:getSubscriberId(),
    totalDuration: props.metaData?.duration * 60 || props?.episodeDuration * 60,
    watchDuration:Math.floor( props.watchedTime )
  }

  const params = {
    url: serviceConst.PLAYBACK_EVENTS,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken()
    },
    data: {
      'events':[eventPayload]
    }
  }
  const { fetchData:playerEventFetchData, response: playerEventResponse } = useAxios( params, skip );
  playerEventObj = { playerEventFetchData: ( newParams ) => {
    const { type: contentType, id, watchDuration, totalDuration: newTotalDuration } = newParams || {};
    const newPayload = {
      ...eventPayload,
      contentType : contentType === CONTENT_TYPE.BRAND || contentType === CONTENT_TYPE.SERIES ? CONTENT_TYPE.TV_SHOWS : contentType,
      id: Number( id ),
      watchDuration,
      vodId: Number( id ),
      totalDuration: newTotalDuration || eventPayload.totalDuration
    };
    const NewParams = {
      url: serviceConst.PLAYBACK_EVENTS,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        platform: COMMON_HEADERS.PLATFORM,
        authorization: getAuthToken()
      },
      data: {
        'events':[newPayload]
      }
    }
    !isLiveContentType( contentType ) && playerEventFetchData( Object.assign( NewParams ) ) // This call is required only in case of non live contents for the tracking purpose
  }, playerEventResponse };
  return [playerEventObj];
}

/* Fetch Next episode */
export const FetchNextEpisodes = ( props, bSkip = false ) => {
  const params = {
    url: serviceConst.NEXT_EPISODE,
    method: 'GET',
    headers: {
      device_details : JSON.stringify( getDeviceInfo() ),
      locale: COMMON_HEADERS.LOCALE,
      profileId: getProfileId(),
      kp: false,
      cl_subscriberid: getSubscriberId(),
      contentType: COMMON_HEADERS.CONTENT,
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    },
    params: {
      profileId: getProfileId(),
      subscriberId: getSubscriberId(),
      id: props
    }
  }
  let nextEpisodeObj = {};
  const { fetchData: fetchNextEpisodeData, response:nextEpisodeResponse } = useAxios( params, bSkip );
  nextEpisodeObj = { fetchNextEpisodeData: ( newParams ) => {
    fetchNextEpisodeData( Object.assign( params, newParams ) );
  }, nextEpisodeResponse };
  return { nextEpisodeObj };
};

/* Sony Integration API GetSonyLivToken() returns a token required to init the Sony SDK */
export const GetSonyLivToken = ( props, bSkip ) => {
  const params = {
    url: serviceConst.SONY_FETCH_URL,
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'rule': 'BA',
      'locale': 'USA',
      'deviceId': COMMON_HEADERS.DEVICE_ID,
      'deviceType': 'web',
      'deviceName': 'Samsung SM-A707F',
      'profileId': getProfileId(),
      'authorization': getAuthToken(),
      'platform': COMMON_HEADERS.PLATFORM,
      'deviceToken': getDeviceToken(),
      'subscriberId': getSubscriberId()
    }
  }

  let getTokenObj = {};
  const { fetchData: fetchSonyLivToken, response: sonyLivGetTokenResponse } = useAxios( params, bSkip );
  getTokenObj = {
    fetchSonyLivToken: ( newParams ) => {
      fetchSonyLivToken( Object.assign( params, newParams ) );
    },
    sonyLivGetTokenResponse
  };

  return getTokenObj
}

/* Tag Integration API GetTagData() returns a token required to init the SDK */
export const GetTagData = ( props, bSkip ) => {
  const params = {
    url: serviceConst.TAG_API_PATH,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      source: isTizen ? SUNNXT_CONSTANTS.TPSAMSUNG : SUNNXT_CONSTANTS.TPLG,
      userToken: getSubscriberId(),
      deviceId: getTVDeviceId(),
      deviceType: getPlatformType( false ),
      referenceId: getReferenceID(),
      dsn: getBaID()
    }
  }

  let getTagObj;
  const { fetchData: fetchToken, response: getTokenResponse, error: tokenError, loading: tokenLoading } = useAxios( params, bSkip );
  getTagObj = {
    fetchToken: ( newParams ) => {
      fetchToken( Object.assign( params, newParams ) );
    },
    getTokenResponse,
    tokenError,
    tokenLoading
  };

  return getTagObj;
}

/* convert duration into Hms */
export const secondsToHmsPlayer = ( d ) => {
  if( !d || !Number( d ) ){
    return null;
  }
  if( d < 60 ){
    if( d < 10 ){
      return `00:0${d}`;
    }
    else {
      return `00:${d}`;
    }
  }
  else {
    const t = Number( d );
    const h = Math.floor( t / 3600 );
    const m = Math.floor( ( t % 3600 ) / 60 );
    const s = Math.floor( ( ( t % 60 ) % 60 ) % 60 );
    const hDisplay = h < 10 ? `0${h}` : h;
    const mDisplay = m < 10 ? `0${m}` : m;
    const sDisplay = s < 10 ? `0${s}` : s;
    if( h === 0 ){
      return `${mDisplay}:${sDisplay}`;
    }
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
}

/* TVOD expiry handling */
export const SetTvodPlaybackExpiry = ( props ) => {
  let tvodPlaybackExpiry = {}
  const tvodPlaybackExpiryData = {
    url: serviceConst.TVOD_EXPIRY + props.id,
    method: 'POST',
    headers:{
      'authorization': getAuthToken(),
      'subscriberId': getSubscriberId(),
      'platform': COMMON_HEADERS.PLATFORM,
      'deviceToken': getDeviceToken(),
      'dthStatus': getDthStatus(),
      'anonymousId': getAnonymousId(),
      'profileId': getProfileId(),
      'deviceId': getTVDeviceId(),
      'deviceType': COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
      'deviceName':COMMON_HEADERS.DEVICE_NAME
    }
  }
  const { fetchData: tvodPlaybackExpiryFetchData, response: tvodPlaybackExpiryResponse, error: tvodPlaybackExpiryError, loading: tvodPlaybackExpiryLoading } = useAxios( tvodPlaybackExpiryData, true );
  tvodPlaybackExpiry = { tvodPlaybackExpiryFetchData: () => tvodPlaybackExpiryFetchData( tvodPlaybackExpiryData ), tvodPlaybackExpiryResponse, tvodPlaybackExpiryError, tvodPlaybackExpiryLoading };

  return [tvodPlaybackExpiry]
}

/* Get .srt token */
export const GetSrtToken = ( url, bSkip ) => {
  const params = {
    url: url,
    method: 'GET',
    headers: {
      'authorization': getAuthToken()
    }
  }

  let getSrtObj = {};
  const { fetchData: fetchSrtToken, response: srtResponse, error: srtError } = useAxios( params, bSkip );
  getSrtObj = {
    fetchSrtToken: ( newParams, subtitleOption ) => {
      fetchSrtToken( Object.assign( params, newParams ), subtitleOption );
    },
    srtResponse,
    srtError
  };

  return getSrtObj
}

/* Check if given provider is distro or not */
export const isDistroContent = ( provider ) => {
  if( !provider ){
    return
  }
  return provider.toLowerCase() === PROVIDER_LIST.DISTRO_TV
}

/* Check if given content is LIVE or not */
export const isLiveContentType = ( type ) => {
  if( !type ){
    return
  }
  return type.toUpperCase() === CONTENT_TYPE.LIVE || type.toUpperCase() === CONTENT_TYPE.CUSTOM_LIVE_DETAIL
}

export const isSonyContent = ( provider ) => {
  if( !provider ){
    return
  }
  return provider.toLowerCase() === PROVIDER_LIST.SONYLIV
}

/* Utility for API call using fetch not axios */
export const fetchData = ( url, isTextResponse ) => {
  return new Promise( ( resolve, reject ) => {
    fetch( url )
      .then( response => {
        if( !response.ok ){
          throw new Error( 'Network response was not ok' );
        }
        return isTextResponse ? response.text() : response.json();
      } )
      .then( data => {
        resolve( data );
      } )
      .catch( error => {
        reject( error );
      } );
  } );
};

/* Get Language label from the iso library */
export const getLanguageLabel = ( iso6392, code )=>{
  if( !code ){
    return null
  }
  if( code?.includes( '_' ) ){
    code = code?.split( '_' )[0]
  }
  if( code?.length >= 3 ){
    code = code.substring( 0, 3 )
  }
  let label;
  if( code.length === 2 ){
    label = iso6392.find( l => l.iso6391?.toLowerCase() === code?.toLowerCase() )?.name;
  }
  else if( code.length === 3 ){
    label = iso6392.find( l => l.iso6392B?.toLowerCase() === code?.toLowerCase() )?.name
  }

  return label;
}

/* Get Language code from the iso library */
export const getLanguageCode = ( iso6392, trackLabel )=>{
  if( !trackLabel ){
    return null
  }
  const code = iso6392.find( l => l.name?.toLowerCase() === trackLabel?.toLowerCase() )?.iso6391

  return code;
}

/* Get Playable urls when clicks on Play CTA */
export const getPlayableUrls = async( myPlanProps, contentInfoResponse, config, storedLastWatch ) => {
  if( isEmpty( getAuthToken() ) || isEmpty( contentInfoResponse ) ){
    return;
  }

  const { data: { meta: { provider, contentType, providerContentId: metaProviderContentId, partnerDeepLinkUrl: metaPartnerDeepLinkUrl, runtimePlaybackURLGenerationRequired, id, vodId: infoVodId } = {}, detail: playbackMeta = {} } = {} } = contentInfoResponse || {};
  const { dashWidewinePlayUrl: storedPlayUrl, dashWidewineLicenseUrl: storedLicenceUrl, providerContentId: storedProviderContentId, partnerDeepLinkUrl: storedDeepLinkUrl, contentId: storedContentId, playUrl: storedLastWatchPlayurl, vodId: lastWatchVodId } = storedLastWatch || {};
  const { dashWidewinePlayUrl, dashWidewineLicenseUrl, playUrl, subtitlePlayUrl: subtitleUrl, offerId: { epids: epidsSet } = {} } = playbackMeta;
  const { shemarromeConfig, subscriptionType } = myPlanProps || {};

  const playback_url = storedPlayUrl || dashWidewinePlayUrl;
  const licenceUrl = storedLicenceUrl || dashWidewineLicenseUrl;
  const providerContentId = storedProviderContentId || metaProviderContentId;
  const partnerDeepLinkUrl = storedDeepLinkUrl || metaPartnerDeepLinkUrl;
  let contentId = storedContentId || id ;
  if( provider?.toLowerCase() === PROVIDER_LIST.WAVES && ( storedLastWatchPlayurl || playUrl ) ){
    return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl : storedLastWatchPlayurl || playUrl, subtitleUrl } );
  }
  const authType = checkAuthType( config.availableProviders, provider );
  switch ( authType?.toLowerCase() ){
    case constants.JWT_TOKEN.toLowerCase():
      contentId = lastWatchVodId || infoVodId;
      return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
    case constants.DRM_LICENSED_TOKEN.toLowerCase():
    case constants.DRM_TOKENAPI.toLowerCase():
    case constants.DRM_ACCESS_TOKEN.toLowerCase():

      return await getDrmToken( { provider, contentType, providerContentId, subscriptionType, runtimePlaybackURLGenerationRequired } );
    default:
      if( provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
        contentId = lastWatchVodId || infoVodId;
        return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
      }
      else if( provider?.toLowerCase() === PROVIDER_LIST.HUNGAMA ){
        return await getDrmToken( { provider, contentType, providerContentId, subscriptionType, runtimePlaybackURLGenerationRequired } );
      }
      else {
        return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl : storedLastWatchPlayurl || playUrl, subtitleUrl } );
      }
  }
};

/* Get Playable urls for next Episode */
export const getNextEpisodePlayableUrls = async( myPlanProps, contentInfoResponse, config, nextEpisodeResponseObj ) => {
  if( isEmpty( getAuthToken() ) || isEmpty( contentInfoResponse ) ){
    return ''
  }

  const { data: { meta: { provider } = {} } = {} } = contentInfoResponse || {};
  const { current: { data: { nextEpisode: { playerDetail: { offerId: { epids: epidsSet = {} }, playUrl, dashWidewinePlayUrl: playback_url, dashWidewineLicenseUrl: licenceUrl }, providerContentId, contentType, partnerDeepLinkUrl, id: contentId }, subtitlePlayUrl: subtitleUrl } } = {} } = nextEpisodeResponseObj || {};
  const { shemarromeConfig, subscriptionType } = myPlanProps || {}

  if( provider?.toLowerCase() === PROVIDER_LIST.WAVES && playUrl ){
    return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl, subtitleUrl } );
  }
  const authType = checkAuthType( config.availableProviders, provider );

  switch ( authType?.toLowerCase() ){
    case constants.JWT_TOKEN.toLowerCase():
      return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
    case constants.DRM_LICENSED_TOKEN.toLowerCase():
    case constants.DRM_TOKENAPI.toLowerCase():
    case constants.DRM_ACCESS_TOKEN.toLowerCase():

      return await getDrmToken( { provider, contentType, providerContentId, subscriptionType } );
    default:
      if( provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
        return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
      }
      else if( provider?.toLowerCase() === PROVIDER_LIST.HUNGAMA ){
        return await getDrmToken( { provider, contentType, providerContentId, subscriptionType } );
      }
      else {
        return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl, subtitleUrl } );
      }
  }
};

/* Get Playable urls for Playable Media Cards */
export const getMediaCardPlayableUrls = async( myPlanProps, episodeData, config, epids ) => {
  if( isEmpty( getAuthToken() ) || isEmpty( episodeData ) ){
    return ''
  }

  const { provider, contentType, providerContentId, partnerDeepLinkUrl, runtimePlaybackURLGenerationRequired, id: contentId, detail: rawDetail } = episodeData || {};
  const detail =  rawDetail || episodeData?.playerDetails || {};

  const { dashWidewinePlayUrl: playback_url, dashWidewineLicenseUrl: licenceUrl, playUrl, subtitlePlayUrl: subtitleUrl, offerId } = detail
  const epidsSet = offerId?.epids || epids || {};

  const { shemarromeConfig, subscriptionType } = myPlanProps || {};
  if( provider?.toLowerCase() === PROVIDER_LIST.WAVES && playUrl ){
    return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl, subtitleUrl } );
  }
  const authType = checkAuthType( config.availableProviders, provider );

  switch ( authType?.toLowerCase() ){
    case constants.JWT_TOKEN.toLowerCase():
      return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
    case constants.DRM_LICENSED_TOKEN.toLowerCase():
    case constants.DRM_TOKENAPI.toLowerCase():
    case constants.DRM_ACCESS_TOKEN.toLowerCase():

      return await getDrmToken( { provider, contentType, providerContentId, subscriptionType, runtimePlaybackURLGenerationRequired } );
    default:
      if( provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
        return await getJWTToken( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } );
      }
      else if( provider?.toLowerCase() === PROVIDER_LIST.HUNGAMA ){
        return await getDrmToken( { provider, contentType, providerContentId, subscriptionType, runtimePlaybackURLGenerationRequired } );
      }
      else {
        return await getNoAuthUrl( { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl, subtitleUrl } );
      }
  }
};
