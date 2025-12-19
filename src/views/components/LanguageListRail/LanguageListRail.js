/**
 * This is the rail for language list, used in Search etc.
 *
 * @module views/components/LanguageListRail
 * @memberof -Common
 */
import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './LanguageListRail.scss';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import Text from '../Text/Text';
import Loader from '../Loader/Loader';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';


/**
   * Represents a LanguageListRail component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns LanguageListRail
   */
export const LanguageListRail = function( props ){
  const { onFocus, clearTextFetchData, isFocused } = props
  const { ref, focusKey } = useFocusable( { onFocus } )
  const buttonRef = useRef( null );
  const previousPathName = useNavigationContext()

  const clearClicked = () => {
    clearTextFetchData()
  }

  const onCardFocus = useCallback( ( { x, ...rest }, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${index}`
    if( buttonRef.current ){
      buttonRef.current.scrollLeft = x || 0
    }
  }, [buttonRef] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='LanguageListRail'
        ref={ ref }
      >
        <FocusContext.Provider value={ focusKey }>
          { props.fetchTextLoading && <Loader/> }

        </FocusContext.Provider>
        { props.fetchTextResponse?.data?.length > 0 &&
        <FocusContext.Provider value={ focusKey }>
          <div ref={ ref }
            className='LanguageListRail__recentSearch'
          >
            { isFocused &&
            <div className='LanguageListRail__title'>
              <Text>
                { 'Recent Searches' }
              </Text>
            </div>
            }
            <div className={ isFocused ? 'LanguageListRail__recentSearch--buttons' : 'LanguageListRail__recentSearch--buttonsWithNoKeyBoard' }
              ref={ buttonRef }
            >
              { props.fetchTextResponse?.data?.slice( 0, 7 ).map( ( item, index ) => (
                <Button
                  label={ item }
                  secondary
                  size='medium'
                  onFocus={ ( e )=> onCardFocus( e, index ) }
                  onClick={ ( e ) => props.recentSearchSelected( e, item ) }
                  key={ index }
                  focusKeyRefrence={ `BUTTON_PRIMARY_${index}` }
                >
                </Button>
              ) ) }
            </div>
          </div>
        </FocusContext.Provider>
        }
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

LanguageListRail.propTypes = propTypes;
LanguageListRail.defaultProps = defaultProps;

export default LanguageListRail;
