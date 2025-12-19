/**
 * loader
 *
 * @module views/components/Loader
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import Image from '../Image/Image';
import './Loader.scss';
import classNames from 'classnames';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import { modalDom } from '../../../utils/util';

/**
 * Represents a loader component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Loader
 */
export const Loader = function( props ){
  const loaderPath = `${window.assetBasePath}loader.gif`;
  const { ref, focused, focusKey, focusSelf } = useFocusable( {
    focusKey:'LOADER',
    isFocusBoundary: true
  } )

  useEffect( ()=>{
    if( !props.isPlayer && !modalDom() ){
      focusSelf()
    }
  }, [] )
  return (
    <FocusContext.Provider value={ focusKey }>
      <div className={
        classNames( 'Loader', {
          'Loader__bottom': props.align,
          'Loader__playerBgColor': props.playerBgColor
        } )
      }
      ref={ ref }
      >
        <div className={ classNames( 'Loader__content', { 'playerLoader': props.isPlayer } ) }>
          <Image
            src={ loaderPath }
          />
          <Button focusKeyRefrence='LOADER_BUTTON'/>
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default Loader;
