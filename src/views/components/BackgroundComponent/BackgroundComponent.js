/**
 * Background Component
 *
 * @module views/components/BackgroundComponent
 * @memberof -Common
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Image from '../Image/Image';
import './BackgroundComponent.scss';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';

/**
 * Represents a BackgroundComponent component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns BackgroundComponent
 */
export const BackgroundComponent = function( props ){
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const backgroundImage = useMemo( () => config?.welcomeScreen?.backgroundImage, [config] );
  return (
    <div className='BackgroundComponent'>
      <div
        className='BackgroundComponent__content'
      >
        { props.isGradient &&
        <>
          <div className='BackgroundComponent__topGradient'/>
          <div className='BackgroundComponent__bottomGradient'/>
        </>
        }
        <Image
          src={ backgroundImage }
          alt={ props.alt }
        />
      </div>

    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} bgImg - provides Banner bgImg
   * @property {string} alt - provides Banner alt text
   */
export const propTypes =  {
  bgImg: PropTypes.string.isRequired,
  alt: PropTypes.string,
  isGradient: PropTypes.bool
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {boolean} isGradient=true - Default linearGradient
 */

export const defaultProps = {
  isGradient: true
};

BackgroundComponent.propTypes = propTypes;
BackgroundComponent.defaultProps = defaultProps;

export default BackgroundComponent;
