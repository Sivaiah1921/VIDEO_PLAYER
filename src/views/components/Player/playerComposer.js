/* eslint-disable radix */
/* eslint-disable no-console */
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom';
import Player from './Player';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import constants, { PAGE_NAME, PAGE_TYPE, deepLinkPartners, TRACK_MODE, TRACK_FORMAT, TRACK_KIND, TRACK_LANGUAGE, TRACK_TYPE, DISTRO_CHANNEL, PROVIDER_LIST } from '../../../utils/constants';
import ShakaPlayer from '../ShakaPlayer/ShakaPlayer';
import { PlayerStateProvider } from './PlayerStateContext';
import { helpClosed, player_app_click, player_app_launch, player_buffer_start, player_buffer_stop, player_pause, player_play_event, player_resume } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { getMixpanelData, getSource, getTAUseCaseId, isSeries, setContentPlayedCount, getLArefuseCase, convertSrtTextToVttText, isCrownNew, splitByDash } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { FetchNextEpisodes, GetSrtToken, isLiveContentType, isDistroContent, fetchData, getLanguageLabel } from '../../../utils/slayer/PlayerService';
import { getAllLoginPath, getAuthToken, getDistroMeta, getDthStatus, getPiLevel, getSubscriberId, getUserInfo, setAllLoginPath, setDistroMeta, setPiLevel } from '../../../utils/localStorageHelper';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { PROVIDERONSHAKA } from '../../../utils/playerCommons/playersHelper';
import { DecryptedPlayUrlLive, LivePlayLA, ContentInfo, CSDInfoAPI, LiveWatchLA } from '../../../utils/slayer/PlaybackInfoService';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import serviceConst from '../../../utils/slayer/serviceConst';
import get from 'lodash/get';
import { useDecrypetedPlayURL } from '../../../utils/slayer/useDecrypedPlayURL';
import { getDistroPlaybackUrls, getLiveChannelPlaybackUrls, getTimesPlayLiveChannelPlaybackUrls } from './PlayerNew/LivePlaybackUrl';
import { trackErrorEvents } from '../../../utils/logTracking';
import { iso6392 } from 'iso-639-2';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { LiveSearchLA } from '../../../utils/slayer/SearchService';
import { LiveClickLA } from '../../../utils/slayer/HomeService';

