/**
 * This hook is used to toogle the Previous/Intial State provided.It can be Used with Different Components by passing the Boolean Value.It will return the Toggled Value
 *
 * @module utils/Toggle
 */

import { useCallback, useState } from 'react';

/**
 * Returns toggled value of the Previous/Intial Stated when it is called
 *
 * @method
 * @returns { boolean }
 */
export const useToggle = function( initialState = false ){

  const [state, setState] = useState( initialState );
  const toggle = useCallback( () => setState( state => !state ), [] );

  return [state, toggle]
}
