/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */

/**
 * Application home page consisting of left naviagtion, hero banner and different kind of rails
 *
 * @module views/components/Home
 * @memberof -Common
 */
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useFocusable, FocusContext, setThrottle, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import Carousel from '../Carousel/Carousel';
import serviceConst from '../../../utils/slayer/serviceConst';
import { LAYOUT_TYPE, SECTION_SOURCE, SECTION_TYPE, RAIL_POSITION, constants, PAGE_TYPE, LANGUAGE_JOURNEY, COMMON_HEADERS, PACKS, VIEDO_LANGAUGE_VERBIAGES, CONTENT_TYPE, MIXPANEL_CONTENT_TYPE, APPLETV, isTizen } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import PropTypes from 'prop-types';
import { AssignedVariant, BingeListCall, HomeService, HorizontalFetchRailContent, UcBrowseByApps } from '../../../utils/slayer/HomeService';
import Notifications from '../Notifications/Notifications';
import BannerComponent from '../BannerComponent/BannerComponent';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { checkSectionSource, cloudinaryCarousalUrl, getRecommendationTitle, isNudgeVisible, modalDom, setMixpanelData, isPromoVisible, homePageRMNSubscribed, MIXPANEL_RAIL_TYPE, handleErrorMessage, compositeDummyDemoData, compositeDummyDemoData2, titleRailDummyData4, compositeDummyDemoData3 } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { getLoginMsg, getLoginIcon, removeLoginIcon, removeLoginMsg, getLogtoutMsg, removeLogoutMsg, getLogoutIcon, removeLogoutIcon, getAnonymousId, getAuthToken, setAllLoginPath, getProductName, setPageNumberPagination, setLastFocusedSynopsisID, getPrefferedLanguageGuest, setMixedRailData, getMixedRailData, setPiLevel, getUserSelectedApps, getSubscriberId, getProfileId, setProductName, setAppEnv, removeAppleToastInfo, getAppleToastInfo, setSelectedPartner, setChipData } from '../../../utils/localStorageHelper';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { MediaCarouselService } from '../../../utils/slayer/MediaCarouselService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { BingeListContentCallService, AppRailContentCallService, RecentlyWatchedAPICallService, RecommendedGenreService, RecommendedLangService, TAHeroBannerService, chipRailAPICallService, TAChipListReccoCallService } from '../../../utils/slayer/RecommendedLangService';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import HomeMediaCarousel from '../HomeMediaCarousel/HomeMediaCarousel';
import { leftMenuClick, rail_chip_click } from '../../../utils/mixpanel/mixpanelService';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import Image from '../Image/Image';
import './Home.scss';
import { RecentlyWatchedAPICall, BoxSubSet } from '../../../utils/slayer/PlaybackInfoService';
import HomeSynopsis from '../Synopsis/HomeSynopsis';
import { useCheckSum } from '../../../utils/slayer/useCheckSum';
import classNames from 'classnames';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import { checkAppleStatusExist, getRailTypeOnHome } from '../../../utils/commonHelper';
import { DeviceLastActivityService } from '../../../utils/slayer/DeviceManagementService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
/**
  * @method checkContentType
  * @summary Method to check the content type
  * @param {object} items - rail items
  */

/**
  * Represents a Home component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Home
  */
