/**
 * Edit Profile Page
 *
 * @module views/components/EditProfile
 * @memberof -Common
 */
import React, { useState, useEffect } from 'react';
import AlphanumericKeyboard from '../AlphanumericKeyboard/AlphanumericKeyboard';
import Button from '../../components/Button/Button';
import Link from '../Link/Link';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import EditProfileService from '../../../utils/slayer/EditProfileService';
import { useHistory, useLocation } from 'react-router-dom';
import { constants, ALPHANUMERICKEYBOARD } from '../../../utils/constants';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import './EditProfile.scss';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import classNames from 'classnames';
import Notifications from '../Notifications/Notifications';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { edit_email, edit_profile, loginEmail } from '../../../utils/mixpanel/mixpanelService';
import { setCodeResponse } from '../../../utils/localStorageHelper';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { modalDom } from '../../../utils/util';

/**
 * Represents a EditProfile component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns EditProfile
 */
export const EditProfile = function( props ){
  const { numberPressed, setNumberPressed } = useHomeContext()
  const [message, setMessage] = useState( '' )
  const [notification, setNotification] = useState( false )
  const { profileAPIResult, setProfileAPIResult } = useProfileContext()
  const history = useHistory();
  const location = useLocation();
  const { profileName, profileMobileNumber, email: userEmail, profileNameDisplay } = location.args || '';
  const [email, setEmail] = useState( userEmail );
  const [editProfileData] = EditProfileService();
  const { genEditProfileFetchData } = editProfileData;
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    isFocusBoundary: true
  } );
  const previousPathName = useNavigationContext();

  const changeState = ( o, data ) => {
    if( ( o + data ).length <= 250 ){
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
      setEmail( o => changeState( o, numberPressed.keyValue ) )
    }
  }, [numberPressed] )

  useEffect( ()=>{
    var elem = document.getElementById( 'emailInput' );
    if( elem ){
      elem.scrollLeft = elem.scrollWidth;
    }
  }, [email] )

  useEffect( () => {
    if( !modalDom() ){
      focusSelf();
    }
  }, [focusSelf] );

  const validateEmail = ( email ) =>{
    var re = /\S+@\S+\.\S+/;
    return re.test( email );
  }

  const clickEventHandler = () => {
    email === userEmail ? history.goBack() : genEditProfileFetchData( { email, fullName: profileName } );
  }

  const emailMixPanel = ( change ) => {
    /* MixPanel-Event */
    edit_email( change )
    loginEmail()
  }

  useEffect( () => {
    if( editProfileData?.genEditProfileResponse?.code === 0 ){
      setProfileAPIResult( {
        data: 'EditEmailCall'
      } )
      emailMixPanel( 'Y' )
      previousPathName.pageName = ''
      setCodeResponse( JSON.stringify( editProfileData?.genEditProfileResponse ) )
      history.goBack()
    }
    else if( editProfileData?.genEditProfileResponse?.code !== 0 && editProfileData?.genEditProfileResponse?.message ){
      editProfileData.genEditProfileResponse.message === 'INVALID_EMAIL_ID' ? setMessage( constants.MY_ACCOUNT.VALID_EMAIL_ID ) : setMessage( editProfileData.genEditProfileResponse.message )
    }
  }, [editProfileData?.genEditProfileResponse] );

  useEffect( ()=>{
    previousPathName.pageName = constants.MY_ACCOUNT.EDIT_PROFILE
    /* MixPanel-Event */
    edit_profile()
    return () => {
      setNumberPressed( {} )
    }
  }, [] )

  const onKeyboardPress = ( newValue ) => {
    if( ( !email || email?.length ) ){
      setMessage( '' )
      if( ( email + newValue )?.length <= 250 ){
        setEmail( email + newValue );
      }
      else {
        setNotification( true )
        setTimeout( () => {
          setNotification( false )
        }, 3000 );
      }
    }
  }

  const removeEmailValue = () => {
    setEmail( email?.slice( 0, -1 ) );
    setMessage( '' )
  }

  const onClear = () => {
    setEmail( '' );
    setMessage( '' )
  }

  const onSpace = () => {
    setMessage( '' )
    if( email && email.length <= 250 ){
      setEmail( email + ' ' );
    }
    else {
      setEmail( email + ' ' );
    }
  }

  return (
    <div className='EditProfile'>
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='EditProfile__header'>
          <Button
            onClick={ ()=> history.goBack() }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.GOBACK }
          />
          <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey }>
        <div className='EditProfile__content'>
          <div className='EditProfile__contentLeft'>
            <AlphanumericKeyboard
              keys={ ALPHANUMERICKEYBOARD.KEYBOARD_WITH_SPECIAL_KEYS }
              deleteBtnLabel={ constants.DELETEBTN_LABEL }
              spaceBtnLabel={ constants.SPACEBTN_LABEL }
              clearBtnLabel={ constants.CLEARBTN_LABEL }
              onClear={ onClear }
              onChange={ onKeyboardPress }
              onRemove={ removeEmailValue }
              onSpace={ onSpace }
            />
          </div>
          <div className='EditProfile__contentRight'>
            <Link
              secondary={ true }
              className='EditProfile__title'
            >
              <Icon className='EditProfile__titleIcon'
                name={ constants.EDIT_PROFILE_DETAILS.ICON_IMAGE }
              />
              <Text
                textStyle='title-2'
                color='white'
              >
                { constants.EDIT_PROFILE_DETAILS.EDIT_PROFILE_TITLE }
              </Text>
            </Link>
            <div className='EditProfile__name'>
              <Text
                textStyle='edit-profile-heading'
                color='bingeBlue-50'
              >
                { constants.EDIT_PROFILE_DETAILS.EDIT_PROFILE_NAME }
              </Text>
              { profileNameDisplay &&
              <Text
                textStyle='title-4'
                color='white'
              >
                { profileNameDisplay }
              </Text> }
            </div>
            <div className='EditProfile__registeredMobile'>
              <Text
                textStyle='edit-profile-heading'
                color='bingeBlue-50'
              >
                { constants.EDIT_PROFILE_DETAILS.REGISTERED_MOBILE_LABEL }
              </Text>
              { profileMobileNumber &&
              <Text
                textStyle='title-4'
                color='white'
              >
                { constants.EDIT_PROFILE_DETAILS.MOBILE_PREFIX_NUMBER + ' ' + profileMobileNumber }
              </Text> }
            </div>
            <div className='EditProfile__email'>
              <Text
                textStyle='edit-profile-heading'
                color='bingeBlue-50'
              >
                { constants.EDIT_PROFILE_DETAILS.EMAIL_LABEL }
              </Text>
              <input
                disabled
                id='emailInput'
                type='text'
                name='email'
                value={ email }
                placeholder='Enter your email ID'
                className={ classNames( 'EditProfile__emailContent', {
                  'EditProfile__emailContent--placeholder': !email } ) }
              />
              {
                message && (
                  <div className='EditProfile__emailContent--errorMessage'>
                    <Text
                      textStyle='edit-profile-heading'
                      color='bingeBlue-50'
                    >
                      { message }
                    </Text>
                  </div>
                )
              }
            </div>
            <div
              className='EditProfile__btnUpdate'
              ref={ ref }
            >
              { !validateEmail( email ) ? (
                <FocusContext.Provider value=''
                  focusable={ false }
                >
                  <Button
                    primary={ true }
                    label={ constants.EDIT_PROFILE_DETAILS.UPDATE_BUTTON_LABEL }
                    disabled={ false }
                    size='medium'
                    { ...validateEmail( email ) && {
                      onClick: clickEventHandler
                    } }
                    notFossabeButton={ true }
                  />
                </FocusContext.Provider>
              ) : (
                <Button
                  primary={ true }
                  label={ constants.EDIT_PROFILE_DETAILS.UPDATE_BUTTON_LABEL }
                  disabled={ false }
                  size='medium'
                  { ...validateEmail( email ) && {
                    onClick: clickEventHandler
                  } }
                  focusKeyRefrence='BUTTON_PROCEED'
                  onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PROCEED' }
                />
              ) }
            </div>
          </div>
        </div>
      </FocusContext.Provider>
      { notification &&
        <div className='BingeListPage__notification'>
          <Notifications
            message={ constants.MY_ACCOUNT.CHARACTER_LIMIT }
          />
        </div>
      }
    </div>
  )
}

export default EditProfile;
