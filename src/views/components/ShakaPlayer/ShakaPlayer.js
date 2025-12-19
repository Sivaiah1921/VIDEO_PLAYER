/* eslint-disable no-loop-func */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/media-has-caption */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import shaka from 'shaka-player-2.4';
import shakaPlayer from 'shaka-player';
import './ShakaPlayer.scss';
import Loader from '../Loader/Loader';
import constants, { NOTIFICATION_RESPONSE, PLAYER, PROVIDER_LIST, forwardRwKeys, TRACK_MODE, AUTH_TYPE, DISTRO_CHANNEL } from '../../../utils/constants';
import { FocusContext, getCurrentFocusKey } from '@noriginmedia/norigin-spatial-navigation';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { PlayingEventApiCalling, getNextEpisodePlayableUrls, getPlayableUrls, getLanguageLabel, getLanguageCode, isLiveContentType } from '../../../utils/slayer/PlayerService';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import PlayerOverlay from '../PlayerOverlay/PlayerOverlay';
import { isSeries, modalDom, UseInterval } from '../../../utils/util';
import PlayerNextTile from '../PlayerNextTile/PlayerNextTile';
import { detectStreamType, getUniqueHighestBandwidthTracks, highLatencyChannelList, playerConstants } from '../../../utils/playerCommons/playersHelper';
import getStreamRangeHelper from './shakaStreamRangeHelper';
import { usePlayerState } from '../Player/PlayerStateContext';
import { checkAuthType, DecryptedPlayUrlLive } from '../../../utils/slayer/PlaybackInfoService';
import { getLiveChannelPlaybackUrls } from '../Player/PlayerNew/LivePlaybackUrl';
import get from 'lodash/get';
import { iso6392 } from 'iso-639-2';
import throttle from 'lodash/throttle';
import { useDecrypetedPlayURL } from '../../../utils/slayer/useDecrypedPlayURL';
import { getAuthToken, getDthStatus, getSubscriberId, getUserInfo, setData } from '../../../utils/localStorageHelper';
import serviceConst from '../../../utils/slayer/serviceConst';
import useUserActivity from '../../../utils/playerCommons/useUserActivity';

