import axios from 'axios';
import { COMMON_HEADERS, CONTENT_TYPE, PACKS, PLAYBACK_TYPES } from '../../../../utils/constants';
import serviceConst from '../../../../utils/slayer/serviceConst';
import { getAuthToken, getBaID, getDthStatus, getRmn, getSubscriberId, getTVDeviceId, getUserInfo } from '../../../../utils/localStorageHelper';
import { detectStreamType, playerConstants } from '../../../../utils/playerCommons/playersHelper';
const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

export const getJWTToken = async( props ) => {
  const { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } = props || {}
  const userinfo = JSON.parse( getUserInfo() );
  const params = {
    url: serviceConst.JWT_TOKEN_URL + contentId + '/' + contentType + '/token',
    method: 'POST',
    headers: {
      'x-subscriber-id': getSubscriberId(),
      dthStatus: getDthStatus(),
      subscriberId: getSubscriberId(),
      'Content-Type': 'application/json',
      'x-device-platform': 'MOBILE',
      'x-subscriber-name': null,
      baId: getBaID(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      Authorization: getAuthToken(),
      'x-device-type': 'IOS',
      'x-device-id': getTVDeviceId(),
      platform: COMMON_HEADERS.PLATFORM,
      rmn: getRmn(),
      subscriptionType: userinfo?.subscriptionType || PACKS.ADD_PACK_FREEMIUM,
      appVersion: COMMON_HEADERS.VERSION
    },
    data: {
      'action': 'stream',
      epids: epidsSet,
      ...( ( contentType === CONTENT_TYPE.LIVE ) ) && {
        'provider': provider
      }
    }
  }

  let playbackData = {}
  let error;
  try {
    const result = await api.request( params );
    const response = result.data;
    playbackData = {
      src: playback_url,
      type:  detectStreamType( playback_url ).name === playerConstants.HLS ? PLAYBACK_TYPES.X_MPEG : PLAYBACK_TYPES.DASH,
      keySystems: {
        'com.widevine.alpha': licenceUrl + '&ls_session=' + response.data.token
      }
    };
  }
  catch ( err ){
    error = err
  }
  console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] playbackData --JWTToken`, playbackData, error ) // eslint-disable-line
  return { playbackData, error }
}

