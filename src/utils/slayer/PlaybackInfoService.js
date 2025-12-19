/* eslint-disable no-console */
import { useMemo } from 'react';
import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { CONTENT_TYPE, LAYOUT_TYPE, constants, PROVIDER_LIST, COMMON_HEADERS, PLAYER_PARTNERS, getPlatformType, LIONSGATE_CONSTANTS, PACKS, CONTENTTYPE_SERIES, PAGE_TYPE, SENTRY_LEVEL, SENTRY_TAG, ABMainFeature } from '../../utils/constants';
import { getContentIdByType, getProviderLogo, sendExecptionToSentry, splitByDash, getContentIdForLastWatch, getFilteredContentType, setMixpanelData, getABTestingFeatureConfig, ensureTrailingSlash } from '../../utils/util';
import get from 'lodash/get';
import { getAuthToken, getBaID, getBingeSubscriberId, getDthStatus, getProfileId, getRmn, getSubscriberId, getAnonymousId, getUserInfo, getTVDeviceId, getDeviceInfo, getBingeProduct, getUserSelectedApps, getProductName } from '../localStorageHelper';
import { isDistroContent, isLiveContentType } from './PlayerService';
import { trackErrorEvents, trackLogEvents } from '../logTracking';
import MIXPANELCONFIG from '../mixpanelConfig';
import { getChannelPlayableStatus } from '../commonHelper';

export const getPlaceHolder = ( config, contentType ) => {
  const placeHolder = config?.taRelatedRail.find( item => item.contentType === contentType )
  return placeHolder?.useCase;
}

export const getPlaceHolderForFallback = ( config, contentType ) => {
  const placeHolder = config?.taRelatedRail.find( item => item.contentType === contentType )
  return placeHolder?.fallbackUseCase;
}

export const getRefuseCase = ( config, contentType ) => {
  const placeHolder = config?.taRelatedRail.find( item => item.contentType === contentType )
  return placeHolder?.refUseCase;
}

export const AppleCode = ( skip ) => {
  let appleCodeRedemption = {}
  const appleParams = {
    url: serviceConst.APPLE_REDEMPTION_URL,
    method: 'POST',
    data : {
      'dsn': COMMON_HEADERS.DEVICE_ID,
      'platform':COMMON_HEADERS.PLATFORM
    },
    headers: {
      sid: getSubscriberId(),
      authorization: getAuthToken(),
      'content-type': COMMON_HEADERS.CONTENT
    }
  }
  const { fetchData: appleFetchData, response: appleResponse, error: appleError, loading: appleLoading } = useAxios( appleParams, skip )
  appleCodeRedemption = { appleFetchData: ( params ) => appleFetchData( Object.assign( appleParams, params ) ), appleRedemptionResponse: appleResponse, appleRedemptionError: appleError, appleRedemptionLoading: appleLoading };
  return [appleCodeRedemption]
}

export const getContentDetailsSynopsis = ( metaData, config, donglePageData, url ) => {
  let contentDetails = {};
  if( donglePageData ){
    contentDetails = {
      ageLimit: metaData?.rating || donglePageData?.rating,
      cardTitle: getContentTitleSynopsis( metaData, donglePageData ).title,
      year: donglePageData.year || metaData?.releaseYear,
      category: donglePageData.genre,
      time: donglePageData.duration,
      iconUrl: getProviderLogo( config?.providerLogo, donglePageData.provider, constants.LOGO_SQUARE, url ),
      partnerSubscriptionType: donglePageData.partnerSubscriptionType,
      language: donglePageData.language && donglePageData.language?.length > 0 ? donglePageData.language : [],
      languagesGenres:donglePageData.languagesGenres,
      metaDetails:donglePageData.metaDetails,
      tagInfoDTO:donglePageData.tagInfoDTO ? donglePageData.tagInfoDTO : [],
      contentNativeName:donglePageData.contentNativeName,
      previewPoster:donglePageData.previewPoster,
      secondaryText:donglePageData.secondaryText,
      provider: donglePageData.provider,
      freeEpisodesAvailable: metaData?.freeEpisodesAvailable,
      contentType: donglePageData.contentType,
      liveContent: donglePageData?.liveContent
    };
  }
  return contentDetails;
}

export const getContentDetails = ( metaData, config, channelMeta, url, lastWatchResponsedata ) => {
  let contentDetails = {};
  const { freeEpisodesAvailable = false, partnerSubscriptionType = null } = lastWatchResponsedata || metaData || {};
  if( metaData ){
    contentDetails = {
      ageLimit: metaData.rating,
      cardTitle: getContentTitle( metaData, channelMeta ).title,
      category: metaData.genre || channelMeta.genre,
      iconUrl: Boolean( isLiveContentType( metaData.contentType ) || isLiveContentType( channelMeta.contentType ) ) ? channelMeta?.logo : getProviderLogo( config?.providerLogo, metaData.provider, constants.LOGO_SQUARE, url ),
      year: metaData.releaseYear,
      time: metaData.duration,
      partnerSubscriptionType: partnerSubscriptionType,
      provider: metaData.provider,
      language: metaData.language,
      contentType: metaData.contentType || channelMeta.contentType,
      freeEpisodesAvailable: freeEpisodesAvailable
    };
  }
  return contentDetails;
}

export const pad = ( val ) => {
  return ( val < 10 ) ? '0' + val : val;
}

