/**
 * The Divider component is used to delineate sections of the page. Commonly gray inside page content, it can also be a multi-colored bar, as used in various footers  Margin and bottom padding values can also be passed as props for specific spacing.
 *
 * @module views/components/Divider
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './Divider.scss';
import classNames from 'classnames';

/**
  * Represents a Divider component
  *
  * @method
  * @param { Object } props - React properties passed from composition
  * @returns Divider
  */
export const Divider = function( props ){
  return (
    <div
      className={ classNames( 'Divider', {
        'Divider__horizontal': props.horizontal && !props.vertical && !props.horizontalGradient,
        'Divider__horizontal--gradient': props.horizontalGradient,
        'Divider__vertical': props.vertical,
        [`Divider__bottomSpacer--${props.spacerValue}`]:props.spacerValue
      } ) }
    >
    </div>
  )
}

/**
  * property type definitions
  * @property {object} propTypes
  * @property {string} horizontal - Sets horizontal divider type
  * @property {string} horizontalGradient - Sets horizontal divider with gradient type
  * @property {string} vertical - Sets horizontal divider type
  * @property {string} spacerValue - Sets spacer value for divider
  */
export const propTypes =  {
  spacerValue: PropTypes.string,
  horizontal: PropTypes.bool,
  horizontalGradient: PropTypes.bool,
  vertical: PropTypes.bool
};

/**
  * Default values for passed properties
  * @property { object } defaultProps
  * @property { string } horizontal defaultProps.horizontal true - Set to 'horizontal' for displaying the default divider
  * @property { string } vertical defaultProps.vertical false - Set to 'vertical' false
  */
export const defaultProps =  {
  horizontal: true,
  vertical: false
};

Divider.propTypes = propTypes;
Divider.defaultProps = defaultProps;

export default Divider;
