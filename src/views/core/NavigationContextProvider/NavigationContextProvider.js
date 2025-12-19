/* eslint-disable no-console */
/**
 * The NavigationContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/NavigationContextProvider/NavigationContextProvider
 */
import React, { useContext, createContext, useEffect, useState, useRef, useMemo } from 'react';
import { getAuthToken } from '../../../utils/localStorageHelper';
/**
   * Represents a NavigationContextProvider component
   *
   * @method
   * @param { Object } props - React properties passed from composition
   * @returns NavigationContextProvider
   */
export const NavigationContextProvider = function( { children } ){

  const previousPathName = useRef( null )

  useEffect( () => {
    if( !getAuthToken() ){
      previousPathName.current = null
      previousPathName.pageName = null // Added for page source
      previousPathName.tenurePagePath = null
      previousPathName.lastPackIndex = null
      previousPathName.hasAuthenticated = null
      previousPathName.subscriptionRootPage = null
      previousPathName.rootPathContainer = null
      previousPathName.subscriptionPath = null
      previousPathName.fromSideBarToSubcription = false
      previousPathName.isSearch = false
      previousPathName.guestJourneyCTA = ''
    }
  }, [getAuthToken()] )

  useEffect( ()=>{
    previousPathName.showExitPopop = true
    previousPathName.navigationRouting = null
    previousPathName.navigationSubRouting = false
    previousPathName.restoreCardId = null
    previousPathName.dongeAPI = ''
    previousPathName.discoverToHome = false
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanType = null
    previousPathName.selectedPlanCard = null
    previousPathName.paymentSuccess = false
    previousPathName.previousMediaCardFocusBeforeSplash = null
    previousPathName.storeLiveData = []
    previousPathName.storeLiveTitle = ''
    previousPathName.storeLiveSectionSource = ''
    previousPathName.storeLiveId = ''
    previousPathName.loggedInDeviceId = null
    previousPathName.contactUS = ''
    previousPathName.expandedMenu = false
    previousPathName.rentalExpiryTime = ''
    previousPathName.isSearch = false
    previousPathName.isLowerPlanFirstTime = false
    previousPathName.playerPopupButton = ''
    previousPathName.guestJourneyCTA = ''
    previousPathName.playerScreen = ''
  }, [] )

  const navigationContextValue = useMemo( () => ( {
    previousPathName
  } ), [previousPathName] )

  return (
    <NavigationContext.Provider value={ navigationContextValue } >
      { children }
    </NavigationContext.Provider>
  )
}

export default NavigationContextProvider;

/**
   * Context provider for react reuse
   * @type object
   */
export const NavigationContext = createContext();

/**
   * context provider
   * @type object
   */
export const useNavigationContext = ( ) => useContext( NavigationContext );
