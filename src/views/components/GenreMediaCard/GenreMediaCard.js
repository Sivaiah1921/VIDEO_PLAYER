/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * Media card component for Genres rail item
 *
 * @module views/components/GenreMediaCard
 * @memberof -Common
 */
import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Image from '../Image/Image';
import Link from '../Link/Link';
import Text from '../Text/Text';
import './GenreMediaCard.scss';
import { useHistory } from 'react-router-dom';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { browse_by_genre, home_clicks } from '../../../utils/mixpanel/mixpanelService';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { constants, COMMON_HEADERS, SECTION_SOURCE, PROVIDER_LIST_NEW_HEIGHT, PARTNER_SUBSCRIPTION_TYPE, MIXPANEL_CONTENT_TYPE, PROVIDER_LIST_MORE_HEIGHT, PROVIDER_LIST, PAGE_NAME } from '../../../utils/constants';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { setContentRailPositionData, setPageNumberPagination, getLastCardIndex, removeLastFocusedSynopsisID, setTrailerContentCategory, setTrailerFromApi } from '../../../utils/localStorageHelper';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
/**
 * Represents a GenreMediaCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns GenreMediaCard
 */
export const GenreMediaCard = function( props ){
  const { onFocus, focusKeyRefrence, contentID, totalRails, topPositionRailValue, setHomeCaroselInfo, sectionSource, newImage, genereRotate, contentNativeName, previewPoster, secondaryText, isKeyReleased } = props;
  const { setTotalrailsList, setLastRailTitle, railsRestoreId, searchPageData, railRestoreTitle, railCardTitle, checkRecRailRef, setLastFocusFrom, lastFocusFrom, genereDirection, genereRotationRef, topPositionRailValueContext, homeDonglePageData } = useMaintainPageState() || null
  const history = useHistory();
  const { setMetaData, metaData, setContentPlaybackData } = usePlayerContext()
  const { setContentInfo, customPageType } = useHomeContext()
  const previousPathName = useNavigationContext()
  const { catalogPage, donglePageData } = useMaintainPageState() || null
  const responseSubscription = useSubscriptionContext( );
  const { configResponse } = useAppContext();
  const { config } = configResponse;

  const { ref, focused } = useFocusable( {
    onFocus, onEnterPress:()=>{
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      genereDirection.current = direction
      lastFocusFrom && setLastFocusFrom( false )
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );
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
      sectionSource,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      image,
      contentType,
      contractName,
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
      sectionSource,
      tagInfoDTO,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      image,
      contentType,
      id:contentID,
      contractName,
      cardSize,
      layoutType
    };
  }, [
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
    props.sectionSource,
    props.contentType,
    props.contractName,
    props.imageCardSize,
    props.layoutTypeForMixPanel,
    contentID
  ] );
  const BBGRailClickEvent = ( ) => {
    if( props.source ){
      /* Mixpanel-event */
      home_clicks( props.source )
    }
    /* Mixpanel-event */
    browse_by_genre( customPageType, props, responseSubscription )
  }

  const onEnterPressCallBackFn = ()=>{
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
    genereRotationRef.current = true
    if( window.location.pathname.includes( '/Search' ) ){
      searchPageData.searchLangGenreCardRestoreId = focusKeyRefrence
      searchPageData.isGenereCardClicked = true
      searchPageData.leftPanelOpen = searchLeftPanelOpen
      searchPageData.scrollTop = searchScrollPosition
    }
    BBGRailClickEvent();
    railRestoreTitle.current = props.railTitle
    railCardTitle.current = props.title
    checkRecRailRef.isrecommendedRail = sectionSource === SECTION_SOURCE.RECOMMENDATION
    catalogPage.imageLink = newImage
    catalogPage.bgImageUrl = props.imageUrl
    history.push( {
      pathname: '/browse-by/genre',
      search: `?genre&title=${props.title}&imageUrl=${props.imageUrl}&railId=${!window.location.pathname.includes( '/Search' ) ? props.railId : ''}`
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
      previousPathName.playerScreen = null;
    }
  }, [focused, isKeyReleased] );

  return (
    <>
      <div className={ classNames( 'GenreMediaCard', { 'GenreMediaCard--withFocus': focused } ) }
        focused={ focused ? focused.toString() : undefined }
        ref={ ref }
        onMouseEnter={ props?.onMouseEnterCallBackFn }
        onMouseUp={ onEnterPressCallBackFn }
      >
        <Link secondary={ true }>
          <Image
            alt={ props.title }
            src={ props.newImage }
            notIntersect={ true }
          />
          <Text color='white'
            textStyle='header-genere'
          >
            { props.title }
          </Text>
        </Link>
      </div>
    </>
  );
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - Title of the genre
 * @property {string} contentNativeName - contentNativeName of the genre
 * @property {string} previewPoster - previewPoster of the genre
 * @property {string} secondaryText - secondaryText of the genre
 * @property {string} image - Genre poster image
 * @property {bool} isFocussed - If media card is focussed or not
 * @property {string} url - url to navigate to Genre page
 */
export const propTypes =  {
  contentNativeName: PropTypes.string,
  secondaryText:PropTypes.secondaryText,
  previewPoster:PropTypes.previewPoster,
  title: PropTypes.string,
  image: PropTypes.string,
  isFocussed: PropTypes.bool,
  url: PropTypes.string
};

GenreMediaCard.propTypes = propTypes;

export default GenreMediaCard;
