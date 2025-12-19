/**
 * The ProfileContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/ProfileContextProvider/ProfileContextProvider
 */
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { getAuthToken, setPreferredLanguage } from '../../../utils/localStorageHelper';
import { ProfileAPICall } from '../../../utils/slayer/MyAccountService';

/**
   * Represents a ProfileContextProvider component
   *
   * @method
   * @param { Object } props - React properties passed from composition
   * @returns ProfileContextProvider
   */
export const ProfileContextProvider = function( { children } ){
  const [profileAPIResult, setProfileAPIResult] = useState( {} )
  const [response, setResponse] = useState( {} )

  const [profileData] = ProfileAPICall();
  const { fetchProfile, profileResponse, profileError, profileLoading } = profileData || {}

  useEffect( () => {
    if( profileAPIResult && Object.keys( profileAPIResult ).length > 0 ){
      fetchProfile();
    }
  }, [profileAPIResult] );

  useEffect( () => {
    if( getAuthToken() ){
      fetchProfile()
    }
  }, [] )

  useEffect( () =>{
    if( profileResponse ){
      profileResponse.data && profileResponse.data.languageList?.length > 0 && setPreferredLanguage( profileResponse.data.languageList.map( item => JSON.stringify( item.id ) ) )
      setResponse( profileResponse )
    }
  }, [profileResponse] )

  const profileContextValue = useMemo( () => ( {
    profileAPIResult: response,
    setProfileAPIResult,
    setResponse,
    profileLoading
  } ), [response, setProfileAPIResult, setResponse, profileLoading] );

  return (
    <ProfileContext.Provider value={ profileContextValue } >
      { children }
    </ProfileContext.Provider>
  )
}

export default ProfileContextProvider;

/**
   * Context provider for react reuse
   * @type object
   */
export const ProfileContext = createContext();

/**
   * context provider
   * @type object
   */
export const useProfileContext = ( ) => useContext( ProfileContext );
