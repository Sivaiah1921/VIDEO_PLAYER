/**
 * The UserContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/UserContextProvider/UserContextProvider
 */
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { getAuthToken } from '../../../utils/localStorageHelper';


/**
 * Represents a UserContextProvider component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns UserContextProvider
 */
export const UserContextProvider = function( { children } ){

  const [user, setUser] = useState(
    {
      firstName: 'TataSky',
      userType: 'Platinum',
      authorization: getAuthToken()
    } );

  useEffect( () => {
    setUser( {} );
  }, [] );

  const useContextValue = useMemo( () => ( {
    user, setUser
  } ), [user] )

  return (
    <UserContext.Provider value={ useContextValue } >
      { children }
    </UserContext.Provider>
  )
}

export default UserContextProvider;

/**
 * Context provider for react reuse
 * @type object
 */
export const UserContext = createContext();

/**
 * context provider
 * @type object
 */
export const useUserContext = ( ) => useContext( UserContext );
