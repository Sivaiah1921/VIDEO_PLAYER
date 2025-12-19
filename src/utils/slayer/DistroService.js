import { COMMON_HEADERS, DISTRO_CHANNEL, isTizen } from '../constants';
import { getDeviceInfo, getDistroMeta, getTVDeviceId, setDistroMeta } from '../localStorageHelper';
import { generateGUID, getSourceForMixPanel } from '../util';
import serviceConst from './serviceConst';
import { useAxios } from './useAxios';
import { useCallback, useMemo } from 'react';

export const generateRandomNumber = () => {
  // Create a new Uint32Array with 1 element to hold a 32-bit unsigned integer
  const array = new Uint32Array( 1 );

  // Fill the array with a cryptographically secure random value
  window.crypto.getRandomValues( array );

  // Generate and return a 4-digit random number:
  // 1. Normalize the random value (array[0]) by dividing it by 4294967296 (0xFFFFFFFF + 1)
  // 2. Multiply the normalized value by 9000 to scale it to a range of [0, 9000)
  // 3. Add 1000 to shift the range to [1000, 10000)
  // 4. Use Math.floor to round down to the nearest whole number, resulting in a range of [1000, 9999]
  return Math.floor( 1000 + ( array[0] / ( 0xFFFFFFFF + 1 ) ) * 9000 );
}

