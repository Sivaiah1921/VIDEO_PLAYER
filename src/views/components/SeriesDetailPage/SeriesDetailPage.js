/* eslint-disable no-console */
/**
 * This component will provide all the episodes related information and search
 *
 * @module views/components/SeriesDetailPage
 * @memberof -Common
 */
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import './SeriesDetailPage.scss';
import InputField from '../InputField/InputField';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import SeasonTab from '../SeasonTab/SeasonTab';
import MediaCard from '../MediaCard/MediaCard';
import AlphanumericKeyboard from '../AlphanumericKeyboard/AlphanumericKeyboard';
import classNames from 'classnames';
import { useParams, useHistory } from 'react-router-dom';
import { SeriesDetailPageService } from '../../../utils/slayer/SeriesDetailPageService';
import { ContentMetaData, SeriesList, checkAuthType } from '../../../utils/slayer/PlaybackInfoService';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
const { RESULTS, NORESULTS } = require( '../../../utils/constants' ).default;
import { LAYOUT_TYPE, constants, ALPHANUMERICKEYBOARD, CONTENT_TYPE, PROVIDER_LIST, PAGE_NAME, APPLETV } from '../../../utils/constants';
import { cloudinaryCarousalUrl, handleErrorMessage, showToastMsg } from '../../../utils/util';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import serviceConst from '../../../utils/slayer/serviceConst';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import Notifications from '../Notifications/Notifications';
import Image from '../Image/Image';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { AppleAndPrimeService } from '../../../utils/slayer/AmazonPrimeService';
import { handleStatusResponsePrime } from '../../../utils/primeHelper';
import { getProviderWithToken } from '../../../utils/commonHelper';

/**
  * Represents a SeriesDetailPage component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns SeriesDetailPage
  */

