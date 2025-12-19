/**
 * This will be responsible for MxPlayer play content
 *
 * @module views/components/MxPlayer
 * @memberof -Common
 */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import './MxPlayer.scss';
import {
  getPiLevel,
  setMXPlayerError,
  setPiLevel
} from '../../../utils/localStorageHelper';
import {
  COMMON_HEADERS,
  MX_PLAYER_CONTENT_TYPE,
  PLAYER,
  NOTIFICATION_RESPONSE,
  getMxPlayerSDKPath,
  getMxPlayerIdentifier,
  getSourceValue,
  isTizen
} from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import {
  PlayingEventApiCalling
} from '../../../utils/slayer/PlayerService';
import {
  useFocusable,
  FocusContext,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { player_play_event } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { getMixpanelData, getTAUseCaseId } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
/**
 * Represents a MxPlayer component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns MxPlayer
 */
export const MxPlayer = function( props ){
  const [error, setError] = useState( false );

  const modalRef = useRef();
  const buttonRef = useRef();

  const history = useHistory();
  const { metaData, storedLastWatchData } =
    usePlayerContext();
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { storeRailData, isDeviceRemoved } = useMaintainPageState();
  const { setIsCWRail } = useHomeContext()
  const responseSubscription = useSubscriptionContext();

  const [playerEventObj] = PlayingEventApiCalling(
    { metaData, watchedTime: 0 },
    true
  );
  const { playerEventFetchData, playerEventResponse } = playerEventObj;

  const episodeMeta = {
    type: metaData?.contentType,
    id: metaData?.id || metaData?.vodId
  };
  const providerContentId = storedLastWatchData?.providerContentId || metaData?.providerContentId
  const myPlanProps = responseSubscription.responseData.currentPack;

  const platformData = {
    identifier: getMxPlayerIdentifier(), // 'tataplay_identifier', // 'fJraV38MHU4bosdzJarW', // CONSTANT.MX_IDENTIFIER,
    token: '', // myPlanProps && Object.keys( myPlanProps ).length > 0 ? getDeviceToken() : '',
    source: getSourceValue(), // 'TPLG', // 'TSMOBILE',
    dsn: COMMON_HEADERS.DEVICE_ID
  };

  const onError = ( error ) => {
    setError( true );
    setMXPlayerError( 'true' );
    setTimeout( () => {
      modalRef.current?.showModal();
      setFocus( 'DONE_BUTTON' );
    }, 10 );
    player_play_event(
      MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL,
      {},
      metaData,
      props,
      getMixpanelData( 'playerSource' ),
      myPlanProps,
      error,
      0,
      0,
      0,
      0,
      getTAUseCaseId( storeRailData.current ),
      false,
      responseSubscription,
      null
    );
  }

  const loadMXScript = () => {
    const scriptEle = document.createElement( 'script' );
    scriptEle.setAttribute( 'type', 'text/javascript' );
    scriptEle.setAttribute( 'id', 'mxScriptFile' );
    scriptEle.setAttribute( 'src', getMxPlayerSDKPath() );
    scriptEle.setAttribute( 'async', isTizen );
    document.body.appendChild( scriptEle );

    scriptEle.addEventListener( 'load', () => {
      console.log('MX SDK, loaded'); // eslint-disable-line
      initializeMXPlayer( providerContentId );
    } );
    scriptEle.addEventListener( 'error', () => {
      console.log(' error loading MX sdk '); // eslint-disable-line
      onError( { message: 'Error Loading MX Sdk', url: getMxPlayerSDKPath() } )
    } );
  };

  const initializeMXPlayer = ( contentID ) => {
    console.log('Initialize MXPlayer with providerContentId = ', contentID); // eslint-disable-line
    window.MXPlayer &&
      window.MXPlayer.initialize(
        '#mxPlayerWapper',
        contentID,
        getContentType(),
        platformData,
        getPlatformCallBacks()
      );
  };

  const goBackToPrevPage = () => {
    setTimeout( () => {
      setIsCWRail( true )
    }, 5000 )
    history.goBack();
    const piLevelClear = getPiLevel();
    setPiLevel( piLevelClear - 1 );
  }

  const getPlatformCallBacks = () => {
    return {
      eventCallback: ( event ) => {
        console.log('platformCallbacks:', event); // eslint-disable-line
        switch ( event.type ){
          case 'BACK_PRESS':
            console.log('platformCallbacks:', event); // eslint-disable-line
            goBackToPrevPage();
            break;

          case 'NEXT_EPISODE':
            console.log('platformCallbacks:', event); // eslint-disable-line
            initializeMXPlayer( event.value.id );
            break;

          case 'VOLUME_CHANGE':
            console.log('platformCallbacks:', event); // eslint-disable-line
            break;

          case 'PLAYER_LOADED':
            eventsAPICall();
            console.log('platformCallbacks:', event); // eslint-disable-line
            player_play_event(
              MIXPANELCONFIG.EVENT.PLAY_CONTENT,
              {},
              metaData,
              props,
              getMixpanelData( 'playerSource' ),
              myPlanProps,
              null,
              0,
              0,
              0,
              0,
              getTAUseCaseId( storeRailData.current ),
              false,
              responseSubscription,
              null
            );
            break;

          case 'PLAYBACK_ENDED':
            goBackToPrevPage();
            playerEventFetchData( { type: metaData?.contentType, id: episodeMeta?.id, watchDuration: metaData?.duration * 60 } );
            player_play_event(
              MIXPANELCONFIG.EVENT.CONTENT_PLAY_END,
              {},
              metaData,
              props,
              getMixpanelData( 'playerSource' ),
              myPlanProps,
              null,
              0,
              0,
              0,
              0,
              getTAUseCaseId( storeRailData.current ),
              false,
              responseSubscription,
              null
            );
            break;
        }
      },
      errorCallback: ( error ) => {
        console.log('MX Player throwing Error == ', error); //eslint-disable-line
        window.MXPlayer.exitSDK();
        onError( { ...error, url: getMxPlayerSDKPath() } )
      }
    };
  };

  // TODO - add below code later
  const getContentType = () => {
    if( metaData?.contentType === 'MOVIES' ){
      return MX_PLAYER_CONTENT_TYPE.MOVIE;
    }
    else if( metaData?.contentType === 'WEB_SHORTS' ){
      return MX_PLAYER_CONTENT_TYPE.SHORTS;
    }
    else {
      return MX_PLAYER_CONTENT_TYPE.EPISODE;
    }
  };

  const eventsAPICall = () => {
    playerEventFetchData( { type: metaData?.contentType, id: episodeMeta?.id, watchDuration: 10 } );
  };

  const onKeyPressFn = useCallback( ( { keyCode } ) => {
    switch ( keyCode ){
      case PLAYER.STOP:
        goBackToPrevPage();
        break;
      default:
        break;
    }
  } );

  const handleCancelPopup = () => {
    setError( false );
    modalRef.current?.close();
    setFocus( 'MX_PLAYER' );
    initializeMXPlayer( providerContentId );
  };

  const handleExitPopup = () => {
    setError( false );
    modalRef.current?.close();
    goBackToPrevPage();
  };

  useEffect( () => {
    if( providerContentId ){
      if( !window.MXPlayer && !window.loadattempt ){
        window.loadattempt = true;
        loadMXScript();
      }
      else {
        initializeMXPlayer( providerContentId );
      }
    }
    setFocus( 'MX_PLAYER' );
  }, [providerContentId] );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPressFn );
    return () => {
      window.removeEventListener( 'keydown', onKeyPressFn );
    };
  }, [] );

  useEffect( ()=>{
    if( isDeviceRemoved ){
      window.MXPlayer?.exitSDK();
    }
  }, [isDeviceRemoved] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='MxPlayer'
        ref={ ref }
      >
        { !error &&
          <div id='mxPlayerWapper'
            className='mxPlayerWapper'
          ></div> }
        { error && (
          <div className='MxPlayer__pageError'>
            <NotificationsPopUp
              modalRef={ modalRef }
              handleCancel={ () => handleExitPopup() }
              opener={ buttonRef }
              buttonClicked={ () => {
                handleCancelPopup();
              } }
              { ...NOTIFICATION_RESPONSE }
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
            focusKeyRefrence={ `MX_PLAYER` }
          />
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default MxPlayer;
