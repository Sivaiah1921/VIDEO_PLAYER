/* eslint-disable no-console */
import { useState, useCallback, useEffect } from 'react';
import UseTimeout from '../customHooks/UseTimeout';

const ACTIVITY_TIMEOUT = 6000;

const useUserActivity = ( isPlaying, blockUserActivity ) => {
  const [isActive, setIsActive] = useState( true );

  const handleInactivity = useCallback( () => {
    if( isPlaying ){
      setIsActive( false );
    }
  }, [isPlaying] );

  const { startTimeout, stopTimeout } = UseTimeout( handleInactivity, ACTIVITY_TIMEOUT );

  const resetActivity = useCallback( () => {
    if( blockUserActivity ){
      setIsActive( false );
      stopTimeout();
    }
    else {
      setIsActive( true );
      stopTimeout();
      if( isPlaying ){
        startTimeout();
      }
    }
  }, [isPlaying, blockUserActivity] );

  useEffect( () => {
    if( blockUserActivity ){
      setIsActive( false ); // Instantly set inactive if user activity is blocked
      return;
    }

    document.addEventListener( 'mousemove', resetActivity );
    document.addEventListener( 'keydown', resetActivity );

    // Reset activity when video is playing or user interacts
    resetActivity();

    return () => {
      document.removeEventListener( 'mousemove', resetActivity );
      document.removeEventListener( 'keydown', resetActivity );
    };
  }, [blockUserActivity, isPlaying] );

  return isActive;
};

export default useUserActivity;
