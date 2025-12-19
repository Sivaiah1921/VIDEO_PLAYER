/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import './popupItemView.scss';
import { setData } from '../../../utils/localStorageHelper';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getLanguageLabel } from '../../../utils/slayer/PlayerService';
import { iso6392 } from 'iso-639-2';
import classNames from 'classnames';

export const PopupItemView = ( {
  popupTitle,
  popupSubTitle,
  popupItem,
  selectData,
  activeTrack,
  videoQuality,
  closePopup,
  setLoading,
  playVideo,
  openPopup
} ) => {
  const [selectedOption, setSelectedOption] = useState( activeTrack );
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true,
    focusable: true,
    autoRestoreFocus: true
  } );
  const previousPathName = useNavigationContext();

  useEffect( () => {
    if( !!selectedOption === false ){
      let item = popupItem[0];
      if( videoQuality ){
        item = item.substr( 0, item.indexOf( '-' ) );
      }
      setFocus( `POPUP_ITEM_KEY_${item}` )
    }
    else {
      setFocus( `POPUP_ITEM_KEY_${selectedOption}` )
    }
  }, [] );

  const handleOnClick = ( item, index )=>{
    if( videoQuality && item ){
      item=item.substr( 0, item.indexOf( '-' ) ) // eslint-disable-line
    }
    setFocus( previousPathName.playerPopupButton )
    setSelectedOption( item );
    selectData( item );
    closePopup();
    setLoading( true );
  }
  const renderTickIcon = ()=>{
    return (
      <svg
        width='40'
        height='40'
        viewBox='0 0 40 40'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.3974 20.0506L16.5849 25.2025L30.249 11.6666H34.9854L17.7563 28.734L16.5819 29.8974L15.4089 28.7325L6.66699 20.0506H11.3974Z'
          fill='white'
        />
      </svg>
    )
  }

  const onItemFocus = useCallback( ( { y, ...rest } ) => {
    if( ref.current ){
      ref.current.scrollTop = rest.top - ref.current.clientHeight / 2
    }
  }, [ref] )

  /* filtering unique audio and subtitle  */
  if( !videoQuality ){
    // eslint-disable-next-line no-param-reassign
    popupItem = [...new Set( popupItem )]
  }

  /* mapping unique video-quality with higher bitrate for sonyLiv  */
  if( videoQuality ){
    const bitRateArr = [];
    const resolutionArr = [];

    popupItem?.forEach( ( item )=>{
      const resolution = item.substr( item.indexOf( '-' ) + 1, item.length );
      const bitRate = item.substr( 0, item.indexOf( '-' ) )
      resolutionArr.push( resolution );
      bitRateArr.push( bitRate );
    } )

    for ( var i = 0;i < resolutionArr.length;i++ ){
      for ( var j = i + 1;j < resolutionArr.length;j++ ){
        if( resolutionArr[i] === resolutionArr[j] ){
          if( Number( bitRateArr[i] ) > Number( bitRateArr[j] ) ){
            if( Number( selectedOption ) === Number( bitRateArr[j] ) ){
              setSelectedOption( bitRateArr[i] );
              selectData( bitRateArr[i] );
            }
            popupItem.splice( j, 1 );
          }
          else {
            if( Number( selectedOption ) === Number( bitRateArr[i] ) ){
              setSelectedOption( bitRateArr[j] );
              selectData( bitRateArr[j] );
            }
            popupItem.splice( i, 1 );
          }
        }
      }
    }
  }

  return (
    <FocusContext.Provider value={ focusKey } >
      <div className={ classNames( 'popup-itemview-container', { 'popup-itemview-container--visibility': openPopup } ) } >
        <div className='popup-body'>
          <div className='popupHeader'>
            <div className='popupTitle'>{ popupTitle }</div>
            <div className='popupSubTitle'>{ popupSubTitle }</div>
          </div>
          <div
            className='modalPopup'
            ref={ ref }
            id='popupItemscrollContainer'
          >
            <InfiniteScroll
              dataLength={ popupItem.length }
              scrollableTarget='popupItemscrollContainer'
            >
              { popupItem.map( ( item, index )=>{
                console.log( 'videoquality', item.substr( 0, item, item.indexOf( '-' ) ) );
                /* mapping language-code for sonyLiv  */
                let languageTitle;
                if( !videoQuality ){
                  // eslint-disable-next-line no-param-reassign
                  item = ( item === '' ) ? 'hin' : item;
                  languageTitle = getLanguageLabel( iso6392, item ) || item ;
                }

                const label = (
                  <div className='popupItemView' >
                    <div className='popupItemTitle'>{ videoQuality ? ( item.substr( item.indexOf( '-' ) + 1, item.length ) ) : languageTitle }</div>
                    { ( videoQuality ? ( item.substr( 0, item.indexOf( '-' ) ) === selectedOption ) : item === selectedOption ) && renderTickIcon() }
                  </div>
                )
                return (
                  <Button
                    key={ index }
                    label={ label }
                    onClick={ ()=> handleOnClick( item, index ) }
                    onFocus={ onItemFocus }
                    focusKeyRefrence={ videoQuality ? `POPUP_ITEM_KEY_${item.substr( 0, item.indexOf( '-' ) )}` : `POPUP_ITEM_KEY_${item}` }
                  />
                )
              } ) }
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};