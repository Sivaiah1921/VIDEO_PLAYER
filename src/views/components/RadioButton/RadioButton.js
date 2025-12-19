/**
 * common radiobutton component used by other mudules as a reusable component which returns ui for radio button and required fields can be passed as props
 *
 * @module views/components/RadioButton
 * @memberof -Common
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './RadioButton.scss';

/**
 * Represents a RadioButton component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns RadioButton
 */
export const RadioButton = function( props ){
  const {
    children,
    id,
    name,
    value,
    tabIndex,
    isChecked,
    isDisabled,
    onChange,
    hideInput
  } = props;

  const [checkedValue, setCheckedValue] = useState( isChecked );

  return (
    <div
      className='RadioButton'
    >
      <input
        type='radio'
        className={
          classNames( 'RadioButton__input', {
            'RadioButton__hideInput': hideInput
          } )
        }
        value={ value }
        aria-labelledby={ `${ id }_label` }
        { ...( tabIndex && { tabIndex: tabIndex } ) }
        name={ name || id }
        { ...( id && { id } ) }
        checked={ checkedValue }
        disabled={ isDisabled }
        onClick={ e => {
          onChange && onChange( e );
          setCheckedValue( !checkedValue )
        } }
      />
      <label
        id={ `${ id }_label` }
        htmlFor={ id }
        className={
          classNames( 'RadioButton__label', {
            'RadioButton__transformLabel': hideInput
          } )
        }
      >
        { children }
      </label>
    </div>
  );
};

/**
* Property type definitions
* @type {object}
* @property {string} value - Sets the value which is required field
* @property {string} name - Sets the name which is required field
* @property {boolean} isChecked - Set the radio button is checked or unchecked
* @property {boolean} isDisabled - the button is un-clickable
* @property {string} id - Sets id for button which is required field
* @property {function} onChange - Sets the onChange when this function is called
* @property {number} tabIndex - Sets the tab focus for element
* @property {boolean} hideInput - Set the value for hide the radio or not
*/

export const propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  tabIndex: PropTypes.number,
  hideInput:PropTypes.bool
};

/**
 * Default values for passed properties
 * @type {object}
 * @property {boolean} isDisabled=false - The default behavoir of the button is un-clickable
 * @property {boolean} hideInput=false - The default behavoir of the radio is displayed
 */
export const defaultProps = {
  isDisabled: false,
  hideInput: false
};

RadioButton.propTypes = propTypes;
RadioButton.defaultProps = defaultProps;

export default RadioButton;