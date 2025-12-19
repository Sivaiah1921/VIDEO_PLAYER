/**
 * Component for displaying detailed info about the content i.e Detailed AutoPlayTrailer ON/OFF
 *
 * @module views/components/
 * @memberof -Common
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './AutoPlayTrailer.scss';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import { useAxios } from '../../../utils/slayer/useAxios';
import serviceConst from '../../../utils/slayer/serviceConst';
import { useFocusable, FocusContext, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { getDthStatus, getAuthToken, getSubscriberId, getProfileId, getBaID, getAnonymousId, getDeviceToken } from '../../../utils/localStorageHelper';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { COMMON_HEADERS, isTizen, SUBMENU_MIXPANEL } from '../../../utils/constants.js';
import Loader from '../Loader/Loader';
const { AUTOPLAY_TITLE, AUTOPLAY_MSG, DONE_BTN, DONE_MSG, AUTOPLAY_ERROR_MSG } = require( '../../../utils/constants' ).default;
import Notifications from '../Notifications/Notifications';
import classNames from 'classnames';
import { player_auto_play_trailor, subMenuOptionClicked } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { showToastMsg } from '../../../utils/util.js';

/**
   * Represents a AutoPlayTrailer component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns AutoPlayTrailer
   */
export const AutoPlayTrailer = function( props ){
  const previousPathName = useNavigationContext()
  const { iconName, name } = props;
  const { profileAPIResult = {}, setProfileAPIResult } = useProfileContext();
  const [notificationMsg, setNotificationMsg] = useState();
  let autoPlayVal = true;
  const [showNotification, setShowNotification] = useState( false );
  const [buttonFocus, setButtonFocus] = useState( false )
  if( profileAPIResult && profileAPIResult.data?.autoPlayTrailer === false ){
    autoPlayVal = false;
  }

  const [checked, setChecked] = useState( autoPlayVal );
  const history = useHistory()
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true,
    trackChildren:true
  } );
  const [loading, setLoading] = useState( false );

  const keyBlock = useRef( false );
  const autoPlayvalueUpdated = useRef( false )


  const autoPlayParams = {
    url: serviceConst.AUTO_TRAILER_TOGGLE,
    method: 'GET',
    headers: {
      dthStatus: getDthStatus(),
      authorization: getAuthToken(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      subscriberId: getSubscriberId(),
      profileId: getProfileId(),
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      deviceName: COMMON_HEADERS.DEVICE_NAME,
      anonymousId: getAnonymousId(),
      platform: COMMON_HEADERS.PLATFORM,
      deviceToken: getDeviceToken()
    },
    params: {
      baId: getBaID(),
      type: 'AUTO_PLAY_TRAILER',
      sid: getSubscriberId()
    }
  };
  const { fetchData, response, error } = useAxios( autoPlayParams, true );


  useEffect( () => {
    if( response ){
      setFocus( 'BUTTON_PRIMARY_1' )
      setLoading( false );
      const val = response.data?.message?.split( ':' )[1].trim() !== 'true';
      !val ? subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_AUTOPLAYTRAILER_ON ) : subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_AUTOPLAYTRAILER_OFF )
      setChecked( !val )
      showToastMsg( setShowNotification, setNotificationMsg, DONE_MSG );
      keyBlock.current = false
      autoPlayvalueUpdated.current = true
    }
  }, [response] );

  useEffect( () => {
    console.log( 'error= ', error); //eslint-disable-line
    if( error ){
      setFocus( 'BUTTON_PRIMARY' )
      setLoading( false );
      showToastMsg( setShowNotification, setNotificationMsg, AUTOPLAY_ERROR_MSG );
    }
  }, [error] )

  const onChangeHandler = () => {
    if( getCurrentFocusKey() === 'BUTTON_PRIMARY' ){
      closeModal()
      return;
    }
    if( !keyBlock.current ){
      keyBlock.current = true;
      fetchData( autoPlayParams );
      setLoading( true );
    }
  };

  useEffect( ()=>{
    setFocus( 'BUTTON_PRIMARY_1' )
  }, [] )

  const closeModal = ()=> {
    if( autoPlayvalueUpdated.current ){
      setProfileAPIResult( {
        data: 'AutoplayTrailerCall'
      } );
    }
    props.handleCancel()
  }

  const onKeyPress = useCallback( ( e ) => {
    if( e.keyCode === 13 ){
      e.preventDefault();
    }
  } );

  const onKeyRelease = useCallback( ( e ) => {
    keyBlock.current = false;
  } );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    window.addEventListener( 'keyup', onKeyRelease )

    /* MixPanel-Events */
    player_auto_play_trailor( autoPlayVal )

    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
      window.removeEventListener( 'keyup', onKeyRelease );
    }
  }, [] );

  return (
    <div className='AutoPlayTrailer'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='AutoPlayTrailerModalId'
            customClassName='AutoPlayTrailerModal'
            ref={ props.modalRef }
            opener={ props.opener }
            closeModalFn={ closeModal }
          >
            <div className={
              classNames( 'AutoPlayTrailer__content',
                { 'AutoPlayTrailer__contentTV': isTizen || window.webOS } )
            }
            >
              <Icon
                name={ iconName }
                className='AccountCard__icon'
              />
              <div className='AutoPlayTrailer__title'>
                <Text
                  textAlign='left'
                  textStyle='autoPlay-title'
                >
                  { AUTOPLAY_TITLE }
                </Text>
              </div>
              <div className='AutoPlayTrailer__checkBox'>
                <Text
                  textStyle='autoPlay-subtitle'
                >
                  { AUTOPLAY_MSG }
                </Text>
                <Checkbox onChange={ onChangeHandler }
                  id={ 'switcher' }
                  name={ name }
                  checked={ !checked }
                  toggleButton={ true }
                  secondary
                  focusKeyRefrence={ 'BUTTON_PRIMARY_1' }
                  onFocus={ ()=> {
                    previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PRIMARY_1'
                    setButtonFocus( false )
                  } }
                  buttonFocus={ buttonFocus }
                />
              </div>
              <div className='AutoPlayTrailer__button'>
                <Button
                  label={ DONE_BTN }
                  primary
                  onClick={ closeModal }
                  onFocus={ ()=> {
                    setButtonFocus( true )
                    previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PRIMARY'
                  } }
                  focusKeyRefrence={ 'BUTTON_PRIMARY' }
                />
              </div>
            </div>
            { loading &&
              <Loader />
            }
            <div className='AutoPlayTrailerModal__notifications'>
              {
                showNotification && (
                  <Notifications
                    iconName='Success'
                    message={ notificationMsg }
                  />
                )
              }
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
   * @property {string} iconName - set the autoPlayTrailer Icon
   */

export const propTypes =  {
  iconName:  PropTypes.string
};

AutoPlayTrailer.propTypes = propTypes;

export default AutoPlayTrailer;