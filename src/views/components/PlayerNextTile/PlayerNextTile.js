/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * This component will show the information of next episode and time in which it will start
 *
 * @module views/components/PlayerNextTile
 * @memberof -Common
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PlayerNextTile.scss';
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import CircularProgressBar from '../CircularProgressBar/CircularProgressBar';
import { useInterval } from '../../../utils/util';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';

/**
 * Represents a PlayerNextTile component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PlayerNextTile
 */
export const PlayerNextTile = function( props ){
  const { nextEpisodeTimer } = usePlayerContext();
  // console.log( props ) // eslint-disable-line
  const nextEpisodeRemainingTime = useRef( nextEpisodeTimer );
  const hasHandledEnd = useRef( false );
  const { ref, focused, focusKey, focusSelf } = useFocusable( {
    focusKey: 'NEXT_EPISODE_TILE',

    onEnterPress:()=>{
      onEnterPressCallBackFn()
    },
    onArrowPress: ( direction ) =>{
      if( direction === 'up' || direction === 'down' ){
        return false
      }
      if( direction === 'left' || direction === 'right' ){
        return false
      }
    }
  } )

  const onEnterPressCallBackFn = () =>{
    props.setIsNextEpisodeAvailable( false );
    window.clearInterval( intervalRef?.current );
    setFocus( 'PROGRESSBAR_INAPP' );
    props.handleEndedEvent()
  }

  const intervalRef = useInterval( () => {
    if( nextEpisodeRemainingTime.current >= 1 ){
      nextEpisodeRemainingTime.current = nextEpisodeRemainingTime.current - 1;
    }
    else {
      // clearInterval
      nextEpisodeRemainingTime.current = 0;
      if( !hasHandledEnd.current ){
        hasHandledEnd.current = true
        setFocus( 'PROGRESSBAR_INAPP' );
        props.setIsNextEpisodeAvailable( false );
        window.clearInterval( intervalRef?.current );
      }
    }
  }, 1000 );

  useEffect( ()=>{
    focusSelf();
    if( props.onShow ){
      props.onShow();
    }
  }, [focusSelf] )

  return (
    <FocusContext.Provider value={ focusKey } >
      <div
        className={ classNames( 'NextEpisodeTile', { 'NextEpisodeTile--withFocus': focused } ) }
        ref={ ref }
        onMouseUp={ onEnterPressCallBackFn }
      >
        <Image
          src={ props.nextEpisodeResponse?.data.nextEpisode?.boxCoverImage }
          isFuse={ props.isFuse }
          isPlayflix={ props.isPlayflix }
          isHungama={ props.isHungama }
        />
        <div className='nextEpisodeText'>Next episode in { Math.max( nextEpisodeRemainingTime.current, 0 ) } secs</div>
        <div className='circleBlock'>
          <div className='playIconCirle'>
            <Icon name='Subtract' />
          </div>
          <CircularProgressBar value={ Math.max( nextEpisodeRemainingTime.current, 0 ) }/>
        </div>
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
  example: PropTypes.string,
  onShow: PropTypes.func
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world',
  onShow: undefined
};

PlayerNextTile.propTypes = propTypes;
PlayerNextTile.defaultProps = defaultProps;

export default PlayerNextTile;
