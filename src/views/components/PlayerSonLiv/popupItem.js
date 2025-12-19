/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react'
import './popupItem.scss';
import { PopupItemView } from './popupItemView';
import Button from '../Button/Button';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { keyCodeForBackFunctionality, playerPopUpmodalDom } from '../../../utils/util';

export default function PopupItem( { data, setLoading, isPopupOpen, playVideo, isLiveContent, isVideoPlaying } ){
  const [openPopup, setopenPopup] = useState( false );
  const popupData = Object.values( data );
  const [selectedIndex, setSellectedIndex] = useState( null );
  const openPopUpRef = useRef( false )
  const [showGoLive, setShowGoLive] = useState( false );
  const { ref, focusKey } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true
  } );
  const previousPathName = useNavigationContext();




  const handleOnClick = ( index, id )=>{
    setSellectedIndex( id );
    setopenPopup( true );
    isPopupOpen( true );
    previousPathName.playerPopupButton = `POPUP_BUTTON_KEY_${index}`;
  }

  const handleKeyPress = ( e )=>{
    if( ( keyCodeForBackFunctionality( e.keyCode ) ) && openPopUpRef.current ){
      setopenPopup( false );
      isPopupOpen( false );
      setFocus( previousPathName.playerPopupButton );
    }
  }

  useEffect( ()=>{
    openPopUpRef.current = openPopup
  }, [openPopup] )

  useEffect( () =>{
    window.addEventListener( 'keydown', handleKeyPress );
    return () => {
      window.removeEventListener( 'keydown', handleKeyPress );
    };
  }, [] );

  useEffect( ()=>{
    if( playerPopUpmodalDom() === null ){
      if( isVideoPlaying ){
        setShowGoLive( true )
      }
      else {
        setShowGoLive( false )
      }
    }
  }, [isVideoPlaying] )

  return (
    <>
      <FocusContext.Provider value={ focusKey } >
        <div
          className={ 'popup-button' }
          ref={ ref }
        >
          { popupData.map( ( item, index )=>{
            return (
              <>
                { !( ( item?.data?.length === 0 ) || ( item.popupTitle === 'Subtitles' && item?.data?.length === 1 && item.data[0] === 'OFF' ) || ( item.popupTitle === data?.goToLive?.popupTitle && showGoLive ) ) &&
                  (
                    <Button
                      onClick={ ()=> isLiveContent && ( item.popupTitle === data?.goToLive?.popupTitle ) ? playVideo() : handleOnClick( index, item.id ) }
                      label={ item.popupTitle }
                      focusKeyRefrence={ `POPUP_BUTTON_KEY_${index}` }
                      onFocus={ ()=>{
                        previousPathName.playerPopupButton = `POPUP_BUTTON_KEY_${index}`;
                      } }
                      key={ item.id }
                    />
                  ) }
              </>
            )
          } ) }
        </div>
      </FocusContext.Provider>
      { openPopup ? (
        <PopupItemView
          popupTitle={ popupData[selectedIndex].popupTitle }
          popupSubTitle={ popupData[selectedIndex].popupSubTitle }
          popupItem={ popupData[selectedIndex].data }
          selectData={ popupData[selectedIndex].selectData }
          activeTrack={ popupData[selectedIndex].activeTrack }
          videoQuality={ popupData[selectedIndex].videoQuality }
          closePopup={ ()=>{
            setopenPopup( false );
            isPopupOpen( false );
          } }
          setLoading={ setLoading }
          openPopup={ openPopup }
        />
      ) : null }
    </>
  )
}