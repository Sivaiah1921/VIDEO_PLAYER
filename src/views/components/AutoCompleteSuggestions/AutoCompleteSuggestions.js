/**
 * This component will be used in the search screen to show the list of suggestions when something is entered by the user.
 *
 * @module views/components/AutoCompleteSuggestions
 * @memberof -Common
 */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AutoCompleteSuggestions.scss';
import Button from '../Button/Button';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Loader/Loader';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';

/**
 * Represents a AutoCompleteSuggestions component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AutoCompleteSuggestions
 */
export const AutoCompleteSuggestions = function( props ){
  const { setShowKeyboardIcon, longKeyPressed, totalSearchRecords } = props;
  const scrollRef = useRef( null )
  const previousPathName = useNavigationContext()
  const { searchKeyBoardLastFocuskey } = useMaintainPageState()
  const { ref, focusKey } = useFocusable( {
    ...( totalSearchRecords === 0 && {
      isFocusBoundary: true,
      focusBoundaryDirections: ['right']
    } ),
    onFocus: ( props ) => {
      setShowKeyboardIcon( true )
      onRailFocus( props )
    },
    saveLastFocusedChild: false
  }
  );

  const onRailFocus = useCallback( ( { y, ...rest } ) => {
    if( ref.current ){
      ref.current.scrollTop = rest.top - ref.current.clientHeight / 2
    }
  }, [ref] )



  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='AutoCompleteSuggestions'
        ref={ ref }
      >
        <InfiniteScroll
          dataLength={ props.autoCompleteList?.length || 0 }
          scrollableTarget='scrollContainer'
        >
          { props.autoCompleteLoading && <Loader/> }
          { props.inputValue && props.autoCompleteList?.length >= 1 && props.autoCompleteList?.map( ( item, index ) => (
            <Button
              key={ index }
              autoSuggestion
              inputValue={ props.inputValue }
              label={ item.title }
              secondary
              size='medium'
              iconLeft={ true }
              iconLeftImage='Search'
              onClick={ () => {
                props.suggestionClicked( item.title, item.intent, index + 1 );
              } }
              focusKeyRefrence={ `BUTTON_FOCUSED_${index}` }
              onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUSED_${index}` }
              longKeyPressed={ longKeyPressed }
              setShowKeyboardIcon={ setShowKeyboardIcon }
              searchKeyBoardLastFocuskey={ searchKeyBoardLastFocuskey.current }
            />
          ) )
          }
        </InfiniteScroll>
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

AutoCompleteSuggestions.propTypes = propTypes;
AutoCompleteSuggestions.defaultProps = defaultProps;

export default AutoCompleteSuggestions;
