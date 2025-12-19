/* eslint-disable no-console */
/**
 * This component is used to show the Apple DeepLink and Active now scenario's
 *
 * @module views/components/ApplePopup
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ApplePopup.scss';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import constants from '../../../utils/constants';

/**
 * Represents a ApplePopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ApplePopup
 */
export const ApplePopup = function( props ){
  const { openActiveModalRef, isActivatedAppleButtonClicked } = useMaintainPageState() || null

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { modalRef, handleCancel, callBackToActiveModal, callBackForDeepLinkModal, configInfo } = props;

  const hideModal = () => {
    modalRef.current?.close();
  };


  useEffect( () => {
    if( openActiveModalRef.current ){
      setTimeout( ()=> setFocus( 'SECODARY_BUTTON' ), 100 )
      openActiveModalRef.current = false
    }
    else {
      setTimeout( ()=> setFocus( 'PRIMARY_BUTTON' ), 100 )
    }
    return () =>{
      hideModal()
    }
  }, [] )

  return (
    <div className='ApplePopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='ApplePopupModalId'
            customClassName={ 'ApplePopupModal' }
            ref={ modalRef }
            // opener={ opener }
            handleCancel={ handleCancel }
            closeModalFn={ handleCancel }
            callBackFunc={ handleCancel }
          >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='ApplePopup__back'>
                <Button
                  onClick={
                    props.handleCancel
                  }
                  iconLeftImage={ 'Path' }
                  iconLeft={ true }
                  secondary={ true }
                  size='medium'
                  label={ 'Go Back' }
                />
              </div>
            </FocusContext.Provider>
            <div className='ApplePopup__layout'>
              <div className='ApplePopup__header'>
                <Icon name='AppleTv'/>
                <Text textStyle='appleTv-header'
                  textAlign='center'
                >
                  { configInfo?.header }
                </Text>

              </div>
              <div className='ApplePopup__content1'>
                <Text textStyle='appleTv-content'
                  textAlign='center'
                >
                  { configInfo?.subHeader }
                </Text>

              </div>
              <div className='ApplePopup__contentNote'>
                <Text textStyle='appleTv-content'>
                  { constants.NOTE_TEXT }
                </Text>
                <div className='ApplePopup__contentNoteDetails' >
                  <div className='ApplePopup__contentNote1'>
                    <Text textStyle='appleTv-content'>
                      { `${ constants.FIRST_POINT } ${ configInfo && configInfo.others?.apple_step1_message }` }
                    </Text>
                  </div>
                  <div className='ApplePopup__contentNote2'>
                    <Text textStyle='appleTv-content'>
                      { `${ constants.SECOND_POINT } ${ configInfo && configInfo.others?.apple_step2_message }` }
                    </Text>
                  </div>
                </div>
              </div>
              <>
                <div className='ApplePopup__linkButton'>
                  <Button
                    label={ configInfo && configInfo.others?.buttonHeader }
                    onClick={ () => {
                      callBackForDeepLinkModal()
                      isActivatedAppleButtonClicked.current = true
                    } }
                    size='medium'
                    focusKeyRefrence={ 'PRIMARY_BUTTON' }
                  />
                </div>
                <div className='ApplePopup__linkButton'>
                  <Button
                    label={ configInfo && configInfo.others?.buttonHeaderSecond }
                    onClick={ () =>{
                      openActiveModalRef.current = true
                      callBackToActiveModal()
                    } }
                    size='medium'
                    focusKeyRefrence={ 'SECODARY_BUTTON' }
                  />
                </div>
              </>
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

ApplePopup.propTypes = propTypes;

export default ApplePopup;
