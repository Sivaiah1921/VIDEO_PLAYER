/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import {
  LAYOUT_TYPE,
  SECTION_SOURCE,
  USERS,
  PAGE_NAME,
  CONTENT_TYPE,
  PAGE_TYPE,
  constants,
  SECTION_TYPE,
  SECTION_SOURCE_LIST,
  PACKS,
  SUBSCRIPTION_STATUS,
  PAYMENT_METHOD,
  SUBSCRIPTION_TYPE,
  PARTNER_SUBSCRIPTION_TYPE,
  CHANGE_PLAN_TYPE,
  CUSTOM_CONTENT_TYPE,
  CONTENTTYPE_SERIES,
  APPIDS,
  PROVIDER_LIST,
  getPlatformType,
  APPLETV,
  PRIME,
  isTizen,
  COMMON_HEADERS,
  ZERO_PLAN_APPS_VERBIAGE,
  SENTRY_LEVEL,
  SENTRY_TAG,
  DISTRO_CHANNEL,
  CHANNEL_RAIL_TYPE,
  CHIP_RAIL_TYPE
} from '../utils/constants';
import AppMediaCard from '../views/components/AppMediaCard/AppMediaCard';
import MediaCard from '../views/components/MediaCard/MediaCard';
import TopMediaCard from '../views/components/TopMediaCard/TopMediaCard';
import LanguageCard from '../views/components/LanguageCard/LanguageCard';
import GenreMediaCard from '../views/components/GenreMediaCard/GenreMediaCard';
import LiveMediaCard from '../views/components/LiveMediaCard/LiveMediaCard';
import { useCallback, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { getAccountBaid, getAllLoginPath, getAuthToken, getBaID, getBingeListFlag, getCatalogFlag, getContentRailPositionData, getDthStatus, getFirstLaunch, getLiveFlagLocal, getMixpanelInforamtion, getPrefferedLanguage, getPrefferedLanguageGuest, getProductName, getRmn, getSearchFlag, getSubscriberId, setAccountBaid, setAgeRating, setAllLoginPath, setAuthToken, setBaID, setDeviceList, setDeviceToken, setDthStatus, setFirstLaunch, setLoginIcon, setLoginMsg, setMixPanelId, setMixpanelInforamtion, setPiLevel, setProfileId, setReferenceID, setSubscriberId, setValidationKey, getShowPromoBanner, setZeroAppPlanPopupOnRefresh, getTVDeviceId, getFromAppMediaCard, getFromSportsMediaCard, getkeyCodeFromLocalStorage, getABTestingData } from './localStorageHelper';
import { identifyUser, setPlayerPeopleProperties, setSuperProperties } from './mixpanel/mixpanel';
import get from 'lodash/get';
import * as Sentry from '@sentry/browser';
import HomeMediaCard from '../views/components/HomeMediaCard/HomeMediaCard';
import { getLaunchAppID, getPlaceHolderForFallback, getRefuseCase } from './slayer/PlaybackInfoService';
import axios from 'axios';
import { initEvents, loginExit, loginOtpPageBack, player_play_event } from './mixpanel/mixpanelService';
import MIXPANELCONFIG from './mixpanelConfig';
import { freemiumUserComesFromConfirmPurchase, paidUserComesFromConfirmPurchase, redirectToHome, userComesFromPiPageOfDifferentRoute, userComesFromPiPageOfPreviousPathName, userComesFromPiPageOfSameRoute, userComesFromSideMenu, userHasLowerPlan } from './redirectionHelper';
import { isLiveContentType } from './slayer/PlayerService';
import { compare } from 'compare-versions';
import Button from '../views/components/Button/Button';
import SportsCard from '../views/components/SportsCard/SportsCard';

export const getRailComponent = ( sectionSource, layoutType, path, railType ) => {
  if( ( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ) && ( layoutType === LAYOUT_TYPE.CIRCULAR || layoutType === LAYOUT_TYPE.LANDSCAPE ) ){
    return AppMediaCard;
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL && layoutType === LAYOUT_TYPE.TOP_PORTRAIT ){
    return TopMediaCard;
  }
  else if( sectionSource === SECTION_SOURCE.LANGUAGE && ( layoutType === LAYOUT_TYPE.LANDSCAPE || layoutType === LAYOUT_TYPE.CIRCULAR ) ){
    return LanguageCard;
  }
  else if( sectionSource === SECTION_SOURCE.GENRE && layoutType === LAYOUT_TYPE.LANDSCAPE ){
    return GenreMediaCard;
  }
  else if( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ){
    return SportsCard;
  }
  // else if( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && layoutType === LAYOUT_TYPE.LANDSCAPE ){
  //   return LiveMediaCard;
  // }
  else if( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ){
    if( railType === CHANNEL_RAIL_TYPE.COMPOSITE ){
      return Button;
    }
    else {
      return LiveMediaCard;
    }
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && CHIP_RAIL_TYPE.includes( railType ) ){
    return Button;
  }
  else if( layoutType === LAYOUT_TYPE.SQUARE ){
    return LiveMediaCard;
  }
  else if( path === 'HOME' ){
    return HomeMediaCard;
  }
  return MediaCard;

}

export const getRailComponentForChips = ( sectionSource, chipRailType, renderFrom ) => {
  if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && chipRailType === CHANNEL_RAIL_TYPE.BINGE_TOP_10 ){
    return TopMediaCard;
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && renderFrom === PAGE_TYPE.DONGLE_HOMEPAGE ){
    return HomeMediaCard;
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && renderFrom === PAGE_TYPE.PARTNER_PAGE ){
    return MediaCard;
  }
  else {
    return LiveMediaCard;
  }
}

export const getInitialCardCount = ( sectionSource, layoutType, railType = '' ) => {
  if( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && layoutType === LAYOUT_TYPE.LANDSCAPE ){
    return 10;
  }
  else if( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.LANGUAGE || sectionSource === SECTION_SOURCE.GENRE ){
    return 9;
  }
  else if( ( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL && layoutType === LAYOUT_TYPE.TOP_PORTRAIT ) || layoutType === LAYOUT_TYPE.LANDSCAPE ){
    return 6;
  }
  else if( sectionSource === SECTION_SOURCE.EDITORIAL && layoutType === LAYOUT_TYPE.PORTRAIT ){
    return 14;
  }
  else if( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.COMPOSITE ){
    return 14;
  }
  return 8
}

export const cloudinaryCarousalUrl = (
  view = '',
  url = '',
  sectionSource = '',
  positionFlag = false
) => {
  let width = 344;
  let height = 264;
  let updatedURL = url;

  const resolutionFactor = window.innerWidth > 1280 ? 1.5 : 1;
  if( view === LAYOUT_TYPE.CIRCULAR ){
    width = 117;
    height = 117;
  }
  else if( view === LAYOUT_TYPE.SQUARE ){
    width = 100;
    height = 100;
  }
  else if( view === LAYOUT_TYPE.LANDSCAPE ){
    width = 344;
    height = 264;
  }
  else if( view === LAYOUT_TYPE.SEARCH_PAGE ){
    width = 344;
    height = 264;
  }
  else if( view === LAYOUT_TYPE.PORTRAIT && positionFlag ){
    width = 332;
    height = 360;
  }
  else if( view === LAYOUT_TYPE.PORTRAIT ){
    width = 226;
    height = 360;
  }
  else if( view === LAYOUT_TYPE.BANNER_LOGO ){
    width = 215;
    height = 82;
  }
  else if( view === LAYOUT_TYPE.TOP_PORTRAIT ){
    width = 226;
    height = 360;
  }
  else if( view === LAYOUT_TYPE.HERO_BANNER ){
    width = 1154;
    height = 427;
  }
  else if( view === LAYOUT_TYPE.TOP_LANDSCAPE ){
    width = 1154;
    height = 427;
  }
  else if( view === LAYOUT_TYPE.HERO_BANNER_SYNOPSIS ){
    width = 856;
    height = 480;
  }
  else if( view === LAYOUT_TYPE.PROMO_IMAGES ){
    width = 302;
    height = 186;
  }
  else if( view === LAYOUT_TYPE.PROMO_LOGO ){
    width = 270;
    height = 90;
  }
  else if( view === LAYOUT_TYPE.PRIME_BANNER_LOGO ){
    width = 85;
    height = 65;
  }
  else if( view === LAYOUT_TYPE.PRIME_BANNER_IMAGES ){
    width = 260;
    height = 20;
  }
  else if( view === LAYOUT_TYPE.PRIME_LITE_BENEFIT ){
    width = 1590;
    height = 116;
  }
  else if( view === LAYOUT_TYPE.DISTRO_POWERED_IMAGE ){
    return updatedURL += 'c_scale,f_auto,q_auto:best';
  }
  else if( view === LAYOUT_TYPE.DEVICE_MANAGEMENT_IMAGES ){
    width = 36;
    height = 36;
  }
  else if( view === LAYOUT_TYPE.FLEXI_PACKAGE_CARD ){
    width = 855;
    height = isTizen ? 600 : 572;
  }
  updatedURL += 'c_scale,f_auto,q_auto:best';
  return updatedURL + ',w_' + Math.floor( width * resolutionFactor ) + ',h_' + Math.floor( height * resolutionFactor );
};

export const secondsToHms = ( d ) => {
  if( !d || !Number( d ) ){
    return null;
  }
  const t = Number( d );
  const h = Math.floor( t / 3600 );
  const m = Math.floor( ( t % 3600 ) / 60 );
  const hDisplay = h < 10 ? `0${h}` : h;
  const mDisplay = m < 10 ? `0${m}` : m;
  if( h === 0 ){
    return `${mDisplay}m`;
  }
  return `${hDisplay}h ${mDisplay}m`;
};

export const secondsToms = ( d ) => {
  if( !d || !Number( d ) ){
    return null;
  }
  const t = Number( d );
  const m = Math.floor( t / 60 );
  const mDisplay = m < 10 ? `0${m}` : m;
  return `${mDisplay}m`;
};

/**
  * Returns provider logo imageurl
  *
  * @method
  * @param  { object} config api response for the application
  * @param  { object } providerLogoList object containing list of content providers
  * @returns { string }
  */
export const getProviderLogo = ( providerLogoList, provider, logoType, url ) => {
  let imageUrl = '';
  if( provider && provider.toUpperCase() === 'FITNESS' ){
    // eslint-disable-next-line no-param-reassign
    provider = 'tatasky'
  }
  if( provider && providerLogoList ){
    const providerImages = providerLogoList && providerLogoList[provider.toUpperCase()];
    if( url && providerImages && providerImages[logoType] ){
      if( url.includes( 'cloudinary' ) ){
        imageUrl = `${url}c_scale,f_auto,q_auto/` + providerImages[logoType] ;
      }
      else if( url.includes( 'mediaready' ) ){
        imageUrl = `${url}f_auto,q_auto/` + providerImages[logoType] ;
      }
    }
  }
  return imageUrl
}

