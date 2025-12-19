/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-console */
import React from 'react';
import videojs from 'video.js';

export const VideoJS = ( props ) => {
  const videoReference = React.useRef( null );
  const playerReference = React.useRef( null );
  const { options, onReady } = props;

  React.useEffect( () => {
    // Initializing video.js player
    if( !playerReference.current ){
      const videoElement = videoReference.current;
      if( !videoElement ){
        return;
      }
      const player = playerReference.current =
         videojs( videoElement, options, () => {
           videojs.log( 'Video player is ready' );
           onReady && onReady( player );
         } );
    }
  }, [options, videoReference] );

  // Destroy video.js player on component unmount
  React.useEffect( () => {
    const player = playerReference.current;
    return () => {
      if( player && !player.isDisposed() ){
        player.dispose();
        playerReference.current = null;
      }
    };
  }, [playerReference] );
  // wrap player with data-vjs-player` attribute
  // so no additional wrapper are created in the DOM
  return (
    <div data-vjs-player>
      <video ref={ videoReference }
        className='video-js'
        preload='auto'
      />
    </div>
  );
}
export default VideoJS;