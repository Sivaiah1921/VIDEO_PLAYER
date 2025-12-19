/* eslint-disable no-console */
/**
 * The HistoryContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/HistoryContextProvider/HistoryContextProvider
 */
import React, { useContext, createContext, useRef, useMemo } from 'react';
/**
    * Represents a HistoryContextProvider component
    *
    * @method
    * @param { Object } props - React properties passed from composition
    * @returns HistoryContextProvider
    */
export const HistoryContextProvider = function( { children } ){

  const historyObject = useRef( null )

  const historyContextValue =  useMemo( () => ( {
    historyObject
  } ) )
  return (
    <HistoryContext.Provider value={ historyContextValue } >
      { children }
    </HistoryContext.Provider>
  )
}

export default HistoryContextProvider;

/**
    * Context provider for react reuse
    * @type object
    */
export const HistoryContext = createContext();

/**
    * context provider
    * @type object
    */
export const useHistoryContext = ( ) => useContext( HistoryContext );
