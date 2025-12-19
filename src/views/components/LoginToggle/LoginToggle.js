/**
 * Component for login page toggle for phone and remote
 *
 * @module views/components/LoginToggle
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import './LoginToggle.scss';
import Text from '../Text/Text';
import Checkbox from '../Checkbox/Checkbox';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
/**
 * Represents a LoginToggle component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LoginToggle
 */
export const LoginToggle = function( { onChangeHandler, checked, loginMethodOne, loginMethodTwo, title } ){

  const { ref, focusKey, focusSelf } = useFocusable();
  useEffect( () => {
    focusSelf()
  }, [] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }
        className='LoginToggle'
      >
        <div className='LoginToggle__container'>
          <div className='LoginToggle__title'>
            <Text textStyle='header-2'>
              { title }
            </Text>
          </div>
          <div className='LoginToggle__checkbox'>
            <Checkbox
              onChange={ onChangeHandler }
              id={ 'switcher' }
              name={ 'switcher' }
              checked={ checked }
              toggleButton={ true }
              switchLogin={ true }
              secondary
              focusKeyRefrence={ 'LOGIN_TOGGLE' }
              loginMethodOne={ loginMethodOne }
              loginMethodTwo={ loginMethodTwo }
            />
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default LoginToggle;
