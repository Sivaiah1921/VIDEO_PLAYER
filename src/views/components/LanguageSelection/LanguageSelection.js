/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * Component for single language card for selection
 *
 * @module views/components/LanguageSelection
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Image from '../Image/Image';
import RadioButton from '../RadioButton/RadioButton';
import Text from '../Text/Text';
import './LanguageSelection.scss';

/**
 * Represents a LanguageSelection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LanguageSelection
 */
export const LanguageSelection = function( props ){
  const {
    bgImg,
    title,
    letterImg,
    isChecked,
    value,
    onSelected
  } = props;

  return (
    <div className={
      classNames( 'LanguageSelection', {
        'LanguageSelection--withFocus': isChecked
      } ) }
    style={ { backgroundImage: `url(${ bgImg })` } }
    onClick={ () => onSelected( title ) }
    role='button'
    tabIndex='0'
    >
      <RadioButton
        id={ title }
        name={ title }
        label={ title }
        isChecked={ isChecked }
        value={ value }
      >
        <Text
          color={ 'white' }
          textStyle={ 'body-5' }
        >
          { title }
        </Text>
        <Image
          src={ letterImg }
          alt={ title }
        />
      </RadioButton>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} bgImg - Language background image url
 * @property {string} letterImg - Language letter image ur
 * @property {string} title - Language title
 * @property {bool} isChecked - language selection value
 */
export const propTypes =  {
  bgImg: PropTypes.string,
  letterImg: PropTypes.string,
  title: PropTypes.string,
  isChecked: PropTypes.bool
};

LanguageSelection.propTypes = propTypes;

export default LanguageSelection;
