/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
/**
 * This Catalog page is for Partner consisting of partner title, hero banner and different rails
 *
 * @module views/components/CatalogPartner
 * @memberof -Common
 */
import React, { useState, useCallback, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import './CatalogPartner.scss';
import get from 'lodash/get';
import Carousel from '../Carousel/Carousel';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import { LAYOUT_TYPE, PACKS, PAGE_TYPE, RAIL_POSITION, SECTION_SOURCE, SECTION_TYPE, constants, NOTIFICATION_RESPONSE, COMMON_HEADERS, CHANNEL_RAIL_TYPE } from '../../../utils/constants';
import serviceConst from '../../../utils/slayer/serviceConst';
import Image from '../Image/Image';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { getProviderLogo, modalDom, checkSectionSource, cloudinaryCarousalUrl, showToastMsg, setMixpanelData } from '../../../utils/util';
import { HomeService, HorizontalFetchRailContent } from '../../../utils/slayer/HomeService';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { app_rail_click } from '../../../utils/mixpanel/mixpanelService';
import { getAuthToken, getContentRailPositionData, getSelectedPartner, getUserSelectedApps } from '../../../utils/localStorageHelper';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import PlaybackInfo from '../PlaybackInfo/PlaybackInfo';
import { MediaCarouselService } from '../../../utils/slayer/MediaCarouselService';
import Synopsis from '../Synopsis/Synopsis';
import BannerComponent from '../BannerComponent/BannerComponent';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import classNames from 'classnames';
import Notifications from '../Notifications/Notifications';
import { chipRailAPICallService } from '../../../utils/slayer/RecommendedLangService';
import { BoxSubSet } from '../../../utils/slayer/PlaybackInfoService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';

/**
 * @method checkContentType
 * @summary Method to check the content type
 * @param {object} data - response data
 */
export const checkContentType = ( items, sectionType ) => {
  return items.filter( curItem => curItem.sectionType === sectionType )[0]?.contentList;
}

/**
 * Represents a CatalogPartner component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns CatalogPartner
 */
export const CatalogPartner = function( props ){
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack
  const packName =  getAuthToken() ? ( myPlanProps?.upgradeMyPlanType || PACKS.FREEMIUM ) : PACKS.GUEST

  const [hasMore, setHasMore] = useState( true );
  const [showLoader, setShowLoader] = useState( true );
  const [showHalfLoader, setShowHalfLoader] = useState( false );
  const [railItems, setRailItems] = useState( [] );
  const [errorMsg, setErrorMsg] = useState( false );
  const [caroselPageView, setCaroselPageView] = useState( true );
  const [isKeyReleased, setIsKeyReleased] = useState( true );
  const [railSectionSource, setRailSectionSource] = useState( false );
  const [pageData, setPageData] = useState( {
    pageLimit: 10,
    pageOffset: 0,
    Subscribed: packName && packName !== PACKS.FREEMIUM,
    UnSubscribed: packName === PACKS.FREEMIUM,
    packName: packName,
    ...( !!getUserSelectedApps() && {
      allowBingeRepositioning: true,
      userSelectedApps: getUserSelectedApps()
    } )
  } );
  const [showNotification, setShowNotification] = useState( false );
  const [notificationMessage, setNotificationMessage] = useState( '' );
  const [notificationIcon, setNotificationIcon] = useState( constants.SUCCESS_ICON );
  const [railFocusedCardInfo, setRailFocusedCardInfo] = useState();
  const [currentCatalogpageInfo, setCurrentCatalogpageInfo] = useState( [] )
  const [activeRailSelections, setActiveRailSelections] = useState( {} );

  const modalRef = useRef();
  const buttonRef = useRef();
  const caroselPageRef = useRef( null )
  const caroselScrollContainerRef = useRef( null )
  const keyPressedCount = useRef( 0 );
  const horizontalId = useRef( null );

  const { catalogFlag, contentInfo, setContentInfo } = useHomeContext();
  const metaData = useMemo( () => get( contentInfo, 'data', {} ), [contentInfo] );
  const contractName = useMemo( () => get( contentInfo, 'data.detail', {} ), [contentInfo] );

  const { trailor_url, setTrailor_url } = usePlayerContext()

  const location = useLocation();
  const { bbaOpen } = location.args || {};
  const { filterData, filterRail } = useContentFilter( );
  const history = useHistory();
  const { pageType, title } = useParams();
  const { sectionType } = serviceConst;
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const previousPathName = useNavigationContext();
  const providerLogoList = get( config, 'providerLogo' );
  const providerLogoUrl = getProviderLogo( providerLogoList, title, constants.STATIC_PARTNER_PAGE_LOGO, url );
  const { catalogPagePatner, catalogPage, topPositionRailValueContext, subCatalogPagesInfo, setSubCatalogPagesInfo, donglePageData } = useMaintainPageState() || null

  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } );

  const [data] = HomeService( { pageData, pageType, skip: true } );
  const { fetchData, response, error, loading } = data;

  const loaderPath = `${window.assetBasePath}loader.gif`;
  const carouseData = checkContentType( railItems, sectionType.HERO_BANNER )
  const contentList = useMemo( () => filterData( railItems.filter( item => ( item.sectionType !== SECTION_TYPE.HERO_BANNER && item?.railType !== CHANNEL_RAIL_TYPE.COMPOSITE ) ) ), [railItems] )
  const sectionBannerType = useMemo( () => railItems.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER ), [railItems] ) || {};
  const recordList = useMemo( () => contentList.filter( item => ( item.contentList?.length > 0 ) || ( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) ), [railItems] );
  const handleIconAndMessageChange = ( { iconName, message } ) => {
    showToastMsg( setShowNotification, setNotificationMessage, message, setNotificationIcon, iconName )
  };

  const isNewHeroBannerEnabled = useMemo( () => get( config, 'cms_constant.isNewHeroBannerEnabled' ), [config] );
  const newHeroBanner = useMemo( () => railItems?.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER && item.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW ), [railItems] ) || null;
  const oldHeroBanner = useMemo( () => railItems?.find( item => item.sectionType === SECTION_TYPE.HERO_BANNER && item.sectionSource === SECTION_SOURCE.EDITORIAL ), [railItems] ) || null;
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

  const [horizontalFetchContent] = HorizontalFetchRailContent()
  const { horizontalFetchData, horizontalResponse } = horizontalFetchContent

  const [boxSubSetObj] =  BoxSubSet( null, true, true )
  const { boxSubSetFetch, boxSubSetResponse } = boxSubSetObj;

  const onRailFocus = useCallback( ( { y }, rail ) => {
    const appRailFocus = checkSectionSource( rail )
    let defaultScrollValue = 0
    if( caroselScrollContainerRef.current ){
      let yAxis = y === 0 ? y : y + 1
      if( appRailFocus ){
        defaultScrollValue = 100
        yAxis = y - 380 // this value 456 is height of synapsisCard // value is changed 456 to 380 to fix focus issue on BrowseBy Sports Rails
      }
      try {
        if( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          caroselScrollContainerRef.current.scrollTo( { top: y } );
        }
        else {
          caroselScrollContainerRef.current.scrollTo( {
            top: yAxis
          } )
        }
      }
      catch ( e ){
        caroselScrollContainerRef.current.scrollTop = yAxis
      }
    }
    setCaroselPageView( false )
    setRailSectionSource( appRailFocus )
    topPositionRailValueContext.current = caroselScrollContainerRef.current.scrollTop + defaultScrollValue
  }, [caroselScrollContainerRef] );

  const loadMore = () => {
    const lastFocusRestoreKey = currentCatalogpageInfo && currentCatalogpageInfo.currentPageFocusKey
    if( !lastFocusRestoreKey ){
      setShowHalfLoader( true )
      const tempPageData = { ...pageData, pageOffset: railItems.length };
      setPageData( { ...tempPageData } );
      fetchData( { params: tempPageData } );
    }
  }

  // const countRef = useRef( 0 ) // Need To Remove // Need To Check

  const getMergeRecommendationData = useCallback( async( data ) => {
    const items = data.items || [];
    const promises = [];
    const recoIdxArr = [];

    if( items.length ){
      items.map( ( item, index ) => {
        if( item.sectionSource === SECTION_SOURCE.RECOMMENDATION ){
          recoIdxArr.push( {
            index: index,
            recoPosition: item.recommendationPosition,
            title: item.title,
            placeHolder: item?.placeHolder
          } );
          promises.push( MediaCarouselService( item.placeHolder, item.layoutType ) );
        }
        else if( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){ // TA CHIP'S NOT SCOPE FOR PATNER PAGES
          recoIdxArr.push( {
            index: index,
            title: item.sectionSource,
            railId: item.id
          } );
          promises.push( chipRailAPICallService( item ) );
        }
      } );

      if( promises.length > 0 ){
        await Promise.allSettled( promises ).then( results => {
          results.map( ( result, idx ) => {
            if( result.status === 'fulfilled' ){
              if( recoIdxArr[idx].title === SECTION_SOURCE.BINGE_CHIP_RAIL ){
                const targetRailId = recoIdxArr[idx].railId;
                items.map( ( item ) => {
                  if( item.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && item.id === targetRailId ){
                    item['chipList'] = item['chipList']?.map( ( chip, chipIndex ) => {
                      return {
                        ...chip,
                        chipRailId: item.id,
                        appContentList: chipIndex === 0 ? results[idx].value?.data?.data?.contentList : [],
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
              else {
                const recoRailPosInHomeData = recoIdxArr[idx].index;
                const IdUpatedList = result.value?.data?.data?.contentList?.map( ( item, index )=>{
                  return { ...item, id: Number( item.id ), isRecommendation: true }
                } )
                const recoData = IdUpatedList || [];
                const railSubTitle = result.value?.data?.data?.railSubTitle
                if( recoIdxArr[idx].recoPosition === RAIL_POSITION.PREPEND ){
                  const contentListData = [...recoData, ...items[recoRailPosInHomeData].contentList]
                  const uniqContentListData = contentListData.filter( ( item, index, array ) => index === array.findIndex( ( t ) => t.id === item.id ) )
                  items[recoRailPosInHomeData].contentList = uniqContentListData
                  items[recoRailPosInHomeData].railSubTitle = railSubTitle
                  items[recoRailPosInHomeData].appName = ( recoIdxArr[idx]?.placeHolder === constants.UC_BEST_OF_PARTNER ) ? getSelectedPartner() : ''
                }
                else {
                  items[recoRailPosInHomeData].contentList = [...items[recoRailPosInHomeData].contentList, ...recoData]
                }
              }
            }
            if( idx === promises.length - 1 ){
              setRailItems( [...railItems, ...items] );
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
        setRailItems( [...railItems, ...items] );
        setPageData( {
          ...pageData,
          pageOffset: parseInt( data.offset, 10 ),
          totalItems: parseInt( data.total, 10 )
        } );
        setHasMore( parseInt( data.offset, 10 ) < parseInt( data.total, 10 ) )
      }
    }
  } )

  const hideModal = () => {
    setErrorMsg( false )
    modalRef.current?.close();
    history.goBack();
  }

  const onKeyRelease = useCallback( () => {
    keyPressedCount.current = 0;
    setIsKeyReleased( true );
  } );

  const onKeyPress = useCallback( ( { code } ) => {
    if( keyPressedCount.current > 0 ){
      setIsKeyReleased( false );
    }
    keyPressedCount.current++;
  } );

  const MouseWheelHandler = ( e )=>{
    const note = caroselPageRef.current;
    const hasContainRails = document.querySelector( '.CatalogPartner__rails' ) && document.querySelector( '.CatalogPartner__rails' ).childElementCount > 0 ;
    const deltaY = e.deltaY;
    let scrollMoment = ''
    if( deltaY > 0 ){
      scrollMoment = 'down'
    }
    else if( deltaY < 0 ){
      scrollMoment = 'up'
    }
    const screenPosition = note?.getBoundingClientRect();
    if( scrollMoment === 'down' && hasContainRails ){
      setCaroselPageView( false )
    }
    else if( scrollMoment === 'up' && screenPosition?.top > 0 ){
      setCaroselPageView( true )
      setFocus( 'CAROSEL_FOCUS' )
    }
  }

  const synopsisCard = ( contractName, metaData, config ) => (
    <Synopsis
      contractName={ contractName }
      metaData={ metaData }
      config={ config }
    />
  );

  const fetchHorizontalContent = useCallback( ( id, originalContentListLength, { sectionSource, pagingState } ) => {
    horizontalId.current = id
    let params = {}
    params = {
      'id': id,
      'limit': 100,
      'offset': 20,
      'platform':COMMON_HEADERS.PLATFORM
    }
    horizontalFetchData( { params: params } );
  }, [contentList] )

  // API call for selected chip content
  const fecthSelectedChipContent = async( selectedChipData ) => {
    try {
      const responseData = await chipRailAPICallService( null, selectedChipData );
      return responseData;
    }
    catch ( error ){
      console.error( 'selectedChipData99-error:', error );
    }
  }

  const handleChipSelection = useCallback( async( railId, selectedContent, indexPosition, sectionSource )=>{ // Need To Check
    let response = null
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      response = await fecthSelectedChipContent( selectedContent )
      if( response !== undefined ){
        const selectedModifiedChip = { ...selectedContent, appContentList: response?.data?.data?.contentList, totalRecordsOfSelectedChip : response?.data?.data?.totalCount }
        const firstCardOnChipListData = response?.data?.data?.contentList[0] || {}
        const params = {
          contentType:firstCardOnChipListData?.contentType,
          id: firstCardOnChipListData?.id
        }

        if( donglePageData.current ){
          donglePageData.current = firstCardOnChipListData
        }

        boxSubSetFetch( params )
        setActiveRailSelections( prevState => ( {
          ...prevState,
          [railId]: {
            content: sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? selectedModifiedChip : selectedContent,
            selectedIndex: indexPosition
          }
        } ) );
        setTrailor_url( firstCardOnChipListData?.trailerUrl );
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
      if( donglePageData.current ){
        donglePageData.current.description = boxSubSetResponse.data?.description
        donglePageData.current.previewImage = boxSubSetResponse.data?.previewImage
        donglePageData.current.contractName = boxSubSetResponse.data?.contractName
      }
    }
  }, [boxSubSetResponse] )

  useEffect( ()=>{
    if( horizontalResponse && horizontalResponse.code === 0 && horizontalResponse.data && horizontalId.current ){
      const selectedRail = railItems?.findIndex( record => record.id === horizontalId.current )
      railItems[selectedRail].contentList = filterRail( railItems[selectedRail].contentList?.concat( horizontalResponse.data.contentList ) )
      railItems[selectedRail].isEndReached = horizontalResponse.data.contentList?.length === 0
      railItems[selectedRail].originalContentListLength = railItems[selectedRail].originalContentListLength + horizontalResponse.data.contentList?.length
      setRailItems( [...railItems] )
      horizontalId.current = null
    }
  }, [horizontalResponse] )

  useEffect( () => {
    const currentCatalogPageInfo = subCatalogPagesInfo.find( item => item.title === title );
    const filteredCatalog = subCatalogPagesInfo.filter( item => item.title !== title );
    setCurrentCatalogpageInfo( currentCatalogPageInfo )
    setSubCatalogPagesInfo( filteredCatalog )

    const { railTitle, railPosition, configType, contentPosition, sectionSource } = getContentRailPositionData()

    if( currentCatalogPageInfo ){
      setShowLoader( false )
      setRailItems( currentCatalogPageInfo?.railItems )
    }
    else if( catalogPage.appRailData ){
      setShowLoader( false )
      setRailItems( catalogPage.appRailData )
    }
    else if( catalogPagePatner.current !== null && catalogPagePatner.appRailStandaLoneBBChanelData ){
      setShowLoader( false )
      setRailItems( catalogPagePatner.appRailStandaLoneBBChanelData )
      catalogPagePatner.appRailStandaLoneBBChanelData = null
    }
    else {
      /* MixPanel-Event */
      sectionSource !== SECTION_SOURCE.BROWSE_BY_SPORTS && app_rail_click( railTitle, railPosition, configType, title, responseSubscription, contentPosition, bbaOpen, sectionSource )
      fetchData( { params: pageData } )
      // setShowLoader( true )

    }

    previousPathName.current = window.location.pathname;
    pageType === constants.ERROR && (
      setErrorMsg( true ),
      modalRef?.current?.showModal(),
      setFocus( 'DONE_BUTTON' )
    )
  }, [] )

  useEffect( ()=>{
    setMixpanelData( 'browsepagename', decodeURIComponent( window.location.pathname.split( '/' )[2] || '' ) )
    if( !showLoader && !catalogFlag ){
      if( catalogPagePatner.current !== null ){
        setFocus( catalogPagePatner.current )
        setTimeout( ()=> {
          setFocus( catalogPagePatner.current )
          catalogPagePatner.current = null
        }, 100 )
      }
      else if( currentCatalogpageInfo && currentCatalogpageInfo.currentPageFocusKey ){
        setFocus( currentCatalogpageInfo.currentPageFocusKey )
        setTimeout( ()=>{
          setFocus( currentCatalogpageInfo.currentPageFocusKey )
          currentCatalogpageInfo.currentPageFocusKey = null
        }, 10 )
      }
      else {
        !modalDom() && focusSelf()
      }
    }
  }, [showLoader, catalogFlag, currentCatalogpageInfo] );

  useEffect( () => {
    if( error ){
      setErrorMsg( constants.CONTENT_NOT_FOUND )
      setShowLoader( false );
    }
  }, [error] )

  useEffect( () => {
    if( response ){
      setShowHalfLoader( false )
      const data = response.data;
      async function fetchRecommendationFn(){
        await getMergeRecommendationData( data )
        setShowLoader( false )
      }
      fetchRecommendationFn()
    }
  }, [response] );

  useEffect( ()=>{
    if( !showLoader ){
      const isCaroselEmptyOrUndefined = carouseData === undefined || ( Array.isArray( carouseData ) && carouseData.length === 0 );
      const hasContainRails = document.querySelector( '.CatalogPartner__rails' ) && document.querySelector( '.CatalogPartner__rails' ).childElementCount > 0 ;
      !hasContainRails && isCaroselEmptyOrUndefined && (
        setTimeout( ()=>{
          setErrorMsg( true )
          modalRef.current?.showModal()
          setFocus( 'DONE_BUTTON' )
        }, 100 )
      )
    }
  }, [showLoader] )

  useEffect( () => {
    window.addEventListener( 'keyup', onKeyRelease );
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keyup', onKeyRelease );
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )

  useEffect( () => {
    if( catalogPagePatner.current !== null ){
      setCaroselPageView( false )
    }
    if( !location.state ){
      return <Loader /> ;
    }
  }, [location.state] )

  const mediaCarouselFn = useCallback( ( rail ) => {
    return (
      <MediaCarousel key={ rail.id }
        railData={ rail }
        onFocus={ ( e ) => onRailFocus( e, rail ) }
        focusFrom='CatalogPartner'
        nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
        isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
        status={ myPlanProps && myPlanProps.subscriptionStatus }
        contentRailType={ 'CatalogPartnerContent' }
        appRailData={ railItems }
        liveFocusCard={ ( liveId, providerName )=> {
        }
        }
        setCaroselPageView={ carouseData?.length > 0 && setCaroselPageView }
        setShowSynopsis={ true }
        isKeyReleased={ isKeyReleased }
        setRailFocusedCardInfo={ setRailFocusedCardInfo }
        catalogPageTitle={ title }
        catalogPageRailItems={ railItems }
        totalRailList={ contentList }
        focusKeyRefrence={ `BUTTON_FOCUS_${ rail.title }_${ rail.id }` }
        position={ !!selectedHeroBanner ? recordList.findIndex( d => d.id === rail.id ) + 1 : recordList.findIndex( d => d.id === rail.id ) }
        fetchHorizontalContent={ fetchHorizontalContent }
        activeContent={ activeRailSelections[rail.id] }
        onSelectChip={ handleChipSelection }
        setRailSectionSource={ setRailSectionSource }
        configType={ rail.configType }
        setActiveRailSelections={ setActiveRailSelections }
      />
    )
  }, [contentList, isKeyReleased, activeRailSelections] )


  const renderedRails = useMemo( () => {
    return contentList?.map( rail => {
      // const shouldRender = filterRail( ( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? rail.chipList : rail.contentList || [] ) ).length; // Need To Remove // Need To Check
      const hasChipWithContent = rail.chipList?.some( chip => chip.appContentList?.length > 0 );
      if( rail.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && hasChipWithContent ){
        return (
          <React.Fragment key={ rail.id }>
            { mediaCarouselFn( rail ) }
          </React.Fragment>
        );
      }
      else if( rail.contentList.length > 0 ){
        return (
          <React.Fragment key={ rail.id }>
            { mediaCarouselFn( rail ) }
          </React.Fragment>
        );
      }

      return null;
    } );
  }, [contentList, isKeyReleased, activeRailSelections] );

  return (
    <div ref={ ref }>
      {
        showLoader && !catalogFlag ? <Loader /> : (
          <div className={ !catalogFlag ? 'showChild CatalogPartner' : 'hideChild CatalogPartner' } >
            { !caroselPageView && !railSectionSource && (
              <>
                <div
                  className='CatalogPartner__banner'
                >
                  <FocusContext.Provider focusable={ false }
                    value=''
                  >
                    <BannerComponent
                      alt='Background BannerComponent image'
                      bgImg={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.HERO_BANNER_SYNOPSIS, url ) }/${ metaData?.previewImage }` }
                      playerProps={ { srcBanner: metaData?.detail?.trailerUrl || trailor_url || metaData?.detail?.dashWidewineTrailerUrl } }
                      synopsisGradient
                      imageGradient
                      catalogPartner
                      liveContent={ isLiveContentType( contentInfo?.contentType ) }
                      railFocusedCardInfo={ railFocusedCardInfo }
                      previewPoster={ donglePageData.current?.previewPoster }
                      preimage={ donglePageData.current?.image }
                      sectionSource={ donglePageData.current?.sectionSource }
                    />
                  </FocusContext.Provider>
                </div>
                <div className='CatalogPartner__synapsis'>
                  { synopsisCard( contractName.contractName, metaData, config ) }
                </div>
              </>
            ) }
            <FocusContext.Provider value={ focusKey }>
              <div className='CatalogPartner__topSection'>
                {
                  !catalogFlag && caroselPageView && selectedHeroBanner?.contentList?.length > 0 && (
                    <div
                    // className='CatalogPartner__heroBanner CatalogPartner--container'
                      className={
                        classNames( 'CatalogPartner__heroBanner CatalogPartner--container',
                          { 'CatalogPartner__heroBanner--newHB': sectionBannerType?.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW
                          } )
                      }
                    >
                      <Carousel
                        items={ railItems && selectedHeroBanner?.contentList }
                        isBackground={ true }
                        layoutType={ LAYOUT_TYPE.TOP_LANDSCAPE }
                        url={ url }
                        focusKeyRefrence={ 'CAROSEL_FOCUS' }
                        fromCatalogPartner={ true }
                        pageType={ pageType ? pageType : PAGE_TYPE.DONGLE_HOMEPAGE }
                        sectionSource={ selectedHeroBanner.sectionSource }
                        sectionType={ selectedHeroBanner.sectionType }
                        railPosition={ railItems.findIndex( d => d.id === selectedHeroBanner.id ) }
                        railTitle={ selectedHeroBanner.title }
                        railId={ selectedHeroBanner.id }
                        configType={ selectedHeroBanner.configType }
                        // isNewHeroBannerEnabled={ isNewHeroBannerEnabled }
                        caroselPageView={ caroselPageView }
                        onIconAndMessageChange={ handleIconAndMessageChange }
                        buttonCTAText={ selectedHeroBanner?.buttonCTAText }
                        imageCardSize={ selectedHeroBanner?.imageMetadata?.cardSize }
                        layoutTypeForMixPanel={ selectedHeroBanner?.layoutType }
                        autoScroll={ selectedHeroBanner?.autoScroll }
                      />
                      { selectedHeroBanner.sectionSource !== SECTION_SOURCE.HERO_BANNER_NEW && railItems.length > 0 ? (
                        <span className='CatalogPartner__heroBanner--provider'>
                          <Image
                            src={ `${ providerLogoUrl }` }
                          />
                        </span>
                      ) : null }
                    </div>
                  )
                }
              </div>
              <div
                id='scrollContainer'
                className={
                  classNames( 'CatalogPartner__scrollContainer',
                    {
                      'CatalogPartner__scrollContainer--isNewHeroBannerEnabled': selectedHeroBanner?.sectionSource === SECTION_SOURCE.HERO_BANNER_NEW && caroselPageView
                    } )
                }
                ref={ caroselScrollContainerRef }
              >
                <InfiniteScroll
                  dataLength={ Array.isArray( railItems ) && railItems.length > 0 ? railItems.length : null }
                  scrollableTarget='scrollContainer'
                  next={ loadMore }
                  hasMore={ hasMore }
                  scrollThreshold={ 0.5 }
                >
                  { renderedRails && (
                    <div ref={ caroselPageRef }
                      className={ 'CatalogPartner__rails' }
                    >
                      {
                        renderedRails
                      }
                    </div>
                  ) }
                </InfiniteScroll>
              </div>
            </FocusContext.Provider>
            {
              showHalfLoader &&
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='Loader'>
                  <Image
                    src={ loaderPath }
                  />
                </div>
              </FocusContext.Provider>
            }
            { errorMsg && (
              <NotificationsPopUp
                modalRef={ modalRef }
                opener={ buttonRef }
                iconName={ NOTIFICATION_RESPONSE.iconName }
                message={ NOTIFICATION_RESPONSE.errorInfo }
                buttonLabel={ constants.OK }
                backButton={ constants.CLOSE }
                showModalPopup={ errorMsg }
                handleCancel={ hideModal }
                buttonClicked={ hideModal }
              >
              </NotificationsPopUp>
            )
            }
          </div>
        ) }
      { catalogFlag &&
        <div className={ catalogFlag ? 'showChild' : 'hideChild' }>
          <PlaybackInfo />
        </div>
      }
      <div className='CatalogPartner__notifications'>
        {
          showNotification && (
            <Notifications
              iconName={ notificationIcon }
              message={ notificationMessage }
            />
          )
        }
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 */
export const propTypes =  {
}

CatalogPartner.propTypes = propTypes;

export default CatalogPartner;