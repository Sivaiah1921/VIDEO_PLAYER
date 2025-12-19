/**
 * App Content Section for the new BBA Rail
 *
 * @module views/components/AppContentSection
 * @memberof -Common
 */
import React from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

/**
 * Represents a AppContentSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppContentSection
 */
export const AppContentSection = function( props ){
  const { appContent } = props;
  const { ref, focusKey } = useFocusable( { } )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }
        className='HomeMediaCarousel__bbaAppContent'
      >
        { appContent }
      </div>
    </FocusContext.Provider>
  )
}

export default AppContentSection;