/**
  * Returns custom interval hook to manage states
  *
  * @method
  * @param  { object} callback api response for the application
  * @param  { object } delay object containing list of content providers
  * @returns { object }
  */
export const useInterval = ( callback, delay ) => {
  const intervalRef = useRef();
  const callbackRef = useRef( callback );

  useEffect( () => {
    callbackRef.current = callback;
  }, [callback] );

  useEffect( () => {
    if( typeof delay === 'number' ){
      intervalRef.current = window.setInterval( () => callbackRef.current(), delay );

      return () => window.clearInterval( intervalRef.current );
    }
  }, [delay] );

  return intervalRef;
}

export const UseInterval = ( callback, delay ) => {
  const savedCallback = useRef();
  const intervalId = useRef( null );

  // Remember the latest callback.
  useEffect( () => {
    savedCallback.current = callback;
  }, [callback] );

  // Set up the interval.
  const startInterval = useCallback( () => {
    if( delay !== null && intervalId.current === null ){ // Ensure no existing interval
      intervalId.current = setInterval( () => {
        if( savedCallback.current ){
          savedCallback.current();
        }
      }, delay );
    }
  }, [delay] );

  // Stop the interval.
  const stopInterval = useCallback( () => {
    if( intervalId.current !== null ){
      clearInterval( intervalId.current );
      intervalId.current = null; // Reset the intervalId
    }
  }, [] );

  // Clean up the interval when the component is unmounted or delay changes.
  useEffect( () => {
    startInterval();
    return stopInterval;
  }, [delay, startInterval, stopInterval] );

  // Return the start and stop functions for manual control
  return { startInterval, stopInterval };
}


/**
  * Returns formatted mobile number with ellipses
  *
  * @method
  * @param  { object} m api response for the application
  * @returns { string }
  */
export const formatMobileNumberWithEllipsis = ( mobile ) => ( parse( '+91 ' + mobile?.substring( 0, 4 ) + ' <span>...</span> ' + mobile?.substring( 7 ) ) );


/**
  * Returns formatted phone number
  *
  * @method
  * @param  { object} phoneNumberString api response for the application
  * @returns { string } return formatted phone number  with format (Telephone : +91 18 0208 6633)
  */
export const formatPhoneNumber = ( phoneNumberString ) => {
  const cleaned = ( '' + phoneNumberString ).replace( /\D/g, '' )
  const match = cleaned.match( /^(\d{2})(\d{4})(\d{4})$/ )
  if( match ){
    return '+91 ' + match[1] + ' ' + match[2] + ' ' + match[3]
  }
  return null
}

/**
  * Returns formatted phone number
  *
  * @method
  * @param  { object} phoneNumberString api response for the application
  * @returns { string } return formatted phone number  with format (Telephone : 1800 208 6633)
  */
export const formatPhoneNumber2 = ( phoneNumberString ) => {
  const cleaned = ( '' + phoneNumberString ).replace( /\D/g, '' )
  const match = cleaned.match( /^(\d{4})(\d{3})(\d{4})$/ )
  if( match ){
    return match[1] + ' ' + match[2] + ' ' + match[3]
  }
  return null
}

export const requestAppservice = ( provider ) => {
  // const zeeAppID = 'wKDM33Rods.ZEE5';
  // const hotstarAppID = 'fiZNCxMH9Y.Hotstar';
  let appId = '';
  function onListInstalledApps( applications ){
    appId = applications.find( app =>
      app.id?.toLowerCase().includes( provider?.toLowerCase() )
    )
  }
  tizen.application.getAppsInfo( onListInstalledApps );
  const payload = [
    new tizen.ApplicationControlData( 'Sub_Menu', [{
      data:{
        'detail': 'https://www.zee5.com/movies/details/janhit-mein-jaari/0-0-1z5177236?utm_source=tataskybinge&utm_medium=amazonstick&utm_campaign=zee5campaign&partner=tataskybinge&tag=15a3cbb0c91b546f37fcea72fcdcab54'
      }
    }] )
  ];
  const appControl = new tizen.ApplicationControl( 'http://tizen.org/appcontrol/operation/default', null, null, null, payload, null );
  tizen.application.launchAppControl( appControl, appId, function(){
    console.log( 'Success' );
  },
  function( err ){
    console.log( 'Service launch failed: ', err )
  } );
}

export const requestAppserviceSellerPage = () => {
  const service = new tizen.ApplicationControl(
    'http://tizen.org/appcontrol/operation/view',
    'tizenstore://SellerApps/wKDM33Rods',
    null,
    null,
    null );
  const id = 'com.samsung.tv.store';
  try {
    tizen.application.launchAppControl(
      service,
      id,
      function(){console.log("Service launched");}, // eslint-disable-line
      function( err ){
        console.log( 'Service launch failed: ', err.message );
      },
      null );
  }
  catch ( exc ){
    console.log( 'launchService exc: ' + exc.message );
  }
}

export const checkSectionSource = ( rest ) => {
  const railFocus = SECTION_SOURCE_LIST.includes( rest.sectionSource )
  return railFocus
}

/**
  * Represents a countLine method
  *
  * @method
  * @param {object} element - html element
  * @param {func} setCountLine - func to set count
  */
export const countLine = ( element, setCountLine ) => {
  const lines = element?.innerText?.split( /\r|\r\n|\n/ ).length > 3;
  setCountLine( lines );
}

/**
  * Represents a truncateWithThreeDots method
  *
  * @method
  * @param {string} source - string to truncate
  * @param {string} size - number
  * @param {boolean} isCountLine - true/false
  * @returns string with 3 dots
  */
export const truncateWithThreeDots = ( source, size, isCountLine ) => {
  if( !source ){
    return ''
  }
  return isCountLine || ( source.length > size ) ? parse( source.slice( 0, size - 1 ) + `<span>…</span>` ) : source;
}

const diff_hours = ( dt2, dt1 ) => {
  let diff = ( dt2 - dt1 ) / 1000;
  diff /= ( 60 * 60 );
  return Math.abs( Math.round( diff ) );
}

const diff_minutes = ( dt2, dt1 ) => {
  let diff = ( dt2 - dt1 ) / 1000;
  diff /= 60;
  return Math.abs( Math.round( diff ) );
}

const diff_seconds = ( dt2, dt1 ) => {
  const diff = ( dt2 - dt1 ) / 1000;
  return Math.abs( Math.round( diff ) );
}

const diff_days = ( dt2, dt1 ) => {
  const diff = ( dt2 - dt1 ) / ( 1000 * 3600 * 24 );
  return diff >= 1 && Math.abs( Math.round( diff ) );
}

export const timeDifferenceCalculate = ( datetime ) => {
  var datetime = new Date( datetime ).getTime();
  const now = new Date().getTime();
  if( isNaN( datetime ) ){
    return '';
  }
  else if( datetime < now ){
    return '';
  }
  else if( diff_days( datetime, now ) ){
    return diff_days( datetime, now ) + ' Days '
  }
  else if( diff_hours( datetime, now ) ){
    return diff_hours( datetime, now ) + ' Hours'
  }
  else if( diff_minutes( datetime, now ) ){
    return diff_minutes( datetime, now ) + ' Minutes'
  }
  else if( diff_seconds( datetime, now ) ){
    return diff_seconds( datetime, now ) + ' Seconds'
  }
}

/**
  * Represents a null/undefined string handling method
  *
  * @method
  * @param {string} source - string to validate
  * @returns a valid or empty string
  */
export const handleNullInString = ( val )=> {
  return val.includes( undefined ) ? '' : val;
}

export const navigateToHome = ( history )=> {
  history.push( '/discover' )
}

export const showFreeEpisodeTag = ( partnerSubscriptionType, contentType ) => {
  const condition = partnerSubscriptionType === PARTNER_SUBSCRIPTION_TYPE.FREE || partnerSubscriptionType === PARTNER_SUBSCRIPTION_TYPE.FREMIUM || partnerSubscriptionType === PARTNER_SUBSCRIPTION_TYPE.FREE_ADVERTISEMENT
  return contentType && contentType === CONTENT_TYPE.MOVIES ? false : condition
}

export const getPubnubChannelName = () => {
  const sId = getSubscriberId();
  const rmn = getRmn();
  const accountBaid = getAccountBaid();
  return getDthStatus() === USERS.DTH_OLD_STACK_USER ? `sub_${sId}` : accountBaid || `rmn_${rmn}`
};

export const getSource = ( previousPathName ) => {
  if( previousPathName === PAGE_TYPE.DONGLE_HOMEPAGE || previousPathName?.toString().includes( PAGE_TYPE.DONGLE_HOMEPAGE ) ){
    return PAGE_NAME.HOME
  }
  else if( previousPathName === 'DONGLE_MOVIES_1' || previousPathName?.toString().includes( previousPathName?.toString().includes( 'DONGLE_MOVIES_1' ) ) ){
    return PAGE_NAME.MOVIES
  }
  else if( previousPathName === 'DONGLE_TVSHOWS' || previousPathName?.toString().includes( previousPathName?.toString().includes( 'DONGLE_TVSHOWS' ) ) ){
    return PAGE_NAME.TV_SHOWS
  }
  else if( previousPathName === 'DONGLE_KNOWLEDGE&LEARNING' || previousPathName?.toString().includes( previousPathName?.toString().includes( 'DONGLE_KNOWLEDGE&LEARNING' ) ) ){
    return PAGE_NAME.KNOWLEDGE
  }
  else if( previousPathName === ' DONGLE_ENTERTAINMENT_1' || previousPathName?.toString().includes( previousPathName?.toString().includes( 'DONGLE_ENTERTAINMENT_1' ) ) ){
    return PAGE_NAME.ENTERTAINMENT
  }
  else if( previousPathName?.toString().includes( 'other-categories' ) ){
    return PAGE_NAME.OTHER_CATEGORIES
  }
  else if( previousPathName?.toString().includes( '/content/detail' ) ){
    return PAGE_NAME.CONTENT_DETAIL
  }
  else if( previousPathName?.toString().includes( '/browse-by/genre' ) ){
    return PAGE_NAME.BROWSE_BY_GENRE
  }
  else if( previousPathName?.toString().includes( '/browse-by/language' ) ){
    return PAGE_NAME.BROWSE_BY_LANGUAGE
  }
  else if( previousPathName?.toString().includes( '/content/episode' ) ){
    return PAGE_NAME.VIEW_CONTENT_DETAIL
  }
  else if( previousPathName?.toString().includes( 'plan/current' ) ){
    return PAGE_NAME.MY_PLAN
  }
  else if( previousPathName === 'CONFIRM_PURCHASE' || previousPathName?.toString().includes( 'plan/subscription' ) ){
    return PAGE_NAME.SUBSCRIBE
  }
  else if( previousPathName === 'DONGLE_REGIONAL' ){
    return PAGE_NAME.REGIONAL
  }
  else if( previousPathName === 'DONGLE_MOVIES_2' ){
    return PAGE_NAME.SPORTS
  }
  else if( previousPathName === PAGE_NAME.SEARCH || previousPathName?.toString().includes( PAGE_NAME.SEARCH ) ){
    return PAGE_NAME.SEARCH
  }
  else if( previousPathName?.toString().includes( '/binge-list' ) ){
    return PAGE_NAME.BINGE_LIST
  }
  else if( previousPathName?.toString().includes( PAGE_NAME.ACCOUNT ) ){
    return PAGE_NAME.ACCOUNT
  }
  else {
    return PAGE_NAME.HOME
  }
}

