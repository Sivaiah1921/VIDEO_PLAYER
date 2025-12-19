/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * Component to display single Language card
 *
 * @module views/components/LanguageCard
 * @memberof -Common
 */
import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Image from '../Image/Image';
import Text from '../Text/Text';
import Link from '../Link/Link';
import './LanguageCard.scss';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import get from 'lodash/get';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { browse_by_language, home_clicks } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { setContentRailPositionData, setPageNumberPagination, getLastCardIndex, removeLastFocusedSynopsisID } from '../../../utils/localStorageHelper';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { constants, COMMON_HEADERS, SECTION_SOURCE, PROVIDER_LIST_NEW_HEIGHT, PARTNER_SUBSCRIPTION_TYPE, MIXPANEL_CONTENT_TYPE, PROVIDER_LIST_MORE_HEIGHT, PROVIDER_LIST, PAGE_NAME } from '../../../utils/constants';

/**
 * Represents a LanguageCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LanguageCard
 */
export const LanguageCard = function( props ){
  const history = useHistory();
  const { setContentInfo, customPageType } = useHomeContext()
  const previousPathName = useNavigationContext()
  const responseSubscription = useSubscriptionContext( );
  const { setTotalrailsList, setLastRailTitle, railsRestoreId, searchPageData, railRestoreTitle, railCardTitle, checkRecRailRef, setLastFocusFrom, lastFocusFrom, catalogPage, topPositionRailValueContext, homeDonglePageData, donglePageData } = useMaintainPageState() || null
  const { image, title, onFocus, rawImage, setHomeCaroselInfo, focusKeyRefrence, topPositionRailValue, contentID, totalRails, sectionSource, contentNativeName, previewPoster, secondaryText, isKeyReleased } = props;

  const { ref, focused } = useFocusable( {
    onFocus,
    onEnterPress: () => {
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false )
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const languageList = useMemo( () => get( config, 'languages' ), [config] )
  const languageImage = useMemo( () => {
    if( !languageList || !languageList.hasOwnProperty( title ) ){
      return null;
    }

    const imagePath = languageList[title];
    if( !url || !imagePath ){
      return null;
    }

    if( url.includes( 'cloudinary' ) ){
      return `${url}c_scale,f_auto,q_auto/${imagePath}`;
    }
    else if( url.includes( 'mediaready' ) ){
      return `${url}f_auto,q_auto/${imagePath}`;
    }

    return null;
  }, [languageList, title] );
  const storeDongleResponseInContext = useMemo( () => {
    const {
      title,
      releaseYear: year,
      genre,
      duration,
      providerName: provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      metaDetails,
      tagInfoDTO,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      image,
      contentType,
      contractName,
      sectionSource,
      imageCardSize: cardSize,
      layoutTypeForMixPanel: layoutType
    } = props;

    return {
      title,
      year,
      genre,
      provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      metaDetails,
      tagInfoDTO,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      image,
      contentType,
      id:contentID,
      contractName,
      sectionSource,
      cardSize,
      layoutType
    };
  }, [
    props.title,
    props.releaseYear,
    props.genre,
    props.duration,
    props.providerName,
    props.partnerSubscriptionType,
    props.language,
    props.languagesGenres,
    props.metaDetails,
    props.tagInfoDTO,
    props.contentNativeName,
    props.previewPoster,
    props.secondaryText,
    props.description,
    props.image,
    props.contentType,
    props.contractName,
    props.imageCardSize,
    props.layoutTypeForMixPanel,
    props.sectionSource,
    contentID
  ] );
  const BBLRailClickEvent = ( ) => {
    if( props.source ){
      /* Mixpanel-event */
      home_clicks( props.source )
    }
    /* Mixpanel-event */
    browse_by_language( customPageType, props, responseSubscription ) // need to check
  }



  const onEnterPressCallBackFn = () => {
    const obj = {
      contentPosition: props.contentPosition,
      railPosition: props.railPosition,
      sectionType: props.sectionType,
      contentType: props.contentType,
      sectionSource: props.sectionSource,
      railTitle: props.railTitle,
      configType: props.configType,
      railId: props.railId,
      contentId: contentID,
      contentNativeName:props.contentNativeName,
      previewPoster:props.previewPoster,
      secondaryText:props.secondaryText
    }
    setContentRailPositionData( obj )
    catalogPage.fullLoader = true
    setPageNumberPagination( 1 )
    setContentInfo( {} )
    const searchScrollPosition = document.querySelector( '.Search__scrollContainer' )?.scrollTop
    const searchLeftPanelOpen = document.querySelector( '.Search__containerLeft' ) !== null
    const railUniqId = Number( `${props.railId}${contentID}` )
    setTotalrailsList( Math.ceil( totalRails / 10 ) * 10 )
    setLastRailTitle( `${props.railId }_${ props.railTitle }` )
    railsRestoreId.current = railUniqId;
    BBLRailClickEvent();
    if( window.location.pathname.includes( '/Search' ) ){
      searchPageData.searchLangGenreCardRestoreId = focusKeyRefrence
      searchPageData.leftPanelOpen = searchLeftPanelOpen
      searchPageData.scrollTop = searchScrollPosition
    }
    railRestoreTitle.current = props.railTitle
    railCardTitle.current = title
    checkRecRailRef.isrecommendedRail = sectionSource === SECTION_SOURCE.RECOMMENDATION
    history.push( {
      pathname: '/browse-by/language',
      search: `?language&title=${props.title}&railId=${ !window.location.pathname.includes( '/Search' ) ? props.railId : ''}`
    } )
    previousPathName.subscriptionPath = null
  }
  const MPItems = useMemo( () => ( {
    // pageType: getSourceForMixPanel( window.location.pathname ),
    title: props.title,
    railPosition: props.railPosition,
    contentType: props.contentType,
    sectionSource: props.sectionSource,
    language: props.language?.join() || '',
    primaryLanguage: props.language?.[0] || '',
    genre: props.genre?.join() || '',
    primaryGenre: props.genre?.[0] || '',
    provider: props.providerName,
    contentPosition: props.contentPosition,
    contentTitle: props.contentTitle,
    releaseYear: props.releaseYear || '',
    deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    actors: props.actors?.join() || '',
    appName:props.providerName,
    packPrice: responseSubscription?.responseData?.currentPack?.amountValue || '',
    packName: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType || '',
    liveContent: props.liveContent,
    railTitle: props.railTitle,
    sectionType: props.sectionType,
    channelName: props.channelName,
    channelNumber: props.channelNumber,
    id: contentID
  } ), [
    props.title,
    props.railPosition,
    props.contentType,
    props.sectionSource,
    props.language,
    props.genre,
    props.providerName,
    props.contentPosition,
    props.contentTitle,
    props.partnerSubscriptionType,
    props.releaseYear,
    props.actors,
    props.providerName,
    responseSubscription,
    props.liveContent,
    props.railTitle,
    props.sectionType,
    props.channelName,
    props.channelNumber,
    contentID,
    window.location.pathname
  ] );

  useEffect( () => {
    if( focused ){
      console.log( 'log---1', storeDongleResponseInContext );
      const obj = {
        contentPosition: props.contentPosition,
        railPosition: props.railPosition,
        sectionType: props.sectionType,
        contentType: props.contentType,
        sectionSource: props.sectionSource,
        railTitle: props.railTitle,
        configType: props.configType,
        railId: props.railId,
        contentId: contentID,
        contentTitle: props.title,
        placeHolder: props.placeHolder,
        contentPartner: props.providerName,
        contentNativeName:props.contentNativeName,
        previewPoster:props.previewPoster,
        secondaryText:props.secondaryText,
        isKeyReleased: isKeyReleased
      }
      setContentRailPositionData( obj )
      props.setRailFocusedCardInfo && props.setRailFocusedCardInfo( MPItems );
      if( isKeyReleased ){
        homeDonglePageData.current = null
        homeDonglePageData.current = storeDongleResponseInContext;
        if( window.location.pathname.includes( '/browse-by-app/' ) ){
          donglePageData.current = storeDongleResponseInContext
        }
      }
    }
  }, [focused, isKeyReleased] );

  return (
    <div className={
      classNames( 'LanguageCard',
        { 'LanguageCard--withFocus': focused }
      ) }
    focused={ focused ? focused.toString() : undefined }
    ref={ ref }
    onMouseEnter={ props?.onMouseEnterCallBackFn }
    onMouseUp={ onEnterPressCallBackFn }
    >
      <Link>
        <Image
          src={ languageImage?.footer_image ? languageImage?.footer_image : image }
          alt={ title }
        />
        <div className='LanguageCard__Text'>
          <Text
            textStyle='subtitle-1'
            color={ !focused ? 'bingeBlue-25' : 'focus-color' }
          >
            { title }
          </Text>
        </div>
      </Link>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - language card title
 * @property {string} image - language card image src
 * @property {string} url - language card redirection url
 * @property {bool} isFocussed - language card is focusses
 * @property {string} contentNativeName - contentNativeName of the genre
 * @property {string} previewPoster - previewPoster of the genre
 * @property {string} secondaryText - secondaryText of the genre
 */
export const propTypes =  {
  title: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  isFocussed: PropTypes.bool,
  contentNativeName: PropTypes.string,
  secondaryText:PropTypes.secondaryText,
  previewPoster:PropTypes.previewPoster
};

LanguageCard.propTypes = propTypes;

export default LanguageCard;
