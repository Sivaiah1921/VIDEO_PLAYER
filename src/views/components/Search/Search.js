/* eslint-disable no-console */
/**
 * This is the Search page, rendered after clicking on search on the left nav
 *
 * @module views/components/Search
 * @memberof -Common
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Search.scss';
import AlphanumericKeyboard from '../AlphanumericKeyboard/AlphanumericKeyboard';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InputField from '../InputField/InputField';
import Icon from '../Icon/Icon';
import { ALPHANUMERICKEYBOARD, PAGE_NAME, constants } from '../../../utils/constants';
import classNames from 'classnames';
import SearchService from '../../../utils/slayer/SearchService';
import AutoCompleteSuggestions from '../AutoCompleteSuggestions/AutoCompleteSuggestions';
import SearchRightContainer from '../SearchRightContainer/SearchRightContainer';
import { getAuthToken, setPageNumberPagination } from '../../../utils/localStorageHelper';
import Notifications from '../Notifications/Notifications';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
const { RESULTS, SEARCH_PAGE } = require( '../../../utils/constants' ).default;
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { autoSuggestionClicked, autoSuggestionInitiate, home_clicks, search_event, search_home, search_no_result, search_results, searchSkiped } from '../../../utils/mixpanel/mixpanelService';
import { MIXPANEL_RAIL_TYPE, getMixpanelData, getScrollInputs, modalDom, searchNoDataFoundVerbiage, setMixpanelData } from '../../../utils/util';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import PlaybackInfo from '../PlaybackInfo/PlaybackInfo';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import SearchFilters from '../SearchFilters/SearchFilters';
import Text from '../Text/Text';

export const railsDataposition = [] // Why is this needed

/**
  * Represents a Search component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Search
  */