export const getContentTitle = ( metaData, channelMeta ) => {
  const data = {
    title: '',
    description: '',
    duration: ''
  }

  if( metaData ){
    if( metaData.contentType === CONTENT_TYPE.MOVIES || metaData.contentType === CONTENT_TYPE.TV_SHOWS || metaData.contentType === CONTENT_TYPE.WEB_SHORTS ){
      data.title = metaData.vodTitle
      data.description = metaData.vodDescription
    }
    else if( metaData.contentType === CONTENT_TYPE.BRAND ){
      data.title = metaData.brandTitle;
      data.description = metaData.brandDescription;
    }
    else if( metaData.contentType === CONTENT_TYPE.SERIES ){
      data.title = metaData.seriesTitle;
      data.description = metaData.seriesDescription;
    }
    else if( isLiveContentType( metaData.contentType ) ){
      const startTime = pad( new Date( metaData.startTime ).getHours() ) + ':' + pad( new Date( metaData.startTime ).getMinutes() )
      const endTime = pad( new Date( metaData.endTime ).getHours() ) + ':' + pad( new Date( metaData.endTime ).getMinutes() )
      const timezone = pad( new Date( metaData.endTime ).getHours() ) >= 12 ? 'PM' : 'AM'
      data.title = metaData.title || metaData.channelName;
      data.description = metaData.provider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY ? ( metaData.description ) : ( metaData.description || channelMeta?.description );
      data.duration = `${startTime}\u00A0${timezone }-${endTime}\u00A0${timezone}`
    }
    else if( isLiveContentType( channelMeta?.contentType ) ){
      data.title = channelMeta.name || channelMeta.channelName;
      data.description = channelMeta.description;
    }
    else {
      data.title = metaData.title;
      data.description = metaData.description;
    }
  }

  if( !data.title ){ // Adding this to cover the edge case of HB_SEE_ALL contents, In this case those are falling in BRAND or MOVIES but brandTitle & vodTitle is missing from API
    data.title = metaData?.title;
  }

  return data;
}

export const getContentTitleSynopsis = ( metaData, donglePageData ) => {
  const data = {
    title: donglePageData?.title,
    description: metaData?.description || donglePageData?.description,
    secondaryText: donglePageData?.secondaryText
  }
  return data;
}

export const getPlaybackData = ( contentInfoResponse, type, configAuthType ) => {
  const metaData = get( contentInfoResponse, 'data.meta', {} ) || {};
  const provider = get( metaData, 'provider' );
  const playbackData = get( contentInfoResponse, 'data.detail', {} );

  let providerContentId = '';
  let playBackTitle = '';
  let epidsSet = '';

  switch ( provider?.toLowerCase() ){
    case PROVIDER_LIST.CHAUPAL:
    case PROVIDER_LIST.PLANET_MARATHI:
    case PROVIDER_LIST.AHA:
    case PROVIDER_LIST.HUNGAMA:
    case PROVIDER_LIST.SONYLIV:
    case PROVIDER_LIST.MXPLAYER:
    case PROVIDER_LIST.HOTSTAR:
    case PROVIDER_LIST.SUNNXT:
    case PROVIDER_LIST.JIO_CINEMA:
    case PROVIDER_LIST.LIONSGATE:
    case PROVIDER_LIST.APPLETV:
    case PROVIDER_LIST.PRIME:
      providerContentId = get( metaData, 'providerContentId' )
      break;
  }
  if( isLiveContentType( type ) && !isDistroContent( metaData[0]?.provider ) ){
    const offerId = get( playbackData, 'offerId' );
    epidsSet = get( offerId, 'epids' );
  }
  else if( configAuthType === 'JWTToken' || provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
    const offerId = get( playbackData, 'offerId' );
    epidsSet = get( offerId, 'epids' );
  }
  else if( configAuthType === 'DRM_TokenAPI' ){
    providerContentId = get( metaData, 'providerContentId' )
  }

  playBackTitle = get( metaData, 'vodTitle' );
  if( isLiveContentType( type ) ){
    playBackTitle = metaData[0]?.title
  }

  return { provider, providerContentId, playBackTitle, epidsSet };
}

/**
 * Handles AppID for deepLinkPartners.
 *
 * @method getLaunchAppID returns launchAppID.
 * @param {Object} appName is name of deeplink app.
 */
export const getLaunchAppID = ( appName ) => {
  const deviceInfo = getDeviceInfo() || {}
  const deviceVersion = deviceInfo?.sdkVersion?.charAt( 0 )

  switch ( appName?.toLowerCase() ){
    case PROVIDER_LIST.ZEE5 :
      return process.env.REACT_APP_ZEE5_APP_ID;
    case PROVIDER_LIST.HOTSTAR :
      return 'hotstar';
    case PROVIDER_LIST.JIO_CINEMA:
      return process.env.REACT_APP_JIO_APP_ID;
    case PROVIDER_LIST.APPLETV :
      return ( Number( deviceVersion ) >= 5 || deviceInfo.uhd ) ? process.env.REACT_APP_APPLE_APP_ID : process.env.REACT_APP_APPLE_APP_OLD_ID
    case 'lionsgate':
      return process.env.REACT_APP_LIONSGATE_APP_ID;
    case PROVIDER_LIST.PRIME:
      return 'amazon';
    default :
      return appName;
  }
}

