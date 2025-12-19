/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * This component will add Playback functionality for all media across the appusing Video.js
 *
 * @module views/components/PlayerSonLiv
 * @memberof -Common
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { CONTENT_TYPE, LAYOUT_TYPE, PLAYER, NOTIFICATION_RESPONSE, forwardRwKeys, isTizen, FFRWALLOWEDKEYS, PROVIDER_LIST, PAGE_TYPE } from '../../../utils/constants';
import { secondsToHmsPlayer, FetchNextEpisodes, PlayingEventApiCalling, GetSonyLivToken } from '../../../utils/slayer/PlayerService';
import Icon from '../Icon/Icon';
import './PlayerSonLiv.scss';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import PlayerNextTile from '../PlayerNextTile/PlayerNextTile';
import Loader from '../Loader/Loader';
import { cloudinaryCarousalUrl, modalDom, removeSonySDK, getMixpanelData, getTAUseCaseId, UseInterval } from '../../../utils/util';
import { getData, getDeviceToken, getPiLevel, setData, setPiLevel } from '../../../utils/localStorageHelper';
import PopupItem from './popupItem';
import Image from '../Image/Image';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { FocusContext, useFocusable, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { player_play_event } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import UseSonyLivSDK from './UseSonyLivSDK';
// const preloadPlaybackInfo = () => import( '../PlaybackInfo/PlaybackInfo' );
import Text from '../Text/Text';
import { PlayerADUi } from '../PlayerOverlay/PlayerADUi';
import { PlayPause } from '../PlayerOverlay/PlayPause';
import useUserActivity from '../../../utils/playerCommons/useUserActivity';
import { ADSTYPE } from '../../../utils/playerCommons/playersHelper';

const SonyLivProgressBar = ( { videoCurrTime, totalDuration, videoTotalTime, progress, isLiveContent, isVideoPlaying, seekTo } ) =>{

  const { broadcastMode } = useMaintainPageState();
  const { ref, focusKey } = useFocusable( {
    focusKey: 'PROGRESSBAR_INAPP',
    autoRestoreFocus: true
  } );

  const handleProgress = ( e ) =>{
    let inputProgress = Number( e.target.value ) * totalDuration / 100;
    inputProgress = ( totalDuration - inputProgress < 5 ) ? totalDuration - 5 : inputProgress;
    seekTo( Number( e.target.value ), inputProgress )
  }

  return (
    <FocusContext.Provider value={ focusKey } >
      <div
        className={ classNames( 'playerControls', { 'playerControls--live': isLiveContent } ) }
      >
        { !isLiveContent &&
        <div
          className='playerControls__currenttime'
          id='currTime'
        > { videoCurrTime }</div> }
        <input
          type='range'
          min='0'
          max='100'
          className='playerControls__progressbar'
          step='0.01'
          value={ progress }
          onChange={ !isLiveContent ? handleProgress : () => {} }
          id='range'
          ref={ ref }
          style={ { backgroundSize: `${progress <= 50 ? progress + 0.2 : progress - 0.2}% 100%` } }
        />

        { !isLiveContent &&
        <div
          className='playerControls__totalduration'
        > { videoTotalTime } </div> }
        { isLiveContent && isVideoPlaying &&
        <div className='playerControls__liveicon'>
          <div className='playerControls__livecircle'></div>
          <div className='playerControls__livetext'>{ broadcastMode }</div>
        </div> }
      </div>
    </FocusContext.Provider>
  )
}

function PlayerSonLiv( props ){
  const [progress, setProgress] = useState( 0 );
  const [subtitleLanguages, setSubTitleLanguages] = useState( [] );
  const [audioLanguages, setAudioLanguages] = useState( [] );
  const [playbackVariantsWithResolution, setPlaybackVariantsWithResolution] = useState( [] );
  const [activeAudioTrack, setActiveAudioTract] = useState( '' );
  const [activeSubtitleTrack, setActiveSubtitleTract] = useState( 'OFF' );
  const [activeResolutionTrack, setActiveResolutionTract] = useState( '' );
  const [isNextEpisodeAvailable, setIsNextEpisodeAvailable] = useState( false );
  const [loading, setLoading] = useState( false );
  const { storeRailData, liveContent, isDeviceRemoved, playerAction } = useMaintainPageState();
  const [isLiveContent, setIsLiveContent] = useState( liveContent );
  const [playerPopupOpenState, setPlayerPopupOpenState] = useState( false );
  const [videoCurrentTime, setVideoCurrentTime] = useState( 0 );
  const [videoDurationTime, setVideoDurationTime] = useState( 0 );
  const [isVideoPlaying, setIsVideoPlaying] = useState( false );
  const { playBackTitle, storedLastWatchData, sonyLiveErrorPage, setSetSonyLiveErrorPage, metaData, setNextEpisodeTimer, setSonyLivPartnerToken, sonyLivPlayer, setSonyLivPlayer } = usePlayerContext()
  const providerContentId = storedLastWatchData?.providerContentId || metaData?.providerContentId
  let lastWatchedSeconds = storedLastWatchData?.secondsWatched;
  const playerVodId = storedLastWatchData?.vodId || metaData?.vodId || metaData?.id;
  const [episodeId, setEpisodeId] = useState( playerVodId );
  const [errorDetail, setErrorDetail] = useState( '' );
  const [reinitializeSDK, setReinitializeSDK] = useState( false );
  const [isAdStarted, setIsAdStarted] = useState( false );
  const [adDuration, setAdDuraion] = useState( 0 );
  const [adCurrentTime, setAdCurrentTime] = useState( 0 );
  const [currentAdCount, setCurrentAdCount] = useState( 0 );
  const [totalAdsCount, setTotalAdsCount] = useState( 0 );

  const activeSubtitleTrackRef = useRef( 'OFF' );
  const currentTimeRef = useRef();
  const playerRef = useRef();
  const modalRef = useRef();
  const buttonRef = useRef();
  const totalDuraitionRef = useRef();
  const timeoutRef = useRef();
  const seasonCntRef = useRef();
  const episodeCntRef = useRef();
  const episodeTitlRef = useRef( playBackTitle );
  const keyPressRef = useRef( false );
  const forwardRwRef = useRef( false );
  const playerVodIdRef = useRef( playerVodId );
  const totalDurationEventsRef = useRef();
  const playerOverlayRef = useRef( null );
  const pauseIconTimeout = useRef( null );
  const isLiveContentRef = useRef( null );
  const firstPlaybackRef = useRef( true );
  const playerStateRef = useRef( {
    isNextEpisodeAvailable: true,
    playerPopupOpenState: false,
    isAdStarted: false,
    adType: '',
    playCount: 0,
    pauseCount: 0,
    playStartTime: new Date(),
    pauseStartTime: new Date()
  } );
  const nextObjRef = useRef();

  const history = useHistory();
  const { setIsCWRail } = useHomeContext();
  const previousPathName = useNavigationContext()
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const { focusKey } = useFocusable( {
    isFocusBoundary: true,
    autoRestoreFocus: true
  } );

  const { nextEpisodeObj } = FetchNextEpisodes( '', true );
  const { fetchNextEpisodeData, nextEpisodeResponse } = nextEpisodeObj;

  const [playerEventObj] = PlayingEventApiCalling( { metaData, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;

  const responseSubscription = useSubscriptionContext();
  const myPlanProps = responseSubscription.responseData.currentPack;
  const iconUrl = config?.providerLogo?.SONYLIV?.logoRectangular;

  const { initSonySDKResponse } = UseSonyLivSDK( PROVIDER_LIST.SONYLIV, reinitializeSDK );

  // Use the custom hook to track user activity
  const isActive = useUserActivity( isVideoPlaying, playerPopupOpenState );

  /* This is events API call to track the playback time */
  const { startInterval: startEventAPICall, stopInterval: stopEventAPICall } = UseInterval( () => {
    playerEventFetchData( { type: metaData?.contentType, id: playerVodIdRef.current, watchDuration: Math.floor( currentTimeRef.current ), totalDuration: Math.floor( totalDuraitionRef.current ) } );
  }, 10000 );

  const updatePlayerState = ( newState ) => {
    playerStateRef.current = { ...playerStateRef.current, ...newState };
  };

  /* This method set states used in popupItem once promises settled */
  const getSettledPromises = useCallback( async( promise )=>{
      console.log( 'In getSettledPromises method', promise ) // eslint-disable-line
    await Promise.allSettled( promise ). then( ( results )=>{
        console.log( 'getSettledPromises result:', results ) // eslint-disable-line

      if( results && results.length > 0 ){
        setSubTitleLanguages( results[0]?.value || [] );
        setAudioLanguages( results[1]?.value || [] );
        setPlaybackVariantsWithResolution( results[2]?.value || [] );
        setActiveAudioTract( results[3]?.value );
        setActiveResolutionTract( results[4]?.value?.toString() );
        handleSubtitleLanguage( activeSubtitleTrackRef.current );
      }
    } );
  } )

  /* This method handles onKeyPress event for player */
  const onKeyPress = useCallback( ( { keyCode } ) => {
    switch ( keyCode ){
      case PLAYER.PAUSE:
        playerRef.current?.pause();
        break;
      case PLAYER.PLAY:
        playerRef.current?.play();
        break;
      case PLAYER.ENTER:
        toggleVideoPlay();
        break;
      case PLAYER.RW:
        handleRewind();
        break;
      case 37 || PLAYER.LEFT:
        if( FFRWALLOWEDKEYS.includes( getCurrentFocusKey() ) ){
          handleRewind();
        }
        break;
      case PLAYER.FF:
        handleForward();
        break;
      case 39 || PLAYER.RIGHT:
        if( FFRWALLOWEDKEYS.includes( getCurrentFocusKey() ) ){
          handleForward();
        }
        break;
      case PLAYER.STOP:
        goBackToPrevPage();
        break;
      case 8:
      case PLAYER.SAMSUNG_RETURN:
      case PLAYER.LG_RETURN:
        if( playerStateRef.current.playerPopupOpenState || modalDom() ){ // to block navigation when Audio/video & error popup is open on screen
          playerStateRef.current.playerPopupOpenState && playerRef.current?.play();
          return;
        }
        goBackToPrevPage();
        break;
      default:
        break;
    }
  } )

  /* This function lifts openpopup state */
  const isPopupOpen = useCallback( ( openState )=>{
    updatePlayerState( { playerPopupOpenState: openState } )
    setPlayerPopupOpenState( openState );
  }, [] )

  /* This function setActiveResolutionTract */
  const handlePlayBackVarient = useCallback( ( resolution )=>{
    setActiveResolutionTract( resolution );
    playerRef.current?.setPlaybackVariant( {
      quality: parseInt( resolution, 10 )
    } );
  }, [] )

  /* This function setPlaybackVariant */
  const handleAudioLanguage = useCallback( ( audio )=>{
    setActiveAudioTract( audio );
    playerRef.current?.setMultiAudio( audio );
  }, [] )

  /* This function setActiveSubtitleTract */
  const handleSubtitleLanguage = useCallback( ( subtitle )=>{
    setActiveSubtitleTract( subtitle );
    activeSubtitleTrackRef.current = subtitle;
    let sub = subtitle;
    if( sub && sub.toLowerCase() === 'off' ){
      sub = 'none';
    }
    playerRef.current?.setSubtitleLanguage( sub );
  }, [] )

  /* This function handles play pause toggle */
  const toggleVideoPlay = useCallback( () =>{
    playerRef.current?.togglePlayPause();
  }, [] )

  const onError = ( errorMsg ) => {
    setSetSonyLiveErrorPage( true );
    setLoading( false );
    setTimeout( () => {
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
      setFocus( 'DONE_BUTTON' );
    }, 500 );
    player_play_event(
      MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL,
      {},
      metaData,
      props,
      getMixpanelData( 'playerSource' ),
      myPlanProps,
      errorMsg,
      playerStateRef.current.playCount,
      playerStateRef.current.pauseCount,
      playerStateRef.current.playStartTime,
      playerStateRef.current.pauseStartTime,
      getTAUseCaseId( storeRailData.current ),
      false,
      responseSubscription,
      null
    );
  }

  /* Method to handle sdk initialization */
  const playerInitializeCallback = ( res, sonyLivPlayer ) => {
    console.log( 'Initialize SDK = ', res, sonyLivPlayer );
    if( res.success && sonyLivPlayer ){
      setSetSonyLiveErrorPage( false );
      setReinitializeSDK( false );
      if( !playerRef.current ){
        if( document.getElementById( 'playerWrapper' ) ){
          document.getElementById( 'playerWrapper' ).style.display = 'block';
        }
        playerRef.current = sonyLivPlayer;
      }
      setContentIdAndCreatePlayer( providerContentId );
      setSeasonEpisodeInfo( storedLastWatchData ? storedLastWatchData.season : metaData.season, storedLastWatchData ? storedLastWatchData.episodeId : metaData.episodeNo, playBackTitle );
    }
    /* back to pi page if Initialization failed */
    if( !res.success ){
      onError( 'Sony Initialization SDK Failed' )
    }
  }

  /* Player callback to handle callback native events */
  const playerCallback = ( res, data ) => {
    console.log( `EVENT_playerCallback${res}`, data ); // eslint-disable-line
    switch ( res.toLowerCase() ){
      case 'error':
        stopEventAPICall();
        setErrorDetail( data?.errorMessage );
        onError( data?.errorMessage || 'Sony Initialization SDK Failed' )
        break;
      case 'seekbarupdate':
        break;
      case 'init':
        setLoading( false );
        break;
      case 'loadedmetadata':
        // setting video isLiveContent state
        playerRef.current?.isLiveContent?.()?.then( res => setIsLiveContent( res ) );
        break;
      case 'loadeddata':
        const duration = data?.duration || 0;
        setVideoDurationTime( duration );
        if( firstPlaybackRef.current ){ // Next Episode should start from zero, Without this ref it was starting from the last resumed point
          firstPlaybackRef.current = false;
          playerRef.current?.seekTo( {
            position: lastWatchedSeconds
          } );
        }
        forwardRwRef.current = true; // allowing forwardRw on playback start
        player_play_event(
          MIXPANELCONFIG.EVENT.PLAY_CONTENT,
          {},
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playerStateRef.current.playCount,
          playerStateRef.current.pauseCount,
          playerStateRef.current.playStartTime,
          playerStateRef.current.pauseStartTime,
          getTAUseCaseId( storeRailData.current ),
          false,
          responseSubscription,
          null
        );
        break;
      case 'seeked':
        setLoading( false );
        keyPressRef.current = false;
        break;
      case 'pause':
        setIsVideoPlaying( false );
        stopEventAPICall();
        updatePlayerState( { pauseCount: playerStateRef.current.pauseCount + 1, pauseStartTime: new Date() } );
        player_play_event(
          MIXPANELCONFIG.EVENT.PAUSE_CONTENT,
          {},
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playerStateRef.current.playCount,
          playerStateRef.current.pauseCount,
          playerStateRef.current.playStartTime,
          playerStateRef.current.pauseStartTime,
          getTAUseCaseId( storeRailData.current ),
          false,
          responseSubscription,
          null
        );
        break;
      case 'play':
        updatePlayerState( { playCount: playerStateRef.current.playCount + 1, playStartTime: new Date() } );
        player_play_event(
          MIXPANELCONFIG.EVENT.RESUME_CONTENT,
          {},
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playerStateRef.current.playCount,
          playerStateRef.current.pauseCount,
          playerStateRef.current.playStartTime,
          playerStateRef.current.pauseStartTime,
          getTAUseCaseId( storeRailData.current ),
          false,
          responseSubscription,
          null
        );
        break;
      case 'playing':
        setLoading( false );
        setIsVideoPlaying( true );
        startEventAPICall();
        keyPressRef.current = false;
        break;
      case 'timeupdate':
        if( !keyPressRef.current && data?.duration && !firstPlaybackRef.current ){ // To block updating seekbar before getting playback data from the sony event
          const currPos = data?.currentTime;
          currentTimeRef.current = currPos;
          totalDuraitionRef.current = data?.duration;
          setVideoCurrentTime( currPos );
          const progress = ( currPos / totalDuraitionRef.current ) * 100;
          isLiveContentRef.current ? setProgress( 100 ) : setProgress( progress );
          if( isSeries() && nextObjRef.current?.data?.nextEpisodeExists && ( currPos > totalDuraitionRef.current - 6 ) && ( totalDuraitionRef.current - 6 ) > 0 && ( totalDuraitionRef.current !== currPos ) && playerStateRef.current.isNextEpisodeAvailable ){
            updatePlayerState( { isNextEpisodeAvailable: false } );
            setNextEpisodeTimer( Math.round( totalDuraitionRef.current ) - Math.round( currentTimeRef.current ) - 1 );
            setIsNextEpisodeAvailable( true );
          }
          else if( isSeries() && nextObjRef.current?.data?.nextEpisodeExists && !playerStateRef.current.isNextEpisodeAvailable && totalDuraitionRef.current !== 0 && ( currPos < totalDuraitionRef.current - 6 ) ){
            setIsNextEpisodeAvailable( false );
            updatePlayerState( { isNextEpisodeAvailable: true } );
          }
        }
        break;
      default:
        break;
    }
  }

  const adCallback = ( res, data ) => {
    console.log( `ADEVENT_${res}`, data )
    switch ( res ){
      case 'ADREQUEST':
        break;
      case 'AD_METADATA_LOADED':
        playerStateRef.current.adType = data.adType
        break;
      case 'ads-ad-started':
        console.log( 'ADEVENT__pausing content playback' )
        setIsVideoPlaying( true );
        break;
      case 'ads-pause':
        setIsVideoPlaying( false );
        break;
      case 'AD_SEEKBAR_UPDATE':
        console.log( 'adProgress', data?.duration, data?.currentTime, data )
        playerStateRef.current.isAdStarted = true;
        setIsAdStarted( true );
        setAdDuraion( parseInt( data?.duration, 10 ) );
        setAdCurrentTime( parseInt( data?.currentTime, 10 ) );
        break;
      case 'ADBREAKENDED':
        console.log( 'ADEVENT__resuming content playback' )
        playerStateRef.current.isAdStarted = false;
        setIsAdStarted( false );
      case 'TOTAL_ADS_COUNT':
        setTotalAdsCount( data.totalAdsCount );
        setCurrentAdCount( data.currentAd );
        break;
      default:
        break;
    }
  }

  const handleEnded = ()=>{
    forwardRwRef.current = false; // blocking forward and rewind keypress after playback end
    setIsNextEpisodeAvailable( false );
    stopEventAPICall();
    checkNextEpisodeAvailable();
  }

  /* Player callback to handle callback native events */
  const playerCustomCallback = ( res ) => {
    const popupPromises = [];
    console.log( `EVENT_CUSTOM_${res}` ); // eslint-disable-line
    if( res === 'BITRATE_CHANGED' || res === 'SUBTITLE_CHANGE' ){
      setLoading( false );
    }
    if( res === 'VIDEO_LANGUAGE_CHANGE' ){
      console.log( `EVENT_${res}` ); // eslint-disable-line
      setLoading( false );
    }
    if( res === 'FIRST_PLAY' ){
      if( playerRef.current ){
        popupPromises.push(
          playerRef.current.getSubtitleLanguages(),
          playerRef.current.getMultiAudio(),
          playerRef.current.getPlaybackVariantsWithResolution(),
          playerRef.current.getCurrentActiveAudioTrack?.(),
          playerRef.current.getCurrentPlaybackVariant?.()
        );
      }

      getSettledPromises( popupPromises );
    }
    if( res === 'SESSION_ENDED' ){
      handleEnded();
      player_play_event(
        MIXPANELCONFIG.EVENT.CONTENT_PLAY_END,
        {},
        metaData,
        props,
        getMixpanelData( 'playerSource' ),
        myPlanProps,
        null,
        playerStateRef.current.playCount,
        playerStateRef.current.pauseCount,
        playerStateRef.current.playStartTime,
        playerStateRef.current.pauseStartTime,
        getTAUseCaseId( storeRailData.current ),
        false,
        responseSubscription,
        null
      );
    }
  }

  /* destroy Sony Player */
  const destroySonyPlayer = () => {
    if( playerRef.current ){
      playerRef.current.destroyPlayer();
      playerRef.current = null;
    }
  }

  /* This method sets contentType is seties or not */
  const isSeries = () => {
    let isSeries = false;
    if( metaData ){
      if( metaData.contentType === CONTENT_TYPE.SERIES || metaData.contentType === CONTENT_TYPE.TV_SHOWS || metaData.contentType === CONTENT_TYPE.BRAND ){
        isSeries = true;
      }
    }
    return isSeries;
  }

  /* This method setEpisodeId for isSeries content */
  const nextEpisodeFetch = () => {
    if( isSeries() ){
      if( nextObjRef && nextObjRef.current && nextObjRef.current.data.nextEpisodeExists ){
        setEpisodeId( nextObjRef.current.data.nextEpisode?.id );
      }
      else if( nextObjRef && nextObjRef.current && nextObjRef.current.data.nextEpisodeExists && !nextObjRef.current.data.previousEpisodeExists ){
        setEpisodeId( playerVodId ? playerVodId : metaData?.vodId );
      }
    }
  }

  /* This method handles setting contentId in initialization callback */
  const setContentIdAndCreatePlayer = ( contentId ) => {
    const playerDiv = document.getElementById( 'playerWrapper' )
    const sdkConfig = {
      playerDiv,
      video: {
        videoId: contentId
      },
      playerCallback,
      playerCustomCallback,
      adCallback
    };
    playerRef.current?.playContent( sdkConfig );
  }

  /* This method does video title update */
  const checkNextEpisodeAvailable = () => {
    const nextEpisode = nextObjRef.current?.data?.nextEpisode;
    if( nextObjRef.current?.data?.nextEpisodeExists ){ // check to change to BRAND
      playerVodIdRef.current = nextEpisode.id;
      playerEventFetchData( { type: metaData?.contentType, id: playerVodIdRef.current, watchDuration: totalDurationEventsRef.current ? parseInt( totalDurationEventsRef.current, 10 ) : storedLastWatchData?.durationInSeconds } );
      totalDurationEventsRef.current = nextEpisode?.totalDuration;
      setTimeout( () => {
        updatePlayerState( { isNextEpisodeAvailable: true } );
        console.log( 'checkNextEpisodeAvailable -- ProviderCOntentID', providerContentId, storedLastWatchData?.providerContentId, metaData?.providerContentId, nextEpisode.providerContentId )
        setContentIdAndCreatePlayer( nextEpisode.providerContentId );
        setSeasonEpisodeInfo( nextEpisode?.season, nextEpisode?.episodeId, nextEpisode?.title );
      }, 1000 );
      setTimeout( () => {
        nextEpisodeFetch();
        currentTimeRef.current = 0;
        setProgress( 0 );
      }, 2000 );
    }
    else {
      setLoading( true );
      playerEventFetchData( { type: metaData?.contentType, id: playerVodId, watchDuration: metaData?.duration * 60 } );
      setPlaybackEnded();
      goBackToPrevPage();
    }
  }

  /* This method sets the playback ended flag */
  const setPlaybackEnded = () => {
  }

  /* This method set ref for season, episode, title */
  const setSeasonEpisodeInfo = ( season, episode, title ) => {
    seasonCntRef.current = season;
    episodeCntRef.current = episode;
    episodeTitlRef.current = title;
  }

  /* This method handles navigation to previous page */
  const goBackToPrevPage = () => {
    setIsCWRail( true )
    previousPathName.current = null;
    history.goBack()
    const piLevelClear = getPiLevel()
    setPiLevel( piLevelClear - 1 )
  }

  /* This method handles rewind and left key press */
  const handleRewind = ()=>{
    if( !isLiveContentRef.current && forwardRwRef.current && !playerStateRef.current.isAdStarted ){
      if( currentTimeRef.current > 0 ){
        keyPressRef.current = true;
        setLoading( true );
        if( currentTimeRef.current > PLAYER.SEEK_INTERVAL ){
          currentTimeRef.current = currentTimeRef.current - PLAYER.SEEK_INTERVAL;
        }
        else {
          currentTimeRef.current = 0;
        }
        const progressLeft = ( currentTimeRef.current / totalDuraitionRef.current ) * 100;
        setProgress( progressLeft );
      }
    }
  }

  /* This method handles forward and right key press */
  const handleForward = ()=>{
    if( !isLiveContentRef.current && forwardRwRef.current && !playerStateRef.current.isAdStarted ){
      if( currentTimeRef.current > 0 ){
        keyPressRef.current = true;
        setLoading( true );
        if( currentTimeRef.current >= totalDuraitionRef.current - PLAYER.SEEK_INTERVAL ){
          currentTimeRef.current = totalDuraitionRef.current
        }
        else {
          currentTimeRef.current = currentTimeRef.current + PLAYER.SEEK_INTERVAL;
        }
        const progressRight = ( currentTimeRef.current / totalDuraitionRef.current ) * 100;
        setProgress( progressRight );
      }
    }
  }

  const getRenderCurrentProgress = ( progressValue, currentValue )=> {
    setProgress( progressValue )
    playerRef.current?.seekTo( { position : currentValue } )
  }

  const renderContentInfo = ()=>{
    const seasonText = seasonCntRef.current ? `Season ${ seasonCntRef.current }` : '';
    const episodeText = episodeCntRef.current ? `Episode ${ episodeCntRef.current }` : '';
    return (
      <div className='playerTitle-subTitle'>
        <div className='playerTitle'>
          { metaData?.brandTitle ? metaData?.brandTitle : metaData?.vodTitle }
        </div>
        <div className='season-episode-details'>
          { isSeries() ? `${ episodeTitlRef.current }` : `${ metaData?.vodTitle }` }
        </div>
      </div>
    )
  }

  const renderPopupButtons = () =>{
    const goToLive = {
      id: 0,
      popupTitle: playerAction
    };
    const popupData = {
      audio: {
        id: isLiveContent ? 1 : 0,
        popupTitle:'Audio Language',
        data: audioLanguages,
        selectData: handleAudioLanguage,
        videoQuality: false,
        activeTrack: activeAudioTrack,
        popupSubTitle: 'Press ‘OK’ to select your preferred language.'
      },
      videoQuality: {
        id: isLiveContent ? 2 : 1,
        popupTitle: 'Video Quality',
        data: playbackVariantsWithResolution,
        selectData: handlePlayBackVarient,
        videoQuality: true,
        activeTrack: activeResolutionTrack,
        popupSubTitle: 'Press ‘OK’ to select your preferred quality.'
      },
      subtitle: {
        id: isLiveContent ? 3 : 2,
        popupTitle: 'Subtitles',
        data: ['OFF', ...subtitleLanguages],
        selectData: handleSubtitleLanguage,
        videoQuality: false,
        activeTrack: activeSubtitleTrack,
        popupSubTitle: 'Press ‘OK’ to select your preferred subtitle language.'
      }
    }
    return (
      <div className='popup-buttons-container' >
        { ( audioLanguages.length > 0 || playbackVariantsWithResolution.length > 0 || subtitleLanguages.length > 0 ) && !isAdStarted &&
          <PopupItem
            data={ isLiveContent ? { goToLive, ...popupData } : popupData }
            setLoading={ setLoading }
            isPopupOpen={ isPopupOpen }
            playVideo={ ()=>{} }
            pauseVideo={ playerRef.current?.pause }
            isLiveContent={ isLiveContent }
            isVideoPlaying={ isVideoPlaying }
          /> }
      </div>
    )
  }

  const renderLogo = ()=>{
    return (
      <div className='sonyLiv-logo'>
        <Image
          src={ `${cloudinaryCarousalUrl( LAYOUT_TYPE.TOP_PORTRAIT, url, '' )}/${iconUrl}` }
        />
      </div>
    )
  }

  const renderDefaultPlayerPage = () =>{
    const videoCurrTime = videoCurrentTime < 1 ? '00:00' : secondsToHmsPlayer( parseInt( videoCurrentTime, 10 ) );
    const videoTotalTime = videoDurationTime < 1 ? '00:00' : secondsToHmsPlayer( parseInt( videoDurationTime, 10 ) );

    return (
      <div className={ classNames( 'controlsContainer' ) } >
        <div
          className={ classNames( 'playerOverlay', { 'playerOverlay--hidden': playerPopupOpenState || !isActive } ) }
          ref={ playerOverlayRef }
        >
          { renderLogo() }
          <PlayPause
            isVideoPlaying={ isVideoPlaying }
            toggleVideoPlay={ toggleVideoPlay }
            loading={ loading }
          />
          { renderContentInfo() }
          <SonyLivProgressBar
            videoCurrTime={ videoCurrTime }
            videoTotalTime={ videoTotalTime }
            progress={ progress }
            isLiveContent={ isLiveContent }
            isVideoPlaying={ isVideoPlaying }
            totalDuration={ totalDuraitionRef.current }
            seekTo={ getRenderCurrentProgress }
          />
          { renderPopupButtons() }
        </div>
      </div>
    )
  }

  const closeRetryPopup = ()=>{
    modalRef.current?.close();
    stopEventAPICall();
    destroySonyPlayer();
    removeSonySDK();
  }

  const handleCancelPopup = () => {
    closeRetryPopup();
    setSonyLivPartnerToken( null );
    setSetSonyLiveErrorPage( false );
    setSonyLivPlayer( null );
    setReinitializeSDK( true );
  }

  const handleExitPopup = () => {
    closeRetryPopup();
    goBackToPrevPage();
  }

  useEffect( ()=>{
    previousPathName.playerScreen = PAGE_TYPE.PLAYER_SCREEN;
  }, [] )

  useEffect( () => {
    nextEpisodeFetch();
    window.addEventListener( 'keydown', onKeyPress );
    window.addEventListener( 'keyup', onKeyRelease );
    setFocus( 'PROGRESSBAR_INAPP' );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
      window.removeEventListener( 'keyup', onKeyRelease );
      stopEventAPICall();
      destroySonyPlayer();
      if( document.getElementById( 'playerWrapper' ) ){
        document.getElementById( 'playerWrapper' ).style.display = 'none';
      }
    }
  }, [] );

  useEffect( ()=>{
    isLiveContent && setProgress( 100 );
    isLiveContentRef.current = isLiveContent;
  }, [isLiveContent] )

  useEffect( () => {
    if( initSonySDKResponse && sonyLivPlayer ){
      playerInitializeCallback( initSonySDKResponse, sonyLivPlayer )
    }
  }, [initSonySDKResponse, sonyLivPlayer] );

  useEffect( () => {
    if( nextEpisodeResponse && nextEpisodeResponse.code === 0 ){
      nextObjRef.current = nextEpisodeResponse;
    }
  }, [nextEpisodeResponse] );

  useEffect( () => {
    if( episodeId ){
      fetchNextEpisodeData( { params : { id: episodeId } } );
      setVideoCurrentTime( 0 );
    }
  }, [episodeId] );

  useEffect( ()=>{
    if( !isActive ){
      setFocus( getCurrentFocusKey() );
    }
  }, [isActive] )

  useEffect( ()=>{
    if( isDeviceRemoved ){ // TODO - Need to do cleanup for Player & shakaplayer when device is automatically removed & playback is inprogress
      stopEventAPICall();
      destroySonyPlayer();
      setSonyLivPlayer( null );
      removeSonySDK();
      if( document.getElementById( 'playerWrapper' ) ){
        document.getElementById( 'playerWrapper' ).style.display = 'none';
      }
    }
  }, [isDeviceRemoved] )

  useEffect( ()=>{
    if( playerPopupOpenState && isAdStarted ){
      isPopupOpen( false );
    }
  }, [playerPopupOpenState, isAdStarted] )

  /* This method handles onKeyRelease event for player */
  const onKeyRelease = useCallback( ( { keyCode } ) => {
    setLoading( false );
    if( !isLiveContentRef.current && forwardRwKeys.includes( keyCode ) ){
      if( keyPressRef.current ){
        // playerRef.current?.setVolume( '1' ); // Commenting this to fix TPSLS-164
        if( ( parseInt( currentTimeRef.current, 10 ) !== 0 ) && ( parseInt( currentTimeRef.current, 10 ) === parseInt( totalDuraitionRef.current, 10 ) ) ){
          handleEnded();
          setProgress( 100 );
        }
        else if( keyCode === PLAYER.LEFT || keyCode === PLAYER.RIGHT ){
          FFRWALLOWEDKEYS.includes( getCurrentFocusKey() ) && playerRef.current?.seekTo( {
            position: currentTimeRef.current
          } );
        }
        else if( keyCode === PLAYER.RW || keyCode === PLAYER.FF ){
          playerRef.current?.seekTo( {
            position: currentTimeRef.current
          } );
        }
      }
    }
  } );

  return (
    <FocusContext.Provider value={ focusKey } >
      <div className='partnerPlayerPage'>
        { loading &&
        <Loader isPlayer={ true } /> }
        { sonyLiveErrorPage &&
        <div className='error-page'>
          <NotificationsPopUp
            modalRef={ modalRef }
            handleCancel={ () => handleExitPopup() }
            opener={ buttonRef }
            buttonClicked={ () => {
              handleCancelPopup()
            } }
            { ...NOTIFICATION_RESPONSE }
            info={ errorDetail || NOTIFICATION_RESPONSE.info }
            focusKeyRefrence={ 'DONE_BUTTON' }
            showModalPopup={ sonyLiveErrorPage }
          />
        </div> }
        { !sonyLiveErrorPage && !isAdStarted && renderDefaultPlayerPage() }
        { !sonyLiveErrorPage && isActive && isAdStarted && (
          <PlayerADUi
            isVideoPlaying={ isVideoPlaying }
            toggleVideoPlay={ toggleVideoPlay }
            loading={ loading }
            multipleAds={ totalAdsCount > 1 }
            currentAdNumber={ currentAdCount }
            totalNumnerOfAds={ totalAdsCount }
            adDuration={ adDuration }
            adCurrentTime={ adCurrentTime }
            isAdStarted
            goBackToPrevPage={ goBackToPrevPage }
          />
        ) }
        <div className='nextEpisodeSonyCls'>
          {
            isNextEpisodeAvailable &&
            <PlayerNextTile
              nextEpisodeResponse={ nextObjRef.current }
              setIsNextEpisodeAvailable={ setIsNextEpisodeAvailable }
              handleEndedEvent={ handleEnded }
            />
          }
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default PlayerSonLiv