export const getSourceForMixPanel = ( previousPathName ) => {
  if( previousPathName?.toString().includes( '/content/detail' ) ){
    return PAGE_NAME.CONTENT_DETAIL
  }
  else if( previousPathName?.toString().includes( '/content/episode' ) ){
    return PAGE_NAME.VIEW_CONTENT_DETAIL
  }
  else if( previousPathName?.toString().includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
    return PAGE_NAME.CONFIRM_PURCHASE
  }
  else if( previousPathName?.toString().includes( '/binge-list' ) ){
    return PAGE_NAME.BINGE_LIST
  }
  else if( previousPathName?.toString().includes( '/Account' ) ){
    return PAGE_NAME.ACCOUNT
  }
  else if( previousPathName?.toString().includes( '/Search' ) ){
    return PAGE_NAME.SEARCH
  }
  else if( previousPathName?.toString().includes( '/browse-by' ) ){
    if( previousPathName.toString().includes( 'language' ) ){
      return MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE
    }
    else if( previousPathName.toString().includes( 'genre' ) ){
      return MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE
    }
    else if( previousPathName.toString().includes( 'app' ) ){
      return MIXPANELCONFIG.VALUE.BROWSE_BY_APP
    }
    else if( previousPathName.toString().includes( 'catalogchannel' ) ){
      return MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL
    }
    return PAGE_NAME.CATALOG
  }
  else if( previousPathName?.toString().includes( '/browse-by-app' ) ){
    return PAGE_NAME.CATALOG_PARTNER
  }
  else {
    return PAGE_NAME.HOME
  }
}

export const getBrowsePageName = ( pathname, previousPathName ) => {

  if( getFromSportsMediaCard() ){
    const value = window.location.pathname.split( '/browse-by-app/' )[1]?.split( '/' )[0];
    return value ? decodeURIComponent( value ) : getMixpanelData( 'browsepagename' )
  }

  else if( pathname.includes( '/content/detail' ) ){
    return previousPathName.selectedDefaultPageType || PAGE_NAME.HOME;
  }
  else if( pathname?.toString().includes( '/binge-list' ) ){
    return PAGE_NAME.BINGE_LIST
  }
  else if( pathname?.toString().includes( '/Search' ) ){
    return PAGE_NAME.SEARCH
  }
  else if( pathname?.toString().includes( '/browse-by/language' ) ){
    return MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE
  }
  else if( pathname.toString().includes( '/browse-by/genre' ) ){
    return MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE
  }
  else if( previousPathName.toString().includes( '/browse-by/catalogchannel' ) ){
    return MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL
  }

  return getMixpanelData( 'browsepagename' );
}

export const covertIntoMinutes = ( time ) => {
  let minutes;
  const inputArray = time && time.toString().split( ':' );
  if( Array.isArray( inputArray ) && inputArray.length > 1 ){
    minutes = ( +inputArray[0] ) * 60 + ( +inputArray[1] )
    return minutes
  }
  return time;
}

export const millisToMinutes = ( millis ) => {
  const minutes = Math.floor( millis / 60000 );
  return minutes
}

export const splitBySpace = ( input ) => {
  if( !input ){
    return []
  }
  return input.split( ' ' )
}

export const generateMPdate = ( date ) => {
  const isValidDate = date && !isNaN( new Date( date ) );
  if( isValidDate ){
    return date.toISOString().replace( 'T', ' T ' ).substring( 0, 21 );
  }
}

export const setContentPlayedCount = ( contentType, contentPlayed, setContentPlayed, duration ) => {
  let totalDuration;
  let tempContent = { ...contentPlayed };

  switch ( contentType ){
    case 'MOVIES':
      totalDuration = contentPlayed.moviesPlayedDuration + duration
      tempContent = Object.assign( contentPlayed, {
        moviesPlayed : contentPlayed.moviesPlayed + 1,
        moviesPlayedDuration: totalDuration,
        watchDuration: totalDuration
      } )
      break;
    case 'BRAND':
    case 'TV_SHOWS':
      totalDuration = contentPlayed.showsPlayedDuration + duration
      tempContent = Object.assign( contentPlayed, {
        showsPlayed : contentPlayed.showsPlayed + 1,
        showsPlayedDuration: totalDuration
      } )
      break;
    case 'SERIES':
      totalDuration = contentPlayed.seriesPlayedDuration + duration
      tempContent = Object.assign( contentPlayed, {
        seriesPlayed : contentPlayed.seriesPlayed + 1,
        seriesPlayedDuration: totalDuration
      } )
      break;
    case 'SHORTS':
      totalDuration = contentPlayed.shortsPlayedDuration + duration
      tempContent = Object.assign( contentPlayed, {
        shortsPlayed : contentPlayed.shortsPlayed + 1,
        shortsPlayedDuration: totalDuration
      } )
      break;
    case 'CATCH_UP':
      totalDuration = contentPlayed.catchupPlayedDuration + duration
      tempContent = Object.assign( contentPlayed, {
        catchupPlayed : contentPlayed.catchupPlayed + 1,
        catchupPlayedDuration: totalDuration
      } )
      break;
  }
  setContentPlayed( tempContent )
  setPlayerPeopleProperties( contentPlayed )
}

export const getOldStackDeviceList = ( pubnubPush ) => {
  const deviceInfo = get( pubnubPush, 'deviceInfo', [] )
  const data = deviceInfo && deviceInfo.length > 0 && deviceInfo.find( f=> f.baId === getBaID() )
  return get( data, 'deviceDetails', undefined )
}
export const getOldStackPubnubDetaills = ( pubnubPush ) => {
  const deviceInfo = get( pubnubPush, 'deviceInfo', {} )?.find( z => z.deviceId === getTVDeviceId() )
  const pkgId = deviceInfo?.entitlements?.[0]?.pkgId || null;
  const subscriptionStatus = deviceInfo?.subscriptionStatus || null;
  return { pkgId: pkgId, subscriptionStatus: subscriptionStatus };
}

export const getOldStackAgeRating = ( pubnubPush ) => {
  return get( pubnubPush, 'bingeSubscriberProfiles', undefined )
}

export const getOldStackSuccessfullPurchases = ( pubnubPush ) => {
  const deviceInfo = get( pubnubPush, 'deviceInfo', [] )
  const data = deviceInfo && deviceInfo.length > 0 && deviceInfo.find( f=> f.baId === getBaID() )
  return get( data, 'entitlements[0].pkgId', undefined )
}

export const getOtherStackDeviceList = ( pubnubPush ) => {
  return get( pubnubPush, 'deviceInfo', undefined )
}

export const getOtherStackAgeRating = ( pubnubPush ) => {
  return get( pubnubPush, 'bingeSubscriberProfiles', undefined )
}

export const getOtherStackSuccessfullPurchasesStatus = ( pubnubPush ) => {
  return get( pubnubPush, 'paymentStatus', undefined )
}

export const getOtherStackSuccessfullPurchasesTransactionId = ( pubnubPush ) => {
  return get( pubnubPush, 'paymentTransactionId', undefined )
}

export const appSelectionFlagPubnub = ( pubnubPush ) => {
  return get( pubnubPush, 'appSelectionFlag', undefined )
}

export const appOldStackSelectionFlagPubnub = ( pubnubPush ) => {
  const deviceInfo = get( pubnubPush, 'deviceInfo', [] )
  const data = deviceInfo && deviceInfo.length > 0 && deviceInfo.find( f=> f.baId === getBaID() )
  return get( data, 'appSelectionFlag', undefined )
}

export const sendExecptionToSentry = ( error, tag, level ) => {
  const user_data = {
    id: getRmn(),
    dthStatus: getDthStatus(),
    deviceId: getTVDeviceId()
  }
  Sentry.withScope( scope=>{
    scope.setTag( 'Error', tag );
    scope.setLevel( level );
    scope.setUser( user_data );
    Sentry.captureException( error )
  } )
}

export const convertNumberToHHMM = ( number ) => {
  const hours = Math.floor( number / 60 );
  if( !isNaN( hours ) ){
    var minutes = number % 60;
    if( hours === 0 ){
      return `${ minutes }m`
    }
    else if( minutes === 0 || number === 60 ){
      return `${ hours }h`
    }
    return `${hours}h ${ minutes }m`
  }
  else {
    const [hours, minutes] = number.split( ':' );
    const formattedTime = `${parseInt( hours, 10 )}h ${parseInt( minutes, 10 )}m`;
    return formattedTime;
  }
}

export const doNotShowScreenSaver = ( enableQrLoginJourney ) =>{
  return Boolean(
    !window.location.pathname.includes( PAGE_TYPE.PLAYER ) &&
    !window.location.pathname.includes( PAGE_TYPE.SUNNXT ) &&
    !window.location.pathname.includes( PAGE_TYPE.MXPLAYER_SCREEN ) &&
    !window.location.pathname.includes( PAGE_TYPE.SONY_PLAYER_SCREEN ) &&
    !window.location.pathname.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) &&
    !window.location.pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) &&
    !window.location.pathname.includes( PAGE_TYPE.SUBSCRIPTION ) &&
    !window.location.pathname.includes( PAGE_TYPE.TENURE ) &&
    !window.location.pathname.includes( PAGE_TYPE.TRAILER ) &&
    !( enableQrLoginJourney && window.location.pathname.includes( PAGE_TYPE.LOGIN ) ) &&
    !( enableQrLoginJourney && window.location.pathname.includes( PAGE_TYPE.NEW_RMN ) ) &&
    getLiveFlagLocal() !== 'true'
  )
}

export const freeEpisodeTagForCrown = ( status, isLowerPlan, nonSubscribedPartnerList, provider, partnerSubscriptionType, contractName, contentType, freeEpisodesAvailable ) => {
  const itemArray = nonSubscribedPartnerList || []
  const condition = itemArray.length > 0 && provider ? itemArray.filter( data => data.partnerName.toLowerCase() === provider.toLowerCase() ).length > 0 : true
  if( contentType === CONTENT_TYPE.MOVIES || contentType === CONTENT_TYPE.WEB_SHORTS ){
    return false
  }
  else if( freeEpisodesAvailable && condition ){
    return true
  }
  return false
}