function PlayerComposer( props ){
  const { srcBanner, autoPlayTrailor, watchTrailor, setPlayTrailor } = props;

  const [currentTime, setCurrentTime] = useState( 0 );
  const [isError, setIsError] = useState( false );
  const [bufferStart, setBufferStart] = useState( 0 );
  const [bufferStop, setBufferStop] = useState( 0 );
  const [videoPlayer, setVideoPlayer] = useState( null );
  const [videoElement, setVideoElement] = useState( null );
  const [isNextEpisodeAvailable, setIsNextEpisodeAvailable] = useState( false );
  const [errorMsg, setErrorMsg] = useState( null );
  const [currentSubtutle, setCurrentSubtitle] = useState( null );
  const [cdnEnabled, setCdnEnabled] = useState( false );

  const nextEpisodeResponseObj = useRef();
  const subtitleRef = useRef( null );
  const isSubtitleThroughURL = useRef( false );
  const currentTimeRef = useRef( currentTime );

  const {
    setMetaData,
    setPlayBackTitle,
    setSubtitlePlayUrl,
    setContentPlaybackData,
    contentPlaybackData,
    setTrailor_url,
    metaData,
    setStoredContentInfo,
    storedLastWatchData,
    contentPlayed,
    setContentPlayed,
    playbackRestoreTime,
    setPlaybackRestoreTime,
    isTrailerClicked
  } = usePlayerContext();
  const { setIsTvod, setCatalogFlag, setSearchFlag, setBingeListFlag, setLiveSearchFlag, liveSearchFlag, setIsCWRail, searchFlag, catalogFlag, bingeListFlag } = useHomeContext();
  const history = useHistory();
  const { storeRailData, subtitleListIndex, liveContent, searchPageData } = useMaintainPageState();
  const responseSubscription = useSubscriptionContext();
  const { configResponse } = useAppContext();
  const location = useLocation()
  const { getDecryptedPlayURL } = useDecrypetedPlayURL()
  const previousPathName = useNavigationContext();

  const { config } = configResponse;
  const myPlanProps = responseSubscription?.responseData.currentPack;
  const { id, type, provider: liveProvider } = location?.args || ''

  const { nextEpisodeObj } = FetchNextEpisodes( '', true );
  const { fetchNextEpisodeData, nextEpisodeResponse } = nextEpisodeObj;

  const refUsecase = getLArefuseCase( config, metaData?.contentType )
  const [playLiveLAData] = LivePlayLA( { type: metaData?.contentType, id:metaData?.id, provider: metaData?.provider, taShowType: metaData?.taShowType, vodId: metaData?.vodId, refUsecase: refUsecase } );
  const { addLiveLA } = playLiveLAData

  const [liveWatchLAData] = LiveWatchLA( { id:metaData?.id, provider: metaData?.provider, refUsecase: constants.LIVE_WATCH_USE_CASE } )
  const { liveWatchLA } = liveWatchLAData
  const [liveSearchLAData] = LiveSearchLA( { id:metaData?.id, provider: metaData?.provider, refUsecase: constants.SEARCH_CLICK_USE_CASE } )
  const { liveSearchLA } = liveSearchLAData
  const [liveClickLAData] = LiveClickLA( { id:metaData?.id, provider:metaData?.provider, refUsecase: constants.LIVE_CLICK_USE_CASE } )
  const { liveClickLA } = liveClickLAData
  let liveLATimeout = null
  const getSrtObj = GetSrtToken( '', true );
  const { fetchSrtToken, srtResponse, srtError } = getSrtObj;

  const [contentInfoDetails] = ContentInfo( { }, true );
  const { contentInfoFetchData, contentInfoResponse } = contentInfoDetails;

  const [decryptedPlayUrls] = DecryptedPlayUrlLive();
  const { fetchDecryptedPlayUrlLive, decryptedPlayUrlLiveResponse } = decryptedPlayUrls

  const [CSDInfoObj] = CSDInfoAPI( { }, true );
  const { fetchCSDInfoAPI, CSDInfoAPIResponse } = CSDInfoObj;

  const nextEpisodeInfo = useMemo( () => nextEpisodeResponseObj.current?.data?.nextEpisode, [nextEpisodeResponseObj.current] )
  const isPremium = useMemo( () => isCrownNew( myPlanProps, {
    contentType: nextEpisodeInfo?.contentType,
    partnerSubscriptionType: nextEpisodeInfo?.partnerSubscriptionType,
    provider: nextEpisodeInfo?.provider,
    freeEpisodesAvailable: nextEpisodeInfo?.freeEpisodesAvailable,
    contractName: nextEpisodeInfo?.contractName
  }, true ), [myPlanProps, nextEpisodeInfo] )
  const playerVodId = storedLastWatchData?.vodId || metaData?.vodId || metaData?.id;
  const lastWatchedSeconds = useMemo( () => {
    if( playbackRestoreTime ){
      return playbackRestoreTime;
    }
    return storedLastWatchData?.secondsWatched
  }, [storedLastWatchData, playbackRestoreTime] );

  /* CDN security call for the encrpyted live contents */
  const getEncryptedPlayUrl = ( metaData, channelMeta ) => {
    if( getAuthToken() ){
      const userInfo = JSON.parse( getUserInfo() );
      fetchDecryptedPlayUrlLive( { url: serviceConst.LIVE_DECRYPTED_PLAY_URLS + metaData?.contentType + '/' + channelMeta?.id, headers: {
        authorization: getAuthToken(),
        dthstatus: getDthStatus(),
        subscriberid: getSubscriberId(),
        subscriptiontype: userInfo?.subscriptionPlanType,
        ...( isDistroContent( metaData?.provider ) && {
          appType: DISTRO_CHANNEL.appType
        } ),
        ...( metaData?.provider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY && { appType: 'TimesPlay' } )

      } } )
    }
  }

  /* Get decrypted  live channels playback url */
  const liveChannelPlayUrl = async( { provider, contentType, epidsSet, playback_url, licenceUrl, contentId } ) => {

    let livePlaybackData;
    if( provider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY ){
      livePlaybackData = await getTimesPlayLiveChannelPlaybackUrls( { playback_url, licenceUrl } )
    }
    else {
      livePlaybackData = await getLiveChannelPlaybackUrls( { provider, contentType, epidsSet: epidsSet, playback_url, licenceUrl, contentId } )
    }
    setContentPlaybackData( livePlaybackData )
  };

  /* Get decrypted  distro playback url */
  const distroPlayUrl = async( contentUrl ) => {
    const distroPlaybackData = await getDistroPlaybackUrls( { contentUrl } )
    setContentPlaybackData( distroPlaybackData )
  };

  /* To show subtitles on player view if exists */
  const getSubtitleTracks = ( tracks, captionList, isVideoJs, textTrackCallback ) => {
    console.log( 'tracks, captionList', tracks, captionList )
    const subtitleLangListRef = captionList;
    let isValidLanguage = false;
    let textTrackRef = null;
    for ( let i = 0; i < tracks?.length; i++ ){
      const track = tracks[i];
      if( isVideoJs && track.mode === TRACK_MODE.SHOWING ){
        track.mode = TRACK_MODE.HIDDEN;
      }

      if( ( track.kind === TRACK_KIND.CAPTIONS || track.kind === TRACK_KIND.SUBTITLES || track.kind === TRACK_KIND.SUBTITLE ) && track.language && !isTrailerClicked ){
        const language = ( track.language === 'CC1' || track.language === 'cc708_1' ) ? '' : getLanguageLabel( iso6392, track.language ) || track.language;
        if( language === '' ){
          isValidLanguage = false;
        }
        else {
          const info = subtitleLangListRef.current.indexOf( language ) >= 0 ?
            subtitleLangListRef.current : subtitleLangListRef.current.concat( language );
          subtitleLangListRef.current = info;
          isValidLanguage = true;
          textTrackRef = track;
        }
      }
    }
    textTrackCallback( subtitleLangListRef, isValidLanguage, textTrackRef )
  };

  /*  This is for .vtt subtitle Handling only on shaka player */
  const addSubtitleTrack = ( text, caption, videoElement ) => {
    const track = document.createElement( 'track' );
    track.kind = TRACK_KIND.SUBTITLES;
    track.label = caption.label;
    track.srclang = caption.srclang;
    track.default = false; // Set the default subtitle track

    const blob = new Blob( [text], { type: 'text/vtt' } );
    track.src = URL.createObjectURL( blob );

    videoElement.appendChild( track );
    subtitleRef.current?.( videoPlayer, isSubtitleThroughURL.current );
  };

  /* for Player.js , videoPlayer.textTracks is attached in this method & for shaka player it is handled as per .vtt & .srt */
  const addSubtitleToVideo = ( videoPlayer, subtitleOptions, videoElement, vttText, isSrtURL ) =>{
    isSubtitleThroughURL.current = true;
    if( videoPlayer ){
      console.log( videoPlayer.textTracks, 'log--SentryIssueTrack-textTracks' )
      if( videoPlayer.textTracks ){
        videoPlayer.removeRemoteTextTrack();
        const subtitleOptionsForVideojs = Array.isArray( subtitleOptions ) ? subtitleOptions : [subtitleOptions];
        subtitleOptionsForVideojs.forEach( caption => {
          videoPlayer.addRemoteTextTrack( caption );
          subtitleRef.current?.( videoPlayer );
        } );
      }
      else {
        console.log( 'addSubtitleToVideo for shakaplayer', subtitleOptions, isSrtURL );
        if( isSrtURL ){
          // Split the VTT text into lines
          const lines = vttText.split( /\r?\n/ );

          // Initialize variables to store cues
          let cues = [];
          let cue = null;
          let timeRegExp = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/;

          // Parse each line of the VTT text
          lines.forEach( line => {
            if( timeRegExp.test( line ) ){
            // Line contains timing information for a cue
              const match = line.match( timeRegExp );
              cue = {
                startTime: parseInt( match[1] ) * 3600 + parseInt( match[2] ) * 60 + parseInt( match[3] ) + parseInt( match[4] ) / 1000,
                endTime: parseInt( match[5] ) * 3600 + parseInt( match[6] ) * 60 + parseInt( match[7] ) + parseInt( match[8] ) / 1000,
                text: ''
              };
              cues.push( cue );
            }
            else if( cue ){
            // Line contains cue text
              cue.text += ( cue.text ? '\n' : '' ) + line;
            }
          } );

          // Create a new TextTrack
          const track = videoElement.addTextTrack( TRACK_KIND.SUBTITLES, subtitleOptions?.label, subtitleOptions?.srclang );

          // Add cues to the TextTrack
          cues.forEach( cue => {
            track.addCue( new VTTCue( cue.startTime, cue.endTime, cue.text.split( '\n\n' )[0] ) );
          } )
          subtitleRef.current?.( videoPlayer, isSubtitleThroughURL.current );
        }
        else {
          const subtitleOptionsForShaka = Array.isArray( subtitleOptions ) ? subtitleOptions : [subtitleOptions];
          subtitleOptionsForShaka.forEach( caption => {
            if( videoElement && caption ){
              const vttText = fetchData( caption.src, true );
              vttText
                .then( vttText => {
                  addSubtitleTrack( vttText, caption, videoElement );
                } )
                .catch( error => {
                  console.error( 'Error fetching or parsing VTT file:', error );
                  trackErrorEvents( MIXPANELCONFIG.EVENT.VTT_FAILURE, error, metaData?.provider )
                } );
            }
          } );
        }
      }
    }
  }

  /* This method is used to fetch .srt url using useAxios & adding .vtt to video track as this was giving CORS with axios handling it with javascript fetch  */
  const getSubtitleUrl = ( player, captionOption, videoElement ) => {
    const captionOptions = Array.isArray( captionOption ) ? captionOption : [captionOption]
    captionOptions?.map( item => ( { src: item.src, captionOption: item } ) ).map( ( item ) => {
      if( item.src?.includes( TRACK_FORMAT.VTT ) ){
        addSubtitleToVideo( player, captionOptions, videoElement );
      }
      else if( item.src?.includes( TRACK_FORMAT.SRT ) ){
        fetchSrtToken( { url: item.src }, item.captionOption )
      }
    } );
  };

  /*  This method prepares the list to multiple & single subtitles */
  const subtitlePlayURLCaptionOption = ( player, videoElement, subtitlePlayUrl )=>{
    const captionOptions = subtitlePlayUrl?.map( item => (
      {
        kind: TRACK_KIND.CAPTIONS,
        src: item.url,
        srclang: item.lang || TRACK_LANGUAGE.CODE,
        label: getLanguageLabel( iso6392, item.lang ) || TRACK_LANGUAGE.LABEL,
        mode: TRACK_MODE.HIDDEN,
        language: item.lang || TRACK_LANGUAGE.LABEL,
        default: false
      }
    ) )
    console.log( 'captionOptions', captionOptions )
    getSubtitleUrl( player, captionOptions, videoElement );
  }

  /*  This handles the all type of subtitle formats came from different providers & pass this to other helper methods to attach to player */
  const getSubtitleByResponse = ( player, videoElement, subtitlePlayUrl ) => {
    console.log( 'subtitlePlayUrl PlayerComposer', subtitlePlayUrl )
    if( subtitlePlayUrl?.length > 0 ){
      subtitlePlayURLCaptionOption( player, videoElement, subtitlePlayUrl );
    }
    else {
      subtitleRef.current?.( player );
    }
  };

  /* Next Episode handling API call */
  const checkNextEpisodeAvailable = () => {
    if( isSeries( metaData ) ){
      // check to change to BRAND
      let epId = 0;
      if(
        nextEpisodeResponseObj.current &&
            nextEpisodeResponseObj.current.data.nextEpisodeExists
      ){
        epId = nextEpisodeResponseObj.current.data?.nextEpisode?.id;
      }
      else {
        epId = playerVodId ? playerVodId : metaData?.vodId;
      }
      fetchNextEpisodeData( { params: { id: epId } } );
    }
  };

  /* This is navigation handling on key press & content ends */
  const goBackToPrevPage = () => {
    !liveContent && setIsCWRail( true );
    if( getAllLoginPath()?.includes( PAGE_TYPE.PLAYER ) ){
      const indexRouter = getAllLoginPath()?.length
      setCatalogFlag( false )
      setSearchFlag( false )
      setBingeListFlag( false )
      setLiveSearchFlag( false )
      history.go( -indexRouter )
      setAllLoginPath( [] )
    }
    else if( window.location.pathname.includes( '/Search' ) ){
      setSearchFlag( false )
      setLiveSearchFlag( false )
    }
    else if( window.location.pathname.includes( '/browse-by/live' ) ){
      setCatalogFlag( false )
      setLiveSearchFlag( false )
    }
    else if( liveSearchFlag ){
      history.goBack();
      setCatalogFlag( false )
      setSearchFlag( false )
      setBingeListFlag( false )
      setLiveSearchFlag( false )
    }
    else if( isLiveContentType( type ) && getAllLoginPath()?.includes( '/plan/subscription' ) ){
      // if user comes form search/catalog/binge list then redirect to respective page
      if( searchFlag || catalogFlag || bingeListFlag ){
        history.go( -2 );
      }
      else {
        history.push( '/discover' );
      }
      setAllLoginPath( [] )
      setCatalogFlag( false )
      setSearchFlag( false )
      setBingeListFlag( false )
      setLiveSearchFlag( false )
    }
    else {
      isLiveContentType( type ) && (
        // We dont want to open PI page in case of distro
        setCatalogFlag( false ),
        setSearchFlag( false ),
        setBingeListFlag( false ),
        setLiveSearchFlag( false )
      )
      history.goBack();
    }
    const piLevelClear = getPiLevel();
    piLevelClear > 0 && setPiLevel( piLevelClear - 1 );
    metaData && metaData.rentalPrice && setIsTvod( true );
    helpClosed( PAGE_NAME.CONTENT_DETAIL, parseInt( currentTime, 10 ) )
    setPlaybackRestoreTime( null );
  };

  /* mixpanel events handling if player instance is created */
  const mixPanelEventOnFirstLaunch = ( videoElement, playCount, pauseCount, bufferStart, bufferStop, pauseStartTime, playStartTime )=>{
    const taUseCaseId = getTAUseCaseId( storeRailData.current );
    if( videoElement ){
      /*
        * Mix-pannel events on player first launch
        */
      player_app_click();
      player_play_event(
        MIXPANELCONFIG.EVENT.INITIAL_BUFFER_TIME,
        videoElement,
        metaData,
        props,
        getMixpanelData( 'playerSource' ),
        myPlanProps,
        null,
        playCount,
        pauseCount,
        playStartTime,
        pauseStartTime,
        taUseCaseId,
        liveContent,
        responseSubscription,
        null
      );
      player_play_event(
        MIXPANELCONFIG.EVENT.INITIAL_CONTENT_BUFFER,
        videoElement,
        metaData,
        props,
        getMixpanelData( 'playerSource' ),
        myPlanProps,
        null,
        playCount,
        pauseCount,
        playStartTime,
        pauseStartTime,
        taUseCaseId,
        liveContent,
        responseSubscription,
        null
      );
      player_play_event(
        MIXPANELCONFIG.EVENT.CONTENT_BUFFER,
        videoElement,
        metaData,
        props,
        getMixpanelData( 'playerSource' ),
        myPlanProps,
        null,
        playCount,
        pauseCount,
        playStartTime,
        pauseStartTime,
        taUseCaseId,
        liveContent,
        responseSubscription,
        null
      );

      if( autoPlayTrailor ){
        player_play_event(
          MIXPANELCONFIG.EVENT.TRAILER_AUTOPLAY,
          videoElement,
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playCount,
          pauseCount,
          playStartTime,
          pauseStartTime,
          taUseCaseId,
          liveContent,
          responseSubscription,
          null
        );
      }
    }
  }

  /* mixpanel events handling for playback started */
  const mixpanelEventOnPlayerReady = ( videoElement, playCount, pauseCount, bufferStart, bufferStop, pauseStartTime, playStartTime )=>{
    const taUseCaseId = getTAUseCaseId( storeRailData.current );
    /* MixPanel-Events */
    setContentPlayedCount(
      metaData?.contentType,
      contentPlayed,
      setContentPlayed,
      metaData?.duration
    );
    player_play_event(
      MIXPANELCONFIG.EVENT.PLAY_CONTENT,
      videoElement,
      metaData,
      props,
      getMixpanelData( 'playerSource' ),
      myPlanProps,
      null,
      playCount,
      pauseCount,
      playStartTime,
      pauseStartTime,
      taUseCaseId,
      liveContent,
      responseSubscription,
      null,
      null,
      autoPlayTrailor,
      searchPageData.searchedInputValue
    );
  }

  /* mixpanel events handling for playback end */
  const mixpanelEventOnEndedEvent = ( videoElement, playCount, pauseCount, bufferStart, bufferStop, pauseStartTime, playStartTime, totalWatchedTime )=>{
    const taUseCaseId = getTAUseCaseId( storeRailData.current );
    player_play_event(
      MIXPANELCONFIG.EVENT.CONTENT_PLAY_END,
      videoElement,
      metaData,
      props,
      getMixpanelData( 'playerSource' ),
      myPlanProps,
      null,
      playCount,
      pauseCount,
      playStartTime,
      pauseStartTime,
      taUseCaseId,
      liveContent,
      responseSubscription,
      null,
      totalWatchedTime
    );
  }

  /* mixpanel events handling for play/pause */
  const mixPanelEventsOnPlayPause = ( videoElement, playCount, pauseCount, bufferStart, bufferStop, pauseStartTime, playStartTime, totalWatchedTime )=>{
    const taUseCaseId = getTAUseCaseId( storeRailData.current );
    if( videoElement ){
      if( videoElement.paused ){ // need to check
        player_play_event(
          MIXPANELCONFIG.EVENT.PAUSE_CONTENT,
          videoElement,
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playCount,
          pauseCount,
          playStartTime,
          pauseStartTime,
          taUseCaseId,
          liveContent,
          responseSubscription,
          null,
          totalWatchedTime
        );
        player_pause( videoElement, props, metaData, playStartTime, pauseStartTime );
      }
      else {
        player_play_event(
          MIXPANELCONFIG.EVENT.RESUME_CONTENT,
          videoElement,
          metaData,
          props,
          getMixpanelData( 'playerSource' ),
          myPlanProps,
          null,
          playCount,
          pauseCount,
          playStartTime,
          pauseStartTime,
          taUseCaseId,
          liveContent,
          responseSubscription,
          null,
          totalWatchedTime
        );
        player_play_event(
          MIXPANELCONFIG.EVENT.CONTENT_BUFFER,
          videoElement,
          metaData,
          props,
          getSource( props?.pageType ),
          myPlanProps,
          null,
          playCount,
          pauseCount,
          playStartTime,
          pauseStartTime,
          taUseCaseId,
          liveContent,
          responseSubscription,
          null,
          totalWatchedTime
        );
        player_resume( videoElement, props, metaData, playStartTime, pauseStartTime );
      }
    }
  }

  /* Mixpanel-event on player error */
  const mixpanelEventOnError = ( playCount, pauseCount, bufferStart, bufferStop, pauseStartTime, playStartTime, playerError )=>{
    const taUseCaseId = getTAUseCaseId( storeRailData.current );
    player_play_event(
      MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL,
      videoElement,
      metaData,
      props,
      getMixpanelData( 'playerSource' ),
      myPlanProps,
      contentPlaybackData?.error || playerError,
      playCount,
      pauseCount,
      playStartTime,
      pauseStartTime,
      taUseCaseId,
      liveContent,
      responseSubscription,
      null
    );
  }


  const handleVisibilitychange = () => {
    if( videoElement ){
      if( document.hidden ){
        videoElement.pause?.();
      }
      else {
        videoElement.play?.();
      }
    }
  };

  useEffect( () => {
    if( !isLiveContentType( type ) && playerVodId && !contentPlaybackData?.subtitle ){
      fetchCSDInfoAPI( { url: `${serviceConst.CONTENT_INFO_SUBTITLE}${playerVodId}` } )
    }
  }, [id, playerVodId] )

  useEffect( () =>{
    if( CSDInfoAPIResponse && CSDInfoAPIResponse.data?.meta?.subtitlePlayUrl ){
      setSubtitlePlayUrl( CSDInfoAPIResponse.data?.meta?.subtitlePlayUrl );
    }

    return ()=>{
      setSubtitlePlayUrl( null );
    }
  }, [CSDInfoAPIResponse] )

  useEffect( () => {
    if( isLiveContentType( type ) ){
      /** Commented addLiveLA() method due to Calling boxset live API after this so metadata not updating causing undefined value in LA call, once getting boxset live response, called this method */
      // addLiveLA()
      contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${id}`, headers: {
        ...( isDistroContent( liveProvider ) && { appType: DISTRO_CHANNEL.appType } ),
        ...( liveProvider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY && { appType:'TimesPlay' } )
      } } )
    }
  }, [id, type] )
  useEffect( () => {
    if( contentInfoResponse ){
      if( !contentInfoResponse.data || ( contentInfoResponse.data && Object.keys( contentInfoResponse.data )?.length === 0 ) ){
        setMetaData( {} )
        setDistroMeta( {} );
        setPlayBackTitle( '' )
        setIsError( true )
        setContentPlaybackData( null )
        return;
      }
      const metaData = get( contentInfoResponse, 'data.meta[0]', {} )
      const playbackData = get( contentInfoResponse, 'data.detail', {} );
      const channelMeta = get( contentInfoResponse, 'data.channelMeta', {} );
      setMetaData( {
        ...( metaData && Object.keys( metaData )?.length > 0 ? metaData : {
          contentType: channelMeta?.contentType
        } ),
        channelId: channelMeta?.id,
        channelName: channelMeta?.channelName
      } )
      setPlayBackTitle( metaData?.title || channelMeta?.channelName )
      setStoredContentInfo( contentInfoResponse )

      if( isDistroContent( liveProvider ) ){
        setDistroMeta( { ...getDistroMeta(), dai : playbackData?.contentDai, episodeId : metaData.id, showId: metaData.showId, playURL: channelMeta?.contentUrl } )
        if( playbackData?.contentDai ){
          distroPlayUrl( channelMeta?.contentUrl )
        }
        else {
          getEncryptedPlayUrl( metaData, channelMeta )
        }
      }
      else {
        getEncryptedPlayUrl( metaData, channelMeta )
      }
      if( isLiveContentType( metaData?.contentType ) ){
        addLiveLA( { url: serviceConst.LIVE_PLAY_LA + '/' + ( splitByDash( metaData?.taShowType ) || metaData?.contentType ) + '/' + metaData?.id + '/EPG' } )
        if( getMixpanelData( 'playerSource' )?.toUpperCase() === PAGE_NAME.SEARCH.toUpperCase() ){
          liveSearchLA( { url: serviceConst.LIVE_SEARCH_LA + '/' + metaData?.contentType + '/' + metaData?.id + '/LIVE' } )
          liveLATimeout = setTimeout( ()=>{
            liveWatchLA( { url: serviceConst.LIVE_WATCH_LA + '/' + metaData?.contentType + '/' + metaData?.id + '/LIVE' } )
          }, 10 * 60 * 1000 )
        }
        if( getMixpanelData( 'playerSource' )?.toUpperCase() === PAGE_NAME.HOME.toUpperCase() || getMixpanelData( 'playerSource' ) === constants.LIVE_TV ){
          liveClickLA( { url: serviceConst.LIVE_CLICK_LA + '/' + metaData?.contentType + '/' + metaData?.id + '/LIVE' } )

          liveLATimeout = setTimeout( ()=>{
            liveWatchLA( { url: serviceConst.LIVE_WATCH_LA + '/' + metaData?.contentType + '/' + metaData?.id + '/LIVE' } )
          }, 10 * 60 * 1000 )
        }
      }
    }
    return ()=> {
      if( liveLATimeout ){
        clearTimeout( liveLATimeout )
      }
    }
  }, [contentInfoResponse] )

  useEffect( () => {
    if( decryptedPlayUrlLiveResponse && decryptedPlayUrlLiveResponse.data ){
      if( decryptedPlayUrlLiveResponse.data.playUrl && isDistroContent( metaData?.provider ) ){
        const playUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.playUrl )
        distroPlayUrl( playUrl )
      }
      else {
        const dashWidewinePlayUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.dashWidewinePlayUrl )
        const dashWidewineLicenseUrl = getDecryptedPlayURL( decryptedPlayUrlLiveResponse.data.dashWidewineLicenseUrl )
        const metaData = get( contentInfoResponse, 'data.meta[0]', {} )
        const epidsSet = get( contentInfoResponse, 'data.detail.offerId.epids', {} );
        const contentId = get( contentInfoResponse, 'data.channelMeta.id', {} );
        setCdnEnabled( decryptedPlayUrlLiveResponse.data.cdnEnabled );
        const contentType = metaData.contentType || get( contentInfoResponse, 'data.channelMeta.contentType', {} );
        liveChannelPlayUrl( { provider: metaData.provider, contentType: contentType, epidsSet: epidsSet, playback_url: dashWidewinePlayUrl, licenceUrl: dashWidewineLicenseUrl, contentId } )
      }
    }
  }, [decryptedPlayUrlLiveResponse] )

  useEffect( () =>{
    if( srtError ){
        console.error( 'Error loading or converting SRT file:', srtError ); //eslint-disable-line
    }
    else if( Boolean( srtResponse && videoPlayer ) ){
      // const srtContent = srtResponse.response.text();
      const vttText = convertSrtTextToVttText( srtResponse.response );
      const vttBlob = new Blob( [vttText], { type : TRACK_TYPE.VTT } );
      const blobURL = URL.createObjectURL( vttBlob );
      if( srtResponse.syncParams ){
        srtResponse.syncParams.src = blobURL;
      }
      addSubtitleToVideo( videoPlayer, srtResponse.syncParams, videoElement, vttText, true );
    }

  }, [srtResponse, srtError, videoPlayer, videoElement] )

  // Update the ref whenever currentTime changes
  useEffect( () => {
    currentTimeRef.current = currentTime;
  }, [currentTime] );

  const handleOfflineStatus = ()=>{
    console.log( 'Network is offline' );
    setPlaybackRestoreTime( currentTimeRef.current );
  }

  useEffect( ()=>{
    window.addEventListener( 'offline', ()=>handleOfflineStatus() );

    return ()=>{
      window.removeEventListener( 'offline', ()=>handleOfflineStatus() );
    }
  }, [] )

  useEffect( ()=>{
    !( autoPlayTrailor || watchTrailor ) && checkNextEpisodeAvailable();
    return ()=>{
      setPlayBackTitle( '' );
      // setContentPlaybackData( null )
    }
  }, [] )

  useEffect( () => {
    if( nextEpisodeResponse?.code === 0 ){
      nextEpisodeResponseObj.current = nextEpisodeResponse;
    }
  }, [nextEpisodeResponse] );

  useEffect( () => {
    /* Mixpanel-events */
    // TODO (When third party will integrate need to add this in web-os)
    const providerValue = metaData?.provider;
    ( providerValue ) &&
        window.location.pathname.includes( PAGE_TYPE.PLAYER ) &&
        deepLinkPartners.includes( providerValue.toLowerCase() ) &&
        player_app_launch( providerValue );
  }, [metaData?.provider] );

  useEffect( () => {
    if( bufferStart > 0 ){
      player_buffer_start( metaData, bufferStart );
    }
  }, [bufferStart] );

  useEffect( () => {
    if( bufferStop > 0 ){
      player_buffer_stop( metaData, bufferStart, bufferStop );
    }
  }, [bufferStop] );

  useEffect( () =>{
    if( srcBanner ){
      setTrailor_url( srcBanner )
    }
  }, [srcBanner] )

  useEffect( () => {
    if( contentPlaybackData ){
      if( contentPlaybackData.subtitle ){
        setSubtitlePlayUrl( contentPlaybackData.subtitle )
      }
    }
  }, [contentPlaybackData] )

  useEffect( () => {
    if( videoElement ){
      document.addEventListener( 'visibilitychange', handleVisibilitychange, false );
    }

    return ()=>{
      document.removeEventListener( 'visibilitychange', handleVisibilitychange, false );
    }
  }, [videoElement] );

  useEffect( ()=>{
    if( !isLiveContentType( type ) && !autoPlayTrailor ){
      previousPathName.playerScreen = PAGE_TYPE.PLAYER_SCREEN;
    }
  }, [] )
  console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] PLAYER COMPOSER -- `, isLiveContentType( type ), !isDistroContent( liveProvider ), metaData?.provider?.toLowerCase(), PROVIDERONSHAKA.includes( metaData?.provider?.toLowerCase() ), !autoPlayTrailor, !watchTrailor )
  return (
    <PlayerStateProvider value={ {
      isError, setIsError,
      currentTime, setCurrentTime,
      bufferStart, setBufferStart,
      bufferStop, setBufferStop,
      isNextEpisodeAvailable, setIsNextEpisodeAvailable,
      setVideoPlayer,
      setVideoElement,
      errorMsg, setErrorMsg
    } }
    >
      {
        ( ( isLiveContentType( type ) && !isDistroContent( liveProvider ) ) ||
        PROVIDERONSHAKA.includes( metaData?.provider?.toLowerCase() ) && !( autoPlayTrailor || watchTrailor ) ) ?
          (
            <ShakaPlayer
              mixPanelEventOnFirstLaunch={ mixPanelEventOnFirstLaunch }
              mixpanelEventOnPlayerReady={ mixpanelEventOnPlayerReady }
              mixPanelEventsOnPlayPause={ mixPanelEventsOnPlayPause }
              mixpanelEventOnEndedEvent={ mixpanelEventOnEndedEvent }
              mixpanelEventOnError={ mixpanelEventOnError }
              goBackToPrevPage={ goBackToPrevPage }
              nextEpisodeResponseObj={ nextEpisodeResponseObj }
              checkNextEpisodeAvailable={ checkNextEpisodeAvailable }
              getSubtitleByResponse={ getSubtitleByResponse }
              getSubtitleTracks={ getSubtitleTracks }
              subtitleRef={ subtitleRef }
              isPremium={ isPremium }
              srtResponse={ srtResponse?.response }
              config={ config }
              isSubtitleThroughURL={ isSubtitleThroughURL.current }
              lastWatchedSeconds={ lastWatchedSeconds }
              currentSubtutle={ currentSubtutle }
              setCurrentSubtitle={ setCurrentSubtitle }
              cdnEnabled={ cdnEnabled }
            />
          ) : (
            <Player
              mixPanelEventOnFirstLaunch={ mixPanelEventOnFirstLaunch }
              mixpanelEventOnPlayerReady={ mixpanelEventOnPlayerReady }
              mixPanelEventsOnPlayPause={ mixPanelEventsOnPlayPause }
              mixpanelEventOnEndedEvent={ mixpanelEventOnEndedEvent }
              mixpanelEventOnError={ mixpanelEventOnError }
              autoPlayTrailor={ autoPlayTrailor }
              goBackToPrevPage={ goBackToPrevPage }
              nextEpisodeResponseObj={ nextEpisodeResponseObj }
              checkNextEpisodeAvailable={ checkNextEpisodeAvailable }
              getSubtitleByResponse={ getSubtitleByResponse }
              getSubtitleTracks={ getSubtitleTracks }
              subtitleRef={ subtitleRef }
              isPremium={ isPremium }
              config={ config }
              watchTrailor={ watchTrailor }
              setPlayTrailor={ setPlayTrailor }
              lastWatchedSeconds={ lastWatchedSeconds }
              currentSubtutle={ currentSubtutle }
              setCurrentSubtitle={ setCurrentSubtitle }
            />
          )
      }
    </PlayerStateProvider>
  )
}

export default PlayerComposer