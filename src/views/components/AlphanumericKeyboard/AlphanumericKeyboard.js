/* eslint-disable no-console */
/**
 * alphanumeric keyboard
 *
 * @module views/components/AlphanumericKeyboard
 * @memberof -Common
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button/Button';
import './AlphanumericKeyboard.scss';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
 * Represents a AlphanumericKeyboard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AlphanumericKeyboard
 */
export const AlphanumericKeyboard = ( props ) => {
  const previousPathName = useNavigationContext();
  const { onChange, deleteBtnLabel, spaceBtnLabel, clearBtnLabel, onClear, onRemove, onSpace, keys, isFocused, inputValue, recentSearchClicked, longKeyPressed, totalSearchRecords } = props;
  const specialKeys = [...'`~!@#$%^&*()-_=+[]{}|;:\',\'.<>/?='];
  specialKeys.splice( 20, 0, '\\' );
  specialKeys.push( '.com', 'abc' );
  const [showResults, setShowResults] = useState( false );
  const [specialKeyboard, setSpecialKeyboard] = useState( false );
  const [keyboardKeys, setKeyboardKeys] = useState( keys );
  const { ref, focusKey } = useFocusable( {
    ...( totalSearchRecords === 0 && {
      isFocusBoundary: true,
      focusBoundaryDirections: ['right']
    } )
  } )
  const { searchPageData, episodePageData, searchKeyBoardLastFocuskey } = useMaintainPageState() || null

  useEffect( ()=>{
    if( searchPageData.leftPanelOpen && searchPageData.isFilterOpen !== true && window.location.pathname.includes( '/Search' ) ){
      if( !!searchPageData.mediaCardRestoreId === false && searchPageData.searchLangGenreCardRestoreId === null ){
        // setTimeout( ()=> setFocus( 'BUTTON_KEY_0' ), 100 ) // kept for old approach
        setTimeout( ()=> setFocus( 'BUTTON_KEY_0' ) )
      }
      !!searchPageData.mediaCardRestoreId !== false ? setFocus( searchPageData.mediaCardRestoreId ) : setFocus( searchPageData.searchLangGenreCardRestoreId )
      searchPageData.leftPanelOpen = null
    }
    else if( searchPageData.isFilterOpen && window.location.pathname.includes( '/Search' ) ){
      // searchPageData.isFilterOpen = false
    }
    else if( searchKeyBoardLastFocuskey.current !== null ){
      //
    }
    else {
      // !!episodePageData.mediaCardRestoreId === false && setTimeout( ()=> setFocus( 'BUTTON_KEY_0' ), 100 ) // kept for old approach
      !!episodePageData.mediaCardRestoreId === false && setTimeout( ()=> setFocus( 'BUTTON_KEY_0' ) )
    }
  }, [recentSearchClicked] )

  const onChangeUpperCase = () => {
    const upperCaseKeys = keyboardKeys.map( element => ( element.toUpperCase() ) );
    const lowerCaseKeys = keyboardKeys.map( element => ( element.toLowerCase() ) );
    showResults ? setKeyboardKeys( lowerCaseKeys ) : setKeyboardKeys( upperCaseKeys );
  }

  const keyboardButtons = keyboardKeys.map( ( key, i ) => (
    key === '^' && !specialKeyboard ? (
      <Button
        className='AlphanumericKeyboard__key AlphanumericKeyboard__btnCapsArrow'
        onClick={ () => {
          onChangeUpperCase();
          setShowResults( !showResults );
        } }
        iconRight={ true }
        iconRightImage='CapsArrow'
        size='medium'
        focusKeyRefrence={ `BUTTON_KEY_${i}` }
        onFocus={ ()=> {
          previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_KEY_${i}`
        } }
        longKeyPressed={ longKeyPressed }
      />
    ) : key === '!#$' ? (
      (
        <Button
          className='AlphanumericKeyboard__key AlphanumericKeyboard__specialChar'
          onClick={ () => {
            setKeyboardKeys( specialKeys );
            setSpecialKeyboard( true );
          } }
          label={ key }
          key={ key + i }
          focusKeyRefrence={ `BUTTON_KEY_${i}` }
          onFocus={ ()=> {
            previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_KEY_${i}`
          } }
          longKeyPressed={ longKeyPressed }
        />
      )
    ) : key === 'abc' ? (
      (
        <Button
          className='AlphanumericKeyboard__key'
          onClick={ () => {
            setKeyboardKeys( keys );
            setSpecialKeyboard( false );
            setShowResults( false );
          } }
          label={ key }
          key={ key + i }
          focusKeyRefrence={ `BUTTON_KEY_${i}` }
          onFocus={ ()=> {
            previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_KEY_${i}`
          } }
          longKeyPressed={ longKeyPressed }
        />
      )
    ) :
      (
        <Button
          className='AlphanumericKeyboard__key'
          onClick={ () => onChange( key ) }
          label={ key }
          key={ key + i }
          focusKeyRefrence={ `BUTTON_KEY_${i}` }
          onFocus={ ()=> {
            previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_KEY_${i}`
          } }
          longKeyPressed={ longKeyPressed }
        />
      )
  ) );
  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='AlphanumericKeyboard'
        ref={ ref }
      >
        <div className={ classNames( 'AlphanumericKeyboard__row', {
          'AlphanumericKeyboard__specialKeyboard': specialKeyboard
        } ) }
        >
          { keyboardButtons }
        </div>
        <div className='AlphanumericKeyboard__row buttonRow'>
          <Button
            onClick={ onRemove }
            label={ deleteBtnLabel }
            size='medium'
            iconLeftImage='DeleteNumber'
            iconLeft={ true }
            secondary={ true }
            className='AlphanumericKeyboard__deleteBtn'
            onFocus={ ()=> {
              previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_DELETE`
              searchKeyBoardLastFocuskey.current = `BUTTON_DELETE`
            } }
            focusKeyRefrence='BUTTON_DELETE'
            longKeyPressed={ longKeyPressed }
          />
          <Button
            onClick={ onSpace }
            label={ spaceBtnLabel }
            size='medium'
            iconLeftImage='SpaceKeyboard'
            iconLeft={ true }
            secondary={ true }
            className='AlphanumericKeyboard__spaceBtn'
            onFocus={ ()=> {
              previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_SPACE`
              searchKeyBoardLastFocuskey.current = `BUTTON_SPACE`
            } }
            focusKeyRefrence='BUTTON_SPACE'
            longKeyPressed={ longKeyPressed }
          />
          <Button
            onClick={ onClear }
            label={ clearBtnLabel }
            size='medium'
            secondary={ true }
            className='AlphanumericKeyboard__clearBtn'
            onFocus={ ()=> {
              previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_CLEAR`
              searchKeyBoardLastFocuskey.current = `BUTTON_CLEAR`
            } }
            focusKeyRefrence='BUTTON_CLEAR'
            longKeyPressed={ longKeyPressed }
          />
        </div>
      </div>
    </FocusContext.Provider>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {func} onChange - set the onChange
 * @property {string} deleteBtnLabel - set the deleteBtnLabel
 * @property {string} clearBtnLabel - set the clearBtnLabel
 * @property {func} onClear - clear input
 * @property {func} onSpace - space single item from input
 * @property {func} onRemove - remove single item from input
 * @property {array} keys - keyboard keys
 */
export const propTypes = {
  onChange: PropTypes.func,
  deleteBtnLabel: PropTypes.string.isRequired,
  clearBtnLabel: PropTypes.string.isRequired,
  onClear: PropTypes.func,
  onSpace: PropTypes.func,
  onRemove: PropTypes.func,
  keys: PropTypes.array.isRequired
};

AlphanumericKeyboard.propTypes = propTypes;

export default AlphanumericKeyboard;