export const isCrown = ( status, isLowerPlan, nonSubscribedPartnerList, provider, partnerSubscriptionType, contractName, contentType, freeEpisodesAvailable ) => {
  let isCrownShow;
  if( contractName === constants.CONTRACT_NAME || isLiveContentType( contentType ) ){
    isCrownShow = false;
  }
  else if( isLowerPlan === true || ( status && status !== 'ACTIVE' ) || ( !getAuthToken() || getProductName() === PACKS.FREEMIUM ) ){
    isCrownShow = ( !partnerSubscriptionType || partnerSubscriptionType?.includes( 'premium' ) )
  }
  else if( !isLowerPlan && status === 'ACTIVE' ){
    const itemArray = nonSubscribedPartnerList || []
    if( itemArray.length === 0 ){
      isCrownShow = getProductName() !== PACKS.FREEMIUM ? false : itemArray.length === 0 && ( !partnerSubscriptionType || partnerSubscriptionType?.includes( 'premium' ) )
    }
    else {
      isCrownShow = itemArray.length > 0 && provider && itemArray.filter( data => data.partnerName.toLowerCase() === provider.toLowerCase() ).length > 0 && ( !partnerSubscriptionType || partnerSubscriptionType?.includes( 'premium' ) )
    }
  }
  if( freeEpisodesAvailable && isCrownShow ){
    isCrownShow = false
  }
  return isCrownShow;
}

/**
  * Return to show Crown for any content
  *
  * @method
  * @param {Object} myPlanProps
  * @param {boolean} [myPlanProps.isLowerPlan] Lower Plan
  * @param {string} [myPlanProps.subscriptionStatus] Subscription status
  * @param {Object} [myPlanProps.nonSubscribedPartnerList] Non Subscribed Partner List
  * @param {Object} contentDetails
  * @param {string} [contentDetails.contentType] Content Type
  * @param {string} [contentDetails.partnerSubscriptionType] Partner Subscription Type
  * @param {string} [contentDetails.provider] Name of provider
  * @param {boolean} [contentDetails.freeEpisodesAvailable] Free Episodes Available
  * @param {string} [contentDetails.contractName] Contract Name
  * @returns {boolean}
*/
export const isCrownNew = ( myPlanProps, contentDetails, enableCrown ) => {
  let isCrownShow = true;
  const authToken = getAuthToken();
  // if( authToken && ( ( myPlanProps && Object.keys( myPlanProps ).length === 0 ) || ( contentDetails && Object.keys( contentDetails ).length === 0 ) ) ){
  //   return true;
  // }
  const { isLowerPlan, subscriptionStatus, nonSubscribedPartnerList, appSelectionRequired = false, addonPartnerList = [] } = myPlanProps || {};
  const { contentType, partnerSubscriptionType, provider, freeEpisodesAvailable, contractName } = contentDetails || {};
  const productName = getProductName();
  const isPremiumContent = !partnerSubscriptionType || partnerSubscriptionType?.toLowerCase()?.includes( constants.PREMIUM );
  const providerLower = provider?.toLowerCase();
  const inAddonList = ( addonPartnerList ).map( String ).some( addOnPartner => addOnPartner?.toLowerCase() === providerLower );

  if( contractName === constants.CONTRACT_NAME || isLiveContentType( contentType ) ){
    isCrownShow = false;
  }
  else if( isLowerPlan || ( subscriptionStatus ? subscriptionStatus !== SUBSCRIPTION_STATUS.ACTIVE : false ) || ( !authToken || productName === PACKS.FREEMIUM ) ){
    isCrownShow = isPremiumContent && !inAddonList
  }
  else if( !isLowerPlan && subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE ){
    const itemArray = nonSubscribedPartnerList || []
    const inNonSubscriptionList = ( itemArray || [] ).some( data => data?.partnerName?.toLowerCase() === providerLower );
    if( appSelectionRequired && isPremiumContent ){ // TPSLS-767 -- For Zero Apps use case to block any playback
      isCrownShow = isPremiumContent;
    }
    else if( itemArray.length === 0 ){
      // isCrownShow = productName !== PACKS.FREEMIUM ? false : itemArray.length === 0 && isPremiumContent
      isCrownShow = productName === PACKS.FREEMIUM && isPremiumContent
    }
    else {
      isCrownShow = Boolean( isPremiumContent && inNonSubscriptionList && !inAddonList );
    }
  }
  if( freeEpisodesAvailable && isCrownShow ){
    isCrownShow = false
  }
  return isCrownShow && enableCrown;
}

export const changeRailTitleForRecommended = ( languageType, genreType, title ) => {
  if( !title && !( languageType || genreType ) ){
    return
  }
  if( title.includes( 'Language' ) && title.includes( 'Genre' ) ){
    const start_posGenre = title.indexOf( 'Genre' );
    const end_posGenre = start_posGenre + 'Genre'.length;
    const removeTitleGenre = title.slice( start_posGenre, end_posGenre + 1 )
    var regexExpression = new RegExp( removeTitleGenre, 'g' );
    const genreTitle = title && title.replace( regexExpression, genreType + ' ' ) || ''

    const start_posLanguage = title.indexOf( 'Language' );
    const end_posLanguage = start_posLanguage + 'Language'.length;
    const removeTitleLanguage = title.slice( start_posLanguage, end_posLanguage + 1 )
    var regexExpression = new RegExp( removeTitleLanguage, 'g' );
    const fullTitle = genreTitle && genreTitle.replace( regexExpression, languageType + ' ' ) || genreTitle
    return fullTitle
  }
  else {
    const string = title.includes( 'Genre' ) ? 'Genre' : 'Language'
    const start_pos = title.indexOf( string );
    const end_pos = start_pos + string?.length;
    const removeTitle = title.slice( start_pos, end_pos + 1 )
    var regexExpression = new RegExp( removeTitle, 'g' );
    return title && title.replace( regexExpression, title.includes( 'Genre' ) ? genreType + ' ' : languageType + ' ' ) || title
  }
}

export const splitByDash = ( taShowType ) =>{
  if( !taShowType ){
    return
  }
  const type = taShowType?.split( '-' )
  if( Array.isArray( type ) && type.length > 1 ){
    return type[1]
  }
}
export const getContentIdByType = ( data ) => {
  const { id, vodId } = data || {}
  const contentId = vodId || id
  return contentId;
}

export const getVodID = ( metaData, storedLastWatchData = {} ) => {
  if( metaData?.parentContentType === CONTENT_TYPE.SERIES || metaData?.parentContentType === CONTENT_TYPE.BRAND ){
    return storedLastWatchData ? storedLastWatchData?.seriesId : metaData?.seriesId
  }
  else {
    return storedLastWatchData ? storedLastWatchData?.vodId : metaData?.vodId
  }
}


export const getContentIdForLastWatch = ( data ) => {
  if( !data ){
    return
  }
  const { brandId, vodId, seriesId, id, parentContentType } = data
  if( !parentContentType ){
    return
  }
  let contentId = id ;
  if( parentContentType.toUpperCase() === CONTENT_TYPE.BRAND ){
    contentId = brandId
  }
  if( parentContentType.toUpperCase() === CONTENT_TYPE.VOD ){
    contentId = vodId
  }
  if( parentContentType.toUpperCase() === CONTENT_TYPE.SERIES ){
    contentId = seriesId
  }
  return contentId;
}

export const accountDeactivateVerbiageOnUI = ( myPlanProps ) => {
  return myPlanProps && Object.keys( myPlanProps ).length > 0 && myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE
  // return myPlanProps && Object.keys( myPlanProps ).length > 0 && myPlanProps.paymentMode !== PAYMENT_METHOD.OPEL_ONE_TIME && myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE
}

export const freeEpisodeTagForMixpanel = ( response ) => {
  const partnerSubscriptionType = [PARTNER_SUBSCRIPTION_TYPE.FREE, PARTNER_SUBSCRIPTION_TYPE.FREMIUM, PARTNER_SUBSCRIPTION_TYPE.FREE_ADVERTISEMENT]
  let condition = true
  if( response && response.hasOwnProperty( 'partnerSubscriptionType' ) ){
    condition = partnerSubscriptionType.includes( response.partnerSubscriptionType )
  }
  return condition
}

export const modalDom = () => {
  return document.querySelector( '.Modal' )
}

export const playerPopUpmodalDom = () => {
  return document.querySelector( '.popup-body' )
}

export const modalDomClose = () => {
  const modal = document.querySelector( '.Modal' )
  if( modal && modal.parentNode ){
    modal.parentNode.removeChild( modal );
  }
}

export const showCurrentTag = ( myplan, item ) => {
  return myplan && Object.keys( myplan ).length > 0 && myplan.subscriptionStatus !== SUBSCRIPTION_STATUS.DEACTIVE && myplan.upgradeMyPlanType === item.productName && myplan.productId === item.productId
}

export const showConfetti = ( addedPackResponse, modifiedPackResponse ) => {
  return Boolean( Boolean( addedPackResponse && addedPackResponse.data.modificationType === null ) || Boolean( modifiedPackResponse && modifiedPackResponse.data.modificationType === CHANGE_PLAN_TYPE.UPGRADE ) )
}

export const storeAllPaths = ( location ) => {
  const info = getAllLoginPath() || []
  info.indexOf( location ) >= 0 ? null : setAllLoginPath( [...info, location] )
}

export const getVisibleViewPortElements = ( sectionSource, id, contentRailType ) =>{
  let container = null
  if( contentRailType === 'seachBBlRail' ){
    container = document?.querySelector( '.MediaCarousel__Rail' )
  }
  else if( contentRailType === 'CatalogPartnerContent' ){
    container = document?.querySelector( `.MediaCarousel_${id}` )
  }
  else if( contentRailType === 'LiveContent' || contentRailType === 'SeriesContent' || contentRailType === 'RelatedContent' ){
    container = document?.querySelector( `.MediaCarousel_${contentRailType}` )
  }
  else if( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
    container = document?.querySelector( `.HomeMediaCarousel__BackgroundBannerRail_${id}` )
  }
  else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
    container = document?.querySelector( `.HomeMediaCarousel__specialRail_${id}` )
  }
  else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
    container = document?.querySelector( `.HomeMediaCarousel__SeriesSpecialRail_${id}` )
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
    container = document?.querySelector( `.HomeMediaCarousel__chipRail_${id}` )
  }
  else {
    container = document?.querySelector( `.HomeMediaCarousel_${id}` )
  }
  if( container ){
    const containerRect = container.getBoundingClientRect();
    let elements = null
    if( sectionSource === 'BINGE_CHANNEL' ){
      elements = container.getElementsByClassName( 'LiveMediaCard' );
    }
    else if( sectionSource === 'LANGUAGE' ){
      elements = container.getElementsByClassName( 'LanguageCard' );
    }
    else if( sectionSource === 'PROVIDER' ){
      elements = container.getElementsByClassName( 'AppMediaCard' );
    }
    else if( sectionSource === 'BINGE_TOP_10_RAIL' ){
      elements = container.getElementsByClassName( 'MediaCard' );
    }
    else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      elements = container.getElementsByClassName( 'Button' );
    }
    else {
      elements = container.getElementsByClassName( 'MediaCard' );
    }
    const visibleElements = [];

    for ( let i = 0; i < elements.length; i++ ){
      const elementRect = elements[i].getBoundingClientRect();
      if(
        elementRect.left >= containerRect.left &&
          elementRect.right <= containerRect.right &&
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom
      ){
        visibleElements.push( i );
      }
    }
    return visibleElements;
  }
}

