import React from 'react';
import VideoJS from './VideoJS';
import videojs from 'video.js';
import eme from 'videojs-contrib-eme';


export const PlayerSample = () => {
  videojs.registerPlugin( 'eme', eme );
  const playerReference = React.useRef( null );

  // setting the video-js option for the player
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    html5: {
      vhs: {
        overrideNative: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    }
  };

  videoJsOptions.sources = [{
    src: 'https://delta20tatasky.akamaized.net/out/i/846228.mpd',
    type: 'application/dash+xml',
    keySystems: {
      'com.widevine.alpha': 'https://tataplay.stage.ott.irdeto.com/Widevine/getlicense?CrmId=tatasky&AccountId=tatasky&ContentId=400000072&ls_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNvbnRyb2xfc2lnbmluZ19rZXlfdWF0XzE2NzQ0NTY0MDcxMzIifQ.eyJzdWIiOiI5NjY1OTkwOTU2IiwiaXNlIjp0cnVlLCJqdGkiOiI3NjgwN2IxMi05NjE4LTRlMjItYmZiNC1hZDRiOTg0NmI4NzQiLCJhaWQiOiJ0YXRhc2t5IiwiZXhwIjoxNjg2OTU4ODQxLCJuYW1lIjoibnVsbCIsImlhdCI6MTY4NjkxNTY0MSwiZW50IjpbeyJlcGlkIjoiU3Vic2NyaXB0aW9uX01vYmlsZV9TdHJlYW1pbmciLCJiaWQiOiIxMDAwMDAwNzA1In0seyJlcGlkIjoiU3Vic2NyaXB0aW9uX01vYmlsZV9TdHJlYW1pbmciLCJiaWQiOiIxMDAwMDAwMDAxIn0seyJlcGlkIjoiU3Vic2NyaXB0aW9uX01vYmlsZV9TdHJlYW1pbmciLCJiaWQiOiIxMDAwMDAxMDM1In0seyJlcGlkIjoiU3Vic2NyaXB0aW9uX01vYmlsZV9TdHJlYW1pbmciLCJiaWQiOiIxMDAwMDAxNDE2In1dLCJjc21vIjp7Im1hcyI6IjYiLCJkdCI6ImJpbmdlIiwibWFzZCI6IjMifSwiaXNzIjoiYmluZ2Vfb3Blbl9sZyJ9.Rxw1hWwwmqYi2ayxySRG6Tzqb649RxGr0Lue2ob2rH8'
    }
  }]
  const playerReady = ( player ) => {
    // eslint-disable-next-line no-console
    console.log( 'playerReady', playerReady )
    playerReference.current = player;
    player.eme();
    player.src( videoJsOptions.sources[0] );

    // handling video player
    player.on( 'waiting', () => {
      // eslint-disable-next-line no-console
      console.log( 'Video Player is waiting' );
    } );
    player.on( 'dispose', () => {
      // eslint-disable-next-line no-console
      console.log( 'Video player will dispose' );
    } );
  };
  return (
    <>
      <VideoJS options={ videoJsOptions }
        onReady={ playerReady }
      />
    </>
  );
}