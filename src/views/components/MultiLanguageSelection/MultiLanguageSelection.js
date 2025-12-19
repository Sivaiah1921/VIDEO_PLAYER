/**
 * Component for single language card for selection
 *
 * @module views/components/MultiLanguageSelection
 * @memberof -Common
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Image from '../Image/Image';
import Text from '../Text/Text';
import './MultiLanguageSelection.scss';
import Checkbox from '../Checkbox/Checkbox';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
/**
 * Represents a MultiLanguageSelection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns MultiLanguageSelection
 */
export const MultiLanguageSelection = function( props ){
  const {
    bgImg,
    title,
    letterImg,
    isChecked,
    value,
    onSelected,
    id,
    focusKeyRefrence,
    languageSelectedLen,
    setShowNotification,
    setMessage,
    defaultSelectList,
    onFocus,
    celebrityImage,
    vernacularLanguageImage
  } = props;

  const [celebrityImageLoaded, setCelebrityImageLoaded] = useState( false )
  const [vernacularLanguageImageLoaded, setVernacularLanguageImageLoaded] = useState( false )
  const { url } = useAppContext();
  const checkboxRef = useRef( )
  const { ref, focused, focusKey, focusSelf } = useFocusable( {
    onEnterPress:( )=>{
      if( languageSelectedLen === 4 && checkboxRef.current.checked !== true ){
        setShowNotification( true )
        setMessage( 'You can select a maximum of 4 languages' )
      }
      if( !checkboxRef.current.checked && languageSelectedLen <= 3 ){
        defaultSelectList === 4 ? ( languageSelectedLen <= 3 ? checkboxRef.current.checked = true : checkboxRef.current.checked = false ) : checkboxRef.current.checked = true
        onSelected( checkboxRef.current.id, checkboxRef.current.checked, id )
      }
      else {
        checkboxRef.current.checked = false
        onSelected( checkboxRef.current.id, checkboxRef.current.checked, id )
      }
    },
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onFocus
  } )

  const onMouseUpCallFn = ()=> {
    if( languageSelectedLen === 4 && checkboxRef.current.checked !== true ){
      setShowNotification( true )
      setMessage( 'You can select a maximum of 4 languages' )
    }
    if( !checkboxRef.current.checked && languageSelectedLen <= 3 ){
      defaultSelectList === 4 ? ( languageSelectedLen <= 3 ? checkboxRef.current.checked = true : checkboxRef.current.checked = false ) : checkboxRef.current.checked = true
      onSelected( checkboxRef.current.id, checkboxRef.current.checked, id )
    }
    else {
      checkboxRef.current.checked = false
      onSelected( checkboxRef.current.id, checkboxRef.current.checked, id )
    }

  }

  return (
    <div className={
      classNames( 'MultiLanguageSelection', {
        'MultiLanguageSelection--withFocus': focused
      } ) }
    role='button'
    tabIndex='0'
    ref={ ref }
    onMouseEnter={ props?.onMouseEnterCallBackFn }
    onMouseUp={ onMouseUpCallFn }
    >
      <div className='MultiLanguageSelection__leftSection'>
        <Checkbox
          id={ title }
          name={ title }
          label={ title }
          checked={ isChecked }
          value={ value }
          isCustom={ true }
          checkboxRef={ checkboxRef }
          onChange={ () => {} }
        >
        </Checkbox>
        <div className='MultiLanguageSelection__leftSection--title'>
          <Text
            color={ 'white' }
            textStyle={ 'subtitle-1' }
          >
            { title }
          </Text>
          <div className='MultiLanguageSelection__leftSection--img'>
            <img
              className={ vernacularLanguageImageLoaded ? 'imageLoaded' : 'imageLoading' }
              src={ `${ url}c_scale,f_auto,q_auto:best,w_100/${ vernacularLanguageImage }` }
              alt={ title }
              onLoad={ () => setVernacularLanguageImageLoaded( true ) }
            />
          </div>
        </div>
      </div>
      <div className='MultiLanguageSelection__rightSection'>
        <img
          className={ celebrityImageLoaded ? 'imageLoaded' : 'imageLoading' }
          src={ `${ url}c_scale,f_auto,q_auto:best,w_150/${ celebrityImage }` }
          alt={ title }
          onLoad={ () => setCelebrityImageLoaded( true ) }
        />
      </div>

    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} bgImg - Language background image url
 * @property {string} letterImg - Language letter image ur
 * @property {string} title - Language title
 * @property {bool} isChecked - language selection value
 */
export const propTypes =  {
  bgImg: PropTypes.string,
  letterImg: PropTypes.string,
  title: PropTypes.string,
  isChecked: PropTypes.bool
};

MultiLanguageSelection.propTypes = propTypes;

export default MultiLanguageSelection;
