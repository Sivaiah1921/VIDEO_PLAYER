/**
 * This is teh button to show or hide filters
 *
 * @module views/components/ShowFilterButton
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import constants from '../../../utils/constants';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
 * Represents a ShowFilterButton component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ShowFilterButton
 */
export const ShowFilterButton = function( props ){
  const { onFocus, focusKeyRefrence } = props
  const { ref, focusKey } = useFocusable( { onFocus } )
  const previousPathName = useNavigationContext()

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='ShowFilterButton'
        ref={ ref }
      >
        <Button
          label={ props.showFilter ? constants.SHOW_FILTER : constants.HIDE_FILTER }
          secondary
          onClick={ ( e ) => {
            props.setShowFilter( !props.showFilter )
          } }
          size='medium'
          focusKeyRefrence={ focusKeyRefrence }
          onFocus={ ( ) => {
            previousPathName.previousMediaCardFocusBeforeSplash = focusKeyRefrence
          } }
        />
      </div>
    </FocusContext.Provider>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world'
};

ShowFilterButton.propTypes = propTypes;
ShowFilterButton.defaultProps = defaultProps;

export default ShowFilterButton;
