/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * LeftNavItem component is used by other module as a resuable which  returns the ui for LeftNavItem
 *
 * @module views/components/LeftNavItem
 * @memberof -Common
 */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Link from '../Link/Link';
import Text from '../Text/Text';
import Image from '../Image/Image';
import './LeftNavItem.scss';
import { useHistory } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { homeSubscribeClick, leftMenuOptionClicked, page_click, subMenuOptionClicked } from '../../../utils/mixpanel/mixpanelService';
import { getAgeRating, getAuthToken, getBaID } from '../../../utils/localStorageHelper';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import constants, { PAGE_NAME, PAGE_TYPE, SUBMENU_MIXPANEL } from '../../../utils/constants';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { setMixpanelData, userIsSubscribedLeftnav, getMixpanelData } from '../../../utils/util';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';

/**
 * Represents a LeftNavItem component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LeftNavItem
 */
export const LeftNavItem = function( props ){
  const [currentPlan, setCurrentPlan] = useState( {} );

  const { setMetaData } = usePlayerContext()
  const { setCustomPageType, customPageType, defaultPageType, setDefaultPageType, setIspageClicked } = useHomeContext()
  const responseSubscription = useSubscriptionContext( );
  const { setBaid } = useSubscriptionContext( ) || {};
  const previousPathName = useNavigationContext()
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const history = useHistory();
  const { expandedMenu, setExpandedMenu, onRailFocus, focusKeyRefrence, totalItems } = props;
  const pathname = props.skipDiscover ? `/${props.pageType}` : `/discover/${props.pageType}`;
  const nonDiscoverPages = [PAGE_NAME.SEARCH, PAGE_NAME.ACCOUNT, 'plan/current', 'Account-Login', 'login', 'binge-list', 'binge list']
  const { railsRestoreId, setSearchTotalData, storeRailData, fromSideMenuSubscribe, setIsLoginToggle, selectedpartnerId, optionBba } = useMaintainPageState() || null

  const { url } = useAppContext();

  const redirectionToSpecificScreen = () => {
    if( pathname.includes( PAGE_TYPE.ACCOUNT ) || pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) ){
      selectedpartnerId.current = ''
    }
    if( pathname.includes( PAGE_TYPE.ACCOUNT_LOGIN ) ){
      setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.MY_ACCOUNT )
      setIsLoginToggle( true )
      return '/login'
    }
    else if( pathname.includes( 'current' ) ){
      if( getAuthToken() ){
        homeSubscribeClick()
        if( getAgeRating() && getAgeRating() !== 'No Restriction' ){
          previousPathName.current = window.location.pathname
          return '/device/fourDigitParentalPinSetup'
        }
        else if( currentPlan ){
          subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_SUBSCRIBE )
          return currentPlan.direction
        }
      }
      else {
        subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_SUBSCRIBE )
        setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.SUBMENU_SUBSCRIBE )
        homeSubscribeClick()
        fromSideMenuSubscribe.current = true
        setIsLoginToggle( true )
        return '/login'
      }
    }
    else {
      pathname.includes( PAGE_TYPE.LOGIN ) && (
        setIsLoginToggle( true ),
        subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_LOGIN ),
        setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.LEFT_MENU )
      )
      pathname.includes( PAGE_TYPE.ACCOUNT ) && (
        setBaid( 0 ),
        setTimeout( () => {
          setBaid( getBaID() )
        }, 0 )
      )
      pathname.includes( PAGE_TYPE.BINGE_LIST ) && (
        subMenuOptionClicked( SUBMENU_MIXPANEL.SUBMENU_BINGELIST )
      )
      return pathname
    }
  }

  const { ref, focused } = useFocusable( {
    onArrowPress: ( direction ) => {
      const myArray = focusKeyRefrence.slice( 8 );
      if( direction === 'up' && totalItems !== undefined ){
        if( totalItems[0].pageType.toUpperCase() === myArray.toUpperCase() ){
          return false;
        }
        else {
          return true
        }
      }
      if( direction === 'left' ){
        return false;
      }
      else if( direction === 'right' ){
        setExpandedMenu( false );
        return true;
      }
      return true;
    },
    onEnterPress:()=>{
      setMetaData( {} )
      if( props.pageType?.includes( 'DONGLE' ) ){
        storeRailData.leftMenuClicked = props.label;
        setMixpanelData( 'playerSource', props.label )
        setMixpanelData( 'letfMenuClick', props.label?.toUpperCase() )
        storeRailData.leftMenuClickedWithDongle = props.label
        setCustomPageType( props.pageType )
        setDefaultPageType( props.pageType )
        previousPathName.dongeAPI = props.pageType
        setIspageClicked( true )
      }
      if( props.pageType?.includes( 'other-categories' ) ){
        setDefaultPageType( props.pageType )
      }

      previousPathName.navigationRouting = null
      // setRailsRestoreId( null )
      railsRestoreId.current = null;
      // Todo: remove
      // history.push( {
      //   pathname: pathname,
      //   args: {
      //     title: props.title,
      //     pageType: props.pageType
      //   }
      // } )
      window.location.pathname === '/discover' && props.pageType === PAGE_TYPE.DONGLE_HOMEPAGE ? null :
        history.push( {
          pathname: redirectionToSpecificScreen(),
          args: {
            title: props?.title,
            pageType: props.pageType
          }
        } )

      if( !nonDiscoverPages.includes( props.pageType ) ){
        previousPathName.current = '/discover'
        previousPathName.subscriptionPath = null
      }

      if( nonDiscoverPages.includes( props.pageType ) ){
        previousPathName.focusedItem = props.pageType
      }

      if( props.pageType === 'binge-list' ){
        previousPathName.current = '/binge-list'
        previousPathName.subscriptionPath = null
      }
      else if( props.pageType === 'login' ){
        previousPathName.current = '/login'
        previousPathName.subscriptionPath = null
        fromSideMenuSubscribe.current = false;
      }
      else if( props.pageType === 'Account-Login' ){
        previousPathName.current = '/Account-Login'
        previousPathName.subscriptionPath = null
      }
      else if( props.pageType === 'Search' ){
        previousPathName.current = '/Search'
        previousPathName.subscriptionPath = null
        setSearchTotalData( [] )
      }
      else if( props.pageType === 'plan/current' ){
        previousPathName.navigationRouting = null
        previousPathName.fromSideBarToSubcription = true
        previousPathName.current = 'plan/current'
      }

      /* Mixpanel-event */
      page_click( props.label )
      leftMenuOptionClicked( props.label, props.pageType )
      const formattedNonDiscoverPages = nonDiscoverPages.map( item => item[0].toLowerCase() + item.slice( 1 ) );
      previousPathName.selectedDefaultPageType = !formattedNonDiscoverPages.includes( props.label?.toLowerCase() ) && props.label
      setMixpanelData( 'optionValue', optionBba ? 'NA' : window.location.pathname.includes( '/discover' ) ? ( previousPathName.selectedDefaultPageType || PAGE_NAME.HOME ) : getMixpanelData( 'optionValue' ) );
      setMixpanelData( 'browsepagename', props.label?.toUpperCase() )
      setExpandedMenu( false );
      previousPathName.discoverToHome = false
    },
    onFocus: ( props ) => {
      !expandedMenu && setExpandedMenu( true );
      onRailFocus && onRailFocus( props )
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const onMouseEnterFn = () => {
    setMetaData( {} )
    if( props.pageType?.includes( 'DONGLE' ) ){
      storeRailData.leftMenuClicked = props.label;
      setMixpanelData( 'playerSource', props.label )
      setMixpanelData( 'letfMenuClick', props.label?.toUpperCase() )
      storeRailData.leftMenuClickedWithDongle = props.label
      setCustomPageType( props.pageType )
      setDefaultPageType( props.pageType )
      previousPathName.dongeAPI = props.pageType
      setIspageClicked( true )
    }

    window.location.pathname === '/discover' && props.pageType === PAGE_TYPE.DONGLE_HOMEPAGE ? null :
      history.push( {
        pathname: redirectionToSpecificScreen(),
        args: {
          title: props?.title,
          pageType: props.pageType
        }
      } )
    if( !nonDiscoverPages.includes( props.pageType ) ){
      previousPathName.current = '/discover'
      previousPathName.subscriptionPath = null
    }
    if( nonDiscoverPages.includes( props.pageType ) ){
      previousPathName.focusedItem = props.pageType
    }

    if( props.pageType === 'binge-list' ){
      previousPathName.current = '/binge-list'
      previousPathName.subscriptionPath = null
    }
    else if( props.pageType === 'login' ){
      previousPathName.current = '/login'
      previousPathName.subscriptionPath = null
    }
    else if( props.pageType === 'Account-Login' ){
      previousPathName.current = '/Account-Login'
      previousPathName.subscriptionPath = null
    }
    else if( props.pageType === 'Search' ){
      previousPathName.current = '/Search'
      previousPathName.subscriptionPath = null
      setSearchTotalData( [] )
    }
    else if( props.pageType === 'plan/current' ){
      previousPathName.navigationRouting = null
      previousPathName.fromSideBarToSubcription = true
      previousPathName.current = 'plan/current'
    }

    /* Mixpanel-event */
    page_click( props.label )
    leftMenuOptionClicked( props.label, props.pageType )
    previousPathName.discoverToHome = false
    const formattedNonDiscoverPages = nonDiscoverPages.map( item => item[0].toLowerCase() + item.slice( 1 ) );
    previousPathName.selectedDefaultPageType = !formattedNonDiscoverPages.includes( props.label?.toLowerCase() ) && props.label
  }

  useEffect( ()=>{
    if( myPlanProps ){
      const isSubscribed = userIsSubscribedLeftnav( myPlanProps )
      setCurrentPlan( isSubscribed )
    }
  }, [myPlanProps] )

  useEffect( () =>{
    if( previousPathName.expandedMenu === true && expandedMenu ){
      setExpandedMenu( false )
      previousPathName.expandedMenu = false
    }
  }, [previousPathName.expandedMenu] )

  useEffect( () =>{
    if( expandedMenu && !focused ){
      previousPathName.expandedMenu = false
    }
  }, [expandedMenu, focused] )


  const renderImages = ( label ) => {
    if( label === 'Login' ){
      return label
    }
    else if( label === 'Subscribe' || label === 'My Plan' ){
      return 'CrownGoldForward60x60'
    }
  }

  const getActiveImage = ( activeImg ) => {
    let imageUrl = activeImg;
    if( url && url.includes( 'cloudinary' ) ){
      imageUrl = `${url}c_scale,f_auto,q_auto/` + activeImg;
    }
    else if( url && url.includes( 'mediaready' ) ){
      imageUrl = `${url}f_auto,q_auto/` + activeImg;
    }
    else {
      imageUrl = 'https://mediaready.videoready.tv/tatasky/image/fetch/f_auto,q_auto/' + activeImg;
    }
    return imageUrl;
  }

  const getInactiveImage = ( inactiveImg ) => {
    let imageUrl = inactiveImg;
    if( url && url.includes( 'cloudinary' ) ){
      imageUrl = `${url}c_scale,f_auto,q_auto/` + inactiveImg;
    }
    else if( url && url.includes( 'mediaready' ) ){
      imageUrl = `${url}f_auto,q_auto/` + inactiveImg;
    }
    else {
      imageUrl = 'https://mediaready.videoready.tv/tatasky/image/fetch/f_auto,q_auto/' + inactiveImg;
    }
    return imageUrl;
  }
  return (
    <div className='LeftNavItem'
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseLeave={ props?.onMouseLeaveCallBackFn }
      onMouseUp={ onMouseEnterFn }
    >
      { /*
        FocussableObj div required for spatial navigation purpose
      */ }
      <div className='LeftNavItem__FocussableObj'
        ref={ ref }
      ></div>
      <Link
        url={ `/discover/${props.pageType}` }
        className={ ( props.pageType === defaultPageType ) ? 'LeftNavItem__selectedItem' : 'LeftNavItem__noSelectedItem' }
      >
        {
          ( Boolean( props.activeImage && props.label !== constants.LOGIN && props.label !== constants.SUBSCRIBE && props.label !== constants.MY_PLAN ) ) ? (
            <Image
              src={ props.pageType === defaultPageType ? getActiveImage( props.activeImage ) : getInactiveImage( props.inActiveImage ) }
              alt={ props.label }
              fousedImage={ focused && props.pageType !== defaultPageType }
            />
          ) : (
            <div className={ focused ? 'LeftNavItem__activeLogin' : 'LeftNavItem__inactiveLogin' }>
              <Icon
                name={ renderImages( props.label ) }
              />
            </div>
          ) }

        {
          <div className={
            classNames( {
              'LeftNavItem__leftNavAnimation': expandedMenu,
              'LeftNavItem__leftNavAnimationReverse': !expandedMenu
            } )
          }
          >
            <div className={ props.pageType === defaultPageType ? 'LeftNavItem__selectedItem' : 'LeftNavItem__noSelectedItem' }>
              <Text
                textStyle={ !focused ? 'subtitle-1' : 'header-6' }
              >
                { props.label }
              </Text>
            </div>

          </div>
        }
      </Link>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} activeImage - set active image
 * @property {string} inActiveImage - set in-active image
 * @property {string} label - set the label
 * @property {string} iconImage - set the iconImage
 */
export const propTypes = {
  activeImage: PropTypes.string,
  inActiveImage: PropTypes.string,
  pageType: PropTypes.string,
  label: PropTypes.string
};

LeftNavItem.propTypes = propTypes;

export default LeftNavItem;