/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * Media card component for Genres rail item
 *
 * @module views/components/LiveMediaCard
 * @memberof -Common
 */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Image from '../Image/Image';
import Link from '../Link/Link';
import './LiveMediaCard.scss';
import { useHistory } from 'react-router-dom';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { getAuthToken, getDistroMeta, setContentRailPositionData, setDistroMeta } from '../../../utils/localStorageHelper';
import constants, { COMMON_HEADERS, DISTRO_CHANNEL, PARTNER_SUBSCRIPTION_TYPE, SECTION_SOURCE, CHANNEL_RAIL_TYPE, PROVIDER_LIST } from '../../../utils/constants';
import { getBingePrimeStatus, getBingePrimeStatusMixpanel, getSourceForMixPanel, getTAUseCaseId, handleDistroRedirection, MIXPANEL_RAIL_TYPE, setMixpanelData } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { content_click, channelBroadcasterClick, channelRailClick } from '../../../utils/mixpanel/mixpanelService';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { getChannelPlayableStatus } from '../../../utils/commonHelper';
/**
 * Represents a LiveMediaCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LiveMediaCard
 */
export const LiveMediaCard = function( props ){
  const { setCatalogFlag, setBingeListFlag, setSearchFlag, setContentParams, setContentInfo } = useHomeContext()
  const previousPathName = useNavigationContext()
  const { onFocus, focusKeyRefrence, url, railId, contentID, contentList, railTitle, sectionSource, clickOnLivePlay, totalRails, placeHolder, sectionType, setHomeCaroselInfo, isFromChannelRail, railType, broadCasterTitle, broadCasterPosition, channelLayoutType, totalNoChannelCards, currentChannelIndex, chipDataList, selectedChipIndex, isKeyReleased, previewPoster, secondaryText } = props;
  const { setLastRailTitle, setTotalrailsList, railsRestoreId, checkRecRailRef, railRestoreTitle, railCardTitle, storeRailData, topPositionRailValueContext, setLiveContent, catalogPagePatner, catalogPage, setCardSize, homeDonglePageData, donglePageData } = useMaintainPageState() || null
  const history = useHistory();
  const { profileAPIResult } = useProfileContext();
  const isAutoPlayed = useMemo( () => {
    return profileAPIResult?.data?.autoPlayTrailer ?
      MIXPANELCONFIG.VALUE.YES :
      MIXPANELCONFIG.VALUE.NO;
  }, [profileAPIResult] );
  const responseSubscription = useSubscriptionContext();
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack
  }, [responseSubscription] );
  const { setMetaData, metaData, setContentPlaybackData } = usePlayerContext()
  const { ref, focused } = useFocusable( {
    onFocus, onEnterPress: () => {
      setLiveContent( props.liveContent || isLiveContentType( props.contentType ) );
      if( window.location.pathname.includes( '/discover' ) || window.location.pathname.includes( '/browse-by-app/' ) ){
        onEnterPressCallBackFn()
      }
      else {
        const railUniqId = Number( `${props.railId + 1000}${contentID}` )
        railsRestoreId.current = railUniqId;
        clickOnLivePlay && clickOnLivePlay( contentID )
      }
    },
    onArrowPress:( direction )=>{
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
      else if( isFromChannelRail && railType === CHANNEL_RAIL_TYPE.COMPOSITE ){
        if( direction === 'up' ){
          const selectedChipId = chipDataList?.[selectedChipIndex]?.id;
          if( selectedChipId ){
            const targetFocusKey = `BUTTON_FOCUS_${railId}${selectedChipId}`;
            setFocus( targetFocusKey );
          }
          return false
        }
        else if( direction === 'right' ){
          return totalNoChannelCards !== currentChannelIndex
        }
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const storeDongleResponseInContext = useMemo( () => {
    const {
      title,
      releaseYear: year,
      genre,
      providerName: provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      metaDetails,
      tagInfoDTO,
      previewPoster,
      secondaryText,
      sectionSource,
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
      tagInfoDTO,
      previewPoster,
      secondaryText,
      sectionSource,
      description,
      image,
      contentType,
      id:contentID,
      contractName,
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
    props.sectionSource,
    props.previewPoster,
    props.secondaryText,
    props.description,
    props.image,
    props.contentType,
    props.contractName,
    props.imageCardSize,
    props.layoutTypeForMixPanel,
    contentID
  ] );

  const MPItems = {
    pageType: getSourceForMixPanel( window.location.pathname ),
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
    contentRating: '',
    contentTitle: props.contentTitle,
    contentAuth: props?.partnerSubscriptionType?.toLowerCase() !== PARTNER_SUBSCRIPTION_TYPE.FREE,
    releaseYear: props.releaseYear,
    deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    actors: props.actors?.join() || '',
    source: getSourceForMixPanel( window.location.pathname ),
    packPrice: responseSubscription?.responseData?.currentPack?.amountValue ? responseSubscription?.responseData?.currentPack?.amountValue : '',
    packName: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType ? responseSubscription?.responseData?.currentPack?.upgradeMyPlanType : '',
    autoPlayed: isAutoPlayed,
    liveContent: props.liveContent,
    railTitle: props.railTitle,
    sectionType: props.sectionType,
    channelName: props.channelName,
    channelNumber: props.channelNumber,
    bingePrimeStatus: getBingePrimeStatusMixpanel( responseSubscription ),
    bingePrimePackStatus: getBingePrimeStatus( responseSubscription )
  }
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

  const liveMediaCardRedirection = ()=>{
    if( window.location.pathname.includes( 'discover' ) ){
      previousPathName.liveFocused = `BUTTON_FOCUS_` + Number( `${props.railId}${contentList?.[0]?.id}` )
      history.push( url )
    }
    else {
      setContentParams( {
        type: props.contentType,
        id: props.contentID,
        ...( props.providerName === DISTRO_CHANNEL.appType && { distroProvider: props.providerName } ),
        provider: props?.providerName
      } )
      window.location.pathname.includes( '/browse-by' ) && (
        setCatalogFlag( true ),
        setMixpanelData( 'contentView', constants.CONTENT_VIEW.BROWSE_BY )
      )
      window.location.pathname.includes( '/binge-list' ) && (
        setBingeListFlag( true ),
        setMixpanelData( 'contentView', constants.CONTENT_VIEW.FAVORITE )
      )
      window.location.pathname.includes( '/Search' ) && (
        setSearchFlag( true ),
        setMixpanelData( 'contentView', constants.CONTENT_VIEW.SEARCH_RESULTS )
      )
    }
  }

  const onEnterPressCallBackFn = () => {
    setContentPlaybackData( null )
    setMetaData( {
      ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
      provider: props.providerName,
      channelName: props.channelName
    } )
    setDistroMeta( { ...getDistroMeta(), contentProviderId: props.providerContentId } )
    setContentInfo( {} )
    storeRailData.current = { sectionSource, placeHolder, sectionType }
    const taUseCaseId = getTAUseCaseId( storeRailData.current )
    sectionSource !== SECTION_SOURCE.BROWSE_BY_CHANNEL && content_click( MPItems, getSourceForMixPanel( window.location.pathname ), taUseCaseId )
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
      contentId: contentID
    }
    setContentRailPositionData( obj )
    catalogPage.fullLoader = true;
    const railUniqId = Number( `${props.railId + 1000}${contentID}` )
    railsRestoreId.current = railUniqId;
    setTotalrailsList( Math.ceil( totalRails / 10 ) * 10 )
    setLastRailTitle( props.railTitle )
    homeDonglePageData.current = storeDongleResponseInContext;
    checkRecRailRef.isrecommendedRail = sectionSource === SECTION_SOURCE.RECOMMENDATION
    railRestoreTitle.current = props.railTitle
    railCardTitle.current = props.title
    previousPathName.current = props.url
    previousPathName.subscriptionPath = null
    if( ( window.location.pathname.includes( 'discover' ) || window.location.pathname.includes( 'browse-by-app' ) ) && sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ){
      // mixpanel events
      const channelTitle = railType === CHANNEL_RAIL_TYPE.STANDALONE ? railTitle : broadCasterTitle
      const channelPosition = railType === CHANNEL_RAIL_TYPE.STANDALONE ? constants.DEFAULT : broadCasterPosition
      channelBroadcasterClick( MPItems, railType, getSourceForMixPanel( window.location.pathname ), channelTitle, channelPosition )
      channelRailClick( MPItems, railType, getSourceForMixPanel( window.location.pathname ), channelTitle, channelPosition )
      if( window.location.pathname.includes( 'browse-by-app' ) ){
        catalogPagePatner.current = focusKeyRefrence;
        catalogPagePatner.appRailStandaLoneBBChanelData = props.appRailData
      }
      setCardSize( props.imageCardSize )
      isFromChannelRail && history.push( {
        pathname: '/browse-by/catalogchannel',
        search: `?catalogchannel&title=${props?.contentTitle}&railId=${contentID}&layoutType=${channelLayoutType}`
      } )
      return
    }
    if( window.location.pathname?.toString().includes( 'app' ) ){
      setMixpanelData( 'railType', `${props?.size?.toUpperCase()}-${props?.type?.toUpperCase()}-${MIXPANEL_RAIL_TYPE.BROWSE_BY_APP}` )
      setMixpanelData( 'contentView', MIXPANELCONFIG.VALUE.BROWSE_BY_APP )
      setMixpanelData( 'playerSource', MIXPANELCONFIG.VALUE.BROWSE_BY_APP )
      catalogPagePatner.current = focusKeyRefrence
    }
    if( !getAuthToken() ){
      liveMediaCardRedirection();
    }
    else {
      previousPathName.liveFocused = `BUTTON_FOCUS_` + Number( `${props.railId}${contentID}` )
      const { liveChannelIds, subscriptionStatus } = myPlanProps || {}; // For live paywall
      if( getChannelPlayableStatus( liveChannelIds, subscriptionStatus, props.contentID ) ){
        const args = {
          id: props.contentID,
          type: props.contentType,
          provider : props.providerName
        }
        handleDistroRedirection( history, args )
      }
      else {
        liveMediaCardRedirection();
      }
    }
  }

  const handleError = ( img ) => {
    if( img ){
      // eslint-disable-next-line no-param-reassign
      img.style.border = '1px solid grey';
      // eslint-disable-next-line no-param-reassign
      img.style.backgroundColor = '#33354d';
    }

  }
  useEffect( () => {
    const img = document.getElementById( props.contentID );
    img && img.addEventListener( 'error', () => handleError( img ) );
    return () => img && img.removeEventListener( 'error', () => handleError( img ) )
  }, [props.contentID] )

  return (
    <div className={
      classNames( 'LiveMediaCard',
        { 'LiveMediaCard--withFocus': focused,
          'LiveMediaCard--newRailType': ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && railType?.toLowerCase() === constants.NEW.toLowerCase() ),
          'LiveMediaCard__channelRail': ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ),
          'LiveMediaCard__channelRail--withFocus': ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && focused ),
          'LiveMediaCard__channelRailStandalone': ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.STANDALONE )
        }
      ) }
    focused={ focused ? focused.toString() : undefined }
    ref={ ref }
    onMouseEnter={ props?.onMouseEnterCallBackFn }
    onMouseUp={ onEnterPressCallBackFn }
    >
      <Link
        // Remove url props because we are handling through onenterpresscallbackfn
        secondary={ true }
      >
        <Image
          alt={ props.title }
          src={ props.image }
          id={ props.contentID }
        />
      </Link>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - Title of the genre
 * @property {string} image - Genre poster image
 * @property {bool} isFocussed - If media card is focussed or not
 * @property {string} url - url to navigate to Genre page
 */
export const propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  isFocussed: PropTypes.bool,
  url: PropTypes.string
};

LiveMediaCard.propTypes = propTypes;

export default LiveMediaCard;
