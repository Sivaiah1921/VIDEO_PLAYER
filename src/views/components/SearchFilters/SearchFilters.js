/* eslint-disable no-console */
/**
 * This is the show and hide filters of search page consisting of language and genre filters
 *
 * @module views/components/SearchFilters
 * @memberof -Common
 */
import React, { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchFilters.scss';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import ShowFilterButton from '../ShowFilterButton/ShowFilterButton';
import SearchGenre from '../SearchGenre/SearchGenre';
import classNames from 'classnames';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
const { SEARCH_PAGE } = require( '../../../utils/constants' ).default;

/**
 * Represents a SearchFilters component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SearchFilters
 */

const SearchLanguage = React.memo( ( props ) => {
  const { ref, focusKey } = useFocusable( { } )
  const { selectedLaungueItem, selectedLaunguePosition } = useMaintainPageState() || null
  const buttonRef = useRef( null );
  const [selectedLanguage, setSelectedLanguage] = useState( selectedLaungueItem.current );
  const previousPathName = useNavigationContext();


  const onCardFocus = useCallback( ( { x, ...rest }, languageItem, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `${languageItem}${index}`
    if( buttonRef.current ){
      buttonRef.current.scrollLeft = rest.left - buttonRef.current.clientWidth
    }
    selectedLaunguePosition.current = rest.left
  }, [buttonRef] );


  return (
    <div className='SearchFilters__button--lang'>
      <Text>
        { SEARCH_PAGE.FILTER_BY_LANGUAGE }
      </Text>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }
          className='SearchFilters__filterButtons'
        >
          <div className='SearchFilters__button--langgen'
            ref={ buttonRef }
          >
            { props.languageButtons?.map( ( languageItem, index ) => (
              <Button
                label={ languageItem }
                secondary
                size='medium'
                onFocus={ ( e ) => onCardFocus( e, languageItem, index ) }
                onClick={ ( e ) => {
                  selectedLanguage === languageItem ? setSelectedLanguage( '' ) : setSelectedLanguage( languageItem )
                  selectedLaungueItem.current = selectedLanguage === languageItem ? '' : languageItem
                  props.langClicked( e, languageItem )
                } }
                focusKeyRefrence={ `${languageItem}${index}` }
                className={ classNames( {
                  'Button--active': selectedLanguage === languageItem
                } ) }
              >
              </Button>
            ) ) }
          </div>
        </div>
      </FocusContext.Provider>
    </div>
  )

} )
export const SearchFilters = function( props ){
  const { onFocus, focusKeyRefrence } = props
  const { ref, focusKey } = useFocusable( { } )


  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='SearchFilters'
        ref={ ref }
      >
        <div className='SearchFilters__showAndHideButton'>
          <ShowFilterButton
            showFilter={ props.showFilter }
            setShowFilter={ props.setShowFilter }
            focusKeyRefrence={ focusKeyRefrence }
          />
        </div>

        { !props.showFilter &&
          <>
            {
              props.languageButtons.length && (
                <SearchLanguage
                  languageButtons={ props.languageButtons }
                  langClicked={ props.langClicked }
                />
              )
            }
            {
              props.genreButtons.length && (
                <SearchGenre
                  genreButtons={ props.genreButtons }
                  genClicked={ props.genClicked }
                />
              )
            }
          </>
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

SearchFilters.propTypes = propTypes;
SearchFilters.defaultProps = defaultProps;

export default SearchFilters;