const getcontentInfoBasedOnLionsGateDeepLink = ( partnerDeepLinkUrl, tagId ) => {
  let contentId, s = 0, e = 0;
  if( partnerDeepLinkUrl.indexOf( 'movie' ) !== -1 ){
    contentId = partnerDeepLinkUrl.slice( partnerDeepLinkUrl.lastIndexOf( '/' ) + 1 );
  }
  else if( partnerDeepLinkUrl.indexOf( 'series' ) !== -1 ){
    const arr = partnerDeepLinkUrl.split( 'lionsgateplay.com?sp_r=series/' );
    if( Array.isArray( arr ) && arr.length > 0 ){
      contentId = arr[1].split( '/' )[0]
      s = arr[1].split( '/' )[1].slice( 1, arr[1].split( '/' )[1].lastIndexOf( 'e' ) );
      e = arr[1].split( '/' )[1].slice( arr[1].split( '/' )[1].indexOf( 'e' ) + 1 )
    }
  }
  return tagId + '##' + contentId + '##' + s + '##' + e;
}

export const getParamsTags = ( appName, partnerDeepLinkUrl, tagId, providerContentId ) => {
  switch ( appName?.toLowerCase() ){
    case PROVIDER_LIST.ZEE5:
      console.log( 'targetURL = ', partnerDeepLinkUrl + '&tag=' + tagId ); // eslint-disable-line
      return partnerDeepLinkUrl + '&tag=' + tagId;
    case PROVIDER_LIST.HOTSTAR:
      return PLAYER_PARTNERS.HOTSTAR_DEEPLINK_SCHEMA + providerContentId + '/watch?platform=webos' // + tagId;
    case PROVIDER_LIST.JIO_CINEMA:
      return providerContentId;
    case PROVIDER_LIST.APPLETV:
      return partnerDeepLinkUrl;
    case PROVIDER_LIST.PRIME:
      return providerContentId;
    case PROVIDER_LIST.LIONSGATE:
      const res = getcontentInfoBasedOnLionsGateDeepLink( partnerDeepLinkUrl, tagId );
      return res;
    default :
      return appName;
  }
}

export const removeSDKFromHtml = () => {
  const sonyScript = document.getElementById( 'sonyScriptFile' );
  sonyScript && document.body.removeChild( sonyScript );
}

const getLGPParams = ( appId, tagParam, type, liveContent, lastWatchedSeconds )=>{
  const params = tagParam.split( '##' );
  console.log( 'LGP FINAL PARAMS =========', params ); // eslint-disable-line
  return {
    tagId: params[0],
    dsn: getTVDeviceId(), // '7000104689-G070L82293230',    //user unique id
    deviceType: LIONSGATE_CONSTANTS.deviceType, // fixed value
    source: LIONSGATE_CONSTANTS.source, // fixed value
    contentType: CONTENTTYPE_SERIES.includes( type?.toUpperCase() ) ? CONTENT_TYPE.SERIES.toLowerCase() : CONTENT_TYPE.MOVIE.toLowerCase(), // 'series',
    contentId: params[1],
    seriesId: type?.toLowerCase() === CONTENT_TYPE.MOVIES.toLowerCase() ? '' : 's' + params[2], // only in case of ContentType Series else it will be empty.
    episodeId: type?.toLowerCase() === CONTENT_TYPE.MOVIES.toLowerCase() ? '' : 'e' + params[3], // only in case of ContentType Series else it will be empty.
    watchedDuration: lastWatchedSeconds // User content watch duration else it will be 0.
  }
}

