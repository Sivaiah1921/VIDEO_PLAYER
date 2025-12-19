/* eslint-disable no-console */
/**
 * The LoginContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/LoginContextProvider/LoginContextProvider
 */
import React, { useContext, createContext, useState, useMemo } from 'react';
/**
  * Represents a LoginContextProvider component
  *
  * @method
  * @param { Object } props - React properties passed from composition
  * @returns LoginContextProvider
  */
export const LoginContextProvider = function( { children } ){
  const [subscriber, setSubscriber] = useState( {} )

  const loginContextValue = useMemo( () => ( {
    subscriber, setSubscriber
  } ), [subscriber] )

  return (
    <LoginContext.Provider value={ loginContextValue } >
      { children }
    </LoginContext.Provider>
  )
}

export default LoginContextProvider;

/**
  * Context provider for react reuse
  * @type object
  */
export const LoginContext = createContext();

/**
  * context provider
  * @type object
  */
export const useLoginContext = ( ) => useContext( LoginContext );
