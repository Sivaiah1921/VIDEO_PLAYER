/**
 * As an anonymous or authenticated, I should see onboarding login OTP entering apne if received from the back end services.
 *
 * @module views/components/LoginOtpEnteringPane
 * @memberof -Common
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import InputField from '../InputField/InputField';
import Button from '../../components/Button/Button';
import './LoginOtpEnteringPane.scss';
import constants from '../../../utils/constants';
import classNames from 'classnames';
import { lengthOfOtp, useInterval } from '../../../utils/util';
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';

/**
 * Represents a LoginOTPEnteringPane component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LoginOtpEnteringPane
 */

export const LoginOtpEnteringPane = function( props ){
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const enableOtpUnmasking = config?.enableOtpUnmasking
  const [seconds, setSeconds] =  useState( constants.OTP_SECS );
  const previousPathName = useNavigationContext()
  const intervalRef = useInterval( () => {
    if( seconds > 0 ){
      setSeconds( seconds - 1 );
    }
    else {
      props.setResentClicked( false );
      window.clearInterval( intervalRef.current );
    }
  }, props.resentClicked ? 1000 : null );

  useEffect( () => {
    if( props.resentClicked ){
      setSeconds( constants.OTP_SECS )
    }
  }, [props.resentClicked] )

  useEffect( () => {
    if( props.mobileNumber ){
      props.setResentClicked( true );
      setSeconds( constants.OTP_SECS )
    }
  }, [props.mobileNumber] )

  const addAppRestoreListener = () => {
    if( document.hidden ){
      if( seconds > 0 ){
        setSeconds( seconds - 1 );
      }
    }
  }

  useEffect( () => {
    document.addEventListener( 'visibilitychange', addAppRestoreListener() )
    return () => {
      document.removeEventListener( 'visibilitychange', addAppRestoreListener() )
    }
  }, [] );

  return (
    <form className='LoginOtpEnteringPane'>
      <div className='LoginOtpEnteringPane__title'>
        <Text
          color='white'
          textStyle='header-2'
        >
          { props.title }
        </Text>
      </div>
      <div className='LoginOtpEnteringPane__otpMessage'>
        <Text
          color='bingeBlue-25'
          textStyle='subtitle-1'
        >
          { `${ props.enterOtpVerbiage || constants.ENTER_OTP} ${props.mobileNumber}` }
        </Text>
      </div>
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div
          className={ classNames(
            'LoginOtpEnteringPane__otpBox', {
              'LoginOtpEnteringPane__otpBox--error': props.errorMsg
            }
          ) }
        >
          { [...Array( ( lengthOfOtp( config ) ) )].map( ( e, index ) => (
            <React.Fragment key={ index }>
              <InputField
                key={ index }
                maxLength={ 1 }
                tabIndex={ index }
                otpValue={ props.value }
                value={ props.value && ( props.value[index] ? props.value[index] : props.value[index] === 0 ? 0 : '' ) }
                defaultValue={ props.value && props.value[index] }
                type={ enableOtpUnmasking ? 'text' : 'password' }
                errorMsg={ props.errorMsg }
                pointerNavigation={ true }
              />
            </React.Fragment>
          ) ) }
        </div>
      </FocusContext.Provider>
      <div className='LoginOtpEnteringPane__resendsection'>
        <div className='LoginOtpEnteringPane__section'>
          {
            props.errorMsg && (
              <div className='LoginOtpEnteringPane__resend'>
                <Text
                  textStyle='subtitle-1'
                >
                  { props.errorMsg }
                </Text>
              </div>
            )
          }
          <div className='LoginOtpEnteringPane__codeexpires'>
            {
              props.showResentMsg && (
                <Text
                  textStyle='subtitle-1'
                >
                  { `${ props.resendOtpVerbiageAfterResend || constants.OTP_RESENT }` }
                </Text>
              )
            }
            {
              props.resentClicked && (
                <Text
                  textStyle='subtitle-1'
                >
                  { `${ props.resendOTPVerbiage || constants.OTP_EXPIRE } ${seconds}${ props.secondsVerbiage || constants.SECONDS }` }
                </Text>
              )
            }

          </div>
        </div>
        {
          !props.resentClicked ? (
            <Button
              onClick={ props.onResentClick }
              label={ props.resendBtnLabel }
              size='medium'
              secondary={ true }
              className='LoginOtpEnteringPane__resendBtn'
              focusKeyRefrence='BUTTON_RESEND'
              onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_RESEND' }
            />
          ) : (
            <FocusContext.Provider value=''
              focusable={ false }
            >
              <Button
                onClick={ props.onResentClick }
                label={ props.resendBtnLabel }
                size='medium'
                secondary={ true }
                className='LoginOtpEnteringPane__resendBtnDisabled'
                focusKeyRefrence='BUTTON_RESEND'
                onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_RESEND' }
                notFossabeButton={ true }
              />
            </FocusContext.Provider>
          )
        }
      </div>
    </form>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {array} inputs - set the inputs
 * @property {string} mobileNumber - set the mobileNumber
 * @property {string} resendBtnLabel - set the resendBtnLabel
 * @property {string} errorMsg - set the errorMsg
 * @property {func} onResentClick - Calls the click of resent button
 */
export const propTypes =  {
  title: PropTypes.string,
  mobileNumber: PropTypes.string,
  resendBtnLabel: PropTypes.string,
  errorMsg: PropTypes.string,
  onResentClick: PropTypes.func
};

LoginOtpEnteringPane.propTypes = propTypes;

export default LoginOtpEnteringPane;
