import { CONTENTTYPE_SERIES, PROVIDER_LIST } from '../constants';
import { getEpisodeList, setEpisodeList } from '../localStorageHelper';

export const hlsContentTypes = ['application/x-mpegurl', 'vnd.apple.mpegurl'];

export const hlsType = {
  M3U8: 'm3u8',
  MPEGURL: 'application/x-mpegurl'
}

export const playerConstants = {
  HLS: 'hls',
  DASH: 'dash'
}
export const playMode = {
  LIVE: 'live',
  LIVEDVR: 'livedvr',
  ONDEMAND: 'ondemand'
}

export const streamTypes = [
  {
    name: 'progressive',
    label: 'Progressive (MP4, WebM)',
    contentTypes: ['video/mp4', 'video/webm'],
    urlMatch: /(\.webm|\.mp4)/,
    urlNotMatch: /(\/Manifest|\.mpd|\.m3u)/
  },
  {
    name: 'dash',
    label: 'MPEG DASH',
    contentTypes: ['application/dash+xml'],
    urlMatch: /\.mpd/
  },
  {
    name: 'hls',
    label: 'HLS',
    contentTypes: hlsContentTypes,
    urlMatch: /\.m3u/
  },
  {
    name: 'smooth',
    label: 'Smooth stream',
    contentTypes: ['application/vnd.ms-sstr+xml'],
    urlMatch: /\/Manifest/,
    urlNotMatch: /(\.mpd|\.m3u|\.mp4)/
  }
];

export const detectStreamType = ( streamUrl, contentType ) =>
  streamTypes.filter( type => {
    if( contentType ){
      return type.contentTypes?.indexOf( contentType.toLowerCase() ) >= 0;
    }
    else {
      const urlNotMatch = type.urlNotMatch;
      if( urlNotMatch ){
        return type.urlMatch.test( streamUrl ) && !urlNotMatch.test( streamUrl );
      }
      else {
        return type.urlMatch.test( streamUrl );
      }
    }
  } )[0] || streamTypes[0];

export const getPlaybackType = ( provider, drmType, playUrl )=>{
  if( provider?.toLowerCase === PROVIDER_LIST.PTCPLAY ){
    return drmType?.toLowerCase() === playerConstants.DASH ? 'application/dash+xml' : 'application/x-mpegURL';
  }
  else {
    return detectStreamType( playUrl )?.name === playerConstants.HLS ? 'application/x-mpegURL' : 'application/dash+xml';
  }
}

export const PROVIDERONSHAKA = [
  PROVIDER_LIST.AHA,
  PROVIDER_LIST.CHAUPAL,
  PROVIDER_LIST.TRAVELXP,
  PROVIDER_LIST.VROTT,
  PROVIDER_LIST.ANIMAX,
  PROVIDER_LIST.REELDRAMA,
  PROVIDER_LIST.ISTREAM,
  PROVIDER_LIST.DISCOVERYPLUS,
  PROVIDER_LIST.PTCPLAY,
  PROVIDER_LIST.TATASKY,
  PROVIDER_LIST.TATAPLAYSPECIALS,
  PROVIDER_LIST.MANORAMAMAX,
  PROVIDER_LIST.SHORSTTV,
  PROVIDER_LIST.WAVES,
  PROVIDER_LIST.STAGE,
  PROVIDER_LIST.TIMESPLAY,
  PROVIDER_LIST.ULTRAJHAKAAS,
  PROVIDER_LIST.ULTRAPLAY
]

export const loadEpisodesFromLocalStorage = () => {
  const storedEpisodes = getEpisodeList();
  const currentTime = Date.now();
  const filteredEpisodes = storedEpisodes.filter( episode => {
    return currentTime - episode.time < 24 * 60 * 1000; // Filter out entries older than 24 hours
  } );
  setEpisodeList( filteredEpisodes )
}

export const getIsOrphanContent = ( data ) => {
  const { contentType, seriesId } = data || {}
  return CONTENTTYPE_SERIES.includes( contentType ) && !seriesId
}

export const getUniqueHighestBandwidthTracks = ( tracks ) => {
  const trackMap = new Map();

  tracks?.map( ( track ) => {
    const height = track.height;
    if( !trackMap.has( height ) || trackMap.get( height ).bandwidth < track.bandwidth ){
      trackMap.set( height, track );
    }
  } );

  return Array.from( trackMap.values() );
};

export const ADSTYPE = {
  POSTROLL:'POSTROLL'
};

export const highLatencyChannelList = ['Shri Babulnaath Temple Mumbai'];