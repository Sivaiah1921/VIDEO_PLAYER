/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/**
 * Left nav container for smart tv binge pages that will contain menu items
 *
 * @module views/components/LeftNavContainer
 * @memberof -Common
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useToggle } from '../../../utils/useToggle/useToggle';
import classNames from 'classnames';
import {
  useFocusable,
  FocusContext,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation';
import axios from 'axios';
import LeftNavItem from '../LeftNavItem/LeftNavItem';
import { serviceConst } from '../../../utils/slayer/serviceConst';
import './LeftNavContainer.scss';
import get from 'lodash/get';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { filterPrimaryMenu, filterSecondaryMenu } from '../../../utils/slayer/HomeService';
import { useHistory } from 'react-router-dom';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { COMMON_HEADERS, PAGE_NAME, PAGE_TYPE } from '../../../utils/constants';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { keyCodeForBackFunctionality, modalDom, userIsSubscribed, userIsSubscribedLeftnav } from '../../../utils/util';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
/**
 * Represents a LeftNavContainer component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LeftNavContainer
 */
export const LeftNavContainer = function(){
  const [currentPlan, setCurrentPlan] = useState( null );
  const [primaryMenu, setPrimaryMenu] = useState( [] );
  const [secondaryMenu, setSecondaryMenu] = useState( [] );

  const mouseEntryRef = useRef( false )
  const filteredPrimaryMenuRef = useRef( [] )

  const { setIsExpandedMenu, sidebarList, setSidebarList, customPageType, setCustomPageType, defaultPageType, setDefaultPageType } = useHomeContext()
  const previousPathName = useNavigationContext()
  const { railsRestoreId, screenSaverVisible, scrollLeftMenu, successFullPlanPurchasePubnub } = useMaintainPageState() || null
  const history = useHistory();
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const { ref, focusKey } = useFocusable( {
    saveLastFocusedChild: false,
    autoRestoreFocus: false,
    focusKey: 'LEFT_NAV_CONTAINER'
  } );

  const nonDiscoverPages = [PAGE_NAME.SEARCH, PAGE_NAME.ACCOUNT, 'plan/current', 'Account-Login', 'login', 'binge-list']

  const [expandedMenu, setExpandedMenu] = useToggle( false );

  useEffect( () => {
    const url = `${process.env.REACT_APP_APIPATH}/${serviceConst.LEFT_MENU_URL}`;
    axios.get( url, { headers: { appVersion: COMMON_HEADERS.VERSION } } )
      .then( ( { data } ) => {
        setSidebarList( data )
      }
      )
      .catch( ( error ) => {
        console.error( 'Sidebar list fetch failed:', error );
      } );
  }, [] );

  const menuItems = useMemo( () => get( sidebarList, 'data.items', [] ), [sidebarList] );


  const { priMenu, secMenu, isSubscribed } = useMemo( () => {
    const index = menuItems && Array.isArray( menuItems ) && menuItems.length > 0 ?
      menuItems.findIndex( ( m ) => m.separator ) :
      -1;

    let primary = [];
    let secondary = [];

    if( index > 0 ){
      primary = menuItems.slice( 0, index );
      secondary = menuItems.slice( index );
    }
    else if( index === 0 ){
      primary = menuItems.slice( 0, index + 1 );
      secondary = menuItems.slice( index + 1 );
    }
    else if( index === -1 ){
      primary = menuItems;
      secondary = [];
    }

    const isSubscribed = userIsSubscribedLeftnav( myPlanProps, responseSubscription?.error )?.subscribe;

    const priMenu = primary.length > 0 ? filterPrimaryMenu( primary, isSubscribed ) : primary;
    const secMenu = secondary.length > 0 ? filterSecondaryMenu( secondary ) : secondary;

    return { priMenu, secMenu, isSubscribed };
  }, [menuItems, myPlanProps, responseSubscription?.error] );

  useEffect( () => {
    if( myPlanProps || responseSubscription?.error ){
      if( !!isSubscribed && successFullPlanPurchasePubnub.current ){
        const filteredPriMenu = priMenu.filter( item => item.pageName !== 'Subscribe' );
        filteredPrimaryMenuRef.current = filteredPriMenu;
        setPrimaryMenu( [] );
      }
      else {
        setPrimaryMenu( priMenu );
      }
      setSecondaryMenu( secMenu );
      setCurrentPlan( isSubscribed );
    }
  }, [priMenu, secMenu, isSubscribed, myPlanProps, responseSubscription?.error] );



  useEffect( ()=>{
    if( filteredPrimaryMenuRef.current.length > 0 ){
      setPrimaryMenu( filteredPrimaryMenuRef.current );
      filteredPrimaryMenuRef.current = []
    }
  }, [primaryMenu] )

  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( keyCodeForBackFunctionality( keyCode ) ){
      if( screenSaverVisible.current || modalDom() ){
        return null;
      }
      if( window.location.pathname.includes( PAGE_TYPE.HOME ) && !previousPathName.navigationRouting?.includes( PAGE_TYPE.OTHER_CATEGORIES ) ){
        setExpandedMenu( true );
        previousPathName.navigationRouting = null
      }
      if( window.location.pathname.includes( PAGE_TYPE.HOME ) && previousPathName.navigationRouting?.includes( PAGE_TYPE.OTHER_CATEGORIES ) ){
        history.goBack();
        railsRestoreId.current = null
        previousPathName.navigationRouting = null
      }
      if( window.location.pathname.includes( PAGE_TYPE.OTHER_CATEGORIES ) ){
        // previousPathName.showExitPopop = true
        setExpandedMenu( true );
      }
      if( document.querySelector( '.LeftNavContainer__divider' ) === null && previousPathName.showExitPopop ){
        history.push( '/app-exit-screen' )
      }
    }
  }, [screenSaverVisible] );

  useEffect( () => {
    setIsExpandedMenu( expandedMenu );
    if( expandedMenu ){
      previousPathName.showExitPopop = true
      railsRestoreId.current = null
      if( previousPathName.current === '/splash' ){
        setExpandedMenu( false )
        setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
        previousPathName.current = null
      }
      else {
        setTimeout( ()=>{
          // !!previousPathName.focusedItem === false ? setFocus( `FOCUSED_${defaultPageType}` ) : setFocus( `FOCUSED_${previousPathName.focusedItem}` ) // keeping this line for future reference
          if( !modalDom() ){
            setFocus( `FOCUSED_${defaultPageType}` )
          }
          previousPathName.focusedItem = null
          if( ref.current ){
            ref.current.scrollTop = scrollLeftMenu.current - ref.current.clientHeight / 2
          }
        }, 100 )
      }
    }
    else {
      previousPathName.showExitPopop = false
    }
  }, [expandedMenu] );

  useEffect( () => {
    if( nonDiscoverPages.includes( previousPathName.focusedItem ) ){
      if( previousPathName.discoverToHome ){
        setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
        previousPathName.current = '/discover'
        previousPathName.focusedItem = false
        previousPathName.discoverToHome = false
      }
      else {
        setExpandedMenu( true )
      }
    }
    // else if( pageType === PAGE_TYPE.BINGE_LIST ){
    //   if( previousPathName.discoverToHome ){
    //     previousPathName.current = '/discover'
    //   }
    //   else {
    //     /** This implementation is according to https://tatasky-binge-infinite.atlassian.net/browse/TSLS-1950 */
    //     // setExpandedMenu( true )
    //   }
    // }
  }, [] );

  const visibilitychangeForLeftNav = () => {
    if( document.visibilityState === 'visible' ){
      document.addEventListener( 'visibilitychange', () => setExpandedMenu( true ) )
    }
  }

  useEffect( () => {
    document.addEventListener( 'visibilitychange', visibilitychangeForLeftNav() );
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      document.removeEventListener( 'visibilitychange', () => visibilitychangeForLeftNav() );
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  const onRailFocus = useCallback( ( { ...rest } ) => {
    if( !mouseEntryRef.current ){
      scrollLeftMenu.current = rest.top
      if( ref.current ){
        ref.current.scrollTop = rest.top - ref.current.clientHeight / 2
      }
    }
  }, [ref, mouseEntryRef.current] )


  const onMouseEnterFn = useCallback( () => {
    expandedMenu && setExpandedMenu( true )
  }, [] )

  const onMouseEnterpageFn = useCallback( () => {
    mouseEntryRef.current = true
  }, [] )

  const onMouseLeavepageFn = useCallback( () =>{
    mouseEntryRef.current = false
  }, [] )

  const onMouseLeaveFn = useCallback( () => {
    setExpandedMenu( false )
  }, [] )

  const onMouseEnterCallBackFn = useCallback( ( id ) => {
    setFocus( `FOCUSED_${id}` )
  }, [] )

  const onMouseLeaveCallBackFn = useCallback( ( id ) =>{
    setFocus( `FOCUSED_${customPageType}` )
  }, [] )

  useEffect( () => {
    const getMouseStateChange = ( event ) =>{
      if( event.detail && event.detail.visibility ){
        mouseEntryRef.current = true
      }
      else {
        mouseEntryRef.current = false
      }
    }
    document.addEventListener( 'cursorStateChange', getMouseStateChange )
    return () => {
      document.removeEventListener( 'cursorStateChange', getMouseStateChange );
    };
  }, [] );

  const getClassNamepagetype = ( menuItem ) => {
    if( menuItem.pageName === 'Subscribe' ){
      return 'LeftNavContainer__subscriptionIcon'
    }
    else if( menuItem.pageName === 'Login' ){
      return 'LeftNavContainer__loginIcon'
    }
  }
  const renderedMenus = useMemo( () => {
    if( !menuItems.length || !sidebarList ){
      return null;
    }

    const primaryMenuJSX = primaryMenu.length > 0 && (
      <ul className='LeftNavContainer__primaryMenu'>
        <li style={ { height: '1px' } }>
          <LeftNavItem
            expandedMenu={ expandedMenu }
            setExpandedMenu={ setExpandedMenu }
            focusKeyRefrence={ 'NonFocusableItem' }
          />
        </li>
        { primaryMenu.map( ( menuItem, index ) => (
          <li
            key={ index }
            className={ `LeftNavContainer__${menuItem.sidebarSpace ? 'addedExtraSpace' : ''} ${getClassNamepagetype( menuItem )}` }
          >
            <LeftNavItem
              pageType={ menuItem.pageType }
              activeImage={ menuItem.activeImage }
              inActiveImage={ menuItem.inActiveImage }
              label={ menuItem.pageName }
              expandedMenu={ expandedMenu }
              setExpandedMenu={ setExpandedMenu }
              onRailFocus={ onRailFocus }
              skipDiscover={ menuItem.skipDiscover }
              focusKeyRefrence={ `FOCUSED_${menuItem.pageType}` }
              totalItems={ primaryMenu }
              onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( menuItem.pageType ) }
              onMouseLeaveCallBackFn={ () => onMouseLeaveCallBackFn( menuItem.pageType ) }
            />
          </li>
        ) ) }
      </ul>
    );

    const secondaryMenuJSX = secondaryMenu.length > 0 && (
      <ul
        className={ classNames( 'LeftNavContainer__secondaryMenu', {
          'LeftNavContainer__secondaryMenu--small': !expandedMenu
        } ) }
      >
        { secondaryMenu.map( ( menuItem, index ) => (
          <li
            key={ index }
            className={ `LeftNavContainer__${menuItem.sidebarSpace ? 'addedExtraSpace' : ''}` }
          >
            <LeftNavItem
              pageType={ menuItem.pageType }
              activeImage={ menuItem.activeImage }
              inActiveImage={ menuItem.inActiveImage }
              label={ menuItem.pageName }
              expandedMenu={ expandedMenu }
              setExpandedMenu={ setExpandedMenu }
              onRailFocus={ onRailFocus }
              skipDiscover={ menuItem.skipDiscover }
              focusKeyRefrence={ `FOCUSED_${menuItem.pageType}` }
              onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( menuItem.pageType ) }
              onMouseLeaveCallBackFn={ () => onMouseLeaveCallBackFn( menuItem.pageType ) }
            />
          </li>
        ) ) }
      </ul>
    );

    return (
      <>
        { primaryMenuJSX }
        { secondaryMenuJSX }
      </>
    );
  }, [
    primaryMenu,
    secondaryMenu,
    expandedMenu,
    setExpandedMenu
  ] );


  return (
    <div className='LeftNavContainer'
      onMouseEnter={ onMouseEnterpageFn }
      onMouseLeave={ onMouseLeavepageFn }
    >
      <FocusContext.Provider value={ focusKey }>
        <div className='LeftNavContainer__wrapper'>
          <nav
            className={ classNames( 'LeftNavContainer__navigation', {
              'LeftNavContainer__expanded': expandedMenu
            } ) }
            aria-label={ 'Menu' }
            ref={ ref }
            onMouseEnter={ onMouseEnterFn }
            onMouseLeave={ onMouseLeaveFn }
          >
            <InfiniteScroll
              dataLength={ primaryMenu.length }
              scrollableTarget='scrollContainer'
            >
              { renderedMenus }
            </InfiniteScroll>
          </nav>
        </div>
      </FocusContext.Provider>
    </div>
  );
};

/**
 * Property type definitions
 *
 * @type {object}
 * @property {array} navList - navList
 * @property {string} openAriaLabel - openAriaLabel
 * @property {string} closeAriaLabel - closeAriaLabel
 * @property {string} navAriaLabel - navAriaLabel
 */
export const propTypes = {
  navList: PropTypes.array,
  openAriaLabel: PropTypes.string,
  closeAriaLabel: PropTypes.string,
  navAriaLabel: PropTypes.string
};

LeftNavContainer.propTypes = propTypes;

export default LeftNavContainer;