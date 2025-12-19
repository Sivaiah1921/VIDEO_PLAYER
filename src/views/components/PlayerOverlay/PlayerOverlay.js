/**
 * Contains common controls ui for all player
 *
 * @module views/components/PlayerOverlay
 * @memberof -Common
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PlayerOverlay.scss';
import ProgressBar from '../ProgressBar/ProgressBar';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import Text from '../Text/Text';
import classNames from 'classnames';
import { InAppControlButton } from '../InAppControlButton/InAppControlButton';
import constants from '../../../utils/constants';
import PlayerNextTile from '../PlayerNextTile/PlayerNextTile';
import { usePlayerState } from '../Player/PlayerStateContext';

/**
 * Represents a PlayerOverlay component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PlayerOverlay
 */

const RenderCenterIcon = ( { isVideoPlaying, toggleVideoPlay, isLoading, isGoLive, liveContent } ) => {
  const setFocusRef = useRef( null );
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusKey: 'PLAYPAUSEICON',
    autoRestoreFocus: true,
    onArrowPress:( direction )=>{
      if( direction === 'down' ){
        if( liveContent ){
          if( isGoLive ){
            setFocus( 'GOLIVE' );
          }
        }
        else {
          clearTimeout( setFocusRef.current );
          setFocusRef.current = setTimeout( ()=>{
            setFocus( 'PROGRESSBAR_INAPP' );
          }, 20 )
        }
      }
      else if( direction === 'up' || direction === 'left' || direction === 'right' ){
        return false;
      }
    }
  } );

  useEffect( ()=>{
    focusSelf();
    return ()=> clearTimeout( setFocusRef.current );
  }, [focusSelf] )

  return (
    <FocusContext.Provider value={ focusKey } >
      <div
        ref={ ref }
        className='centerIcon'
      >
        { !isVideoPlaying && !isLoading && (
          <Icon
            name={ 'Play' }
            className={ 'playPauseIcon' }
            onClick={ toggleVideoPlay }
            width={ 60 }
            height={ 60 }
          />
        ) }
        { isVideoPlaying && !isLoading && (
          <Icon
            name={ 'Pause' }
            className={ 'playPauseIcon' }
            onClick={ toggleVideoPlay }
            width={ 60 }
            height={ 60 }
          />
        ) }
      </div>
    </FocusContext.Provider>
  );
};

