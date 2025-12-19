/* eslint-disable no-console */
/**
 * The Catalog page shows various genre or languages etc, consisting of Banner and rails.
 *
 * @module views/components/Catalog
 * @memberof -Common
 */
import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Catalog.scss';
import BannerComponent from '../BannerComponent/BannerComponent';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import MediaCard from '../MediaCard/MediaCard';
import CatalogService from '../../../utils/slayer/CatalogService';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import get from 'lodash/get';
import { cloudinaryCarousalUrl, convertStringToCamelCase, getProviderLogo, getScrollInputs, isLandScapePortraitLayout, isSquareLayout, modalDom } from '../../../utils/util';
import { LAYOUT_TYPE, SECTION_SOURCE, constants } from '../../../utils/constants';
import classNames from 'classnames';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import Loader from '../Loader/Loader';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import PlaybackInfo from '../PlaybackInfo/PlaybackInfo';
import { getPageNumberPagination, setPageNumberPagination } from '../../../utils/localStorageHelper';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';

/**
    * Represents a Catalog component
    *
    * @method
    * @param {object} props - React properties passed from composition
    * @returns Catalog
    */

export const railsDataposition = [];
export const railsDatapositionDescription = [];

const ContentLanguageGenreComponent = forwardRef( ( { selectedLanguage, selectedGenre, contentLanguageGenre, cloudinaryCarousalUrl, onRailFocus, url, config, searchLoading, listType, previousPathName, languageGenre, searchFetchData, searchLiveFetchData, liveCardsTotalrecords, railId, checkListTypeExist, getFilterValue, title, layoutType, sectionSource, searchChannelFetchData, channelCardsTotalrecords, catalogHeader, cardSize }, { current: railRef } ) => {
  const previousPath = previousPathName
  const loaderPath = `${window.assetBasePath}loader.gif`;
  const { catalogCardId, catalogPage } = useMaintainPageState() || null
  const providerLogoList = get( config, 'providerLogo' );
  const { ref, focusKey } = useFocusable( )
  const offsetValueRef = useRef( 0 )

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `BUTTON_FOCUS_${id}` )

  }
  const onMouseEnterMediaCardsFn = ( ) => {
    const el1 = document.querySelector( '.Catalog__scrollContainer' )
    const el2 = document.querySelector( '.Catalog__catalogHeader' )
    const el3 = document.querySelector( '.Catalog__LanguageBanner' )
    if( el1 && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      el1.scrollTop = 250
    }
    if( el2 ){
      el2.style.display = 'none'
    }
    if( el3 ){
      el3.style.display = 'none'
    }
  }

  const onMouseLeaveMediaCardsFn = () => {
  //
  }

  const onRailCardFocusFn = ( e, data, item ) =>{
    previousPath.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${data}`
    onRailFocus( e )
    catalogCardId.current = data + 1
  }

  const loadMore = () => {
    const data = +getPageNumberPagination()
    setPageNumberPagination( data + 1 )
    offsetValueRef.current = data * ( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? 20 : 36 )
    if( checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      searchLiveFetchData( railId, getFilterValue(), offsetValueRef.current );
    }
    else if( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ){
      searchChannelFetchData( railId, offsetValueRef.current );
    }
    else {
      searchFetchData( { pageNumber: data + 1 } )
    }
  }

  const renderCardImages = ( item ) => {
    if( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ){
      if( listType === LAYOUT_TYPE.PORTRAIT ){
        return `${ cloudinaryCarousalUrl( layoutType, url ) }/${ item.imagePortrait || item.image }`
      }
      else {
        return `${ cloudinaryCarousalUrl( layoutType, url ) }/${ item.imageLandscape || item.image }`
      }
    }
    else if( isLiveContentType( item?.contentType || sectionSource === SECTION_SOURCE.BINGE_CHANNEL ) ){
      return `${ cloudinaryCarousalUrl( layoutType, url ) }/${ item.newImageUrl || item.image }`
    }
    else {
      return `${ cloudinaryCarousalUrl( layoutType, url ) }/${ item.seriesimage || item.image }`
    }
  }

  const showLoader = () => {
    return Boolean( catalogPage.halfLoader )
  }

  const MouseWheelHandler = ( e ) => {
    const deltaY = e.deltaY; // Vertical distance scrolled by the mouse wheel
    let scrollMoment = ''
    if( deltaY > 0 ){
      scrollMoment = 'down'
    }
    else if( deltaY < 0 ){
      scrollMoment = 'up'
    }
    const el = document.querySelector( '.Catalog__mediaCard' )
    const el2 = document.querySelector( '.Catalog__scrollContainer' )
    const el3 = document.querySelector( '.Catalog__catalogHeader' )
    const el4 = document.querySelector( '.Catalog__LanguageBanner' )

    let mediaCardHeight = 0
    if( el ){
      mediaCardHeight = el.scrollTop
    }
    if( mediaCardHeight === 0 && scrollMoment === 'up' ){
      if( el2 ){
        el2.scrollTop = 0
      }
      if( el3 ){
        el3.style.display = 'flex'
      }
      if( el4 ){
        el4.style.display = 'flex'
      }
    }
    else if( scrollMoment === 'down' && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      if( el2 ){
        el2.scrollTop = 250
      }
      if( el3 ){
        el3.style.display = 'none'
      }
      if( el4 ){
        el4.style.display = 'none'
      }
    }
  }

  const getLoadMoreRecordsFn = ( defalutValue ) =>{
    if( checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      return liveCardsTotalrecords > contentLanguageGenre.length
    }
    else if( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ){
      return channelCardsTotalrecords > contentLanguageGenre.length
    }
    else {
      return defalutValue
    }
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <InfiniteScroll
        dataLength={ contentLanguageGenre.length }
        scrollableTarget='scrollContainerMedia'
        next={ loadMore }
        hasMore={ getLoadMoreRecordsFn( true ) }
        scrollThreshold={ 0.7 }
      >
        <div className={
          classNames( 'Catalog__cards Catalog--container', `Catalog__cards--${layoutType}`, {
            'Catalog__cards--LiveContainer': isSquareLayout( layoutType ),
            'Catalog__cards--notLiveContainer': isLandScapePortraitLayout( layoutType ),
            [`Catalog__ChannelContainer--${layoutType}`]: checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() )
          } ) }
        onMouseEnter={ onMouseEnterMediaCardsFn }
        onMouseLeave={ onMouseLeaveMediaCardsFn }
        ref={ ref }
        >
          { showLoader() ? (
            <div className='Catalog__cards--loader'>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className={
                  classNames( '', {
                    'Loader' : !checkListTypeExist( constants.LIVE.toLowerCase() ),
                    'Live-Loader': checkListTypeExist( constants.LIVE.toLowerCase() )
                  } )
                }
                >
                  <Image
                    src={ loaderPath }
                  />
                </div>
              </FocusContext.Provider>
            </div>
          ) :
            Array.isArray( contentLanguageGenre ) && contentLanguageGenre.length === 0 && !searchLoading ? (
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='Catalog__content--subheader'>
                  <Text
                    textAlign='center'
                    textStyle='header-1'
                    color='white'
                  >Sorry! We could not find any matching results.</Text>
                </div>
              </FocusContext.Provider>
            ) :
              contentLanguageGenre?.map( ( item, index ) => {
                return (
                  <div
                    className={
                      classNames( `Catalog__card Catalog__card--${layoutType}`, {
                        'Catalog__card--notLiveCard': isLandScapePortraitLayout( layoutType ),
                        'Catalog__card--liveCard': isSquareLayout( layoutType )
                      } ) }
                    key={ item.title + '_' + index }
                  >
                    <MediaCard
                      title={ item.title }
                      genre={ item.genre }
                      language={ item.language }
                      image={ renderCardImages( item ) }
                      type={ layoutType }
                      size={ 'small' }
                      contentID={ checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? item.contentId : item.id }
                      key={ index }
                      totalCatalogCardsLength={ contentLanguageGenre.length }
                      onFocus={ ( e )=>{
                        onRailCardFocusFn( e, checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? item.contentId : item.id, item )
                      } }
                      catalogResults={ contentLanguageGenre }
                      buttonResults={ languageGenre }
                      focusKeyRefrence={ checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? `BUTTON_FOCUS_${item.contentId}` : `BUTTON_FOCUS_${item.id}` }
                      contentLanguageGenreIndex={ index }
                      languageGenreFilterLenth={ languageGenre?.length }
                      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? item.contentId : item.id ) }
                      freeEpisodesAvailable={ item.freeEpisodesAvailable }
                      contractName={ item.contractName }
                      partnerSubscriptionType={ item.partnerSubscriptionType }
                      provider={ `${getProviderLogo( providerLogoList, item.provider, constants.LOGO_SQUARE, url )}` }
                      contentType={ item.contentType }
                      providerName={ item.provider }
                      railTitle={ checkListTypeExist( constants.LANGUAGE.toLowerCase() ) ? `${ title?.toUpperCase() }-PAGE` : `${ title?.toUpperCase() }-PAGE` }
                      selectedLanguage={ selectedLanguage }
                      selectedGenre={ selectedGenre }
                      isRecommendation={ item.isRecommendation }
                      placeHolder={ checkListTypeExist( constants.LANGUAGE.toLowerCase() ) ? constants.UC_BBL : constants.UC_BBG }
                      showProvider={ !checkListTypeExist( constants.LIVE.toLowerCase() ) }
                      liveContent={ item.liveContent }
                      broadcastMode={ item?.broadcastMode }
                      playerAction={ item?.playerAction }
                      providerContentId={ item.providerContentId }
                      railId={ railId }
                      catalogHeader={ catalogHeader }
                      cardSize={ cardSize }
                      layoutTypeForMixPanel={ layoutType }
                    />
                  </div>
                )
              } )
          }
        </div>
      </InfiniteScroll>
    </FocusContext.Provider>
  )
} )

const LanguageListComponent = forwardRef( ( { languageGenre, catalogHeader, imageUrl, bgImg, selectedLanguage, selectedGenre, listItemClicked, isLangRailActive, setIsLangRailActive, previousPathName, contentLanguageGenreLength, checkListTypeExist }, _ref )=> {
  const { catalogPage } = useMaintainPageState() || null
  const [showBannerComp, setShowBannerComp] = useState( catalogPage.current === null )

  const countRef = useRef( 0 )
  const buttonRef = useRef( null );

  const { catalogFlag } = useHomeContext()
  const { ref, focusKey } = useFocusable()
  const { url } = useAppContext();
  const previousPath = previousPathName

  const onCardFocus = useCallback( ( { x, ...rest }, index ) => {
    previousPath.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${index}`
    catalogPage.selectedGenre = null
    catalogPage.selectedLanguage = null
    setShowBannerComp( true )
    const el1 = document.querySelector( '.Catalog__scrollContainer' )
    const el2 = document.querySelector( '.Catalog__catalogHeader' )
    const el3 = document.querySelector( '.Catalog__LanguageBanner' )
    if( !isLangRailActive ){
      setIsLangRailActive( true )
    }
    if( el1 && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      el1.scrollTop = 0
    }
    if( el2 ){
      el2.style.display = 'flex'
    }
    if( el3 ){
      el3.style.display = 'flex'
    }
    if( buttonRef.current ){
      buttonRef.current.scrollLeft = rest.left - buttonRef.current.clientWidth + 281
    }
  }, [buttonRef] );

  const onMouseEnterCallBackFn = ()=>{
    countRef.current++
    setShowBannerComp( true )
    const el = document.querySelector( '.Catalog__scrollContainer' )
    if( el ){
      el.style.overflow = 'hidden'
    }
  }

  const onMouseEnterCallBackFn1 = ( e ) => {
    const el = document.querySelector( '.Catalog__scrollContainer' )
    if( el ){
      el.style.overflow = 'hidden'
    }
  }

  const getBgImg = ( bgImg ) => {
    let imageUrl = bgImg;
    if( url && url.includes( 'cloudinary' ) ){
      imageUrl = `${url}c_scale,f_auto,q_auto/` + bgImg;
    }
    else if( url && url.includes( 'mediaready' ) ){
      imageUrl = `${url}f_auto,q_auto/` + bgImg;
    }
    return imageUrl;
  }

  useEffect( () => {
    const selectedOfGenreCard = languageGenre?.findIndex( item => item === selectedGenre?.[0] )
    const selectedOfLanguageCard = languageGenre?.findIndex( item => item === selectedLanguage?.[0] )
    if( !catalogFlag && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      if( selectedOfGenreCard !== -1 && +getPageNumberPagination() === 1 ){
        catalogPage.selectedGenre === null && (
          setFocus( `BUTTON_PRIMARY_${selectedOfGenreCard}` ),
          previousPath.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${selectedOfGenreCard}`
        )
      }
      else if( selectedOfLanguageCard !== -1 && +getPageNumberPagination() === 1 ){
        catalogPage.selectedLanguage === null && (
          setFocus( `BUTTON_PRIMARY_${selectedOfLanguageCard}` ),
          previousPath.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${selectedOfLanguageCard}`
        )
      }
    }
  }, [listItemClicked] );


  useEffect( ()=>{
    if( !showBannerComp ){
      countRef.current++
    }
  }, [showBannerComp] )

  return (
    <>
      <FocusContext.Provider value={ focusKey }>
        { checkListTypeExist( constants.GENRE.toLowerCase() ) && (
          <div onMouseEnter={ onMouseEnterCallBackFn1 }
            className={ `${showBannerComp ? countRef.current >= 1 ? 'Catalog__catalogHeader' : 'Catalog__catalogHeaderInit' : 'Catalog__headerInVisible'} ` }
          >
            <div className='Catalog__catalogHeaderImage'>
              <Image
                alt={ catalogPage?.imageLink }
                src={ catalogPage?.imageLink }
              />
            </div>
            <div className='Catalog__catalogHeaderText'>
              <Text
                textStyle='header-1'
                color='white'
              >
                { catalogHeader }
              </Text>
            </div>
          </div>
        ) }
        { checkListTypeExist( constants.LANGUAGE.toLowerCase() ) && (
          <div className='Catalog__LanguageBanner'
            onMouseEnter={ onMouseEnterCallBackFn1 }
          >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              { showBannerComp && (
                <BannerComponent
                  alt='BingeIcon'
                  bgImg={ imageUrl ? imageUrl : getBgImg( bgImg?.poster_image ) }
                  // onFocus={ onRailFocus }
                  footerImage={ !imageUrl ? getBgImg( bgImg?.footer_image ) : '' }
                  imageUrl={ imageUrl && !bgImg?.poster_image }
                  imageGradient
                  notIntersect={ true }
                />
              ) }

            </FocusContext.Provider>
          </div>
        ) }
        <div
          className='Catalog__wrapper'
          ref={ ref }
        >
          <div className='Catalog__buttons'
            ref={ buttonRef }
            onMouseEnter={ onMouseEnterCallBackFn }
          >
            { languageGenre && languageGenre.map( ( languageGenreItem, index ) => {

              const pseudoElementStyles = {
                fontWeight: '600',
                position: 'absolute',
                right: '1.5rem',
                color: 'transparent'
              };

              const pseudoElementStylesForGenre = {
                ...pseudoElementStyles,
                right: '2rem'
              };

              return (
                <Button
                  key={ languageGenreItem + '_' + index }
                  label={ languageGenreItem }
                  secondary
                  size='medium'
                  onFocus={ ( e )=>onCardFocus( e, index ) }
                  focusKeyRefrence={ `BUTTON_PRIMARY_${index}` }
                  onClick={ ( e ) => {
                    countRef.current = 0
                    listItemClicked( e, languageGenreItem )
                  } }
                  catalogLoader={ catalogPage.halfLoader }
                  className={ classNames( `Catalog__buttons--${languageGenreItem}`, {
                    'Catalog__buttons--active': selectedLanguage?.includes( languageGenreItem.toLowerCase() ) || selectedGenre?.includes( languageGenreItem.toLowerCase() ),
                    'Catalog__buttons--genreActive': checkListTypeExist( constants.GENRE.toLowerCase() ) && ( selectedLanguage?.includes( languageGenreItem.toLowerCase() ) || selectedGenre?.includes( languageGenreItem.toLowerCase() ) )
                  } ) }
                  setShowBannerComp={ contentLanguageGenreLength > 0 && setShowBannerComp }
                  catlalogcarsLength={ contentLanguageGenreLength }
                  styledCatalogSpan={ checkListTypeExist( constants.GENRE.toLowerCase() ) && ( selectedLanguage?.includes( languageGenreItem.toLowerCase() ) || selectedGenre?.includes( languageGenreItem.toLowerCase() ) ) ? pseudoElementStylesForGenre : pseudoElementStyles }
                >
                </Button>
              )
            } ) }
          </div>
        </div>
      </FocusContext.Provider>
    </>
  )
} )