export const clearPILevelWhenComeBackToPI = ( piLevelClear, path ) => {
  piLevelClear > 0 && Boolean( path.includes( PAGE_TYPE.SEARCH ) || path.includes( PAGE_TYPE.BROSWSE_BY ) || path.includes( PAGE_TYPE.BINGE_LIST ) || path.includes( PAGE_TYPE.CONTENT_DETAIL ) ) ? setPiLevel( piLevelClear - 1 ) : null
}

export const getFilteredContentType = ( contentType ) => {
  if( !contentType ){
    return '';
  }
  if( contentType.includes( CONTENT_TYPE.BRAND ) ){
    return CONTENT_TYPE.BRAND
  }
  else if( contentType.includes( CONTENT_TYPE.SERIES ) ){
    return CONTENT_TYPE.SERIES
  }
  else if( contentType.includes( CONTENT_TYPE.MOVIES ) ){
    return CONTENT_TYPE.MOVIES
  }
  else if( contentType.includes( CONTENT_TYPE.TV_SHOWS ) ){
    return CONTENT_TYPE.TV_SHOWS
  }
  else if( contentType.includes( CONTENT_TYPE.WEB_SHORTS ) ){
    return CONTENT_TYPE.WEB_SHORTS
  }
  else if( CUSTOM_CONTENT_TYPE.includes( contentType ) ){
    return contentType
  }

  return splitCustomContentType( contentType )

}

export const getScrollInputs = ( scrollValue1, scrollValue2 )=> {
  if( window.innerWidth === 1920 ){
    return scrollValue1
  }
  else {
    return scrollValue2
  }
}

export const isKeyBoardVisibile = () => {
  const paths = ['/account/profile/edit', '/verify-otp', '/device/fourDigitParentalPinSetup', '/device/renameDevice', '/new-rmn'];
  return paths.includes( window.location.pathname ) || window.location.pathname.includes( '/content/episode' ) || ( getSearchFlag() === 'false' && window.location.pathname.includes( '/Search' ) )
}

export const getCloudinaryUrl = ( config ) => {
  return get( config, 'url.image.cloudAccountUrl' )
}

export const getMediaReadyUrl = ( config ) => {
  return get( config, 'url.image.cloudAccountUrlMR' )
}

export const userIsSubscribed = ( myPlanProps ) => {
  let isSubscribed = null;
  if( Object.keys( myPlanProps ).length === 0 ){
    return isSubscribed
  }
  if( myPlanProps.isNetflixCombo || myPlanProps.isCombo ){
    isSubscribed = myPlanProps.upgradeMyPlanType || myPlanProps.productId
  }
  else if( myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && ( myPlanProps.paymentMode === PAYMENT_METHOD.OPEL_ONE_TIME || myPlanProps.paymentMode === PAYMENT_METHOD.OPEL_RECURRING ) && myPlanProps.upgradeMyPlanType ){
    isSubscribed = myPlanProps.upgradeMyPlanType || myPlanProps.productId
  }
  else if( myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && myPlanProps.paymentMethod === PAYMENT_METHOD.DTH_WALLET && myPlanProps.upgradeMyPlanType ){
    if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ANDROID_STICK ){
      isSubscribed = myPlanProps.upgradeMyPlanType || myPlanProps.productId
    }
    else if( getProductName() === PACKS.FREEMIUM ){
      isSubscribed = null
    }
    else {
      isSubscribed = myPlanProps.upgradeMyPlanType || myPlanProps.productId
    }
  }
  else if( myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE ){
    isSubscribed = null
  }
  else if( myPlanProps.upgradeMyPlanType || myPlanProps.productId ){
    isSubscribed = myPlanProps.upgradeMyPlanType || myPlanProps.productId
  }
  else {
    isSubscribed = null
  }
  return isSubscribed
}

export const userIsSubscribedLeftnav = ( myPlanProps = {}, error ) => {
  let isSubscribed = {};
  if( error ){
    isSubscribed = {
      subscribe: false,
      direction: '/plan/subscription'
    }
  }
  if( Object.keys( myPlanProps ).length === 0 ){
    isSubscribed = {
      subscribe: false,
      direction: '/plan/subscription'
    }
  }
  else if( isIspEnabled( myPlanProps ) ){
    isSubscribed = {
      subscribe: true,
      direction: '/plan/current'
    }
  }
  else if( ( myPlanProps.upgradeMyPlanType || myPlanProps.productId ) && myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE ){
    isSubscribed = {
      subscribe: true,
      direction: '/plan/current'
    }
  }
  else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ANDROID_STICK && myPlanProps?.upgradeMyPlanType ){
    isSubscribed = {
      subscribe: false,
      direction: '/plan/current'
    }
  }
  // Todo Expired RMN for below mentioned user ATV & ANYWHERE, just enable code based on subscription type
  // else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ATV && myPlanProps?.upgradeMyPlanType ){
  //   isSubscribed = {
  //     subscribe: false,
  //     direction: '/plan/current'
  //   }
  // }
  // else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ANYWHERE && myPlanProps?.upgradeMyPlanType ){
  //   isSubscribed = {
  //     subscribe: false,
  //     direction: '/plan/current'
  //   }
  // }
  else if( myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && !myPlanProps.renewButtonOption ){
    isSubscribed = {
      subscribe: false,
      direction: '/plan/subscription'
    }
  }
  else if( myPlanProps.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && myPlanProps.renewButtonOption ){
    isSubscribed = {
      subscribe: true,
      direction: '/plan/current'
    }
  }
  else {
    isSubscribed = {
      subscribe: false,
      direction: '/plan/subscription'
    }
  }
  return isSubscribed
}

export const getRecommendationTitle = ( items, recoRailPosInHomeData, languageType, genreType, appName ) => {
  const recoInfo = items[recoRailPosInHomeData] || {};
  if( Boolean( ( recoInfo.title.includes( 'Genre' ) || recoInfo.title.includes( 'Language' ) ) && ( languageType || genreType ) ) ){
    return changeRailTitleForRecommended( languageType, genreType, recoInfo.title )
  }
  if( recoInfo.title.toLowerCase().includes( constants.MORE_FROM.toLowerCase() ) && appName ){
    return constants.MORE_FROM + appName
  }
  else if( recoInfo.title.toLowerCase().includes( constants.BESTOF.toLowerCase() ) && appName ){
    return constants.BESTOF + appName
  }
  else {
    return recoInfo.title + ( recoInfo.contentList && recoInfo.contentList[0] && recoInfo.contentList[0]?.actionedItemTitle ? ' ' + recoInfo.contentList[0]?.actionedItemTitle : '' )
  }

}

export const getLArefuseCase = ( config, type, recoResponse, bingeListFlag, searchFlag, catalogFlag ) => {
  const contentType = type?.toUpperCase();
  type = ( contentType === CONTENT_TYPE.BRAND || contentType === CONTENT_TYPE.SERIES ) ? CONTENT_TYPE.TV_SHOWS : contentType;

  const data = getContentRailPositionData() || {}
  let useCaseId = data.railId || ''
  let otherRailSource = bingeListFlag;

  if( data.sectionSource === SECTION_SOURCE.EDITORIAL ){
    useCaseId = data.railId;
  }
  else if( Number( data.railId ) === 3000 ){ // If data is coming from the search-connector API for related shows refuseCase is empty
    useCaseId = ''
  }
  else if( Number( data.railId ) === 2000 ){ // If data is coming from the TA API for related shows refuseCase should coming from config API
    useCaseId = getRefuseCase( config, type )
    otherRailSource = false
  }
  else if( data.sectionSource === SECTION_SOURCE.RECOMMENDATION ){
    useCaseId = data.placeHolder || getRefuseCase( config, type )
  }
  else if( recoResponse && recoResponse.data && !recoResponse.data.contentList ){
    useCaseId = getPlaceHolderForFallback( config, type )
  }
  else if( searchFlag || catalogFlag ){
    useCaseId = config?.taSearchLearnUsecase || constants.SEARCH_LA_PLACEHOLDER
  }
  return !otherRailSource ? useCaseId : ''
}

export const keyCodeForBackFunctionality = ( keyCode ) => {
  return Boolean( keyCode === 10009 || keyCode === 461 || keyCode === getkeyCodeFromLocalStorage() )
}

export const lengthOfOtp = ( config ) => {
  let count = 6
  if( config && config.newOtpFlow && config.newOtpFlow.includes( '4' ) ){
    count = 4
  }
  return count
}

export const searchNoDataFoundVerbiage = ( autoCompleteResponse ) => {
  return autoCompleteResponse && autoCompleteResponse.data && autoCompleteResponse.data.bingeVerbiage ? autoCompleteResponse.data.bingeVerbiage : constants.NORESULTS
}

export const subscriberIdVerbiage = ( subListResponse, dynamicVerbiage, fallbackVerbiage ) => {
  return subListResponse && subListResponse.data && subListResponse.data.accountDetails && Array.isArray( subListResponse.data.accountDetails ) && subListResponse.data.accountDetails.length > 0 && subListResponse.data.accountDetails[0][dynamicVerbiage] ? subListResponse.data.accountDetails[0][dynamicVerbiage] : fallbackVerbiage
}

export const getTAUseCaseId = ( { sectionSource, placeHolder, sectionType } ) => {
  let taUserCase;
  if( placeHolder === 'UC_BBG' || placeHolder === 'UC_BBL' ){
    if( sectionSource ){
      taUserCase = placeHolder
    }
    else {
      taUserCase = 'Special Rail'
    }
  }
  else if( sectionType === SECTION_TYPE.HERO_BANNER ){
    if( sectionSource ){
      taUserCase = placeHolder
    }
    else {
      taUserCase = placeHolder
    }
  }
  else {
    taUserCase = placeHolder || 'Editorial'
  }
  return taUserCase
}

export const removeSetAllLoginPath = () => {
  const data = getAllLoginPath()
  const result = data.filter( d => d !== window.location.pathname )
  setAllLoginPath( result )
}

export const successfullyLogin = ( response ) => {
  if( response && response.data && Object.keys( response.data ).length > 0 ){
    if( response.data.ageRatingMasterMapping ){
      setAgeRating( response.data.ageRatingMasterMapping )
    }
    setProfileId( response.data.profileId )
    setReferenceID( response.data.referenceId )
    setDthStatus( response.data.dthStatus )
    setDeviceToken( response.data.deviceAuthenticateToken )
    setBaID( response.data.baId )
    setAuthToken( response.data.userAuthenticateToken )
    setSubscriberId( response.data.subscriberId )
    setLoginMsg( response.message )
    setLoginIcon( 'Success' )
    setMixPanelId( response.data.mixpanelid )
    identifyUser( )
    setDeviceList( response.data.deviceDTOList )
    setValidationKey( response.data.checkSumKey )
    response.data.enableAccountPubnubChannel && response.data.channelName && setAccountBaid( response.data.channelName )
  }
}

