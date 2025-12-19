/* eslint-disable no-console */
/**
 * This component will allow user to rename the device
 *
 * @module views/components/RenameDevice
 * @memberof -Common
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RenameDevice.scss';
import AlphanumericKeyboard from '../AlphanumericKeyboard/AlphanumericKeyboard';
import Text from '../Text/Text';
import Button from '../../components/Button/Button';
import InputField from '../InputField/InputField';
import { useHistory, useLocation } from 'react-router-dom';
import { DeviceManagementService } from '../../../utils/slayer/DeviceManagementService';
import { constants, ALPHANUMERICKEYBOARD } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { device_rename_success } from '../../../utils/mixpanel/mixpanelService';
import Notifications from '../Notifications/Notifications';
import classNames from 'classnames';
import { setCodeResponse } from '../../../utils/localStorageHelper';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { modalDom } from '../../../utils/util';
/**
 * Represents a RenameDevice component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns RenameDevice
 */
export const RenameDevice = function( props ){
  const { numberPressed, setNumberPressed } = useHomeContext()
  const previousPathName = useNavigationContext();
  const { alphanumericKeyboardProp, title, sectionInfo, btnLabel, inputValue } = props;
  const location = useLocation();
  const history = useHistory();
  const { deviceName, baId, subscriberId, deviceNumber } = location.args || '';
  const [value, setValue] = useState( deviceName );
  const [removeDevice, renameDevice] = DeviceManagementService();
  const { renameDevFetchData, renameDevResponse, renameDevError, renameDevLoading } = renameDevice;
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );
  const [notification, setNotification] = useState( false )
  const [notificationLimitedChar, setNotificationLimitedChar] = useState( false )

  useEffect( () => {
    if( !modalDom() ){
      focusSelf();
    }
  }, [focusSelf] );

  useEffect( () => {
    return () => {
      setNumberPressed( {} )
    }
  }, [] );

  useEffect( ()=>{
    var elem = document.getElementById( 'renameInput' );
    if( elem ){
      elem.scrollLeft = elem.scrollWidth;
    }
  }, [value] )

  const changeState = ( o, data ) => {
    if( ( o + data ).length <= 100 ){
      return o + data
    }
    else {
      setNotification( true )
      setTimeout( () => {
        setNotification( false )
      }, 3000 )
      return o
    }
  }

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setValue( o => changeState( o, numberPressed.keyValue ) )
    }
  }, [numberPressed] )

  const handleKeyboardChange = ( newValue ) => {
    if( ( value + newValue )?.length <= 100 ){
      setValue( value + newValue );
    }
    else {
      setNotificationLimitedChar( true )
      setTimeout( () => {
        setNotificationLimitedChar( false )
      }, 3000 );
    }
  }
  const onClear = ( e ) => {
    setValue( '' );
  }
  const onRemove = ( e ) => {
    setValue( value?.slice( 0, -1 ) )
  }
  const onSpace = ( e ) => {
    const newValue = value + ' ';
    if( newValue?.length <= 100 ){
      setValue( newValue );
    }
    else {
      setNotificationLimitedChar( true )
      setTimeout( () => {
        setNotificationLimitedChar( false )
      }, 3000 );
    }
  }

  const renameDeviceHandler = () => {
    if( !value ){
      setNotification( true )
      setTimeout( () => {
        setNotification( false )
      }, 3000 );
    }
    value && renameDevFetchData( { value, baId, subscriberId, deviceNumber } );
  }

  useEffect( () => {
    if( renameDevResponse?.code === 0 ){
      setCodeResponse( JSON.stringify( renameDevResponse ) )
      /* Mixpanel-event */
      device_rename_success()
      history.goBack();
    }
  }, [renameDevResponse] );

  return (
    <div className='RenameDevice'>
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='RenameDevice__header'>
          <Button
            onClick={ ()=> history.goBack() }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.CLOSE }
          />
          <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey }>
        <div className='RenameDevice__content'>
          <div className='RenameDevice__keyboard'>
            <AlphanumericKeyboard
              keys={ ALPHANUMERICKEYBOARD.KEYBOARD_WITHOUT_SPECIAL_KEYS }
              onChange={ ( e ) => handleKeyboardChange( e ) }
              deleteBtnLabel={ constants.DELETEBTN_LABEL }
              spaceBtnLabel={ constants.SPACEBTN_LABEL }
              clearBtnLabel={ constants.CLEARBTN_LABEL }
              onClear={ ( e ) => onClear( e ) }
              onRemove={ ( e ) => onRemove( e ) }
              onSpace={ ( e ) => onSpace( e ) }
            />
          </div>
          <div className='RenameDevice__inputSection'>
            <div className='RenameDevice__inputSection--title'>
              <Text
                textAlign='left'
                textStyle='title-2'
                color='white'
                htmlTag='span'
              >
                { constants.RENAME_DEVICE.TITLE }
              </Text>
            </div>
            <div className='RenameDevice__inputSection--sectionInfo'>
              <Text
                textAlign='left'
                textStyle='autoPlay-subtitle'
                htmlTag='span'
              >
                { constants.RENAME_DEVICE.SECTION_INFO }
              </Text>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <input
                  disabled
                  id='renameInput'
                  type='text'
                  value={ value }
                  placeholder='Enter your device ID'
                  className={ classNames( 'RenameDevice__renameContent', {
                    'RenameDevice__renameContent--placeholder': !value } ) }
                />
              </FocusContext.Provider>
            </div>
            <div
              className='RenameDevice__inputSection--updateBtn'
            >
              <Button
                onFocus={ ()=>{
                  previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_UPDATE'
                } }
                label={ constants.UPDATE_BUTTON_LABEL }
                onClick={ renameDeviceHandler }
                focusKeyRefrence='BUTTON_UPDATE'
              />
            </div>
          </div>
        </div>
      </FocusContext.Provider>
      { ( notification || notificationLimitedChar ) &&
        <div className='RenameDevice__notification'>
          <Notifications
            message={ notificationLimitedChar ? constants.MY_ACCOUNT.CHARACTER_100_LIMIT : constants.MY_ACCOUNT.EMPTY_RENAME }
          />
        </div>
      }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} alphanumericKeyboardProp -  Object which provides all alphanumeric keyboard info
 * @property {string} title - Section title
 * @property {string} sectionInfo - Section info
 * @property {string} btnLabel - Button label
 * @property {string} inputValue - Input value
 */
export const propTypes = {
  alphanumericKeyboardProp: PropTypes.shape( {
    keys : PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    onRemove: PropTypes.func,
    onSpace:PropTypes.func,
    clearBtnLabel: PropTypes.string.isRequired,
    deleteBtnLabel: PropTypes.string.isRequired,
    spaceBtnLabel:PropTypes.string.isRequired
  } ).isRequired,
  title: PropTypes.string.isRequired,
  sectionInfo :PropTypes.string.isRequired,
  btnLabel: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired
};

RenameDevice.propTypes = propTypes;
export default RenameDevice;
