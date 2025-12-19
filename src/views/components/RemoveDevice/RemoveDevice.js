/**
 * Component for displaying detailed info about the content i.e Detailed RemoveDevice
 *
 * @module views/components/
 * @memberof -Common
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './RemoveDevice.scss';
import Button from '../Button/Button';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
   * Represents a RemoveDevice component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns RemoveDevice
   */
export const RemoveDevice = function( props ){
  const { content, iconName, buttonLabel, backButton } = props;
  const [removeDevice, setRemoveDevice] = useState( false )
  const previousPathName = useNavigationContext()

  const onRemoveDevice = ()=>{
    setRemoveDevice( true )
  }
  return (
    <div className='RemoveDevice'>
      <Modal
        id='RemoveDeviceModalId'
        customClassName='RemoveDeviceModal'
        ref={ props.modalRef }
        opener={ props.opener }
      >
        <div className='RemoveDevice__content'>
          <Icon
            name={ iconName }
            className='AccountCard__icon'
          />
          <div className='RemoveDevice__title'>
            <Text
              textStyle='autoPlay-title'
            >
              { content }
            </Text>
          </div>
          <div className='RemoveDevice__button'>
            <Button
              onFocus={ ()=>{
                previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_REMOVE_DEVICE'
              } }
              onClick={ onRemoveDevice }
              label={ buttonLabel }
              size='large'
              focusKeyRefrence='BUTTON_REMOVE_DEVICE'
            />
          </div>
          <div className='RemoveDevice__goBack'>
            <Button
              iconLeftImage='GoBack'
              iconLeft={ true }
              secondary={ true }
              size='small'
              label={ backButton }
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} content - set the RemoveDevice content
   * @property {string} iconName - set the RemoveDevice Phone Icon
   * @property {string} buttonLabel - set the RemoveDevice buttonLabel
   * @property {string} backButton - set the RemoveDevice close text
   */

export const propTypes =  {
  content: PropTypes.string,
  iconName:  PropTypes.string,
  buttonLabel: PropTypes.string,
  backButton: PropTypes.string
};

RemoveDevice.propTypes = propTypes;

export default RemoveDevice;
