import axios from 'axios';
import md5 from 'md5';
import { COMMON_HEADERS, PLAYBACK_TYPES, PLAYER_PARTNERS, PROVIDER_LIST } from '../../../../utils/constants';
import { getAuthToken, getProfileId, getSubscriberId } from '../../../../utils/localStorageHelper';
import serviceConst from '../../../../utils/slayer/serviceConst';
import { detectStreamType, playerConstants } from '../../../../utils/playerCommons/playersHelper';

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

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

export const getNoAuthUrl = async( props ) => {
  const { provider, contentType, providerContentId, partnerDeepLinkUrl, shemarromeConfig, playUrl, subtitleUrl } = props
  let params = {}

  switch ( provider?.toLowerCase() ){
    case PROVIDER_LIST.SHEMAROO_ME:
      params = {
        url: getSmartUrl( partnerDeepLinkUrl, shemarromeConfig ),
        method: 'GET'
      }
      break;

    case PROVIDER_LIST.PLANET_MARATHI:
      params = {
        url: serviceConst.PLANET_MARATHI_PLAYURL,
        method: 'POST',
        headers: {
          authorization: getAuthToken(),
          contentType: contentType,
          providerContentId: providerContentId
        }
      }
      break;

    case PROVIDER_LIST.CHAUPAL:
      params = {
        url: `${serviceConst.CHAUPAL_PLAYURL}${props.providerContentId}`,
        method: 'POST',
        headers: {
          contentType: contentType,
          authorization: getAuthToken(),
          subscriberId: getSubscriberId(),
          profileId: getProfileId()
        }
      }
      break;
  }

  let playbackData = {};
  let error;
  let subtitle;
  try {
    if( params && Object.keys( params ).length ){
      const result = await api.request( params );
      const response = result.data
    console.log( 'API response: ', response ) // eslint-disable-line
      if( response ){
        switch ( provider?.toLowerCase() ){
          case PROVIDER_LIST.SHEMAROO_ME:
            if( response.adaptive_urls?.length > 0 ){
              playbackData = { src: response.adaptive_urls[0].playback_url };
              subtitle = result.subtitles?.subtitles
            }
            break;
          case PROVIDER_LIST.PLANET_MARATHI:
            playbackData = { src: response.data?.playUrl };
            break;
          case PROVIDER_LIST.CHAUPAL:
            if( response.data?.playUrls?.length > 1 ){
              playbackData = {
                src: response.data.playUrls[1].url,
                type: detectStreamType( response.data.playUrls[1].url ).name === playerConstants.HLS ? PLAYBACK_TYPES.X_MPEG : PLAYBACK_TYPES.DASH,
                keySystems: {
                  'com.widevine.alpha': response.data.playUrls[1].licenceUrl
                }
              };
              subtitle = response.data.subtitles
            }
            break;
        }
      }
    }
    else {
      playbackData = {
        src: playUrl
      };
      subtitle = subtitleUrl
    }
  }
  catch ( err ){
    error = err
  }
  console.log( 'playbackData --NoAuthPlaybackUrl', playbackData, error ) // eslint-disable-line
  return { playbackData, error, subtitle }
}