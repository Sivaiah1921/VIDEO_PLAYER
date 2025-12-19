/**
 * As an anonymous or authenticated, when on onboarding page I should see number keyboard component if received from the back end services
 *
 * @module views/components/NumberKeyboard
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button/Button';
import './NumberKeyboard.scss';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { modalDom } from '../../../utils/util';
import classNames from 'classnames';

/**
 * Represents a NumberKeyboard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns NumberKeyboard
 */
export const NumberKeyboard = function( props ){
  const previousPathName = useNavigationContext()
  const { onChange, deleteBtnLabel, clearBtnLabel, onClear, onRemove, focusRetain, fromQRLogin } = props;
  const { ref, focused, focusKey, focusSelf } = useFocusable( { saveLastFocusedChild: true } )

  useEffect( ()=>{
    if( !modalDom() ){
      if( !fromQRLogin ){
        focusSelf();
      }
    }
  }, [focusRetain] )

  const keyboardButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map( ( key, i ) => (
    <Button
      key={ key }
      className='NumberKeyboard__key'
      onClick={ () => onChange( key ) }
      label={ key.toString() }
      focusKeyRefrence={ `BUTTON_${key}` }
      onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_${key}` }
    />
  ) );

  return (
    <div className='NumberKeyboard'>
      <FocusContext.Provider value={ focusKey }>
        <div
          className={ classNames( 'NumberKeyboard__row numberKeyboard', `${ !props.enableQrLoginJourney || props.QrError ? 'NumberKeyboard__row__RMN' : 'NumberKeyboard__row__QRLogin' }` ) }
          ref={ ref }
        >
          { keyboardButtons }
        </div>
      </FocusContext.Provider>
      <div className='NumberKeyboard__row buttonRow'>
        <Button
          onClick={ onRemove }
          label={ deleteBtnLabel }
          size='medium'
          iconLeftImage='DeleteNumber'
          iconLeft={ true }
          secondary={ true }
          className='NumberKeyboard__deleteBtn'
          focusKeyRefrence={ 'BUTTON_DELETE_BUTTON' }
          onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_DELETE_BUTTON` }
        />
        <Button
          onClick={ onClear }
          label={ clearBtnLabel }
          size='medium'
          secondary={ true }
          className='NumberKeyboard__clearBtn'
          focusKeyRefrence={ 'BUTTON_CLEAR_BUTTON' }
          onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_CLEAR_BUTTON` }
        />
      </div>
    </div>
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
 * @property {func} onRemove - remove single item from input
 */
export const propTypes = {
  onChange: PropTypes.func,
  deleteBtnLabel: PropTypes.string.isRequired,
  clearBtnLabel: PropTypes.string.isRequired,
  onClear: PropTypes.func,
  onRemove: PropTypes.func
};


NumberKeyboard.propTypes = propTypes;

export default NumberKeyboard;
