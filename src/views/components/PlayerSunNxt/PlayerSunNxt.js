/* eslint-disable no-console */
/**
 * This will be responsible for SunNxt play content
 *
 * @module views/components/PlayerSunNxt
 * @memberof -Common
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import './PlayerSunNxt.scss';
import constants, {
  NOTIFICATION_RESPONSE,
  PROVIDER_LIST,
  PAGE_TYPE,
  SUNNXT_CONSTANTS,
  getPlatformType,
  getSunNxtSDKPath,
  isTizen
} from '../../../utils/constants';
import { FetchNextEpisodes, GetTagData, PlayingEventApiCalling } from '../../../utils/slayer/PlayerService';
import { getPiLevel, getTVDeviceId, setPiLevel } from '../../../utils/localStorageHelper';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { player_play_event } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { getMixpanelData, getTAUseCaseId, isSeries, removeSunNxtSdk } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
 * Represents a PlayerSunNxt component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PlayerSunNxt
 */
export const PlayerSunNxt = ( props ) => {
  const [error, setError] = useState( false );
  const [loading, setLoading] = useState( true );
  const [errorDescription, setErrorDescription] = useState( '' );
  const modalRef = useRef();
  const buttonRef = useRef();
  const errorRef = useRef( null );
  const hasResume = useRef( false );
  const blockManualBack = useRef( true );
  const blockBackWhenDeviceRemoved = useRef( true );
  const playerRef = useRef( null );
  const nextEpisodeResponseObj = useRef();
  const epidsunnxt = useRef( null )
  const history = useHistory();
  const previousPathName = useNavigationContext();
  const {
    setSunNxtGetTokenResponseContext,
    sunNxtSuccessCallbackResponse,
    setSunNxtSuccessCallbackResponse,
    metaData,
    storedLastWatchData
  } = usePlayerContext();
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { setIsCWRail } = useHomeContext();
  const responseSubscription = useSubscriptionContext();
  const { storeRailData, isDeviceRemoved } = useMaintainPageState()
  const myPlanProps = responseSubscription.responseData.currentPack;
  const { nextEpisodeObj } = FetchNextEpisodes( '', true );
  const { fetchNextEpisodeData, nextEpisodeResponse } = nextEpisodeObj;

  const getTagObj = GetTagData( '', true );
  const { fetchToken, getTokenResponse, tokenError } = getTagObj;
  const [playerEventObj] = PlayingEventApiCalling(
    { metaData, watchedTime: 0 },
    true
  );
  const { playerEventFetchData } = playerEventObj;

  const { playerVodId, providerContentId } = useMemo( () => {
    const playerVodId = storedLastWatchData?.vodId || metaData?.vodId || metaData?.id;
    const providerContentId = storedLastWatchData?.providerContentId || metaData?.providerContentId;
    return { playerVodId, providerContentId };
  }, [storedLastWatchData, metaData] );

  let timerCancel = null;
  let timerExit = null;
  const playerOptions = {
    contentId: providerContentId,
    containerId: 'video-container',
    autoplay: true,
    contentType: metaData?.contentType,
    cc: true,
    ccPrefrence: 'ENG',
    mute: false
  };
  const playerStateRef = useRef( {
    playCount: 0,
    pauseCount: 0,
    playStartTime: new Date(),
    pauseStartTime: new Date()
  } )

  /* This is to update the exiting player state object */
  const updatePlayerState = ( newState ) => {
    playerStateRef.current = { ...playerStateRef.current, ...newState };
  };

  const onError = ( errorMsg, errDesc ) => {
    setError( true );
    setErrorDescription( errDesc )
    setTimeout( () => {
      if( modalRef.current && !modalRef.current.open ){
        modalRef.current.showModal();
      }
    }, 10 );
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

  /* Handles loadSunNxtScript..*/
  const loadSunNxtScript = () => {
    const scriptEle = document.createElement( 'script' );
    scriptEle.setAttribute( 'type', 'text/javascript' );
    scriptEle.setAttribute( 'id', 'sunNxtScriptFile' );
    scriptEle.setAttribute( 'src', getSunNxtSDKPath() );
    document.body.appendChild( scriptEle );
    if( getTokenResponse ){
      scriptEle.addEventListener( 'load', () => {
        console.log('success loading loadSunNxtScript sdk '); // eslint-disable-line
        setError( false );
        modalRef.current?.close();
        initSunNxtSDK( getTokenResponse.data.tag );
      } );
      scriptEle.addEventListener( 'error', ( error ) => {
        onError( error, `${constants.SDK_SCRIPT_ERROR_MSG} ${PROVIDER_LIST.SUNNXT}` );
        console.log('error loading loadSunNxtScript sdk ', error); // eslint-disable-line
      } );
    }
  };

  /* Handles : Initializing initSunNxtSDK player component in the player SDK .*/
  const initSunNxtSDK = ( tag ) => {
    const params = {
      tag: tag,
      UniqueId: SUNNXT_CONSTANTS.UNIQUE_ID,
      syp: SUNNXT_CONSTANTS.SPY,
      deviceId: getTVDeviceId(),
      devicename: isTizen ?
        SUNNXT_CONSTANTS.TPSAMSUNG :
        SUNNXT_CONSTANTS.TPLG,
      debuglevel: false,
      deviceType: getPlatformType( false ),
      airmouseEnable: true,
      autoPlayNext : true // Autoplay next episodes feature tested on test sdk
    };
    if( isTizen ){
      window.SUNNXT_SAM_SDK.Init( params, success_callback );
    }
    else {
      window.SUNNXT_LG_SDK.Init( params, success_callback );
    }
    console.log( 'success loading Init params', params );
  };

  function success_callback( res ){
    console.log( 'success callback response---', res, 'playerOptions---', playerOptions );
    setSunNxtSuccessCallbackResponse( res );
    let player;
    if( !res?.status ){ // TODO: need to handle properly after sunnxt changes deployment
      if( res && res.error && res.error.message && ( res.error.message.toLowerCase().includes( 'logged in' ) || res.error.message.toLowerCase().includes( 'invalid' ) ) ){
        if( isTizen ){
          player = window.SUNNXT_SAM_SDK.InitPlayer(
            playerOptions,
            events_callback,
            close_callback,
            player_error_callback
          );
        }
        else {
          player = window.SUNNXT_LG_SDK.InitPlayer(
            playerOptions,
            events_callback,
            close_callback,
            player_error_callback
          );
        }
        window.sunnxtPlayer = player;
        playerRef.current = player;
      }
      else {
        onError( res?.error, res?.error?.message );
      }
    }
    else {
      if( isTizen ){
        player = window.SUNNXT_SAM_SDK.InitPlayer(
          playerOptions,
          events_callback,
          close_callback,
          player_error_callback
        );
      }
      else {
        player = window.SUNNXT_LG_SDK.InitPlayer(
          playerOptions,
          events_callback,
          close_callback,
          player_error_callback
        );
      }
      window.sunnxtPlayer = player;
      playerRef.current = player;
    }
  }

  function events_callback( event ){
    console.log( 'success_events_callback', event );
    switch ( event.type?.toLowerCase() ){
      case 'loading':
      case 'buffering':
      case 'seeked':
        setLoading( true );
        break;
      case 'playing':
        if( hasResume.current ){
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
        }
        setLoading( false );
        break;
      case 'pause':
        hasResume.current = true
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
      case 'loaded':
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
      case 'ended':
        checkNextEpisodeAvailable()
        break;
      default:
        break;
    }
  }
  const checkNextEpisodeAvailable = () => {
    if( isSeries( metaData ) ){
      // check to change to BRAND
      let epId = 0;
      if(
        nextEpisodeResponseObj.current &&
              nextEpisodeResponseObj.current.data.nextEpisodeExists
      ){
        epId = nextEpisodeResponseObj.current.data?.nextEpisode?.id;
        epidsunnxt.current = epId
      }
      else {
        epId = playerVodId ? playerVodId : metaData?.vodId;
        epidsunnxt.current = epId
      }
      fetchNextEpisodeData( { params: { id: epId } } );
    }
  };

  function close_callback( totalDuration, resumeTime, playbackCompleted, contentID ){
    if( playbackCompleted?.toLowerCase() === constants.COMPLETED ){
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
    console.log( 'success_close_callback', parseInt( totalDuration, 10 ), parseInt( resumeTime, 10 ), playbackCompleted );
    const watchedSeconds = ( parseInt( resumeTime, 10 ) === 0 && playbackCompleted?.toLowerCase() === constants.COMPLETED ) ? parseInt( totalDuration, 10 ) : parseInt( resumeTime, 10 );
    console.log( 'watchedSeconds', watchedSeconds );
    if( blockManualBack.current ){
      if( watchedSeconds === parseInt( totalDuration, 10 ) ){
        playerEventFetchData( { type: metaData?.contentType, id: epidsunnxt.current || playerVodId, watchDuration: metaData?.duration * 60, totalDuration: metaData?.duration * 60 } );
      }
      else {
        playerEventFetchData( { type: metaData?.contentType, id: epidsunnxt.current || playerVodId, watchDuration: watchedSeconds, totalDuration: parseInt( totalDuration, 10 ) } );
      }
      setIsCWRail( true )
      blockManualBack.current = false;
      if( blockBackWhenDeviceRemoved.current ){
        setTimeout( () => {
          history.goBack();
          window.firstPlay = true;
        }, 20 );
      }
    }
  }

  function player_error_callback( error ){
    onError( error );
    console.log( 'success_player_error_callback', error );
  }

  const handleExitPopup = () => {
    clearTimeout( timerExit );
    timerExit = null;
    timerExit = setTimeout( () => {
      setError( false );
      modalRef.current?.close();
      history.goBack();
    }, 20 );
    removeSunNxtSdk()
  };

  const removeSdk = ()=>{
    removeSunNxtSdk();
    playerRef.current?.close();
    blockBackWhenDeviceRemoved.current = false;
  }

  const handleCancelPopup = () => {
    clearTimeout( timerCancel );
    timerCancel = null;
    timerCancel = setTimeout( () => {
      setError( false );
      setLoading( true );
      modalRef.current?.close();
      if( playerRef.current ){
        window.sunnxtSdkloadattempt = null;
        window.firstPlay = null;
      }

      removeSdk()

      fetchToken();
    }, 20 );
    setFocus( 'SUNNXT_PLAYER' );
  };

  useEffect( ()=>{
    setFocus( 'SUNNXT_PLAYER' );
    const sunnxtSDK = isTizen ? window.SUNNXT_SAM_SDK : window.SUNNXT_LG_SDK;
    if( !sunnxtSDK ){
      fetchToken();
    }
    return () => {
      // playerRef.current?.close( () => console.log( 'success player unmount' ) );
      const piLevelClear = getPiLevel();
      setPiLevel( piLevelClear - 1 );
    };
  }, [] )

  useEffect( () => {
    if( getTokenResponse ){
      console.log( 'sunnxt tokenResponse', getTokenResponse )
      setSunNxtGetTokenResponseContext( getTokenResponse );
      if( getTokenResponse.code === 0 ){
        setError( false );
        console.log( 'Success sunnxt token response', getTokenResponse );
        const loadSunnxtSDK = isTizen ?
          window.SUNNXT_SAM_SDK :
          window.SUNNXT_LG_SDK;
        if( !loadSunnxtSDK && !window.sunnxtSdkloadattempt && !window.firstPlay ){
          window.sunnxtSdkloadattempt = true;
          loadSunNxtScript();
        }
      }
    }
  }, [getTokenResponse] );

  useEffect( ()=>{
    if( tokenError && Object.keys( tokenError ).length > 0 ){
      onError( tokenError, tokenError.response?.data?.error_description );
    }
  }, [tokenError] )

  useEffect( () => {
    const loadSunnxtSDK = isTizen ? window.SUNNXT_SAM_SDK : window.SUNNXT_LG_SDK;
    if( loadSunnxtSDK && window.sunnxtSdkloadattempt && window.firstPlay ){
      success_callback( sunNxtSuccessCallbackResponse );
    }
  }, [
    playerOptions.contentId,
    sunNxtSuccessCallbackResponse
  ] );

  useEffect( ()=>{
    if( isDeviceRemoved ){
      removeSdk();
    }
  }, [isDeviceRemoved] )

  useEffect( ()=>{
    previousPathName.playerScreen = PAGE_TYPE.PLAYER_SCREEN;
  }, [] )

  useEffect( () => {
    checkNextEpisodeAvailable( )
  }, [] )

  useEffect( () => {
    if( nextEpisodeResponse?.code === 0 ){
      nextEpisodeResponseObj.current = nextEpisodeResponse;
    }
  }, [nextEpisodeResponse] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div id='video-container'
        style={ { height: '100vh' } }
        ref={ ref }
      >
        { error && (
          <div className='sunnxt_errorPage'
            ref={ errorRef }
          >
            <NotificationsPopUp
              modalRef={ modalRef }
              handleCancel={ () => handleExitPopup() }
              opener={ buttonRef }
              buttonClicked={ () => {
                handleCancelPopup();
              } }
              { ...NOTIFICATION_RESPONSE }
              info={ errorDescription || NOTIFICATION_RESPONSE.info }
              focusKeyRefrence={ 'DONE_BUTTON' }
              showModalPopup={ error }
            />
          </div>
        ) }
        <div style={ { opacity: 0 } }>
          <Button
            label={ 'No' }
            secondary
            size='medium'
            focusKeyRefrence={ `SUNNXT_PLAYER` }
          />
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default PlayerSunNxt;