export const Catalog = function(){
  const { catalogPage, layoutType, setLayoutType, cardSize } = useMaintainPageState() || null
  const [onItemClicked, setOnItemClicked] = useState( false )
  const [selectedLanguage, setSelectedLanguage] = useState( catalogPage?.selectedLanguage === null ? [] : catalogPage.selectedLanguage );
  const [selectedGenre, setSelectedGenre] = useState( catalogPage?.selectedGenre === null ? [] : catalogPage.selectedGenre );
  const [languageGenre, setLanguageGenre] = useState( [] );
  const [liveCardsTotalrecords, setLiveCardsTotalrecords] = useState( 0 )
  const [contentLanguageGenre, setContentLanguageGenre] = useState( [] );
  const [bgImg, setBgImg] = useState( );
  const [isLangRailActive, setIsLangRailActive] = useState( false )
  const [errorMsg, setErrorMsg] = useState( '' )
  const [channelCardsTotalrecords, setChannelCardsTotalrecords] = useState( 0 )

  const mediaRef = useRef();
  const countRef = useRef( 0 )
  const clearTimeOutRef = useRef( null )

  const { catalogFlag } = useHomeContext()
  const { filterRail } = useContentFilter( );
  const { search : listType } = useLocation();

  const history = useHistory()
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } );
  const previousPathName = useNavigationContext();

  const urlSearchParams = new URLSearchParams( window.location.search );
  const params = Object.fromEntries( urlSearchParams.entries() );
  const { title, imageUrl, railId } = params;

  const [languageGenreList, searchResult, languageRecommendation, genreRecommendation, contentForGenreRecommendation, contentForLanguageRecommendation, searchLiveFetchContent, searchChannelFetchContent] = CatalogService( { listType, title, selectedGenre, selectedLanguage } );
  const { languageGenreListFetchData, languageGenreListResponse, languageGenreListError, languageGenreListLoading } = languageGenreList;
  const { searchFetchData, searchResponse, searchError, searchLoading } = searchResult;
  const { recommendationLanguageFetchData, recommendationLanguageResponse, recommendationLanguageError, recommendationLanguageLoading } = languageRecommendation;
  const { recommendationGenreFetchData, recommendationGenreResponse, recommendationGenreError, recommendationGenreLoading } = genreRecommendation;
  const { recommendationContentGenreFetchData, recommendationContentGenreResponse, recommendationContentGenreError, recommendationContentGenreLoading } = contentForGenreRecommendation;
  const { recommendationContentLanguageFetchData, recommendationContentLanguageResponse, recommendationContentLanguageError, recommendationContentLanguageLoading } = contentForLanguageRecommendation;
  const { searchLiveFetchData, searchLiveResponse, searchLiveError, searchLiveLoading } = searchLiveFetchContent
  const { searchChannelFetchData, searchChannelResponse, searchChannelError, searchChannelLoading } = searchChannelFetchContent

  const languages = get( config, 'languages' );

  const checkListTypeExist = ( _type ) => {
    return listType?.toLowerCase()?.includes( _type );
  }

  const getFilterValue = () => {
    return selectedLanguage === constants.LIVE_CHANNELS_ALL ? '' : searchLiveResponse?.data?.genreFilter?.filter( z => z.title?.toLowerCase() === selectedLanguage?.[0] )?.[0]?.title || convertStringToCamelCase( selectedLanguage[0] )
  }

  const listItemClicked = useCallback( ( e, languageGenreItem ) => {
    catalogPage.totalCards = []
    setPageNumberPagination( 1 )
    if( languageGenreItem?.toLowerCase() === constants.LIVE_CHANNELS_ALL ){
      catalogPage.halfLoader = false
    }
    else {
      catalogPage.halfLoader = true
    }
    setOnItemClicked( true )
    countRef.current ++
    if( checkListTypeExist( constants.LANGUAGE.toLowerCase() ) ){
      const temp = []
      if( selectedGenre.indexOf( languageGenreItem ) === -1 ){
        temp.push( languageGenreItem?.toLowerCase() )
        setSelectedGenre( temp )
      }
      else {
        setFocus( `BUTTON_PRIMARY_${languageGenre.indexOf( languageGenreItem )}` )
        previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${languageGenre.indexOf( languageGenreItem )}`
        setSelectedGenre( [] )
      }
    }
    else if( checkListTypeExist( constants.GENRE.toLowerCase() ) || checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      const temp = []
      if( selectedLanguage.indexOf( languageGenreItem ) === -1 ){
        temp.push( languageGenreItem )
        setSelectedLanguage( temp )
      }
      else {
        setFocus( `BUTTON_PRIMARY_${languageGenre.indexOf( languageGenreItem )}` )
        previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${languageGenre.indexOf( languageGenreItem )}`
        checkListTypeExist( constants.LIVE.toLowerCase() ) ? setSelectedLanguage( constants.LIVE_CHANNELS_ALL ) : setSelectedLanguage( [] )
      }
    }
  }, [] )

  const onCardRailFocus = useCallback( ( { y, ...rest } ) => {
    if( rest.node.className === 'MediaCard MediaCard--withFocus' ){
      if( ref.current && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
        ref.current.scrollTop = getScrollInputs( 250, 170 )
      }

    }
    if( mediaRef.current ){
      mediaRef.current.scrollTop = rest.top - 390
    }
  }, [mediaRef] );

  const showLoader = () => {
    return catalogPage.fullLoader
  }

  const getCatalogLoaderFn = () => {
    if( checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      return searchLiveLoading
    }
    else if( checkListTypeExist( constants.CATALOG_CHANNEL.toLowerCase() ) ){
      return searchChannelLoading
    }
    else {
      return searchLoading
    }
  }

  useEffect( ()=>{
    if( searchResponse !== undefined && !catalogFlag && !modalDom() ){
      setTimeout( ()=>{
        catalogPage.current === null ? +getPageNumberPagination() === 1 ? focusSelf() : null : setFocus( catalogPage.current )
        catalogPage.current = null
        catalogPage.selectedLanguage = null
        catalogPage.selectedGenre = null
        catalogPage.totalCards = []
        catalogPage.totalButtons = []
        catalogPage.liveHeader = ''
      }, 100 )
      let el2 = document.querySelector( '.Catalog__catalogHeader' )
      if( el2 ){
        el2.style.display = 'none'
      }
    }
    if( searchResponse === undefined && !catalogFlag ){
      clearTimeout( clearTimeOutRef.current );
      clearTimeOutRef.current = setTimeout( ()=>{
        catalogPage.current === null ? ( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ? focusSelf() : setFocus( 'BUTTON_PRIMARY_0' ) ) : setFocus( catalogPage.current )
        catalogPage.current = null
        catalogPage.selectedLanguage = null
        catalogPage.selectedGenre = null
        catalogPage.totalCards = []
        catalogPage.totalButtons = []
      }, 100 )
      const el = document.querySelector( '.Catalog__scrollContainer' )
      if( el && !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
        el.scrollTop = 250
      }
      const el2 = document.querySelector( '.Catalog__catalogHeader' )
      if( el2 ){
        el2.style.display = 'none'
      }
    }

    return ()=>{
      clearTimeout( clearTimeOutRef.current )
    }
  }, [catalogFlag, searchResponse, searchChannelResponse] )

  useEffect( () => {
    languages && Object.keys( languages ).length > 0 && Object.keys( languages ).find( key =>{
      if( key === title ){
        setBgImg( languages[key] );
      }
    } )
    previousPathName.current = window.location.pathname;
  }, [] )

  useEffect( () => {
    if( catalogPage && catalogPage.current === null ){
      if( checkListTypeExist( constants.GENRE.toLowerCase() ) ){
        recommendationLanguageFetchData();
      }
      else if( checkListTypeExist( constants.LANGUAGE.toLowerCase() ) ){
        recommendationGenreFetchData();
      }
      else if( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ){
        searchChannelFetchData( railId )
      }
      else if( checkListTypeExist( constants.LIVE.toLowerCase() ) ){
        searchLiveFetchData( railId )
        setSelectedLanguage( constants.LIVE_CHANNELS_ALL )
      }
    }
  }, [] );

  useEffect( () => {
    if( recommendationLanguageResponse || recommendationGenreResponse || recommendationLanguageError || recommendationGenreError ){
      !onItemClicked && languageGenreListFetchData();
    }
  }, [recommendationLanguageResponse, recommendationGenreResponse, recommendationGenreError, recommendationLanguageError] )

  useEffect( () => {
    let languageGenreListArray = [];
    if( languageGenreListResponse ){
      setErrorMsg( '' )
      if( languageGenreListResponse?.data?.contentList?.length > 0 ){
        languageGenreListArray = [...languageGenre];
      }
      languageGenreListResponse?.data?.contentList?.forEach( ( languageGenre ) => {
        languageGenreListArray.push( languageGenre?.title?.toLowerCase() )
      } );
      let languageGenreListArrayLowercase = languageGenreListArray.map( ( langGenre ) => {
        return langGenre.toLowerCase()
      } )

      if( checkListTypeExist( constants.GENRE.toLowerCase() ) ){
        const laungRec = recommendationLanguageResponse?.data?.contentList !== undefined ? recommendationLanguageResponse?.data?.contentList : []
        const toLowerCaseArry = laungRec.map( ( item ) => item.toLowerCase() )
        languageGenreListArrayLowercase = [...toLowerCaseArry, ...new Set( languageGenreListArrayLowercase )];
      }
      else {
        const genreRec = recommendationGenreResponse?.data?.contentList !== undefined ? recommendationGenreResponse?.data?.contentList : []
        const toLowerCaseArry = genreRec.map( ( item ) => item.toLowerCase() )
        languageGenreListArrayLowercase = [...toLowerCaseArry, ...new Set( languageGenreListArrayLowercase )];
      }
      languageGenreListArrayLowercase = [...new Set( languageGenreListArrayLowercase )];
      setLanguageGenre( languageGenreListArrayLowercase );
      catalogPage.fullLoader = true
      searchFetchData( { pageNumber: +getPageNumberPagination() } );
    }
    if( ( languageGenreListResponse?.data && !languageGenreListResponse?.data?.contentList?.length ) ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
    }
  }, [languageGenreListResponse] );

  useEffect( ()=> {
    if( catalogPage && catalogPage.totalCards && catalogPage.totalCards.length > 0 ){
      setContentLanguageGenre( catalogPage.totalCards )
      setLanguageGenre( catalogPage.totalButtons )
    }
  }, [catalogPage] )

  useEffect( () => {
    if( recommendationContentGenreResponse ){
      const data = recommendationContentGenreResponse?.data?.contentList.map( v => ( { ...v, isRecommendation: true } ) )
      setContentLanguageGenre( data || [] );
    }

    if( recommendationContentLanguageResponse ){
      const data = recommendationContentLanguageResponse?.data?.contentList.map( v => ( { ...v, isRecommendation: true } ) )
      setContentLanguageGenre( data || [] );
    }

    onItemClicked && (
      searchFetchData( { pageNumber: +getPageNumberPagination() } )
    );

  }, [recommendationContentGenreResponse, recommendationContentLanguageResponse, recommendationContentLanguageError, recommendationContentGenreError] );

  useEffect( () => {
    let contentLanguageGenreResult = []
    if( searchResponse && +getPageNumberPagination() === 1 ){
      catalogPage.fullLoader = false
      setErrorMsg( '' )
      if( contentLanguageGenre?.length > 0 ){
        contentLanguageGenreResult = [...contentLanguageGenre];
      }

      searchResponse?.data?.contentList?.forEach( ( railList ) => {
        contentLanguageGenreResult.push( railList )
      } );

      contentLanguageGenreResult = [...new Set( contentLanguageGenreResult )];
      setContentLanguageGenre( contentLanguageGenreResult );
      catalogPage.halfLoader = false
    }

    if( searchResponse && +getPageNumberPagination() > 1 ){
      setContentLanguageGenre( [...contentLanguageGenre, ...searchResponse?.data?.contentList] );
      catalogPage.halfLoader = false
    }

    if( ( searchResponse?.data && !searchResponse?.data?.contentList?.length ) ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      catalogPage.halfLoader = false
    }
  }, [searchResponse] );

  useEffect( ()=>{
    if( searchLiveResponse && searchLiveResponse.data && searchLiveResponse.data.contentList?.length > 0 ){
      setLayoutType( searchLiveResponse.data.layoutType )
      const contentList = searchLiveResponse.data.contentList
      const filerLiveGenreList = searchLiveResponse.data.genreFilter
      catalogPage.liveHeader = searchLiveResponse.data.title
      if( +getPageNumberPagination() === 1 ){
        setContentLanguageGenre( [...contentList] );
        catalogPage.halfLoader = false
        setErrorMsg( '' )
      }
      else if( +getPageNumberPagination() > 1 ){
        setContentLanguageGenre( [...contentLanguageGenre, ...contentList] );
        catalogPage.halfLoader = false
      }
      const toLowerCaseLiveArray = filerLiveGenreList?.map( ( item ) => item.title?.toLowerCase() )
      catalogPage.fullLoader = false
      catalogPage.halfLoader = false
      setLanguageGenre( toLowerCaseLiveArray )
      setLiveCardsTotalrecords( searchLiveResponse.data?.totalCount )
    }
    else if( searchLiveResponse && searchLiveResponse.data?.contentList?.length ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      catalogPage.halfLoader = false
    }
    else if( searchChannelResponse && searchChannelResponse.data && searchChannelResponse.data.contentList?.length > 0 ){
      const contentList = searchChannelResponse.data.contentList
      catalogPage.liveHeader = searchChannelResponse.data.title
      if( +getPageNumberPagination() === 1 ){
        setContentLanguageGenre( [...contentList] );
        catalogPage.halfLoader = false
        setErrorMsg( '' )
      }
      else if( +getPageNumberPagination() > 1 ){
        setContentLanguageGenre( [...contentLanguageGenre, ...contentList] );
        catalogPage.halfLoader = false
      }
      catalogPage.fullLoader = false
      catalogPage.halfLoader = false
      setChannelCardsTotalrecords( searchChannelResponse.data?.totalCount )
    }
    else if( searchChannelResponse && searchChannelResponse.data?.contentList?.length === 0 ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      catalogPage.halfLoader = false
    }
    else if( searchChannelResponse && searchChannelResponse.data === null ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      catalogPage.fullLoader = false
      catalogPage.halfLoader = false
    }
  }, [searchLiveResponse, searchChannelResponse] )

  useEffect( ()=>{
    if( searchResponse !== undefined && !catalogFlag ){
      if( catalogPage.current !== null ){
        // setFocus( catalogPage.current )
        let el =  document.querySelector( '.Catalog__scrollContainer' )
        if( el ){
          el.scrollTop = 250
        }
      }
      else {
        countRef.current === 0 && +getPageNumberPagination() === 1 && (
          languageGenre.length > 0 ? (
            setTimeout( () => {
              setFocus( 'BUTTON_PRIMARY_0' )
              previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PRIMARY_0'
            }, 10 )
          ) : ( setFocus( 'BUTTON_FOCUS_0' ),
          previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_FOCUS_0'
          )
        )
      }
    }
  }, [contentLanguageGenre] )

  useEffect( () => {
    if( checkListTypeExist( constants.LANGUAGE.toLowerCase() ) ){
      catalogPage && catalogPage.current ? null : recommendationContentLanguageFetchData();
    }

    if( checkListTypeExist( constants.GENRE.toLowerCase() ) ){
      catalogPage && catalogPage.current ? null : recommendationContentGenreFetchData();
    }
    if( onItemClicked ){
      if( checkListTypeExist( constants.LIVE.toLowerCase() ) ){
        searchLiveFetchData( railId, getFilterValue(), 0 );
      }
    }
  }, [selectedGenre, selectedLanguage] );

  useEffect( () => {
    if( checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ){
      const ChannelLayoutType = listType?.toLowerCase()?.includes( LAYOUT_TYPE.LANDSCAPE.toLowerCase() ) ? LAYOUT_TYPE.LANDSCAPE : LAYOUT_TYPE.PORTRAIT
      setLayoutType( ChannelLayoutType )
    }
    else if( !checkListTypeExist( constants.LIVE.toLowerCase() ) ){
      setLayoutType( LAYOUT_TYPE.LANDSCAPE )
    }
  }, [listType] )

  return (
    <div>
      { showLoader() ? <Loader /> : (
        <>
          <div className={ !catalogFlag ? 'showChild Catalog' : 'hideChild Catalog' }>
            { checkListTypeExist( constants.GENRE.toLowerCase() ) && (
              <div className='Catalog__genreBanner'>
                <div className={ 'Catalog__header' }>
                  <Button
                    onClick={ ()=> history.goBack() }
                    iconLeftImage='GoBack'
                    iconLeft={ true }
                    label={ constants.GOBACK }
                  />
                  <Icon name={ constants.BINGE_LOGO } />
                </div>
                <FocusContext.Provider focusable={ false }
                  value=''
                >
                  { (
                    <BannerComponent
                      alt='BingeIcon'
                      bgImg={ imageUrl ? imageUrl : bgImg?.poster_image }
                      imageUrl={ imageUrl && !bgImg?.poster_image }
                      imageGradient
                    />
                  ) }

                </FocusContext.Provider>
              </div>
            ) }

            { checkListTypeExist( constants.LANGUAGE.toLowerCase() ) && (
              <div className={ 'Catalog__LanguageHeader' }>
                <Button
                  onClick={ ()=> history.goBack() }
                  iconLeftImage='GoBack'
                  iconLeft={ true }
                  label={ constants.GOBACK }
                />
                <Icon name={ constants.BINGE_LOGO } />
              </div>
            ) }

            { checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) && (
              <div className={ 'Catalog__LanguageHeader' }>
                <Button
                  onClick={ ()=> history.goBack() }
                  iconLeftImage='GoBack'
                  iconLeft={ true }
                  label={ constants.GOBACK }
                />
                <Icon name={ constants.BINGE_LOGO } />
              </div>
            ) }

            { checkListTypeExist( constants.LIVE.toLowerCase() ) && (
              <div className={ 'Catalog__LiveHeader' }>
                <div className='Catalog__LiveHeaderText'>
                  <Text
                    textStyle='header-1'
                    color='white'
                  >
                    { searchLiveResponse?.data?.title || catalogPage?.liveHeader }
                  </Text>
                </div>
                <Icon name={ constants.BINGE_LOGO } />
              </div>
            ) }

            <FocusContext.Provider value={ focusKey }>
              <div
                id='scrollContainer'
                className={ ` ${!( checkListTypeExist( 'live' ) || checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) ) && 'Catalog__scrollContainer' }` }
                ref={ ref }
              >
                <div className={ classNames( 'Catalog__content', {
                  'Catalog__content--footerImage': bgImg?.footer_image,
                  'Catalog__content--liveChannelContent': checkListTypeExist( constants.LIVE.toLowerCase() ),
                  'Catalog__content--ChannelContent': checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() )
                } ) }
                >
                  { checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) && (
                    <Text
                      textStyle='header-1'
                      color='white'
                    >
                      { title }
                    </Text>
                  ) }
                  { checkListTypeExist( constants.LANGUAGE.toLowerCase() ) && (
                    <Text
                      textStyle='header-1'
                      color='white'
                    >
                      { title }
                    </Text>
                  ) }
                  { !checkListTypeExist( constants.CATALOG_CHANNEL.toLocaleLowerCase() ) && (
                    <div className={ classNames( { 'Catalog__content--header' : !checkListTypeExist( constants.LIVE.toLowerCase() ) } ) }>
                      <FocusContext.Provider value={ focusKey }>
                        <LanguageListComponent
                          languageGenre={ languageGenre }
                          selectedLanguage={ selectedLanguage }
                          selectedGenre={ selectedGenre }
                          listItemClicked={ listItemClicked }
                          ref={ ref }
                          isLangRailActive={ isLangRailActive }
                          setIsLangRailActive={ setIsLangRailActive }
                          imageUrl={ imageUrl }
                          bgImg={ bgImg }
                          catalogHeader={ title }
                          previousPathName={ previousPathName }
                          contentLanguageGenreLength={ contentLanguageGenre ? contentLanguageGenre.length : 0 }
                          checkListTypeExist={ checkListTypeExist }
                          getFilterValue={ getFilterValue }
                        />
                      </FocusContext.Provider>
                    </div>
                  ) }
                  <FocusContext.Provider value={ focusKey }>
                    <div
                      ref={ mediaRef }
                      id='scrollContainerMedia'
                      className={
                        classNames( 'Catalog__mediaCard', `Catalog__mediaCard--${layoutType}`, {
                          'Catalog__mediaCard--liveMediaCard': isSquareLayout( layoutType )
                        } )
                      }
                    >
                      <ContentLanguageGenreComponent
                        contentLanguageGenre={ !checkListTypeExist( constants.CATALOG_CHANNEL.toLowerCase() ) ? filterRail( contentLanguageGenre ) : contentLanguageGenre }
                        languageGenre={ languageGenre }
                        selectedLanguage={ selectedLanguage }
                        selectedGenre={ selectedGenre }
                        cloudinaryCarousalUrl={ cloudinaryCarousalUrl }
                        onRailFocus={ onCardRailFocus }
                        url={ url }
                        ref={ ref }
                        config={ config }
                        searchLoading={ getCatalogLoaderFn() }
                        previousPathName={ previousPathName }
                        listType={ listType }
                        searchFetchData={ searchFetchData }
                        searchLiveFetchData={ searchLiveFetchData }
                        liveCardsTotalrecords={ liveCardsTotalrecords }
                        railId={ railId }
                        checkListTypeExist={ checkListTypeExist }
                        getFilterValue={ getFilterValue }
                        title={ title }
                        layoutType={ layoutType }
                        sectionSource={ searchLiveResponse?.data?.sectionSource }
                        searchChannelFetchData={ searchChannelFetchData }
                        channelCardsTotalrecords={ channelCardsTotalrecords }
                        catalogHeader={ title }
                        cardSize={ cardSize }
                      />
                    </div>
                  </FocusContext.Provider>
                </div>
              </div>
            </FocusContext.Provider>
          </div>
          { catalogFlag &&
          <div className={ catalogFlag ? 'showChild' : 'hideChild' }>
            <PlaybackInfo />
          </div>
          }
        </>
      ) }
    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   */

export const propTypes = {

};

Catalog.propTypes = propTypes;

export default Catalog;