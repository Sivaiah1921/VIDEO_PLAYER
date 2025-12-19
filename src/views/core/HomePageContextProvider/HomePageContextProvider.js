/* eslint-disable no-console */
/**
 * The HomePageContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/HomePageContextProvider/HomePageContextProvider
 */
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { getDeviceLaunchCount, setBingeListFlagLocal, setCatalogFlagLocal, setLiveFlagLocal, setSearchFlagLocal } from '../../../utils/localStorageHelper';
import { PAGE_TYPE } from '../../../utils/constants';
/**
 * Represents a HomePageContextProvider component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns HomePageContextProvider
 */
export const HomePageContextProvider = function( { children } ){
  const [sidebarList, setSidebarList] = useState( {} )
  const [catalogFlag, setCatalogFlag] = useState( false );
  const [contentParams, setContentParams] =  useState( {} )
  const [customPageType, setCustomPageType] = useState( null )
  const [defaultPageType, setDefaultPageType] = useState( PAGE_TYPE.DONGLE_HOMEPAGE )
  const [bingeListFlag, setBingeListFlag] = useState( false )
  const [searchFlag, setSearchFlag] = useState( false )
  const [liveSearchFlag, setLiveSearchFlag] = useState( false )
  const [isExpandedMenu, setIsExpandedMenu] = useState( false );
  const [isFav, setIsFav] = useState( false );
  const [isCWRail, setIsCWRail] = useState( false );
  const [isPageClicked, setIspageClicked] = useState( false );
  const [isTvod, setIsTvod] = useState( false );
  const [numberPressed, setNumberPressed] = useState( {} )
  const [launchCount, setLaunchCount] = useState( getDeviceLaunchCount() )
  const [isWatchListUpdated, setIsWatchListUpdated] = useState( false )
  const [isValidCheckSum, setIsValidCheckSum] = useState( true ) // TODO: need to set false in next release, reverting for Jan release
  const [editable, setEditable] = useState( false )
  const [contentInfo, setContentInfo] = useState( '' )

  useEffect( ( ) => {
    setCatalogFlagLocal( catalogFlag )
  }, [catalogFlag] )


  useEffect( ( ) => {
    setSearchFlagLocal( searchFlag )
  }, [searchFlag] )


  useEffect( ( ) => {
    setBingeListFlagLocal( bingeListFlag )
  }, [bingeListFlag] )

  useEffect( ( ) => {
    setLiveFlagLocal( liveSearchFlag )
  }, [liveSearchFlag] )

  const homePageContextValue = useMemo( () => ( {
    sidebarList, setSidebarList,
    contentParams, setContentParams,
    catalogFlag, setCatalogFlag,
    customPageType, setCustomPageType,
    defaultPageType, setDefaultPageType,
    bingeListFlag, setBingeListFlag,
    searchFlag, setSearchFlag,
    liveSearchFlag, setLiveSearchFlag,
    isExpandedMenu, setIsExpandedMenu,
    isFav, setIsFav,
    isCWRail, setIsCWRail,
    isPageClicked, setIspageClicked,
    isTvod, setIsTvod,
    numberPressed, setNumberPressed,
    launchCount, setLaunchCount,
    isWatchListUpdated, setIsWatchListUpdated,
    isValidCheckSum, setIsValidCheckSum,
    editable, setEditable,
    contentInfo, setContentInfo
  } ), [
    sidebarList,
    contentParams,
    catalogFlag,
    customPageType,
    defaultPageType,
    bingeListFlag,
    searchFlag,
    liveSearchFlag,
    isExpandedMenu,
    isFav,
    isCWRail,
    isPageClicked,
    isTvod,
    numberPressed,
    launchCount,
    isWatchListUpdated,
    isValidCheckSum,
    editable,
    contentInfo
  ] );


  return (
    <HomePageContext.Provider
      value={ homePageContextValue }
    >
      { children }
    </HomePageContext.Provider>
  )
}

export default HomePageContextProvider;

/**
 * Context provider for react reuse
 * @type object
 */
export const HomePageContext = createContext();

/**
 * context provider
 * @type object
 */
export const useHomeContext = ( ) => useContext( HomePageContext );
