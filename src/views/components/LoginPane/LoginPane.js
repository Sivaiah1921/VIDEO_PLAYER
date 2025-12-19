/**
 * As an anonymous or authenticated, It should be seen onboarding login page if received from the back end services
 *
 * @module views/components/LoginPane
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Text from '../Text/Text';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import './LoginPane.scss';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/** Timout variable added to avoid multiple clicks */
let modalTimeout = null;

/**
 * Represents a LoginPane component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LoginPane
 */
export const LoginPane = function( props ){
  const previousPathName = useNavigationContext()
  const [image, setImage] = useState( 'ArrowForward' )
  const { ref, focusKey } = useFocusable( )

  const openModalFn = ()=>{
    clearTimeout( modalTimeout );
    modalTimeout = setTimeout( ()=>{
      props.openModal();
      clearTimeout( modalTimeout );
    }, 100 )
  }

  return (
    <div className={ classNames( 'LoginPane', `${ !props.enableQrLoginJourney || props.QrError ? 'LoginPane__RMN' : 'LoginPane__QRLogin' }` ) }
      ref={ ref }
    >
      { ( !props.enableQrLoginJourney || props.QrError ) && (
        <div className='LoginPane__title'>
          <Text
            textAlign='left'
            textStyle='header-2'
            color='white'
            htmlTag='span'
          >
            { props.loginTitle }
          </Text>
        </div>
      ) }
      <FocusContext.Provider value=''
        focusable={ false }
      >
        <div
          className={ classNames(
            'LoginPane__mobileNumber', {
              'LoginPane__mobileNumber--error': props.errorMessage
            }
          ) }
        >
          <Text
            textAlign='left'
            textStyle='body-3'
            color='white'
            htmlTag='span'
          >
            { props.prefixValue }
          </Text>
          <InputField
            label={ props.mobInputLabel }
            type='number'
            value={ props.value }
            pointerNavigation={ true }
          />
        </div>
        <div className='LoginPane__invalidnum'>
          <Text
            textStyle='subtitle-1'
            color='error-600'
          >
            { props.errorMessage }
          </Text>
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }
          className={ props.enableQrLoginJourney && !props.QrError ? 'LoginPane__proceed__QRLogin' : 'LoginPane__proceed__RMN' }
        >
          <div
            className='LoginPane__checkBoxPanel'
          >
            <Button
              onFocus={ ()=> {
                setImage( 'ArrowForward' )
                previousPathName.previousMediaCardFocusBeforeSplash = 'TERMS_BUTTON'
              } }
              onBlur={ ()=> setImage( 'ArrowForward' ) }
              onClick={ () => openModalFn() }
              label={ props.proceedBtnLabel2 }
              iconRightImage={ image }
              iconRight={ true }
              className='LoginPane__checkBoxPanel--btnTandC'
              focusKeyRefrence={ 'TERMS_BUTTON' }
            />
          </div>
          { props.value.length !== 10 ? (
            <FocusContext.Provider value=''
              focusable={ false }
            >
              <Button
                label={ props.btnLabel }
                disabled={ true }
                notFossabeButton
              />
            </FocusContext.Provider>
          ) : (

            <Button
              label={ props.btnLabel }
              disabled={ props.disabled }
              backgroundColor={ !props.disabled && props.value.length === 10 ? '#e10092' : null }
              onClick={ () => props.onProceedClick() }
              focusKeyRefrence={ 'BUTTON_PRIMARY' }
              onFocus={ ()=> {
                previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PRIMARY'
              } }
            />
          ) }
        </div>
      </FocusContext.Provider>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} mobInputLabel - set the mobInputLabel to use in icon
 * @property {string} loginTitle - set the loginTitle
 * @property {bool} checkedValue - set the checkedValue
 * @property {string} btnLabel - set the btnLabel
 */
export const propTypes = {
  mobInputLabel: PropTypes.string,
  loginTitle: PropTypes.string,
  proceedBtnLabel2: PropTypes.string,
  checkedValue: PropTypes.bool,
  btnLabel: PropTypes.string,
  value: PropTypes.string,
  openModal: PropTypes.func
};

LoginPane.propTypes = propTypes;

export default LoginPane;
