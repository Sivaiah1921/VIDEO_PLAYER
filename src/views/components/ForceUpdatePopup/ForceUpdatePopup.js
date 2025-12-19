/**
 * This component is related to force update of app
 *
 * @module views/components/ForceUpdatePopup
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import './ForceUpdatePopup.scss';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
 * Represents a ForceUpdatePopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ForceUpdatePopup
 */
export const ForceUpdatePopup = function( props ){
  const [defaultFocus, setDefaultFocus] = useState( false )
  const previousPathName = useNavigationContext()
  const { header, info, buttonLabel, showModalPopup, buttonLabel2 } = props;
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );

  useEffect( () => {
    props.opener && setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
      setFocus( 'DONE_BUTTON' )
    }, props.focusShouldRetain || 200 );
  }, [props.opener] )

  useEffect( () => {
    showModalPopup && setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
      setFocus( 'DONE_BUTTON' )
    }, props.focusShouldRetain || 200 );
  }, [showModalPopup] )

  const hideModal = () => {
    props.modalRef?.current?.close();
  };

  useEffect( () => {
    return () =>{
      hideModal()
    }
  }, [] )

  return (
    <div className='ForceUpdatePopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='ForceUpdatePopupModalId'
            customClassName='ForceUpdatePopupModal'
            ref={ props.modalRef }
            opener={ props.opener }
            closeModalFn={ props.handleCancel }
          >
            <div className='ForceUpdatePopup__content'>
              { header &&
              <Text
                textStyle='title-3'
                color='white'
                textAlign='center'
              >
                { header }
              </Text> }

              { info &&
              <Text
                textStyle='body-3'
                color='white'
                textAlign='center'
              >
                { info }
              </Text> }
              <div className='ForceUpdatePopup__button'>
                { buttonLabel &&
                <div className='ForceUpdatePopup__button--btn1'>
                  <Button
                    label={ buttonLabel }
                    onClick={ props.buttonClicked1 }
                    focusKeyRefrence={ 'DONE_BUTTON' }
                    secondary={ defaultFocus }
                    onFocus={ ()=> setDefaultFocus( false ) }
                  />
                </div> }
                { buttonLabel2 &&
                <div>
                  <Button
                    label={ buttonLabel2 }
                    onClick={ props.buttonClicked2 }
                    focusKeyRefrence={ !buttonLabel ? 'DONE_BUTTON' : 'UPDATE_BUTTON' }
                    { ...( buttonLabel && {
                      secondary: !defaultFocus,
                      onFocus: ()=> setDefaultFocus( true )
                    } ) }
                  />
                </div> }
              </div>
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>
  )
}

export default ForceUpdatePopup;
