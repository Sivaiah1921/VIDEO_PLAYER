/* eslint-disable no-console */
/**
 * This is the genre rail of search page after show filter
 *
 * @module views/components/SearchGenre
 * @memberof -Common
 */
import React, { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchGenre.scss';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
const { SEARCH_PAGE } = require( '../../../utils/constants' ).default;

/**
 * Represents a SearchGenre component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SearchGenre
 */
export const SearchGenre = function( props ){
  const previousPathName = useNavigationContext()
  const { selectedGenreItem, selectedGenrePosition } = useMaintainPageState() || null
  const { ref, focusKey } = useFocusable( )
  const buttonRef = useRef( null );
  const [selectedGenre, setSelectedGenre] = useState( selectedGenreItem.current );



  const onCardFocus = useCallback( ( { x, ...rest }, genre, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `${genre}${index}`
    if( buttonRef.current ){
      buttonRef.current.scrollLeft = rest.left - buttonRef.current.clientWidth
    }
    selectedGenrePosition.current = rest.left
  }, [buttonRef] );


  return (
    <div className='SearchGenre'>
      <div className='SearchFilters__button--genre'>
        <Text>
          { SEARCH_PAGE.FILTER_BY_GENRE }
        </Text>
        <FocusContext.Provider value={ focusKey }>
          <div ref={ ref }
            className='SearchFilters__filterButtons'
          >
            <div className='SearchFilters__button--langgen'
              ref={ buttonRef }
            >
              { props.genreButtons?.map( ( genre, index ) => (
                <Button
                  label={ genre }
                  secondary
                  size='medium'
                  onFocus={ ( e ) => onCardFocus( e, genre, index ) }
                  onClick={ ( e ) => {
                    selectedGenre === genre ? setSelectedGenre( '' ) : setSelectedGenre( genre )
                    selectedGenreItem.current = selectedGenre === genre ? '' : genre
                    props.genClicked( e, genre )
                  } }
                  focusKeyRefrence={ `${genre}${index}` }
                  className={ classNames( {
                    'Button--active': selectedGenre === genre
                  } ) }
                >
                </Button>
              ) ) }
              { /* <FocusContext.Provider
                focusable={ false }
              >
                <Button
                  label={ 'ButtonGenre' }
                  secondary
                  size='medium'
                  disabled
                  className='ButtonLastLanguage'
                >
                </Button>
              </FocusContext.Provider> */ }
            </div>
          </div>
        </FocusContext.Provider>
      </div>
    </div>
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

SearchGenre.propTypes = propTypes;
SearchGenre.defaultProps = defaultProps;

export default React.memo( SearchGenre );
