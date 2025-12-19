/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * checkbox control that allows you to perform a toggle (on/off) action between checked and unchecked states. It supports different sizes, labels, label positions, and UI customization
 *
 * @module views/components/Checkbox
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';
import classNames from 'classnames';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { isTizen } from '../../../utils/constants';

/**
 * Represents a Checkbox component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Checkbox
 */
const Checkbox = ( props ) => {
  const {
    onChange,
    disabled,
    toggleButton,
    tabIndex,
    checked,
    id,
    name,
    labelPositionLeft,
    children,
    isCustom,
    focusKeyRefrence,
    onFocus,
    buttonFocus,
    switchLogin,
    loginMethodOne,
    loginMethodTwo
  } = props;
  const { setIsLoginToggle, isLoginToggle } = useMaintainPageState()
  const loginMethodTwoWidth = getTextWidth( loginMethodTwo );

  function getTextWidth( text, font = 'normal 24px "Volte Play"' ){
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );
    context.font = font;
    return ( context.measureText( text ).width / 24 ) + 1.677
  }

  const { ref, focused, focusSelf } = useFocusable( {
    onFocus,
    onEnterPress: ( e ) => {
      props.onChange( e )
    },
    onArrowPress: ( direction ) => {
      // TODO : NEED TO DISCUSS WITH DEEPIKA / GAURI
      if( focusKeyRefrence === 'LOGIN_TOGGLE' ){
        if( direction === 'right' ){
          if( isLoginToggle ){
            setIsLoginToggle( false )
          }
          return null;
        }
        else if( direction === 'left' ){
          if( !isLoginToggle ){
            setIsLoginToggle( true )
            setFocus( 'LOGIN_TOGGLE' )
          }
          return null;
        }
        if( direction === 'down' ){
          if( window.location.pathname.includes( 'new-rmn' ) && !isLoginToggle ){
            setTimeout( ()=> setFocus( `BUTTON_1` ) )
            return null;
          }
        }
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const onMouseEnterCallBackFn = ( e ) => {
    focusSelf()
  }

  return (
    <div
      className='Checkbox'
      ref={ ref }
    >

      { labelPositionLeft && children }
      <span className={
        classNames( 'Checkbox__input', {
          'Checkbox__input--toggleButton': toggleButton && !switchLogin,
          'Checkbox__input--loginToggleButton': toggleButton && switchLogin,
          'Checkbox__input--labelOnLeft': labelPositionLeft,
          'Checkbox__input--checkbox': !toggleButton,
          'Checkbox__input--focus': !buttonFocus && toggleButton,
          'Checkbox__input--loginToggleFocus': focused && switchLogin
        } )
      }
      style={ {
        '--label-width-one': `${getTextWidth( loginMethodOne ) + ( isTizen ? .333 : 0 ) }rem`, // should include unit
        '--lable-width-two': `${getTextWidth( loginMethodTwo ) + ( isTizen ? .866 : 1 ) }rem`,
        '--lable-width-total': `${getTextWidth( loginMethodOne ) + getTextWidth( loginMethodTwo ) + 2.9 }rem`,
        '--lable-left-two': isTizen ? loginMethodTwoWidth >= 8 ? '7.2rem' : '8.1rem' : loginMethodTwoWidth >= 8 ? '7.1rem' : '7.9rem'
      } }
      >
        <input
          id={ id }
          type='checkbox'
          tabIndex={ tabIndex }
          className={ `${toggleButton ? '' : 'Checkbox__checkbox'}` }
          { ...( onChange && {
            onChange: ( e ) => {
              onChange( e )
            }
          } ) }
          name={ name }
          checked={ checked }
          { ...( disabled && { disabled: disabled } ) }
          aria-checked={ checked }
          ref={ props.checkboxRef }
          onMouseEnter={ onMouseEnterCallBackFn }
        />
        <label
          htmlFor={ id }
          className={
            classNames( {
              'Checkbox__normalCheckBox': !toggleButton,
              'Checkbox__normalCheckBox Checkbox__normalCheckBox--disabled': !toggleButton && disabled,
              'Checkbox__normalCheckBox--custom': isCustom,
              'Checkbox__normalCheckBox--withFocus': focused && !switchLogin
            } )
          }
        ></label>
        { switchLogin && (
          <div className='Checkbox__label-toggle'>
            <span className='Checkbox__label-one'>{ loginMethodOne }</span>
            <span className='Checkbox__label-two'>{ loginMethodTwo }</span>
          </div>
        ) }
      </span>
      { !toggleButton && ( !labelPositionLeft && children ) }
    </div>
  )
}
/**
 * Property type definitions
 * @type {object}
 * @property {boolean} disabled - Sets the user behavior of toggle button
 * @property {string} name - Sets the name attribute which is required field
 * @property {string} id - Sets id attribute for toggle button
 * @property {number} tabIndex - Sets the tabindex attribute of toggle button
 * @property {boolean} labelPositionLeft - Sets the position of the label
 * @property {boolean} checked - Sets the state of toggle button
 * @property {boolean} toggleButton - Sets checkbox or toggle button display
 */
export const propTypes = {
  /** Sets the Checkbox to disabled mode if true */
  disabled: PropTypes.bool,
  /** Sets the Checkbox's name */
  name: PropTypes.string.isRequired,
  /** Sets the Checkbox's id */
  id: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
  /** Sets the Checkbox's tabIndex */
  tabIndex: PropTypes.number,
  /** Sets the label to left side if true */
  labelPositionLeft: PropTypes.bool,
  /** Sets the Checkbox as selected when true */
  checked: PropTypes.bool,
  /** Sets the Checkbox as toggle button if true and as checkbox when false*/
  toggleButton: PropTypes.bool,
  /** Sets the text and count content */
  children: PropTypes.node
};

/**
 * Default values for passed properties
 * @type {object}
 * @property {number} tabIndex=0 - Sets the tab index for element
 * @property {boolean} labelPositionLeft=false - Sets the position of label to left side.
 * @property {boolean} toggleButton=false - Sets the component behavior if true to toggleButton else to checkbox
 */
export const defaultProps = {
  tabIndex: 0,
  labelPositionLeft: false,
  toggleButton: false
};

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
