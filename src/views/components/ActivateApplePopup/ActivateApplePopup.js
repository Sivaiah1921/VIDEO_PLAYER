/* eslint-disable no-console */
/**
 * This component is used to show the QR popup where we can scan the QR for coupen activated
 *
 * @module views/components/ActivateApplePopup
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import './ActivateApplePopup.scss';
import Modal from '../Modal/Modal';
import QRCode from 'react-qr-code';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';

/**
 * Represents a ActivateApplePopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ActivateApplePopup
 */
export const ActivateApplePopup = function( props ){

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { modalRef, handleCancel, appleCodeRedemptionUrl, callBackForKnowledgeModal, configInfo, knowMoreVideoLink } = props;

  useEffect( () => {
    if( knowMoreVideoLink ){
      setTimeout( ()=> setFocus( 'KNOW_MORE_BUTTON' ), 100 )
    }
    else {
      setTimeout( ()=> setFocus( 'NO_BUTTON' ), 100 )
    }
  }, [] )

  const hideModal = () => {
    modalRef.current?.close();
  };

  useEffect( () => {
    return () =>{
      hideModal()
    }
  }, [] )

  return (
    <div className='ActivateApplePopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='ActivateApplePopupModalId'
            customClassName={ 'ActivateApplePopupModal' }
            ref={ modalRef }
            // opener={ opener }
            handleCancel={ handleCancel }
            closeModalFn={ handleCancel }
          >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='ActivateApplePopup__back'>
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
            <div className='ActivateApplePopup__layout'>
              <div className='ActivateApplePopup__header'>
                <Icon name='AppleTv'/>
                <div className='ActivateApplePopup__header--title'>
                  <Text textStyle='appleTv-header'
                    textAlign='center'
                  >
                    { configInfo?.header }
                  </Text>
                </div>
              </div>
              <div className='ActivateApplePopup__contentWrapper'>
                <div className='ActivateApplePopup__leftContent'>
                  { configInfo && configInfo.others?.steps?.map( ( item, index )=>{
                    return (
                      <div className='ActivateApplePopup__flex'
                        key={ index }
                      >
                        <div className='ActivateApplePopup__leftContentHeader'>
                          <Text
                            textStyle=''
                            color='white'
                          >
                            { item.text1 }
                          </Text>
                        </div>
                        <div className='ActivateApplePopup__leftContentBody'>
                          <Text
                            textStyle=''
                            color='white'
                          >
                            { item.text2 }
                          </Text>
                        </div>
                      </div>
                    )
                  } ) }
                  <div className='ActivateApplePopup__leftContentNote' >
                    <Text
                      textStyle=''
                      color='white'
                    >
                      { configInfo && configInfo.others?.note }
                    </Text>
                  </div>
                </div>
                <div className='ActivateApplePopup__contentDiverder'>
                </div>
                <div className='ActivateApplePopup__rightContent'>
                  <Text textStyle='appleTv-content'
                    textAlign='center'
                  >
                    { configInfo && configInfo.others?.message }
                  </Text>
                  { appleCodeRedemptionUrl &&
                  <div className='ActivateApplePopup__QRCode'>
                    <QRCode
                      value={ appleCodeRedemptionUrl }
                      size={ 250 }
                      fgColor={ '#220046' }
                    />
                  </div>
                  }
                  {
                    !!knowMoreVideoLink ? (
                      <div
                        className='ActivateApplePopup__linkToVideo'
                      >
                        <Button
                          label={ configInfo && configInfo.others?.buttonHeader }
                          onClick={ callBackForKnowledgeModal }
                          size='medium'
                          focusKeyRefrence={ 'KNOW_MORE_BUTTON' }
                        />
                      </div>
                    ) : (
                      <div style={ { opacity: 0 } }>
                        <Button
                          label={ 'No' }
                          secondary
                          size='medium'
                          focusKeyRefrence={ 'NO_BUTTON' }
                        />
                      </div>
                    )
                  }

                </div>
              </div>
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>

  )
}

export default ActivateApplePopup;