const handleLGPDeeplink = ( appId, tagParam, type, liveContent, lastWatchedSeconds )=>{
  console.log( 'LGP FINAL TYPE =========', type ); // eslint-disable-line
  console.log( 'LGP FINAL lastWatchedSeconds =========', lastWatchedSeconds ); // eslint-disable-line

  webOS.service.request( 'luna://com.palm.db', {
    method: 'putKind',
    parameters: {
      id: `${process.env.REACT_APP_BINGE_APP_ID}:1`,
      owner: `${process.env.REACT_APP_BINGE_APP_ID}`,
      private: true,
      indexes: []
    },
    onSuccess: function( inResponse ){
      console.log( 'The kind is created', inResponse );
      // LOG TRACKING EVENTS...
      trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
        [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
      } )
    // To-Do something
    },
    onFailure: function( inError ){
      console.log( 'Failed to create the kind' );
      console.log( '[' + inError.errorCode + ']: ' + inError.errorText );
      sendExecptionToSentry( inError, `${ SENTRY_TAG.KIND_NOT_CREATED } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.INFO );
      // To-Do something
      // LOG TRACKING EVENTS...
      trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, inError, appId )
    }
  } );


  /*
* insert the data to DB8 using the put method
*/
  webOS.service.request( 'luna://com.palm.db', {
    method: 'put',
    parameters: {
      objects: [
        {
          _id: 'NEX0ByyoUJz',
          _kind: `${process.env.REACT_APP_BINGE_APP_ID}:1`,
          params: {
            enteredTime: new Date(),
            ...getLGPParams( appId, tagParam, type, liveContent, lastWatchedSeconds )
          }
        }
      ]
    },
    onSuccess: function( inResponse ){
      console.log( 'The object(s) is(are) added' );
      console.log( 'Result: ' + JSON.stringify( inResponse ) );
      // Provide permission
      // LOG TRACKING EVENTS...
      trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
        [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
      } )
    },
    onFailure: function( inError ){
      console.log( 'Failed to add the object(s)' );
      console.log( '[' + inError.errorCode + ']: ' + inError.errorText );
      sendExecptionToSentry( inError, `${ SENTRY_TAG.OBJECTS_NOT_ADDED } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.INFO );
      // LOG TRACKING EVENTS...
      trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, inError, appId )
      // Handle failure login

    }
  } );

  /*
  * Provide the permissions to read and delete the record
  */
  webOS.service.request( 'luna://com.palm.db', {
    method: 'putPermissions',
    parameters: {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow'
          },
          object: `${process.env.REACT_APP_BINGE_APP_ID}:1`,
          type: 'db.kind',
          caller: `${process.env.REACT_APP_LIONSGATE_APP_ID}`
        }
      ]
    },
    onSuccess: function( inResponse ){
      console.log( 'The permission(s) is(are) set' );
      // Launch Lionsgate app
    },
    onFailure: function( inError ){
      console.log( 'Failed to set the permission(s)' );
      sendExecptionToSentry( inError, `${ SENTRY_TAG.PERMISSION_NOT_SET } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.INFO );
      // Handle failure

    }
  } );

  window.webOS?.service.request( 'luna://com.webos.applicationManager', {
    method: 'launch',
    parameters: {
      id: process.env.REACT_APP_LIONSGATE_APP_ID,
      params: {
        ...getLGPParams( appId, tagParam, type, liveContent, lastWatchedSeconds )
      }
    },
    onSuccess: ( res ) => { // TODO: tasks on success
      console.log( 'on success of Lionsgate app launch', res ); // eslint-disable-line
      // LOG TRACKING EVENTS...
      trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
        [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
      } )
    },
    onFailure: ( res ) => { // TODO: error handling
      console.log( 'Lionsgate App launch fail, error = ', res ); // eslint-disable-line
      sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
      // LOG TRACKING EVENTS...
      trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, res, appId )
    }
  } );

}

export const launchPartnerApp = ( appId, tagParam, type, liveContent, lastWatchedSeconds ) => { // TODO: need to modify this method as per live content implementation
  console.log( 'AppLaunch FINAL TAG PARAM == ',tagParam ); // eslint-disable-line
  console.log( 'AppLaunch FINAL appId?.toLowerCase() == ',appId?.toLowerCase() ); // eslint-disable-line
  console.log( 'AppLaunch FINAL getLaunchAppID( appId ) == ',getLaunchAppID( appId ) ); // eslint-disable-line
  console.log( 'AppLaunch FINAL TYPE == ',type ); // eslint-disable-line
  if( appId?.toLowerCase() === PROVIDER_LIST.HOTSTAR ){
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: getLaunchAppID( appId ),
        params: {
          target: tagParam,
          contentTarget: tagParam
        }
      },
      onSuccess: ( res ) => {
          console.log( 'hotstar open success. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
          [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
        } )
      },
      onFailure: ( res ) => {
        sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
        console.log( 'hotstar open fail. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, res, appId )
      }
    } );
  }
  else if( appId?.toLowerCase() === PROVIDER_LIST.JIO_CINEMA ){
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: getLaunchAppID( appId ),
        params: {
          src: 'tataplaybinge',
          contentId: tagParam,
          contentType: liveContent && type === CONTENT_TYPE.WEB_SHORTS ? CONTENT_TYPE.LIVE : type

        } // 'com.viacom18.app'
      },
      onSuccess: ( res ) => {
          console.log( 'zee5 open success. ', res ); // eslint-disable-line
      },
      onFailure: ( res ) => {
        sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
        console.log( 'zee5 open fail. ', res ); // eslint-disable-line
      }
    } );
  }
  else if( appId?.toLowerCase() === PROVIDER_LIST.ZEE5 ){
    console.log( ' zee5---id ', getLaunchAppID( appId ) ) // eslint-disable-line
    console.log( ' zee5---tag ', tagParam ) // eslint-disable-line
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: getLaunchAppID( appId ),
        params: {
          tagId: tagParam
        }
      },
      onSuccess: ( res ) => {
          console.log( 'zee5 open success. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
          [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
        } )
      },
      onFailure: ( res ) => {
        sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
        console.log( 'zee5 open fail. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, res, appId )
      }
    } );
  }
  else if( appId?.toLowerCase() === PROVIDER_LIST.APPLETV ){
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: getLaunchAppID( appId ), // 'appId'
        params: {
          contentTarget: tagParam // deepLinkrl
        }
      },
      onSuccess: ( res ) => {
          console.log( 'apple open success. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
          [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
        } )
      },
      onFailure: ( res ) => {
        sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
        console.log( 'apple open fail. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, res, appId )
      }
    } );
  }
  else if( appId?.toLowerCase() === PROVIDER_LIST.LIONSGATE ){
    console.log( 'APPID Lionsgate case ') // eslint-disable-line
    handleLGPDeeplink( appId, tagParam, type, liveContent, lastWatchedSeconds );
  }
  else if( appId?.toLowerCase() === PROVIDER_LIST.PRIME ){
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: getLaunchAppID( appId ), // 'amazon'
        params: {
          contentTarget:`${ tagParam }&refMarker=dvm_liv_tat_in_bd_x_edm`
        }
      },
      onSuccess: ( res ) => {
          console.log( 'PRIME open success. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackLogEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
          [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: appId
        } )
      },
      onFailure: ( res ) => {
        sendExecptionToSentry( res, `${ SENTRY_TAG.DEEP_LINK_ERROR } ${ appId } ${ getLaunchAppID( appId ) }`, SENTRY_LEVEL.ERROR );
        console.log( 'PRIME open fail. ', res ); // eslint-disable-line
        // LOG TRACKING EVENTS...
        trackErrorEvents( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH_FAILURE, res, appId )
      }
    } );
  }

}

export const ContentMetaData = ( props, skip ) => {
  const value = getContentType( props.type )

  let contentInfoObj = {}
  const contentParams = {
    url: serviceConst.BOX_SET + value + '/boxset/' + props.id,
    method: 'GET',
    headers: {
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  }
  const { fetchData: contentInfoFetchData, response: contentInfoResponse, error: contentInfoError, loading: contentInfoLoading } = useAxios( contentParams, skip );
  contentInfoObj = { contentInfoFetchData: ( newcontentParams ) => {
    contentInfoFetchData( Object.assign( contentParams, newcontentParams ) )
  }, contentInfoResponse, contentInfoError, contentInfoLoading };

  return [contentInfoObj];
}

export const checkAuthType = ( availableProviders, provider ) => {
  for ( let i in availableProviders ){
    if( availableProviders[i]?.providerName === provider?.toUpperCase() ){
      return availableProviders[i].authType[getPlatformType()]?.playAuthType;
    }
  }
}

export const SeriesList = () => {
  let seriesList = {};
  const { fetchData: seasonFetchData, response: seasonResponse, error: seasonError, loading: seasonLoading } = useAxios( {}, true );
  seriesList = { seasonFetchData: ( params ) => {
    seasonFetchData( {
      url: params.url,
      method: 'GET',
      headers: {
        locale : COMMON_HEADERS.LOCALE,
        'deviceType': COMMON_HEADERS.DEVICE_TYPE
      },
      params: {
        limit: 20,
        offset: params.pageNumber,
        platform: COMMON_HEADERS.PLATFORM
      }
    } )
  }, seasonResponse, seasonError, seasonLoading };
  return [seriesList]
}

export const ContentInfo = ( props ) => {
  let contentInfoDetails = {};
  const value = getContentType( props?.type )
  const contentInfoParams = {
    url: isLiveContentType( props?.type ) ? `${serviceConst.BOX_SET_LIVE}/${props?.id}` : serviceConst.BOX_SET + value + '/boxset/' + props?.id,
    method: 'GET',
    headers: {
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      ...( isLiveContentType( props?.type ) && { isSubscribed: getChannelPlayableStatus( props?.liveChannelIds, props?.subscriptionStatus, props?.id ) } ),
      ...( props?.provider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY && { appType: 'TimesPlay' } )
    }
  }
  const { fetchData: contentInfoFetchData, response: contentInfoResponse, error: contentInfoError, loading: contentInfoLoading } = useAxios( contentInfoParams, true );
  contentInfoDetails = { contentInfoFetchData: ( params ) => contentInfoFetchData( Object.assign( contentInfoParams, params ) ), contentInfoResponse, contentInfoError, contentInfoLoading };
  return [contentInfoDetails]
}

export const RecommendationRail = ( ) => {
  let recoRail = {};
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const createUrlForFallback = ( recoDataProps ) => {
    if( getAuthToken() ){
      if( recoDataProps.fallback ){
        return ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL ) + `${getPlaceHolderForFallback( recoDataProps.config, recoDataProps.contentType )}`
      }
      else {
        return ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL ) + getPlaceHolder( recoDataProps.config, recoDataProps.contentType )
      }
    }
    else if( !getAuthToken() ){
      if( recoDataProps.fallback ){
        return ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL ) + `${getPlaceHolderForFallback( recoDataProps.config, recoDataProps.contentType )}`
      }
      else {
        return ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL ) + getPlaceHolder( recoDataProps.config, recoDataProps.contentType )
      }
    }
  }
  const { fetchData: recoFetchData, response: recoResponse, error: recoError, loading: recoLoading } = useAxios( {}, true );
  recoRail = { recoFetchData: ( recoDataProps ) => recoFetchData( Object.assign( {},
    {
      url: createUrlForFallback( recoDataProps ),
      method: 'POST',
      params: {
        contentType: recoDataProps.contentType,
        showType: recoDataProps.showType,
        id: recoDataProps.id,
        layout: LAYOUT_TYPE.LANDSCAPE,
        provider: recoDataProps.provider,
        max: 20
      },
      headers: {
        ...( !getAuthToken() && { anonymousId: getAnonymousId() } ),
        profileId: getProfileId(),
        dthstatus: getDthStatus() ? getDthStatus() : PACKS.GUEST,
        platform: COMMON_HEADERS.RECO_PLATFORM,
        ...( getBaID() && { baid : getBaID() } ),
        ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
        ...( recoDataProps.fallback && { 'masterGenre': recoDataProps.genre } ),
        ...( getAuthToken() ) && {
          authorization : getAuthToken(),
          bingeproduct: getBingeProduct(),
          ...getUserSelectedApps() ?
            { ticktick: true, partners: getUserSelectedApps() } :
            { ticktick: false }
        }
      }
    } ) )
  , recoResponse, recoError, recoLoading };
  return [recoRail]
}

export const ParentalPin = ( props ) => {
  let parentalPin = {};
  const parentalPinParams = {
    url: serviceConst.PARENTAL_PIN_URL,
    method: 'POST',
    data : {
      isLogin: true,
      contentAgeRating: props.rating,
      mobileNumber: getRmn(),
      baId: getBaID(),
      bingeSubscriberId: getBingeSubscriberId(),
      parentalLock: ''
    },
    headers: {
      dthStatus: getDthStatus(),
      authorization: getAuthToken(),
      subscriberid: getSubscriberId(),
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      deviceid:  getTVDeviceId()
    }
  }
  const { fetchData: parentalPinFetchData, response: parentalPinResponse, error: parentalPinError, loading: parentalPinLoading } = useAxios( {}, true );
  parentalPin = { parentalPinFetchData: () => parentalPinFetchData( parentalPinParams ), parentalPinResponse, parentalPinError, parentalPinLoading };
  return [parentalPin]
}

export const LastWatch = ( props ) => {
  let lastWatch = {};
  let userinfo = {};
  try {
    userinfo = JSON.parse( getUserInfo() );
  }
  catch ( e ){
    console.error( 'Error parsing user info from localStorage:', e );
    userinfo = {};
  }
  const payload = {
    'contentType': props.type,
    'contentId': Number( props.id ),
    'profileId': getProfileId(),
    'subscriberId': getSubscriberId(),
    'vodId': Number( props.meta?.vodId ) || Number( getContentIdForLastWatch( props.meta ) )
  }

  const lastWatchParams = {
    url:  props.provider?.toLowerCase() === PROVIDER_LIST.TATASKY ? serviceConst.LAST_WATCH_TATAPLAY : serviceConst.LAST_WATCH,
    method: 'POST',
    headers: {
      'platform': COMMON_HEADERS.PLATFORM,
      'authorization': getAuthToken(),
      'profileId': getProfileId(),
      'cl_subscriberid': getSubscriberId(),
      'Content-Type': 'application/json',
      'dthstatus': getDthStatus(),
      'subscriptiontype': userinfo?.subscriptionType,
      'deviceid': getTVDeviceId()
    },
    data: payload
  }
  const { fetchData: lastWatchFetchData, response: lastWatchResponse, error: lastWatchError, loading: lastWatchLoading } = useAxios( {}, true );
  lastWatch = { lastWatchFetchData: ( params ) => {
    const mergedParams = Object.assign( {}, lastWatchParams, params, {
      data: Object.assign( {}, lastWatchParams?.data, params?.data )
    } )
    lastWatchFetchData( mergedParams );
  }, lastWatchResponse, lastWatchError, lastWatchLoading };
  return [lastWatch]
}

export const RelatedShows = ( props ) => {
  let relatedShows = {};
  const relatedShowsExperiment = getABTestingFeatureConfig( ABMainFeature.webShortRelatedRecommendation )

  const relatedShowsParams = {
    url: `${( relatedShowsExperiment?.address ? ensureTrailingSlash( relatedShowsExperiment.address ) : serviceConst.RELATED_SHOWS )}/${props.id}/${props.type ? getFilteredContentType( props.type ) : props.type}`,
    method: 'GET',
    params: {
      max: 20,
      from: 0
    },
    headers: {
      'platform': 'dongle',
      subscriberId: getSubscriberId()
    }
  }
  const { fetchData: relatedShowsFetchData, response: relatedShowsResponse, error: relatedShowsError, loading: relatedShowLoading } = useAxios( {}, true );
  relatedShows = { relatedShowsFetchData: () => relatedShowsFetchData( relatedShowsParams ), relatedShowsResponse, relatedShowsError, relatedShowLoading };
  return [relatedShows];
}

export const RecentlyWatchedAPICall = ( pageType, skip ) => {
  let recentlyWatchedData = {}
  const params = {
    url: serviceConst.RECENTLY_WATCHED,
    method: 'POST',
    headers:{
      authorization: getAuthToken(),
      platform: COMMON_HEADERS.PLATFORM,
      'content-type': COMMON_HEADERS.CONTENT,
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    },
    data: {
      subscriberId:  getSubscriberId(),
      profileId: getProfileId(),
      continueWatching: true,
      max: 20
    }
  }
  const { fetchData: recentlyWatchedFetchData, response: recentlyWatchedResponse, error: recentlyWatchedError, loading: recentlyWatchedLoading } = useAxios( {}, skip );
  recentlyWatchedData = { recentlyWatchedFetchData: ( newcontentParams ) => {
    recentlyWatchedFetchData( Object.assign( params, newcontentParams ) )
  }, recentlyWatchedResponse, recentlyWatchedError, recentlyWatchedLoading };

  return [recentlyWatchedData];
}

export const BoxSubSet = ( props, skip, chipContentDataInfo ) => {

  const value = useMemo( () => {
    if( chipContentDataInfo ){
      return null;
    }
    return getContentType( props?.type );
  }, [props?.type, chipContentDataInfo] );

  const params = useMemo( () => {
    if( chipContentDataInfo ){
      return null;
    }

    return {
      url: `${serviceConst.BOX_SUBSET}${value}/${props?.id}`,
      method: 'GET',
      headers: {
        deviceType: COMMON_HEADERS.DEVICE_TYPE
      }
    };
  }, [value, props?.id, chipContentDataInfo] );

  const { fetchData: boxSubSetFetch, response: boxSubSetResponse, error: boxSubSetError, loading: boxSubSetLoading } = useAxios( {}, skip );

  const boxSubSetObj = useMemo( () => ( {
    boxSubSetFetch: ( newParams ) => {
      let finalParams = params;

      // modifing the boxSubsetAPi Params for Chiprail
      if( chipContentDataInfo && newParams ){
        finalParams = {
          method: 'GET',
          url: `${serviceConst.BOX_SUBSET}${ getContentType( newParams.contentType )}/${newParams.id}`,
          headers: {
            deviceType: COMMON_HEADERS.DEVICE_TYPE
          }
        };
      }

      if( finalParams ){
        boxSubSetFetch( finalParams );
      }
      else {
        console.warn( 'BoxSubSet: No params provided for API call' );
      }
    },
    boxSubSetResponse,
    boxSubSetError,
    boxSubSetLoading
  } ), [boxSubSetFetch, boxSubSetResponse, boxSubSetError, boxSubSetLoading, params] );

  return [boxSubSetObj];
}

export const ContentList = ( type, id, limit, offset ) => {
  let contentListObj = {}
  const params = {
    url: serviceConst.CONTENT_LIST + type + '/' + id + '/list',
    method: 'GET',
    params: {
      limit: limit,
      offset: offset
    }
  }
  const { fetchData: contentListFetch, response: contentListResponse, error: contentListError, loading: contentListLoading } = useAxios( {}, true );
  contentListObj = { contentListFetch: () => contentListFetch( params ), contentListResponse, contentListError, contentListLoading };
  return [contentListObj];
}

export const FetchDetails = ( type, id ) => {
  let fetchDetailsObj = {}
  const params = {
    url: serviceConst.FETCH_DETAILS + type + '/' + id,
    method: 'GET'
  }
  const { fetchData: fetchDetailsFetch, response: fetchDetailsResponse, error: fetchDetailsError, loading: fetchDetailsLoading } = useAxios( params, true );
  fetchDetailsObj = { fetchDetailsFetch: () => fetchDetailsFetch( params ), fetchDetailsResponse, fetchDetailsError, fetchDetailsLoading };
  return [fetchDetailsObj];
}

export const getContentType = ( type ) => {
  const contentList = [CONTENT_TYPE.BRAND, CONTENT_TYPE.SERIES]
  const filtererdType = type ? getFilteredContentType( type ) : type
  const value = contentList.includes( filtererdType ) ? filtererdType.toLowerCase() : CONTENT_TYPE.VOD.toLowerCase();
  return value;
}

export const PlayLA = ( props ) => {
  const userInfo = JSON.parse( getUserInfo() || '{}' );
  const type = splitByDash( props.taShowType ) || props.type
  let playLAData = {}
  const params = {
    url: serviceConst.PLAY_LA + '/' + type + '/' + props.id + '/VOD',
    method: 'POST',
    params: {
      refUsecase: props.refUsecase,
      platform:  COMMON_HEADERS.RECO_PLATFORM
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
      contentType: COMMON_HEADERS.CONTENT,
      hasSeriesID: true,
      addOnPartners: userInfo?.addonPartnerList || [],
      isSubscribedUser : userInfo?.subscriptionStatus === 'ACTIVE'
    },
    data: {}
  }

  const { fetchData: addPlayLA, response: playLAResponse, error: PlayLAError, loading:playLALoading } = useAxios( {}, true );
  playLAData = { addPlayLA: ( episodeId ) =>{
    if( episodeId ){
      params.url = serviceConst.PLAY_LA + '/' + type + '/' + episodeId + '/VOD';
    }
    addPlayLA( params )
  }
  , playLAResponse, PlayLAError, playLALoading };
  return [playLAData];
}

export const getPathName = ( providerName, pinRequired, contentType ) => {
  if( pinRequired ){
    return '/device/fourDigitParentalPinSetup';
  }
  else if( providerName ){
    if( providerName.toLowerCase() === PROVIDER_LIST.SONYLIV ){
      return '/sonylivPlayer';
    }
    else if( providerName.toLowerCase() === PROVIDER_LIST.MXPLAYER ){
      return '/mxplayer';
    }
    else if( providerName.toLowerCase() === PROVIDER_LIST.SUNNXT ){
      return '/sunnxt';
    }
    else {
      return PAGE_TYPE.PLAYER;
    }
  }
}

export const FetchZeeTagId = ( props, bSkip = false, zee5PartnerUniqueId ) => {
  const userinfo = JSON.parse( getUserInfo() );
  const params = {
    url: serviceConst.ZEE_FETCH_URL,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      baid: getBaID(),
      'content-length': 0,
      deviceid: COMMON_HEADERS.DEVICE_ID,
      'dthstatus': getDthStatus(),
      partneruniqueid: zee5PartnerUniqueId,
      subscriberid: getSubscriberId(),
      subscriptiontype: userinfo?.subscriptionType // 'FREEMIUM'
    }
  }
  const { fetchData: tagFetchData, response:tagResponse, error } = useAxios( params, bSkip );
  const tagObj = { tagFetchData: ( newParams ) => {
    tagFetchData( Object.assign( params, newParams ) )
  }, tagResponse };
  return tagObj;
}

export const useHBRailInfo = ( props ) => {
  let HBRailObj = {}
  const params = {
    url: serviceConst.DYNAMIC_RAIL_INFO,
    method: 'GET',
    params: {
      'id': props.id,
      'limit':20,
      'offset':0
    },
    headers:{
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: getRmn(),
      anonymousId: getAnonymousId(),
      rule: COMMON_HEADERS.RULE
    }
  }

  const { fetchData: fetchHBRail, response: HBRailResponse, error: HBRailError, loading:HBRailLoading } = useAxios( {}, true );
  HBRailObj = { fetchHBRail: () => fetchHBRail( params ), HBRailResponse, HBRailError, HBRailLoading };

  return [HBRailObj];
}

export const LivePlayLA = ( props ) => {
  const type = splitByDash( props.taShowType ) || props.type
  const id = getContentIdByType( props )
  let userinfo = {};
  try {
    userinfo = JSON.parse( getUserInfo() );
  }
  catch ( e ){
    console.error( 'Error parsing user info from localStorage:', e );
    userinfo = {};
  }
  let playLiveLAData = {}
  const params = {
    url: serviceConst.LIVE_PLAY_LA + '/' + type + '/' + id + '/EPG',
    method: 'POST',
    params: {
      refUsecase: props.refUsecase
    },
    headers:{
      authorization: getAuthToken(),
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      provider: props.provider,
      dthstatus: getDthStatus(),
      profileid: getProfileId(),
      baid:  getBaID(),
      subscriberid:  getSubscriberId(),
      subscriptiontype: userinfo?.subscriptionPlanType,
      sid: getSubscriberId(),
      hasSeriesID: true
    },
    data: {}
  }

  const { fetchData: addLiveLA, response: playLAResponse, error: PlayLAError, loading:playLALoading } = useAxios( {}, true );
  playLiveLAData = { addLiveLA: ( newParams ) => addLiveLA( Object.assign( params, newParams ) ), playLAResponse, PlayLAError, playLALoading };

  return [playLiveLAData];
}

export const DecryptedPlayUrlLive = () => {
  let decryptedPlayUrls = {}
  const params = {
    url: '',
    method: 'GET'
  }
  const { fetchData: fetchDecryptedPlayUrlLive, response: decryptedPlayUrlLiveResponse, error: decryptedPlayUrlLiveError, loading: decryptedPlayUrlLiveLoading } = useAxios( params, true );
  decryptedPlayUrls = { fetchDecryptedPlayUrlLive: ( newcontentParams ) => fetchDecryptedPlayUrlLive( Object.assign( params, newcontentParams ) ), decryptedPlayUrlLiveResponse, decryptedPlayUrlLiveError, decryptedPlayUrlLiveLoading };
  return [decryptedPlayUrls];

}


export const CSDInfoAPI = ( ) => {
  let CSDInfoObj = {}
  const contentParams = {
    url: '',
    method: 'GET',
    headers: {
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  }
  const { fetchData: fetchCSDInfoAPI, response: CSDInfoAPIResponse, error: CSDInfoAPIError, loading: loadingCSDInfoAPI } = useAxios( contentParams );
  CSDInfoObj = { fetchCSDInfoAPI: ( newcontentParams ) => {
    fetchCSDInfoAPI( Object.assign( contentParams, newcontentParams ) )
  }, CSDInfoAPIResponse, CSDInfoAPIError, loadingCSDInfoAPI };

  return [CSDInfoObj];
}

export const ZeeTrailerPlayback = ( ) => {
  const productName =  getProductName()
  const isFreemium = productName === PACKS.FREEMIUM;
  const userinfo = JSON.parse( getUserInfo() );
  let zeeTrailer = {}
  const subscribedUser = getAuthToken() && !isFreemium
  const params = {
    url: subscribedUser ? serviceConst.ZEE_TRAILER_URL : serviceConst.ZEE_TRAILER_PUBLIC_URL,
    method: 'POST',
    headers: subscribedUser ? {
      authorization: getAuthToken(),
      'content-type': 'application/json',
      deviceid: COMMON_HEADERS.DEVICE_ID,
      'dthstatus': getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      subscriberid: getSubscriberId(),
      subscriptiontype: userinfo?.subscriptionPlanType
    } : {
      'content-type': 'application/json',
      deviceid: COMMON_HEADERS.DEVICE_ID,
      platform: COMMON_HEADERS.PLATFORM
    },
    data:{
      deviceOs: 'Android',
      mobileNo: getRmn() || ''
    }
  }

  const { fetchData: fetchzeeTrailer, response: zeeTrailerResponse, error: zeeTrailerError, loading: zeeTrailerLoading } = useAxios( {}, true )
  zeeTrailer = { fetchzeeTrailer: ( overrideParams = {} ) => {
    fetchzeeTrailer( {
      ...params,
      data: {
        ...params.data,
        ...overrideParams
      }
    } );
  }, zeeTrailerResponse, zeeTrailerError, zeeTrailerLoading };

  return [zeeTrailer];
}

export const LiveWatchLA = ( props ) => {
  const type = 'CHANNEL'
  let liveWatchLAData = {}
  const params = {
    url: serviceConst.LIVE_WATCH_LA + '/' + type + '/' + props.id + '/LIVE',
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

  const { fetchData: liveWatchLA, response: liveWatchLAResponse, error: liveWatchLAError, loading:liveWatchLALoading } = useAxios( {}, true );
  liveWatchLAData = { liveWatchLA: ( newParams ) => liveWatchLA( Object.assign( params, newParams ) ), liveWatchLAResponse, liveWatchLAError, liveWatchLALoading };
  return [liveWatchLAData];
}