export const Search = function( props ){
  const { searchFlag, liveSearchFlag, numberPressed, setNumberPressed } = useHomeContext()
  const { filterRail } = useContentFilter( );
  const { searchTotalData, searchPageData, catalogPage, selectedGenreItem, selectedLaungueItem, searchCardId } = useMaintainPageState() || null

  const [showPopup, setShowPopup] = useState( false );
  const [inputValue, setValue] = useState( !!searchPageData.searchedInputValue === false ? '' : searchPageData.searchedInputValue );
  const [isDisable, setDisabled] = useState( false );
  const [isFocused, setIsFocused] = useState( false );
  const [recentsearch, setRecentsearch] = useState( false );
  const [showKeyboard, setShowKeyboard] = useState( false );
  const [languageRail, setLanguageRail] = useState( [] );
  const [genreRail, setGenreRail] = useState( [] );
  const [searchResults, setSearchResults] = useState( [] );
  const [showFilter, setShowFilter] = useState( true );
  const [isFilter, setIsFilter] = useState( false );
  const [languageButtons, setLanguageButtons] = useState( [] );
  const [genreButtons, setGenreButtons] = useState( [] );
  const [hideRails, setHideRails] = useState( true );
  const [selectedLang, setSelectedLang] = useState( '' );
  const [selectedGen, setSelectedGen] = useState( '' );
  const [selectedSuggestion, setSelectedSuggestion] = useState( '' );
  const [isTrending, setIsTrending] = useState( false );
  const [noSearchRes, setNoSearchRes] = useState( false );
  const [railTitle, setRailTitle] = useState( SEARCH_PAGE.TRENDING );
  const [mixPanelRailTitle, setMixPanelRailTitle] = useState( searchPageData.railTitle || SEARCH_PAGE.TRENDING );
  const [showKeyboardIcon, setShowKeyboardIcon] = useState( false );
  const [hasMore, setHasMore] = useState( true );
  const [pageNumber, setPageNumber] = useState( 1 );
  const [searchAutoCompleteRes, setSearchAutoCompleteRes] =  useState( [] )
  const [searchMaxCount, setSearchMaxCount] = useState( null )
  const [recentSearchClicked, setRecentSearchClicked] = useState( false );
  const [taUseCaseId, setTaUseCaseId] = useState( SEARCH_PAGE.TRENDING );
  const [longKeyPressed, setLongKeyPressed] = useState( false )
  const [searchCount, setSearchCount] = useState( null )
  const [contLength, setContLength] = useState( -1 );
  const [autocompleteres, setAutoCompleteRes] = useState( false );
  const [autoSuggestClick, setAutoSuggestClick] = useState( false );

  const loader = useRef( false )
  const fullPageLoader = useRef( true )
  const isIntent = useRef( null )
  const clearTextResponseRef = useRef( false )
  const suggestionClickedRef = useRef( false )
  const latestSearchItems = useRef( [] );
  const latestAutoCompleteItems = useRef( [] );
  const lastSentQueryString = useRef( '' );

  const previousPathName = useNavigationContext()
  const loaderPath = `${window.assetBasePath}loader.gif`;

  const selectedGenre = selectedGen;
  const selectedLanguage = selectedLang;
  const [languageList, genreList, searchStringResult, languageRecommendation, genreRecommendation, autoCompleteResults, fetchText, clearAll] = SearchService( );
  const { recommendationLanguageFetchData, recommendationLanguageResponse, recommendationLanguageError, recommendationLanguageLoading } = languageRecommendation;
  const { recommendationGenreFetchData, recommendationGenreResponse, recommendationGenreError, recommendationGenreLoading } = genreRecommendation;
  const { fetchTextFetchData, fetchTextResponse, fetchTextError, fetchTextLoading } = fetchText;
  const { autoCompleteFetchData, autoCompleteResponse, autoCompleteError, autoCompleteLoading } = autoCompleteResults;
  const { languageListFetchData, languageListResponse, languageListError, languageListLoading } = languageList;
  const { genreListFetchData, genreListResponse, genreListError, genreListLoading } = genreList;
  const { clearTextFetchData, clearTextResponse } = clearAll;

  const { ref, focusKey, focusSelf, focused } = useFocusable( {
    isFocusBoundary: true
  } );

  useEffect( () => {
    setMixpanelData( 'searchResultClick', true )
    setTaUseCaseId( SEARCH_PAGE.TRENDING )
    catalogPage.totalCards = []
    catalogPage.totalButtons = []
    catalogPage.current = null;
    fullPageLoader.current = true;
    catalogPage.fullLoader = true;
    catalogPage.halfLoader = true;
    catalogPage.selectedGenre = null
    catalogPage.selectedLanguage = null
    setPageNumberPagination( 1 )
    recommendationLanguageFetchData();
    recommendationGenreFetchData();
    if( getAuthToken() ){
      fetchTextFetchData();
    }
    /* Mixpanel-event */
    search_home()

    previousPathName.current = window.location.pathname;
    return () => {
      setNumberPressed( {} )
    }
  }, [] );


  useEffect( () => {
    if( recommendationLanguageResponse && !recommendationLanguageResponse.data ){
      languageListFetchData( { listType: 'language' } );
    }
    if( recommendationLanguageResponse?.data ){
      // setLanguageRail( recommendationLanguageResponse.data?.contentList );
      languageListFetchData( { listType: 'language' } );
    }
    if( recommendationLanguageError ){
      languageListFetchData( { listType: 'language' } );
    }
  }, [recommendationLanguageResponse, recommendationLanguageError] );

  useEffect( () => {
    if( recommendationGenreResponse && !recommendationGenreResponse.data ){
      genreListFetchData( { listType: 'genre' } );
    }
    if( recommendationGenreResponse?.data ){
      // setGenreRail( recommendationGenreResponse.data?.contentList );
      genreListFetchData( { listType: 'genre' } );
    }
    if( recommendationGenreError ){
      genreListFetchData( { listType: 'genre' } );
    }
  }, [recommendationGenreResponse, recommendationGenreError] );

  useEffect( ()=>{
    if( !!searchPageData.mediaCardRestoreId === false ){
      loader.current = true;
    }
    const pageNumberRestore = !!searchPageData.mediaCardRestoreId === false ? pageNumber : searchPageData.searchPageNumber
    setPageNumber( pageNumberRestore )
    if( recommendationLanguageResponse && recommendationGenreResponse ){
      !!searchPageData.mediaCardRestoreId === false && autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumberRestore } )
      if( !!searchPageData.mediaCardRestoreId !== false ){
        loader.current = false
        if( Array.isArray( searchTotalData ) ){
          setSearchResults( [...searchTotalData] )
          autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: searchPageData.searchPageNumber } )
        }
      }
    }
    else if( recommendationLanguageError || recommendationGenreError ){
      !!searchPageData.mediaCardRestoreId === false && autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumberRestore } )
      if( !!searchPageData.mediaCardRestoreId !== false ){
        loader.current = false
        if( Array.isArray( searchTotalData ) ){
          setSearchResults( [...searchTotalData] )
          autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: searchPageData.searchPageNumber } )
        }
      }

    }
  }, [recommendationLanguageResponse, recommendationLanguageError, recommendationGenreResponse, recommendationGenreError] )

  useEffect( () => {
    if( languageListResponse && genreListResponse ){
      fullPageLoader.current = false
    }
    if( languageListError || genreListError ){
      fullPageLoader.current = false
    }
    if( languageListResponse?.data?.contentList.length ){
      let languageArray = [];
      const languageRecArray = [];
      if( recommendationLanguageResponse?.data?.contentList.length === 0 ){
        setLanguageRail( [] )
      }
      recommendationLanguageResponse?.data?.contentList?.forEach( railItem => {
        const remainingItems = languageListResponse?.data?.contentList?.find( item => item?.title === railItem );
        if( remainingItems ){
          languageRecArray.push( remainingItems )
        }
      } )

      languageArray = [...new Set( languageListResponse?.data?.contentList.filter( item => !languageRail?.includes( item?.title ) ) )];
      const uniqueData = [...[...languageRecArray, ...languageArray].reduce( ( map, obj ) => map.set( obj.id, obj ), new Map() ).values()]
      const IdUpatedList = uniqueData.map( ( item, index )=>{
        return { ...item, id: Number( item.id + 2000 ) }
      } )

      if( languageRecArray.length ){
        setLanguageRail( IdUpatedList )
      }
      else {
        setLanguageRail( [...languageArray] )
      }
    }

    if( genreListResponse?.data?.contentList.length ){
      let genreArray = [];
      const genreRecArray = [];
      if( recommendationGenreResponse?.data?.contentList.length === 0 ){
        setGenreRail( [] )
      }
      recommendationGenreResponse?.data?.contentList?.forEach( railItem => {
        const remainingItems = genreListResponse?.data?.contentList.find( item => item?.title?.toLowerCase() === railItem );
        if( remainingItems ){
          genreRecArray.push( remainingItems )
        }
      } )
      genreArray = [...new Set( genreListResponse?.data?.contentList.filter( item => !genreRail?.includes( item?.title ) ) )];
      if( genreRecArray.length ){
        const resultArray = [...genreRecArray, ...genreArray]
        setGenreRail( [...new Set( resultArray )] )
      }
      else {
        setGenreRail( [...genreArray] )
      }
    }

    const languageListArray = [...languageButtons];
    languageListResponse?.data?.contentList?.forEach( ( language ) => {
      languageListArray.push( language?.title?.toLowerCase() )
    } );
    let languageListArrayLowercase = languageListArray.map( ( language ) => {
      return language.toLowerCase()
    } )
    languageListArrayLowercase = [...new Set( languageListArrayLowercase )];

    const genreListArray = [...genreButtons];
    genreListResponse?.data?.contentList?.forEach( ( genre ) => {
      genreListArray.push( genre?.title?.toLowerCase() )
    } );
    let genreListArrayLowercase = genreListArray.map( ( genre ) => {
      return genre.toLowerCase()
    } )
    genreListArrayLowercase = [...new Set( genreListArrayLowercase )];
    setLanguageButtons( languageListArrayLowercase );
    setGenreButtons( genreListArrayLowercase );
  }, [languageListResponse, languageListError, genreListResponse, genreListError] );

  const searchMixPanel = ( inputValue, selectedLang, selectedGen, count ) => {
    /* Mixpanel-events */
    search_results( inputValue, selectedLang, selectedGen, count, recentSearchClicked, selectedSuggestion )
    search_event( inputValue, recentSearchClicked, selectedSuggestion, selectedLang, selectedGen )
  }

  const searchHomeClickMixPanel = ( source ) => {
    /* Mixpanel-event */
    home_clicks( source )
  }

  useEffect( () => {
    if( !!searchPageData.searchedInputValue === false ){
      if( inputValue ){
        if( !recentSearchClicked ){
          searchHomeClickMixPanel( MIXPANELCONFIG.VALUE.SEARCH_BAR )
        }
        setSearchResults( [] );
        loader.current = true
      }
      const delayDebounceFn = setTimeout( () => {
        if( inputValue.length >= 1 ){
          suggestionClickedRef.current = false
          if( isIntent.current ){
            autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, intent: isIntent.current, pageNumber: pageNumber } );
          }
          else {
            autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumber } )
          }
        }
      }, 10 );
      return () => clearTimeout( delayDebounceFn )
    }
  }, [inputValue] );

  const lessFilteredData = ( autoCompleteResponse ) => {
    const filteredSearchResults = filterRail( autoCompleteResponse.data.search.items, null, constants.SEARCH_PAGES )
    if( isIntent.current && filteredSearchResults.length <= 5 ){
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, intent: isIntent.current, pageNumber: pageNumber + 1 } );
      setPageNumber( p => p + 1 )
    }
    else if( !isIntent.current && filteredSearchResults.length <= 5 ){
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumber + 1 } )
      setPageNumber( p => p + 1 )
    }
  }

  useEffect( () => {
    if( autoCompleteError ){
      loader.current = false
    }
    if( autoCompleteResponse?.data?.search?.items?.length > 0 && autoCompleteResponse?.data?.search?.items !== undefined ){
      latestSearchItems.current = autoCompleteResponse.data.search.items;
      lastSentQueryString.current = inputValue;
      loader.current = false
      if( pageNumber > 1 ){
        // lessFilteredData( autoCompleteResponse )
        setSearchResults( [...searchResults, ...autoCompleteResponse.data.search.items] );
        setSearchMaxCount( autoCompleteResponse?.data?.max_count )
      }
      else if( pageNumber === 1 ){
        // lessFilteredData( autoCompleteResponse )
        setSearchResults( [...autoCompleteResponse.data.search.items] );
        setAutoCompleteRes( true )
        if( autoCompleteResponse?.data.autocomplete?.items?.length > 0 && !selectedSuggestion ){
          latestAutoCompleteItems.current = autoCompleteResponse?.data.autocomplete.items;
          setAutoSuggestClick( false )
          /* Mixpanel-event */
          autoSuggestionInitiate( autoCompleteResponse?.data.autocomplete.items.length, inputValue, MIXPANELCONFIG.VALUE.YES )
          const filterItems = autoCompleteResponse?.data.autocomplete.items.filter( data => data.title !== '' )
          setSearchAutoCompleteRes( filterItems )
        }
        setSearchMaxCount( autoCompleteResponse?.data?.max_count )
        const searchCount = autoCompleteResponse?.data?.search_count > 20 ? autoCompleteResponse?.data?.search_count : filterRail( autoCompleteResponse?.data?.search?.items, null, constants.SEARCH_PAGES ).length
        setSearchCount( searchCount )
      }
      setNoSearchRes( false )
      setIsTrending( false )
      setHasMore( searchResults.length < autoCompleteResponse?.data?.max_count )
      /* Mixpanel-event */
      searchMixPanel( inputValue, selectedLang, selectedGen, autoCompleteResponse?.data?.max_count )
    }
    else if( autoCompleteResponse?.data?.search?.items !== undefined ){
      if( autoCompleteResponse?.data.autocomplete?.items?.length === 0 ){
        /* Mixpanel-event */
        autoSuggestionInitiate( 0, inputValue, MIXPANELCONFIG.VALUE.NO )
      }
      /* Mixpanel-event */
      search_no_result( inputValue, selectedLang, recentSearchClicked, selectedSuggestion )
      setNoSearchRes( true )
    }
    else if( autoCompleteResponse?.data === null ){
      search_no_result( inputValue, selectedLang, recentSearchClicked, selectedSuggestion )
      setNoSearchRes( true )
    }
    else if( !!autoCompleteResponse === false ){
      loader.current = true
    }
    else if( !!autoCompleteResponse === true ){
      loader.current = false
    }

    if( autoCompleteResponse && autoCompleteResponse?.data?.search?.items !== undefined ){
      setNoSearchRes( false )
      if( pageNumber === 1 && filterRail( autoCompleteResponse?.data?.search?.items, null, constants.SEARCH_PAGES ).length === 0 ){
        inputValue ? setRailTitle( constants.FILLED_INPUT_WITH_NO_DATA ) : setRailTitle( '' );
        loader.current = false;
      }
      else {
        setSearchResults( [...searchResults, ...autoCompleteResponse.data.search.items] )
      }
    }
    if( autoCompleteResponse && autoCompleteResponse?.data?.search?.items.length === 0 ){
      latestSearchItems.current = null
    }
  }, [autoCompleteResponse, autoCompleteError] )

  useEffect( () =>{
    if( !searchFlag ){
      getAuthToken() && fetchTextFetchData();
      if( !!searchPageData.mediaCardRestoreId && !!searchPageData.searchedInputValue === false && fullPageLoader ){
        setContLength( searchCardId.focusCardIndex )
        searchPageData.leftPanelOpen && handleFocus()
        setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.TRENDING )
      }
      else if( !!searchPageData.searchedInputValue && fullPageLoader && !searchPageData.isFilterOpen ){
        setContLength( searchCardId.focusCardIndex )
        handleFocus()
        setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.SEARCH_RESULTS )
      }
      else if( !!searchPageData.searchedInputValue && fullPageLoader && searchPageData.isFilterOpen ){
        setContLength( searchCardId.focusCardIndex )
        setIsFilter( true );
        handleFocus()
        searchPageData.showKeyboardIcon === true && setShowKeyboardIcon( true )
        setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.SEARCH_SUGGESTIONS )
      }
      else if( searchPageData.searchLangGenreCardRestoreId && fullPageLoader ){
        setContLength( searchCardId.focusCardIndex )
        searchPageData.leftPanelOpen && handleFocus()
      }
      else if( !searchPageData.searchedInputValue && !searchPageData.mediaCardRestoreId ){
        setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.TRENDING )
      }
    }
  }, [fullPageLoader, searchFlag] )

  useEffect( ()=> {
    if( !fullPageLoader.current && !searchFlag ){
      if( !!searchPageData.mediaCardRestoreId && !!searchPageData.searchedInputValue === false ){
        if( document.querySelector( '.Search__scrollContainer' ) !== null ){
          document.querySelector( '.Search__scrollContainer' ).scrollTop = searchPageData.scrollTop
        }
        if( !searchPageData.leftPanelOpen ){
          setTimeout( ()=> {
            if( !searchFlag && !modalDom() ){
              focusSelf()
            }

          }, 10 )
        }
        searchPageData.searchPageNumber = null
      }
      else if( !!searchPageData.searchedInputValue ){
        if( document.querySelector( '.Search__mediaCard' ) !== null ){
          document.querySelector( '.Search__mediaCard ' ).scrollTop = searchPageData.scrollTop
        }
        if( searchPageData.railTitle === SEARCH_PAGE.SEARCH_RESULT ){
          setRailTitle( RESULTS )
          setSearchMaxCount( searchPageData.searchMaxCount )
          setSearchCount( searchPageData.searchCount )
        }
        else {
          setRailTitle( '' )
          setNoSearchRes( false )
        }
        setIsTrending( false )
        setHideRails( false )
        setSearchAutoCompleteRes( searchPageData.searchAutoCompleteRes )
        searchPageData.showKeyboardIcon === true && setShowKeyboardIcon( true )
        if( searchPageData.isFilterOpen ){
          setSelectedSuggestion( searchPageData.searchedInputValue );
          setTimeout( ()=> {
            searchPageData.leftPanelOpen = null
            searchPageData.isFilterOpen = false
          }, 50 )
          setIsFilter( true );
          searchPageData.showFilter === false && setShowFilter( false )
          setSelectedGen( searchPageData.selectedGen )
          setSelectedLang( searchPageData.selectedLang )
          searchPageData.showFilter = null
          searchPageData.searchedInputValue = null
        }
        searchPageData.searchedInputValue = null
        searchPageData.searchPageNumber = !!searchPageData.searchPageNumber ? searchPageData.searchPageNumber : null
        // setTimeout( ()=> searchPageData.mediaCardRestoreId = null, 100 )
      }
      else if( searchPageData.searchLangGenreCardRestoreId ){
        setTimeout( () => {
          if( document.querySelector( '.Search__scrollContainer' ) ){
            document.querySelector( '.Search__scrollContainer' ).scrollTop = searchPageData.scrollTop
          }
        }, 500 )
        if( !searchPageData.leftPanelOpen ){
          setFocus( searchPageData.searchLangGenreCardRestoreId )
          setTimeout( ()=> {
            setFocus( searchPageData.searchLangGenreCardRestoreId )
            searchPageData.searchLangGenreCardRestoreId = null
          }, 100 )
        }
        searchPageData.isGenereCardClicked = false
      }
      else {
        !searchFlag && setTimeout( ()=> setFocus( 'SEARCH_INPUT' ), 10 )
      }
    }
  }, [fullPageLoader.current, searchFlag] )

  useEffect( () => {
    if( !fullPageLoader.current && !searchFlag ){
      if( document?.querySelector( '.Search__scrollContainer' ) !== null && searchPageData.railTitle === SEARCH_PAGE.TRENDING ){
        if( getAuthToken() ){
          setTimeout( ()=> {
            if( document.querySelector( '.Search__scrollContainer' ) ){
              document.querySelector( '.Search__scrollContainer' ).scrollTop = getScrollInputs( 730, 510 )
            }
          }, 100 )
        }
        else {
          setTimeout( ()=> {
            if( document.querySelector( '.Search__scrollContainer' ) ){
              document.querySelector( '.Search__scrollContainer' ).scrollTop = getScrollInputs( 590, 410 )
            }
          }, 100 )
        }
      }
      setTimeout( ()=>{
        searchPageData.mediaCardRestoreId ? setFocus( searchPageData.mediaCardRestoreId ) : null
        searchPageData.searchPageNumber = null
        searchPageData.mediaCardRestoreId = null
        searchPageData.leftPanelOpen = null
        searchPageData.searchedInputValue = null
        searchPageData.isFilterOpen = null
        searchPageData.searchAutoCompleteRes = null
        searchPageData.searchMaxCount = null
        searchPageData.showFilter = null
        searchPageData.selectedGen = null
        searchPageData.selectedLang = null
        searchPageData.railTitle = null
        searchPageData.scrollTop = null
        searchPageData.searchCount = null
      }, 50 )
    }
  }, [fullPageLoader.current, searchFlag] )

  useEffect( () => {
    if( clearTextResponse?.code === 0 ){
      fetchTextFetchData()
      clearTextResponseRef.current = true
    }
  }, [clearTextResponse] )

  const changeState = ( o, data ) => {
    if( ( o + data ).length <= 40 ){
      return o + data
    }
    else {
      setShowPopup( true )
      setTimeout( () => {
        setShowPopup( false )
      }, 3000 )
      return o
    }
  }

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setIsFocused( true );
      setShowKeyboard( true );
      setValue( o => changeState( o, numberPressed.keyValue ) )
      onKeyboardPress( numberPressed.keyValue )
    }
  }, [numberPressed] )

  useEffect( ()=>{
    if( !modalDom() && clearTextResponseRef.current ){
      focusSelf()
    }
  }, [fetchTextResponse] )

  const onKeyboardPress = ( newValue ) => {
    setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.SEARCH_RESULTS )
    setTaUseCaseId( 'SEARCH RESULTS' )
    setRecentSearchClicked( false )
    setIsFilter( false )
    setHideRails( false )
    setRailTitle( RESULTS );
    setMixpanelData( 'searchResultClick', false )
    isIntent.current = null;
    if( ( inputValue + newValue ).length > 40 ){
      setShowPopup( true )
      setTimeout( () => {
        setShowPopup( false )
      }, 3000 );
      return
    }
    if( !inputValue || inputValue?.length ){
      setPageNumber( 1 )
      setSelectedSuggestion( '' )
      setValue( inputValue + newValue );
    }
  }

  const recentSearchSelected = ( e, filter ) => {
    setRecentSearchClicked( true )
    setPageNumber( 1 )
    setIsFocused( true )
    setRecentsearch( true )
    setValue( filter )
    searchHomeClickMixPanel( MIXPANELCONFIG.VALUE.SEARCH_SOURCE_RECENT_SEARCH )
    setFocus( 'BUTTON_KEY_0' )
    loader.current = true
    setHideRails( false )
    setRailTitle( RESULTS );
  }

  const langClicked = ( e, lang ) => {
    setSearchResults( [] )
    setPageNumber( 1 )
    let newSelectedLanguage = selectedLanguage || []
    loader.current = true
    if( !selectedLanguage.includes( lang?.toLowerCase() ) ){
      newSelectedLanguage = []
      newSelectedLanguage.push( lang )
      setSelectedLang( newSelectedLanguage );
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: lang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumber } );
    }
    else {
      setSelectedLang( [] );
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: [], selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: pageNumber } );
    }
  }

  const genClicked = ( e, gen ) => {
    setSearchResults( [] )
    setPageNumber( 1 )
    let newSelectedGenre = selectedGenre || []
    loader.current = true
    if( !selectedGenre.includes( gen?.toLowerCase() ) ){
      newSelectedGenre = []
      newSelectedGenre.push( gen )
      setSelectedGen( newSelectedGenre );
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: gen, isIntent: isIntent.current, pageNumber: pageNumber } );
    }
    else {
      setSelectedGen( [] );
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: [], isIntent: isIntent.current, pageNumber: pageNumber } );
    }
  }

  useEffect( ()=>{
    if( pageNumber > 1 ){
      loader.current = false;
    }
  }, [pageNumber] )

  const onClear = () => {
    setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.TRENDING )
    setMixPanelRailTitle( SEARCH_PAGE.TRENDING )
    isIntent.current = null;
    setSelectedSuggestion( '' )
    setValue( '' );
    setSearchAutoCompleteRes( [] )
    setPageNumber( 1 )
    setHideRails( true )
    setRailTitle( SEARCH_PAGE.TRENDING )
    setIsTrending( true );
    setNoSearchRes( false )
    setIsFilter( false )
    setSelectedLang( [] );
    setSelectedGen( [] );
    selectedGenreItem.current = null
    selectedLaungueItem.current = null
    inputValue.length !== 0 && setSearchResults( [] )
    setFocus( 'BUTTON_KEY_0' )
    if( inputValue.length > 0 ){
      loader.current = true;
      autoCompleteFetchData( { inputValue: '', selectedLanguage: selectedLang, selectedGenre: selectedGen, isIntent: isIntent.current, pageNumber: 1 } )
    }
    if( autocompleteres && !autoSuggestClick && !getMixpanelData( 'searchResultClick' ) && inputValue.length !== 0 ){
      searchSkiped( latestSearchItems.current, latestAutoCompleteItems.current, inputValue )
    }
  }

  useEffect( () => {
    return () => {
      if( autocompleteres && !autoSuggestClick && !getMixpanelData( 'searchResultClick' ) ){
        searchSkiped( latestSearchItems.current, latestAutoCompleteItems.current, lastSentQueryString.current )
      }
    }
  }, [autocompleteres] )

  const onSpace = () => {
    setSelectedSuggestion( '' )
    setTaUseCaseId( 'SEARCH RESULTS' )
    setIsFilter( false )
    if( inputValue.length === 0 || inputValue.length === 40 ){
      // ..
      if( inputValue.length === 40 ){
        setShowPopup( true )
        setTimeout( () => {
          setShowPopup( false )
        }, 3000 );
      }
    }
    else {
      setValue( inputValue + ' ' );
    }
  }

  const onRemove = () => {
    isIntent.current = null;
    setSelectedSuggestion( '' )
    setIsFilter( false )
    if( inputValue?.slice( 0, -1 ) ){
      setRailTitle( RESULTS )
      setTaUseCaseId( 'SEARCH RESULTS' )
      setValue( inputValue?.slice( 0, -1 ) );
      setPageNumber( 1 )
    }
    else {
      onClear()
    }
  }

  const handleFocus = ( e ) => {
    setIsFocused( true );
    setShowKeyboard( true );
  }

  const handleSuggestionClicked = ( title, intent, index ) => {
    setAutoSuggestClick( true )
    setMixpanelData( 'searchResultClick', true )
    /* Mixpanel-event */
    autoSuggestionClicked( index, title )
    setTaUseCaseId( 'Search Suggestion' )
    isIntent.current = intent
    setPageNumber( 1 )
    setFocus( 'SEARCH_INPUT' )
    setShowKeyboardIcon( true )
    setShowKeyboard( false );
    setSelectedSuggestion( title );
    setIsFilter( true );
    setValue( title );
    loader.current = false
    suggestionClickedRef.current = true
    setShowFilter( true )
    setRailTitle( '' )
    setMixPanelRailTitle( SEARCH_PAGE.SEARCH_SUGGESTIONS )
    setMixpanelData( 'railType', MIXPANEL_RAIL_TYPE.SEARCH_SUGGESTIONS )
  }

  const loadMore = () => {
    setPageNumber( pageNumber + 1 )
    if( inputValue && ( autoCompleteResponse?.data?.search?.items.length || searchTotalData.length || searchResults.length ) ){
      loader.current = true
      autoCompleteResponse?.data?.search?.items.length > 0 && filterRail( autoCompleteResponse?.data?.search?.items, null, constants.SEARCH_PAGES ).length > 0 && autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, intent: isIntent.current, pageNumber: pageNumber + 1 } )
    }
    else {
      loader.current = true;
      autoCompleteFetchData( { inputValue: inputValue, selectedLanguage: selectedLang, selectedGenre: selectedGen, intent: isIntent.current, pageNumber: pageNumber + 1 } )
    }
  }

  const fullLoaderCompletetionFn = () =>{
    if( !!getAuthToken() === false ){
      return ( languageListLoading || genreListLoading )
    }
    else {
      return ( languageListLoading || genreListLoading || fetchTextLoading )
    }
  }

  const onKeyPress = useCallback( ( ) => {
    setLongKeyPressed( true )
  } );
  const onKeyRelease = useCallback( ( ) => {
    setLongKeyPressed( false )
  } );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    window.addEventListener( 'keyup', onKeyRelease );
    return () => {
      window.removeEventListener( 'keyup', onKeyRelease );
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  useEffect( () => {
    if( inputValue ){
      if( inputValue === searchPageData.searchedInputValue ){
        setSearchResults( [] )
        return;
      }
      setSearchResults( [] )
      setContLength( -1 )
      setMixPanelRailTitle( SEARCH_PAGE.SEARCH_RESULT )
    }
  }, [inputValue] );

  return (
    <>
      <div ref={ ref }
        className={ !searchFlag ? 'Search showChild' : 'Search hideChild' }
      >
        <FocusContext.Provider value={ focusKey }>
          <div className='Search__main'>
            <div className='Search__logoImage'>
              <Icon
                name={ 'BingeLogo' }
              />
            </div>
            <div className='Search__mainContainer'>

              <div
              // className={ focused ? 'Search__inputContainer--focused' : 'Search__inputContainer' }
                className={
                  classNames(
                    { 'Search__inputContainer--focused': focused },
                    { 'Search__inputContainer': !focused },
                    { 'Search__inputContainer--withKeyboard': isFocused }
                  )
                }
              >
                <InputField
                  type='text'
                  id='emailInput'
                  onChange={ onKeyboardPress }
                  value={ inputValue ? inputValue : constants.placeHolderText }
                  handleFocus={ ( e ) => handleFocus( e ) }
                  disabled={ isDisable }
                  searchBox={ true }
                  setShowKeyboardIcon={ setShowKeyboardIcon }
                  setShowKeyboard={ setShowKeyboard }
                  showKeyboardIcon={ showKeyboardIcon }
                  languageRail={ languageRail }
                  genreRail={ genreRail }
                  languageListResponse={ languageListResponse }
                  genreListResponse={ genreListResponse }
                  fetchTextResponse={ fetchTextResponse }
                  iskeyBoardOpen={ isFocused }
                  focusKeyReference='SEARCH_INPUT'
                  isComingFromPage={ PAGE_NAME.SEARCH }
                  isFocusedInputField={ isFocused }
                  totalSearchRecords={ searchResults?.length }
                />
              </div>
              <div className='Search__container'>
                { isFocused &&
                <div
                  className={
                    classNames( {
                      'Search__containerLeft': isFocused
                    } )
                  }
                >
                  { showKeyboardIcon ?
                    (
                      <div className={
                        classNames( {
                          'Search__keyboard--icon': showKeyboardIcon
                        } )
                      }
                      >
                        <Icon
                          name={ 'Keyboard' }
                        />
                      </div>
                    ) :
                    (
                      <AlphanumericKeyboard
                        keys={ ALPHANUMERICKEYBOARD.KEYBOARD_WITH_SPECIAL_KEYS }
                        deleteBtnLabel={ constants.DELETEBTN_LABEL }
                        spaceBtnLabel={ constants.SPACEBTN_LABEL }
                        clearBtnLabel={ constants.CLEARBTN_LABEL }
                        onChange={ onKeyboardPress }
                        onClear={ ( e ) => onClear( e ) }
                        onRemove={ ( e ) => onRemove( e ) }
                        onSpace={ ( e ) => onSpace( e ) }
                        isFocused={ isFocused }
                        recentSearchClicked={ recentSearchClicked }
                        inputValue={ inputValue }
                        longKeyPressed={ longKeyPressed }
                        totalSearchRecords={ searchResults?.length }
                      />
                    )
                  }

                  { searchAutoCompleteRes.length && !!inputValue && (
                    <ul className='Search__autosuggest'>
                      <AutoCompleteSuggestions
                        inputValue={ inputValue }
                        autoCompleteList={ searchAutoCompleteRes }
                        suggestionClicked={ ( title, intent, index ) => handleSuggestionClicked( title, intent, index ) }
                        setShowKeyboardIcon={ setShowKeyboardIcon }
                        longKeyPressed={ longKeyPressed }
                        totalSearchRecords={ searchResults?.length }
                      // autoCompleteLoading={ autoCompleteLoading }
                      />
                    </ul>
                  ) }

                </div>
                }
                { isFilter &&
                <div className='Search__filter'>
                  { !noSearchRes && ( selectedSuggestion || searchResults?.length > 0 || railTitle ) &&
                  <Text
                    textStyle='title-3'
                    color='white'
                  >
                    { isFilter && `${SEARCH_PAGE.TITLES_RELATED_TO}: ${selectedSuggestion}` }
                  </Text>
                  }
                  <SearchFilters
                    languageButtons={ languageButtons }
                    genreButtons={ genreButtons }
                    genClicked={ genClicked }
                    langClicked={ langClicked }
                    setShowFilter={ ( val )=>{
                      setShowFilter( val )
                    } }
                    showFilter={ showFilter }
                    isFilter={ isFilter }
                    // onFocus={ onRailFocus }
                    focusKeyRefrence={ 'BUTTON_PRIMARY_FILTER' }
                  />
                </div>
                }
                {
                  ( inputValue.length > 0 ? fullPageLoader.current : loader.current || fullLoaderCompletetionFn() ) ? (
                    <FocusContext.Provider focusable={ false }
                      value=''
                    >
                      <div className='Loader Search__loader'>
                        <Image
                          src={ loaderPath }
                        />
                      </div>
                    </FocusContext.Provider>
                  ) : (
                    loader.current ? (
                      <FocusContext.Provider focusable={ false }
                        value=''
                      >
                        <SearchRightContainer
                          hideRails={ hideRails }
                          fetchTextResponse={ fetchTextResponse }
                          recentSearchSelected={ recentSearchSelected }
                          showKeyboard={ showKeyboard }
                          isFocused={ isFocused }
                          languageRail={ languageRail }
                          genreRail={ genreRail }
                          languageButtons={ languageButtons }
                          genreButtons={ genreButtons }
                          genClicked={ genClicked }
                          langClicked={ langClicked }
                          showFilter={ showFilter }
                          isTrending={ isTrending }
                          noSearchRes={ noSearchRes }
                          selectedSuggestion={ selectedSuggestion }
                          searchResults={ searchResults }
                          max_count={ searchMaxCount }
                          railTitle={ railTitle }
                          languageListResponse={ languageListResponse }
                          genreListResponse={ genreListResponse }
                          isFilter={ isFilter }
                          showKeyboardIcon={ showKeyboardIcon }
                          inputValueLenth={ inputValue?.length }
                          clearTextFetchData={ clearTextFetchData }
                          noResultVerbiage={ searchNoDataFoundVerbiage( autoCompleteResponse ) }
                          fetchTextLoading={ fetchTextLoading }
                          hasMore={ hasMore }
                          loadMore={ loadMore }
                          inputValue={ inputValue }
                          selectedGen={ selectedGen }
                          selectedLang={ selectedLang }
                          loader={ loader.current }
                          fullPageLoader={ fullPageLoader.current }
                          pageNumber={ pageNumber }
                          searchAutoCompleteRes={ searchAutoCompleteRes }
                          taUseCaseId={ taUseCaseId }
                          searchCount={ searchCount }
                          contLength={ contLength }
                          setContLength={ setContLength }
                          mixPanelRailTitle={ mixPanelRailTitle }
                        />
                      </FocusContext.Provider>

                    ) : (
                      <SearchRightContainer
                        hideRails={ hideRails }
                        fetchTextResponse={ fetchTextResponse }
                        recentSearchSelected={ recentSearchSelected }
                        showKeyboard={ showKeyboard }
                        isFocused={ isFocused }
                        languageRail={ languageRail }
                        genreRail={ genreRail }
                        languageButtons={ languageButtons }
                        genreButtons={ genreButtons }
                        genClicked={ genClicked }
                        langClicked={ langClicked }
                        showFilter={ showFilter }
                        isTrending={ isTrending }
                        noSearchRes={ noSearchRes }
                        selectedSuggestion={ selectedSuggestion }
                        searchResults={ searchResults }
                        max_count={ searchMaxCount }
                        railTitle={ railTitle }
                        languageListResponse={ languageListResponse }
                        genreListResponse={ genreListResponse }
                        isFilter={ isFilter }
                        showKeyboardIcon={ showKeyboardIcon }
                        inputValueLenth={ inputValue?.length }
                        clearTextFetchData={ clearTextFetchData }
                        noResultVerbiage={ searchNoDataFoundVerbiage( autoCompleteResponse ) }
                        fetchTextLoading={ fetchTextLoading }
                        hasMore={ hasMore }
                        loadMore={ loadMore }
                        inputValue={ inputValue }
                        selectedGen={ selectedGen }
                        selectedLang={ selectedLang }
                        loader={ loader.current }
                        fullPageLoader={ fullPageLoader.current }
                        pageNumber={ pageNumber }
                        searchAutoCompleteRes={ searchAutoCompleteRes }
                        taUseCaseId={ taUseCaseId }
                        searchCount={ searchCount }
                        contLength={ contLength }
                        setContLength={ setContLength }
                        mixPanelRailTitle={ mixPanelRailTitle }
                      />
                    )
                  ) }
              </div>
            </div>
          </div>
        </FocusContext.Provider>
        { showPopup &&
        <div className='DeviceManagementPage__notification'>
          <Notifications
            message={ constants.MY_ACCOUNT.CHARACTER_LIMIT }
          />
        </div>
        }
      </div>
      { searchFlag &&
      <div className={ searchFlag ? 'showChild' : 'hideChild' }>
        <PlaybackInfo inputValue={ inputValue }/>
      </div>
      }
    </>
  )
}

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

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
