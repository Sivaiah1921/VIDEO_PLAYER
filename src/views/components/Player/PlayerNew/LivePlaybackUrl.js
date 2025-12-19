/* eslint-disable no-console */
import { PLAYBACK_TYPES } from '../../../../utils/constants';
import { detectStreamType, playerConstants } from '../../../../utils/playerCommons/playersHelper';
import { constructPlayableMacrosDistroURL } from '../../../../utils/slayer/DistroService'
import { getJWTToken } from './JWTToken';


export const getDistroPlaybackUrls = ( props ) =>{
  const { contentUrl } = props
  const playbackData = {
    src: constructPlayableMacrosDistroURL( contentUrl, true )
  }
  console.log( 'playbackData --Distro', playbackData ) // eslint-disable-line
  return { playbackData }
}

export const getLiveChannelPlaybackUrls = async( props ) =>{
  const { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } = props || {}
  const { playbackData, error } = await getJWTToken( { provider: provider, contentType: contentType, epidsSet: epidsSet, playback_url: playback_url, licenceUrl: licenceUrl, contentId } );
  return { playbackData, error }
}
export const getTimesPlayLiveChannelPlaybackUrls = async( props ) =>{
  const { playback_url, licenceUrl } = props || {}
  const playbackData = {
    src: playback_url,
    type: detectStreamType( playback_url )?.name === playerConstants.HLS ? PLAYBACK_TYPES.X_MPEG : PLAYBACK_TYPES.DASH,
    keySystems: {
      'com.widevine.alpha': licenceUrl
    }
  };
  return { playbackData }
}