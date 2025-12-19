/**
 * Represents a Player component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Player
 */

import React from 'react';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { secondsToHmsPlayer } from '../../../utils/slayer/PlayerService';
import './ProgressBar.scss';
import Text from '../Text/Text';
import constants from '../../../utils/constants';

const ProgressBar = ( { progress, seekTo, videoCurrentTime, videoDuration, progressBarPosition, controlsVisibility, liveContent, onChange, isAdUI, addTimer } ) => {
  const { ref, focusKey, focused } = useFocusable( {
    focusKey: 'PROGRESSBAR_INAPP',
    autoRestoreFocus: true,
    onArrowPress:( direction )=>{
      if( direction === 'up' ){
        setFocus( 'PLAYPAUSEICON' );
      }
    }
  } );

  const handleProgress = ( e ) => {
    if( onChange ){
      onChange();
    }
    else {
      const inputProgress = ( Number( e.target.value ) * videoDuration ) / 100;
      seekTo( Number( e.target.value ), inputProgress );
    }
  };

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        className={ classNames( 'progressBarContainer',
          {
            'progressBarContainerWithSubtitle': progressBarPosition,
            'progressBarForADUI': isAdUI,
            'hideProgressBarContainer': !controlsVisibility
          } ) }
        id='progressBarContainer'
      >
        <div className={ classNames( 'progressBar', { progressBar_unfocussedSeekBar: !focused, progressBar_focussedSeekBar: focused, 'seekBarpointer': liveContent || isAdUI } ) } >
          <div
            id='currentTime'
            className={ classNames( 'progressBar__timestamp', { 'progressBar__hideTimestamp': liveContent || isAdUI } ) }
          >
            { videoCurrentTime < 1 ? constants.INITIAL_TIME : secondsToHmsPlayer( parseInt( videoCurrentTime, 10 ) ) }
          </div>
          <input
            className={ 'progressBarContainer__volume' }
            ref={ ref }
            type='range'
            min='0'
            max='100'
            step='0.01'
            value={ progress }
            onChange={ handleProgress }
            style={ { backgroundSize: `${progress}% 100%` } }
          />
          <div
            id='videoDuration'
            className={ classNames( 'progressBar__timestamp', { 'progressBar__hideTimestamp': liveContent || isAdUI }, { 'progressBar__isAdUI': isAdUI } ) }
          >
            { videoDuration < 1 ? constants.INITIAL_TIME : secondsToHmsPlayer( parseInt( videoDuration, 10 ) ) }
          </div>
          { isAdUI &&
          <div
            id='addTimer'
            className={ classNames( 'progressBar__addTimer' ) }
          >
            <Text color='white' >
              { ` -${ secondsToHmsPlayer( parseInt( addTimer, 10 ) ) || constants.INITIAL_TIME }` }
            </Text>
          </div> }
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default ProgressBar;