export const PlayerOverlay = function( props ){
  const { player, progress, seekTo, videoCurrentTime, videoDuration, controlsVisibility, hasSubtitle, liveContent, isVideoPlaying, playBackTitle, isGoLive, handleGoLive, toggleVideoPlay, showSubtitleList, listSubtitle, onSubtitleClick, progressBarPosition, hideSubtitles, hasAudioTracks, audioTrackList, showAudioList, onAudioClick, hideAudioPopup, isLoading, hasVideoTracks, videoTrackList, setShowVideoList, showVideoList, onVideoClick, hideVideoPopup, setShowAudioList, setShowSubtitleList, setIsPopupOpen, nextEpisodeResponseObj, handleEndedEvent, isFuse, isPlayflix, currentSubtutle, currentAudioTrack, currentVideoTrack, isHungama } = props;
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true,
    autoRestoreFocus: true,
    focusable: true
  } );
  const { setIsNextEpisodeAvailable, isNextEpisodeAvailable } = usePlayerState();
  const goliveTimeoutRef = useRef( null );

  useEffect( () => {
    if( isGoLive ){
      clearTimeout( goliveTimeoutRef.current );
      goliveTimeoutRef.current = null;
      goliveTimeoutRef.current = setTimeout( () => {
        setFocus( 'GOLIVE' );
      }, 0 )
    }
    return ()=> {
      clearTimeout( goliveTimeoutRef.current )
      goliveTimeoutRef.current = null;
    }
  }, [isGoLive] )

  const renderLiveTitle = () => {
    return (
      <div className={ classNames( 'playerControls--liveContainer', { 'playerControls--VODContainer': progressBarPosition } ) }>
        <div className={ classNames( 'playerControls--liveContainer__title', { 'playerControls--liveContainer__VODtitle': !liveContent } ) } >
          <Text>
            { playBackTitle }
          </Text>
        </div>
        { liveContent && ( !isGoLive ? (
          <div className='playerControls--liveContainer__live'>
            <Text>
              { constants.LIVE }
            </Text>
          </div>
        ) :
          (
            <div className='playerControls--liveContainer__goLiveBtn'>
              <Button
                label={ 'GO LIVE' }
                onClick={ handleGoLive }
                focusKeyRefrence={ 'GOLIVE' }
                focusedButton={ () => {} }
                leftMostButton={ 'GOLIVE' }
              />
            </div>
          ) ) }
      </div>
    )
  }

  const renderProgressBar = ()=>{
    return (
      <ProgressBar
        progress={ progress }
        seekTo={ seekTo }
        videoCurrentTime={ videoCurrentTime }
        videoDuration={ videoDuration }
        progressBarPosition={ progressBarPosition }
        liveContent={ liveContent }
      />
    )
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        className={ classNames( 'plaeyrControlsContainer', { 'plaeyrControlsContainer--hidden': !controlsVisibility } ) }
        ref={ ref }
      >
        <RenderCenterIcon
          isVideoPlaying={ isVideoPlaying }
          toggleVideoPlay={ toggleVideoPlay }
          isGoLive={ isGoLive }
          isLoading={ isLoading }
          liveContent={ liveContent }
        />
        <div className='playerControls'>
          { renderLiveTitle() }
        </div>
        {
          liveContent ? (
            <FocusContext.Provider focusable={ false }
              value=''
            >
              { renderProgressBar() }
            </FocusContext.Provider>
          ) : (
            <>
              { renderProgressBar() }
            </>
          )
        }
        { ( hasSubtitle || hasAudioTracks || hasVideoTracks ) &&
        <InAppControlButton
          player={ player }
          hasSubtitle={ hasSubtitle }
          listSubtitle={ listSubtitle }
          showSubtitleList={ showSubtitleList }
          onSubtitleClick={ onSubtitleClick }
          hideSubtitles={ hideSubtitles }
          hasAudioTracks={ hasAudioTracks }
          audioTrackList={ audioTrackList }
          showAudioList={ showAudioList }
          onAudioClick={ onAudioClick }
          hideAudioPopup={ hideAudioPopup }
          hasVideoTracks={ hasVideoTracks }
          videoTrackList={ videoTrackList }
          showVideoList={ showVideoList }
          onVideoClick={ onVideoClick }
          hideVideoPopup={ hideVideoPopup }
          setShowAudioList={ setShowAudioList }
          setShowSubtitleList={ setShowSubtitleList }
          setShowVideoList={ setShowVideoList }
          setIsPopupOpen={ setIsPopupOpen }
          currentSubtutle={ currentSubtutle }
          currentAudioTrack={ currentAudioTrack }
          currentVideoTrack={ currentVideoTrack }
        /> }
        { isNextEpisodeAvailable && (
          <PlayerNextTile
            onShow={ () => {
              setShowSubtitleList( false );
              setShowAudioList( false );
              setShowVideoList( false );
              setIsPopupOpen( false );
            } }
            nextEpisodeResponse={ nextEpisodeResponseObj }
            setIsNextEpisodeAvailable={ setIsNextEpisodeAvailable }
            { ...( isFuse && { isFuse: true } ) }
            { ...( isPlayflix && { isPlayflix: true } ) }
            { ...( isHungama && { isHungama: true } ) }
            handleEndedEvent={ handleEndedEvent }
          />
        ) }
      </div>
    </FocusContext.Provider>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world'
};

PlayerOverlay.propTypes = propTypes;
PlayerOverlay.defaultProps = defaultProps;

export default PlayerOverlay;
