/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * Common HomeMediaCard component used by other modules as a reusable component which returns the ui for a media card.
 *
 * @module views/components/HomeMediaCard
 * @memberof -Common
 */
import React, { useEffect, useMemo, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Image from '../Image/Image';
import Link from '../Link/Link';
import Text from '../Text/Text';
import './HomeMediaCard.scss';
import { useHistory } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { BoxSubSet, ZeeTrailerPlayback } from '../../../utils/slayer/PlaybackInfoService';
import { timeDifferenceCalculate, covertIntoMinutes, getSourceForMixPanel, freeEpisodeTagForCrown, getTAUseCaseId, setMixpanelData, handleDistroRedirection, isCrownNew, getBingePrimeStatusMixpanel, getBingePrimeStatus, getMixpanelData, getBrowsePageName, isEmptyObject } from '../../../utils/util';
import { constants, COMMON_HEADERS, SECTION_SOURCE, PROVIDER_LIST_NEW_HEIGHT, PARTNER_SUBSCRIPTION_TYPE, MIXPANEL_CONTENT_TYPE, PROVIDER_LIST_MORE_HEIGHT, PROVIDER_LIST, PAGE_NAME } from '../../../utils/constants';
import { setContentRailPositionData, setLastCardIndex, getLastCardIndex, getLastFocusedSynopsisID, removeLastFocusedSynopsisID, getAuthToken, setDistroMeta, getDistroMeta, getFromAppMediaCard, getFromSportsMediaCard, setTrailerContentCategory, setTrailerFromApi, setTrailerResumeTime, setTrailerCTA, setChipData } from '../../../utils/localStorageHelper';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { content_click, home_clicks, card_horizontal_swipe } from '../../../utils/mixpanel/mixpanelService';
import { isDistroContent, isLiveContentType, isSonyContent } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { getChannelPlayableStatus } from '../../../utils/commonHelper';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';

/**
   * Represents a MediaCard component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns MediaCard
   */

let timeOut;

export const HomeMediaCard = function( props ){
  const { setIconFront, onFocus, openSeriesInfo, contentType, contentID, focusKeyRefrence, setHomeCaroselInfo, totalRails, sectionSource, hideCrown, onMouseEnterCallBackFn, isKeyReleased, totalRailLength, cardIndexValue, placeHolder, sectionType, hasPageContainCarouselList, railContentType, bannerTitle, imageCardSize, layoutTypeForMixPanel, bannerColorCodeEnabled, isTitleEnabledLs, providerName, marketingAsset, onCardWithOutFocus, isChipTitleEnabledLs, chipDataList, selectedChipIndex } = props;
  const { setMetaData, metaData, setContentPlaybackData, setTrailor_url } = usePlayerContext()
  const previousPathName = useNavigationContext()
  const responseSubscription = useSubscriptionContext( );
  const { profileAPIResult } = useProfileContext();
  const history = useHistory();
  const { setContentInfo } = useHomeContext()
  const { setTotalrailsList, setLastRailTitle, railsRestoreId, railRestoreTitle, railCardTitle, checkRecRailRef, setLastFocusFrom, lastFocusFrom, piPageFocus, homeDonglePageData, setLiveContent, storeRailData, topPositionRailValueContext, bbaContents: { centerElementFocusKeyId }, setPlayerAction, setBroadcastMode, optionBba, isCWWatchingRailContentRef } = useMaintainPageState() || null

  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const isAutoPlayed = useMemo( () => {
    return profileAPIResult?.data?.autoPlayTrailer ?
      MIXPANELCONFIG.VALUE.YES :
      MIXPANELCONFIG.VALUE.NO;
  }, [profileAPIResult] );
  const bottom_span = `${window.assetBasePath}bottom-span.png`;

  const params = useMemo( () => ( {
    type: contentType,
    id: contentID
  } ), [contentType, contentID] );

  const [boxSubSetObj] =  BoxSubSet( params, true, false )
  const { boxSubSetFetch, boxSubSetResponse } = boxSubSetObj;
  const [zeeTrailer]  = ZeeTrailerPlayback( )
  const { fetchzeeTrailer, zeeTrailerResponse, zeeTrailerLoading }  = zeeTrailer
  const { configResponse } = useAppContext();
  const { config } = configResponse;

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
      imageCardSize: cardSize,
      layoutTypeForMixPanel: layoutType,
      liveContent,
      sectionSource
    } = props;

    return {
      title,
      year,
      genre,
      duration: covertIntoMinutes( duration ),
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
      id: contentID,
      contractName,
      cardSize,
      layoutType,
      liveContent,
      sectionSource
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
    props.liveContent,
    sectionSource,
    contentID
  ] );

  const isLoadCrownImage = useMemo( () => isCrownNew( myPlanProps, { ...props, provider: props.providerName }, config.enableCrown ), [props.contractName, props.freeEpisodesAvailable, props.contentType, myPlanProps, props.providerName, config.enableCrown] );
  const isLoadFreeTag = useMemo( () => freeEpisodeTagForCrown( myPlanProps?.subscriptionStatus, myPlanProps?.isLowerPlan, myPlanProps?.nonSubscribedPartnerList, props.providerName, props.partnerSubscriptionType, props.contractName, props.contentType, props.freeEpisodesAvailable ), [props.contentType, props.freeEpisodesAvailable, myPlanProps?.nonSubscribedPartnerList] );
  const MPItems = useMemo( () => ( {
    pageType: getSourceForMixPanel( window.location.pathname ),
    title: props.title,
    railPosition: props.railPosition,
    contentType: props.contentType,
    sectionSource: props.sectionSource,
    language: Array.isArray( props?.language ) ? props.language.join() || '' : ( typeof props?.language === 'string' ? props.language : '' ),
    primaryLanguage: Array.isArray( props?.language ) ? props?.language[0] || '' : ( typeof props?.language === 'string' ? props.language : '' ),
    genre: Array.isArray( props?.genre ) ? props.genre.join() || '' : ( typeof props?.genre === 'string' ? props.genre : '' ),
    primaryGenre: Array.isArray( props?.genre ) ? props?.genre[0] || '' : ( typeof props?.genre === 'string' ? props.genre : '' ),
    provider: props.providerName,
    contentPosition: props.contentPosition,
    contentRating: boxSubSetResponse?.data?.rating,
    contentTitle: props.contentTitle,
    contentAuth: props?.partnerSubscriptionType?.toLowerCase() !== PARTNER_SUBSCRIPTION_TYPE.FREE,
    releaseYear: props.releaseYear || boxSubSetResponse?.data?.releaseYear,
    deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    actors: Array.isArray( props?.actors ) ? props.actors.join() || '' : Array.isArray( boxSubSetResponse?.data?.actor ) ? boxSubSetResponse.data.actor.join() : '',
    appName: props.providerName,
    source: getSourceForMixPanel( window.location.pathname ),
    packPrice: responseSubscription?.responseData?.currentPack?.amountValue || '',
    packName: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType || '',
    autoPlayed: isAutoPlayed,
    liveContent: props.liveContent,
    railTitle: props.railTitle,
    sectionType: props.sectionType,
    channelName: props.channelName,
    channelNumber: props.channelNumber,
    bingePrimeStatus: getBingePrimeStatusMixpanel( responseSubscription ),
    bingePrimePackStatus: getBingePrimeStatus( responseSubscription ),
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
    boxSubSetResponse?.data?.rating,
    props.contentTitle,
    props.partnerSubscriptionType,
    props.releaseYear,
    boxSubSetResponse?.data?.releaseYear,
    props.actors,
    props.providerName,
    boxSubSetResponse?.data?.actor,
    responseSubscription,
    isAutoPlayed,
    props.liveContent,
    props.railTitle,
    props.sectionType,
    props.channelName,
    props.channelNumber,
    contentID,
    window.location.pathname
  ] );


  const { ref, focused, focusKey } = useFocusable( {
    onFocus,
    onEnterPress:()=>{
      piPageFocus.current = 'BUTTON_PRIMARY'
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false );
      if( direction === 'up' && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
        const selectedChipId = sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipDataList?.[selectedChipIndex]?.chipId : chipDataList?.[selectedChipIndex]?.id;
        if( selectedChipId ){
          const targetFocusKey = `BUTTON_FOCUS_${props.railId}${selectedChipId}`;
          setFocus( targetFocusKey );
        }
        return false
      }
      const indexOfCard = cardIndexValue + 1;
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) && hasPageContainCarouselList ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
      if( direction === 'up' && props.isFromBBARail ){
        setFocus( centerElementFocusKeyId )
        return false
      }
      if( direction === 'right' || direction === 'left' ){
        /* Mixpanel-event */
        card_horizontal_swipe( props.railTitle, props.railPosition, window.location.pathname, sectionSource )
      }
      if( direction === 'right' && indexOfCard === totalRailLength && isKeyReleased ){
        setLastCardIndex( true )
      }
      if( direction === 'right' && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && indexOfCard === totalRailLength ){
        return false
      }
      if( direction === 'right' && props.isFromBBARail && indexOfCard === totalRailLength ){
        return false
      }
      else {
        setLastCardIndex( false )
      }
    },
    isFocusBoundary:true,
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  useLayoutEffect( ()=>{
    if( isKeyReleased ){
      focused ? setIconFront( false ) : setIconFront( true )
    }
  }, [focused] )

  const contentClickEvent = ( ) => {
    if( props.source === constants.SEARCH_PAGE.TRENDING ){
      /* Mixpanel-event */
      home_clicks( props.source )
    }
    setMixpanelData( 'contentType', railContentType || ( sectionSource === SECTION_SOURCE.RECOMMENDATION ? MIXPANEL_CONTENT_TYPE.RECOMMENDED : MIXPANEL_CONTENT_TYPE.EDITORIAL ) )
    /* Mixpanel-event */
    storeRailData.current = { sectionSource, placeHolder, sectionType }
    const taUseCaseId = getTAUseCaseId( storeRailData.current )
    setChipData( props?.chipName, props?.chipPosition )
    content_click( MPItems, getSourceForMixPanel( window.location.pathname ), taUseCaseId, sectionSource, props?.chipName, props?.chipPosition )
  }

  const onEnterPressCallBackFn = () => {
    if( props.sectionSource === SECTION_SOURCE.CONTINUE_WATCHING ){
      isCWWatchingRailContentRef.current = true
    }
    imageCardSize && layoutTypeForMixPanel ? setMixpanelData( 'railType', ( `${imageCardSize}-${layoutTypeForMixPanel}-${props.railType}` ) ) :
      setMixpanelData( 'railType', ( `${props.railType}` ) )
    setContentPlaybackData( null )
    setMetaData( {
      ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
      provider: props.providerName,
      channelName: props.channelName
    } )
    setMixpanelData( 'contentView', storeRailData.leftMenuClickedWithDongle || constants.CONTENT_VIEW.HOME )
    props.sectionSource === SECTION_SOURCE.WATCHLIST ? setMixpanelData( 'bingeListSource', constants.CONTENT_VIEW.HOME ) : setMixpanelData( 'bingeListSource', '' )
    setLiveContent( props.liveContent || isLiveContentType( props.contentType ) );
    setPlayerAction( props?.playerAction )
    setBroadcastMode( props?.broadcastMode )
    if( window.location.pathname.includes( '/discover' ) ){
      setContentInfo( {} )
    }
    else {
      return;
    }

    contentClickEvent()
    let railUniqId = null
    if( sectionSource !== SECTION_SOURCE.DARSHAN_CHANNEL ){
      railUniqId = Number( `${props.railId}${contentID}` )
    }
    setTotalrailsList( Math.ceil( totalRails / 10 ) * 10 )
    setLastRailTitle( props.railTitle )
    railsRestoreId.current = railUniqId;
    checkRecRailRef.isrecommendedRail = sectionSource === SECTION_SOURCE.RECOMMENDATION
    railRestoreTitle.current = props.railTitle
    railCardTitle.current = props.title
    previousPathName.current = props.url
    previousPathName.subscriptionPath = null

    const args = {
      id: props.contentID,
      type: props.contentType,
      provider : props.providerName
    }

    const { liveChannelIds, subscriptionStatus } = myPlanProps || {};
    if( isDistroContent( props.providerName ) || isLiveContentType( contentType ) ){
      if( getAuthToken() && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, props.contentID ) ){
        handleDistroRedirection( history, args )
      }
      else {
        history.push( {
          pathname: props.url,
          args: {
            provider: props.providerName
          }
        } )
      }
    }
    else if( sectionSource === SECTION_SOURCE.MARKETING_ASSET && !!marketingAsset ){ //
      if( !getAuthToken() ){
        previousPathName.isFromPrimeMarketingAsset = true
        railsRestoreId.current = null
        previousPathName.current = window.location.pathname
        previousPathName.navigationRouting = window.location.pathname
        history.push( '/login' )
      }
      else if( getAuthToken() ){
        history.push( {
          pathname: myPlanProps?.appSelectionRequired ? '/plan/current' : '/plan/subscription'
        } );
      }
    }
    else if( sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
      previousPathName.liveFocused = `BUTTON_FOCUS_` + Number( `${props.railId}${contentID}` )
      if( getAuthToken() && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, props.contentID ) ){
        handleDistroRedirection( history, args )
      }
      else {
        previousPathName.liveFocused = `BUTTON_FOCUS_` + Number( `${props.railId}${props.contentList?.[0]?.id}` )
        history.push( {
          pathname: props.url
        } )
      }
    }
    else {
      history.push( {
        pathname: props.url
      } )
    }
    setTrailerCTA( 'View Trailer' )
    setTrailerResumeTime( 0 )
  }
  const getTrailerFromPlayBackAPI = ()=>{
    const newParams = {
      provider : props?.providerName,
      partnerContentId: props?.brandProviderContentId || props?.providerContentId,
      contentType: props?.contentType
    }
    if( !isEmptyObject( newParams ) ){
      fetchzeeTrailer( newParams )
    }
  }
  useEffect( () => {
    const isLastCard = getLastCardIndex();
    if( focused && params?.id ){
      const obj = {
        contentPosition: props.contentPosition,
        railPosition: props.railPosition,
        sectionType: props.sectionType,
        contentType: props.contentType,
        sectionSource: props.sectionSource,
        railTitle: props.railTitle,
        configType: props.configType,
        autoPlayed: isAutoPlayed,
        railId: props.railId,
        contentId: contentID,
        contentTitle: props.title,
        placeHolder: props.placeHolder,
        contentPartner: props.providerName
      }
      if( !window.location.pathname.includes( 'plan/subscription' ) && !window.location.pathname.includes( '/plan/change-tenure' ) ){
        setContentRailPositionData( obj )
      }

      props.setRailFocusedCardInfo && props.setRailFocusedCardInfo( MPItems );
      if( isKeyReleased && !isLastCard && Number( getLastFocusedSynopsisID() ) !== params?.id ){
        clearTimeout( timeOut );
        homeDonglePageData.current = null
        homeDonglePageData.current = storeDongleResponseInContext;
        setTrailerFromApi( )
        setTrailerContentCategory( )
        timeOut = setTimeout( () => {
          boxSubSetFetch( params );
          removeLastFocusedSynopsisID();
          if( props.providerName.toLowerCase() === PROVIDER_LIST.ZEE5 ){
            getTrailerFromPlayBackAPI()
          }
        }, 350 );
        if( isKeyReleased ){
          setTrailor_url( )
        }
      }
      previousPathName.playerScreen = null;
    }
  }, [focused, isKeyReleased] );

  useEffect( () => {
    if( boxSubSetResponse && sectionSource !== SECTION_SOURCE.DARSHAN_CHANNEL && !( props.liveContent || isLiveContentType( props.contentType ) ) ){
      setContentInfo( boxSubSetResponse )
      if( homeDonglePageData.current ){
        homeDonglePageData.current.description = boxSubSetResponse.data?.description
        homeDonglePageData.current.previewImage = boxSubSetResponse.data?.previewImage
        homeDonglePageData.current.rating = boxSubSetResponse.data?.rating
      }
    }
  }, [boxSubSetResponse] )

  useEffect( ()=>{
    if( zeeTrailerResponse && !zeeTrailerLoading ){
      if( zeeTrailerResponse.data?.url ){
        setTrailerFromApi( true )
        setTrailerContentCategory( 'TRAILER' )
        setTrailor_url( zeeTrailerResponse.data.url )
      }
    }
  }, [zeeTrailerResponse, zeeTrailerLoading] )

  return (
    <div className={ classNames( 'MediaCardWrapper', { 'MediaCardWrapper--withFocus': focused && openSeriesInfo,
      'MediaCardWrapper--focusAlignment': focused
    } ) }
    >
      <FocusContext.Provider value={ focusKey }>
        <div
          className={ classNames( 'MediaCard', { 'MediaCard--withFocus': focused } ) }
          focused={ focused ? focused.toString() : undefined }
          ref={ ref }
          onMouseEnter={ onMouseEnterCallBackFn }
          key={ props.contentID }
          onMouseUp={ onEnterPressCallBackFn }
        >
          <Link
            secondary={ true }
            url={ props.url }
            className='MediaCard--media'
          >
            <Image
              alt={ props.episodeTitle }
              src={ props.image }
            />
            {
              Boolean( props.liveContent ) && (
                <div className='MediaCard__liveContent'>
                  <div className='MediaCard__liveCircle' />
                  <Text color='white'>{ isSonyContent( props?.providerName ) ? props?.broadcastMode : constants.LIVE }</Text>
                </div>
              )
            }
            { props.timeBlock && !props.showTimeBlock && sectionSource !== SECTION_SOURCE.TITLE_RAIL && sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL &&
            <>
              <div className='MediaCard__cardTopGradiant'/>
              <div className='MediaCard__homePageTimeBlock'>
                <Text
                  textStyle='subtitle-4'
                  color='white'
                  textAlign='center'
                  htmlTag='span'
                >
                  { `${covertIntoMinutes( props.timeBlock )}m` }
                </Text>
              </div>
            </>

            }
            { sectionSource === constants.EPISODE_RAIL &&
              <div className='MediaCard__cardTitle'>
                <Text
                  color='white'
                  textAlign='center'
                  htmlTag='span'
                >
                  { props.title }
                </Text>
              </div>
            }
            { ( sectionSource === SECTION_SOURCE.TITLE_RAIL || sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) &&
              <>
                { ( isTitleEnabledLs || isChipTitleEnabledLs ) && <div className='MediaCard__timeBlock--title-rail'>
                  <Text
                    textStyle='subtitle-4'
                    color='white'
                    textAlign='center'
                    htmlTag='span'
                  >
                    { covertIntoMinutes( props.timeBlock ) >= 1 ? ( covertIntoMinutes( props.timeBlock ) >= 60 ? `${ Math.floor( covertIntoMinutes( props.timeBlock ) / 60 ) }h ${ covertIntoMinutes( props.timeBlock ) % 60 }m` : `${ covertIntoMinutes( props.timeBlock ) }m` ) : null }
                  </Text>
                </div> }
                { bannerColorCodeEnabled && (
                  <div className='MediaCard__SportsCardGradient' />
                ) }
                { ( isTitleEnabledLs || isChipTitleEnabledLs ) && (
                  <div className='MediaCard__SportsCardTitle'>
                    <Text
                      color='white'
                      textAlign='center'
                      htmlTag='span'
                    >
                      { props.title }
                    </Text>
                  </div>
                ) }
              </>
            }
            { sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL &&
              <div className='MediaCard__seriesSpecialRailTitleBox'>
                <Image
                  src={ bottom_span }
                  alt='ImageSeries'
                />
                <div
                  className='MediaCard__seriesSpecialRailTitleBox--Icon'
                >
                  <Icon
                    name='MediaCardPlay'
                  />
                </div>
                <div className='MediaCard__seriesSpecialRailTitleBox--title'>
                  <Text
                    color='white'
                    textAlign='center'
                    htmlTag='span'
                  >
                    { props.title }
                  </Text>
                </div>
              </div>
            }
            {
              !hideCrown && isLoadCrownImage && (
                <div className='MediaCard__crownLogo'>
                  <Icon
                    name='CrownWithBG'
                  />
                </div>
              )
            }
            {
              isLoadFreeTag && (
                <div className='MediaCard__episodeFree'>
                  <Text
                    textStyle='subtitle-4'
                    color='white'
                    textAlign='center'
                    htmlTag='span'
                  >
                    Free Episode
                  </Text>
                </div>
              )
            }
            {
              props.tag && (
                <div className='MediaCard__tagName'>
                  <Text
                    textStyle='subtitle-4'
                    color='white'
                    textAlign='center'
                    htmlTag='span'
                  >
                    { props.tag }
                  </Text>
                </div>
              )
            }
            { Boolean( ( !openSeriesInfo && props.provider && props.contractName !== constants.CONTRACT_NAME ) || ( props.contractName === constants.CONTRACT_NAME && !props.rentalExpiry ) ) && !bannerTitle && sectionSource !== SECTION_SOURCE.SERIES_SPECIAL_RAIL && !placeHolder?.includes( constants.BESTOF_APP ) && (
              <div className={ classNames(
                'MediaCard--provider', {
                  'MediaCard--provider--image' : PROVIDER_LIST_NEW_HEIGHT.includes( props.providerName.toLowerCase() ),
                  'MediaCard--provider--NewHeightimage' : PROVIDER_LIST_MORE_HEIGHT.includes( props.providerName.toLowerCase() )
                }
              ) }
              >
                <Image
                  src={ props.provider }
                  alt='provideImages'
                />
              </div>
            ) }
          </Link>
        </div>
        { props.contractName === 'RENTAL' && props.rentalExpiry && (
          <div className='MediaCard--expiry'>
            <Text textStyle='planCard-subtitle'
              textAlign='center'
              htmlTag='span'
            >{ timeDifferenceCalculate( props.rentalExpiry ) && `Expires in ${timeDifferenceCalculate( props.rentalExpiry )}` }</Text>
          </div>
        ) }
        { bannerTitle && (
          <div className='MediaCard__bannerTitle'>
            <Text
              color='white'
              textAlign='center'
              htmlTag='span'
            >{ bannerTitle }</Text>
          </div>
        ) }
      </FocusContext.Provider>
    </div>
  );
};

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} type - This is the type of Media card going forward (currently one of 'Portrait', 'Landscape')
   * @property {string} size - This is the type of size of Media card (currently one of 'small', 'Large')
   * @property {function} setIconFront - This method used to set the z-index of Topmedia icons on the basis of focus/blur
   * @property {string} image - This is the media Image
   * @property {string} episodeTitle - This is the media Title
   * @property {string} url - redirection url
   * @property {function} onFocus - set the onFocus
   * @property {string} provider - set the provider'
   * @property {string} contractName - set the contractName'
   * @property {string} timeBlock - set the timeBlock
   * @property {string} indicator - set the progress indicator
   * * @property {string} freeEpisodesAvailable - set the text if episode is free
   */
export const propTypes = {
  type: PropTypes.oneOf( ['landscape', 'portrait'] ),
  size: PropTypes.oneOf( ['small', 'large', 'top10'] ),
  setIconFront : PropTypes.func,
  episodeTitle: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  onFocus: PropTypes.func,
  provider: PropTypes.string,
  contractName: PropTypes.string,
  timeBlock: PropTypes.string,
  indicator: PropTypes.string,
  onClick: PropTypes.func,
  freeEpisodesAvailable: PropTypes.bool,
  partnerSubscriptionType: PropTypes.string,
  nonSubscribedPartnerList: PropTypes.array,
  providerName: PropTypes.string
};

/**
   * Default values for passed properties
   *
   * @type {object}
   * @property {string} type='landscape' - The media card type, default is landscape.
   * @property {string} size='small' - The media card size, default is small.
   */
export const defaultProps = {
  type: 'landscape',
  size: 'large',
  setIconFront : ()=>{}
};

HomeMediaCard.propTypes = propTypes;
HomeMediaCard.defaultProps = defaultProps;

export default HomeMediaCard;
