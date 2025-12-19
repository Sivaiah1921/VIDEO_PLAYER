/**
* The Icon component returns an SVG Icon image
* @module views/Atoms/Icon
* @memberof -Common
*/

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../Icons/Icons';

const iconNames = [...new Set( Object.keys( icons ).map( ( name ) => name.replace( /^Svg\d{2}/, '' ) ) )];
const iconSizes = { s: '12', m: '16', l: '24' }

/**
 * Component to display icons
 *
 * @method
 * @param {object} size - Sets the size of the icon
 * @param {object} name - Sets the icon's figure
 * @param {object} props - Additional React properties passed from composition
 * @returns Icon
 */
const Icon = ( { size, name, ...props } ) => {
  const { IconName, isValidIcon } = useMemo( () => {
    const key = size ? `Svg${iconSizes[size]}${name}` : name;
    const IconName = icons[key];
    const isValidIcon = IconName && typeof IconName === 'function';
    return { IconName, isValidIcon };
  }, [size, name] );

  return isValidIcon ? <IconName { ...props } /> : null;
};

/**
  * Property type definitions
  * @type {object}
  * @property {string} name - Name of the icon (from the first column in the Storybook table)
*/

export const propTypes = {
  /**
   * Name of the icon (from the first column in the Storybook table)
   */
  name: PropTypes.oneOf( iconNames )
}

Icon.propTypes = propTypes;

export default Icon;
