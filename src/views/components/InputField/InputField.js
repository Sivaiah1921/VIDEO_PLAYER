/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * The InputField component is used for textual user data input on forms. The type of field can be one of &#x27;text&#x27;, &#x27;number&#x27;, &#x27;password&#x27;, &#x27;email&#x27;, &#x27;tel&#x27; or &#x27;date&#x27;. It also accepts several properties to set values on tag attributes, enhance usability, and for ADA compliance.
 *
 * @module views/Atoms/InputField
 * @memberof -Common
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './InputField.scss';
import classNames from 'classnames';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';
import constants, { PAGE_NAME } from '../../../utils/constants';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
  * Represents a InputField component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns InputField
  */
export const InputField = function( props ){
  const { onChange, setShowKeyboardIcon, setEnableKey, wrongPin, tabIndex, otpValue, languageRail, languageListResponse, fetchTextResponse, iskeyBoardOpen, errorMsg, focusKeyReference, pointerNavigation, genreRail, genreListResponse, isComingFromPage, showKeyboardIcon, isFocusedInputField, setShowKeyboard, totalSearchRecords } = props
  const inputEl = useRef( props.name );
  const [isActive, setIsActive] = useState( false );
  const [isFocused, setIsFocused] = useState( false )
  const [showSearchBoxIcon, setShowSearchBoxIcon] = useState( isComingFromPage === PAGE_NAME.SERIES_DETAIL )
  const previousPathName = useNavigationContext();

  const { ref, focused, focusKey } = useFocusable( {
    onEnterPress: ( ) => {
      props.handleFocus && props.handleFocus();
      !props.disabled && inputEl.current.focus()
      setShowSearchBoxIcon( true )
      setShowKeyboardIcon?.( false )
      setFocus( 'BUTTON_KEY_0' )
    },
    onFocus: ( props ) => {
      previousPathName.previousMediaCardFocusBeforeSplash = focusKeyReference
      setEnableKey && setEnableKey( true )
    },
    onArrowPress:( direction )=>{
      if( direction === 'right' && totalSearchRecords === 0 ){
        return false
      }
      if( direction === 'right' && iskeyBoardOpen === false ){
        if( fetchTextResponse && fetchTextResponse.data?.length > 0 ){
          setFocus( 'CLEAR_BUTTON' )
        }
        else if( languageRail.length > 0 ){
          setTimeout( ()=> setFocus( `BUTTON_FOCUS_${languageListResponse.data.id + 1000}${languageRail[0].id}` ), 100 )
        }
        else if( genreRail.length > 0 ){
          setTimeout( ()=> setFocus( `BUTTON_FOCUS_${genreListResponse.data.id + 1000}${genreRail[0].id}` ), 100 )
        }
        return true
      }
      if( direction === 'down' && isFocusedInputField ){
        setShowKeyboardIcon?.( false )
        setShowKeyboard( true )
        setFocus( 'BUTTON_KEY_0' )
        return false
      }

    },
    focusKey: focusKeyReference ? focusKeyReference : null
  } )

  const handleFocus = () => {
    setIsActive( true );
    setIsFocused( true );

    if( props.handleFocus ){
      props.handleFocus();
    }
  }

  const handleChange = event => {
    setIsActive( true );
    onChange && onChange( event.target.value );
    props.onOTPChange && props.onOTPChange( event );
  }

  const handleBlur = ( e ) => {
    setIsActive( false );
    setIsFocused( false );

    if( props.handleBlur ){
      props.handleBlur();
    }
  }

  const handlePaste = ( e ) => {
    if( props.disablePaste ){
      e.preventDefault();
      return false;
    }
  }

  useEffect( ()=>{
    if( props.type === 'text' ){
      var elem = document.getElementById( props.id );
      if( elem ){
        elem.scrollLeft = elem.scrollWidth;
      }
    }
  }, [props.value] )

  const onMouseEnterCallBackFn = ( e ) => {
    if( !pointerNavigation ){
      setFocus( 'SEARCH_INPUT' )
    }
  }

  const onMouseEnterFn = ( ) => {
    props.handleFocus && props.handleFocus();
    setShowSearchBoxIcon( true )
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        ref={ ref }
        onMouseEnter={ onMouseEnterCallBackFn }
        onMouseUp={ onMouseEnterFn }
        className={
          classNames(
            'InputField', {
              'InputField--disable': props.disabled,
              'InputField--focused': focused
            }
          )
        }
      >
        <div
          className={ 'InputField__label' }
        >
          <label
            className='InputField__label--text'
          >
            { props.label }
          </label>
        </div>
        <div
          className={
            classNames(
              'InputField__content', {
                'InputField__content--active': isActive || ( !isActive ),
                'InputField__content--focusedNext': tabIndex === otpValue?.length,
                'InputField__content--white':( tabIndex !== otpValue?.length && otpValue?.length ),
                'InputField__content--red': errorMsg || wrongPin
              }
            )
          }
        >

          <div className='InputField__formControls'>

            <input
              className={
                classNames(
                  'InputField__input', {
                    'InputField--capitalize': props.autoCapitalize
                  },
                  {
                    'InputField__input--active': isActive || ( !isActive )
                  },
                  { 'InputField__input--placeholderActive': props.value === constants.placeHolderText }
                )
              }
              { ...( props.onClick && { onClick: props.onClick } ) }
              placeholder={ props.placeholder }
              ref={ inputEl }
              autoComplete={ props.autoComplete }
              autoCorrect={ props.autoCorrect }
              spellCheck={ props.spellCheck }
              tabIndex={ props.tabIndex }
              onFocus={ handleFocus }
              onPaste={ handlePaste }
              onBlur={ handleBlur }
              onChange={ handleChange }
              type={ props.type }
              aria-label={ props.label }
              { ...( props.maxLength && { maxLength: props.maxLength } ) }
              required={ props.required }
              id={ props.id }
              value={ props.value }
              disabled={ true }
            />
            { props.searchBox && showSearchBoxIcon &&
            <Icon name='Search' />
            }
          </div>
          <div>
          </div>
        </div>


      </div>
    </FocusContext.Provider>
  )
}

