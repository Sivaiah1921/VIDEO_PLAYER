/**
 * This component is related to Fancode Deeplink Popup
 *
 * @module views/components/FancodeDeeplinkPopup
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Button from '../Button/Button';
import './FancodeDeeplinkPopup.scss'
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import constants from '../../../utils/constants';
import Image from '../Image/Image';
import { getProviderLogo } from '../../../utils/util';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import get from 'lodash/get';

/**
 * Represents a FancodeDeeplinkPopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns FancodeDeeplinkPopup
 */
export const FancodeDeeplinkPopup = function( props ){

  const previousPathName = useNavigationContext();
  const { configResponse, url } = useAppContext();

  const { provider, message, buttonLabel, topGoLeft, handleCancel, opener, focusShouldRetain, modalRef, buttonClicked } = props;

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );

  const { config } = configResponse;
  const providerLogoList = get( config, 'providerLogo' );

  useEffect( () => {
    opener && setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
      setFocus( 'DONE_BUTTON' )
    }, focusShouldRetain || 200 );
  }, [opener] )

  const hideModal = () => {
    modalRef?.current?.close();
  };

  useEffect( () => {
    return () =>{
      hideModal()
    }
  }, [] )

  return (
    <div className='FancodeDeeplinkPopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='FancodeDeeplinkPopupModalId'
            customClassName='FancodeDeeplinkPopupModal'
            ref={ modalRef }
            opener={ opener }
            closeModalFn={ handleCancel }
          >
            <div className='FancodeDeeplinkPopup__content'>
              {
                topGoLeft && (
                  <FocusContext.Provider focusable={ false }
                    value=''
                  >
                    <div className='FancodeDeeplinkPopup__topGoBack'>
                      <Button
                        onClick={ handleCancel }
                        iconLeftImage='GoBack'
                        iconLeft={ true }
                        secondary={ true }
                        size='small'
                        label={ constants.GOBACK }
                      />
                    </div>
                  </FocusContext.Provider>
                )
              }
              { provider &&
              <div className='FancodeDeeplinkPopup__provider'>
                <Image
                  src={ getProviderLogo( providerLogoList, provider, constants.LOGOPROVIDERBBA, url ) }
                  notIntersect={ true }
                />
              </div>
              }
              {
                message && (
                  <div className='FancodeDeeplinkPopup__textContent'>
                    <Text
                      textStyle='title-3'
                      color='white'
                      textAlign='center'
                    >
                      { message }
                    </Text>
                  </div>
                )
              }
              {
                buttonLabel && (
                  <div className='FancodeDeeplinkPopup__button'>
                    <Button
                      label={ buttonLabel }
                      onClick={ buttonClicked }
                      focusKeyRefrence={ 'DONE_BUTTON' }
                    />
                  </div>
                )
              }
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>
  )
}

export default FancodeDeeplinkPopup;