export const isNudgeVisible = ( item ) => {
  if( getAuthToken() ){
    return item && item.sectionSource === SECTION_SOURCE.LANGUAGE_NUDGE && !getPrefferedLanguage()
  }
  else {
    return item && item.sectionSource === SECTION_SOURCE.LANGUAGE_NUDGE && !getPrefferedLanguageGuest()
  }
}

export const isPromoVisible = ( item ) => {
  if( !getAuthToken() ){
    return item && item.sectionSource === SECTION_SOURCE.PROMO_BANNER
  }
  else if( Boolean( getShowPromoBanner() === 'true' ) ){
    return item && item.sectionSource === SECTION_SOURCE.PROMO_BANNER
  }
}

export const redirection = ( myPlanProps ) => {
  if( myPlanProps?.isLowerPlan ){
    return '/plan/current'
  }
  else if( myPlanProps?.upgradeMyPlan === PACKS.FREE_TRAIL ){
    return '/plan/current'
  }
  else if( isIspEnabled( myPlanProps ) ){
    return '/plan/current'
  }
  // else if( myPlanProps?.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && myPlanProps?.paymentMode === PAYMENT_METHOD.OPEL_ONE_TIME && myPlanProps?.upgradeMyPlanType ){
  //   return '/plan/current'
  // }
  else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ANDROID_STICK && myPlanProps?.upgradeMyPlanType ){
    return '/plan/current'
  }
  else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ATV && myPlanProps?.upgradeMyPlanType ){
    return '/plan/current'
  }
  else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.ANYWHERE && myPlanProps?.upgradeMyPlanType ){
    return '/plan/current'
  }
  // TODO :: NEED TO VERIFY WITH BE
  // else if( myPlanProps?.subscriptionType === SUBSCRIPTION_TYPE.FREEMIUM && myPlanProps?.upgradeMyPlanType ){
  //   return '/plan/current'
  // }
  else if( myPlanProps?.footerMsg?.includes( constants.FOOTER_MSG_TEXT ) && myPlanProps?.upgradeMyPlanType ){
    return '/plan/current'
  }
  else {
    return '/plan/subscription'
  }
}

export const deviceDetailsVerbiage = ( item ) => {
  return item && item.componentList && Array.isArray( item.componentList ) && item.componentList.length > 0 && item.componentList[0].totalAppCountText
}

export const getAppVersion = async() => {
  await axios.get( `${ window.basePath }/appinfo.json` ).then( ( response ) => {
    COMMON_HEADERS.VERSION = response.data.version
  } ).catch( ()=> {
  } )
}

export const splitCustomContentType = ( contentType ) => {
  if( !contentType ){
    return ''
  }
  let updatedContentType = contentType;
  const parts = contentType.split( '_DETAIL' );
  if( Array.isArray( parts ) && parts.length > 0 ){
    updatedContentType = parts[0].split( 'CUSTOM_' )[1];
  }
  return updatedContentType
}

export const numberOfApps = ( deviceDetails ) => {
  if( !deviceDetails ){
    return ''
  }
  const [firstPart, secondPart, ...rest] = deviceDetails.split( ' ' )
  const firstText = firstPart + ' ' + secondPart
  const secondText = rest.join( ' ' )
  return { firstText, secondText }
}

export const setMixpanelData = ( key, value ) => {
  setMixpanelInforamtion( { ...getMixpanelInforamtion(), [key]: value } )
}

export const getMixpanelData = ( key ) => {
  return getMixpanelInforamtion() && Object.keys( getMixpanelInforamtion() ).length > 0 && getMixpanelInforamtion()[key]
}

export const isSeries = ( metaData ) => {
  let isSeries = false;
  if(
    CONTENTTYPE_SERIES.includes(
      metaData?.contentType?.toUpperCase() || metaData?.vodContentType?.toUpperCase()
    )
  ){
    isSeries = true;
  }
  return isSeries;
};

export const insufficientBalanceVerbiage = ( balanceDetails, payableAmountNew ) =>{
  if( !balanceDetails || !payableAmountNew ){
    return
  }
  return getDthStatus() !== USERS.NON_DTH_USER && ( balanceDetails.lowBalance || parseFloat( balanceDetails.balanceQueryRespDTO?.balance ) < parseFloat( payableAmountNew ) )
}

export const onLoadMixpanelConfiguration = () => {
  setSuperProperties()
  !getFirstLaunch() ? setFirstLaunch( true ) : setFirstLaunch( false )
  initEvents()
}

export const successfullyLoginRedirection = ( setSidebarList, previousPathName, newUser, myPlanProps, history, fromConfirmPurchase, metaData, fromSideMenuSubscribe ) => {
  setSidebarList( {} )
  previousPathName.focusedItem = null
  if( myPlanProps?.appSelectionRequired ){
    setZeroAppPlanPopupOnRefresh( ZERO_PLAN_APPS_VERBIAGE.DURING_LOGIN_POPUP )
  }
  if( newUser.current ){
    if( myPlanProps?.isLowerPlan ){
      userHasLowerPlan( previousPathName, history )
    }
    else if( fromConfirmPurchase.current ){
      freemiumUserComesFromConfirmPurchase( history )
    }
    else if( fromSideMenuSubscribe.current ){
      userComesFromSideMenu( history, myPlanProps )
    }
    else if( previousPathName.current || previousPathName.navigationRouting ){
      if( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' || getLiveFlagLocal() === 'true' ){
        userComesFromPiPageOfSameRoute( previousPathName, metaData, history, myPlanProps )
      }
      else if( getAllLoginPath() && getAllLoginPath().length > 0 ){
        userComesFromPiPageOfDifferentRoute( previousPathName, metaData, history, myPlanProps )
      }
      else {
        userComesFromPiPageOfPreviousPathName( history, previousPathName )
      }
    }
    else {
      redirectToHome( history )
    }
  }
  else if( !newUser.current ){
    if( myPlanProps?.isLowerPlan ){
      userHasLowerPlan( previousPathName, history )
    }
    else if( myPlanProps?.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && fromConfirmPurchase.current ){
      freemiumUserComesFromConfirmPurchase( history )
    }
    else if( myPlanProps?.upgradeMyPlanType && fromConfirmPurchase.current ){
      paidUserComesFromConfirmPurchase( history )
    }
    else if( fromSideMenuSubscribe.current ){
      userComesFromSideMenu( history, myPlanProps )
    }
    else if( previousPathName.current || previousPathName.navigationRouting ){
      if( myPlanProps?.productId && previousPathName.navigationRouting?.includes( PAGE_TYPE.CONFIRM_PIRCHASES ) ){
        history.push( '/plan/current' )
      }
      else if( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' || getLiveFlagLocal() === 'true' ){
        userComesFromPiPageOfSameRoute( previousPathName, metaData, history, myPlanProps )
      }
      else if( getAllLoginPath() && getAllLoginPath().length > 0 ){
        userComesFromPiPageOfDifferentRoute( previousPathName, metaData, history, myPlanProps )
      }
      else {
        userComesFromPiPageOfPreviousPathName( history, previousPathName )
      }
    }
    else {
      redirectToHome( history )
    }
  }
}

export const checkContentList = ( contentListElement ) => {
  return !!contentListElement;
}

export const handleDistroRedirection = ( history, args ) => {
  history.push( {
    pathname: PAGE_TYPE.PLAYER,
    args: args
  } )
}

export const convertStringToCamelCase = ( str ) => {
  return str ? str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase() : ''
}

export const downloadAppHandler = ( provider ) =>{
  window.webOS?.service.request( 'luna://com.webos.applicationManager', {
    method: 'launch',
    parameters: {
      id: APPIDS.PLAYSTORE,
      params: {
        'query': APPIDS.REDIRECT_PATH + getLaunchAppID( provider )
      }
    },
    onSuccess: ( res ) => {
      console.log( 'App open success. ', res ); // eslint-disable-line
    },
    onFailure: ( res ) => {
      console.log( 'App open fail. ', res ); // eslint-disable-line
      sendExecptionToSentry( res, `${ SENTRY_TAG.LAUNCH_STORE_ERROR } ${ provider } ${ getLaunchAppID( provider ) }`, SENTRY_LEVEL.ERROR );
    }
  }
  )
}

export const compareBuildVersions = ( currentVersion, updatedVersion ) => {
  if( !currentVersion || !updatedVersion ){
    return false;
  }
  return compare( currentVersion, updatedVersion, '<' )
}

export const redirectToPlayStore = () => {
  console.log( 'Redirect to playstore' )
  downloadAppHandler( process.env.REACT_APP_BINGE_APP_ID )
}

export const exitApp = () => {
  console.log( 'Exit App' )
  if( window.webapis ){
    window.tizen.application.getCurrentApplication().exit();
  }
  else {
    window.close();
  }
}

export const contentDetailUrl = ( content, byPass = true ) => {
  let url;
  if( content.seriesvrId && byPass ){
    url = '/content/detail/' + content.seriescontentType + '/' + content.seriesvrId
  }
  else {
    if( content.contentType?.includes( 'LIVE' ) && content.provider === DISTRO_CHANNEL.appType ){
      url = '/content/detail/' + content.contentType + '/' + content.id + '?provider=' + content.provider
    }
    else {
      url = '/content/detail/' + content.contentType + '/' + content.id
    }
  }
  return url
}

export const switchPubnubChannelHandling = ( dthStatus, pubnubFetchData, source ) => {
  if( dthStatus !== USERS.DTH_OLD_STACK_USER ){
    const formattedHeader = {
      'subscriberId': getSubscriberId(),
      'baId': getBaID(),
      'platform': getPlatformType( false ),
      'dthStatus': dthStatus,
      'authorization': getAuthToken(),
      'source': source
    }
    pubnubFetchData( formattedHeader )
  }
  // else {
  //   pubnubFetchData()
  // }
}

