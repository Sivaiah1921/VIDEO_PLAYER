/* eslint-disable no-console */
/**
 * This is the right side container of the Search Page
 *
 * @module views/components/SearchRightContainer
 * @memberof -Common
 */
import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import LanguageListRail from '../LanguageListRail/LanguageListRail';
import { cloudinaryCarousalUrl, getProviderLogo, getScrollInputs } from '../../../utils/util';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import MediaCard from '../MediaCard/MediaCard';
import Text from '../Text/Text';
import constants, { LAYOUT_TYPE, PROVIDER_LIST_NEW_HEIGHT, PROVIDER_LIST_MORE_HEIGHT, MIXPANEL_CONTENT_TYPE } from '../../../utils/constants';
import classNames from 'classnames';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import Button from '../Button/Button';
import mixpanelConfig from '../../../utils/mixpanelConfig';
import Image from '../Image/Image';
const { SEARCH_PAGE } = require( '../../../utils/constants' ).default;
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import './SearchRightContainer.scss';

/**
 * Represents a SearchRightContainer component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SearchRightContainer
 */

export const railsDataposition = [] // Why is this needed

let countgb = 0
const railsDatapositionMediaCard = [] // Why is this needed

const ClearListComponent = ( { clearTextFetchData, isFocused, onFocus } )=>{
  const { ref, focusKey } = useFocusable( )
  const previousPathName = useNavigationContext()
  const clearClicked = () => {
    clearTextFetchData()
  }
  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='LanguageListRail__clearSearch'
        ref={ ref }
      >
        { !isFocused &&
        <div className='LanguageListRail__title'>
          <Text>
            { 'Recent Searches' }
          </Text>
        </div>
        }
        { !isFocused &&
        <div className='LanguageListRail__recentSearch'>
          <Button
            label={ 'Clear All' }
            secondary
            size='medium'
            onClick={ ( e ) => clearClicked() }
            onFocus={ ()=>{
              previousPathName.previousMediaCardFocusBeforeSplash = 'CLEAR_BUTTON'
            } }
            focusKeyRefrence={ 'CLEAR_BUTTON' }
          >
          </Button>
        </div>

        }
      </div>
    </FocusContext.Provider>
  )
}
let timeOut = null;
export const SearchRightContainer = ( props ) => {
  const { hideRails,
    fetchTextResponse,
    showKeyboard,
    isFocused,
    languageRail,
    genreRail,
    showFilter,
    isTrending,
    noSearchRes,
    selectedSuggestion,
    searchResults,
    railTitle,
    recentSearchSelected,
    languageListResponse,
    genreListResponse,
    isFilter,
    clearTextFetchData,
    hasMore,
    loadMore,
    selectedGen,
    selectedLang,
    loader,
    fullPageLoader,
    pageNumber,
    inputValue,
    searchAutoCompleteRes,
    showKeyboardIcon,
    noResultVerbiage,
    searchCount,
    contLength,
    setContLength,
    mixPanelRailTitle
  } = props;

  const [filterSearchdata, setFilterSearchdata] = useState( [] )
  const [indexOfCard, setIndexOfCard] = useState( 0 )

  const mouseEntryRef = useRef( false )
  const refMedia = useRef()

  const { configResponse, url } = useAppContext();
  const previousPathName = useNavigationContext()
  const { filterRail } = useContentFilter( );
  const responseSubscription = useSubscriptionContext( );
  const { searchCardId } = useMaintainPageState() || null
  const { ref, focusKey } = useFocusable( {
    autoRestoreFocus: false,
    saveLastFocusedChild: true
  } );

  const loaderPath = `${window.assetBasePath}loader.gif`;
  const { config } = configResponse;
  const providerLogoList = get( config, 'providerLogo' );
  const myPlanProps = responseSubscription?.responseData.currentPack

  const getFilteredList = () => {
    const filteredSearchResults = filterRail( searchResults )
    setFilterSearchdata( filteredSearchResults, null, constants.SEARCH_PAGES );
  }

  const onRailFocusMediaCard = useCallback( ( { y, ...rest }, index, item ) => {
    setContLength( index );
    searchCardId.focusCardIndex = index
    clearTimeout( timeOut );
    timeOut = setTimeout( () => {
      previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${item.id}${index}`
      setIndexOfCard( index );
    }, 350 );

    railsDatapositionMediaCard.push( rest.top );
    searchCardId.current = index + 1
    countgb = countgb + 1
    if( countgb <= 1 && ref.current ){
      if( railTitle === SEARCH_PAGE.TRENDING ){
        ref.current.scrollTop = rest.top - getScrollInputs( 340, 210 )
      }
      if( railTitle === constants.FILLED_INPUT_WITH_NO_DATA ){
        ref.current.scrollTop = rest.top - 390
      }
    }

    if( refMedia.current ){
      if( isFilter ){
        const totalHeight = refMedia?.current?.clientHeight
        const requireHgt =  rest.top - totalHeight
        refMedia.current.scrollTop = requireHgt + 250
      }
      else if( noSearchRes ){
        refMedia.current.scrollTop = rest.top - 450
      }
      else {
        let scrollPosition = 0;
        const minPosition = Math.min( ...railsDatapositionMediaCard );
        if( railTitle === SEARCH_PAGE.TRENDING || railTitle === constants.FILLED_INPUT_WITH_NO_DATA ){
          if( document.querySelector( '.Search__noGenreRail' ) !== null || document.querySelector( '.Search__languageRail' ) === null ){
            scrollPosition = rest.top - 840
          }
          else if( document.querySelector( '.Search__languageRail' ) !== null || document.querySelector( '.Search__genreRail' ) !== null ){
            scrollPosition = rest.top - 1150
          }
          else {
            scrollPosition = rest.top - ( minPosition + 200 )
          }
        }
        else {
          scrollPosition = rest.top - ( minPosition + 520 )
        }
        refMedia.current.scrollTop = scrollPosition + getScrollInputs( 50, 380 )
      }
    }
  }, [refMedia, noSearchRes, isFilter, railTitle] );

  const onRailFocus = useCallback( ( { y, ...rest } ) => {
    railsDataposition.push( rest.top )
    const minPosition = Math.min( ...railsDataposition );
    countgb = 0
    if( !mouseEntryRef.current ){
      if( rest.node.className === 'LanguageListRail' ){
        if( ref.current ){
          ref.current.scrollTop = 0
        }
      }
      else if( ref.current ){
        ref.current.scrollTop = rest.top === minPosition ? y : rest.top - getScrollInputs( 250, 180 )
      }
    }

  }, [ref, mouseEntryRef.current] );

  const onMouseEnterCallBackFn = ( id, index ) => {
    setFocus( `BUTTON_FOCUS_${id}${index}` )
  }

  const searchLA = () =>{
    previousPathName.isSearch = true
  }

  const onMouseEnterpageFn = () =>{
    mouseEntryRef.current = true
  }

  const onMouseLeavepageFn = () =>{
    mouseEntryRef.current = false
  }

  const renderSearchResult = useMemo( () => {
    const finalCount = Math.min( contLength + ( showKeyboard ? 15 : 25 ), filterSearchdata.length );
    const initialVal = Math.max( 0, contLength - ( showKeyboard ? 8 : 10 ) );
    return filterSearchdata.map( ( item, index ) => {
      const visibleIndex = !( index < initialVal || index >= finalCount ) || mouseEntryRef.current;
      return (
        visibleIndex ? (
          <MediaCard
            callBackFn={ searchLA }
            contentID={ item.id }
            title={ item.title }
            image={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.LANDSCAPE, url ) }/${ item.image }` }
            type={ 'portrait' }
            size={ 'small' }
            key={ index }
            provider={ getProviderLogo( providerLogoList, item.provider, constants.LOGO_SQUARE, url ) }
            onFocus={ ( e ) => onRailFocusMediaCard( e, index, item ) }
            searchText={ item.title }
            freeEpisodesAvailable={ item.freeEpisodesAvailable }
            contractName={ item.contractName }
            partnerSubscriptionType={ item.partnerSubscriptionType }
            nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
            isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
            status={ myPlanProps && myPlanProps.subscriptionStatus }
            providerName={ item.provider }
            focusKeyRefrence={ `BUTTON_FOCUS_${( item.id ) }${index}` }
            onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( item.id, index ) }
            totalRailLength={ searchResults.length }
            cardIndexValue={ indexOfCard }
            contentType={ item.contentType }
            source={ railTitle === SEARCH_PAGE.TRENDING ? SEARCH_PAGE.TRENDING : mixpanelConfig.VALUE.SEARCH }
            contentPosition={ index + 1 }
            genre={ item.genre }
            language={ item.language }
            rating={ item.rating }
            prevPath={ '/Search' }
            railTitle={ mixPanelRailTitle }
            pageNumber={ pageNumber }
            searchResults={ searchResults }
            inputValue={ inputValue }
            isFilterOpen={ isFilter }
            searchAutoCompleteRes={ searchAutoCompleteRes }
            searchMaxCount={ props.max_count }
            showFilter={ showFilter }
            selectedLang={ selectedLang }
            selectedGen={ selectedGen }
            showKeyboardIcon={ showKeyboardIcon }
            totalSearchResultsLength={ filterRail( searchResults, null, constants.SEARCH_PAGES ).length }
            placeHolder={ props.taUseCaseId }
            liveContent={ item.liveContent }
            searchCount={ searchCount }
            providerContentId={ item.providerContentId }
            playerAction={ item?.playerAction }
            broadcastMode={ item?.broadcastMode }
            sectionType={ MIXPANEL_CONTENT_TYPE.SEARCH }
          />
        ) : (
          <div
            key={ index }
            className='MediaCardWrapper emptyCell'
          >
            <div className='MediaCard'
              style={ { height: '6.4rem', background: '#33354d' } }
            >
            </div>
            <div className={ classNames(
              'MediaCard--provider', {
                'MediaCard--provider--image' : PROVIDER_LIST_NEW_HEIGHT.includes( item?.provider.toLowerCase() ),
                'MediaCard--provider--NewHeightimage' : PROVIDER_LIST_MORE_HEIGHT.includes( item?.provider.toLowerCase() )
              }
            ) }
            >
              <div className='emptyImageCell'></div>
            </div>
          </div>
        )
      )
    } )
  }, [contLength, filterSearchdata, mouseEntryRef.current] );

  useEffect( () => {
    if( filterSearchdata?.length ){
      const cnt = Math.max( Math.min( contLength, filterSearchdata.length ), 0 );
      setContLength( cnt );
    }
  }, [filterSearchdata] );

  useEffect( ()=>{
    getFilteredList()
  }, [searchResults] )

  useEffect( () => {
    if( refMedia?.current && ref?.current ){
      refMedia.current.scrollTop = 0;
      ref.current.scrollTop = 0;
    }
  }, [showKeyboard] );

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
      clearTimeout( timeOut );
    };
  }, [] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        className={
          classNames( 'SearchRightContainer', {
            'SearchRightContainer__filterContentShow': isFilter && showFilter,
            'SearchRightContainer__filterContentHidden': isFilter && !showFilter,
            'SearchRightContainer__noGenreFilterRail' : isFilter && !showFilter && genreRail && genreRail.length === 0
          } )
        }
      >
        { Boolean( searchResults.length === 0 && loader ) && (
          <div className={ classNames( 'SearchRightContainer__commonLoader', {
            [`SearchRightContainer__withLeftloader`]: isFocused && !hideRails,
            [`SearchRightContainer__loader`]: !isFocused,
            [`SearchRightContainer__bottom`]: !showFilter,
            [`SearchRightContainer__bottomTrending`]: isFocused && hideRails,
            [`SearchRightContainer__bottomFilter`]: isFilter
          } ) }
          >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='Loader'>
                <Image
                  src={ loaderPath }
                />
              </div>
            </FocusContext.Provider>
          </div>
        ) }
        <div
          ref={ ref }
          id='scrollContainer'
          className={ !isFilter && 'Search__scrollContainer' || isTrending && 'Search__scrollContainer' }
        >
          <div className='Search__containerRight'>
            { hideRails && !noSearchRes &&
              <>
                { fetchTextResponse?.data?.length > 0 && !isFocused &&
                <ClearListComponent
                  clearTextFetchData={ clearTextFetchData }
                  isFocused={ isFocused }
                  onFocus={ onRailFocus }
                />
                }
                { fetchTextResponse?.data?.length > 0 &&
                <LanguageListRail
                  fetchTextResponse={ fetchTextResponse }
                  recentSearchSelected={ recentSearchSelected }
                  showKeyboard={ showKeyboard }
                  isFocused={ isFocused }
                  onFocus={ onRailFocus }
                  clearTextFetchData={ clearTextFetchData }
                />
                }

                <div className={
                  classNames( 'Search__languageRail', {
                    'Search__noGenreRail': genreRail && genreRail.length === 0
                  } )
                }
                onMouseEnter={ onMouseEnterpageFn }
                onMouseLeave={ onMouseLeavepageFn }
                >
                  { languageRail && languageRail.length !== 0 &&
                  <MediaCarousel
                    nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
                    isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
                    status={ myPlanProps && myPlanProps.subscriptionStatus }
                    onFocus={ onRailFocus }
                    railData={ { contentList: languageRail,
                      title: languageListResponse?.data?.title,
                      layoutType: 'CIRCULAR',
                      sectionSource: 'LANGUAGE',
                      id: languageListResponse?.data?.id } }
                    source={ mixpanelConfig.VALUE.LANGUAGE }
                    contentRailType={ 'seachBBlRail' }
                  /> }
                </div>

                <div className='Search__genreRail'
                  onMouseEnter={ onMouseEnterpageFn }
                  onMouseLeave={ onMouseLeavepageFn }
                >
                  { genreRail && genreRail.length !== 0 &&
                  <MediaCarousel
                    nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
                    isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
                    status={ myPlanProps && myPlanProps.subscriptionStatus }
                    onFocus={ onRailFocus }
                    railData={ { contentList: genreRail,
                      title: genreListResponse?.data?.title,
                      layoutType: 'LANDSCAPE',
                      sectionSource: 'GENRE',
                      id: genreListResponse?.data?.id } }
                    source={ mixpanelConfig.VALUE.LANGUAGE }
                    contentRailType={ 'seachBBGRail' }
                  /> }
                </div>
              </> }
            { !fullPageLoader && (
              <div
                className={
                  classNames( 'Search__railTitle', {
                    'Search__railTileTrending': railTitle === SEARCH_PAGE.TRENDING
                  } )
                }
              >
                { !noSearchRes && ( selectedSuggestion || searchResults?.length > 0 || railTitle ) &&
                <Text
                  textStyle='title-3'
                  color='white'
                  htmlTag='div'
                >
                  { !isFilter && !loader && ( railTitle === constants.RESULTS ? `${searchCount } ${ railTitle }` : railTitle !== constants.FILLED_INPUT_WITH_NO_DATA && `${ railTitle }` ) }
                </Text>
                }
                { railTitle === constants.FILLED_INPUT_WITH_NO_DATA &&
                <>
                  <Text
                    textStyle='title-3'
                    color='white'
                    htmlTag='div'
                  >
                    { noResultVerbiage }
                  </Text>
                </>
                }
                {
                  searchResults.length > 0 && !loader &&
                  <FocusContext.Provider value={ focusKey }>
                    <div
                      ref={ refMedia }
                      id='scrollContainerMedia'
                      className={
                        classNames( 'Search__mediaCard', {
                          'Search__mediaCard--itemWrapped': isFilter,
                          'Search__mediaCard--itemWidth': isFocused,
                          'Search__mediaCard--itemWithNoRes': noSearchRes
                        } )
                      }
                      onMouseEnter={ onMouseEnterpageFn }
                      onMouseLeave={ onMouseLeavepageFn }
                    >
                      <InfiniteScroll
                        dataLength={ filterSearchdata.length }
                        scrollableTarget='scrollContainerMedia'
                        next={ loadMore }
                        hasMore={ hasMore }
                        scrollThreshold={ 0.4 }
                        style={ { display: 'flex',
                          flexWrap: 'wrap',
                          padding:' 1rem 0.625rem',
                          overflow: 'auto',
                          paddingBottom: '13rem',
                          width: 'fit-content'
                        } }
                      >
                        { renderSearchResult }
                      </InfiniteScroll>
                    </div>
                  </FocusContext.Provider>
                }
              </div>
            ) }

          </div>
        </div>
      </div>
    </FocusContext.Provider>
  )
};

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world'
};

SearchRightContainer.propTypes = propTypes;
SearchRightContainer.defaultProps = defaultProps;

export default SearchRightContainer;
