/* eslint-disable no-console */
/* eslint-disable no-loop-func */
/**
 * This component will add Playback functionality for all media across the appusing Video.js
 *
 * @module views/components/Player
 * @memberof -Common
 */
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import {
  PlayingEventApiCalling,
  SetTvodPlaybackExpiry,
  isDistroContent,
  getNextEpisodePlayableUrls,
  getPlayableUrls,
  getLanguageLabel,
  getLanguageCode,
  isLiveContentType
} from '../../../utils/slayer/PlayerService';
import videojs from 'video.js';
import videojs10 from 'video10.js';
import 'video.js/dist/video-js.css';
import './Player.scss';
import {
  useFocusable, getCurrentFocusKey,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation';
import constants, {
  PLAYER,
  PROVIDER_LIST,
  PAGE_TYPE,
  PROVIDERCHECKLIST,
  NOTIFICATION_RESPONSE,
  forwardRwKeys,
  AUTH_TYPE,
  ENCRYPTED_PLAYER_LIST,
  DISTRO_CHANNEL,
  isTizen,
  TRACK_MODE,
  PAGE_NAME
} from '../../../utils/constants';
import Loader from '../Loader/Loader';
import eme from 'videojs-contrib-eme';
import {
  generateGUID,
  isSeries,
  modalDom,
  UseInterval
} from '../../../utils/util';
import { getAuthToken, getBufferDifference, getDistroMeta, getDthStatus, getSubscriberId, getTrailerContentCategory, getTrailerResumeTime, getUserInfo, setBufferDifference, setDistroMeta, setTrailerContentCategory, setTrailerResumeTime } from '../../../utils/localStorageHelper';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import PlayerNextTile from '../PlayerNextTile/PlayerNextTile';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import PlayerOverlay from '../PlayerOverlay/PlayerOverlay';
import { TrackDistroEventCall, generateRandomNumber, getDistroEventTrackURL, getMetadataDistroTracking } from '../../../utils/slayer/DistroService';
import { usePlayerState } from './PlayerStateContext';
import { getDistroPlaybackUrls, getLiveChannelPlaybackUrls } from './PlayerNew/LivePlaybackUrl';
import { checkAuthType, DecryptedPlayUrlLive } from '../../../utils/slayer/PlaybackInfoService';
import get from 'lodash/get';
import { iso6392 } from 'iso-639-2';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { trackErrorEvents } from '../../../utils/logTracking';
import { getUniqueHighestBandwidthTracks } from '../../../utils/playerCommons/playersHelper';
import { useDecrypetedPlayURL } from '../../../utils/slayer/useDecrypedPlayURL';
import serviceConst from '../../../utils/slayer/serviceConst';
import useUserActivity from '../../../utils/playerCommons/useUserActivity';
import throttle from 'lodash/throttle';
import { useInView } from 'react-intersection-observer';
import { trailer_started, trailer_viewed } from '../../../utils/mixpanel/mixpanelService';

export const Player = function( props ){
  const {
    autoPlayTrailor,
    setPlayTrailor,
    endedPlayerInfo,
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
    srcPoster,
    watchTrailor,
    lastWatchedSeconds,
    currentSubtutle, setCurrentSubtitle
  } = props;

  const [isPlaying, setIsPlaying] = useState( false );
  const [loading, setLoading] = useState( true );
  const [showSubtitleList, setShowSubtitleList] = useState( false );
  const [showAudioList, setShowAudioList] = useState( false );
  const [isGoLive, setIsGoLive] = useState( false );
  const [progress, setProgress] = useState( 0 );
  const [trackedEventCount, setTrackedEventCount] = useState( 1 );
  const [dai_session_id, setDai_session_id] = useState( '' );
  const [audioTracks, setAudioTracks] = useState( [] );
  const [currentAudioTrack, setCurrentAudioTrack] = useState( '' );
  const [currentVideoTrack, setCurrentVideoTrack] = useState( constants.AUTO );
  const [videoTracks, setVideoTracks] = useState( [] );
  const [showVideoList, setShowVideoList] = useState( false );
  const [isPopupOpen, setIsPopupOpen] = useState( false );

  const hasSubtitle = useRef( false );
  const listSubtitle = useRef( ['None'] );
  const handleEndedCalled = useRef( false );
  const updateTotalTimeRef = useRef( true );
  const keyPressRef = useRef( 0 );
  const fromWaited = useRef( false );
  const intervalId  = useRef();
  const videoRef = useRef( null );
  const playerRef = useRef( null );
  const playerCount = useRef( 0 );
  const modalRef = useRef();
  const buttonRef = useRef();
  const errorRef = useRef( null );
  const currTimeRef = useRef( 0 );
  const totalTimeRef = useRef( 0 );
  const goLiveTimeRef = useRef( 0 );
  const goLiveRef = useRef( false );
  const playerStateRef = useRef( {
    playCount: 0,
    pauseCount: 0,
    playStartTime: new Date(),
    pauseStartTime: new Date(),
    bufferStart: 0,
    bufferStop: 0,
    isNextEpisodeAvailable: true,
    hasAudioTracks: false,
    currentAudioTrack: '',
    subtitlePlayUrlRef: null,
    hasVideoTracks: false,
    variantTracks: [],
    currentVideoTrack: '',
    isPremiumContent: false,
    totalWatchedTime: 0,
    currentSubTrack: ''
  } );

  const { isError, setIsError, currentTime, setCurrentTime, setBufferStart, setBufferStop, isNextEpisodeAvailable, setIsNextEpisodeAvailable, setVideoPlayer, errorMsg, setErrorMsg, setVideoElement } = usePlayerState();
  const {
    playBackTitle,
    setPlayBackTitle,
    metaData,
    storedLastWatchData,
    contentPlaybackData,
    setContentPlaybackData,
    storedContentInfo,
    subtitlePlayUrl,
    setSubtitlePlayUrl,
    trailor_url,
    setNextEpisodeTimer,
    setTrailerCurrentTime,
    setTrailerTotalTime,
    trailerCurrentTime,
    trailerTotalTime,
    isTrailerClicked,
    isPlayClicked
  } = usePlayerContext();


  const responseSubscription = useSubscriptionContext();
  const { trackRecord, liveContent, isDeviceRemoved, autoPlaytrailerScreenSaver } = useMaintainPageState();
  const trailerResumeTime = getTrailerResumeTime()
  // Use the custom hook to track user activity
  const isActive = useUserActivity( isPlaying, isPopupOpen );

  const [distroTracking] = TrackDistroEventCall()
  const { trackDistroEvent } = distroTracking

  const [decryptedPlayUrls] = DecryptedPlayUrlLive();
  const { fetchDecryptedPlayUrlLive, decryptedPlayUrlLiveResponse } = decryptedPlayUrls

  const { getDecryptedPlayURL } = useDecrypetedPlayURL()

  const configAuthToken = useMemo( () => checkAuthType( config.availableProviders, metaData?.provider ), [metaData, config] );
  const vodID = useMemo( () => storedLastWatchData?.vodId || metaData?.vodId, [storedLastWatchData, metaData] )
  const [playerVodId, setPlayerVodId] = useState( vodID )

  const [tvodPlaybackExpiry] = SetTvodPlaybackExpiry( {
    id: playerVodId
  } );
  const { tvodPlaybackExpiryFetchData } = tvodPlaybackExpiry;

  const [playerEventObj] = PlayingEventApiCalling(
    { metaData, watchedTime: 0 },
    true
  );
  const { playerEventFetchData } = playerEventObj;
  const { ref, inView, entry } = useInView( {
    threshold: 0.1
  } );

  const currentTimeDisplay = playerRef.current?.controlBar?.currentTimeDisplay?.formattedTime_
  const durationDisplay = playerRef.current?.controlBar?.durationDisplay?.formattedTime_

  const myPlanProps = responseSubscription?.responseData.currentPack;
  let subtitleListVisibilityTimeOut;
  let timerExit;
  let timeUpdateInterval = null;
  const videoJsOptions = {
    autoplay: true,
    muted: false,
    controls: false,
    fluid: true,
    loadingSpinner: false,
    inactivityTimeout: 4000,
    html5: {
      vhs: {
        overrideNative: true,
        fastQualityChange: false,
        enableLowInitialPlaylist: true
      },
      hls: {
        liveRangeSafeTimeDelta: 120 // Keeps the player 12 seconds behind the live edge
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
      nativeTextTracks: false
    },
    aspectRatio: '16:9',
    GOAL_BUFFER_LENGTH: 100,
    MAX_GOAL_BUFFER_LENGTH: 150,
    preload: 'auto',
    bufferAhead: 180,
    userActions: {
      doubleClick: false
    }
  };

  const unmountPlayer = ()=>{
    // dispose player
    let player = playerRef.current;
    if( player && !player.isDisposed() ){
      player.removeAttribute( 'src' ); // empty source
      player.dispose();
      player = null;
      playerRef.current = null;
    }

    // Clean up variables
    setBufferDifference( 0 )
    stopEventAPICall();
    clearInterval( intervalId.current );
    clearInterval( timeUpdateInterval );
    timeUpdateInterval = null;
  }

  /* This is to update the exiting player state object */
  const updatePlayerState = ( newState ) => {
    playerStateRef.current = { ...playerStateRef.current, ...newState };
  };

  /* This is events API call to track the playback time */
  const { startInterval: startEventAPICall, stopInterval: stopEventAPICall } = UseInterval( () => {
    playerEventFetchData( { type: metaData?.contentType, id: playerVodId, watchDuration: Math.floor( currTimeRef.current ), totalDuration: Math.floor( totalTimeRef.current ) } );
  }, ( watchTrailor || autoPlayTrailor ) ? null : 10000 );

  /*  This is Distro tracking events, as it has individual handling than the mixpanel */
  const trackInitialEvents = ( isPlaying ) =>{
    const maxInitialEvents = 10;
    const recurringEventInterval = 60; // Time interval for recurring events in seconds
    const maxRecurringEvents = Infinity; // Number of times vs60, vs120, vs180, etc., should be tracked
    let currentEventCount = trackedEventCount;

    if( !isPlaying ){
      setTrackedEventCount( currentEventCount + 1 );
      clearInterval( intervalId.current );
      return;
    }

    const data = getMetadataDistroTracking( DISTRO_CHANNEL.EVENTS.vs );

    const trackEvent = () => {
      const url = getDistroEventTrackURL( {
        ...data,
        eventName:
          DISTRO_CHANNEL.EVENTS.vs +
          ( currentEventCount > maxInitialEvents ?
            ( currentEventCount - maxInitialEvents ) * recurringEventInterval :
            currentEventCount ),
        randomValue: generateRandomNumber()
      } );

      trackDistroEvent( { url } );
      setTrackedEventCount( currentEventCount );
      currentEventCount++;

      if( currentEventCount === maxInitialEvents + 1 ){
        clearInterval( intervalId.current );
        intervalId.current = setInterval( trackEvent, recurringEventInterval * 1000 );
      }

      if( currentEventCount > maxInitialEvents + maxRecurringEvents ){
        clearInterval( intervalId.current );
      }
    };

    intervalId.current = setInterval( trackEvent, ( currentEventCount > maxInitialEvents ? recurringEventInterval * 1000 : 1000 ) );
  }

  /*  When Live content is paused then Go live button handling  */
  const goLiveOperation = () => {
    goLiveTimeRef.current = goLiveTimeRef.current + 1;
    if( goLiveTimeRef.current > 30 ){
      setIsGoLive( true );
      goLiveRef.current = true;
      setProgress( ( 100 - goLiveTimeRef.current / totalTimeRef.current * 100 ) )
    }
  }

  /* FFRW handling with mouse pointer */
  const handleManualProgress = ( progressValue, currentValue ) => {
    setProgress( progressValue );
    playerRef.current?.currentTime( currentValue );
  };

  /* Visibility of test tracks if user selects none */
  const updateSubtitleMode = ( data, index, trackMode ) => {
    // eslint-disable-next-line no-param-reassign
    data === TRACK_MODE.NONE ? trackMode = TRACK_MODE.HIDDEN : trackMode = TRACK_MODE.SHOWING;
  }

  /* To check the scheduled next Live content dont have the subtitles */
  const handleCueChange = ( ) => {
    if( trackRecord.current?.activeCues?.length ){
      hasSubtitle.current = true;
    }
    console.log( 'PlayerJS --- Active Cues Length-- ', trackRecord.current?.activeCues?.length )
  }

  /* Handling of subtitles, Logic is written in player composer */
  const handleSubtitle = ( player ) => {
    if( player ){

      const tracks = player.textTracks() || [];
      getSubtitleTracks( tracks, listSubtitle, true, ( subtitleLangListRef, isValidLanguage, textTrackRef )=>{
        hasSubtitle.current = liveContent ? false : isValidLanguage;
        trackRecord.current = textTrackRef;
        if( textTrackRef && liveContent ){
          textTrackRef.addEventListener( 'cuechange', handleCueChange )
        }
      } );
      updateSubTrack( playerStateRef.current.currentSubTrack ? playerStateRef.current.currentSubTrack : trackRecord.current && trackRecord.current[0] );
    }
  };

  /* To close subtitle popup & handling text track visibility */
  const hideSubtitles = ( data, index ) => {
    playerRef.current.play()
    setIsPopupOpen( false );
    clearTimeout( subtitleListVisibilityTimeOut );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowSubtitleList( false )
      updateSubTrack( data, index )
    }, 200 );
  }

  const updateSubTrack = ( data, index )=>{
    const tracks = playerRef.current?.textTracks();
    const selectedLanguage = getLanguageCode( iso6392, data ) || data;
    setCurrentSubtitle( data === TRACK_MODE.NONE || data === undefined ? TRACK_MODE.NONE : getLanguageLabel( iso6392, selectedLanguage ) )
    for ( let i = 0; i < tracks?.length; i++ ){
      const subTrack = tracks[i];
      subTrack.mode = ( subTrack.language === selectedLanguage || subTrack.language === data || subTrack.language?.includes( selectedLanguage ) ) ? 'showing' : 'disabled';
      if( subTrack.language?.includes( selectedLanguage ) || selectedLanguage === TRACK_MODE.NONE ){
        updatePlayerState( { currentSubTrack: selectedLanguage } );
        updateSubtitleMode( data, index, subTrack.mode )
      }
    }
  }


  const updateAudioTrack = ( trackLabel, index )=>{
    const tracks = playerRef.current?.audioTracks();
    const selectedLanguage = trackLabel === constants.SPANISH ? constants.ESPANOL_CODE : getLanguageCode( iso6392, trackLabel ) || trackLabel;
    for ( let i = 0; i < tracks?.length; i++ ){
      const audioTrack = tracks[i];
      if( selectedLanguage === audioTrack.language || audioTrack.language?.includes( selectedLanguage ) ){
        setCurrentAudioTrack( audioTrack.language );
        updatePlayerState( { currentAudioTrack: audioTrack.language } );
        audioTrack.enabled = true;
      }
      else {
        audioTrack.enabled = false; // Disable other tracks
      }
    }
  }

  /* Handling of audio tracks */
  const handleAudioTrack = ( player )=>{
    const audioTracks = player.audioTracks();
    const languageCodes = Array.from( audioTracks ).filter( track => track.language !== '' ).map( track => track.language );
    const audioLanguageList = languageCodes.map( track => track === constants.ESPANOL_CODE ? constants.SPANISH : getLanguageLabel( iso6392, track ) || track ).sort();
    setAudioTracks( audioLanguageList );
    updateAudioTrack( playerStateRef.current.currentAudioTrack ? playerStateRef.current.currentAudioTrack : audioLanguageList[0] );
    audioLanguageList?.length > 1 ? updatePlayerState( { hasAudioTracks: true } ) : updatePlayerState( { hasAudioTracks: false } );
  }

  /* To close audio popup & handling text track visibility */
  const hideAudioPopup = ( trackLabel, index ) => {
    playerRef.current.play()
    setIsPopupOpen( false );
    clearTimeout( subtitleListVisibilityTimeOut );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowAudioList( false );
    }, 200 );
    updateAudioTrack( trackLabel, index );
  }

  const handleVideoTrack = ( player )=>{
    const qualityLevels = player?.tech?.()?.vhs?.representations?.();
    const filteredTracks = getUniqueHighestBandwidthTracks( qualityLevels );
    const displayFormatedTracks = [constants.AUTO, ...filteredTracks.map( track => `${track.height}p` )];
    displayFormatedTracks.sort( ( a, b ) => parseInt( a, 10 ) - parseInt( b, 10 ) );
    updatePlayerState( { variantTracks: filteredTracks } );
    setVideoTracks( displayFormatedTracks );
    if( displayFormatedTracks.includes( playerStateRef.current.currentVideoTrack ) ){
      updateVideoTrack( playerStateRef.current.currentVideoTrack );
    }
    else {
      updateVideoTrack( constants.AUTO );
      updatePlayerState( { currentVideoTrack: constants.AUTO } );
    }
    displayFormatedTracks?.length > 1 ? updatePlayerState( { hasVideoTracks: true } ) : updatePlayerState( { hasVideoTracks: false } );
  }

  const updateVideoTrack = ( trackLabel, index )=>{
    const selectedTrackLabel = Number( trackLabel.match( /\d+/ )?.[0] ) || trackLabel;
    // Enabling selected quality track
    if( selectedTrackLabel === constants.AUTO ){
      playerRef.current?.tech?.()?.vhs?.representations?.()?.forEach( quality => {
        quality.enabled( true );
      } )
      setCurrentVideoTrack( constants.AUTO );
    }
    else if( selectedTrackLabel === constants.VIDEO_2160 ){
      const selectedTrack = playerStateRef.current.variantTracks.find( track => {
        return track.height === constants.VIDEO_1440
      } )
      playerRef.current?.tech?.()?.vhs?.representations?.()?.forEach( quality => {
        quality.enabled( quality.id === selectedTrack.id );
      } );
      setCurrentVideoTrack( trackLabel );
    }
    else {
      const selectedTrack = playerStateRef.current.variantTracks.find( track => track.height === selectedTrackLabel ) ;
      playerRef.current?.tech?.()?.vhs?.representations?.()?.forEach( quality => {
        quality.enabled( quality.id === selectedTrack.id );
      } );
      setCurrentVideoTrack( trackLabel );
    }
    updatePlayerState( { currentVideoTrack: trackLabel } );
    playerRef.current?.paused() && playerRef.current?.play();
    // console.log( 'enabled quality track', playerRef.current?.tech?.()?.vhs?.representations?.()?.find( rep => rep.enabled() ) )
  }

  const hideVideoPopup = ( trackLabel, index )=>{
    playerRef.current.play()
    clearTimeout( subtitleListVisibilityTimeOut );
    setIsPopupOpen( false );
    subtitleListVisibilityTimeOut = null;
    subtitleListVisibilityTimeOut = setTimeout( () => {
      setShowVideoList( false )
    }, 200 );
    updateVideoTrack( trackLabel, index );
  }

  useEffect( ()=>{
    if( currentAudioTrack ){
      !liveContent && handleVideoTrack( playerRef.current );
    }
  }, [currentAudioTrack, playerVodId] )


  /* Live/Non Live player duration handling */
  const setDuration = ()=>{
    if( liveContent ){
      totalTimeRef.current = 1800;
      setProgress( 100 );
    }
    else {
      totalTimeRef.current = Math.floor( playerRef.current?.duration() );
    }
  }

  /* Creates the player instance if not exits & sets the url for the playback */
  const launchPlayer = () => {
    if( !playerRef.current ){
      const videoElement = videoRef.current;
      let player;
      if( videoElement ){
        if( ( metaData?.provider?.toLowerCase() === PROVIDER_LIST.PLAYFLIX || ( isTizen && metaData?.provider?.toLowerCase() === PROVIDER_LIST.PLANET_MARATHI ) ) ){
          player = ( playerRef.current = videojs10(
            videoElement,
            videoJsOptions,
            () => {
              onReady && onReady( player, props );
            }
          ) );
        }
        else {
          player = ( playerRef.current = videojs(
            videoElement,
            videoJsOptions,
            () => {
              onReady && onReady( player, props );
            }
          ) );
        }
        setVideoPlayer( player );
        setVideoElement( videoElement );
        mixPanelEventOnFirstLaunch( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime );
        subtitleRef.current = handleSubtitle;
      }
    }
    else if( nextEpisodeResponseObj.current !== null ){
      playerRef.current.src( videoJsOptions.sources[0] );
      handlePlay();
      setDuration();
      updateTotalTimeRef.current = true;
      updatePlayerState( { isNextEpisodeAvailable: true } );
    }
  };

  /* After setting url, it loads meta & triggers playerready event */
  const onReady = ( player ) => {
    console.log(`##[${( performance.now() / 1000 ).toFixed( 2 )} sec] onReady`, player); //eslint-disable-line

    /*
    * removing videojs default control elements from dom
    */
    if( player ){
      const controlbar =  document.querySelector( '.vjs-control-bar' );
      controlbar && controlbar.parentNode.removeChild( controlbar );
      const bigPlayButton =  document.querySelector( '.vjs-big-play-button' );
      bigPlayButton && bigPlayButton.parentNode.removeChild( bigPlayButton );
      const poster =  document.querySelector( '.vjs-poster' );
      poster && poster.parentNode.removeChild( poster );
      const errorDisplay =  document.querySelector( '.vjs-error-display' );
      errorDisplay && errorDisplay.parentNode.removeChild( errorDisplay );
      const modelDialog =  document.querySelector( '.vjs-modal-dialog' );
      modelDialog && modelDialog.parentNode.removeChild( modelDialog );
    }

    player.ready( () => {
      if(
        AUTH_TYPE.includes( configAuthToken ) ||
       ENCRYPTED_PLAYER_LIST.includes( metaData?.provider?.toLowerCase() )
      ){
        player.eme();
      }

      if( !( autoPlayTrailor || watchTrailor ) && lastWatchedSeconds ){
        player?.currentTime( lastWatchedSeconds );
      }
      else if( trailerResumeTime >= trailerTotalTime && !isPlayClicked ){
        player?.currentTime( 0 );
      }
      else if( trailerResumeTime && !isPlayClicked ){
        player?.currentTime( trailerResumeTime );
      }

      Object.entries( eventHandlers )?.forEach( ( [name, handler] ) => {
        player.on( name, handler );
      } );
    } );

    mixpanelEventOnPlayerReady( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime );
  };

  /* Player Event :loadeddata  */
  const handleLoadeddata = () => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_loadeddata` ); // eslint-disable-line
    !liveContent && handleAudioTrack( playerRef.current );
    if(
      window.location.pathname.includes( PAGE_TYPE.PLAYER ) &&
          metaData &&
          metaData.rentalPrice
    ){
      tvodPlaybackExpiryFetchData();
    }
  }

  const timeStringToSeconds = ( timeString )=>{
    const parts = timeString?.split( ':' ).map( Number );
    return parts?.length === 2 ? ( parts[0] * 60 + parts[1] ) : parts[0];
  }



  useEffect( ()=>{
    if( currentTimeDisplay && durationDisplay && isTrailerClicked && !isPlayClicked ){
      setTrailerCurrentTime( timeStringToSeconds( currentTimeDisplay ) )
      setTrailerResumeTime( timeStringToSeconds( currentTimeDisplay ) )
      setTrailerTotalTime( timeStringToSeconds( durationDisplay ) )
    }
  }, [currentTimeDisplay] )
  /* Player Event :Playing  */
  const handlePlayingEvent = ()=>{
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_playing` ); // eslint-disable-line
    setIsPlaying( true );
    const player = playerRef.current;
    if( !getCurrentFocusKey() ){
      setIsPopupOpen( false )
      setFocus( 'PROGRESSBAR_INAPP' );
    }

    if( fromWaited.current ){
      localStorage.setItem( 'bufferEnd', new Date() );
      const sta = new Date( localStorage.getItem( 'bufferStart' ) );
      const sto = new Date( localStorage.getItem( 'bufferEnd' ) );
      const dif = new Date( sto ) - new Date( sta );
      const finalDiff = Number( getBufferDifference() ) + dif;
      setBufferDifference( finalDiff )
      fromWaited.current = false;
    }
    const bufferStopTime = player?.buffered()?.end( 0 ) / 1000 + player?.currentTime?.();
    setBufferStop( bufferStopTime.toFixed( 1 ) );
    updatePlayerState( { bufferStop: bufferStopTime.toFixed( 1 ) } );
    setLoading( false );
    if( playerCount.current === 0 && lastWatchedSeconds > 0 ){
      playerCount.current = playerCount.current + 1;
    }
    if( !( autoPlayTrailor || watchTrailor ) ){
      startEventAPICall();
    }
    if( updateTotalTimeRef.current ){
      setDuration();
      handleEndedCalled.current = false;
      updateTotalTimeRef.current = false;
    }
    updatePlayerState( { playCount: playerStateRef.current.playCount + 1, playStartTime: new Date() } );
    mixPanelEventsOnPlayPause( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
  }

  /* Player Event :Error  */
  const handleErrorEvent = () => {
    const player = playerRef.current;
    console.log( 'EVENT_error', isError, player.error_ ); //eslint-disable-line
    clearInterval( intervalId.current );
    stopEventAPICall();

    if( isDistroContent( metaData?.provider ) ){
      const data = getMetadataDistroTracking( DISTRO_CHANNEL.EVENTS.err )
      trackDistroEvent( { url: getDistroEventTrackURL( data ) } )
    }

    if( autoPlayTrailor ){
      setPlayTrailor( false )
      autoPlaytrailerScreenSaver.current = false
    }
    else if(
      metaData?.provider?.toLowerCase() === PROVIDER_LIST.HALLMARKMOVIESNOW &&
        isSeries( metaData ) &&
        totalTimeRef.current - currTimeRef.current >= 10
    ){
      console.log( 'checking only for Hallmark, as the last frame is throwing error' ); // eslint-disable-line
      onPiPlayEnd();
    }
    else {
      setErrorMsg( { errorMsg: { ...player.error_, url: player.options_?.sources?.[0]?.src } } )
      setIsError( true );
    }
  }

  /* Player Event :Waiting  */
  const handleWaitingEvent = () => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_waiting` ); // eslint-disable-line
    const player = playerRef.current;
    if(
      PROVIDERCHECKLIST.includes( metaData?.provider?.toLowerCase() ) &&
          currTimeRef.current > 10 &&
          currTimeRef.current === player?.currentTime() &&
          currTimeRef.current >=
            totalTimeRef.current - totalTimeRef.current * 0.02
    ){
          console.log('**INSIED EVENT_WAITING AND CALLING ENDED**'); // eslint-disable-line
      handleEndedEvent();
      handleEndedCalled.current = false;
    }
    fromWaited.current = true;
    localStorage.setItem( 'bufferStart', new Date() );
    const bufferStartTime = player.buffered().start( 0 ) / 1000 + player?.currentTime();
    setBufferStart( bufferStartTime.toFixed( 1 ) );
    updatePlayerState( { bufferStart: bufferStartTime.toFixed( 1 ) } );
  }

  /* Player Event :Seeked  */
  const handleSeekedEvent = () => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_seeked` ); // eslint-disable-line
    setLoading( false );
  }

  /* Player Event :Time Update  */
  const handleTimeUpdateEvent = throttle( ( e ) => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_timeupdate` ); // eslint-disable-line
    const player = playerRef.current;
    if( keyPressRef.current ){
      return;
    }
    if( player ){
      player.ready( () => {
        player.on( 'timeupdate', () => {
          const audioTracks = player.audioTracks();
          for ( let i = 0; i < audioTracks.length; i++ ){
            audioTracks[i].enabled = true; // Keep audio explicitly enabled
          }
        } );
      } );
    }

    currTimeRef.current = e.target.player?.currentTime();
    setCurrentTime( player?.currentTime() );
    !liveContent && setProgress( ( parseInt( currTimeRef.current, 10 ) / player?.duration() ) * 100 );
    playerStateRef.current.totalWatchedTime += 1;
    if( isSeries( metaData ) &&
    nextEpisodeResponseObj.current?.data?.nextEpisodeExists &&
    totalTimeRef.current &&
    currTimeRef.current !== 0 &&
    Math.round( currTimeRef.current ) >= Math.round( totalTimeRef.current ) - 6 &&
    playerStateRef.current.isNextEpisodeAvailable ){
      setNextEpisodeTimer( Math.round( totalTimeRef.current ) - Math.round( currTimeRef.current ) - 1 );
      setIsNextEpisodeAvailable( !playerStateRef.current.isPremiumContent );
      updatePlayerState( { isNextEpisodeAvailable: false } );
    }
    else if( !playerStateRef.current.isNextEpisodeAvailable &&
    isSeries( metaData ) &&
    nextEpisodeResponseObj.current?.data?.nextEpisodeExists &&
    totalTimeRef.current &&
    currTimeRef.current !== 0 &&
    Math.round( currTimeRef.current ) < Math.round( totalTimeRef.current ) - 6 ){
      setIsNextEpisodeAvailable( false );
      updatePlayerState( { isNextEpisodeAvailable: true } );
    }
    if(
      PROVIDERCHECKLIST.includes( metaData?.provider?.toLowerCase() ) &&
      Math.round( totalTimeRef.current ) !== 0 &&
      Math.round( currTimeRef.current ) >= Math.round( totalTimeRef.current )
    ){
      console.log('***inside TIMEUPDTE and Calling Ended**'); // eslint-disable-line
      handleEndedCalled.current = false;
      handleEndedEvent();
    }
  }, isDistroContent( metaData?.provider ) ? 1000 : 500 );

  /* Player Event :Ended  */
  const handleEndedEvent = ()=> {
    clearInterval( intervalId.current )
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_ended` )
    if( handleEndedCalled.current ){
      return;
    }
    handleEndedCalled.current = true;
    if( !( watchTrailor || autoPlayTrailor ) ){
      stopEventAPICall();
      // TODO - Replay
      if( !isSeries( metaData ) || !playerStateRef.current.isPremiumContent ){
        playerEventFetchData( { type: metaData?.contentType, id: playerVodId, watchDuration: Math.floor( totalTimeRef.current ), totalDuration: Math.floor( totalTimeRef.current ) } );
      }
    }
    setTimeout( () => {
      onPiPlayEnd();
    }, 50 );
    handleEndedCalled.current = false;
  };

  /* Player Event :Pause  */
  const handlePauseEvent = ()=>{
    setIsPlaying( false );
    stopEventAPICall();
    updatePlayerState( { pauseCount: playerStateRef.current.pauseCount + 1, pauseStartTime: new Date() } );
    mixPanelEventsOnPlayPause( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
  }

  /* Player Event :LoadedMeta  */
  const handleLoadedMetaData = () => {
    console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_loadedMeata` );
    const player = playerRef.current;
    getSubtitleByResponse( player, videoRef.current, playerStateRef.current.subtitlePlayUrlRef );
    setDuration();

    if( metaData && isDistroContent( metaData.provider ) ){
      const bufferStart = playerRef.current.buffered().start( 0 );
      playerRef.current.currentTime( bufferStart );
      const masterPlaylist = player.tech().vhs.playlists.src;
      if( masterPlaylist ){
        const streamId = extractStreamId( masterPlaylist.uri ) || generateGUID()
        console.log( 'Stream ID:', streamId );
        setDai_session_id( streamId );
      }
    }
  }

  /* Event Handler  */
  const eventHandlers = {
    loadeddata: handleLoadeddata,
    play: ()=>console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] EVENT_play` ),
    pause: handlePauseEvent,
    playing: handlePlayingEvent,
    ended: handleEndedEvent,
    error: handleErrorEvent,
    waiting: handleWaitingEvent,
    seeked: handleSeekedEvent,
    timeupdate: handleTimeUpdateEvent,
    loadedmetadata: handleLoadedMetaData
  }

  /* Distro: get Session ID for the tracking events */
  const extractStreamId = ( sourceUrl ) => {
    if( sourceUrl ){
      const regex = /\/stream\/([^\/]+)/;
      const match = sourceUrl.match( regex );
      return match ? match[1] : null;
    }
  }
  const trailerContentCategory = getTrailerContentCategory()

  const handlePlayerExit = ()=>{
    updatePlayerState( { pauseCount: playerStateRef.current.pauseCount, pauseStartTime: new Date() } );
    mixpanelEventOnEndedEvent( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
    trailer_viewed( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, autoPlayTrailor, videoRef.current?.currentTime, trailerContentCategory )
    goBackToPrevPage();
  }

  useEffect( ()=>{
    if( videoRef.current?.currentTime === videoRef.current?.duration ){
      trailer_viewed( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, autoPlayTrailor, videoRef.current?.currentTime, trailerContentCategory )
    }
  }, [videoRef.current?.currentTime] )

  /* On playback ends */
  const onPiPlayEnd = () => {
    if( autoPlayTrailor ){
      setPlayTrailor( false );
      autoPlaytrailerScreenSaver.current = false
      return;
    }
    if(
      watchTrailor ||
      !isSeries( metaData ) ||
      ( nextEpisodeResponseObj.current &&
        !nextEpisodeResponseObj.current.data.nextEpisodeExists )
    ){
      handlePlayerExit();
    }
    else if( !playerStateRef.current.isPremiumContent ){
      mixpanelEventOnEndedEvent( videoRef.current, playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, playerStateRef.current.totalWatchedTime );
      playerStateRef.current.totalWatchedTime = 0;
      setLoading( true );
      const nextEpisodePlayUrls = getNextEpisodePlayableUrls( myPlanProps, storedContentInfo, config, nextEpisodeResponseObj );
      nextEpisodePlayUrls.then( ( resolvedValues ) => {
        if( resolvedValues ){
          setContentPlaybackData( resolvedValues );
        }
      } );
      checkNextEpisodeAvailable();
      setPlayerVodId( nextEpisodeResponseObj.current?.data?.nextEpisode?.id )
      setPlayBackTitle( nextEpisodeResponseObj.current?.data?.nextEpisode?.title );
      setSubtitlePlayUrl( nextEpisodeResponseObj.current?.data?.subtitlePlayUrl );
    }
    else {
      handlePlayerExit()
    }
  };


  /* Triggers play event */
  const handlePlay = ()=>{
    playerRef.current?.ready( () => {
      playerRef.current.play().then( ( ) => {
        console.log( 'Video playback started successfully' );
      } ).catch( ( error ) => {
        console.error( 'Error starting video playback:', error );
      } );
    } );
  }
  /* This method handles rewind and left key press */
  const handleRewind = ( player )=>{
    keyPressRef.current = true;
    if( currTimeRef.current > 0 ){
      if( currTimeRef.current > PLAYER.SEEK_INTERVAL ){
        currTimeRef.current = currTimeRef.current - PLAYER.SEEK_INTERVAL;
      }
      else {
        currTimeRef.current = 0;
      }
      setProgress( ( parseInt( currTimeRef.current, 10 ) / player.duration() ) * 100 );
    }
  }

  /* This method handles forward and right key press */
  const handleForward = ( player )=>{
    keyPressRef.current = true;
    if( currTimeRef.current < totalTimeRef.current ){
      if( currTimeRef.current >= totalTimeRef.current - PLAYER.SEEK_INTERVAL ){
        currTimeRef.current = totalTimeRef.current;
      }
      else {
        currTimeRef.current = currTimeRef.current + PLAYER.SEEK_INTERVAL;
      }
      setProgress( ( parseInt( currTimeRef.current, 10 ) / player.duration() ) * 100 );
    }
  }
  /* Player Key Press event */
  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( autoPlayTrailor || getCurrentFocusKey()?.includes( 'DONE_BUTTON' ) ){
      return;
    }

    const player = playerRef.current;


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
        if( goLiveRef.current && getCurrentFocusKey()?.includes( 'GOLIVE' ) || getCurrentFocusKey()?.includes( 'INAPP_POPUP_ITEM' ) ){
          return;
        }
        toggleVideoPlay();
        break;
      case PLAYER.PLAY:
        handlePlay();
        break;
      case PLAYER.PAUSE:
        player.pause();
        break;
      case PLAYER.RW:
        !liveContent && handleRewind( player );
        break;
      case PLAYER.LEFT:
        if( getCurrentFocusKey()?.includes( 'BUTTON_PRIMARY' ) ){
          return;
        }
        !liveContent && handleRewind( player );
        break;
      case PLAYER.FF:
        !liveContent && handleForward( player );
        break;
      case PLAYER.RIGHT:
        if( getCurrentFocusKey()?.includes( 'BUTTON_PRIMARY' ) ){
          return;
        }
        !liveContent && handleForward( player );
        break;
      case PLAYER.UP:
        break;
      case PLAYER.DOWN:
        break;
      case PLAYER.STOP:
        handlePlayerExit();
        break;
    }
  } );

  /* Player Key release event */
  const onKeyRelease = useCallback( ( { keyCode } ) => {
    if(
      keyPressRef.current &&
      playerRef.current &&
      forwardRwKeys?.includes( keyCode )
    ){
      setLoading( true );
      // playerRef.current.muted( false )
      keyPressRef.current = false;
      if(
        PROVIDERCHECKLIST.includes( metaData?.provider?.toLowerCase() ) &&
        currTimeRef.current > 10 &&
        currTimeRef.current === playerRef.current?.currentTime() &&
        currTimeRef.current >=
          totalTimeRef.current - totalTimeRef.current * 0.02
      ){
        console.log('**INSIDE KEYRELEASE AND CALLING ENDED**'); // eslint-disable-line
        handleEndedEvent();
        handleEndedCalled.current = false;
        return;
      }
      playerRef.current?.currentTime( currTimeRef.current );
    }
  } );

  /* Playback Retry */
  const handleRetryOnErrorPopup = () => {
    setIsError( false );
    setContentPlaybackData( null )
    setErrorMsg( { errorMsg : null } )
    setLoading( true );
    modalRef.current?.close();
    if( playerRef.current && !playerRef.current.isDisposed() ){
      playerRef.current.removeAttribute( 'src' );
      playerRef.current.dispose();
      playerRef.current = null;
    }
    if( isLiveContentType( metaData?.contentType ) && isDistroContent( metaData.provider ) ){
      const channelMeta = get( storedContentInfo, 'data.channelMeta', {} );
      getEncryptedPlayUrl( metaData, channelMeta )
    }
    else {
      fetchPlaybackUrls( myPlanProps, storedContentInfo, config )
    }
  };

  /* Retry Non Live */
  const fetchPlaybackUrls = async() => {
    const nonLivePlaybackUrls = await getPlayableUrls( myPlanProps, storedContentInfo, config, storedLastWatchData )
    setContentPlaybackData( nonLivePlaybackUrls )
  };

  /* Retry Distro content */
  const distroPlayUrl = async( contentUrl ) => {
    const distroPlaybackData = await getDistroPlaybackUrls( { contentUrl } )
    setContentPlaybackData( distroPlaybackData )
  };

  /* Returns to PI on back press, when error came */
  const handleExitOnErrorPopup = () => {
    clearTimeout( timerExit );
    timerExit = null;
    timerExit = setTimeout( () => {
      setIsError( false );
      modalRef.current?.close();
      if( playerRef.current && !playerRef.current.isDisposed() ){
        playerRef.current.removeAttribute( 'src' );
        playerRef.current.dispose();
        playerRef.current = null;
      }
      handlePlayerExit();
    }, 20 );
  };

  /* Renders error popup */
  const errorPopup = () => (
    <div ref={ errorRef }
      className='page_player__pageError'
    >
      <NotificationsPopUp
        modalRef={ modalRef }
        handleCancel={ () => handleExitOnErrorPopup() }
        opener={ buttonRef }
        buttonClicked={ () => {
          handleRetryOnErrorPopup();
        } }
        { ...NOTIFICATION_RESPONSE }
        message={ ( errorMsg && errorMsg.show ) ? errorMsg.title : NOTIFICATION_RESPONSE.message }
        info={ ( errorMsg && errorMsg.show ) ? errorMsg.errorMsg : NOTIFICATION_RESPONSE.info }
        focusKeyRefrence={ 'DONE_BUTTON' }
        showModalPopup={ isError }
      />
    </div>
  )

  /* Pause/Play toggling */
  const toggleVideoPlay = ()=>{
    const player = playerRef.current;
    if( player ){
      if( player.paused() ){
        handlePlay();
      }
      else {
        player.pause();
      }
    }
  }

  /* handling of GO Live button */
  const handleGoLive = () => {
    clearInterval( timeUpdateInterval );
    playerRef.current?.liveTracker?.seekToLiveEdge?.();
    handlePlay();
    setIsPlaying( true );
    setProgress( 100 );
    goLiveRef.current = false;
    setIsGoLive( false );
    setLoading( false );
  }

  /* CDN security call for the encrpyted live contents */
  const getEncryptedPlayUrl = ( metaData, channelMeta ) => {
    if( getAuthToken() ){
      const userInfo = JSON.parse( getUserInfo() );
      fetchDecryptedPlayUrlLive( { url: serviceConst.LIVE_DECRYPTED_PLAY_URLS + metaData?.contentType + '/' + channelMeta?.id, headers: {
        authorization: getAuthToken(),
        dthstatus: getDthStatus(),
        subscriberid: getSubscriberId(),
        subscriptiontype: userInfo?.subscriptionPlanType,
        appType: DISTRO_CHANNEL.appType
      } } )
    }
  }


  useEffect( () => {
    if( ( autoPlayTrailor || watchTrailor ) && trailor_url ){
      videoJsOptions.sources = [{ src: trailor_url }];
      launchPlayer();
      if( metaData && !watchTrailor ){
        setTrailerContentCategory( 'TRAILER' )
        trailer_started( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, autoPlayTrailor )
      }

    }
  }, [trailor_url] );

  useEffect( () => {
    if( isError ){
      setLoading( false );
      setTimeout( () => {
        if( modalRef.current && !modalRef.current.open ){
          modalRef.current.showModal();
        }
      }, 10 );
    }
  }, [isError] );

  useEffect( () => {
    if( isError && errorMsg?.errorMsg ){
      mixpanelEventOnError( playerStateRef.current.pauseCount, playerStateRef.current.playCount, playerStateRef.current.bufferStart, playerStateRef.current.bufferStop, playerStateRef.current.pauseStartTime, playerStateRef.current.playStartTime, errorMsg.errorMsg );
    }
  }, [isError, errorMsg] );

  useEffect( ()=>{
    if( subtitlePlayUrl ){
      updatePlayerState( { subtitlePlayUrlRef: subtitlePlayUrl } )
    }
  }, [subtitlePlayUrl] )

  useEffect( ()=>{
    const player = playerRef.current;
    if( player && liveContent ){
      if( !isPlaying ){
        timeUpdateInterval = setInterval( () => {
          goLiveOperation();
        }, 1000 );
      }
      else {
        setTimeout( () => {
          goLiveTimeRef.current = 0;
          clearInterval( timeUpdateInterval );
          timeUpdateInterval = null;
        }, 30 );
      }
    }

    return ()=> clearInterval( timeUpdateInterval );
  }, [isPlaying] )

  useEffect( () =>{
    if( metaData && isDistroContent( metaData.provider ) ){
      clearInterval( intervalId.current )
      setTrackedEventCount( 1 )
    }
  }, [metaData] )

  useEffect( () => {
    if( metaData && isDistroContent( metaData.provider ) && dai_session_id ){
      setDistroMeta( { ...getDistroMeta(), dai_session_id : dai_session_id } )
      trackInitialEvents( isPlaying );
    }
  }, [isPlaying, metaData] )

  useEffect( () => {
    if( dai_session_id && isDistroContent( metaData.provider ) ){
      setDistroMeta( { ...getDistroMeta(), dai_session_id : dai_session_id } )
      const data = getMetadataDistroTracking( DISTRO_CHANNEL.EVENTS.vplay )
      trackDistroEvent( { url: getDistroEventTrackURL( data ) } )
    }
  }, [dai_session_id, metaData] )

  useEffect( () => {
    console.log( 'contentPlaybackData -- Player.js', contentPlaybackData );
    if( contentPlaybackData && videoRef.current ){
      const playbackData = contentPlaybackData?.playbackData;
      const playbackSrc = playbackData?.src;
      const error = contentPlaybackData?.error;

      if( playbackData && !autoPlayTrailor && !watchTrailor ){
        if( playbackSrc ){
          videoJsOptions.sources = [playbackData];
          launchPlayer();
        }
        else {
          setIsError( true );
          // trackErrorEvents( MIXPANELCONFIG.EVENT.PLAYBACK_FAILURE, error, metaData?.provider );
          setErrorMsg( { errorMsg: error?.message || NOTIFICATION_RESPONSE.info, show: true, title: NOTIFICATION_RESPONSE.message, url: playbackSrc } )
        }
      }
    }

  }, [contentPlaybackData] );

  useEffect( () => {
    // Add Event Listener
    if( !autoPlayTrailor ){
      window.addEventListener( 'keydown', onKeyPress );
      window.addEventListener( 'keyup', onKeyRelease );
    }

    // Added videojs eme
    if( metaData?.provider?.toLowerCase() === PROVIDER_LIST.PLAYFLIX || ( isTizen && metaData?.provider?.toLowerCase() === PROVIDER_LIST.PLANET_MARATHI ) ){
      if( videojs10 && !videojs10.getPlugin( 'eme' ) ){
        videojs10.registerPlugin( 'eme', eme );
      }
    }
    else if( videojs && !videojs.getPlugin( 'eme' ) ){
      videojs.registerPlugin( 'eme', eme );
    }

    // Setting progress for liveContent onMount
    if( liveContent ){
      setProgress( 100 );
    }

    // Cleanup
    return () => {
      console.log( '###PLAYERENDED', parseInt( currTimeRef.current, 10 ) )
      // remove event listener
      window.removeEventListener( 'keydown', onKeyPress );
      window.removeEventListener( 'keyup', onKeyRelease );
      if( trackRecord.current && liveContent && typeof trackRecord.current.removeEventListener === 'function' ){
        trackRecord.current.removeEventListener( 'cuechange', handleCueChange )
      }
      unmountPlayer()
    };
  }, [] );

  useEffect( ()=>{
    if( isDeviceRemoved ){
      unmountPlayer()
    }
  }, [isDeviceRemoved] )

  useEffect( () => {
    if( decryptedPlayUrlLiveResponse && decryptedPlayUrlLiveResponse.data ){
      if( decryptedPlayUrlLiveResponse.data.playUrl && isDistroContent( metaData?.provider ) ){
        const playUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.playUrl )
        distroPlayUrl( playUrl )
      }
    }
  }, [decryptedPlayUrlLiveResponse] )

  useEffect( ()=>{
    playerStateRef.current.isPremiumContent = isPremium;
  }, [isPremium] )

  // useEffect to handle trailor playback when moved b/n pages without route change
  useEffect( ()=>{
    if( autoPlayTrailor && isPlaying && !inView ){
      setPlayTrailor( false );
      autoPlaytrailerScreenSaver.current = false
    }
  }, [autoPlayTrailor, inView, isPlaying] )

  return (
    <div className='page_player'>
      { loading && (
        <Loader
          isPlayer={ true }
          playerBgColor={
            playerCount.current === 0 && lastWatchedSeconds > 0
          }
        />
      ) }
      { ( isError ) &&
              errorPopup()
      }
      { !isError &&
      <div
        className='player'
        ref={ ref }
      >
        <video // eslint-disable-line
          id='player'
          ref={ videoRef }
          className='video-js'
          poster={ srcPoster }
        />
        { !autoPlayTrailor && !isDeviceRemoved &&
        <PlayerOverlay
          player={ playerRef.current }
          progress={ progress || 0 }
          seekTo={ handleManualProgress }
          videoCurrentTime={ currentTime }
          videoDuration={ totalTimeRef.current }
          controlsVisibility={ isActive }
          setIsPopupOpen={ setIsPopupOpen }
          hasSubtitle={ hasSubtitle.current }
          liveContent={ liveContent }
          isVideoPlaying={ isPlaying }
          isGoLive={ isGoLive }
          handleGoLive={ handleGoLive }
          toggleVideoPlay={ toggleVideoPlay }
          playBackTitle={ playBackTitle }
          showSubtitleList={ showSubtitleList }
          listSubtitle={ listSubtitle.current }
          setShowSubtitleList={ setShowSubtitleList }
          hideSubtitles={ hideSubtitles }
          progressBarPosition={ hasSubtitle.current || playerStateRef.current.hasAudioTracks || playerStateRef.current.hasVideoTracks }
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
          nextEpisodeResponseObj={ nextEpisodeResponseObj.current }
          handleEndedEvent={ handleEndedEvent }
          { ...( metaData?.provider?.toLowerCase() === PROVIDER_LIST.FUSE && { isFuse: true } ) }
          { ...( metaData?.provider?.toLowerCase() === PROVIDER_LIST.PLAYFLIX && { isPlayflix: true } ) }
          { ...( metaData?.provider?.toLowerCase() === PROVIDER_LIST.HUNGAMA && { isHungama: true } ) }
          currentSubtutle={ currentSubtutle }
          currentAudioTrack={ currentAudioTrack }
          currentVideoTrack={ currentVideoTrack }
        /> }
      </div>
      }
    </div>
  );
};

export default Player;
