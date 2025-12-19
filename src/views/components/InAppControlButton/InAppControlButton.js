/* eslint-disable no-console */
import Button from '../Button/Button';
import { InAppPopup } from '../PlayerPopups/InAppPopup';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import constants from '../../../utils/constants';
import './InAppControlButton.scss';
import { iso6392 } from 'iso-639-2';
import { getLanguageLabel } from '../../../utils/slayer/PlayerService';

export const InAppControlButton = function( props ){
  const { listSubtitle, hideSubtitles, hasSubtitle, hasAudioTracks, audioTrackList, showAudioList, hideAudioPopup, hasVideoTracks, showVideoList, videoTrackList, hideVideoPopup, setShowAudioList, setShowSubtitleList, setShowVideoList, setIsPopupOpen, currentSubtutle, currentAudioTrack, currentVideoTrack } = props;
  const playerLeftPopupButton = hasAudioTracks ? 'BUTTON_PRIMARY_AUDIO' : hasVideoTracks ? 'BUTTON_PRIMARY_VIDEO' : 'BUTTON_PRIMARY_SUBTITLE';
  const { ref, focusKey } = useFocusable( {
    focusKey: 'IN_APP_CONTROLS',
    autoRestoreFocus: true
  } )

  const handleClick = ( setShowList, currentTrack ) => {
    setIsPopupOpen( true );
    setShowList( true );
    setFocus( 'INAPP_POPUP_ITEM' + currentTrack );
  };

  return (
    <>
      <FocusContext.Provider value={ focusKey }>
        <div className='popup-button-container'
          ref={ ref }
        >
          { hasAudioTracks && (
            <Button size='medium'
              label={ constants.LANGUAGES }
              focusKeyRefrence={ 'BUTTON_PRIMARY_AUDIO' }
              iconLeft={ true }
              iconLeftImage={ 'Subtitle' }
              focusediconLeftImage={ 'SubtitleFocus' }
              onClick={ ()=> handleClick( setShowAudioList, getLanguageLabel( iso6392, currentAudioTrack ) ) }
              leftMostButton={ playerLeftPopupButton }
            /> )
          }
          { hasVideoTracks && (
            <div className='popup-button-container__video-popup'>
              <Button size='medium'
                label={ constants.VIDEOQUALITY }
                focusKeyRefrence={ 'BUTTON_PRIMARY_VIDEO' }
                iconLeft={ true }
                iconLeftImage={ 'Subtitle' }
                focusediconLeftImage={ 'SubtitleFocus' }
                onClick={ ()=> handleClick( setShowVideoList, currentVideoTrack ) }
                leftMostButton={ playerLeftPopupButton }
              />
            </div> )
          }
          { hasSubtitle && (
            <Button size='medium'
              label={ constants.SUBTITLES }
              focusKeyRefrence={ 'BUTTON_PRIMARY_SUBTITLE' }
              iconLeft={ true }
              iconLeftImage={ 'Subtitle' }
              focusediconLeftImage={ 'SubtitleFocus' }
              onClick={ ()=> handleClick( setShowSubtitleList, currentSubtutle ) }
              leftMostButton={ playerLeftPopupButton }
            /> )
          }
        </div>
      </FocusContext.Provider>

      { props.showSubtitleList && (
        <InAppPopup
          listSubtitle={ listSubtitle }
          hidePopup={ hideSubtitles }
          label={ 'Subtitles' }
          currentSubtutle={ currentSubtutle }
        />
      ) }
      { showAudioList && (
        <InAppPopup
          listSubtitle={ audioTrackList }
          hidePopup={ hideAudioPopup }
          label={ constants.LANGUAGES }
          currentAudioTrack={ currentAudioTrack }
        />
      ) }
      { showVideoList && (
        <InAppPopup
          listSubtitle={ videoTrackList }
          hidePopup={ hideVideoPopup }
          label={ constants.VIDEOQUALITY }
          currentVideoTrack={ currentVideoTrack }
        />
      ) }
    </>
  )
}