export const generateGUID = () => {
  const s4 = () => Math.floor( ( 1 + Math.random() ) * 0x10000 )
    .toString( 16 )
    .substring( 1 );
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export const appleCoupanStatus = ( userInfo ) => {
  const itemArray = userInfo.nonSubscribedPartnerList || []
  const applePremium = itemArray.length > 0 && itemArray.filter( data => data.partnerName.toLowerCase() === PROVIDER_LIST.APPLETV.toLowerCase() ).length > 0
  if( userInfo.packId === PACKS.ADD_PACK_FREEMIUM ){
    // Freemium
    return MIXPANELCONFIG.VALUE.NA
  }
  else if( applePremium ){
    // Pack does not have Apple
    return MIXPANELCONFIG.VALUE.NA
  }
  else {
    // Pack have Apple
    return appleStatus( userInfo.appleCoupanStatus )
  }
}

const appleStatus = ( appleCoupanStatus ) => {
  if( appleCoupanStatus === APPLETV.CLAIM_STATUS.PENDING ){
    return APPLETV.CLAIM_STATUS.CODE_GENERATED
  }
  else if( appleCoupanStatus === APPLETV.CLAIM_STATUS.CONSUMED ){
    return APPLETV.CLAIM_STATUS.CODE_REDEEMDED
  }
  else {
    return appleCoupanStatus
  }
}

export const convertSrtTextToVttText = ( srtContent ) =>{
  const srtRegex = /(.*\n)?(\d\d:\d\d:\d\d),(\d\d\d --> \d\d:\d\d:\d\d),(\d\d\d)/g;
  const vttText = 'WEBVTT\n\n' + srtContent.replace( srtRegex, '$1$2.$3.$4' );
  return vttText;
}

export const showToastMsg = ( setShowNotification, setNotificationMessage, data, setNotificationIcon, iconName = 'InformationIcon' /** This is for PRIME PENDING STATE*/, timeoutTime = 3000 ) => {
  setShowNotification?.( true )
  setNotificationMessage?.( data )
  setNotificationIcon?.( iconName )
  setTimeout( () => {
    setShowNotification?.( false )
  }, timeoutTime );
}

export const getBgImg = ( bgImg, url ) => {
  let imageUrl = bgImg;
  if( url && url.includes( 'cloudinary' ) ){
    imageUrl = `${url}c_scale,f_auto,q_auto/` + bgImg;
  }
  else if( url && url.includes( 'mediaready' ) ){
    imageUrl = `${url}f_auto,q_auto/` + bgImg;
  }
  return imageUrl;
}

export const contentPlayMixpanelEventForDeeplink = ( metaData, props, myPlanProps, responseSubscription, taUseCaseId, watchNowCTA, inputValue = null ) => {
  player_play_event(
    MIXPANELCONFIG.EVENT.PLAY_CONTENT,
    null,
    metaData,
    props,
    getMixpanelData( 'playerSource' ),
    myPlanProps,
    null,
    null,
    null,
    null,
    null,
    taUseCaseId,
    false,
    responseSubscription,
    watchNowCTA,
    inputValue
  );
}

export const handleRedirectionParentalPinSetup = ( history, args ) => {
  history.push( {
    pathname: `/device/fourDigitParentalPinSetup`,
    args: args
  } )
}

export const getBingePrimeStatusMixpanel = ( responseSubscription ) => {
  if( getProductName() && getProductName() === PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPackForUnsubscribe?.apvDetails?.primePackMixpanelStatus
  }
  else if( getProductName() && getProductName() !== PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPack?.apvDetails?.primePackMixpanelStatus
  }
  else {
    return PRIME.PACK_STATUS.NOT_ELIGIBLE
  }
}

export const getExistingPrimeMixpanel = ( responseSubscription ) => {
  if( getProductName() && getProductName() === PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPackForUnsubscribe?.apvDetails?.primeNudge ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
  }
  else if( getProductName() && getProductName() !== PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPack?.apvDetails?.primeNudge ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
  }
  else {
    return MIXPANELCONFIG.VALUE.NO
  }
}

export const getBingePrimeStatus = ( responseSubscription ) => {
  if( getProductName() && getProductName() === PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPackForUnsubscribe?.apvDetails?.primePackStatus
  }
  else if( getProductName() && getProductName() !== PACKS.FREEMIUM ){
    return responseSubscription?.responseData?.currentPack?.apvDetails?.primePackStatus
  }
  else {
    return PRIME.PACK_STATUS.NOT_ELIGIBLE
  }
}

export const updateFibrePopUpMessage = ( message, provider ) => {
  if( !message || !provider ){
    return null
  }
  return message.replace( '[partnername]', `${ provider } ` );
}

export const getPageNameForMixpanel = ( source ) => {
  if( source === MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE || source === MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE || source === MIXPANELCONFIG.VALUE.BROWSE_BY_APP ){
    return getMixpanelData( 'letfMenuClick' ) || constants.HOME
  }
  return source
}

export const clearEpisodeListData = ( episodePageData ) => {
  episodePageData.mediaCardRestoreId = null
  episodePageData.cardId = null
  episodePageData.selectedSeason = null
  episodePageData.showKeyboard = null
  episodePageData.seriesInputValue = null
  episodePageData.totalCards = null
  episodePageData.totalCardsPagination = null
  episodePageData.episodePageNumber = null
}

export const homePageRMNSubscribed = ( type ) => {
  return type === PACKS.FREEMIUM || type === PACKS.GUEST
}

export const trackMipanelEvents = () => {
  if( window.location.pathname.includes( 'verify-otp' ) ){
    /* Mixpanel-event */
    loginOtpPageBack()
  }
  else if( window.location.pathname.includes( 'login' ) ){
    /* Mixpanel-event */
    loginExit( MIXPANELCONFIG.VALUE.LOGIN_EXISTINGRMN_PAGE )
  }
  else if( window.location.pathname.includes( 'new-rmn' ) ){
    /* Mixpanel-event */
    loginExit( MIXPANELCONFIG.VALUE.LOGIN_RMNENTRY_PAGE )
  }
}

function convertTimeStringToSeconds( timeString ){ // TODO: this method is not in use, remove this.
  if( !timeString ){
    return
  }
  const [hours, minutes, seconds] = timeString.split( ':' ).map( Number );
  let totalSeconds = ( hours * 3600 ) + ( minutes * 60 ) + seconds;
  convertSeconds( totalSeconds )
}

function convertSeconds( totalSeconds ){
  if( !totalSeconds ){
    return
  }
  const hours = Math.floor( totalSeconds / 3600 );
  const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
  const seconds = totalSeconds % 60;
  if( hours ){
    return `${hours}h ${minutes}m`;
  }
  else if( minutes ){
    return `${minutes}m`;
  }
  else {
    return `${seconds}s`;
  }
}

export const MIXPANEL_RAIL_TYPE = {
  BINGE_LIST: 'BINGE-LIST', // DONE
  BROWSE_BY_LANGUAGE: 'BROWSE-BY-LANGUAGE', // DONE
  BROWSE_BY_GENRE: 'BROWSE-BY-GENRE', // DONE
  BROWSE_BY_APP: 'BROWSE-BY-APP', // DONE
  HERO_BANNER: 'HERO-BANNER', // DONE
  SYSTEM_GENERATED: 'SYSTEM-GENERATED', // DONE
  LIVE_EVENT: 'LIVE-EVENT',
  RECOMMENDED: 'RECOMMENDED', // DONE
  EDITORIAL: 'EDITORIAL', // DONE
  TA_RELATED_RAIL: 'TA-RELATED-RAIL', // DONE
  TRENDING: 'TRENDING', // DONE
  SEARCH_RESULTS: 'SEARCH-RESULTS', // DONE
  SEARCH_SUGGESTIONS: 'SEARCH-SUGGESTIONS', // DONE
  CONTINUE_WATCHING: 'CONTINUE-WATCHING', // DONE
  SYSTEM_RELATED_RAIL: 'SYSTEM-RELATED-RAIL', // DONE
  MORE_EPISODES: 'MORE-EPISODES',
  BROWSE_BY_CHANNEL: 'BROWSE-BY-CHANNEL'
}

export const handleErrorMessage = ( error, response, hardcodedMessage ) => {
  if( error ){
    if( error.response && error.response.data ){
      return error.response.data.message || error.message;
    }
    else if( typeof error === 'string' ){
      return error;
    }
    else if( error.message ){
      return error.message;
    }
  }
  else if( response && response.code !== 0 ){
    return response.message;
  }
  else {
    return hardcodedMessage;
  }
}

export const removeSunNxtSdk = ()=>{
  if( isTizen ){
    window.SUNNXT_SAM_SDK = null;
  }
  else {
    window.SUNNXT_LG_SDK = null;
  }
  window.sunnxtSdkloadattempt = null;
  window.firstPlay = null;
  const sunNxtScript = document.getElementById( 'sunNxtScriptFile' );
  if( sunNxtScript ){
    sunNxtScript.parentNode?.removeChild( sunNxtScript );
  }
}

export const removeSonySDK = ()=>{
  window.SPN_MANAGER = null;
  window.sdkloadattempt = null;
  const sonyScript = document.getElementById( 'sonyScriptFile' );
  if( sonyScript ){
    sonyScript.parentNode?.removeChild( sonyScript );
  }
}


export const removeMXSDK = () => {
  const mainScript = document.getElementById( 'mxScriptFile' );
  const domain = mainScript?.getAttribute( 'src' )?.match( /\/\/([^\/]+)/ )?.[1] || '';
  if( domain ){
    document.querySelectorAll( 'script' ).forEach( script => {
      const scriptSrc = script.getAttribute( 'src' );
      if( scriptSrc?.includes( domain ) ){
        script.parentNode?.removeChild( script );
      }
    } );
    mainScript.parentNode?.removeChild( mainScript );
  }
};
export const getTizenVersion = () => {
  return window.tizen && tizen?.systeminfo?.getCapability?.( 'http://tizen.org/feature/platform.version' )
}

export const isIspEnabled = ( myPlanProps ) => {
  return Boolean( myPlanProps && myPlanProps.ispEnabled && myPlanProps.upgradeFDOCheck && myPlanProps.appSelectionRequired === false )
}


export const renderImage = ( content, sectionSource, layout_Type, section_src, url, contentRailType ) => {
  let imageUrl;
  if( ( sectionSource === SECTION_SOURCE.RECOMMENDATION ) || ( contentRailType === 'RelatedContent' || contentRailType === 'CatalogPartnerContent' ) ){
    imageUrl = content.seriesimage || content.image || content.boxCoverImage || content.chipIcon
  }
  else if( sectionSource === SECTION_SOURCE.BINGE_CHANNEL || isLiveContentType( content.contentType ) ){
    imageUrl = content.newImageUrl || content.image;
  }
  else {
    imageUrl = content.image || content.boxCoverImage
  }
  return `${cloudinaryCarousalUrl( layout_Type, url, section_src )}/${imageUrl}`

}

const useRenderImage = () => {
  const renderImage = useCallback( ( content, sectionSource, layout_Type, section_src, url, contentRailType ) => {
    let imageUrl;

    if(
      sectionSource === SECTION_SOURCE.RECOMMENDATION ||
      contentRailType === 'RelatedContent' ||
      contentRailType === 'CatalogPartnerContent'
    ){
      imageUrl = content.seriesimage || content.image || content.boxCoverImage;
    }
    else if(
      sectionSource === SECTION_SOURCE.BINGE_CHANNEL ||
      isLiveContentType( content.contentType )
    ){
      imageUrl = content.newImageUrl || content.image;
    }
    else {
      imageUrl = content.image || content.boxCoverImage || content.chipIcon;
    }

    return `${cloudinaryCarousalUrl( layout_Type, url, section_src )}/${imageUrl}`;
  }, [] );

  return renderImage;
};
export default useRenderImage;

export const isSquareLayout = ( layoutType ) => {
  return layoutType === LAYOUT_TYPE.SQUARE || layoutType === ''
}

export const isLandScapePortraitLayout = ( layoutType ) =>{
  return layoutType === LAYOUT_TYPE.LANDSCAPE || layoutType === LAYOUT_TYPE.PORTRAIT
}

export const getListOfDevices = ( devices ) => {
  if( !devices ){
    return null;
  }
  const deviceArray = devices.split( ',' ).map( item => item );
  const keyPrefix = MIXPANELCONFIG.PARAMETER.DEVICE_REMOVED;

  return deviceArray.length === 1 ? [{ [keyPrefix]: deviceArray[0] }] : deviceArray.map( ( item, index ) => ( { [`${keyPrefix}-${index + 1}`]: item } ) );
};

export const truncateTextEllipse = ( str = '', maxLength ) => {
  if( str.length <= maxLength ){
    return str;
  }
  const truncated = str.substring( 0, maxLength - 2 ); // Keep space for the ellipsis
  return truncated + '...';
}

export const getBestOfAppLogo = ( appName, partnerLogo ) => {

  const result = partnerLogo?.providerDisplayName?.find( ( f ) =>
    f.provider?.toLowerCase() === appName?.toLowerCase() || f?.providerDisplayName?.toLowerCase()?.includes( appName?.toLowerCase() )
  );
  if( result ){
    return result.provider
  }

};

export const getCustomLayoutType = ( sectionSource, layoutType ) => {
  let customLayoutType = '';
  if( sectionSource === SECTION_SOURCE.WATCHLIST || sectionSource === SECTION_SOURCE.CONTINUE_WATCHING ){
    customLayoutType = LAYOUT_TYPE.LANDSCAPE
  }
  else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
    customLayoutType = '' ;
  }
  else {
    customLayoutType = layoutType
  }

  return customLayoutType
};

