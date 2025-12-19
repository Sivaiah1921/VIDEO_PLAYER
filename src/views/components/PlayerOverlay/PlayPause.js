/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import './PlayPause.scss';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';

export const PlayPause = ( { isVideoPlaying, toggleVideoPlay, loading } )=>{
  const { ref, focusKey, focused, focusSelf } = useFocusable( {
    focusKey: 'PLAYPAUSEICON',
    autoRestoreFocus: true
  } );

  useEffect( ()=>{
    focusSelf();
  }, [focusSelf] )

  return (
    <FocusContext.Provider value={ focusKey } >
      <div className='PlayPause'>
        <div
          className='PlayPause__centerIcons'
          ref={ ref }
          onClick={ () => toggleVideoPlay() }
          role='button'
          tabIndex='0'
        >
          {
            !isVideoPlaying && !loading && (
              <Icon
                name='PlayIcon'
                className='playPauseControls'
                primaryfill={ focused ? '#F0F0F0' : '#0F0F0F' }
                secondaryfill={ focused ? '#0F0F0F' : '#F0F0F0' }
              />
            )
          }
          {
            isVideoPlaying && !loading && (
              <Icon
                name='PauseIcon'
                className='playPauseControls'
                primaryfill={ focused ? '#F0F0F0' : '#0F0F0F' }
                secondaryfill={ focused ? '#0F0F0F' : '#F0F0F0' }
              />
            )
          }
        </div>
      </div>
    </FocusContext.Provider>
  )
}