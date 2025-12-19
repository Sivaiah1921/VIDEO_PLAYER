import { useEffect, useRef, useCallback } from 'react';

function UseTimeout( callback, delay ){
  const timeoutRef = useRef( null );
  const savedCallback = useRef( callback );

  useEffect( () => {
    savedCallback.current = callback;
  }, [callback] );

  const startTimeout = useCallback( () => {
    if( delay !== null ){
      timeoutRef.current = setTimeout( () => savedCallback.current(), delay );
    }
  }, [delay] );

  const stopTimeout = useCallback( ( onClearCallback ) => {
    if( timeoutRef.current ){
      clearTimeout( timeoutRef.current );
      if( typeof onClearCallback === 'function' ){
        onClearCallback();
      }
    }
  }, [] );

  useEffect( () => {
    startTimeout();
    return () => stopTimeout();
  }, [startTimeout, stopTimeout] );

  return { startTimeout, stopTimeout };
}

export default UseTimeout;