const ShakaPlayer = ( props ) => {
  const { isError, setIsError, currentTime, setCurrentTime, setBufferStart, setBufferStop, isNextEpisodeAvailable, setIsNextEpisodeAvailable, setVideoPlayer, setVideoElement, errorMsg, setErrorMsg } = usePlayerState();

  const {
    mixPanelEventOnFirstLaunch,
    mixpanelEventOnPlayerReady,
    mixPanelEventsOnPlayPause,
    mixpanelEventOnEndedEvent,
    mixpanelEventOnError,
    goBackToPrevPage,
    nextEpisodeResponseObj,
    checkNextEpisodeAvailable,
    getSubtitleByResponse,
    getSubtitleTracks,
    subtitleRef,
    isPremium,
    config,
    isSubtitleThroughURL,
    lastWatchedSeconds,
    currentSubtutle, setCurrentSubtitle,
    cdnEnabled
  } = props;

  const [loading, setLoading] = useState( true );
  const [progress, setProgress] = useState( 0 );
  const [isPlaying, setIsPlaying] = useState( false );
  const [isGoLive, setIsGoLive] = useState( false );
  const [totalTime, setTotalTime] = useState( 0 );
  const [audioTracks, setAudioTracks] = useState( [] );
  const [showSubtitleList, setShowSubtitleList] = useState( false );
  const [showAudioList, setShowAudioList] = useState( false );
  const [videoTracks, setVideoTracks] = useState( [] );
  const [showVideoList, setShowVideoList] = useState( false );
  const [currentAudioTrack, setCurrentAudioTrack] = useState( '' );
  const [currentVideoTrack, setCurrentVideoTrack] = useState( constants.AUTO );
  const [isPopupOpen, setIsPopupOpen] = useState( false );

  const videoControllerRef = useRef( null );
  const playerRef = useRef( null );
  const errorRef = useRef( null );
  const loadAttemptRef = useRef( true );
  const goLiveRef = useRef( false );
  const currentTimeRef = useRef( 0 );
  const totalTimeRef = useRef( 0 );
  const keyPressRef = useRef( false );
  const modalRef = useRef();
  const buttonRef = useRef();
  const firstPlaybackRef = useRef( true );
  const hasSubtitle = useRef( false );
  const listSubtitle = useRef( ['None'] );
  const streamRangeHelper = useRef( null );
  const playerStateRef = useRef( {
    playCount: 0,
    pauseCount: 0,
    playStartTime: new Date(),
    pauseStartTime :new Date(),
    bufferStart: 0,
    bufferStop: 0,
    isNextEpisodeAvailable: true,
    hasAudioTracks: false,
    subtitlePlayUrlRef: null,
    goLiveTimeRef: 0,
    hasVideoTracks: false,
    variantTracks: [],
    currentAudioTrack: '',
    currentVideoTrack: constants.AUTO,
    videoSelectionTimeout: null,
    isPremiumContent: false,
    totalWatchedTime: 0,
    currentSubTrack: '',
    subIndex : 0,
    goLiveRefTimeout: null
  } );


  // Use the custom hook to track user activity
  const isActive = useUserActivity( isPlaying, isPopupOpen );
  const { liveContent, trackRecord, isDeviceRemoved } = useMaintainPageState();
  const responseSubscription = useSubscriptionContext();
  const {
    playBackTitle,
    setPlayBackTitle,
    storedLastWatchData,
    setSubtitlePlayUrl,
    contentPlaybackData,
    setContentPlaybackData,
    storedContentInfo,
    subtitlePlayUrl,
    metaData,
    setNextEpisodeTimer
  } = usePlayerContext();

  const [playerEventObj] = PlayingEventApiCalling(
    { metaData, watchedTime: 0 },
    true
  );
  const { playerEventFetchData } = playerEventObj;

  const [decryptedPlayUrls] = DecryptedPlayUrlLive();
  const { fetchDecryptedPlayUrlLive, decryptedPlayUrlLiveResponse } = decryptedPlayUrls

  const { getDecryptedPlayURL } = useDecrypetedPlayURL()

  let subtitleListVisibilityTimeOut;
  let timeUpdateInterval = null;
  let timerExit;
  const myPlanProps = responseSubscription?.responseData.currentPack;

  const configAuthToken = useMemo( () => checkAuthType( config.availableProviders, metaData?.provider ), [metaData, config] );
  const vodID = useMemo( () => storedLastWatchData?.vodId || metaData?.vodId, [storedLastWatchData, metaData] )
  const [playerVodId, setPlayerVodId] = useState( vodID )

  const unmountPlayer = ()=>{
    stopEventAPICall();
    if( playerRef.current ){
      playerRef.current.destroy();
    }
  }

  /* This is to update the exiting player state object */
  const updatePlayerState = ( newState ) => {
    playerStateRef.current = { ...playerStateRef.current, ...newState };
  };

  /* This is events API call to track the playback time */
  const { startInterval: startEventAPICall, stopInterval: stopEventAPICall } = UseInterval( () => {
    playerEventFetchData( { type: metaData.contentType, id: playerVodId, watchDuration: Math.floor( currentTimeRef.current ), totalDuration: Math.floor( totalTimeRef.current ) } );
  }, 10000 );

  /* Redirects to Live/HLS/DASH contents */
  const playerRedirection = ( src, keySystems, licenseHeaders, signedCookies )=>{
    if( liveContent || detectStreamType( src )?.name === playerConstants.HLS ){
      loadLiveAndHLSAsset( src, keySystems, licenseHeaders, signedCookies );
    }
    else {
      loadDASHAsset( src, keySystems, licenseHeaders, signedCookies );
    }
  }

  const handleAdaptation = () => {
    const activeTracks = playerRef.current?.getVariantTracks().filter( ( track ) => track.active );
    const currentTrack = activeTracks[0]; // Get the active variant track
    console.log( ` ##[${( performance.now() / 1000 ).toFixed( 2 )} sec]Quality changed:`, {
      bandwidth: currentTrack.bandwidth,
      width: currentTrack.width,
      height: currentTrack.height
    } );
  }

  /* Creating Shaka Player */
  const createPlayer = ( shaka ) =>{
    const player = new shaka.Player( videoControllerRef.current );
    shaka.polyfill.installAll();
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] shakaInstance`, shaka );
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] playerInstance`, player );
    if( !shaka.Player.isBrowserSupported() ){
      updatePlayerState( { errorMsg: constants.BROWSER_NOT_SUPPORTED } );
      setIsError( true );
      throw new Error( constants.BROWSER_NOT_SUPPORTED )
    }

    streamRangeHelper.current = getStreamRangeHelper( videoControllerRef.current, player );
    setVideoPlayer( player )
    setVideoElement( videoControllerRef.current )
    mixPanelEventOnFirstLaunch( videoControllerRef.current, playerStateRef.current.playCount, playerStateRef.current.pauseCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime );
    subtitleRef.current = handleSubtitle;

    // Add eventListners for player
    Object.entries( eventHandlers )?.forEach( ( [name, handler] ) => {
      videoControllerRef.current.addEventListener( name, handler );
    } );


    player.addEventListener( 'error', onEvent );
    player.addEventListener( 'adaptation', handleAdaptation );

    return player;
  }

  const appendSignedCookiesToUrl = ( url, signedCookies )=>{
    const urlObj = new URL( url );
    Object.entries( signedCookies ).forEach( ( [key, value] ) => {
      urlObj?.searchParams?.set( key, value );
    } );
    return urlObj.toString();
  }

  const addPlayerConfiguration = ( player, keySystems, licenseHeaders, signedCookies )=>{
    player.configure( {
      drm: {
        servers: { ...keySystems },
        advanced: {
          'com.widevine.alpha': {
            'videoRobustness': 'SW_SECURE_CRYPTO',
            'audioRobustness': 'SW_SECURE_CRYPTO'
          }
        }
      },
      streaming: {
        failureCallback: ( error ) => {
          console.log( 'video-playing-error', error )
          setErrorMsg( { errorMsg: error } )
          setIsError( true );
        },
        // startAtSegmentBoundary: liveContent,
        lowLatencyMode: liveContent && !highLatencyChannelList.includes( metaData?.provider ), // Need to devlop logic for clockSyncUri and utc timing to support lowLatencyMode for live channels
        bufferingGoal: liveContent ? 3 : 30,
        rebufferingGoal: liveContent ? 4 : 2,
        stallEnabled: true,
        startAtSegmentBoundary: false,
        bufferBehind: liveContent ? 0 : 10,
        ignoreTextStreamFailures: true,
        evictionGoal: 60,
        segmentPrefetchLimit: 2,
        observeQualityChanges: true,
        dontChooseCodecs: false,
        retryParameters: {
          timeout: 15000,
          maxAttempts: 10,
          baseDelay: 500,
          backoffFactor: 1.5
        }
      },
      manifest: {
        defaultPresentationDelay: 10,
        dash: {
          ignoreMinBufferTime: true,
          enableFastSwitching: false,
          updatePeriod: 2,
          ignoreSuggestedPresentationDelay: true
        }
      },
      abr: {
        enabled: true,
        cacheLoadThreshold: 30,
        defaultBandwidthEstimate: 100 * 1000,
        safeMarginSwitch: 10,
        switchInterval: 30,
        minTimeToSwitch: 10,
        restrictions: {
          maxWidth: window.innerWidth,
          maxHeight: window.innerHeight
        }
      }
    } );

    console.log( 'playerConfiguration', player.getConfiguration() );

    if( ( configAuthToken === constants.DRM_TOKENAPI || configAuthToken === constants.DRM_ACCESS_TOKEN ) && ( licenseHeaders || signedCookies ) ){
      console.log( 'DRM_TokenAPI content requesting LICENSE...' );
      player.getNetworkingEngine().registerRequestFilter( function( type, request ){
        if( type === shakaPlayer.net.NetworkingEngine.RequestType.LICENSE ){
          if( metaData?.provider.toLowerCase() === PROVIDER_LIST.WAVES ){
            request.headers['pallycon-customdata-v2'] = licenseHeaders
          }
          else {
            request.headers['X-AxDRM-Message'] = licenseHeaders
          }
        }
        else if( metaData?.provider.toLowerCase() === PROVIDER_LIST.STAGE ){
          const signedCookiesPair = {
            Policy: signedCookies['CloudFront-Policy'],
            Signature: signedCookies['CloudFront-Signature'],
            'Key-Pair-Id': signedCookies['CloudFront-Key-Pair-Id']
          };
          request.uris = request.uris.map( uri => appendSignedCookiesToUrl( uri, signedCookiesPair ) );
        }
      } );

    }


    // To handle 403 error due to CORS issue on localhost
    if( cdnEnabled ){
      player.getNetworkingEngine().registerRequestFilter( ( type, request ) => {
        request.allowCrossSiteCredentials = true;
      } );
    }
  }

  const loadPlaybackURL = ( player, src )=>{
    /*
    * Loading src and handling playback
    */
    player.load( src ).then( function(){
      console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] video loaded successfully` );
      setIsError( false );
      updatePlayerState( { isNextEpisodeAvailable: true } );
      mixpanelEventOnPlayerReady( videoControllerRef.current, playerStateRef.current.playCount, playerStateRef.current.pauseCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime );
    } ).catch( ( error )=>{
      console.log( 'player-internal-error', error );
      setIsError( true );
      setErrorMsg( { errorMsg: error } )
      // trackErrorEvents( MIXPANELCONFIG.EVENT.PLAYBACK_FAILURE, { ...error, url: error.data?.[0] }, metaData?.provider )
    } );
  }

  /* Handles DASH contents playback */
  function loadDASHAsset( src, keySystems, licenseHeaders, signedCookies ){
    console.log( 'loadDASHAsset...' );
    if( !playerRef.current ){
      playerRef.current = createPlayer( shaka );
    }
    addPlayerConfiguration( playerRef.current, keySystems, licenseHeaders, signedCookies );
    loadPlaybackURL( playerRef.current, src );
  }

  /* Handles LIVE/HLS contents playback */

  function loadLiveAndHLSAsset( src, keySystems, licenseHeaders, signedCookies ){
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] loadLiveAndHLSAsset...` );
    if( !playerRef.current ){
      playerRef.current = createPlayer( shakaPlayer );
    }

    addPlayerConfiguration( playerRef.current, keySystems, licenseHeaders, signedCookies );
    loadPlaybackURL( playerRef.current, src );
  }

  /* Player Event :Playing  */
  const handlePlayingEvent = () => {
    setIsPlaying( true );
    setIsError( false );
    setLoading( false );
    startEventAPICall();
    updatePlayerState( { playCount: playerStateRef.current.playCount + 1, playStartTime: new Date(), bufferStop: playerRef.current?.getBufferedInfo()?.video[0]?.end } );
    setBufferStop( playerRef.current?.getBufferedInfo()?.video[0]?.end );
    mixPanelEventsOnPlayPause( videoControllerRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
  }

  /* Player Event :Pause  */
  const handlePauseEvent = ()=>{
    setIsPlaying( false );
    stopEventAPICall();
    updatePlayerState( { pauseCount: playerStateRef.current.pauseCount + 1, pauseStartTime: new Date() } );
    mixPanelEventsOnPlayPause( videoControllerRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
  }

  /* Handle error popup */
  const handleError = ( error ) => {
    console.log( 'player-error', error )
    setLoading( false );
    // Stop the player from trying to reload.
    if( playerRef.current ){
      playerRef.current.unload();
    }
    setIsError( true );
    if( modalRef.current && !modalRef.current.open ){
      modalRef.current.showModal();
    }
  }

  const handleTimeUpdate = throttle( ()=>{
    if( keyPressRef.current ){
      return;
    }
    const { position, duration, playMode, isAtLiveEdge } = streamRangeHelper.current?.calculateNewState();
    // console.log( 'Player State...', playMode, position, duration, isAtLiveEdge );
    currentTimeRef.current = parseInt( position, 10 );
    setCurrentTime( currentTimeRef.current );
    playerStateRef.current.totalWatchedTime += 1;
    !liveContent && setProgress( ( parseInt( currentTimeRef.current, 10 ) / totalTimeRef.current ) * 100 );
    if( isSeries( metaData ) && nextEpisodeResponseObj.current?.data?.nextEpisodeExists && totalTimeRef.current !== 0 && ( Math.round( currentTimeRef.current ) >= Math.round( totalTimeRef.current ) - 6 ) && playerStateRef.current.isNextEpisodeAvailable ){
      setNextEpisodeTimer( Math.round( totalTimeRef.current ) - Math.round( currentTimeRef.current ) - 1 );
      setIsNextEpisodeAvailable( !playerStateRef.current.isPremiumContent );
      updatePlayerState( { isNextEpisodeAvailable: false } );
    }
    else if( !playerStateRef.current.isNextEpisodeAvailable && isSeries( metaData ) && nextEpisodeResponseObj.current?.data?.nextEpisodeExists && totalTimeRef.current !== 0 && ( Math.round( currentTimeRef.current ) < Math.round( totalTimeRef.current ) - 6 ) ){
      setIsNextEpisodeAvailable( false );
      updatePlayerState( { isNextEpisodeAvailable: true } );
    }
  }, 1000 );

  const handleLoadedData = ()=>{
    if( !liveContent && lastWatchedSeconds && firstPlaybackRef.current ){
      firstPlaybackRef.current = false;
      videoControllerRef.current.currentTime = lastWatchedSeconds;
      setCurrentTime( lastWatchedSeconds );
    }
    else if( liveContent ){
      handleGoLive();
    }
  }

  const handleStalled = () => {
    console.warn( 'Playback stalled. Attempting to recover...' );
    // TODO: logic to recovero once stalled for x time and if recovered automatically block execution
  }

  /* Combined method to handle all the events */
  const onEvent = ( event ) => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] Event: ${event.type}` );
    // Additional logic based on the event type
    switch ( event.type ){
      case 'loadeddata':
        handleLoadedData();
        break;
      case 'error':
        console.error( 'Error occurred:', event.detail );
        stopEventAPICall();
        setErrorMsg( { errorMsg: event.detail } )
        setIsError( true );
        break;
      case 'play':
        break;
      case 'buffering':
        setBufferStart( playerRef.current?.getBufferedInfo()?.video[0]?.start );
        updatePlayerState( { bufferStart: playerRef.current?.getBufferedInfo()?.video[0]?.start } );
        break;
      case 'pause':
        handlePauseEvent();
        break;
      case 'timeupdate':
        handleTimeUpdate();
        break;
      case 'loadedmetadata':
        if( liveContent ){
          setProgress( 100 );
        }
        else {
          getSubtitleByResponse( playerRef.current, videoControllerRef.current, playerStateRef.current.subtitlePlayUrlRef );
          handleAudioTrack( playerRef.current );
          totalTimeRef.current = playerRef.current?.getMediaElement().duration;
          setTotalTime( totalTimeRef.current );
        }
        break;
      case 'playing':
        handlePlayingEvent();
        break;
      case 'ended':
        handleEndedEvent();
        break;
      case 'seeking':
        console.log( 'seeking...' );
        setLoading( true );
        break;
      case 'seeked':
        console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] seeked...` );
        setLoading( false );
        break;
      case 'stalled':
        console.log( 'stalled...' );
        handleStalled();
        break;
      // Add more cases for other events as needed
      default:
        break;
    }
  };

  /* Event Handler */
  const eventHandlers = {
    loadeddata: onEvent,
    loadedmetadata: onEvent,
    play: onEvent,
    playing: onEvent,
    pause: onEvent,
    error: onEvent,
    buffering: onEvent,
    timeupdate: onEvent,
    ended: onEvent,
    seeking: onEvent,
    seeked: onEvent,
    waiting: onEvent,
    progress: onEvent,
    loadstart: onEvent,
    suspend: onEvent,
    emptied: onEvent,
    stalled: onEvent,
    canplay: onEvent,
    canplaythrough: onEvent,
    durationchange: onEvent,
    ratechange: onEvent,
    resize: onEvent,
    volumechange: onEvent
  }

  /* Handle Go Live */
  const goLiveOperation = () => {
    const { position, duration, playMode, isAtLiveEdge } = streamRangeHelper.current?.calculateNewState();
    updatePlayerState( { goLiveTimeRef: playerStateRef.current.goLiveTimeRef + 1 } );
    console.log( 'goLiveOperation...', playMode, isAtLiveEdge );

    if( !isAtLiveEdge ){
      if( playerStateRef.current.goLiveTimeRef > 30 ){
        goLiveRef.current = true;
        setIsGoLive( true );
        setProgress( 100 - ( playerStateRef.current.goLiveTimeRef / 1800 ) * 100 ); // 1800 is used as duration for livecontent to handle progressbar when paused
      }
    }
  }

  /* Handle Play/Pause Toggle */
  const toggleVideoPlay = () => {
    if( videoControllerRef.current?.paused ){
      videoControllerRef.current?.play?.();
    }
    else {
      videoControllerRef.current?.pause?.();
    }
  }

  const handlePlayerExit = ()=>{
    updatePlayerState( { pauseCount: playerStateRef.current.pauseCount, pauseStartTime: new Date() } );
    mixpanelEventOnEndedEvent( videoControllerRef.current, playerStateRef.current.playCount, playerStateRef.current.pauseCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
    goBackToPrevPage()
  }

  /* Handle Key press */
  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( modalDom() ){
      return;
    }

    switch ( keyCode ){
      case 8:
      case PLAYER.SAMSUNG_RETURN:
      case PLAYER.LG_RETURN:
        if( document.querySelector( '.playerPopup' ) ){
          setShowSubtitleList( false );
          setShowAudioList( false );
          setShowVideoList( false );
          setIsPopupOpen( false );
        }
        else {
          handlePlayerExit();
        }
        break;
      case PLAYER.ENTER:
        if( goLiveRef.current && getCurrentFocusKey().includes( 'GOLIVE' ) || getCurrentFocusKey().includes( 'INAPP_POPUP_ITEM' ) ){
          return;
        }
        toggleVideoPlay();
        break;
      case PLAYER.PLAY:
        videoControllerRef.current?.play?.();
        break;
      case PLAYER.PAUSE:
        videoControllerRef.current?.pause?.();
        break;
      case PLAYER.DOWN:
        break;
      case PLAYER.UP:
        break;
      case PLAYER.RIGHT:
      case PLAYER.FF:
        if( getCurrentFocusKey().includes( 'BUTTON_PRIMARY' ) ){
          return
        }
        if( !liveContent && !getCurrentFocusKey().includes( 'BUTTON_PRIMARY' ) ){
          handleForward()
        }
        break;
      case PLAYER.RW:
      case PLAYER.LEFT:
        if( getCurrentFocusKey().includes( 'BUTTON_PRIMARY' ) ){
          return
        }
        if( !liveContent && !getCurrentFocusKey().includes( 'BUTTON_PRIMARY' ) ){
          handleRewind();
        }
        break;
      case PLAYER.STOP:
        handlePlayerExit();
        break;
      default:
        break;
    }
  } )

  /* Handle Key release */
  const onKeyRelease = useCallback( ( { keyCode } ) => {
    const videoElement = videoControllerRef.current;
    if( videoElement && keyPressRef.current && forwardRwKeys.includes( keyCode ) ){
      videoElement.currentTime = currentTimeRef.current;
      setCurrentTime( videoElement.currentTime );
      keyPressRef.current = false;
    }
  } );

  /* Handle FF */
  const handleForward = ()=>{
    keyPressRef.current = true;
    if( currentTimeRef.current >= totalTimeRef.current - PLAYER.SEEK_INTERVAL ){
      currentTimeRef.current = totalTimeRef.current;
    }
    else {
      currentTimeRef.current = currentTimeRef.current + PLAYER.SEEK_INTERVAL;
    }
    setProgress( ( parseInt( currentTimeRef.current, 10 ) / totalTimeRef.current ) * 100 );
  }

  /* Handle RW */
  const handleRewind = ()=>{
    if( !liveContent ){
      keyPressRef.current = true;
      if( currentTimeRef.current > 0 ){

        if( currentTimeRef.current > PLAYER.SEEK_INTERVAL ){
          currentTimeRef.current = currentTimeRef.current - PLAYER.SEEK_INTERVAL;
        }
        else {
          currentTimeRef.current = 0;
        }
        setProgress(
          ( parseInt( currentTimeRef.current, 10 ) / totalTimeRef.current ) * 100
        );
      }
    }
  }

  /* Handle Go Live button click */
  const handleGoLive = () => {
    streamRangeHelper.current?.gotoLive();
    videoControllerRef.current?.play?.();
    setProgress( 100 );
    setIsGoLive( false );
    clearTimeout( playerStateRef.current.goLiveRefTimeout );
    playerStateRef.current.goLiveRefTimeout = setTimeout( () => {
      goLiveRef.current = false;
    }, 200 );
    clearInterval( timeUpdateInterval );
    timeUpdateInterval = null;
  }

  /* FFRW handling with mouse pointer */
  const handleManualProgress = ( progressValue, currentValue ) => {
    setProgress( progressValue );
    if( videoControllerRef.current ){
      videoControllerRef.current.currentTime = currentValue;
    }
    setCurrentTime( currentValue );
  };

  /* Visibility of test tracks if user selects none */
  const updateSubtitleMode = ( trackLabel, textTracks, index ) => {
    setCurrentSubtitle( trackLabel === TRACK_MODE.NONE || trackLabel === undefined ? TRACK_MODE.NONE : trackLabel )
    if( isSubtitleThroughURL ){
      for ( let i = 0; i < textTracks?.length; i++ ){
        const texttrack = textTracks[i];
        if( trackLabel === texttrack.label ){
          texttrack.mode = TRACK_MODE.SHOWING;
        }
        else {
          texttrack.mode = TRACK_MODE.DISABLED; // Disable other tracks
        }
      }
    }
    else {
      trackLabel === TRACK_MODE.NONE || trackLabel === undefined ? playerRef.current?.setTextTrackVisibility( false ) : playerRef.current?.setTextTrackVisibility( true )
    }
  }

  /* Handling of subtitles, Logic is written in player composer */
  const handleSubtitle = ( player, isSubtitleThroughURL )=>{
    console.log( 'isSubtitleThroughURL', player, isSubtitleThroughURL )
    if( playerRef.current ){
      let textTracks;
      if( isSubtitleThroughURL ){
        textTracks = videoControllerRef.current?.textTracks;
      }
      else {
        textTracks = playerRef.current?.getTextTracks();
      }
      getSubtitleTracks( textTracks, listSubtitle, false, ( subtitleLangListRef, isValidLanguage, textTrackRef )=>{
        hasSubtitle.current = isValidLanguage;
        trackRecord.current = textTrackRef;
      } );
      updateSubTrack( playerStateRef.current.currentSubTrack ? playerStateRef.current.currentSubTrack : trackRecord.current && trackRecord.current[0] );
    }
  }

  /* To close subtitle popup & handling text track visibility */
  const hideSubtitles = ( trackLabel, index )=>{
    videoControllerRef.current?.play?.();
    console.log( 'hideSubtitles', trackLabel, index )
    setIsPopupOpen( false );
    clearTimeout( subtitleListVisibilityTimeOut );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowSubtitleList( false )
    }, 200 );
    playerStateRef.current.subIndex = index
    updateSubTrack( trackLabel, index );
  }
  const updateSubTrack = ( trackLabel, index ) => {
    let textTracks;
    if( isSubtitleThroughURL ){
      textTracks = videoControllerRef.current?.textTracks;
    }
    else {
      textTracks = playerRef.current?.getTextTracks();
      if( index >= 1 ){
        playerRef.current?.selectTextTrack( textTracks[index - 1]?.id );
      }
    }
    updatePlayerState( { currentSubTrack: trackLabel } );
    updateSubtitleMode( trackLabel, textTracks, index );
  }

  const updateAudioTrack = ( trackLabel, index )=>{
    const selectedLanguage = getLanguageCode( iso6392, trackLabel ) || trackLabel;
    console.log( 'selectedLanguage', selectedLanguage );
    playerRef.current?.selectAudioLanguage( selectedLanguage );
    setCurrentAudioTrack( selectedLanguage );
    updatePlayerState( { currentAudioTrack: selectedLanguage } );
  }

  /* To close audio popup & handling text track visibility */
  const hideAudioPopup = ( trackLabel, index )=>{
    videoControllerRef.current?.play?.();
    console.log( 'hideAudioPopup', trackLabel, index );
    setIsPopupOpen( false );
    clearTimeout( subtitleListVisibilityTimeOut );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowSubtitleList( false )
      setShowAudioList( false )
    }, 200 );
    updateAudioTrack( trackLabel, index );
  }

  /* Player Event :Ended  */
  const handleEndedEvent = () => {
    loadAttemptRef.current = true;
    stopEventAPICall();
    setProgress( 0 );
    // replay cta logic
    // TODO - Replay
    if( !isSeries( metaData ) || !playerStateRef.current.isPremiumContent ){
      playerEventFetchData( { type: metaData.contentType, id: playerVodId, watchDuration: Math.floor( totalTimeRef.current ), totalDuration: Math.floor( totalTimeRef.current ) } );
    }
    // go to next eposide playback or goBackToPI
    if( !isSeries( metaData ) || !nextEpisodeResponseObj.current?.data?.nextEpisodeExists ){
      handlePlayerExit();
    }
    else if( !playerStateRef.current.isPremiumContent ){
      mixpanelEventOnEndedEvent( videoControllerRef.current, playerStateRef.current.playCount, playerStateRef.current.pauseCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
      playerStateRef.current.totalWatchedTime = 0;
      setLoading( true );
      const nextEpisodePlayUrls = getNextEpisodePlayableUrls( myPlanProps, storedContentInfo, config, nextEpisodeResponseObj );
      nextEpisodePlayUrls.then( ( resolvedValues ) => {
        if( resolvedValues ){
          setContentPlaybackData( resolvedValues );
        }
      } );
      setPlayerVodId( nextEpisodeResponseObj.current?.data?.nextEpisode?.id )
      setPlayBackTitle( nextEpisodeResponseObj.current?.data?.nextEpisode?.title );
      setSubtitlePlayUrl?.( nextEpisodeResponseObj.current?.data?.subtitlePlayUrl );
      checkNextEpisodeAvailable();
    }
    else {
      handlePlayerExit()
    }
  };

  /* Handling of audio tracks */
  const handleAudioTrack = ( player )=>{
    const audioTracks = player?.getAudioLanguages();
    const tracks = audioTracks.filter( track => track !== '' ).map( track => getLanguageLabel( iso6392, track ) || track ).sort();
    setAudioTracks( tracks );
    updateAudioTrack( playerStateRef.current.currentAudioTrack ? playerStateRef.current.currentAudioTrack : tracks[0] );
    tracks?.length > 1 ? updatePlayerState( { hasAudioTracks: true } ) : updatePlayerState( { hasAudioTracks: false } );
    // console.log( 'enabled video quality', player.getVariantTracks().findIndex( track => track.active === true ) );
  }

  const handleVideoTrack = ( player )=>{
    const variantTracks = player.getVariantTracks();
    const qualityTracksForCurrentAudio = variantTracks.filter( track => track.language === currentAudioTrack );
    const filteredTracks = getUniqueHighestBandwidthTracks( qualityTracksForCurrentAudio );
    const displayFormatedTracks = [constants.AUTO, ...( filteredTracks?.map( track => `${track.height}p` ) ?? [] )];
    displayFormatedTracks.sort( ( a, b ) => parseInt( a, 10 ) - parseInt( b, 10 ) );
    updatePlayerState( { variantTracks: filteredTracks } );
    setVideoTracks( displayFormatedTracks );
    if( displayFormatedTracks?.includes( playerStateRef.current.currentVideoTrack ) ){
      updateVideoTrack( playerStateRef.current.currentVideoTrack );
    }
    else {
      updateVideoTrack( constants.AUTO );
      updatePlayerState( { currentVideoTrack: constants.AUTO } );
    }
    console.log( `videoqualityTracks for language ${currentAudioTrack} `, filteredTracks, player.getVariantTracks() );
    displayFormatedTracks?.length > 1 ? updatePlayerState( { hasVideoTracks: true } ) : updatePlayerState( { hasVideoTracks: false } );
  }

  const updateVideoTrack = ( trackLabel, index )=>{
    const selectedTrackLabel = trackLabel.match( /\d+/ )?.[0] || trackLabel;
    const selectedTrack = playerStateRef.current.variantTracks.find( track => track.height.toString() === selectedTrackLabel ) || selectedTrackLabel;
    if( selectedTrack === constants.AUTO ){
      playerRef.current.configure( { abr: { enabled: true } } );
      setCurrentVideoTrack( constants.AUTO );
    }
    else {
      clearTimeout( playerStateRef.current.videoSelectionTimeout );
      playerStateRef.current.videoSelectionTimeout = setTimeout( ()=>{
        playerRef.current.configure( { abr: { enabled: false } } );
        playerRef.current.selectVariantTrack( selectedTrack, /* clearBuffer */ false );
        updatePlayerState( { currentVideoTrack: trackLabel } );
      }, 5000 );
      setCurrentVideoTrack( trackLabel );
    }
  }

  const hideVideoPopup = ( trackLabel, index )=>{
    videoControllerRef.current?.play?.();
    setIsPopupOpen( false );
    clearTimeout( subtitleListVisibilityTimeOut );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowVideoList( false );
    }, 200 );
    updateVideoTrack( trackLabel, index );
  }

  useEffect( ()=>{
    if( currentAudioTrack ){
      !liveContent && handleVideoTrack( playerRef.current );
    }
  }, [currentAudioTrack, playerVodId] )

  /* Retry Logic */
  const handleCancelPopup = () => {
    setIsError( false )
    setContentPlaybackData( null )
    loadAttemptRef.current = true;
    setLoading( true )
    modalRef.current?.close();
    clearInterval( timeUpdateInterval );
    if( playerRef.current ){
      playerRef.current.destroy();
      playerRef.current = null;
    }
    if( isLiveContentType( metaData?.contentType ) ){
      const metaData = get( storedContentInfo, 'data.meta[0]', {} )
      const channelMeta = get( storedContentInfo, 'data.channelMeta', {} );
      getEncryptedPlayUrl( metaData, channelMeta )
    }
    else {
      fetchPlaybackUrls( myPlanProps, storedContentInfo, config )
    }
  }

  /* Retry Live Channels */
  const liveChannelPlayUrl = async( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } ) => {
    const livePlaybackData = await getLiveChannelPlaybackUrls( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } )
    setContentPlaybackData( livePlaybackData )
  };

  /* Retry Non Live */
  const fetchPlaybackUrls = async() => {
    const nonLivePlaybackUrls = await getPlayableUrls( myPlanProps, storedContentInfo, config, storedLastWatchData )
    setContentPlaybackData( nonLivePlaybackUrls )
  };

  /* Handle Exit pop up */
  const handleExitPopup = () => {
    clearTimeout( timerExit )
    timerExit = null
    timerExit = setTimeout( () => {
      setIsError( false );
      loadAttemptRef.current = true;
      modalRef.current?.close();
      handlePlayerExit();
    }, 20 );
  }

  /* CDN security call for the encrpyted live contents */
  const getEncryptedPlayUrl = ( metaData, channelMeta ) => {
    if( getAuthToken() ){
      const userInfo = JSON.parse( getUserInfo() );
      fetchDecryptedPlayUrlLive( { url: serviceConst.LIVE_DECRYPTED_PLAY_URLS + metaData?.contentType + '/' + channelMeta?.id, headers: {
        authorization: getAuthToken(),
        dthstatus: getDthStatus(),
        subscriberid: getSubscriberId(),
        subscriptiontype: userInfo?.subscriptionPlanType
      } } )
    }
  }

  useEffect( ()=>{
    if( isError ){
      console.log( 'player error', isError )
      handleError();
    }
  }, [isError] )

  useEffect( ()=>{
    if( subtitlePlayUrl ){
      updatePlayerState( { subtitlePlayUrlRef: subtitlePlayUrl } )
    }
  }, [subtitlePlayUrl] )

  useEffect( ()=>{
    // golive handling logic
    if( !isPlaying && playerRef.current && liveContent ){
      clearInterval( timeUpdateInterval );
      timeUpdateInterval = null;
      timeUpdateInterval = setInterval( () => {
        goLiveOperation();
      }, 1000 );
    }
    else {
      setTimeout( () => {
        updatePlayerState( { goLiveTimeRef: 0 } );
        clearInterval( timeUpdateInterval );
        timeUpdateInterval = null;
      }, 30 );
    }

    return ()=> clearInterval( timeUpdateInterval );
  }, [isPlaying] )

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    window.addEventListener( 'keyup', onKeyRelease );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
      window.removeEventListener( 'keyup', onKeyRelease );
    }
  }, [] );

  useEffect( ()=>{
    if( liveContent ){
      setProgress( 100 );
    }

    return ()=>{
      // Remove the event listeners
      if( videoControllerRef.current ){
        Object.entries( eventHandlers )?.forEach( ( [name, handler] ) => {
          videoControllerRef.current.removeEventListener( name, handler );
        } );
      }
      if( playerRef.current ){
        playerRef.current.removeEventListener( 'error', onEvent );
        playerRef.current.removeEventListener( 'adaptation', handleAdaptation );
      }
      clearTimeout( playerStateRef.current.videoSelectionTimeout );
      clearTimeout( playerStateRef.current.goLiveRefTimeout );
      unmountPlayer()
    }
  }, [] )

  useEffect( () => {
    if( contentPlaybackData && videoControllerRef.current ){
      console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] contentPlaybackData -- ShakaPlayer.js`, contentPlaybackData );
      const playbackData = contentPlaybackData?.playbackData;
      const playbackSrc = playbackData?.src;
      const error = contentPlaybackData?.error;

      if( playbackData && Object.keys( playbackData )?.length ){
        if( playbackSrc ){
          playerRedirection( playbackSrc, playbackData.keySystems, playbackData.licenseHeaders, playbackData.signedCookies );
        }
      }
      else if( error || !playbackSrc ){
        setIsError( true );
        // trackErrorEvents( MIXPANELCONFIG.EVENT.PLAYBACK_FAILURE, error, metaData?.provider );
        setErrorMsg( { errorMsg: error?.message || NOTIFICATION_RESPONSE.info, show: true, title: NOTIFICATION_RESPONSE.message, url: playbackSrc } )
      }
    }

  }, [contentPlaybackData] );

  useEffect( () => {
    if( isError && errorMsg?.errorMsg ){
      mixpanelEventOnError( playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, errorMsg.errorMsg );
    }
  }, [isError, errorMsg] );

  useEffect( ()=>{
    if( isDeviceRemoved ){
      unmountPlayer()
    }
  }, [isDeviceRemoved] )

  useEffect( () => {
    if( decryptedPlayUrlLiveResponse && decryptedPlayUrlLiveResponse.data ){
      const dashWidewinePlayUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.dashWidewinePlayUrl )
      const dashWidewineLicenseUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.dashWidewineLicenseUrl )
      const metaData = get( storedContentInfo, 'data.meta[0]', {} )
      const epidsSet = get( storedContentInfo, 'data.detail.offerId.epids', {} );
      const contentId = get( storedContentInfo, 'data.channelMeta.id' )
      liveChannelPlayUrl( { provider: metaData.provider, contentType: metaData.contentType, epidsSet: epidsSet, playback_url: dashWidewinePlayUrl, licenceUrl: dashWidewineLicenseUrl, contentId } )
    }
  }, [decryptedPlayUrlLiveResponse] )

  useEffect( ()=>{
    playerStateRef.current.isPremiumContent = isPremium;
  }, [isPremium] )


  return (
    <div className='ShakaPlayer' >
      { loading &&
        <Loader
          isPlayer={ true }
          playerBgColor={
            playerStateRef.current.playCount === 0 && lastWatchedSeconds > 0
          }
        />
      }
      { isError &&
        <div ref={ errorRef }
          className='ShakaPlayer__pageError'
        >
          <NotificationsPopUp
            modalRef={ modalRef }
            handleCancel={ () => handleExitPopup() }
            opener={ buttonRef }
            buttonClicked={ () => {
              handleCancelPopup()
            } }
            { ...NOTIFICATION_RESPONSE }
            message={ ( errorMsg && errorMsg.show ) ? errorMsg.title : NOTIFICATION_RESPONSE.message }
            info={ ( errorMsg && errorMsg.show ) ? errorMsg.errorMsg : NOTIFICATION_RESPONSE.info }
            focusKeyRefrence={ 'DONE_BUTTON' }
            showModalPopup={ isError }
          />
        </div>
      }
      { !isError &&
        <div className='ShakaPlayer__Container'>
          <video
            id='video'
            ref={ videoControllerRef }
            className='ShakaPlayer__videoPlayer'
            autoPlay
          >
          </video>
          { !isDeviceRemoved &&
            <PlayerOverlay
              progress={ progress || 0 }
              controlsVisibility={ isActive }
              progressBarPosition
              seekTo={ handleManualProgress }
              liveContent={ liveContent }
              onChange={ ()=>{} }
              isVideoPlaying={ isPlaying }
              playBackTitle={ playBackTitle }
              isGoLive={ isGoLive }
              handleGoLive={ handleGoLive }
              toggleVideoPlay={ toggleVideoPlay }
              performOperationBasedOnTime={ goLiveOperation }
              videoCurrentTime={ currentTime }
              videoDuration={ totalTime }
              hasSubtitle={ hasSubtitle.current }
              showSubtitleList={ showSubtitleList }
              listSubtitle={ listSubtitle.current }
              setShowSubtitleList={ setShowSubtitleList }
              hideSubtitles={ hideSubtitles }
              hasAudioTracks={ playerStateRef.current.hasAudioTracks }
              audioTrackList={ audioTracks }
              setShowAudioList={ setShowAudioList }
              showAudioList={ showAudioList }
              hideAudioPopup={ hideAudioPopup }
              isLoading={ loading }
              hasVideoTracks={ playerStateRef.current.hasVideoTracks }
              videoTrackList={ videoTracks }
              setShowVideoList={ setShowVideoList }
              showVideoList={ showVideoList }
              hideVideoPopup={ hideVideoPopup }
              setIsPopupOpen={ setIsPopupOpen }
              handleEndedEvent={ handleEndedEvent }
              nextEpisodeResponseObj={ nextEpisodeResponseObj.current }
              currentSubtutle={ currentSubtutle }
              currentAudioTrack={ currentAudioTrack }
              currentVideoTrack={ currentVideoTrack }
            />
          }
        </div>
      }
    </div>
  );
}

export default ShakaPlayer;