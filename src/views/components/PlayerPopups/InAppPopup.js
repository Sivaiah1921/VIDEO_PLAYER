/* eslint-disable no-console */
import Button from '../Button/Button';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import Text from '../Text/Text';
import constants from '../../../utils/constants';
import './InAppPopup.scss'
import { getLanguageLabel } from '../../../utils/slayer/PlayerService';
import { iso6392 } from 'iso-639-2';

export const InAppPopup = function( props ){
  const { listSubtitle, label, currentSubtutle, currentAudioTrack, currentVideoTrack } = props;
  const { ref, focusKey } = useFocusable( {
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );

  const getTickClassName = ( label, data )=>{
    const isAudio = label === constants.LANGUAGES;
    const isVideo = label === constants.VIDEOQUALITY;
    const currentTrack = isAudio ? ( currentAudioTrack === constants.ESPANOL_CODE ? constants.SPANISH : getLanguageLabel( iso6392, currentAudioTrack ) ) : isVideo ? currentVideoTrack : currentSubtutle;
    const className = ( data === currentTrack ) ? 'show-tick' : 'hide-tick';
    return className
  }

  return (
    <>
      <FocusContext.Provider value={ focusKey } >
        <div className='playerPopup'
          ref={ ref }
        >
          <div className='playerPopup__heading'>
            <Text>{ label }</Text>
          </div>
          <div className='playerPopup__list'>
            {
              listSubtitle.map( ( data, index ) => {
                return (
                  <div className={ getTickClassName( label, data ) }
                    key={ index }
                  >
                    <Button
                      focusKeyRefrence={ 'INAPP_POPUP_ITEM' + data }
                      iconLeft={ true }
                      iconLeftImage={ 'Tick' }
                      label={ data }
                      onClick={ ()=>{
                        props.hidePopup( data, index )
                      } }
                    ></Button>
                  </div>
                )
              } )
            }
          </div>
        </div>
      </FocusContext.Provider>
    </>
  )
}