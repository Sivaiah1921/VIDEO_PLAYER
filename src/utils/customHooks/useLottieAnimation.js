/* eslint-disable no-console */
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export function useLottieAnimation( jsonUrl ){
  const containerRef = useRef( null );

  useEffect( () => {
    let animItem;

    if( !jsonUrl || !jsonUrl.endsWith( '.json' ) ){
      return;
    }

    const loadAnimation = async() => {
      try {
        const response = await fetch( jsonUrl );
        console.log( 'ress', response )
        if( !response.ok ){
          throw new Error( `Failed to fetch animation: ${response.statusText}` );
        }
        const animationData = await response.json();

        animItem = lottie.loadAnimation( {
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData
        } );

        animItem.play();
      }
      catch ( error ){
        console.error( 'Error loading Lottie animation:', error );
      }
    };

    loadAnimation();

    return () => {
      if( animItem ){
        animItem.destroy();
      }
    };
  }, [jsonUrl] );

  return containerRef;
}
