
import axios from 'axios';
import { COMMON_HEADERS, PLAYBACK_TYPES, PROVIDER_LIST } from '../../../../utils/constants';
import { getAuthToken, getBaID, getDthStatus, getProfileId, getRmn, getSubscriberId } from '../../../../utils/localStorageHelper';
import serviceConst from '../../../../utils/slayer/serviceConst';
import { detectStreamType, playerConstants } from '../../../../utils/playerCommons/playersHelper';

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );
export const getDrmToken = async( props ) => {
  const { provider, contentType, providerContentId, subscriptionType, runtimePlaybackURLGenerationRequired } = props || {}
  const params = {
    url: serviceConst.GENERIC_PARTNER_URL,
    method: 'POST',
    headers: {
      Authorization: getAuthToken(),
      baId: getBaID(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      ContentType: COMMON_HEADERS.CONTENT,
      subscriberId: getSubscriberId(),
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      ...( provider?.toLowerCase() === PROVIDER_LIST.AHA && {
        profileid: getProfileId(),
        subscriptiontype: subscriptionType
      } ),
      drmauthtype: runtimePlaybackURLGenerationRequired ? 'NO' : 'YES',
      apiVersion: 'v2'
    },
    data: {
      partnerContentId: providerContentId,
      deviceOs: 'android', // TODO - NEED TO verify this with RAM
      provider: provider?.toUpperCase(),
      ...( provider?.toLowerCase() === PROVIDER_LIST.AHA && {
        contentTypeId: 'vod',
        contentType: contentType
      } ),
      mobileNo: getRmn()
    }
  }
  let playbackData = {}
  let error;
  let subtitle = [];
  let playBackType;
  try {
    const result = await api.request( params );
    const response = result.data

    playbackData = {
      src: response.data.playerDetail.playUrl,
      type: detectStreamType( response.data.playerDetail.playUrl ).name === playerConstants.HLS ? PLAYBACK_TYPES.X_MPEG : PLAYBACK_TYPES.DASH,
      keySystems: {
        'com.widevine.alpha': response.data.playerDetail.licenseUrl
      },
      licenseHeaders: response.data.playerDetail.token || '',
      signedCookies:  response.data.playerDetail?.signedCookies
    };
    if( response.data.playerDetail?.subTitleUrl || response.data.playerDetail?.subtitles?.[0]?.url ){
      subtitle.push( {
        url : response.data.playerDetail?.subTitleUrl || response.data.playerDetail?.subtitles?.[0]?.url
      } );
    }
    playBackType = response.data.playerDetail.playBackType
  }
  catch ( err ){
    error = err
  }
  console.log( 'playbackData --DRM token', playbackData, error ) // eslint-disable-line
  return { playbackData, error, subtitle, playBackType }
}

