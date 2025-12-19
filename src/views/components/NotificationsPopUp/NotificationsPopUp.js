/**
 * This component is used to show various notification popup messages. This consists of message and done button.
 *
 * @module views/components/NotificationsPopUp
 * @memberof -Common
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './NotificationsPopUp.scss';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import parse from 'html-react-parser';
import Loader from '../Loader/Loader';
/**
 * Represents a NotificationsPopUp component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns NotificationsPopUp
 */
export const NotificationsPopUp = function( props ){
  const previousPathName = useNavigationContext()
  const timerRef = useRef();
  const { iconName, message, info, additionalInfo, buttonLabel, backIcon, backButton, showModalPopup, flexiPlanHeaderMessage, flexiPlanSubHeaderMessage, focusShouldRetain, customClassName, showLoader, secondaryTitle } = props;
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true,
    focusBoundaryDirections:['down', 'left', 'right', 'up']
  } );

  useEffect( () => {
    props.opener && setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
      setFocus( 'DONE_BUTTON' )
    }, focusShouldRetain || 200 );
  }, [props.opener] )

  useEffect( () => {
    showModalPopup && setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
      setFocus( 'DONE_BUTTON' )
    }, focusShouldRetain || 200 );

    if( ( window.location.pathname.includes( '/plan/change-tenure/' ) || window.location.pathname.includes( '/plan/purchase/' ) ) && showModalPopup ){
      timerRef.current = setInterval( () => {
        previousPathName.previousMediaCardFocusBeforeSplash = `DONE_BUTTON`
        setFocus( 'DONE_BUTTON' )
      }, 2000 );
    }
  }, [showModalPopup] )

  const hideModal = () => {
    props.modalRef?.current?.close();
  };

  useEffect( () => {
    return () => {
      clearTimeout( timerRef.current );
      hideModal()
    }
  }, [] )

  return (
    <div className='NotificationsPopUp'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='NotificationsPopUpModalId'
            customClassName={ customClassName ? customClassName : 'NotificationsPopUpModal' }
            ref={ props.modalRef }
            opener={ props.opener }
            closeModalFn={ props.handleCancel }
            // callBackFunc={ props.handleCancel && props.handleCancel }
            showConfetti={ props.showConfetti }
            onConfettiComplete={ props.onConfettiComplete }
          >
            <div className='NotificationsPopUp__content'>
              { iconName &&
                <Icon className='NotificationsPopUp__icon'
                  name={ iconName }
                />
              }
              { flexiPlanHeaderMessage &&
                <Text
                  textStyle='appleTv-header'
                  color='white'
                  textAlign='center'
                >
                  { flexiPlanHeaderMessage }
                </Text>
              }
              { flexiPlanSubHeaderMessage &&
                <Text
                  textStyle='appleTv-content'
                  color='white'
                  textAlign='center'
                >
                  { flexiPlanSubHeaderMessage }
                </Text>
              }
              { message &&
                <Text
                  textStyle='title-3'
                  color='white'
                  textAlign='center'
                >
                  { message }
                </Text> }

              { info &&
                <Text
                  textStyle='body-3'
                  color='white'
                  textAlign='center'
                >
                  { parse( info ) }
                </Text> }

              { additionalInfo &&
                <Text
                  textStyle='body-5'
                  color='white'
                  textAlign='center'
                >
                  { additionalInfo }
                </Text> }
              { secondaryTitle &&
                <Text
                  textStyle='body-5'
                  color='white'
                  textAlign='center'
                >
                  { secondaryTitle }
                </Text>
              }

              { buttonLabel &&
                <div className='NotificationsPopUp__button'>
                  <Button
                    label={ buttonLabel }
                    onClick={ props.buttonClicked }
                    focusKeyRefrence={ 'DONE_BUTTON' }

                  />
                </div> }

              { backButton && backIcon &&
                <FocusContext.Provider focusable={ false }
                  value=''
                >
                  <div className='NotificationsPopUp__goBack'>
                    <Button
                      onClick={
                        props.handleCancel
                      }
                      iconLeftImage={ backIcon }
                      iconLeft={ true }
                      secondary={ true }
                      size='medium'
                      label={ backButton }
                    />
                  </div>
                </FocusContext.Provider>
              }
            </div>
            {
              showLoader && (
                <Loader />
              )
            }
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
 * @property {string} iconName - Sets the icon for the popup
 * @property {string} message - Sets the message for the popup
 * @property {string} info - Sets the info for the popup
 * @property {string} additionalInfo - Sets the additionalInfo for the popup
 * @property {string} buttonLabel - Sets the button label for the popup
 * @property {string} backButton - Sets the back button label for the popup
 * @property {string} backIcon - Sets the back icon for the popup
 */
export const propTypes = {
  iconName: PropTypes.string,
  message: PropTypes.string,
  info: PropTypes.string,
  additionalInfo: PropTypes.string,
  buttonLabel: PropTypes.string,
  backButton: PropTypes.string,
  backIcon: PropTypes.string
};

NotificationsPopUp.propTypes = propTypes;

export default NotificationsPopUp;