export const constructPlayableMacrosDistroURL = ( originalUrl, isNonceStringRequired ) =>{
  if( !originalUrl ){
    return ''
  }

  isNonceStringRequired && generateNounce( originalUrl )
  const dynamicValues = {
    CACHE_BUSTER: generateRandomNumber(),
    'env.i': generateRandomNumber(), // As per latest doc, Need to ignore this macro
    'env.u': getTVDeviceId(), // As per latest doc, Need to ignore this macro
    APP_BUNDLE: DISTRO_CHANNEL.APP_ID,
    STORE_URL: isTizen ? '' : DISTRO_CHANNEL.LG_STORE_URL,
    APP_CATEGORY: DISTRO_CHANNEL.APP_CATEGORY,
    APP_VERSION: COMMON_HEADERS.VERSION,
    APP_NAME: DISTRO_CHANNEL.APP_NAME,
    APP_DOMAIN: DISTRO_CHANNEL.DOMAIN,
    WIDTH: getDeviceInfo()?.screenWidth,
    HEIGHT: getDeviceInfo()?.screenHeight,
    DEVICE_ID: getTVDeviceId(), // As per latest doc, Need to ignore this macro
    LIMIT_AD_TRACKING: 1,
    IS_GDPR: 0,
    IS_CCPA: 0,
    ADVERTISING_ID: getTVDeviceId(),
    USER_AGENT: navigator?.userAgent,
    DEVICE:  isTizen ? DISTRO_CHANNEL.PLATFORM.SAMSUNG : DISTRO_CHANNEL.PLATFORM.LG, // As per latest doc, Need to ignore this macro
    DEVICE_ID_TYPE: '', // As per latest doc, Need to ignore this macro
    DEVICE_CONNECTION_TYPE: navigator?.connection?.effectiveType, // As per latest doc, Need to ignore this macro
    CLIENT_IP: '',
    GEO_COUNTRY: DISTRO_CHANNEL.LOCATION,
    LATITUDE: '',
    LONGITUDE:'',
    GEO_DMA: '',
    PAGEURL_ESC: '',
    PALN: getDistroMeta()?.nonceString || '',
    GEO_TYPE: 1,
    DEVICE_MAKE: isTizen ? DISTRO_CHANNEL.PLATFORM.SAMSUNG : DISTRO_CHANNEL.PLATFORM.LG,
    PLAYBACK_ID: generateGUID(),
    AID_TYPE: '',
    CONNECTION_TYPE: '',
    GDPR_CONSENT: '',
    DEVICE_CATEGORY: DISTRO_CHANNEL.DEVICE_CATEGORY
  };

  const replacedUrl = Object.keys( dynamicValues ).reduce(
    ( url, key ) => url.replace( new RegExp( `__${key}__`, 'g' ), dynamicValues[key] ),
    originalUrl
  );

  // eslint-disable-next-line no-console
  console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] Distro: Original Macro URL`, originalUrl )

  // eslint-disable-next-line no-console
  console.log( 'Distro: Playabale Macro URL', replacedUrl )

  return replacedUrl
}

export const getDistroEventTrackURL = ( dynamicValues ) =>{
  const urlTemplate = serviceConst.DISTRO_TRACKING_URL
  const constructedURL = urlTemplate
    .replace( '<random>', dynamicValues.randomValue )
    .replace( '<event_name>', dynamicValues.eventName )
    .replace( '<device_or_adver/sing_id>', dynamicValues.deviceId )
    .replace( '<dai_session_id>', dynamicValues.daiSessionId )
    .replace( '<dai_session_id>', dynamicValues.daiSessionId )
    .replace( '<dai_asset_key>', dynamicValues.daiAssetKey )
    .replace( '<partner_name>', dynamicValues.partnerName )
    .replace( '<partner_name>', dynamicValues.partnerName )
    .replace( '<content_provider_id>', dynamicValues.contentProviderId )
    .replace( '<show_id>', dynamicValues.showId )
    .replace( '<episode_id>', dynamicValues.episodeId )
    .replace( '<device_category>', DISTRO_CHANNEL.DEVICE_CATEGORY );


  // eslint-disable-next-line no-console
  console.log( 'Distro:  Event Tracking Url', constructedURL )

  return constructedURL
}

export const TrackDistroEventCall = () => {
  const baseParams = useMemo( () => ( {
    url: '', // provide your actual URL here
    method: 'POST',
    headers: {
      deviceId: getTVDeviceId(),
      platform: COMMON_HEADERS.RECO_PLATFORM,
      contentType: COMMON_HEADERS.CONTENT
    },
    data: {}
  } ), [] ); // no dependencies, so stable reference

  const { fetchData: trackDistroEvent, response, error, loading } = useAxios( baseParams );

  // memoize the wrapped fetch function so it doesn't get recreated every render
  const memoizedTrackDistroEvent = useCallback(
    ( newParams = {} ) => trackDistroEvent( { ...baseParams, ...newParams } ),
    [trackDistroEvent, baseParams]
  );

  // memoize returned object to avoid unnecessary rerenders
  const distroTracking = useMemo( () => ( {
    trackDistroEvent: memoizedTrackDistroEvent,
    response,
    error,
    loading
  } ), [memoizedTrackDistroEvent, response, error, loading] );

  return [distroTracking];
};


export const getMetadataDistroTracking = ( eventName ) => {
  const distroMeta = getDistroMeta()
  const pageName = getSourceForMixPanel( window.location.pathname )
  const data = {
    randomValue : generateRandomNumber(),
    eventName : eventName,
    deviceId : getTVDeviceId(),
    daiSessionId :distroMeta.dai_session_id,
    daiAssetKey : distroMeta.dai || encodeURIComponent( constructPlayableMacrosDistroURL( distroMeta.playURL, false ) ) || pageName,
    appName : DISTRO_CHANNEL.APP_ID,
    contentProviderId : distroMeta.contentProviderId || '',
    showId : distroMeta.showId || '',
    episodeId : distroMeta.episodeId || '',
    partnerName: DISTRO_CHANNEL.PARTNER_NAME
  }
  return data
}

const generateNounce = async( macroUrl ) => { // This needs to be uncommented from index.html <script src="//imasdk.googleapis.com/pal/sdkloader/pal.js"></script> for future release
  if( typeof goog === 'undefined' || !goog.pal ){
    // eslint-disable-next-line no-console
    console.log( 'PAL SDK not loaded' );
    return;
  }
  const consentSettings = new goog.pal.ConsentSettings();
  consentSettings.allowStorage = true

  const nonceLoader = new goog.pal.NonceLoader( consentSettings );
  const request = new goog.pal.NonceRequest();

  request.descriptionUrl = macroUrl
  request.playerType = DISTRO_CHANNEL.APP_ID;
  request.playerVersion = COMMON_HEADERS.VERSION;
  request.sessionId = generateGUID()
  request.videoHeight = getDeviceInfo()?.screenWidth;
  request.videoWidth = getDeviceInfo()?.screenHeight;
  request.adWillAutoPlay = true;
  request.adWillPlayMuted = true;

  const managerPromise = nonceLoader.loadNonceManager( request );
  await managerPromise
    .then( ( manager ) => {
      // eslint-disable-next-line no-console
      console.log( 'Nonce generated: ' + manager.getNonce() );
      setDistroMeta( { ...getDistroMeta(), nonceString:  manager.getNonce() } )
    } )
    .catch( ( error ) => {
      // eslint-disable-next-line no-console
      console.log( 'Error generating nonce: ' + error );
    } );
}