export const EpisodesMediaCards = ( { episodeListData, filterRail, selectedSeason, showKeyboard, inputValue, loadMore, pageNumber, masterRating, loadAllEpisodeListData, setShowNotification, setNotificationMessage, setNotificationIcon } ) =>{
  const [contentList, setContentList] = useState( [] );
  const [contLength, setContLength] = useState( -1 );

  const mouseEntryRef = useRef( false )

  const { episodeCardId } = useMaintainPageState() || null
  const { metaData } = usePlayerContext()
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const configAuthToken = checkAuthType( config.availableProviders, metaData?.provider );
  const { ref, focusKey } = useFocusable( {
    saveLastFocusedChild: false
  } );

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `BUTTON_FOCUS_${id}` )
  }

  const getPlaybackURL = ( episode ) =>{
    let playback_url = null;
    if( episode.provider === PROVIDER_LIST.SHEMAROO_ME ){
      playback_url = episode.detail?.partnerDeepLinkUrl || episode.playerDetails?.partnerDeepLinkUrl;
    }
    else if( configAuthToken === 'JWTToken' || episode.provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
      playback_url = episode.detail?.dashWidewinePlayUrl || episode.playerDetails?.dashWidewinePlayUrl;
    }
    else {
      playback_url = episode.detail?.playUrl || episode.playerDetails?.playUrl;
    }
    return playback_url;
  }

  const onRailMediaCardFocus = useCallback( ( { y, ...rest }, index ) => {
    if( ref.current ){
      ref.current.scrollTop = rest.top - ( window.innerWidth === 1920 ? 490 : 390 )
    }
    episodeCardId.current = index + 1
    setContLength( index );
  }, [ref] );

  const renderEpisodeList = useMemo( () => {
    const finalCount = contLength + 20;
    const initialVal = Math.max( 0, contLength - 15 );
    return contentList?.map( ( episode, index ) => {
      const visibleIndex = !( index < initialVal || index > finalCount ) || mouseEntryRef.current
      return (
        visibleIndex ? (
          <MediaCard
            key={ episode.title + '_' + index }
            image={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.SEARCH_PAGE, url ) }/${ episode.boxCoverImage }` }
            title={ episode.title }
            language={ episode.audio }
            episodeTitle={ episode.episodeTitle || episode.title }
            type={ 'landscape' }
            onFocus={ ( e ) => onRailMediaCardFocus( e, index ) }
            freeEpisodesAvailable={ episode.freeEpisodesAvailable }
            contractName={ episode.contractName }
            partnerSubscriptionType={ episode.partnerSubscriptionType }
            providerName={ episode.provider }
            timeBlock={ episode.contentType === CONTENT_TYPE.TV_SHOWS ? episode.duration || episode.totalDuration : null }
            focusKeyRefrence={ `BUTTON_FOCUS_${episode.id}` }
            episodeRestoreId={ episode.id }
            selectedSeason={ selectedSeason }
            showKeyboard={ showKeyboard }
            seriesInputValue={ inputValue }
            totalepisodeListData={ filterRail( episodeListData ) }
            totalepisodeListDataPagination={ loadAllEpisodeListData }
            onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( episode.id ) }
            playback_url={ getPlaybackURL( episode ) }
            licenceUrl={ episode.detail?.dashWidewineLicenseUrl || episode.playerDetails?.dashWidewineLicenseUrl }
            partnerDeepLinkUrl={ episode.partnerDeepLinkUrl }
            providerContentId={ episode.providerContentId }
            epidsSet={ episode.detail?.offerId?.epids || loadAllEpisodeListData?.find( item => item.id.toString() === episode.id.toString() )?.detail?.offerId?.epids }
            playBackTitle={ episode.title }
            contentType={ episode.contentType }
            contentID={ episode.id }
            isPlayable={ true }
            masterRating={ masterRating }
            episodeId={ episode.episodeId || episode.episodeNumber }
            totalepisodeListDataLength={ filterRail( episodeListData ).length }
            episodePageNumber={ pageNumber }
            episodeDuration={ episode.duration }
            directlyPlayable={ true }
            releaseYear={ episode.releaseYear }
            genre={ episode.genre || episode.genres }
            actors={ episode.actor }
            rating={ episode.rating }
            contentList={ episodeListData }
            cardIndexValue={ index }
            setShowNotification={ setShowNotification }
            setNotificationMessage={ setNotificationMessage }
            setNotificationIcon={ setNotificationIcon }
            showPlayButtonIcon={ true }
          />
        ) : (
          <div className='MediaCardWrapper emptyCell'>
            <div className='MediaCard'
              style={ { background: '#33354d' } }
            ></div>
          </div>
        )
      )
    } )
  }, [contLength, contentList, mouseEntryRef.current] );

  const onMouseEnterpageFn = () =>{
    mouseEntryRef.current = true
  }

  const onMouseLeavepageFn = () =>{
    mouseEntryRef.current = false
  }

  useEffect( () => {
    const filterContentList = filterRail( episodeListData );
    setContentList( filterContentList );
  }, [episodeListData] );

  useEffect( () => {
    const count = episodeCardId.current ? episodeCardId.current : Math.max( Math.min( contLength, contentList.length ), 0 );
    setContLength( count );
    episodeCardId.current = null
  }, [] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='SeriesDetailPage__mediaCard calculateWidth'
        id='scrollContainerId'
        ref={ ref }
        onMouseEnter={ onMouseEnterpageFn }
        onMouseLeave={ onMouseLeavepageFn }
      >
        <FocusContext.Provider value={ focusKey }>
          <InfiniteScroll
            dataLength={ episodeListData?.length }
            scrollableTarget='scrollContainerId'
            next={ loadMore }
            hasMore={ true }
            scrollThreshold={ 0.8 }
            style={ { display: 'flex',
              flexWrap: 'wrap',
              padding:' 1rem -1rem 0.625rem 0',
              overflow: 'auto',
              paddingBottom: '13rem',
              paddingTop: '0.6rem',
              width: 'fit-content',
              paddingLeft: '0.4rem'
            } }
          >
            { renderEpisodeList }
          </InfiniteScroll>
        </FocusContext.Provider>

      </div>
    </FocusContext.Provider>
  )
}

export const SeriesDetailPage = () => {
  const [currntIndex, setCurrntIndex] = useState( 0 )
  const [inputValue, setValue] = useState( '' );
  const [showSeasonsTab, setShowSeasonsTab] = useState( true );
  const [episodeListData, setEpisodeListData] = useState( [] );
  const [loadAllEpisodeListData, setLoadAllEpisodeListData] = useState( [] );
  const [selectedSeason, setSelectedSeason] = useState( );
  const [resultMessage, setResultMessage] = useState( '' );
  const [series, setSeries] = useState();
  const [showKeyboard, setShowKeyBoard] = useState( false );
  const [isError, setIsError] = useState( false );
  const [enableKey, setEnableKey] = useState( false );
  const [pageNumber, setPageNumber] = useState( 0 );
  const [showNotification, setShowNotification] = useState( false );
  const [notificationIcon, setNotificationIcon] = useState( 'Success' )
  const [notificationMessage, setNotificationMessage] = useState( '' )

  const contenClearRef = useRef( false )
  const railsDatapositionRef = useRef( [] );
  const seasonTabRef = useRef( '' )
  const refSrcoll = useRef( null );
  const responseTimeoutRef = useRef( null )

  const history = useHistory();
  const { numberPressed, setNumberPressed } = useHomeContext()
  const { filterRail } = useContentFilter()
  const { configResponse } = useAppContext();
  const { episodePageData, searchKeyBoardLastFocuskey, receivePubnubAfterScanning, flexiPlanVerbiagesContext } = useMaintainPageState() || null
  const { type, id } = useParams();
  const responseSubscription = useSubscriptionContext( );
  const { ref, focusKey, focused } = useFocusable( {
    isFocusBoundary: true
  } );

  const [contentInfoObj] =  ContentMetaData( { type, id } )
  const { contentInfoResponse, contentInfoLoading } = contentInfoObj;

  const [searchData] = SeriesDetailPageService( { inputValue, id, type } );
  const { searchFetchData, searchResponse, searchError, searchLoading } = searchData;

  const [seriesList] = SeriesList( { season: selectedSeason, id: id } );
  const { seasonFetchData, seasonResponse, seasonError, seasonLoading } = seriesList;

  const [entitlementStatus] = AppleAndPrimeService();
  const { entitlementStatusFetchData, entitlementStatusResponse, entitlementStatusError, entitlementStatusLoading } = entitlementStatus;

  const appleToastMessage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )

  let alphanumericKeyboardProp = {
    clearBtnLabel: constants.CLEARBTN_LABEL,
    deleteBtnLabel: constants.DELETEBTN_LABEL,
    spaceBtnLabel: constants.SPACEBTN_LABEL,
    keys: ALPHANUMERICKEYBOARD.KEYBOARD_WITHOUT_SPECIAL_KEYS
  }

  const { config } = configResponse;
  const MINIMUM_CHARACTER = 2
  const loaderPath = `${window.assetBasePath}loader.gif`;
  const myPlanProps = responseSubscription?.responseData.currentPack

  const getId = () => {
    if( contentInfoResponse && contentInfoResponse.data && contentInfoResponse.data.meta && contentInfoResponse.data.meta.parentContentType && contentInfoResponse.data.meta.parentContentType.includes( CONTENT_TYPE.BRAND ) ){
      return contentInfoResponse.data.meta.brandId
    }
    else {
      return id
    }
  }

  const getType = () => {
    if( contentInfoResponse && contentInfoResponse.data && contentInfoResponse.data.meta && contentInfoResponse.data.meta.parentContentType ){
      return contentInfoResponse.data.meta.parentContentType
    }
    else {
      return type
    }
  }

  const fetchSeason = () => {
    selectedSeason === contentInfoResponse?.data?.meta?.brandId ? seasonFetchData( { url: serviceConst.SERIES_LIST_TRAILER_MORE + selectedSeason + '/list', pageNumber: 0 } ) : seasonFetchData( { url: serviceConst.SERIES_LIST + selectedSeason + '/list', pageNumber: 0 } )
  }

  const loadMore = () => {
    if( inputValue.length <= MINIMUM_CHARACTER ){
      setPageNumber( pageNumber + 20 )
      seasonFetchData( { url: serviceConst.SERIES_LIST + selectedSeason + '/list', pageNumber: pageNumber + 20 } );
    }
    else {
      setPageNumber( pageNumber + 1 )
      searchFetchData( { queryString : inputValue, id: getId(), pageNumber: pageNumber + 1, parentType: getType() } );
    }
  }

  const changeState = ( searchInput, data ) => {
    if( ( searchInput + data ).length <= 40 ){
      return searchInput + data
    }
    else {
      setShowNotification( true )
      setTimeout( () => {
        setShowNotification( false )
      }, 3000 )
      return searchInput
    }
  }

  const onKeyboardPress = ( newValue ) => {
    if( ( inputValue + newValue ).length > 40 ){
      setShowNotification( true )
      setTimeout( () => {
        setShowNotification( false )
      }, 3000 );
      return
    }
    if( !inputValue || inputValue?.length ){
      setValue( inputValue + newValue );
    }
  }

  const handleFocus = ( e ) => {
    setEnableKey( true )
    setShowKeyBoard( true )
  }

  const inputValueClear = () => {
    setCurrntIndex( 0 )
    setPageNumber( 0 )
    setResultMessage( '' )
    setEpisodeListData( [] )
    contenClearRef.current = true
    fetchSeason();
  }

  const onClear = () => {
    if( inputValue.length === 0 ){
      return;
    }
    setValue( '' );
    inputValueClear()
  }

  const onRemove = () => {
    if( inputValue.length === 0 ){
      return;
    }
    const tempInputValue = inputValue?.slice( 0, -1 )
    setValue( tempInputValue )
    if( tempInputValue.length === 0 ){
      inputValueClear()
    }
  }

  const onSpace = () => {
    if( inputValue.length === 0 || inputValue.length === 40 ){
      if( inputValue.length === 40 ){
        setShowNotification( true )
        setTimeout( () => {
          setShowNotification( false )
        }, 3000 );
      }
    }
    else {
      setValue( inputValue + ' ' );
    }
  }

  const onSeasonClick = ( item ) => {
    if( item.seriesName === 'Episode' || item.seriesName === 'Other Episode' ){
      return null
    }
    else {
      item.id ? setSelectedSeason( item.id ) : setSelectedSeason( contentInfoResponse?.data?.meta?.brandId )
    }
  }

  const onRailFocus = useCallback( ( { y, ...rest } ) => {
    railsDatapositionRef.current.push( rest.top )
    if( rest.node.className === 'SeasonTab' ){
      seasonTabRef.current = rest.node.className
      setEnableKey( false )
    }
    if( refSrcoll.current ){
      refSrcoll.current.scrollTop = rest.top - 350
    }
  }, [refSrcoll] );

  const keyDownHandler = useCallback( ( { keyCode } ) => {
    if( keyCode === 13 && enableKey ){
      setShowKeyBoard( true );
    }
  } )

  useEffect( ()=>{
    if( !contentInfoLoading ){
      !!episodePageData.mediaCardRestoreId === false && setFocus( 'SEARCH_INPUT' )
    }
  }, [contentInfoLoading] )

  useEffect( () => {
    if( contentInfoResponse && contentInfoResponse.data ){
      const seasonsList = contentInfoResponse.data.seriesList;
      if( contentInfoResponse.data.shorts?.labelName && contentInfoResponse.data.shorts?.enabled ){
        seasonsList.push( {
          seriesName: contentInfoResponse.data.shorts.labelName
        } )
      }
      if( seasonsList?.length > 0 ){
        !!episodePageData.selectedSeason === true ? setSelectedSeason( episodePageData.selectedSeason ) : setSelectedSeason( seasonsList[0].id )
      }
      if( seasonsList?.length === 0 && contentInfoResponse.data.meta?.seriesId ){
        seasonsList.push( {
          seriesName: contentInfoResponse.data.meta?.parentContentType === CONTENT_TYPE.SERIES && contentInfoResponse.data.meta?.contentType === CONTENT_TYPE.SERIES ? 'Episode' : 'Other Episode'
        } )
        seasonFetchData( { url: serviceConst.SERIES_LIST + contentInfoResponse.data.meta.seriesId + '/list', pageNumber: 0 } );
        setSelectedSeason( contentInfoResponse.data.meta.seriesId )
      }
      setSeries( seasonsList )
    }
  }, [contentInfoResponse] )

  useEffect( () => {
    if( searchResponse?.data?.contentList?.length > 0 ){
      setResultMessage( '' )
      !!episodePageData.mediaCardRestoreId ? ( setEpisodeListData( episodePageData.totalCards ), setLoadAllEpisodeListData( episodePageData.totalCardsPagination ) ) : setEpisodeListData( [...episodeListData, ...searchResponse.data.contentList] )
    }
    else if( searchResponse?.data?.contentList?.length === 0 && pageNumber === 1 ){
      setEpisodeListData( [] )
      setResultMessage( NORESULTS );
    }
    else if( ( searchResponse && ( searchResponse.data === null || searchResponse.code !== 0 ) ) ){
      setIsError( true )
    }
  }, [searchResponse, searchError] );

  useEffect( () => {
    if( searchError ){
      setIsError( true )
    }
  }, [searchError] )

  useEffect( () => {
    if( inputValue?.length > MINIMUM_CHARACTER && contentInfoResponse ){
      setPageNumber( 1 )
      searchFetchData( { queryString : inputValue, id: getId(), pageNumber: 1, parentType: getType() } );
      setShowSeasonsTab( false );
      setEpisodeListData( [] )
    }
    else if( inputValue?.length === 0 ){
      setShowSeasonsTab( true );
    }
  }, [inputValue, contentInfoResponse] );

  useEffect( ( ) => {
    if( selectedSeason ){
      setEpisodeListData( [] )
      setPageNumber( 0 )
      if( !!episodePageData.mediaCardRestoreId === false ){
        setPageNumber( 0 )
      }
      else {
        setPageNumber( episodePageData.episodePageNumber )
      }
      fetchSeason();
    }
  }, [selectedSeason] )

  useEffect( ( ) => {
    if( inputValue.length <= MINIMUM_CHARACTER ){
      if( seasonResponse && seasonResponse.data && seasonResponse.data.items ){
        !!episodePageData.mediaCardRestoreId ? ( setEpisodeListData( episodePageData.totalCards ), setLoadAllEpisodeListData( episodePageData.totalCardsPagination ) ) : pageNumber === 0 ? ( setEpisodeListData( [...seasonResponse?.data?.items] ), setLoadAllEpisodeListData( [...seasonResponse?.data?.items] ) ) : ( setEpisodeListData( [...episodeListData, ...seasonResponse?.data?.items] ), setLoadAllEpisodeListData( [...episodeListData, ...seasonResponse?.data?.items] ) )
      }
      else if( ( seasonResponse && seasonResponse.data === null ) ){
        setIsError( true )
      }
    }
  }, [seasonResponse, seasonError] )

  useEffect( () => {
    if( !contentInfoLoading ){
      if( !!episodePageData.mediaCardRestoreId ){
        let list
        list = seasonResponse?.data?.items?.map( item => item.id )
        clearTimeout( responseTimeoutRef.current )
        setFocus( episodePageData.mediaCardRestoreId )
        responseTimeoutRef.current = setTimeout( ()=>{
          if( document.querySelector( '.SeriesDetailPage__mediaCard' ) && document.querySelector( '.SeriesDetailPage__mediaCard' ).style ){
            document.querySelector( '.SeriesDetailPage__mediaCard' ).style.scrollBehavior = 'smooth';
          }
          setFocus( episodePageData.mediaCardRestoreId )
          episodePageData.mediaCardRestoreId = null
          episodePageData.selectedSeason = null
          episodePageData.showKeyboard = null
          episodePageData.seriesInputValue = null
          episodePageData.episodePageNumber = null
        }, 300 )
      }
      else {
        contenClearRef.current && setTimeout( ()=> {
          setFocus( searchKeyBoardLastFocuskey.current )
          contenClearRef.current = false
        }, 10 )
      }
    }
    else {
      episodePageData.showKeyboard && setShowKeyBoard( true )
      episodePageData.seriesInputValue && setValue( episodePageData.seriesInputValue )
    }

    return ()=>{
      clearTimeout( responseTimeoutRef.current )
    }
  }, [contentInfoLoading] );

  useEffect( ()=>{
    return () => {
      setNumberPressed( {} )
    }
  }, [] )

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setEnableKey( true );
      setShowKeyBoard( true );
      setValue( o => changeState( o, numberPressed.keyValue ) )
    }
  }, [numberPressed] )

  useEffect( () => {
    if( receivePubnubAfterScanning.current?.status ){
      if( getProviderWithToken( contentInfoResponse?.data?.meta?.provider, PROVIDER_LIST.PRIME ) || getProviderWithToken( contentInfoResponse?.data?.meta?.provider, PROVIDER_LIST.APPLETV ) ){
        entitlementStatusFetchData( { primePrimaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
      }
    }
  }, [receivePubnubAfterScanning.current, contentInfoResponse?.data?.meta?.provider] )

  useEffect( () => {
    if( entitlementStatusResponse || entitlementStatusError ){
      if( getProviderWithToken( contentInfoResponse?.data?.meta?.provider, PROVIDER_LIST.PRIME ) ){
        handleStatusResponsePrime( entitlementStatusResponse, entitlementStatusError, history, config, myPlanProps, null, null, null, receivePubnubAfterScanning.current, setNotificationIcon, setNotificationMessage, setShowNotification );
        receivePubnubAfterScanning.current = {}
      }
      else if( getProviderWithToken( contentInfoResponse?.data?.meta?.provider, PROVIDER_LIST.APPLETV ) ){
        if( entitlementStatusResponse?.data?.appleStatus?.entitlementStatus === APPLETV.CLAIM_STATUS.ACTIVATED ){
          showToastMsg( setShowNotification, setNotificationMessage, appleToastMessage?.lsAppleActivatedToastMessage, setNotificationIcon, 'Success' )
        }
        else {
          showToastMsg( setShowNotification, setNotificationMessage, appleToastMessage?.lsPendingToastMessage, setNotificationIcon, 'InformationIcon' )
        }
        receivePubnubAfterScanning.current = {}
      }
    }
  }, [entitlementStatusResponse, entitlementStatusError] )

  useEffect( () => {
    document.addEventListener( 'keydown', keyDownHandler );
    return () => {
      document.removeEventListener( 'keydown', keyDownHandler );
    };
  }, [enableKey] );

  return (
    <>
      { ( isError ) ? (
        <div className='SeriesDetailPage__errorPage'>
          <ErrorPage error={ handleErrorMessage( searchError, searchResponse, constants.CONTENT_NOT_FOUND ) } />
        </div>
      ) :
        (
          <div className='SeriesDetailPage'>
            <FocusContext.Provider value={ focusKey }>
              <div
                ref={ ref }
                id='scrollContainer'
                className='SeriesDetailPage__scrollContainer'
              >
                <div className='SeriesDetailPage__topContainer'>
                  <div
                    className={ focused ? 'SeriesDetailPage__inputContainer--focused' : 'SeriesDetailPage__inputContainer' }
                  >
                    <InputField
                      type='text'
                      id='emailInput'
                      onChange={ onKeyboardPress }
                      value={ inputValue ? inputValue : constants.placeHolderText }
                      placeholder={ 'Enter Text Here' }
                      disabled={ false }
                      searchBox={ true }
                      onFocus={ onRailFocus }
                      setEnableKey={ setEnableKey }
                      handleFocus={ handleFocus }
                      focusKeyReference='SEARCH_INPUT'
                      isComingFromPage={ PAGE_NAME.SERIES_DETAIL }
                    />
                  </div>
                  <Icon name={ 'BingeLogo' }/>
                </div>
                <div className='SeriesDetailPage__container'>
                  { showKeyboard && alphanumericKeyboardProp &&
                  <div className={
                    classNames( {
                      'SeriesDetailPage__containerLeft': showKeyboard
                    } )
                  }
                  >
                    <div className='SeriesDetailPage__keyboard'>
                      <AlphanumericKeyboard
                        keys={ alphanumericKeyboardProp.keys }
                        deleteBtnLabel={ alphanumericKeyboardProp.deleteBtnLabel }
                        spaceBtnLabel={ alphanumericKeyboardProp.spaceBtnLabel }
                        clearBtnLabel={ alphanumericKeyboardProp.clearBtnLabel }
                        onChange={ onKeyboardPress }
                        onClear={ onClear }
                        onRemove={ onRemove }
                        onSpace={ onSpace }
                      />
                    </div>
                  </div>
                  }
                  <div className='SeriesDetailPage__containerRight'>
                    { !showSeasonsTab && episodeListData.length === 0 && (
                      <>
                        <Text
                          textStyle='title-2'
                          color='white'
                          htmlTag='p'
                        >
                          { RESULTS }
                        </Text>
                        <Text
                          textStyle='subtitle-4'
                          color='white'
                          htmlTag='span'
                        >
                          { resultMessage }
                        </Text>
                      </>
                    ) }
                    { !showSeasonsTab && episodeListData.length > 0 && (
                      <div className='SeriesDetailPage__containerRight--resultMessage2'>
                        <Text
                          textStyle='title-2'
                          color='white'
                        >
                          { RESULTS }
                        </Text>
                      </div>

                    ) }
                    { showSeasonsTab && <div className='SeriesDetailPage__tabs'>
                      <SeasonTab
                        tabheadList={ series }
                        handleClick={ ( e ) => onSeasonClick( e ) }
                        buttonFromDetailPage={ true }
                        onFocus={ onRailFocus }
                        seasonLoading={ seasonLoading }
                        currntIndex={ currntIndex }
                        setCurrntIndex={ setCurrntIndex }
                      />
                    </div> }
                    { ( ( seasonLoading && pageNumber === 0 ) || ( searchLoading && pageNumber === 1 ) ) && (
                      <FocusContext.Provider focusable={ false }
                        value=''
                      >
                        <div className={ showKeyboard ? 'SeriesDetailPage__loaderWithKeyboard' : 'SeriesDetailPage__loaderWithOutKeyboard' }>
                          <Image
                            src={ loaderPath }
                          />
                        </div>
                      </FocusContext.Provider>
                    )
                    }
                    { episodeListData.length > 0 && (
                      <EpisodesMediaCards
                        episodeListData={ episodeListData }
                        loadAllEpisodeListData={ filterRail( loadAllEpisodeListData ) }
                        loadMore={ loadMore }
                        pageNumber={ pageNumber }
                        filterRail={ filterRail }
                        selectedSeason={ selectedSeason }
                        showKeyboard={ showKeyboard }
                        inputValue={ inputValue }
                        masterRating={ contentInfoResponse && contentInfoResponse.data && contentInfoResponse.data.meta && contentInfoResponse.data.meta.masterRating }
                        setShowNotification={ setShowNotification }
                        setNotificationMessage={ setNotificationMessage }
                        setNotificationIcon={ setNotificationIcon }
                      />
                    ) }
                  </div>
                </div>
              </div>
            </FocusContext.Provider>
            { showNotification &&
            <div className='DeviceManagementPage__notification'>
              <Notifications
                iconName={ notificationMessage ? notificationIcon : '' }
                message={ notificationMessage || constants.MY_ACCOUNT.CHARACTER_LIMIT }
              />
            </div>
            }
          </div>
        ) }
    </>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} alphanumericKeyboardProp - set the alphanumericKeyboardProp details
 */
export const propTypes = {
  alphanumericKeyboardProp: PropTypes.object
};

SeriesDetailPage.propTypes = propTypes;

export default SeriesDetailPage;