/**
  * Property type definitions
  * @type {object}
  * @property {string} type - Specifies the HTML5 input field type (currently one of 'text', 'number', 'password', 'email', 'tel', 'date')
  * @property {string} label - The value used for the input field's label tag above the input field
  * @property {number} tabIndex - The tabindex attribute value for the input field
  * @property {string} placeholder - The input field placeholder attribute value
  * @property {number} maxLength - Sets the maximum length attribute value for the input field
  * @property {string} autoComplete - Sets the input field's autocomplete attribute value
  * @property {string} autoCorrect - Sets the input field's autocorrect attribute value
  * @property {string} autoCapitalize - Sets the input field's autocapitalize attribute value
  * @property {boolean} spellCheck - Sets the spellcheck attribute, which defines whether the input may be checked for spelling errors.
  * @property {boolean} disablePaste - Flag to disable pasting a value into the field
  * @property {string} showValueText - Text for 'SHOW' to display masked input
  * @property {string} hideValueText - Text for 'HIDE' to mask input
  * @property {string} clearValueText - AriaLabel text for the input field's 'Clear' button (reset)
  * @property {boolean} disabled - Flag to disable input field
  * @property {boolean} required - Flag to mark a field as required
  * @property {boolean} displayCheck - Flag to display check icon
  * @property {any} value - value to input
  */
export const propTypes = {
  /** Specifies the HTML5 input field type (currently one of 'text', 'number', 'password', 'email', 'tel', 'date') to render */
  type: PropTypes.oneOf( ['text', 'number', 'password', 'email', 'tel', 'date', 'button'] ),
  /** Label of the input to render over the inputbox */
  label: PropTypes.string,
  /** The tabindex attribute value for the input field */
  tabIndex: PropTypes.number,
  /** The input field placeholder attribute value */
  placeholder: PropTypes.string,
  /** Sets the maximum length attribute value for the input field  */
  maxLength: PropTypes.number,
  /** Sets the input field's autocomplete attribute valuet*/
  autoComplete: PropTypes.string,
  /** Sets the input field's autocorrect attribute value */
  autoCorrect: PropTypes.string,
  /** Sets the input field's autocapitalize attribute value */
  autoCapitalize: PropTypes.string,
  /** Flag to sets the spellcheck attribute, which defines whether the input may be checked for spelling errors. */
  spellCheck: PropTypes.bool,
  /** Flag to disable pasting a value into the field */
  disablePaste: PropTypes.bool,
  /** Text for 'SHOW' to display masked input */
  showValueText: PropTypes.string,
  /** Text for 'HIDE' to mask input */
  hideValueText: PropTypes.string,
  /** AriaLabel text for the input field's 'Clear' button (reset) */
  clearValueText: PropTypes.string,
  /** Flag to disable input field  */
  disabled: PropTypes.bool,
  /** Flag to mark a field as required */
  required: PropTypes.bool,
  /** Flag to display check icon */
  displayCheck: PropTypes.bool,
  /** Input value */
  value: PropTypes.any,
  /** Flag to mark a field as required */
  searchBox: PropTypes.bool
};

/**
  * Default values for passed properties
  * @type {object}
  * @property {string} type='text' - The input field type, defaults to 'text'
  * @property {string} autoComplete='on' - The input field autocomplete attribute, default is 'on'
  * @property {string} autoCorrect='on' - The input field autocorrect attribute, default is 'on'
  * @property {boolean} spellCheck=true - Flag to trigger spellcheck in the field, default is 'true'
  * @property {boolean} showValidationMessage=true - Flag to show or hide the ResponseMessages component, default is 'true'
  * @property {string} showValueText='' - Text to display in a masked input field, default is empty string
  * @property {string} hideValueText='' - Text to display in a masked input field when unmasked, default is empty string
  * @property {string} clearValueText='' - Tooltip text to display for an input field's reset button, default is empty string
  * @property {boolean} disabled=false - Flag to disable input field
  */
export const defaultProps = {
  type: 'text',
  autoComplete: 'on',
  autoCorrect: 'on',
  spellCheck: true,
  //  showValidationMessage: true,
  showValueText: '',
  hideValueText: '',
  clearValueText: '',
  displayCheck: false,
  searchBox: false,
  disabled: false
};

InputField.propTypes = propTypes;
InputField.defaultProps = defaultProps;

export default InputField;
