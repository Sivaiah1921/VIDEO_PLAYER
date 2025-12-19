/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * This component is used to show the user to helping video for apple journey
 *
 * @module views/components/AppleKnowledgeVideoPopup
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AppleKnowledgeVideoPopup.scss';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';
import Player from '../Player/Player';
import Button from '../Button/Button';
import Image from '../Image/Image';
import constants from '../../../utils/constants';
import PlayerComposer from '../Player/playerComposer';

/**
 * Represents a AppleKnowledgeVideoPopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppleKnowledgeVideoPopup
 */


const AppleKnowledgeLogo = ( { handleReplay, configOtherInfo } ) => {
  const { ref, focusKey } = useFocusable( {
    focusKey: 'APPLE_TRAILOR_LOGO',
    onEnterPress:() => {
      handleReplay()
    }
  } );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='AppleKnowledgeVideoPopup__AppleReplay'
        onMouseUp={ handleReplay }
      >
        <Icon name='AppleReplayIcon'/>
        <p>{ constants.REPLAY }</p>
      </div>
      <div className='AppleKnowledgeVideoPopup__imageThumbnail'>
        <Image
          src={ configOtherInfo?.videoThumbnailImage }
          alt={ 'ThumbnialImg' }
        />
      </div>
    </FocusContext.Provider>
  );

}
export const AppleKnowledgeVideoPopup = function( props ){

  const [isReplay, setisReplay] = useState( false )

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { modalRef, handleCancel, configInfo } = props;

  const hideModal = () => {
    modalRef.current?.close();
  };

  useEffect( () => {
    return () =>{
      hideModal()
    }
  }, [] )

  const endedPlayerInfo = ( ) => {
    setisReplay( true )
  }

  const handleReplay = () => {
    setisReplay( false )
  }

  useEffect( () => {
    setFocus( 'INITIAL_RENDER_FOCUS' )
  }, [] )

  useEffect( ()=>{
    if( isReplay ){
      setFocus( 'APPLE_TRAILOR_LOGO' )
    }
  }, [isReplay] )

  return (
    <div className='AppleKnowledgeVideoPopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='AppleKnowledgeVideoPopupModalId'
            customClassName={ 'AppleKnowledgeVideoPopupModal' }
            ref={ modalRef }
            closeModalFn={ handleCancel }
          >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='AppleKnowledgeVideoPopup__back'>
                <Button
                  onClick={ handleCancel }
                  iconLeftImage={ 'Path' }
                  iconLeft={ true }
                  secondary={ true }
                  size='medium'
                  label={ constants.GOBACK }
                />
              </div>
            </FocusContext.Provider>
            <div className='AppleKnowledgeVideoPopup__layout'>
              <div className='AppleKnowledgeVideoPopup__header'>
                <Text textStyle='appleTv-header'
                  textAlign='center'
                >
                  { configInfo?.header }
                </Text>

              </div>
              <div className='AppleKnowledgeVideoPopup__videoWrapper' >
                {
                  !isReplay && (
                    <div className='AppleKnowledgeVideoPopup__video'>
                      { /* TODO : This flow is completely removed in the new implementation, will do cleanup once flow is done  */ }
                      <PlayerComposer
                        autoPlayTrailor={ false }
                        isPiKnowledgeVideo
                        endedPlayerInfo={ endedPlayerInfo }
                        srcBanner={ configInfo?.others?.videoUrl }
                        srcPoster={ configInfo?.others?.videoThumbnailImage }
                      /></div>
                  )
                }
                {
                  isReplay && (
                    <AppleKnowledgeLogo
                      handleReplay={ handleReplay }
                      configOtherInfo={ configInfo?.others }
                    />
                  )
                }
                <div style={ { opacity: 0 } }>
                  <Button
                    label={ 'No' }
                    secondary
                    size='medium'
                    focusKeyRefrence={ `INITIAL_RENDER_FOCUS` }
                  />
                </div>

              </div>
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>

  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} modalRef - Sets the ref for modal
 * @property {object} opener - Sets the ref for opener
 */
export const propTypes =  {
  modalRef: PropTypes.object,
  opener: PropTypes.object
};


AppleKnowledgeVideoPopup.propTypes = propTypes;

export default AppleKnowledgeVideoPopup;