export const Home = function( props ){
  const { customPageType, isExpandedMenu, isFav, setIsFav, isCWRail, setIsCWRail, isTvod, setIsTvod, isPageClicked, setIspageClicked, setIsValidCheckSum, contentInfo, setContentInfo, defaultPageType } = useHomeContext()
  const [isError, setIsError] = useState( false );
  const [showSynopsis, setShowSynopsis] = useState( true );
  const [railSectionSource, setRailSectionSource] = useState( false );
  const [animationStart, setAnimationStart] = useState( false )
  const [hasMore, setHasMore] = useState( true );
  const [shuffleSynopsis, setShuffleSynopsis] = useState( false )
  const [railItems, setRailItems] = useState( [] );
  const [shuffleData, setShuffleData] = useState( [] )
  const [hideNotification, setHideNotification] = useState( true );
  const [caroselPageView, setCaroselPageView] = useState( true );
  const [railFocusedCardInfo, setRailFocusedCardInfo] = useState()
  const [chipLoaderState, setChipLoaderState] = useState( false )
  const { responseData, loading: currentLoading, response: currentResponse, error: currentError, setBingeListRecord } = useSubscriptionContext( );
  const { myPlanProps, packName } = useMemo( () => {
    const myPlanProps = responseData?.currentPack;
    const packName = myPlanProps?.upgradeMyPlanType || PACKS.FREEMIUM;
    return { myPlanProps, packName };
  }, [responseData] );
  const { railsRestoreId, lastFocusFrom, setLastFocusFrom, shuffleIndex, setshuffleIndex, homeDonglePageData, searchKeyBoardLastFocuskey, catalogPage, fromConfirmPurchase, availableProvidersList, donglePageData, topPositionRailValueContext, selectedGenreItem, selectedLaungueItem, storeRailData, bbaSelectedItem, setBBASelectedItem, setBbaContents, bbaContents, flexiPlanVerbiagesContext } = useMaintainPageState() || null
  const [isHomeLoaded, setIsHomeLoaded] = useState( false )
  const preferredLanguageGuest = useMemo( () => {
    return getPrefferedLanguageGuest();
  }, [] );
  const [pageData, setPageData] = useState( {
    pageLimit: 10,
    pageOffset: 0,
    Subscribed: !homePageRMNSubscribed( packName ),
    UnSubscribed: homePageRMNSubscribed( packName ),
    packName: packName
  } );
  const [notificationData, setNotificationData] = useState( {
    iconName: '',
    message: ''
  } );
  const currentsectionRef = useRef( null )
  const [showLoader, setShowLoader] = useState( true )
  const [isKeyReleased, setIsKeyReleased] = useState( true );
  const keyPressedCount = useRef( 0 );
  const pressedKey = useRef( null );
  const { sidebarList } = useHomeContext()
  const tvodContent = useRef( [] )
  const hasCaroselRef = useRef( false )
  const onShuffleClick = useRef( 0 )
  const homeRef = useRef( null );
  const homeCarouselRef = useRef( null );
  const horizontalId = useRef( null );
  const browseByAppRef = useRef( null );
  const promoBannerRef = useRef( null );
  const [ucContentList, setUcContentList] = useState( [] )
  const { filterData, filterRail } = useContentFilter()
  const previousPathName = useNavigationContext();
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const taHeroBanner = useMemo( () => get( config, 'taHeroBanner' ), [config] );
  const [iconbingList, setIconBingeList] = useState( )
  const [activeRailSelections, setActiveRailSelections] = useState( {} );

  const metaData = useMemo( () => get( contentInfo, 'data', {} ), [contentInfo] );
  const contractName = useMemo( () => get( contentInfo, 'data.detail', {} ), [contentInfo] );
  const { trailor_url, setTrailor_url } = usePlayerContext()
  const { sectionType } = serviceConst;
  const sectionBannerType = useMemo( () => railItems?.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER ), [railItems] );
  const isNewHeroBannerEnabled = useMemo( () => get( config, 'cms_constant.isNewHeroBannerEnabled' ), [config] );
  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: false,
    focusKey:'HOME_CONTAINER'
  } );
  const pagetype = useMemo( () => {
    return customPageType || defaultPageType;
  }, [customPageType, defaultPageType] );
  const [data, tvodData] = HomeService( { pageData, pageType: pagetype, skip: true, productName: getProductName() } );
  const { fetchData, response, loading, error } = data;
  const { tvodFetchData, tvodResponse } = tvodData;
  const contentList = useMemo( () => filterData( railItems.filter( item => {
    if( preferredLanguageGuest ){
      return ( item.sectionType !== SECTION_TYPE.HERO_BANNER && item.sectionSource !== SECTION_SOURCE.LANGUAGE_NUDGE )
    }
    else {
      return item.sectionType !== SECTION_TYPE.HERO_BANNER
    }
  } ) ), [railItems, availableProvidersList.current, preferredLanguageGuest] );

  const recordList = useMemo( () => {
    return contentList.filter( item => ( item.contentList?.length > 0 ) || ( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && item.chipList?.length > 0 ) || ( item.sectionSource === SECTION_SOURCE.SHUFFLE_RAIL && item.shuffleList?.length > 0 ) || ( isNudgeVisible( item ) ) || isPromoVisible( item ) )
  }, [railItems, availableProvidersList.current] );
  const taHeroBannerObj = useMemo( () => taHeroBanner?.find( item => item.pageType === pagetype || item.pageType === '' ), [taHeroBanner, pagetype] );
  const nonDiscoverPages = useMemo( () => (
    ['/Search', '/Account', '/binge-list', '/login', '/plan/current', '/Account-Login']
  ), [] );
  const HerBannerContentList = useMemo( () => filterData( railItems.filter( item => item.sectionType === SECTION_TYPE.HERO_BANNER ) ), [railItems, availableProvidersList.current] );
  const newHeroBanner =  useMemo( () => HerBannerContentList?.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER && item.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW ), [railItems, pagetype] ) || null;
  const oldHeroBanner = useMemo( () => HerBannerContentList?.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER && item.sectionSource === SECTION_SOURCE.EDITORIAL ), [railItems, pagetype] ) || null;
  const selectedHeroBanner = useMemo( () => {
    if( newHeroBanner && oldHeroBanner ){
      return isNewHeroBannerEnabled ? newHeroBanner : oldHeroBanner;
    }
    else if( newHeroBanner ){
      return isNewHeroBannerEnabled ? newHeroBanner : null;
    }
    else if( oldHeroBanner ){
      return oldHeroBanner;
    }
    return null;
  }, [newHeroBanner, oldHeroBanner, isNewHeroBannerEnabled] );

  const setShuffleCurrent = () => {} // Dummy function to avoid rerender
  const [recentlyWatchedData] = RecentlyWatchedAPICall()
  const { recentlyWatchedFetchData, recentlyWatchedResponse, recentlyWatchedError, recentlyWatchedLoading } = recentlyWatchedData

  const [bingeListData] = BingeListCall()
  const { bingeListFetchData, bingeListResponse, bingeListError, bingeListLoading } = bingeListData

  const [horizontalFetchContent] = HorizontalFetchRailContent()
  const { horizontalFetchData, horizontalResponse } = horizontalFetchContent

  const [ucBrowseByAppsData] = UcBrowseByApps()
  const { ucBrowseByAppsFetchData, ucBrowseByAppsResponse, ucBrowseByAppsLoading } = ucBrowseByAppsData

  const [deviceLastActivity] = DeviceLastActivityService();
  const { deviceLastActivityFetchData } = deviceLastActivity

  const { getEncryptionKey } = useCheckSum()

  const [boxSubSetObj] =  BoxSubSet( null, true, true )
  const { boxSubSetFetch, boxSubSetResponse } = boxSubSetObj;

  const validateChecksum = ( currentSubscription ) => {
    const encrptionKey =  getEncryptionKey( currentSubscription )
    return encrptionKey === myPlanProps?.checkSum
  }


  const appleToastMessage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )

  const handleIconAndMessageChange = ( { iconName, message } ) => {
    setHideNotification( false )
    setIconBingeList( true )
    setNotificationData( { iconName, message } );
    setTimeout( () => {
      setHideNotification( true );
      setIconBingeList( false )
    }, 3000 );
  };

  // API call for selected chip content
  const fecthSelectedChipContent = async( selectedChipData ) => {
    setChipLoaderState( true )
    try {
      const responseData = await chipRailAPICallService( null, selectedChipData );
      setChipLoaderState( false )
      return responseData;
    }
    catch ( error ){
      console.error( 'selectedChipData99-error:', error );
    }
  }


  const handleChipSelection = useCallback( async( railId, selectedContent, indexPosition, sectionSource )=>{
    let response = null
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      if( homeDonglePageData.current ){
        homeDonglePageData.current = {}
      }
      // console.log( `[${( performance.now() / 1000 ).toFixed( 2 )} sec] #logSequence-1:`, selectedContent );
      response = await fecthSelectedChipContent( selectedContent )
      if( response !== undefined ){
        const selectedModifiedChip = { ...selectedContent, appContentList: response?.data?.data?.contentList, totalRecordsOfSelectedChip : response?.data?.data?.totalCount }
        const firstCardOnChipListData = response?.data?.data?.contentList[0] || {}
        const boxSubsetApiParams = {
          contentType:firstCardOnChipListData?.contentType,
          id: firstCardOnChipListData?.id
        }
        if( firstCardOnChipListData && Object.keys( firstCardOnChipListData ).length > 0 ){
          homeDonglePageData.current = firstCardOnChipListData
          boxSubSetFetch( boxSubsetApiParams )
          setActiveRailSelections( prevState => ( {
            ...prevState,
            [railId]: {
              content: sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? selectedModifiedChip : selectedContent,
              selectedIndex: indexPosition
            }
          } ) );
          setTrailor_url( firstCardOnChipListData?.trailerUrl );
        }
        else {
          homeDonglePageData.current = null
          setActiveRailSelections( prevState => ( {
            ...prevState,
            [railId]: {
              content: [],
              selectedIndex: indexPosition
            }
          } ) );
          setContentInfo( null )
          setTrailor_url( null );
        }
        // console.log( `[${( performance.now() / 1000 ).toFixed( 2 )} sec] #logSequence-2:`, response?.data?.data?.contentList );
      }

    }
    else {
      setActiveRailSelections( prevState => ( {
        ...prevState,
        [railId]: {
          content: selectedContent,
          selectedIndex: indexPosition
        }
      } ) );
    }
  }, [] );

  useEffect( () => {
    if( boxSubSetResponse ){
      setContentInfo( boxSubSetResponse )
      if( homeDonglePageData.current ){
        homeDonglePageData.current.description = boxSubSetResponse.data?.description
        homeDonglePageData.current.previewImage = boxSubSetResponse.data?.previewImage
        homeDonglePageData.current.contractName = boxSubSetResponse.data?.contractName
      }
    }
  }, [boxSubSetResponse] )

  useEffect( () => {
    if( myPlanProps && myPlanProps.productId ){
      const isValid = validateChecksum( myPlanProps )
      setIsValidCheckSum( true ) // TODO: need to set isvalid param to setIsValidCheckSum in next release, reverting for Jan release
    }
  }, [myPlanProps] )



  useEffect( ()=>{
    if( ucBrowseByAppsResponse && !ucBrowseByAppsLoading ){
      setUcContentList( ucBrowseByAppsResponse?.data?.contentList )
    }
  }, [ucBrowseByAppsResponse, ucBrowseByAppsLoading] )


  const bbaProvider = useMemo( () => {
    return bbaContents?.bbaDetailUrl?.provider
  }, [bbaContents] )

  useEffect( ()=>{
    if( bbaProvider ){
      setSelectedPartner( bbaProvider.toUpperCase() )
    }
  }, [bbaProvider] )

  const appendRecommendationDataWithMixedRail = async( { title, contentList } ) => {
    const data = getMixedRailData()
    const value = data && data.find( info=>info.title === title );

    // If no matching rail config found, exit early
    if( !value || !Object.keys( value ).length ){
      return;
    }
    if( value && Object.keys( value ).length ){
      const selectedRail = railItems.findIndex( record => record.title === title )
      const promises = []
      promises.push( MediaCarouselService( value.placeHolder, value.layoutType ) );
      if( promises.length > 0 ){
        await Promise.allSettled( promises ).then( results => {
          results.map( ( result, idx ) => {
            if( result.value.data.code === 0 ){
              const data = result.value.data.data.contentList
              const convertedResponse = data.map( d=>{
                return {
                  ...d,
                  id: parseInt( d.id, 10 )
                }
              } )
              railItems[selectedRail].contentList = filterRail( contentList.concat( convertedResponse ) )
              railItems[selectedRail].totalCount = railItems[selectedRail].contentList.length
              setRailItems( [...railItems] )
              setMixedRailData( [] )
            }
            else {
              setMixedRailData( [] )
            }
          } )
        } ).catch( err => {
          setMixedRailData( [] )
        } )
      }
    }
  }

  useEffect( ()=>{
    if( horizontalResponse && horizontalResponse.code === 0 && horizontalResponse.data && horizontalId.current ){
      const selectedRail = railItems?.findIndex( record => record.id === horizontalId.current )
      if( selectedRail === -1 ){
        return;
      }
      railItems[selectedRail].contentList = railItems[selectedRail].sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ? railItems[selectedRail]?.contentList?.concat( horizontalResponse?.data?.contentList ) : filterRail( railItems[selectedRail]?.contentList?.concat( horizontalResponse?.data?.contentList ) )
      railItems[selectedRail].isEndReached = horizontalResponse.data.contentList?.length === 0
      railItems[selectedRail].originalContentListLength = ( railItems[selectedRail].originalContentListLength || 0 ) + ( horizontalResponse.data.contentList?.length || 0 )
      setRailItems( [...railItems] )
      horizontalId.current = null
    }
  }, [horizontalResponse] )

  useEffect( () => {
    if( isTvod ){
      tvodFetchData()
    }
  }, [isTvod] )

  useEffect( () => {
    if( isFav ){
      bingeListFetchData()
    }
  }, [isFav] )

  useEffect( () => {
    if( isCWRail ){
      setTimeout( () => {
        recentlyWatchedFetchData()
      }, 1000 ) // Added 1 sec delay to update CW rail for Sunnxt contents on 1st time
    }
  }, [isCWRail] )

  useEffect( () =>{
    if( recentlyWatchedResponse && railItems.length > 0 ){
      setIsCWRail( false )
      const continueWatchlistIndex = railItems.findIndex( item => item.sectionSource === SECTION_SOURCE.CONTINUE_WATCHING )
      if( continueWatchlistIndex >= 0 && recentlyWatchedResponse && recentlyWatchedResponse.data ){
        railItems[continueWatchlistIndex].contentList = recentlyWatchedResponse.data?.contentList || []
        railItems[continueWatchlistIndex].railType = MIXPANEL_RAIL_TYPE.CONTINUE_WATCHING
        setRailItems( [...railItems] )
      }
    }
  }, [recentlyWatchedResponse] )

  useEffect( () =>{
    if( bingeListResponse && railItems.length > 0 && isFav ){
      if( bingeListResponse.data?.list ){
        setBingeListRecord( bingeListResponse.data.list )
      }
      setIsFav( false );
      const bingeListIndex = railItems.findIndex( item => item.sectionSource === SECTION_SOURCE.WATCHLIST )
      if( bingeListIndex >= 0 && bingeListResponse && bingeListResponse.data ){
        const bingeList = bingeListResponse.data?.list?.map( ( item )=>{
          return { ...item, id:item.contentId };
        } )
        railItems[bingeListIndex].contentList = bingeList || []
        railItems[bingeListIndex].originalContentListLength = bingeList.length || 0
        railItems[bingeListIndex].pagingState = bingeListResponse.data.pagingState
        railItems[bingeListIndex].isEndReached = bingeListResponse.data.list?.length === 0
        setRailItems( [...railItems] )
      }
    }
    else if( bingeListResponse && railItems.length > 0 && horizontalId.current ){
      const selectedRail = railItems.findIndex( record => record.id === horizontalId.current )
      const arrayUniqueByKeyId = bingeListResponse.data.list.map( ( item )=>{
        return { ...item, id: item.contentId };
      } )
      const contentList = filterRail( railItems[selectedRail]?.contentList?.concat( arrayUniqueByKeyId ) )
      railItems[selectedRail].contentList = contentList
      railItems[selectedRail].isEndReached = bingeListResponse.data.list?.length === 0
      railItems[selectedRail].originalContentListLength = contentList.length
      railItems[selectedRail].pagingState = bingeListResponse.data.pagingState
      setRailItems( [...railItems] )
      horizontalId.current = null
    }
  }, [bingeListResponse] )


  const onRailFocus = useCallback( ( { y }, rail ) => {

    const appRailFocus = checkSectionSource( rail );
    let defaultScrollValue = 0;

    if( ref.current ){
      let yAxis = y === 0 ? y : y + 1;

      if( appRailFocus ){
        defaultScrollValue = 100;
        yAxis = y - 400; // Fixed height scroll adjustment
      }

      try {
        switch ( rail.sectionSource ){
          case SECTION_SOURCE.PROVIDER_BROWSE_APPS:
            browseByAppRef.current?.scrollIntoView( { block: 'nearest' } );
            break;

          case SECTION_SOURCE.PROMO_BANNER:
            if( promoBannerRef.current ){
              ref.current.scrollTo( { top: y - 160 } );
            }
            break;

          case SECTION_SOURCE.BINGE_CHIP_RAIL:
            ref.current.scrollTo( { top: y + 30 } );
            break;

          default:
            ref.current.scrollTo( { top: yAxis } );
            break;
        }
      }
      catch ( e ){
        ref.current.scrollTop =
          rail.sectionSource === SECTION_SOURCE.PROMO_BANNER ?
            y - 160 :
            yAxis;
      }
    }
    setCaroselPageView( false );
    setRailSectionSource( ( document.querySelector( '.Synopsis' ) === null && ( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL || rail.sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ) ) ? !appRailFocus : appRailFocus );
    topPositionRailValueContext.current = ref.current.scrollTop + defaultScrollValue;
    currentsectionRef.current = rail.sectionSource;
    if( !appRailFocus ){
      setShuffleCurrent( false );
    }
  }, [ref] );


  const loadMore = () => {
    railsRestoreId.current = null;
    const tempPageData = { ...pageData, pageOffset: railItems.length };
    setPageData( { ...tempPageData } );
    fetchData( { params: tempPageData } );
  }

  const fetchHorizontalContent = useCallback( ( id, originalContentListLength, { sectionSource, pagingState } ) => {
    horizontalId.current = id
    let params = {}
    if( sectionSource === SECTION_SOURCE.WATCHLIST ){
      params = {
        'subscriberId': getSubscriberId(),
        'profileId': getProfileId(),
        'pagingState': pagingState
      }
      bingeListFetchData( { params: params } );
    }
    else {
      params = {
        'id': id,
        'limit': 20,
        'offset': originalContentListLength,
        'platform':COMMON_HEADERS.PLATFORM
      }
      horizontalFetchData( { params: params } );
    }
  }, [contentList] )

  // const countRef = useRef( 0 ) // Need To Remove // Need To Check


  const getMergeRecommendationData = useCallback( async( data, ucContentList ) => {
    const items = data.items || [];
    const promises = [];
    const recoIdxArr = [];
    if( !isHomeLoaded ){
      recoIdxArr.unshift( {
        index: 0,
        title:sectionType.HERO_BANNER
      } )
      promises.push( TAHeroBannerService( taHeroBannerObj?.placeHolder, customPageType, taHeroBannerObj?.count ) );
    }

    if( items.length ){
      items.map( ( item, index ) => {
        if( item.sectionSource === SECTION_SOURCE.LANGUAGE ){
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource
          } );
          promises.push( RecommendedLangService( ) );
        }
        else if( item.sectionSource === SECTION_SOURCE.PROVIDER ){
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource
          } );
          promises.push( AppRailContentCallService( item ) );
        }
        else if( item.sectionSource === SECTION_SOURCE.GENRE ){
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource
          } );
          promises.push( RecommendedGenreService() );
        }
        else if( item.sectionSource === SECTION_SOURCE.RECOMMENDATION && ( item.contentList.length === 0 || item.contentList.length === item.totalCount ) ){
          recoIdxArr.push( {
            index: index,
            recoPosition: item.recommendationPosition,
            title: item.title
          } );
          let matchingAppNames = '';
          if( item.placeHolder ){
            const indexStr = item.placeHolder.split( '_' ).pop();
            const placeHolderIndex = parseInt( indexStr, 10 );
            if( !isNaN( placeHolderIndex ) && ucContentList ){
              const appData = ucContentList[placeHolderIndex - 1];
              matchingAppNames = appData?.title ?? null;
            }
          }
          promises.push( MediaCarouselService( item.placeHolder, item.layoutType, matchingAppNames ) );
        }
        else if( item.sectionSource === SECTION_SOURCE.RECOMMENDATION && ( item.contentList.length < item.totalCount ) ){
          item.mixedRail = true;
          const data = []
          data.push( {
            layoutType: item.layoutType,
            placeHolder: item.placeHolder,
            title: item.title
          } )
          setMixedRailData( data )
        }
        else if( item.sectionSource === SECTION_SOURCE.CONTINUE_WATCHING && getAuthToken() ){
          recoIdxArr.push( {
            index: index,
            title: item.title
          } );
          promises.push( RecentlyWatchedAPICallService( ) );
        }
        else if( item.sectionSource === SECTION_SOURCE.WATCHLIST && getAuthToken() ){
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource
          } );
          promises.push( BingeListContentCallService() );
        }
        else if( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource,
            railId: item.id,
            chipConfigurationType: item.chipConfigurationType
          } );
          if( item.chipConfigurationType === SECTION_SOURCE.RECOMMENDATION ){
            const callBack = TAChipListReccoCallService( item )
              .then( res => {
                const taChipList = res?.data?.data?.chipList.slice( 0, item?.taChipCount ).map( ( chip, chipIndex ) => {
                  return {
                    ...chip,
                    chipId: `${item.id || ''}_CHIP_${chipIndex + 1}`,
                    chipIndex: chipIndex + 1
                  };
                } );
                item['chipList'] = taChipList || [];
                return chipRailAPICallService( item ); // Return promise for chaining
              } );
            promises.push( callBack );
          }
          else if( item.chipConfigurationType === SECTION_SOURCE.EDITORIAL ){
            promises.push( chipRailAPICallService( item ) );
          }
        }
      } );

      if( promises.length > 0 ){
        await Promise.allSettled( promises ).then( results => {
          results.map( ( result, idx ) => {
            if( result.status === 'fulfilled' ){
              if( recoIdxArr[idx].title === SECTION_SOURCE.LANGUAGE ){
                if( results[idx].value?.data?.data?.contentList?.length > 0 ){
                  let languageArray = items.find( item => item.sectionSource === SECTION_SOURCE.LANGUAGE )
                  const languageRecArray = [];
                  const contentListArray = results[idx].value.data.data.contentList || []
                  contentListArray?.forEach( recLang => {
                    const remainingItems = languageArray.contentList?.find( item => item.title === recLang );
                    if( remainingItems ){
                      languageRecArray.push( remainingItems )
                    }
                  } );
                  languageArray = [...new Set( languageArray.contentList?.filter( item => !contentListArray.includes( item.title ) ) )];
                  items.map( ( item ) => {
                    if( item.sectionSource === SECTION_SOURCE.LANGUAGE ){
                      // eslint-disable-next-line no-param-reassign
                      item['contentList'] = languageRecArray.concat( languageArray );
                      return item;
                    }
                    return item;
                  } )
                }
              }
              else if( recoIdxArr[idx].title === SECTION_SOURCE.GENRE ){
                if( results[idx].value?.data?.data?.contentList?.length > 0 ){
                  let genreArray = items.find( item => item.sectionSource === SECTION_SOURCE.GENRE )
                  const genreRecArray = [];
                  results[idx].value?.data?.data?.contentList?.forEach( recGenre => {
                    const remainingItems = genreArray.contentList?.find( item => item.title?.toLowerCase() === recGenre.toLowerCase() );
                    if( remainingItems ){
                      genreRecArray.push( remainingItems )
                    }
                  } );
                  genreArray = [...new Set( genreArray.contentList?.filter( item => !results[idx].value?.data?.data?.contentList?.includes( item.title ) ) )]
                  items.map( ( item ) => {
                    if( item.sectionSource === SECTION_SOURCE.GENRE ){
                      // eslint-disable-next-line no-param-reassign
                      item['contentList'] = [...new Set( genreRecArray.concat( genreArray ) )];
                      return item;
                    }
                    return item;
                  } )
                }
              }
              else if( recoIdxArr[idx].title === SECTION_SOURCE.WATCHLIST ){
                if( results[idx].value?.data?.data?.list?.length > 0 ){
                  items.map( ( item ) => {
                    if( item.sectionSource === SECTION_SOURCE.WATCHLIST ){
                      const key = 'contentId';
                      const arrayUniqueByKey = results[idx].value?.data?.data?.list.length > 0 ? [...new Map( results[idx].value?.data?.data?.list.map( item =>
                        [item[key], item] ) ).values()] : [];
                      const arrayUniqueByKeyId = arrayUniqueByKey.map( ( item )=>{
                        return { ...item, id:item.contentId };
                      } )
                      // eslint-disable-next-line no-param-reassign
                      item['contentList'] = arrayUniqueByKeyId;
                      item['originalContentListLength'] = arrayUniqueByKeyId.length;
                      item['totalCount'] = results[idx].value?.data?.data?.totalBingeListCount;
                      item['pagingState'] = results[idx].value?.data?.data?.pagingState;
                      return item;
                    }
                    return item;
                  } )
                }
              }
              else if( recoIdxArr[idx].title === SECTION_SOURCE.BINGE_CHIP_RAIL ){
                const targetRailId = recoIdxArr[idx].railId;
                items.map( ( item ) => {
                  if( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && item.id === targetRailId ){
                    item['chipList'] = item['chipList']?.map( ( chip, chipIndex ) => {
                      return {
                        ...chip,
                        chipRailId: item.id,
                        appContentList: chipIndex === 0 ? results[idx].value?.data?.data?.contentList || [] : [],
                        totalRecordsOfSelectedChip: results[idx].value?.data?.data?.totalCount,
                        isSelected: chipIndex === 0,
                        indexPosition: chipIndex,
                        taChipUseCase: item.taChipUseCase || '',
                        taContentUseCase: item.taContentUseCase || '',
                        layoutType: item.layoutType || '',
                        chipConfigurationType: item.chipConfigurationType || '',
                        pagetype: item.pageType || ''
                      };
                    } );
                  }
                  return item;
                } );
              }
              else if( recoIdxArr[idx].title === SECTION_SOURCE.PROVIDER ){
                if( results[idx].value?.data?.data?.contentList.length > 0 ){
                  items.map( ( item ) => {
                    if( item.sectionSource === SECTION_SOURCE.PROVIDER ){
                      // eslint-disable-next-line no-param-reassign
                      const uniqueItems = item['contentList'].concat( results[idx].value.data.data.contentList );
                      const unique = [...new Map( uniqueItems.map( item =>
                        [item['id'], item] ) ).values()];
                      item['contentList'] = unique;
                      return item;
                    }
                    return item;
                  } )
                }
              }
              else if( recoIdxArr[idx].title === sectionType.HERO_BANNER ){
                // setShowLoader( false )
                setIsHomeLoaded( true )
                const heroBannerTA = results[idx].value?.data?.data?.contentList?.map( v => ( { ...v, isRecommendation: true } ) )
                if( heroBannerTA?.length > 0 ){
                  hasCaroselRef.current = true
                  const hero_banner = items?.find( ( data ) => data.sectionType === sectionType.HERO_BANNER )
                  if( hero_banner ){
                    items.map( ( item ) => {
                      if( item.sectionType === sectionType.HERO_BANNER ){
                        // eslint-disable-next-line no-param-reassign
                        item['contentList'] = item['contentList'].concat( heroBannerTA );
                        return item;
                      }
                      return item;
                    } )
                  }
                  else {
                    const heroBanner = {
                      sectionType: sectionType.HERO_BANNER,
                      contentList: heroBannerTA
                    }
                    railItems.push( heroBanner )
                    setRailItems( [...railItems] )
                  }
                }
              }
              else {
                const recoRailPosInHomeData = recoIdxArr[idx].index;
                const languageType = result.value?.data?.data?.languageType
                const genreType = result.value?.data?.data?.genreType
                const appName = result.value?.data?.data?.appName
                const railSubTitle = result.value?.data?.data?.railSubTitle
                const IdUpatedList = result.value?.data?.data?.contentList?.map( ( item, index )=>{
                  return { ...item, id: Number( item.id ) }
                } )
                const recoData = IdUpatedList || [];
                if( recoIdxArr[idx].recoPosition === RAIL_POSITION.PREPEND ){
                  items[recoRailPosInHomeData].originalContentListLength = items[recoRailPosInHomeData].contentList.length
                  const contentListData = [...items[recoRailPosInHomeData].contentList, ...recoData]
                  const uniqContentListData = contentListData.filter( ( item, index, array ) => index === array.findIndex( ( t ) => t.id === item.id ) )
                  items[recoRailPosInHomeData].contentList = uniqContentListData
                  items[recoRailPosInHomeData].totalCount = uniqContentListData.length
                  items[recoRailPosInHomeData].title = getRecommendationTitle( items, recoRailPosInHomeData, languageType, genreType, appName )
                  items[recoRailPosInHomeData].railType = MIXPANEL_RAIL_TYPE.RECOMMENDED
                  items[recoRailPosInHomeData].railSubTitle = railSubTitle
                  items[recoRailPosInHomeData].appName = appName
                }
                else {
                  items[recoRailPosInHomeData].originalContentListLength = items[recoRailPosInHomeData].contentList.length
                  const contentListData = [...items[recoRailPosInHomeData].contentList, ...recoData]
                  const uniqContentListData = contentListData.filter( ( item, index, array ) => index === array.findIndex( ( t ) => t.id === item.id ) )
                  items[recoRailPosInHomeData].contentList = uniqContentListData
                  items[recoRailPosInHomeData].totalCount = uniqContentListData.length
                  items[recoRailPosInHomeData].title = getRecommendationTitle( items, recoRailPosInHomeData, languageType, genreType, appName )
                  items[recoRailPosInHomeData].railType = MIXPANEL_RAIL_TYPE.RECOMMENDED
                  items[recoRailPosInHomeData].railSubTitle = railSubTitle
                  items[recoRailPosInHomeData].appName = appName
                }
              }
              const heroBannerObj = [...railItems, ...items].find( obj => obj.sectionType === 'HERO_BANNER' )
              if( heroBannerObj && heroBannerObj.contentList?.length > 0 ){
                hasCaroselRef.current = true
              }
            }
            if( idx === promises.length - 1 ){
              if( pageData.pageOffset > 0 ){
                setShowLoader( false )
              }
              const newItems = items.map( v => ( { ...v, originalContentListLength: v.originalContentListLength || v.contentList.length } ) )
              const uniqueRailData = filterdUniqueRailsData( railItems, newItems )
              setRailItems( uniqueRailData )
              setPageData( {
                ...pageData,
                pageOffset: parseInt( data.offset, 10 ),
                totalItems: parseInt( data.total, 10 )
              } );
              setHasMore( parseInt( data.offset, 10 ) < parseInt( data.total, 10 ) )
            }
          } )
        } )
      }
      else {
        if( pageData.pageOffset > 0 ){
          setShowLoader( false )
        }
        const newItems = items.map( v => ( { ...v, originalContentListLength: v.originalContentListLength || v.contentList.length } ) )
        const uniqueRailData = filterdUniqueRailsData( railItems, newItems )
        setRailItems( uniqueRailData )
        setPageData( {
          ...pageData,
          pageOffset: parseInt( data.offset, 10 ),
          totalItems: parseInt( data.total, 10 )
        } );
        setHasMore( parseInt( data.offset, 10 ) < parseInt( data.total, 10 ) )
      }
      if( pageData.pageOffset > 0 ){
        setShowLoader( false )
      }
      const newItems = items.map( v => ( { ...v, originalContentListLength: v.originalContentListLength || v.contentList.length } ) )
      const filterReccoChipRail = newItems.filter( ( item ) => {
        if( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && item.chipConfigurationType === SECTION_SOURCE.RECOMMENDATION ){
          const renderRecochipRail = item?.chipList[0]?.appContentList?.length !== 0
          return renderRecochipRail && item
        }
        else {
          return item
        }
      } )
      const uniqueRailData = filterdUniqueRailsData( railItems, filterReccoChipRail )
      setRailItems( uniqueRailData )
      setPageData( {
        ...pageData,
        pageOffset: parseInt( data.offset, 10 ),
        totalItems: parseInt( data.total, 10 )
      } );
      setHasMore( parseInt( data.offset, 10 ) < parseInt( data.total, 10 ) )
    }
    else if( railItems.length === 0 ){
      setShowLoader( true )
      Promise.allSettled( promises ).then( results => {
        if( results.length > 0 ){
          if( results[0].value?.data?.data?.contentList?.length > 0 ){
            const heroBanner = {
              sectionType: sectionType.HERO_BANNER,
              contentList: results[0].value?.data?.data?.contentList
            }
            railItems.push( heroBanner )
            setRailItems( [...railItems] )
            hasCaroselRef.current = true
          }
          else {
            setRailItems( [] )
            setShowLoader( false )
            setIsError( true )
          }
        }

      } )
    }
  }, [isHomeLoaded, customPageType, pageData, railItems, ucContentList] )

  const filterdUniqueRailsData = ( existingData, newData ) => {
    const existingIds = new Set( existingData.map( item => item.id ) );

    const combinedData = [...existingData];
    newData.forEach( item => {
      if( !existingIds.has( item.id ) ){
        combinedData.push( item );
      }
    } );

    return combinedData;
  };

  const fetchHomePageData = ( type ) => {
    const params = {
      pageLimit: 10,
      pageOffset: 0,
      Subscribed: !homePageRMNSubscribed( type ),
      UnSubscribed: homePageRMNSubscribed( type ),
      packName: type,
      ...( !!getUserSelectedApps() && {
        allowBingeRepositioning: true,
        userSelectedApps: getUserSelectedApps()
      } )
    }
    setPageData( params )
    fetchData( { params: params } );
  }

  useEffect( () => {
    if( response?.data && !loading ){
      const data = response.data || {};
      async function fetchRecommendationFn(){

        await getMergeRecommendationData( data, ucContentList );
        setShowLoader( false )
      }
      fetchRecommendationFn()
    }
    else if( response ){
      if( railItems.length > 0 ){
        setShowLoader( false )
      }
      if( !isExpandedMenu && window.location.pathname.includes( PAGE_TYPE.HOME ) && !modalDom() ){
        setTimeout( ()=> focusSelf() )
      }
    }
  }, [response, loading] );

  useEffect( () => {
    setAppEnv( process.env.REACT_APP_NODE_ENV )
    setPiLevel( 0 )
    console.log( '#new launch, build 20 Nov 5.15' )
    previousPathName.subscriptionRootPage = 'HOME';
    if( !nonDiscoverPages.includes( previousPathName.current ) ){
      if( previousPathName.subscriptionPath !== 'subscription/currentPlan' ){
        previousPathName.pageName = customPageType
      }
    }
  }, [] );

  useEffect( () => {
    if( response && Object.keys( response ).length > 0 ){
      const contentListTVOD = response.data.items?.filter( item => item.sectionSource === SECTION_SOURCE.TVOD );
      if( contentListTVOD && contentListTVOD.length > 0 && getAuthToken() ){
        tvodFetchData()
      }
    }
  }, [response] );

  useEffect( ()=> {
    window.location.pathname.includes( PAGE_TYPE.HOME ) && setIsError( false )
    setContentInfo && setContentInfo( {} )
    homeDonglePageData.current = null
    railsRestoreId.current === null && setLastFocusFrom( false )
    return () =>{
      setLastFocusFrom( true )
    }
  }, [] )


  useEffect( ()=>{
    previousPathName.selectedPlanType = null
    previousPathName.selectedtenure = null
    previousPathName.selectedPlanCard = null
    searchKeyBoardLastFocuskey.current = null
    catalogPage.selectedGenre = null
    catalogPage.selectedLanguage = null
    catalogPage.totalCards = []
    catalogPage.totalButtons = []
    catalogPage.current = null;
    catalogPage.fullLoader = true;
    catalogPage.halfLoader = true;
    setPageNumberPagination( 1 )
  }, [] )

  useEffect( ()=>{
    if( railItems && window.location.pathname.includes( PAGE_TYPE.HOME ) ){
      if( homeCarouselRef.current === null ){
        if( railsRestoreId.current === null && lastFocusFrom !== true && document?.querySelector( '.LeftNavContainer__expanded' ) === null ){
          // This is for the pubnub push while reloading the app & no carousel
          !modalDom() && focusSelf()
        }
      }
      else {
        // This is for the pubnub push while reloading the app & carousel on top
        // eslint-disable-next-line no-lonely-if
        if( !document.querySelector( '.page .PlaybackInfo' ) ){
          !modalDom() && railsRestoreId.current === null && selectedHeroBanner?.sectionSource !== SECTION_SOURCE.HERO_BANNER_NEW && setFocus( 'CAROSEL_FOCUS' )
        }
      }
      if( isNaN( railsRestoreId.current ) ){
        if( homeCarouselRef.current === null ){
          !document.querySelector( '.page .PlaybackInfo' ) && focusSelf()
        }
        else {
          !document.querySelector( '.page .PlaybackInfo' ) && setFocus( 'CAROSEL_FOCUS' )
        }
      }
    }
    lastFocusFrom && setShuffleData( shuffleIndex )
  }, [railItems, lastFocusFrom] )

  const onPressHandleFn = ( length, id ) => {
    onShuffleClick.current = id
    setAnimationStart( true )
    let uniqueData = [...new Set( shuffleData )];
    const currentIndex = uniqueData.find( data=> data.id === id );
    const newChecked = [...uniqueData];
    if( currentIndex ){
      const index = newChecked.findIndex( object => {
        return object.id === id;
      } );
      if( index !== -1 ){
        if( newChecked[index].count + 1 === length ){
          newChecked[index].count = 0;
        }
        else {
          newChecked[index].count = newChecked[index].count + 1;
        }
      }
      setShuffleData( newChecked )
      setshuffleIndex( newChecked )
    }
    else {
      setshuffleIndex( newChecked )
      newChecked.push( {
        id,
        count: 1
      } )
      setShuffleData( newChecked )
    }
    setAnimationStart( false )
  }

  useEffect( () => {
    const key = pressedKey.current
    if( key === 'ArrowDown' || key === 'ArrowUp' ){
      if( isKeyReleased ){
        pressedKey.current = null;
        setThrottlefn( 50 )
      }
      else {
        setThrottlefn( 150 )
      }
    }
    else if( key === 'ArrowRight' || key === 'ArrowLeft' ){
      if( isKeyReleased ){
        pressedKey.current = null;
        setThrottlefn( 50 )
      }
      else {
        isTizen ? setThrottlefn( 500 ) : setThrottle( 300 )
      }
    }
  }, [isKeyReleased] )

  const setThrottlefn = useCallback( ( throttle ) => {
    setThrottle( {
      throttle: throttle,
      throttleKeypresses: true
    } );
  }, [isKeyReleased] )

  const onKeyRelease = useCallback( () => {
    keyPressedCount.current = 0;
    setIsKeyReleased( true );
  } );
  const onKeyPress = useCallback( ( { code } ) => {
    pressedKey.current = code;
    if( keyPressedCount.current > 0 ){
      setIsKeyReleased( false );
    }
    keyPressedCount.current++;
  } );

  useEffect( () => {
    if( tvodResponse ){
      const activeTvodContent = tvodResponse.data?.items?.filter( info => info.rentalStatus === 'ACTIVE' )
      tvodContent.current = activeTvodContent
      setIsTvod( false )
    }
  }, [tvodResponse] );

  useEffect( ()=>{
    isExpandedMenu && leftMenuClick()
  }, [isExpandedMenu] )

  useEffect( () => {
    setAllLoginPath( [] )
    previousPathName.storeLiveData = []
    previousPathName.storeLiveTitle = ''
    previousPathName.storeLiveSectionSource = ''
    previousPathName.storeLiveId = ''
    window.addEventListener( 'keyup', onKeyRelease );
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keyup', onKeyRelease );
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  const sectionSourceFn = ( rail )=>{
    if( rail.sectionSource === SECTION_SOURCE.TVOD ){
      return { ...rail, contentList: filterRail( tvodContent.current ), title: 'My Purchases', layoutType: 'PORTRAIT', sectionSource: rail.sectionSource, sectionType: railsRestoreId.sectionType, id: rail.id, railType: MIXPANEL_RAIL_TYPE.SYSTEM_GENERATED, railContentType: MIXPANEL_CONTENT_TYPE.AUTOMATED }
    }
    else if( rail.sectionSource === SECTION_SOURCE.SHUFFLE_RAIL ){
      const shuffleInfo = shuffleData.find( d => d.id === rail.id );
      const shuffleIndex = shuffleInfo && shuffleInfo.count ? shuffleInfo.count : 0;
      const content = rail.shuffleList && rail.shuffleList[shuffleIndex] ? rail.shuffleList[0].contentList : [];
      return { ...rail, provider: rail.provider, id: rail.id, mixPanelTitle: rail.title, title: rail.provider ? '' : rail.title.replace( /shuffle/ig, '' ).trim(), contentList: filterRail( content || [] ), layoutType: 'PORTRAIT', sectionSource: rail.sectionSource, position: rail.position, railType: MIXPANEL_RAIL_TYPE.SYSTEM_GENERATED, railContentType: MIXPANEL_CONTENT_TYPE.AUTOMATED }
    }
    else if( rail.sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
      const indexedContentList = rail.contentList?.map( ( item, index ) => {
        return {
          ...item, providerIndex: index
        }
      } )

      const bbaContentList = Array.from(
        { length: rail.contentList.length },
        ( _, index ) => {
          const relativeIndex = index - Math.floor( 13 / 2 );
          return indexedContentList[
            ( bbaSelectedItem + relativeIndex + rail.contentList.length ) % rail.contentList.length
          ];
        }
      );
      const newBBAContentList = bbaContentList.map( ( item, index ) => {
        if( index === 6 ){
          return {
            ...item, selectedProvider: true
          }
        }
        else {
          return {
            ...item, selectedProvider: false
          }
        }
      } )
      return { ...rail, contentList: filterRail( newBBAContentList ) }
    }
    else if( rail.sectionSource === SECTION_SOURCE.LIVE_EVENT_RAIL ){
      return { ...rail, contentList: filterRail( rail?.contentList ), isPagination: rail.totalCount, railType: MIXPANEL_RAIL_TYPE.LIVE_EVENT }
    }
    else if( rail.sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ){
      return { ...rail, contentList: filterRail( rail?.contentList, null, rail.sectionSource ), isPagination: rail.totalCount }
    }
    else if( rail.sectionSource === SECTION_SOURCE.MARKETING_ASSET ){
      return { ...rail, contentList: filterRail( rail?.contentList ), isPagination: rail.totalCount, railType: getRailTypeOnHome( rail ), railContentType: MIXPANEL_CONTENT_TYPE.MARKETING_ASSET }
    }
    // else if( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){ // Need To Remove // Need To Check
    //   return { ...rail, contentList: filterRail( rail?.chipList ), isPagination: rail.totalCount, railType: getRailTypeOnHome( rail ) }
    // }
    else {
      return { ...rail, contentList: filterRail( rail?.contentList ), isPagination: rail.totalCount, railType: getRailTypeOnHome( rail ) }
    }
  }

  const synopsisCard = useCallback( ( contractName, metaData, config ) => (
    <HomeSynopsis
      contractName={ contractName }
      metaData={ metaData }
      config={ config }
      shuffleSynopsis={ shuffleSynopsis }
      newRailSectionSource={ currentsectionRef.current }
    />
  ), [metaData, config] );

  const mediaCarouselFn = useCallback( ( rail ) => {
    return (
      <HomeMediaCarousel key={ rail.id }
        railData={ sectionSourceFn( rail ) }
        onFocus={ ( e )=> window.location.pathname.includes( PAGE_TYPE.HOME ) && onRailFocus( e, rail ) }
        nonSubscribedPartnerList={ myPlanProps && Object.keys( myPlanProps ).length > 0 ? myPlanProps.nonSubscribedPartnerList : [] }
        isLowerPlan={ myPlanProps && Object.keys( myPlanProps ).length > 0 && myPlanProps.openFSUpgrade }
        status={ myPlanProps && Object.keys( myPlanProps ).length > 0 && myPlanProps.subscriptionStatus }
        setShowSynopsis={ showSynopsis }
        topPositionRailValue={ ref.current ? ref.current.scrollTop : null }
        setCaroselPageView={ setCaroselPageView }
        focusKeyRefrence={ `BUTTON_FOCUS_${ rail.title }_${ rail.id }` }
        totalRailLength={ contentList.length }
        configType={ rail.configType }
        pageType={ customPageType ? customPageType : PAGE_TYPE.DONGLE_HOMEPAGE }
        setRailFocusedCardInfo={ setRailFocusedCardInfo }
        isKeyReleased={ isKeyReleased }
        showTimeBlock
        { ...( ( rail.sectionSource === SECTION_SOURCE.SHUFFLE_RAIL ) && {
          onPressHandleFn: ()=> rail.shuffleList.length > 1 && onPressHandleFn( rail.shuffleList.length, rail.id ),
          animationStart: animationStart,
          onShuffleClick: onShuffleClick.current === rail.id,
          setShuffleCurrent: setShuffleCurrent,
          setShuffleCardFocus: ( data )=> setShuffleSynopsis( data )
        } )
        }
        fetchHorizontalContent={ fetchHorizontalContent }
        appendRecommendationDataWithMixedRail={ appendRecommendationDataWithMixedRail }
        position={ !!selectedHeroBanner ? recordList.findIndex( d => d.id === rail.id ) + 1 : recordList.findIndex( d => d.id === rail.id ) }
        hasPageContainCarouselList={ filterRail( selectedHeroBanner?.contentList )?.length > 0 }
        totalRailList={ recordList }
        activeContent={ activeRailSelections[rail.id] }
        onSelectChip={ handleChipSelection }
        setRailSectionSource={ setRailSectionSource }
        chipLoaderState={ chipLoaderState }
        setActiveRailSelections={ setActiveRailSelections }
      />
    )
  }, [contentList, bbaSelectedItem, isKeyReleased, activeRailSelections] )

  useEffect( () => {
    storeRailData.leftMenuClickedWithDongle = ''
    if( !getAuthToken( ) && getAnonymousId() ){
      callAPI( PACKS.GUEST );
      setIsValidCheckSum( true ) // TODO:  need to set to false in next release, reverting for Jan release
    }
    setIsHomeLoaded( false )
  }, [getAuthToken(), getAnonymousId()] )

  useEffect( () => {
    if( getProductName() ){
      callAPI( getProductName() );
    }
  }, [getProductName()] )

  useEffect( () => {
    if( currentError ){
      setProductName( PACKS.FREEMIUM )
    }
  }, [currentError] )

  useEffect( () => {
    if( customPageType && customPageType.includes( 'DONGLE' ) ){
      callAPI( getProductName() );
      setIsHomeLoaded( false )
      // setCarouselList( [] )
    }
  }, [customPageType] )

  useEffect( ()=>{
    if( isPageClicked ){
      setShuffleSynopsis( false )
      setCaroselPageView( true )
      if( ref.current ){
        ref.current.scrollTop = 0
      }
    }
  }, [isPageClicked] )

  useEffect( ()=>{
    if( sidebarList ){
      const params = {
        'subscriptiontype' : responseData.currentPack?.subscriptionType || PACKS.ADD_PACK_FREEMIUM
      }
      ucBrowseByAppsFetchData( { params: params } );
    }
  }, [sidebarList] )


  useEffect( ()=>{
    if( isPageClicked && contentList.length > 0 ){
      const parentId = contentList[0].id
      const cardId = contentList[0].contentList[0]?.id
      const el = document.querySelector( '.Carousel' )
      if( el ){
        setFocus( 'CAROSEL_FOCUS' )
      }
      else {
        ( parentId && cardId ) ? setFocus( `BUTTON_FOCUS_${parentId}${cardId}` ) : focusSelf()
      }
      setIspageClicked( false )
    }
  }, [caroselPageView] )

  const callAPI = ( productName ) =>{
    const params = {
      'subscriptiontype' : responseData.currentPack?.subscriptionType || PACKS.ADD_PACK_FREEMIUM
    }
    ucBrowseByAppsFetchData( { params: params } );
    setRailItems( [] )
    setContentInfo( {} )
    setHasMore( false )
    setBBASelectedItem( 0 )
    setBbaContents( { ...bbaContents, bbaInitCount: true } )
    setActiveRailSelections( {} )
    setShowLoader( true )
    homeDonglePageData.current = null
    setShuffleSynopsis( false )
    fetchHomePageData( productName || PACKS.GUEST )
    setCaroselPageView( true )
  }

  useEffect( () => {
    setShuffleSynopsis( false )
  }, [metaData] )

  useEffect( () => {
    if( window.location.pathname && window.location.pathname.includes( PAGE_TYPE.HOME ) ){
      setMixpanelData( 'bingeListSource', '' )
      setMixpanelData( 'playerSource', storeRailData.leftMenuClickedWithDongle || constants.PLAYER_SOURCE.HOME )
      setMixpanelData( 'optionValue', storeRailData.leftMenuClickedWithDongle || constants.PLAYER_SOURCE.HOME );
      setMixpanelData( 'browsepagename', storeRailData.leftMenuClickedWithDongle || constants.PLAYER_SOURCE.HOME );
      selectedGenreItem.current = null
      selectedLaungueItem.current = null
      previousPathName.isLowerPlanFirstTime = false;
      catalogPage.current = null;
      previousPathName.isFromPrimeMarketingAsset = null
      if( getLoginMsg() || getLogtoutMsg() || fromConfirmPurchase.current || checkAppleStatusExist() ){
        setHideNotification( false );
        setTimeout( () => {
          setHideNotification( true );
          removeAppleToastInfo();
          removeLoginMsg();
          removeLoginIcon()
          removeLogoutMsg();
          removeLogoutIcon();
          localStorage.removeItem( 'upgradeMyPlan' );
          fromConfirmPurchase.current = false;
        }, 3000 );
        getAuthToken() && deviceLastActivityFetchData()
      }

      // if( previousPathName.current?.includes( 'content/detail/LIVE' ) ){
      //   if( previousPathName.liveFocused ){
      //     setTimeout( () => setFocus( previousPathName.liveFocused ), 100 )
      //   }
      // }
      // else
      // will check later this case
      if( !nonDiscoverPages.includes( `/${previousPathName.focusedItem}` ) && !modalDom() ){
        if( previousPathName.refreshPage ){
          focusSelf()
          setCaroselPageView( false )
          setTimeout( ()=>{
            setCaroselPageView( true )
            setTimeout( ()=> focusSelf(), 100 )
          }, 50 )
        }
        else if( previousPathName.fromHbSellAllPage ){
          setFocus( 'CAROSEL_FOCUS' )
          previousPathName.fromHbSellAllPage = false
        }
        else if( previousPathName.fromHereBannerClick ){
          setFocus( 'CAROSEL_FOCUS' )
          previousPathName.fromHereBannerClick = false
        }
        else {
          focusSelf() // focus don't retain for nonDiscover pages, So added the condition.
        }
      }
      if( !nonDiscoverPages.includes( window.location.pathname ) ){
        donglePageData.current = null
        setContentInfo( {} )
      }
      if( ref.current && previousPathName.refreshPage ){
        ref.current.scrollTop = 0
        previousPathName.refreshPage = false
      }
    }
    if( window.location.pathname.includes( '/content/detail' ) ){
      setLastFocusedSynopsisID( homeDonglePageData.current?.id )
    }
  }, [window.location.pathname] )

  const showNotification = () => {
    let message = {}
    if( myPlanProps?.upgradeMyPlanType && fromConfirmPurchase.current && getAuthToken() ){
      message = {
        iconName: 'success',
        message: 'You are already subscribed to Tata Play Binge'

      }
    }
    else if( getLoginMsg() && getLoginIcon() ){
      message = {
        iconName: getLoginIcon(),
        message: getLoginMsg()

      }
    }
    else if( getLogtoutMsg() && getLogoutIcon() ){
      message = {
        iconName: getLogoutIcon(),
        message: getLogtoutMsg()

      }
    }
    else if( previousPathName.guestJourneyCTA === LANGUAGE_JOURNEY.LOGGED_IN_USER_JOURNEY ){
      message = {
        iconName: 'Success',
        message: config?.videoLanguageVerbiages?.languageDrawer?.preferenceUpdatedMsg || VIEDO_LANGAUGE_VERBIAGES.languageDrawer.preferenceUpdatedMsg

      }
    }
    else if( checkAppleStatusExist() && myPlanProps?.subscriptionStatus === constants.ACTIVE ){
      if( getAppleToastInfo().appleStatus === APPLETV.CLAIM_STATUS.ACTIVATED ){
        message = {
          iconName: 'Success',
          message: appleToastMessage?.lsAppleActivatedToastMessage
        }
      }
      else {
        message = {
          iconName: 'InformationIcon',
          message: appleToastMessage?.lsPendingToastMessage
        }
      }
    }
    else if( notificationData?.iconName && notificationData?.message ){
      message = {
        iconName: notificationData.iconName,
        message: notificationData.message
      };
    }
    return message;
  }

  useEffect( () => {
    if( previousPathName.guestJourneyCTA === LANGUAGE_JOURNEY.LOGGED_IN_USER_JOURNEY ){
      setHideNotification( false );
      setTimeout( () => {
        setHideNotification( true );
        previousPathName.guestJourneyCTA = ''
      }, 3000 )
    }
  }, [previousPathName.guestJourneyCTA] )

  const isShuffleRail = ( rail ) => {
    if( Array.isArray( rail.shuffleList ) && ( !rail.provider || availableProvidersList.current?.indexOf( rail.provider.toLowerCase() ) >= 0 ) && rail.shuffleList.length > 0 && rail.sectionSource === SECTION_SOURCE.SHUFFLE_RAIL && shuffleData ){
      if( rail.shuffleList.filter( data => data.contentList.length > 0 )?.length ){
        return true
      }
      return false
    }
  }

  const MouseWheelHandler = ( e ) => {

    if( hasCaroselRef.current && !modalDom() ){
      const note = homeRef?.current;
      const deltaY = e.deltaY; // Vertical distance scrolled by the mouse wheel
      let scrollMoment = ''
      if( deltaY > 0 ){
        scrollMoment = 'down'
      }
      else if( deltaY < 0 ){
        scrollMoment = 'up'
      }

      const screenPosition = note?.getBoundingClientRect();
      if( scrollMoment === 'down' ){
        setCaroselPageView( false )
      }
      else if( scrollMoment === 'up' && screenPosition?.top > 0 ){
        setCaroselPageView( true )
        setFocus( 'CAROSEL_FOCUS' )
      }
    }
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )


  useEffect( ()=>{
    if( error && recordList.length === 0 ){
      setTimeout( () => {
        setShowLoader( false )
      }, 500 )
      setIsError( true )
    }
  }, [error, recordList] )

  const renderedRails = useMemo( () => {
    return contentList.map( rail => {
      const hasFilteredContent = filterRail( ( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? rail.chipList : rail.contentList || [] ), null, rail.sectionSource ).length > 0;
      const isTVODWithContent = rail.sectionSource === SECTION_SOURCE.TVOD && tvodContent.current?.length > 0;
      const shouldRender = hasFilteredContent || isTVODWithContent || isShuffleRail( rail ) || isNudgeVisible( rail ) || isPromoVisible( rail );

      if( shouldRender ){
        return (
          <React.Fragment key={ rail.id }>
            { mediaCarouselFn( rail ) }
          </React.Fragment>
        );
      }

      return null;
    } );
  }, [contentList, tvodContent.current, bbaSelectedItem, isKeyReleased, activeRailSelections] ); // Add other dependencies if filterRail, isShuffleRail, etc. are not stable

  useEffect( () => {
    if( railItems ){
      browseByAppRef.current = document.querySelector( '.HomeMediaCarousel__browseByApp' );
      promoBannerRef.current = document.querySelector( '.SelectPromo' );
    }
  }, [railItems] );

  return (
    <div className='Home'>
      { ( !shuffleSynopsis && !railSectionSource ) && !( caroselPageView && selectedHeroBanner?.contentList?.length > 0 ) && ( recordList.length > 0 ) &&
      <div
        className='Home__Banner'
      >
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <BannerComponent
            alt='Background BannerComponent image'
            bgImg={ showSynopsis ? `${ cloudinaryCarousalUrl( LAYOUT_TYPE.HERO_BANNER_SYNOPSIS, url ) }/${ metaData?.previewImage || homeDonglePageData.current?.previewImage }` : 'blank' }
            synopsisGradient={ !sectionBannerType !== undefined }
            playerProps={ { srcBanner: metaData?.detail?.trailerUrl || trailor_url || metaData?.detail?.dashWidewineTrailerUrl } }
            imageGradient
            railFocusedCardInfo={ railFocusedCardInfo }
            liveContent={ isLiveContentType( homeDonglePageData.current?.contentType ) }
            broadcastMode={ homeDonglePageData.current?.broadcastMode }
            playerAction={ homeDonglePageData.current?.playerAction }
            previewPoster={ homeDonglePageData.current?.previewPoster }
            preimage={ homeDonglePageData.current?.image }
          />
        </FocusContext.Provider>
      </div>
      }
      { ( shuffleSynopsis ) && <div className='Home__BannerShuffleSynopsis'>
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div>
            <BannerComponent
              alt='Background BannerComponent image'
              bgImg={ `${window.assetBasePath}/ShuffleSynopsis.png` }
              synopsisGradient={ false }
              imageGradient={ false }
              liveContent={ isLiveContentType( homeDonglePageData.current?.contentType ) }
            />
          </div>
        </FocusContext.Provider>
      </div> }

      <FocusContext.Provider value={ focusKey }>
        { !shuffleSynopsis && filterRail( selectedHeroBanner?.contentList )?.length >= 0 &&
          <div className='Home__topSection'>
            { ( sectionBannerType ) ?
              (
                <div
                  className={
                    classNames( 'Home__heroBanner Home--container',
                      { 'Home__heroBanner--newHB': sectionBannerType?.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW
                      } )
                  }
                >
                  { caroselPageView && window.location.pathname.includes( PAGE_TYPE.HOME ) && lastFocusFrom === false ? (
                    <>
                      <Icon
                        name={ props.homeLogo }
                      />
                      { filterRail( selectedHeroBanner?.contentList )?.length > 0 && (
                        <div className='Home__Carousel'
                          ref={ homeCarouselRef }
                        >
                          <Carousel
                            onFocus={ ()=>{
                              previousPathName.previousMediaCardFocusBeforeSplash = `CAROSEL_FOCUS`
                            } }
                            items={ filterRail( selectedHeroBanner?.contentList ) }
                            isBackground={ true }
                            layoutType={ LAYOUT_TYPE.HERO_BANNER }
                            focusKeyRefrence={ 'CAROSEL_FOCUS' }
                            pageType={ customPageType ? customPageType : PAGE_TYPE.DONGLE_HOMEPAGE }
                            sectionSource={ selectedHeroBanner?.sectionSource }
                            sectionType={ selectedHeroBanner?.sectionType }
                            railPosition={ railItems.findIndex( d => d.id === selectedHeroBanner?.id ) }
                            railTitle={ selectedHeroBanner?.title }
                            railId={ selectedHeroBanner?.id }
                            configType={ selectedHeroBanner?.configType }
                            url={ url }
                            imageCardSize={ selectedHeroBanner?.imageMetadata?.cardSize }
                            layoutTypeForMixPanel={ selectedHeroBanner?.layoutType }
                            // isNewHeroBannerEnabled={ isNewHeroBannerEnabled }
                            onIconAndMessageChange={ handleIconAndMessageChange }
                            caroselPageView={ caroselPageView }
                            buttonCTAText={ selectedHeroBanner?.buttonCTAText }
                            autoScroll={ selectedHeroBanner?.autoScroll }
                          />
                        </div>
                      ) }
                    </>
                  ) : (
                    ( !railSectionSource && <div>
                      { synopsisCard( contractName.contractName, metaData, config ) }
                    </div>
                    )
                  ) }
                </div>
              ) : (
                !railSectionSource && recordList.length > 0 && <div className='HOME_SYNAPSIS_OUT'>
                  { synopsisCard( contractName.contractName, metaData, config ) }
                </div>
              ) }
          </div>
        }
        <div
          id='scrollContainer'
          className={
            classNames( 'Home__scrollContainer',
              { 'Home__scrollContainer--topViewHieght': caroselPageView,
                'Home__scrollContainer--isNewHeroBannerEnabled': selectedHeroBanner?.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW && caroselPageView
              } )
          }
          ref={ ref }
        >

          <InfiniteScroll
            dataLength={ recordList.length }
            scrollableTarget='scrollContainer'
            next={ loadMore }
            hasMore={ hasMore }
            scrollThreshold={ 0.6 }
          >
            { renderedRails && (
              <div className='Home__rails Home--container'
                ref={ homeRef }
              >
                {
                  renderedRails
                }
              </div>
            ) }
            { ( isError ) && !showLoader && window.location.pathname.includes( PAGE_TYPE.HOME ) && recordList.length === 0 &&
            <div className='Home__noContent'>
              <ErrorPage error={ handleErrorMessage( error, null, constants.CONTENT_NOT_FOUND ) }
                hideHeader={ true }
              />
            </div>
            }
          </InfiniteScroll>
        </div>
        {
          !hideNotification &&
            <div className={
              classNames( 'DeviceManagementPage__notification', {
                'Home__appleNotification' : checkAppleStatusExist() || iconbingList
              } ) }
            >
              <Notifications
                iconName={ showNotification().iconName }
                message={ showNotification().message }
              />
            </div>
        }


        { showLoader &&
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='Loader'>
              <Image
                src={ `${window.assetBasePath}loader.gif` }
              />
            </div>
          </FocusContext.Provider>
        }

      </FocusContext.Provider>
    </div>
  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} example - refactor or delete
  */
export const propTypes = {
  homeLogo: PropTypes.string
};

export const defaultProps = {
  homeLogo: 'BingeLogo'
};

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;