export const isEmptyObject = ( obj ) => {
  return Object.values( obj ).every( value => value === undefined || value === null );
};

// below is the testing Data will be removed later once API fully working fine

export const compositeDummyDemoData = {
  id: 33165,
  title: 'RECOMMENED Chip Rail',
  sectionType: 'RAIL',
  sectionSource: 'BINGE_CHIP_RAIL',
  railType: 'EDITORIAL',
  layoutType: 'LANDSCAPE',
  chipList: [],
  // chipList: [
  //   {
  //     chipId: '42',
  //     chipName: 'Hotstar',
  //     chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1738041390075.gif',
  //     chipDisplayText: 'Hotstar'
  //   },
  //   {
  //     chipId: '44',
  //     chipName: 'Docubay',
  //     chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1738044926471.png',
  //     chipDisplayText: 'Docubay'
  //   },
  //   {
  //     chipId: '46',
  //     chipName: 'epicon',
  //     chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1739251483871.png',
  //     chipDisplayText: 'epicon'
  //   },
  //   {
  //     chipId: '47',
  //     chipName: 'Chaupal',
  //     chipIcon: '',
  //     chipDisplayText: 'Chaupal'
  //   },
  //   {
  //     chipId: '48',
  //     chipName: 'Lionsgate',
  //     chipIcon: '',
  //     chipDisplayText: 'Lionsgate'
  //   }
  // ],
  chipConfigurationType: 'RECOMMENDATION',
  imageMetadata: {
    cardSize: 'LARGE'
  },
  editorialPlatformList: [
    'DONGLE',
    'OPEN_FS',
    'SMART_TV',
    'SAMSUNG',
    'LG',
    'TABLET',
    'AUTOMOTIVE',
    'BINGE_ANYWHERE_IOS',
    'BINGE_ANYWHERE_ANDROID',
    'BINGE_ANYWHERE_WEB'
  ],
  shuffleList: [],
  contentList: [],
  totalCount: 14,
  position: 17,
  pageType: 'DONGLE_HOMEPAGE',
  buttonCTAText: 'Play Now',
  footerDesc: 'Never miss out on a &lt;category&gt; release...',
  metaTag: {
    title: 'This is updated meta titles.NowTesting',
    description: 'Watch trending NTR movies'
  },
  specialRail: false,
  subscribed: false,
  unSubscribed: false,
  bannerColorCodeEnabled: true,
  subPageType: 'NONE',
  sequencingRequired: false,
  titleDurationEnabled: false,
  titleEnabledLs: true
};

export const compositeDummyDemoData2 = {
  id: 91865,
  title: 'New Chips Rail',
  sectionType: 'RAIL',
  sectionSource: 'BINGE_CHIP_RAIL',
  railType: 'EDITORIAL',
  layoutType: 'PORTRAIT',
  chipList: [
    {
      chipId: '35',
      chipName: 'Horror',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737453547501.gif',
      chipDisplayText: 'Horrors'
    },
    {
      chipId: '36',
      chipName: 'Comedy',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1743066951522.gif',
      chipDisplayText: 'Comedy'
    },
    {
      chipId: '37',
      chipName: 'Drama',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1755064584788.jpg',
      chipDisplayText: 'Drama'
    },
    {
      chipId: '38',
      chipName: 'Adventure',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1738316470915.jpeg',
      chipDisplayText: 'Adventure'
    },
    {
      chipId: '65',
      chipName: 'LiveTV',
      chipIcon: '',
      chipDisplayText: 'Live'
    }
  ],
  chipConfigurationType: 'RECOMMENDATION',
  imageMetadata: {
    cardSize: 'SMALL'
  },
  editorialPlatformList: [
    'DONGLE',
    'OPEN_FS',
    'SMART_TV',
    'SAMSUNG',
    'LG',
    'TABLET',
    'AUTOMOTIVE',
    'BINGE_ANYWHERE_IOS',
    'BINGE_ANYWHERE_ANDROID',
    'BINGE_ANYWHERE_WEB'
  ],
  shuffleList: [],
  contentList: [],
  totalCount: 5,
  position: 101,
  pageType: 'DONGLE_HOMEPAGE',
  buttonCTAText: 'Play Now',
  footerDesc: 'Never miss out on a &lt;category&gt; release...',
  metaTag: {
    title: 'This is updated meta titles.NowTesting',
    description: 'Watch trending NTR movies'
  },
  specialRail: false,
  subscribed: false,
  unSubscribed: false,
  bannerColorCodeEnabled: true,
  subPageType: 'NONE',
  sequencingRequired: false,
  titleDurationEnabled: false,
  titleEnabledLs: true
};

export const compositeDummyDemoData3 = {
  id: 91818,
  title: 'Binge Top 10 Rail - Chips',
  sectionType: 'RAIL',
  sectionSource: 'BINGE_CHIP_RAIL',
  railType: 'BINGE_TOP_10',
  layoutType: 'TOP_PORTRAIT',
  chipList: [
    {
      chipId: '26',
      chipName: 'Hindi',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1739251483871.png',
      chipDisplayText: 'हिंदी'
    },
    {
      chipId: '27',
      chipName: 'Marathi',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1738049112152.png',
      chipDisplayText: 'मराठी'
    },
    {
      chipId: '29',
      chipName: 'English',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737635862854.json',
      chipDisplayText: 'English'
    },
    {
      chipId: '31',
      chipName: 'Bangali',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737607447134.gif',
      chipDisplayText: 'Bangali'
    },
    {
      chipId: '32',
      chipName: 'Telugu',
      chipIcon: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737635862854.json',
      chipDisplayText: 'Telugu'
    },
    {
      chipId: '70',
      chipName: 'Bhojpuri',
      chipIcon: '',
      chipDisplayText: 'Bhojpuri'
    }
  ],
  configurationType: '',
  imageMetadata: {
    cardSize: 'SMALL'
  },
  editorialPlatformList: [
    'DONGLE',
    'OPEN_FS',
    'SMART_TV',
    'SAMSUNG',
    'LG',
    'TABLET',
    'AUTOMOTIVE',
    'BINGE_ANYWHERE_IOS',
    'BINGE_ANYWHERE_ANDROID',
    'BINGE_ANYWHERE_WEB'
  ],
  shuffleList: [],
  contentList: [],
  totalCount: 9,
  position: 121,
  pageType: 'DONGLE_HOMEPAGE',
  buttonCTAText: 'Play Now',
  footerDesc: 'Never miss out on a &lt;category&gt; release...',
  metaTag: {
    title: 'This is updated meta titles.NowTesting',
    description: 'Watch trending NTR movies'
  },
  specialRail: false,
  subscribed: false,
  unSubscribed: false,
  bannerColorCodeEnabled: true,
  subPageType: 'NONE',
  sequencingRequired: false,
  titleDurationEnabled: false,
  titleEnabledLs: true
};

export const titleRailDummyData4 = {
  id: 91815,
  title: 'Title Rail : Chips',
  sectionType: 'RAIL',
  sectionSource: 'BINGE_CHIP_RAIL',
  railType: 'TITLE',
  layoutType: 'LANDSCAPE',
  chipList: [
    {
      'chipId': '26',
      'chipName': 'Hindi',
      'chipIcon': 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1739251483871.png',
      'chipDisplayText': 'हिंदी'
    },
    {
      'chipId': '27',
      'chipName': 'Marathi',
      'chipIcon': 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1738049112152.png',
      'chipDisplayText': 'मराठी'
    },
    {
      'chipId': '29',
      'chipName': 'English',
      'chipIcon': 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737635862854.json',
      'chipDisplayText': 'English'
    },
    {
      'chipId': '31',
      'chipName': 'Bangali',
      'chipIcon': 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737607447134.gif',
      'chipDisplayText': 'Bangali'
    },
    {
      'chipId': '32',
      'chipName': 'Telugu',
      'chipIcon': 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1737635862854.json',
      'chipDisplayText': 'Telugu'
    }
  ],
  configurationType: '',
  imageMetadata: {
    cardSize: 'SMALL'
  },
  editorialPlatformList: [
    'DONGLE',
    'OPEN_FS',
    'SMART_TV',
    'SAMSUNG',
    'LG',
    'TABLET',
    'AUTOMOTIVE',
    'BINGE_ANYWHERE_IOS',
    'BINGE_ANYWHERE_ANDROID',
    'BINGE_ANYWHERE_WEB'
  ],
  shuffleList: [],
  contentList: [],
  totalCount: 9,
  position: 121,
  pageType: 'DONGLE_HOMEPAGE',
  buttonCTAText: 'Play Now',
  footerDesc: 'Never miss out on a &lt;category&gt; release...',
  metaTag: {
    title: 'This is updated meta titles.NowTesting',
    description: 'Watch trending NTR movies'
  },
  specialRail: false,
  subscribed: false,
  unSubscribed: false,
  bannerColorCodeEnabled: true,
  subPageType: 'NONE',
  sequencingRequired: false,
  titleDurationEnabled: false,
  titleEnabledLs: true
};

export const getABTestingFeatureConfig = ( featureKey ) => {
  const allData = getABTestingData();
  return allData?.[featureKey] || null;
};

export const ensureTrailingSlash = ( url )=>{
  return url?.endsWith( '/' ) ? url : url + '/';
}