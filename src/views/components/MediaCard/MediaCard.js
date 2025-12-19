/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/**
 * Common MediaCard component used by other modules as a reusable component which returns the ui for a media card.
 *
 * @module views/components/MediaCard
 * @memberof -Common
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Image from '../Image/Image';
import Link from '../Link/Link';
import Text from '../Text/Text';
import './MediaCard.scss';
import { useHistory } from 'react-router-dom';
import PISeriesDetails from '../PISeriesDetails/PISeriesDetails';
import Icon from '../Icon/Icon';
import { BoxSubSet, FetchZeeTagId, getLaunchAppID, getPathName, launchPartnerApp, getParamsTags, getContentType, ParentalPin, ContentInfo, PlayLA, checkAuthType } from '../../../utils/slayer/PlaybackInfoService';
import { countLine, timeDifferenceCalculate, covertIntoMinutes, getSourceForMixPanel, freeEpisodeTagForCrown, sendExecptionToSentry, getTAUseCaseId, redirection, setMixpanelData, handleDistroRedirection, compareBuildVersions, redirectToPlayStore, isCrownNew, contentPlayMixpanelEventForDeeplink, handleRedirectionParentalPinSetup, getBingePrimeStatusMixpanel, updateFibrePopUpMessage, getLArefuseCase, handleErrorMessage, getMixpanelData, showToastMsg, isIspEnabled, MIXPANEL_RAIL_TYPE, getVodID, getBrowsePageName } from '../../../utils/util';
import { CONTENT_TYPE, constants, SECTION_SOURCE, COMMON_HEADERS, PROVIDER_LIST, PROVIDER_LIST_NEW_HEIGHT, PAGE_NAME, deepLinkPartners, APPLETV, PARTNER_SUBSCRIPTION_TYPE, MIXPANEL_CONTENT_TYPE, SECURITY_CHECKSUM_VERBIAGES, MEDIA_CARD_TYPE, PROVIDER_LIST_MORE_HEIGHT, getPlatformTypeForTA, FORCE_UPDATE_POPUP, isTizen, FIBRE_PLAN, NOTIFICATION_RESPONSE, SENTRY_LEVEL, SENTRY_TAG, SDK_PARTNERS, APPLE_PRIME_ACTIVATION_JOURNEY, APPLE_ERROR_STATUS_KEYS, APPLE_REDIRECTION_KEYS, SubscriptionNotFoundData, DISTRO_CHANNEL, nonLiveTagProvidersOnPartnerPages } from '../../../utils/constants';
import { MediaCardService } from '../../../utils/slayer/MediaCardService';
import { getAuthToken, setContentRailPositionData, setLastCardIndex, getHotStarPopupCount, getAgeRating, setDistroMeta, getDistroMeta, getPrimeRedirectionPopupCount, getContentRailPositionData, getEpisodeList, setEpisodeList, setPrimeRedirectionPopupCount, getSmartTroubleshootingRefreshCount, setSmartTroubleshootingRefreshCount, setSmartTroubleshootingTrackEventCount, getSmartTroubleshootingTrackEventCount, getBaID, getFromAppMediaCard, getFromSportsMediaCard, setTrailerCTA, setTrailerContentCategory, setTrailerFromApi, setTrailerResumeTime, setChipData, setProviderName } from '../../../utils/localStorageHelper';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { content_click, home_clicks, results_click, card_horizontal_swipe, search_result_swipe, applePlayCtaClicked, player_play_event, zeroAppMixpanelEvents, appleErrorInfo, appleActivationError, primeRedirectionPopupClicked } from '../../../utils/mixpanel/mixpanelService';
import get from 'lodash/get';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import LaunchProviderPopup from '../LaunchProviderPopup/LaunchProviderPopup';
import { GetTagData, PlayingEventApiCalling, getMediaCardPlayableUrls, isDistroContent, isLiveContentType, isSonyContent } from '../../../utils/slayer/PlayerService';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import AppleJourneyModals from '../AppleJourneyModals/AppleJourneyModals';
import serviceConst from '../../../utils/slayer/serviceConst';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import ForceUpdatePopup from '../ForceUpdatePopup/ForceUpdatePopup';
import { AppleActivationRedemCode, AppleAndPrimeService } from '../../../utils/slayer/AmazonPrimeService';
import { handlePrimeCTA, handleStatusResponsePrime } from '../../../utils/primeHelper';
import { getChannelPlayableStatus, getProviderWithToken, getRefreshUserSubscription, getTrackMaTriggerFrequency } from '../../../utils/commonHelper';
import QRCodeSucess from '../QRCodeSucess/QRCodeSucess';
import FancodeDeeplinkPopup from '../FancodeDeeplinkPopup/FancodeDeeplinkPopup';
import { getAppleActivationFlagStatus, getAppleJourneyStatus, handleAppleInterstitialPageNav, handleApplePlayBackLG, handleApplePlayBackSamsung } from '../../../utils/appleHelper';
import PrimeJourneyModals from '../PrimeJourneyModals/PrimeJourneyModals';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { trackErrorEvents } from '../../../utils/logTracking';

/**
  * Represents a MediaCard component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns MediaCard
  */
let timeOut = null;
export const MediaCard = ( props ) => {
  let { type, onFocus, openSeriesInfo, contentType, contentID, epidsSet, playback_url, licenceUrl, providerName, providerContentId, focusKeyRefrence, isPlayable, openRelatedShowsInfo, previewPoster, secondaryText, setHomeCaroselInfo, setShowSynopsis, setBannerShow, setExpandShow, totalRailLength, cardIndexValue, totalRails, sectionSource, hideCrown, totalCatalogCardsLength, pageNumber, searchResults, inputValue, isFilterOpen, searchAutoCompleteRes, searchMaxCount, showFilter, selectedGen, selectedLang, railTitle, title, showKeyboardIcon, totalSearchResultsLength, totalepisodeListDataLength, totalepisodeListData, selectedSeason, showKeyboard, metaDetails, seriesInputValue, clickOnLivePlay, episodePageNumber, contentLanguageGenreIndex, languageGenreFilterLenth, partnerDeepLinkUrl, episodeDuration, freeEpisodesAvailable, contentRailType, sectionType, isRecommendation, placeHolder, directlyPlayable, showProvider = true, searchCount, totalepisodeListDataPagination, isKeyReleased = true, runtimePlaybackURLGenerationRequired, setShowNotification, setNotificationMessage, setNotificationIcon, layoutTypeForMixPanel, bannerTitle, bannerColorCodeEnabled, isTitleEnabledLs, showPlayButtonIcon, isChipTitleEnabledLs, chipDataList, selectedChipIndex } = props;
  const { selectedGenre, selectedLanguage } = props

  const [isCountLine, setCountLine] = useState( false );
  const [launchProviderPopupToTrue, setLaunchProviderPopupToTrue] = useState( false );
  const [appLaunch, setAppLaunch] = useState( false );
  const [appProviderState, setAppProviderState] = useState( '' )
  const [parentalPinStatus, setParentalPinStatus] = useState( false );
  const [restorefocusKey, setRestorefocusKey] = useState( null );
  const [showFibrePlanPopUp, setshowFibrePlanPopUp] = useState( false )
  const [appleButtonClick, setAppleButtonClick] = useState( null )
  const [showChecksumPopup, setshowChecksumPopup] = useState( false )
  const [showRecommenedUpdatePopup, setshowRecommenedUpdatePopup] = useState( false )
  const [fancodeDeeplinkPopup, setFancodeDeeplinkPopup] = useState( false )
  const [showPlayButton, setShowPlayButton] = useState( false );
  const [tagId, setTagId] = useState();
  const [qrCodeSuccess, setQRCodeSuccess] = useState( false );
  const [showCurrentAPIErrorPopup, setShowCurrentAPIErrorPopup] = useState( false )
  const [showActivateAppleErrorPopup, setShowActivateAppleErrorPopup] = useState( false )
  const [primeRedirectionPopup, setPrimeRedirectionPopup] = useState( null )
  const launchProviderRef = useRef();
  const checksumModalRef = useRef();
  const recommendedUpdatePopupRef = useRef();
  const fibrePlanModalRef = useRef();
  const fancodeDeeplinkPopupRef = useRef();
  const currentAPIErrorPopupRef = useRef();
  const activateAppleErrorPopupRef = useRef()
  const bottom_span = `${window.assetBasePath}bottom-span.png`;

  const history = useHistory();

  const { onLogin } = usePubNubContext();

  const { setContentParams, catalogFlag, setCatalogFlag, setBingeListFlag, setSearchFlag, searchFlag, setLiveSearchFlag, isValidCheckSum, bingeListFlag, contentInfo, setContentInfo } = useHomeContext();
  const previousPathName = useNavigationContext()
  const responseSubscription = useSubscriptionContext( );
  const { profileAPIResult } = useProfileContext();
  const { configResponse } = useAppContext();
  const { catalogPage, catalogPagePatner, setLastFocusFrom, lastFocusFrom, railsRestoreId, checkRecRailRef, donglePageData, catalogCardId, setSearchTotalData, searchPageData, searchCardId, episodeCardId, episodePageData, piPageFocus, liveContent, setLiveContent, storeRailData, playEventFromPopupRef, topPositionRailValueContext, flexiPlanVerbiagesContext, setIsLoginToggle, setPlayerAction, setBroadcastMode, selectedpartnerId, optionBba, isCWWatchingRailContentRef } = useMaintainPageState() || null
  const { setPlayBackTitle, setContentPlaybackData, metaData, setStoredLastWatchData, storedLastWatchData, setMetaData, contentPlaybackData, setTrailor_url, setTrailerCurrentTime, trailor_url } = usePlayerContext();
  const [parentalPin] = ParentalPin( { rating: props.masterRating } );
  const { parentalPinFetchData, parentalPinResponse, parentalPinError, parentalPinLoading } = parentalPin;

  const [contentInfoDetails] = ContentInfo()
  const { contentInfoFetchData, contentInfoResponse } = contentInfoDetails;

  const [addText] = MediaCardService();

  const zee5PartnerUniqueId = responseSubscription?.response?.data?.partnerUniqueIdInfo?.ZEE5?.partnerUniqueId;
  const tagObj = FetchZeeTagId( '', true, zee5PartnerUniqueId );
  const { tagFetchData, tagResponse } = tagObj;

  const [playerEventObj] = PlayingEventApiCalling( { contentID, episodeDuration, contentType, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;

  const getTagObj = GetTagData( '', true );
  const { fetchToken, getTokenResponse } = getTagObj;

  const isAutoPlayed = profileAPIResult && profileAPIResult.data?.autoPlayTrailer ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
  const myPlanProps = responseSubscription?.responseData.currentPack
  const { liveChannelIds, subscriptionStatus } = myPlanProps || {};
  const isPiPage = contentType === CONTENT_TYPE.TV_SHOWS || contentType === CONTENT_TYPE.SERIES;
  const { config } = configResponse;
  const miscellaneousVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.miscellaneousVerbiages, [flexiPlanVerbiagesContext.current] )
  const flexiPlanVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages, [flexiPlanVerbiagesContext.current] )
  const partnerSubscriptionVerbiage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.partnerSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )
  const applePendingToastMessage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage?.lsPendingToastMessage, [flexiPlanVerbiagesContext.current] )

  const [entitlementStatus] = AppleAndPrimeService();
  const { entitlementStatusFetchData, entitlementStatusResponse, entitlementStatusError, entitlementStatusLoading } = entitlementStatus;

  const params = {
    type: contentType,
    id: contentID
  }
  const [boxSubSetObj] =  BoxSubSet( params, true, false )
  const { boxSubSetFetch, boxSubSetResponse, boxSubSetError, boxSubSetLoading } = boxSubSetObj;

  const refUsecase = getLArefuseCase( config, metaData?.contentType, null, bingeListFlag, searchFlag, catalogFlag )
  const parentInfo = getContentRailPositionData() || {};

  const [playLAData] = PlayLA( { type: parentInfo.contentType, id:parentInfo.contentId, provider: metaData?.provider, taShowType: metaData?.taShowType, vodId: getVodID( metaData ), refUsecase: refUsecase } );
  const { addPlayLA } = playLAData;

  const [appleActivationCodeRedemption] = AppleActivationRedemCode( true );
  const { appleFetchData, appleRedemptionResponse, appleRedemptionError } = appleActivationCodeRedemption;

  const configAuthToken = checkAuthType( config.availableProviders, metaData?.provider );
  const storeDongleResponseInContext = {
    title: props.title,
    year: props.releaseYear,
    genre: props.genre,
    provider: props.providerName,
    partnerSubscriptionType: props.partnerSubscriptionType,
    language: props.language,
    description: props.description,
    image: props.image,
    contentType: props.contentType,
    contractName: props.contractName,
    metaDetails: props.metaDetails,
    languagesGenres: props.languagesGenres,
    previewPoster: props.previewPoster,
    secondaryText: props.secondaryText,
    tagInfoDTO: props.tagInfoDTO
  }
  const MPItems = {
    pageType: getSourceForMixPanel( window.location.pathname ),
    title: props.title,
    railPosition: props.railPosition,
    contentType: props.contentType,
    sectionSource: props.sectionSource,
    language: props.language?.join() || '',
    primaryLanguage: props.language?.[0] || '',
    genre: props.genre || '',
    primaryGenre: props.genre?.[0] || '',
    provider: props.providerName,
    contentPosition: props.contentPosition,
    contentRating: boxSubSetResponse?.data?.rating,
    contentTitle: props.contentTitle,
    contentAuth:  props.partnerSubscriptionType && props.partnerSubscriptionType.toLowerCase() !== PARTNER_SUBSCRIPTION_TYPE.FREE,
    releaseYear: props.releaseYear,
    deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    actors: props.actors?.join() || '',
    source: getSourceForMixPanel( window.location.pathname ),
    packPrice: responseSubscription?.responseData?.currentPack?.amountValue ? responseSubscription?.responseData?.currentPack?.amountValue : '',
    packType: responseSubscription?.responseData?.currentPack?.subscriptionType ? responseSubscription?.responseData?.currentPack?.subscriptionType : '',
    packName: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType ? responseSubscription?.responseData?.currentPack?.upgradeMyPlanType : '',
    autoPlayed: profileAPIResult && profileAPIResult.data?.autoPlayTrailer ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    liveContent: props.liveContent,
    railTitle: props.railTitle,
    sectionType: props.sectionType,
    channelName: props.channelName,
    channelNumber: props.channelNumber,
    rating: props.rating,
    bingePrimeStatus: getBingePrimeStatusMixpanel( responseSubscription ),
    searchInputValue: inputValue,
    id: contentID
  }

  const setPlaybackDataFromEpisodeDetails = () => {
    return { playback_url, licenceUrl, providerName, providerContentId, playBackTitle: title, epidsSet, contentType, vodId: props.contentID };
  }

  const getPlaybackDataFromContentList = () => {
    let playback_url = null;
    let licenceUrl = null;
    let providerName = null;
    let providerContentId = null;
    let playBackTitle = null;
    let epidsSet = null;
    let vodId = null;
    let season = null;
    let episode = null;
    if( props.contentList?.[cardIndexValue]?.provider === PROVIDER_LIST.SHEMAROO_ME ){
      playback_url = props.contentList[cardIndexValue]?.detail?.partnerDeepLinkUrl;
    }
    // else if( props.contentList[cardIndexValue].provider?.toLowerCase() === PROVIDER_LIST.VROTT || props.contentList[cardIndexValue].provider?.toLowerCase() === PROVIDER_LIST.KOODE || props.contentList[cardIndexValue].provider?.toLowerCase() === PROVIDER_LIST.REELDRAMA || props.contentList[cardIndexValue].provider?.toLowerCase() === PROVIDER_LIST.SHORSTTV || props.contentList[cardIndexValue].provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
    else if( configAuthToken === 'JWTToken' || props.contentList[cardIndexValue]?.provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
      playback_url = props.contentList[cardIndexValue]?.detail?.dashWidewinePlayUrl;
      licenceUrl = props.contentList[cardIndexValue]?.detail?.dashWidewineLicenseUrl;
      const offerId = props.contentList[cardIndexValue]?.detail?.offerId;
      epidsSet = get( offerId, 'epids' );
    }
    else {
      playback_url = props.contentList[cardIndexValue]?.detail?.playUrl;
    }
    providerContentId = props.contentList[cardIndexValue].providerContentId;
    playBackTitle = props.contentList[cardIndexValue].title;
    providerName = props.contentList[cardIndexValue].provider;
    contentType = props.contentList[cardIndexValue].contentType;
    vodId = props.contentList[cardIndexValue].id;
    season = props.contentList[cardIndexValue]?.season || '';
    episode = props.contentList[cardIndexValue]?.episodeNumber || '';

    return { playback_url, licenceUrl, providerName, providerContentId, playBackTitle, epidsSet, vodId, season, episode };
  }

  const playableMediaCardData = openSeriesInfo ? getPlaybackDataFromContentList() : ( isPlayable ? setPlaybackDataFromEpisodeDetails() : [] );

  const { ref, focused, focusKey } = useFocusable( {
    onFocus,
    onEnterPress:()=>{
      piPageFocus.current = 'BUTTON_PRIMARY'
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      const indexOfCard = cardIndexValue + 1
      lastFocusFrom && setLastFocusFrom( false )
      if( direction === 'up' && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
        const selectedChipId = sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipDataList?.[selectedChipIndex]?.chipId : chipDataList?.[selectedChipIndex]?.id;
        if( selectedChipId ){
          const targetFocusKey = `BUTTON_FOCUS_${props.railId}${selectedChipId}`;
          setFocus( targetFocusKey );
        }
        return false
      }
      if( direction === 'up' && props.cardTopIndexes <= 3 ){
        return false
      }
      if( direction === 'right' && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && indexOfCard === totalRailLength ){
        return false
      }
      if( direction === 'right' && catalogCardId.current === totalCatalogCardsLength ){
        return false
      }
      if( direction === 'right' && searchCardId.current === totalSearchResultsLength ){
        return false
      }
      if( direction === 'right' && episodeCardId.current === totalepisodeListDataLength ){
        return false
      }
      if( props.prevPath === '/Search' ){
        /* Mixpanel-event */
        search_result_swipe( inputValue )
      }
      if( direction === 'up' && languageGenreFilterLenth === 0 && [0, 1, 2, 3].includes( contentLanguageGenreIndex ) ){
        return false
      }
      if( direction === 'up' && topPositionRailValueContext.current === 0 ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
      if( direction === 'up' && openRelatedShowsInfo ){
        setShowSynopsis && setShowSynopsis( false )
        setBannerShow && setBannerShow( true );
      }
      if( direction === 'up' ){
        setExpandShow && setExpandShow( false )
      }
      if( direction === 'right' || direction === 'left' ){
        /* Mixpanel-event */
        card_horizontal_swipe( props.railTitle, props.railPosition, window.location.pathname, sectionSource )
      }
      if( direction === 'right' && indexOfCard === totalRailLength ){
        setLastCardIndex( true )
      }
      if( direction && window.location.pathname.includes( '/browse-by-app/' ) && !props.railTitle?.includes( 'Related' ) && trailor_url ){
        setTrailor_url()
      }
      else {
        setLastCardIndex( false )
      }
      return true
    },
    isFocusBoundary:true,
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const hideFibrePlanPopup = () =>{
    setshowFibrePlanPopUp( false )
    fibrePlanModalRef.current?.close()
    setTimeout( ()=> setFocus( restorefocusKey ), 100 )
    setRestorefocusKey( null )
  }
  const openFibrePlanPopup = () => {
    setshowFibrePlanPopUp( true )
    setTimeout( () =>{
      fibrePlanModalRef.current?.showModal();
    }, 20 )
  }

  const handleSubscriptionRedirection = ( boolean ) => { // todo
    let flag = true;
    try {
      const refreshUserSubscription = getRefreshUserSubscription( config );
      const trackMaTriggerFrequency = getTrackMaTriggerFrequency( config );
      if( refreshUserSubscription >= 1 && getSmartTroubleshootingRefreshCount() < refreshUserSubscription ){
        flag = false;
        setSmartTroubleshootingRefreshCount( getSmartTroubleshootingRefreshCount() + 1 );
        onLogin( true, { playCTAClicked: true, provider: providerName } );
      }
      else if( trackMaTriggerFrequency === 0 || ( trackMaTriggerFrequency >= 1 && getSmartTroubleshootingTrackEventCount() < trackMaTriggerFrequency && refreshUserSubscription >= getSmartTroubleshootingTrackEventCount() ) ){
        trackErrorEvents( MIXPANELCONFIG.EVENT.SUBSCRIBE_DETAILS_MATCHED, { ...SubscriptionNotFoundData } )
        trackMaTriggerFrequency !== 0 && setSmartTroubleshootingTrackEventCount( getSmartTroubleshootingTrackEventCount() + 1 )
      }
    }
    catch ( err ){
      console.log( 'Error in Smart Troubleshooting Keys.', err )
    }
    finally {
      if( flag ){
        if( boolean ){
          previousPathName.current = window.location.pathname
          previousPathName.navigationRouting = window.location.pathname
        }
        selectedpartnerId.current = metaData.partnerId
        history.push( redirection( myPlanProps ) )
      }
    }
  }

  const handlePlayerClick = () => {
    if( !getAuthToken() ){
      setshowChecksumPopup( false )
      previousPathName.current = window.location.pathname
      previousPathName.navigationRouting = window.location.pathname
      setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.PLAYBACK )
      setIsLoginToggle( true )
      history.push( '/login' )
    }
    else if( getAuthToken() ){
      const isPaidContent = isCrownNew( myPlanProps, { ...props, provider: props.providerName }, true );
      if( isPaidContent && responseSubscription && ( responseSubscription.error?.response?.data?.message || ( responseSubscription.response && responseSubscription.response.code !== 0 ) ) ){
        clearEpisodePageDataQRcodeUsecasesFn()
        // Calling Current API incase of Upstream error in current API ( Ajay Aligned )
        responseSubscription?.setBaid?.( 0 );
        setTimeout( () => {
          responseSubscription?.setBaid?.( getBaID() );
        }, 0 );
        setTimeout( () =>{
          openCurrentSubscriptionPopup()
        }, 20 )
      }
      else if( ( showPlayButton || isPlayable ) && configAuthToken?.toLowerCase() === constants.AUTH_TYPE_UNKNOWN && compareBuildVersions( COMMON_HEADERS.VERSION, configResponse.app.appUpgrade[getPlatformTypeForTA()].recommendedVersion ) ){
        clearEpisodePageDataQRcodeUsecasesFn()
        setTimeout( () => {
          openRecommendedUpdatePopup()
        }, 400 )
      }
      else if( ( showPlayButton || isPlayable ) && props.partnerSubscriptionType === constants.PREMIUM && !isValidCheckSum ){
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        clearEpisodePageDataQRcodeUsecasesFn()
        setshowChecksumPopup( true )
        setTimeout( () =>{
          checksumModalRef.current?.showModal();
        }, 20 )
        player_play_event( MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL, null, metaData, props, getMixpanelData( 'playerSource' ), myPlanProps, miscellaneousVerbiages?.restrictPlayBackMixPanelReason || SECURITY_CHECKSUM_VERBIAGES.restrictPlayBackMixPanelReason, 0, 0, 0, 0, taUseCaseId, false, responseSubscription, null );
      }
      else if( isPaidContent ){
        previousPathName.current = window.location.pathname
        previousPathName.navigationRouting = window.location.pathname
        const isFibrePack = isIspEnabled( myPlanProps )
        if( isFibrePack ){
          clearEpisodePageDataQRcodeUsecasesFn()
          openFibrePlanPopup()
        }
        else if( providerName?.toLowerCase() === flexiPlanVerbiages?.partnerForFDORaised?.toLowerCase() && flexiPlanVerbiages?.partnerChangeFDORaised ){
          clearEpisodePageDataQRcodeUsecasesFn()
          setAppleButtonClick( APPLETV.UPGRADEBUTTON )
        }
        else if( myPlanProps?.appSelectionRequired ){
          setMixpanelData( 'zeroAppSource', 'CONTENTPLAYBACK' )
          clearEpisodePageDataQRcodeUsecasesFn()
          setQRCodeSuccess( true )
        }
        else if( getAgeRating() && getAgeRating() !== constants.NO_RESTRICTION ){
          handleRedirectionParentalPinSetup( history, { subscriptionSuccess: true } )
        }
        else {
          handleSubscriptionRedirection();
        }
      }
      else if( getProviderWithToken( providerName, PROVIDER_LIST.PRIME ) ){
        handlePrimeCTA( myPlanProps, entitlementStatusFetchData, parentalPinFetchData, handleSubscriptionRedirection );
      }
      else if( getProviderWithToken( providerName, PROVIDER_LIST.APPLETV ) ){
        if( isTizen ){
          handleApplePlayBackSamsung( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon )
        }
        else {
          handleApplePlayBackLG( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, applePendingToastMessage, setNotificationIcon, responseSubscription, previousPathName, parentalPinFetchData, playEventFromPopupRef, MPItems )
        }
      }
      else if( providerName?.toLowerCase() === PROVIDER_LIST.FANCODE && metaData?.runtimePlaybackURLGenerationRequired ){
        if( contentPlaybackData.playBackType === constants.DEEPLINK ){
          clearEpisodePageDataQRcodeUsecasesFn()
          setTimeout( () => {
            openFancodeDeeplinkContentPopup()
          }, 20 )
        }
      }
      else {
        parentalPinFetchData()
      }

    }
  }

  const handleAppleTVFn = () => {
    setAppleButtonClick( APPLETV.PLAYBUTTON )
  }

  const handlePrimeAppInstall = ( pinRequired ) => {
    if( getPrimeRedirectionPopupCount() >= config?.primeVerbiages?.primePopUpFrequency?.launchFrequency ){
      if( pinRequired ){
        const args = {
          providerName: providerName,
          contentId: playableMediaCardData?.providerContentId,
          contentType: contentType
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null, inputValue )
        playerEventFetchData( { type: contentType, id: playableMediaCardData?.vodId, watchDuration: 10 } );
        launchPartnerApp( providerName, providerContentId, '', '', 0 );
      }
    }
    else {
      primeRedirectionPopupClicked( responseSubscription );
      setPrimeRedirectionPopupCount( getPrimeRedirectionPopupCount() + 1 )
      setPrimeRedirectionPopup( true )
    }
  }

  const handleHotStarAppInstall = ( pinRequired ) => {
    if( getHotStarPopupCount() >= config?.hotstarPopup?.launchFrequency ){
      if( pinRequired ){
        const args = {
          providerName: providerName,
          contentId: providerContentId,
          partnerDeepLinkUrl: partnerDeepLinkUrl,
          contentType: contentType === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : contentType
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null, inputValue )
        playerEventFetchData( { type: contentType, id: playableMediaCardData?.vodId, watchDuration: 10 } );
        // hotstar do not require content type, hence passing undefined
        launchPartnerApp( providerName, getParamsTags( providerName, partnerDeepLinkUrl, tagId, providerContentId ), undefined, liveContent );
      }
    }
    else {
      setAppLaunch( true )
      setAppProviderState( providerName )
      setLaunchProviderPopupToTrue( true )
      playerEventFetchData( { type: contentType, id: playableMediaCardData?.vodId, watchDuration: 10 } );
      setTimeout( () => {
        launchProviderRef?.current?.showModal();
      }, 100 );
    }
  }

  const checkAppInstalled = ( pinRequired ) => {
    console.log( 'INSIDE CHECK INSTALLED APP' ); //  eslint-disable-line
    setRestorefocusKey( focusKeyRefrence )
    window.webOS && webOS.service.request( 'luna://com.webos.applicationManager', {
      method: 'getAppLoadStatus',
      parameters: { appId: getLaunchAppID( providerName ) },
      onSuccess: function( inResponse ){
        if( inResponse?.exist && providerName ){
          if( providerName.toLowerCase() === PROVIDER_LIST.HOTSTAR ){
            handleHotStarAppInstall( pinRequired )
          }
          else if( providerName.toLowerCase() === PROVIDER_LIST.ZEE5 ){
            tagFetchData();
          }
          else if( providerName?.toLowerCase() === PROVIDER_LIST.APPLETV ){
            if( !pinRequired ){
              const taUseCaseId = getTAUseCaseId( storeRailData.current );
              contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null, inputValue )
              playerEventFetchData( { type: contentType, id: playableMediaCardData?.vodId, watchDuration: 10 } );
              launchPartnerApp( providerName, getParamsTags( providerName, partnerDeepLinkUrl, '', '' ), contentType === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : contentType, liveContent );
            }
            else if( pinRequired ){
              const args = {
                providerName: providerName,
                contentId: playableMediaCardData?.vodId,
                partnerDeepLinkUrl: partnerDeepLinkUrl,
                contentType: contentType
              }
              handleRedirectionParentalPinSetup( history, args )
            }
          }
          else if( providerName.toLowerCase() === PROVIDER_LIST.JIO_CINEMA ){
            if( !pinRequired ){
              const taUseCaseId = getTAUseCaseId( storeRailData.current );
              contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null, inputValue )
              playerEventFetchData( { type: contentType, id: playableMediaCardData?.vodId, watchDuration: 10 } );
              launchPartnerApp( providerName, getParamsTags( providerName, '', '', playableMediaCardData?.providerContentId ), contentType === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : contentType, liveContent, 0 ); // TODO: need to pass lastWatchSeconds
            }
            else {
              const args = {
                providerName: providerName,
                contentId: playableMediaCardData?.providerContentId,
                contentType: contentType
              }
              handleRedirectionParentalPinSetup( history, args )
            }
          }
          else if( providerName.toLowerCase() === PROVIDER_LIST.LIONSGATE ){
            fetchToken();
          }
          else if( providerName.toLowerCase() === PROVIDER_LIST.PRIME ){
            handlePrimeAppInstall( pinRequired )
          }
        }
        else {
          setAppLaunch( false )
          setLaunchProviderPopupToTrue( true )
          setTimeout( () => {
            launchProviderRef?.current?.showModal();
          }, 100 );
        }
      },
      onFailure: function( inError ){
        console.log( 'Failed to check app installation' );
        console.log( '[' + inError.errorCode + ']: ' + inError.errorText, getLaunchAppID( providerName ), 'check app installation' );
        sendExecptionToSentry( inError, `${ SENTRY_TAG.APP_INSTALLATION_FAILED } ${ providerName } ${ getLaunchAppID( providerName ) }`, SENTRY_LEVEL.ERROR );
        // To-Do something
      }
    } );
  }

  const hideLaunchProviderModal = () => {
    setLaunchProviderPopupToTrue( false )
    launchProviderRef?.current?.close();
    setTimeout( ()=> setFocus( restorefocusKey ), 100 )
    setRestorefocusKey( null )
  };

  const contentClickEvent = ( ) => {
    props.mediaCardType === MEDIA_CARD_TYPE.WATCHLIST ? setMixpanelData( 'bingeListSource', constants.BINGELIST_PAGE ) : setMixpanelData( 'bingeListSource', '' )
    storeRailData.current = { sectionSource: isRecommendation, placeHolder, sectionType }
    const taUseCaseId = getTAUseCaseId( storeRailData.current )
    setMixpanelData( 'browsepagename', getBrowsePageName( window.location.pathname, previousPathName ) )
    if( props.source === constants.SEARCH_PAGE.TRENDING ){
      home_clicks( props.source )
    }
    if( props.source === MIXPANELCONFIG.VALUE.SEARCH ){
      setMixpanelData( 'contentType', MIXPANEL_CONTENT_TYPE.SEARCH )
      results_click( props )
    }
    setChipData( props?.chipName, props?.chipPosition, sectionSource )
    content_click( MPItems, getSourceForMixPanel( window.location.pathname ), taUseCaseId, sectionSource, props?.chipName, props?.chipPosition )
  }

  const mediaCardUrls = async( focusedMedia ) => {
    const urls = await getMediaCardPlayableUrls( myPlanProps, focusedMedia, config, epidsSet )
    setContentPlaybackData( urls )
  }

  const onEnterPressCallBackFn = () => {
    if( contentRailType === constants.RELATED_CONTENT ){
      isCWWatchingRailContentRef.current = false
    }
    setTrailerCTA( 'View Trailer' )
    setTrailerResumeTime( 0 )
    setTrailerCurrentTime( null )
    setTrailor_url()
    setTrailerContentCategory( )
    setTrailerFromApi()

    props.setIsFocusOnEpisode?.( false );
    setContentPlaybackData( null )
    setMetaData( {
      ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
      provider: providerName,
      vodId: playableMediaCardData?.vodId,
      channelName: props.channelName
    } )
    setMixpanelData( 'searchResultClick', true )
    if( props.contentList?.length > 0 ){
      const focusedMedia  = props.contentList[cardIndexValue]
      if( !isLiveContentType( contentType ) && ( showPlayButton || isPlayable || isPiPage ) && providerName && !deepLinkPartners.includes( providerName.toLowerCase() ) && !SDK_PARTNERS.includes( providerName.toLowerCase() ) ){
        setMetaData( focusedMedia )
        mediaCardUrls( focusedMedia )
      }
    }
    getAuthToken() && setRestorefocusKey( focusKeyRefrence )
    isDistroContent( props.providerName ) && setDistroMeta( { ...getDistroMeta(), contentProviderId: props.providerContentId } )
    props?.callBackFn && props.callBackFn()
    setLiveContent( props.liveContent || isLiveContentType( props.contentType ) );
    setPlayerAction( props?.playerAction )
    setBroadcastMode( props?.broadcastMode )
    checkRecRailRef.isrecommendedRail = sectionSource === SECTION_SOURCE.RECOMMENDATION

    if( isLiveContentType( contentType ) && props.focusFromLiveMoreLikeThis ){ // This is for playback of live content when selected card from more like this
      if( getChannelPlayableStatus( liveChannelIds, subscriptionStatus, contentID ) ){
        history.push( {
          pathname:  getPathName( metaData.provider, null, metaData.contentType ),
          args: {
            type: contentType,
            id: contentID,
            provider: metaData.provider
          }
        } )
      }
      else {
        props.handlePlayerClickFromPI();
      }
    }

    if( directlyPlayable ){
      setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${MIXPANEL_RAIL_TYPE.MORE_EPISODES}` )
      setMixpanelData( 'contentType', MIXPANEL_CONTENT_TYPE.EDITORIAL )
      if( window.location.pathname.includes( '/content/detail' ) ){
        // ...
      }
      else if( window.location.pathname.includes( '/content/episode' ) ){
        episodePageData.mediaCardRestoreId = focusKeyRefrence
        episodePageData.cardId = props.episodeRestoreId
        episodePageData.selectedSeason = selectedSeason
        episodePageData.showKeyboard = showKeyboard
        episodePageData.seriesInputValue = seriesInputValue
        episodePageData.totalCards = totalepisodeListData
        episodePageData.totalCardsPagination = totalepisodeListDataPagination
        episodePageData.episodePageNumber = episodePageNumber
      }
      handlePlayerClick()
      contentClickEvent()
      return
    }
    if( window.location.pathname.includes( '/content/hero-banner-rail' ) ){
      setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${MIXPANEL_RAIL_TYPE.SYSTEM_GENERATED }` )
      setMixpanelData( 'contentType', MIXPANEL_CONTENT_TYPE.AUTOMATED )
      const railUniqId = Number( `${props.railId + 1000 }${contentID}` )
      railsRestoreId.current = null;
      railsRestoreId.heroBannerRail = railUniqId;
      if( isLiveContentType( contentType ) && getAuthToken() && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, contentID ) ){
        const args = {
          id: contentID,
          type: contentType,
          provider: props.providerName
        }
        handleDistroRedirection( history, args )
      }
      else {
        history.push( {
          pathname: props.url,
          args: {
            rentalExpiry: props.rentalExpiry
          }
        } )
      }
    }
    else if( window.location.pathname.includes( '/Search' ) ){
      const _provider = providerName || metaData?.provider;
      setContentParams( {
        type: props.contentType,
        id: props.contentID,
        ...( _provider === DISTRO_CHANNEL.appType && { distroProvider: _provider } ),
        provider: _provider
      } )
      setSearchFlag( true )
      props.railType && setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${props.railType }` )
      setMixpanelData( 'contentType', isRecommendation ? MIXPANEL_CONTENT_TYPE.RECOMMENDED : MIXPANEL_CONTENT_TYPE.EDITORIAL )
      setMixpanelData( 'contentView', constants.CONTENT_VIEW.SEARCH )
      setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.SEARCH )
      previousPathName.storeLiveData = []
      if( isLiveContentType( contentType ) && getAuthToken() && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, contentID ) ){
        setLiveSearchFlag( true )
        const args = {
          id: contentID,
          type: contentType,
          provider: props.providerName
        }
        handleDistroRedirection( history, args )
      }
      if( props.searchText && getAuthToken() ){
        addText.addTextFetchData( { searchText: props.searchText } )
      }
      if( !searchFlag ){
        const searchLeftPanelOpen = document.querySelector( '.Search__containerLeft' ) !== null
        const searchScrollPosition = document.querySelector( '.Search__scrollContainer' )?.scrollTop
        setSearchTotalData( searchResults )
        searchPageData.searchPageNumber = pageNumber
        searchPageData.mediaCardRestoreId = focusKeyRefrence
        searchPageData.leftPanelOpen = searchLeftPanelOpen
        searchPageData.searchedInputValue = inputValue
        searchPageData.isFilterOpen = isFilterOpen
        searchPageData.searchAutoCompleteRes = searchAutoCompleteRes
        searchPageData.searchMaxCount = searchMaxCount
        searchPageData.showFilter = showFilter
        searchPageData.selectedGen = selectedGen
        searchPageData.selectedLang = selectedLang
        searchPageData.railTitle = railTitle
        searchPageData.showKeyboardIcon = showKeyboardIcon
        searchPageData.scrollTop = searchScrollPosition
        searchPageData.searchCount = searchCount
      }
    }
    else if( window.location.pathname.includes( '/browse-by' ) ){
      setMixpanelData( 'contentType', isRecommendation ? MIXPANEL_CONTENT_TYPE.RECOMMENDED : MIXPANEL_CONTENT_TYPE.EDITORIAL )
      const _provider = providerName || metaData?.provider;
      setContentParams( {
        type: props.contentType,
        id: props.contentID,
        provider: _provider,
        ...( _provider === DISTRO_CHANNEL.appType && { distroProvider: _provider } )
      } )
      setCatalogFlag( true )
      if( window.location.pathname?.toString().includes( 'language' ) ){
        setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${( props.railType || MIXPANEL_RAIL_TYPE.BROWSE_BY_LANGUAGE )}` )
        setMixpanelData( 'contentView', MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE )
        setMixpanelData( 'playerSource', MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE )
      }
      else if( window.location.pathname?.toString().includes( 'catalogchannel' ) ){
        setMixpanelData( 'railType', `${( props.cardSize || props.size )?.toUpperCase()}-${layoutTypeForMixPanel}-${( props.railType || MIXPANEL_RAIL_TYPE.BROWSE_BY_CHANNEL ) }` )
        setMixpanelData( 'contentView', MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL )
        setMixpanelData( 'playerSource', MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL )
        setMixpanelData( 'channelName', props.catalogHeader || '' )
      }
      else if( window.location.pathname?.toString().includes( 'genre' ) ){
        setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${( props.railType || MIXPANEL_RAIL_TYPE.BROWSE_BY_GENRE ) }` )
        setMixpanelData( 'contentView', MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE )
        setMixpanelData( 'playerSource', MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE )
      }
      else if( window.location.pathname?.toString().includes( 'app' ) ){
        setMixpanelData( 'railType', `${props?.imageCardSize?.toUpperCase() || props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${( props.railType || MIXPANEL_RAIL_TYPE.BROWSE_BY_APP )}` )
        setMixpanelData( 'contentView', MIXPANELCONFIG.VALUE.BROWSE_BY_APP )
        setMixpanelData( 'playerSource', MIXPANELCONFIG.VALUE.BROWSE_BY_APP )
        if( contentRailType !== constants.RELATED_CONTENT ){
          catalogPagePatner.current = focusKeyRefrence
        }
      }
      else {
        setMixpanelData( 'contentView', constants.CONTENT_VIEW.BROWSE_BY )
        setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.BROWSE_BY )
      }
      previousPathName.storeLiveData = []
      if( isLiveContentType( contentType ) && getAuthToken() && getChannelPlayableStatus( liveChannelIds, subscriptionStatus, contentID ) ){
        setLiveSearchFlag( true );
        const args = {
          id: contentID,
          type: contentType,
          provider: props.providerName
        }
        handleDistroRedirection( history, args )
      }
      if( !catalogFlag ){
        catalogPage.appRailData = props.appRailData
        catalogPage.totalCards = props.catalogResults
        catalogPage.totalButtons = props.buttonResults
        catalogPage.current = focusKeyRefrence
        catalogPage.selectedGenre = selectedGenre?.length > 0 ? selectedGenre : null
        catalogPage.selectedLanguage = selectedLanguage?.length > 0 ? selectedLanguage : null
      }
    }
    else if( window.location.pathname.includes( '/binge-list' ) ){
      const _provider = providerName || metaData?.provider;
      setContentParams( {
        type: props.contentType,
        id: props.contentID,
        provider: _provider,
        ...( props.provider === DISTRO_CHANNEL.appType && { distroProvider: props.provider } )
      } )
      setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${( props.railType || MIXPANEL_RAIL_TYPE.BINGE_LIST )}` )
      setMixpanelData( 'contentType', isRecommendation ? MIXPANEL_CONTENT_TYPE.RECOMMENDED : MIXPANEL_CONTENT_TYPE.EDITORIAL )
      setMixpanelData( 'contentView', constants.CONTENT_VIEW.FAVORITE )
      props.editable ? null : setBingeListFlag( true )
    }
    else if( openRelatedShowsInfo ){
      setMixpanelData( 'contentType', isRecommendation ? MIXPANEL_CONTENT_TYPE.RECOMMENDED : MIXPANEL_CONTENT_TYPE.AUTOMATED )
      props.railType && setMixpanelData( 'railType', `${props.size?.toUpperCase()}-${layoutTypeForMixPanel}-${props.railType}` )
      setShowSynopsis && setShowSynopsis( false );
      setBannerShow && setBannerShow( true );
      history.push( {
        pathname: props.url,
        args: {
          rentalExpiry: props.rentalExpiry
        }
      } )
    }
    /* Mixpanel-event */
    !directlyPlayable && contentClickEvent()
  }

  const hideChecksumModal = () =>{
    setshowChecksumPopup( false )
    checksumModalRef.current?.close()
  }

  const openRecommendedUpdatePopup = () => {
    setshowRecommenedUpdatePopup( true )
    recommendedUpdatePopupRef?.current?.showModal();
  }

  const hideRecommendedUpdatePopup = () => {
    setshowRecommenedUpdatePopup( false )
    recommendedUpdatePopupRef?.current?.close()
  };

  const openFancodeDeeplinkContentPopup = () => {
    setFancodeDeeplinkPopup( true )
    fancodeDeeplinkPopupRef?.current?.showModal();
  }

  const hideFancodeDeeplinkContentPopup = () => {
    setFancodeDeeplinkPopup( false )
    fancodeDeeplinkPopupRef.current?.close()
    setFocus( 'BUTTON_PRIMARY' )
  }

  const openCurrentSubscriptionPopup = () => {
    setShowCurrentAPIErrorPopup( true )
    currentAPIErrorPopupRef?.current?.showModal();
  }

  const hideCurrentSubscriptionPopup = () => {
    setShowCurrentAPIErrorPopup( false )
    currentAPIErrorPopupRef?.current?.close()
  };

  const openActivateAppleErrorPopup = () => {
    setRestorefocusKey( focusKeyRefrence )
    setShowActivateAppleErrorPopup( true )
    activateAppleErrorPopupRef?.current?.showModal();
  }

  const hideActivateAppleErrorPopup = () => {
    setShowActivateAppleErrorPopup( false )
    activateAppleErrorPopupRef?.current?.close();
    setTimeout( ()=> setFocus( restorefocusKey ), 100 )
    setRestorefocusKey( null )
  }

  const showAndHideLiveTagTextOnPartnerPages = () =>{
    if( window.location.pathname.includes( 'browse-by-app' ) ){
      return !nonLiveTagProvidersOnPartnerPages.includes( props?.providerName?.toLowerCase() )
    }
    return true
  }

  const clearEpisodePageDataQRcodeUsecasesFn = () => {
    episodePageData.mediaCardRestoreId = null
    episodePageData.selectedSeason = null
    episodePageData.showKeyboard = null
    episodePageData.seriesInputValue = null
    episodePageData.episodePageNumber = null
  }

  useEffect( () => {
    if( parentalPinResponse ){
      previousPathName.current = window.location.pathname
      const pinRequired = parentalPinResponse.data.pinRequired
      setParentalPinStatus( pinRequired )
      const contentEpisode = getEpisodeList()
      const isAlreadyClicked = contentEpisode.some( episode => episode.id === props.contentID );
      if( !isAlreadyClicked ){
        const newEpisode = { id: props.contentID, time: Date.now() };
        const updatedEpisodes = [...contentEpisode, newEpisode];
        addPlayLA( selectedSeason )
        setEpisodeList( updatedEpisodes )
      }
      if( providerName && deepLinkPartners.includes( providerName.toLowerCase() ) ){
        checkAppInstalled( pinRequired );
      }
      else {
        setPlayBackTitle( playableMediaCardData?.playBackTitle )
        setStoredLastWatchData( {
          ...( storedLastWatchData && Object.keys( storedLastWatchData ).length > 0 ? storedLastWatchData : {} ),
          episode: playableMediaCardData?.episode,
          season: playableMediaCardData?.season,
          providerContentId: playableMediaCardData?.providerContentId,
          secondsWatched: 0,
          vodId: playableMediaCardData.vodId
        } );


        setMetaData( {
          ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
          epidsSet: playableMediaCardData?.epidsSet,
          id: playableMediaCardData.vodId || props.contentID,
          contentType: contentType,
          providerContentId : playableMediaCardData?.providerContentId,
          channelName: props.channelName
        } )
        history.push( {
          pathname:  getPathName( props.providerName, pinRequired ),
          args: {
          }
        } )
      }
    }
  }, [parentalPinResponse] );

  useEffect( () => {
    if( entitlementStatusResponse || entitlementStatusError ){
      if( getProviderWithToken( providerName, PROVIDER_LIST.PRIME ) ){
        handleStatusResponsePrime( entitlementStatusResponse, entitlementStatusError, history, config, myPlanProps, providerName, providerContentId, type, null, setNotificationIcon, setNotificationMessage, setShowNotification );
      }
    }
  }, [entitlementStatusResponse, entitlementStatusError] )

  useEffect( () => {
    if( tagResponse || getTokenResponse ){ // TODO: seperate out on provider check
      setTagId( tagResponse?.data?.tag || getTokenResponse?.data?.tag );
      setAppLaunch( true )
    }
  }, [tagResponse, getTokenResponse] );

  useEffect( ()=>{
    if( appLaunch && providerName && ( providerName.toLowerCase() === PROVIDER_LIST.ZEE5 || providerName.toLowerCase() === PROVIDER_LIST.LIONSGATE ) ){
      console.log( 'mediaCard appLaunch tagID == ', tagId) ; // eslint-disable-line
      console.log('mediaCard appLaunch value', appLaunch ); // eslint-disable-line
      console.log( 'mediaCard appLaunch partnerDeepLinkUrl ==  ', partnerDeepLinkUrl, contentType  ); // eslint-disable-line
      if( parentalPinStatus ){
        const args = {
          providerName: providerName,
          tagid: tagId,
          partnerDeepLinkUrl: partnerDeepLinkUrl,
          contentId: props.contentId,
          contentType: contentType === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : contentType
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        if( providerName.toLowerCase() === PROVIDER_LIST.ZEE5 ){
          playerEventFetchData( { type: contentType, id: contentID, watchDuration: 10 } );
        }
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null, inputValue )
        console.log( 'GOING TO LAUNCH THE APP == ', providerName, contentType ) ; // eslint-disable-line
        launchPartnerApp( providerName, getParamsTags( providerName, partnerDeepLinkUrl, tagId, playableMediaCardData?.providerContentId ), contentType, liveContent, 0 );
      }
    }
  }, [appLaunch] )

  useEffect( () => {
    if( focused && params?.id && isKeyReleased ){
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
      setContentRailPositionData( obj )
      if( !window.location.pathname.includes( 'plan/subscription' ) && !window.location.pathname.includes( '/plan/change-tenure' ) ){

        setProviderName( obj?.contentPartner )
      }
      clearTimeout( timeOut );
      timeOut = setTimeout( () => {
        props.setRailFocusedCardInfo && props.setRailFocusedCardInfo( MPItems );
        if( Object.keys( contentInfo ).length > 0 ){
          setContentInfo( contentInfo )
        }
        donglePageData.current = null;
        setShowSynopsis && boxSubSetFetch( params )
        if( providerName?.toLowerCase() === PROVIDER_LIST.SHEMAROO_ME ){
          const value = getContentType( params.type );
          contentInfoFetchData && contentInfoFetchData( { url: `${serviceConst.BOX_SET}${value}/boxset/${params.id}` } )
        }
        donglePageData.current = storeDongleResponseInContext;
        if( ( isPiPage && openSeriesInfo ) || isPlayable ){
          setShowPlayButton( true )
        }
        if( openRelatedShowsInfo ){
          setShowSynopsis( true )
          setBannerShow?.( false )
          previousPathName.playerScreen = null;
        }
      }, 350 );

    }
  }, [focused, contentID, isKeyReleased] )

  useEffect( () => {
    return () => {
      clearTimeout( timeOut );
    }
  }, [] );

  useEffect( () => {
    if( boxSubSetResponse ){
      setContentInfo( {
        ...boxSubSetResponse,
        contentType: contentType
      } )
    }
  }, [boxSubSetResponse] )

  useEffect( () => {
    if( document.querySelector( '.PiDetailsDescription__content > p' ) ){
      const elm = document.querySelector( '.PiDetailsDescription__content > p' );
      countLine( elm, setCountLine );
    }
  }, [props.description] );

  useEffect( ()=>{
    if( appleRedemptionResponse && appleRedemptionResponse.data && appleRedemptionResponse.data.activation_url ){
      handleAppleInterstitialPageNav( appleRedemptionResponse.data.activation_url, history )
    }
    if( appleRedemptionResponse && appleRedemptionResponse.code !== 0 ){
      setTimeout( () =>{
        openActivateAppleErrorPopup()
      }, 20 )
      appleActivationError( appleRedemptionResponse?.code, appleRedemptionResponse?.message )
    }
    if( appleRedemptionError ){
      setTimeout( () =>{
        openActivateAppleErrorPopup()
      }, 20 )
      appleActivationError( appleRedemptionError?.response?.data?.code, appleRedemptionError?.response?.data?.message )
    }
  }, [appleRedemptionResponse, appleRedemptionError] )


  useEffect( () => {
    if( parentalPinError ){
      showToastMsg( setShowNotification, setNotificationMessage, constants.LOGIN_MSG )
    }
  }, [parentalPinError] )

  return (
    <div className={ classNames( 'MediaCardWrapper', { 'MediaCardWrapper--withFocus': focused && openSeriesInfo,
      'MediaCardWrapper--focusAlignment': focused
    } ) }
    >
      <FocusContext.Provider value={ focusKey }>
        <div
          className={ classNames( 'MediaCard', { 'MediaCard--withFocus': focused, 'MediaCard--withFocusBanner': focused && bannerTitle } ) }
          focused={ focused ? focused.toString() : undefined }
          ref={ ref }
          onMouseEnter={ props?.onMouseEnterCallBackFn }
          onMouseUp={ onEnterPressCallBackFn }
        >
          <Link secondary={ true }
            className='MediaCard--media'
          >
            { props.editable ? props.mediaCardEditable ? <div className='MediaCard__editableCheck'/> : <div className='MediaCard__editable'/> : null }
            <Image
              alt={ props.episodeTitle }
              src={ props.image }
            />
            {
              Boolean( ( isLiveContentType( contentType ) || props.liveContent ) && showAndHideLiveTagTextOnPartnerPages() ) && (
                <div className='MediaCard__liveContent'>
                  <div className='MediaCard__liveCircle' />
                  <Text color='white'>{ isSonyContent( props?.providerName ) ? ( props?.broadcastMode ) : constants.LIVE }</Text>
                </div>
              )
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
            { props.timeBlock && !props.showTimeBlock && sectionSource !== SECTION_SOURCE.SERIES_SPECIAL_RAIL && sectionSource !== SECTION_SOURCE.TITLE_RAIL && sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL &&
            <>
              <div className='MediaCard__cardTopGradiant'/>
              <div className='MediaCard__timeBlock'>
                <Text
                  textStyle='subtitle-4'
                  color='white'
                  textAlign='center'
                  htmlTag='span'
                >
                  { covertIntoMinutes( props.timeBlock ) >= 1 ? ( covertIntoMinutes( props.timeBlock ) >= 60 ? `${ Math.floor( covertIntoMinutes( props.timeBlock ) / 60 ) }h ${ covertIntoMinutes( props.timeBlock ) % 60 }m` : `${ covertIntoMinutes( props.timeBlock )}m` ) : null }
                </Text>
              </div>
            </>
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
                    { covertIntoMinutes( props.timeBlock ) >= 1 ? ( covertIntoMinutes( props.timeBlock ) >= 60 ? `${ Math.floor( covertIntoMinutes( props.timeBlock ) / 60 ) }h ${ covertIntoMinutes( props.timeBlock ) % 60 }m` : `${ covertIntoMinutes( props.timeBlock )}m` ) : null }
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
            { props.indicator &&
            <div className='MediaCard__progress'>
              <div
                className='MediaCard__progress--indicator'
                style={ { width: `${props.indicator}%` } }
              ></div>
            </div>
            }
            {
              // !hideCrown && isCrown( props.status, props.isLowerPlan, props.nonSubscribedPartnerList, props.providerName, props.partnerSubscriptionType, props.contractName, props.contentType, props.freeEpisodesAvailable ) && (
              !hideCrown && isCrownNew( myPlanProps, { ...props, provider: props.providerName }, config?.enableCrown ) && (
                <div className='MediaCard__crownLogo'>
                  <Icon
                    name='CrownWithBG'
                  />
                </div>
              )
            }
            { showPlayButtonIcon &&
            <div
              className={ classNames( 'MediaCard__playButton', {
                'MediaCard__playButton--withFocus': focused } ) }
            >
              <Icon
                name='MediaCardPlay'
              />
            </div>
            }
            {
              freeEpisodeTagForCrown( myPlanProps?.subscriptionStatus, myPlanProps?.isLowerPlan, myPlanProps?.nonSubscribedPartnerList, props.providerName, props.partnerSubscriptionType, props.contractName, contentType, freeEpisodesAvailable ) && (
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
            { /* Added showProvider to render provider logo bydefault its true */ }
            { Boolean( ( showProvider && ( !openSeriesInfo && props.provider && props.contractName !== constants.CONTRACT_NAME ) || ( props.contractName === constants.CONTRACT_NAME && !props.rentalExpiry ) ) ) && sectionSource !== SECTION_SOURCE.SERIES_SPECIAL_RAIL && sectionSource !== SECTION_SOURCE.BACKGROUND_BANNER_RAIL && !placeHolder?.includes( constants.BEST_OF_PARTNER ) && (
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
        { bannerTitle && (
          <div className='MediaCard__bannerTitle'>
            <Text
              color='white'
              textAlign='center'
              htmlTag='span'
            >{ bannerTitle }</Text>
          </div>
        ) }
        { ( ( ( openSeriesInfo || isPlayable ) && props.episodeTitle ) || ( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ) ) && (
          <div className='MediaCard--title'>
            { props.episodeId ? (
              <Text textStyle='subtitle-1'
                textAlign='center'
                htmlTag='span'
                color='white'
              >{ `${constants.EP} ${ props.episodeId } : ` } { props.episodeTitle }</Text>
            ) : (
              <Text textStyle='subtitle-1'
                textAlign='center'
                htmlTag='span'
                color='white'
              >{ props.episodeTitle }</Text>
            ) }
          </div>
        ) }
        { props.contractName === 'RENTAL' && props.rentalExpiry && (
          <div className='MediaCard--expiry'>
            <Text textStyle='planCard-subtitle'
              textAlign='center'
              htmlTag='span'
            >{ timeDifferenceCalculate( props.rentalExpiry ) && `Expires in ${timeDifferenceCalculate( props.rentalExpiry )}` }</Text>
          </div>
        ) }
        { ( focused && openSeriesInfo ) && <div className={ classNames( { 'MediaCardWrapper__detailSection': focused } ) }>
          <PISeriesDetails
            description={ props.description }
            title={ props.episodeTitle }
            duration={ props.totalDuration || props.duration }
            episodeDate={ props.releaseYear }
          />
        </div> }
        {
          launchProviderPopupToTrue &&
          <LaunchProviderPopup
            provider={ providerName }
            displayModal={ true }
            modalRef={ launchProviderRef }
            appLaunch={ appLaunch }
            parentalPinStatus={ parentalPinResponse?.data.pinRequired }
            handleCancel={ hideLaunchProviderModal }
            providerName={ appProviderState }
            tagID={ tagId }
            contentId={ providerContentId }
            partnerDeepLinkUrl={ partnerDeepLinkUrl }
          />
        }

        <FocusContext.Provider focusable={ false }
          value=''
        >
          <AppleJourneyModals
            appleButtonClick={ appleButtonClick }
            setAppleButtonClick={ setAppleButtonClick }

            parentalPinFetchData={ parentalPinFetchData }
            focusKeyRefrence={ focusKeyRefrence }
            metaData={ MPItems }
            responseSubscription={ responseSubscription }
          />
        </FocusContext.Provider>
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <PrimeJourneyModals
            primeRedirectionPopup={ primeRedirectionPopup }
            setPrimeRedirectionPopup={ setPrimeRedirectionPopup }
            parentalPinStatus={ parentalPinResponse?.data?.pinRequired }
            providerContentId={ providerContentId }
            partnerDeepLinkUrl={ partnerDeepLinkUrl }
            tagID={ tagId }
            restorefocusKey={ restorefocusKey }
          />
        </FocusContext.Provider>
        { fancodeDeeplinkPopup &&
        <div className='ForceUpdatePopup'>
          <FancodeDeeplinkPopup
            opener={ fancodeDeeplinkPopupRef }
            modalRef={ fancodeDeeplinkPopupRef }
            handleCancel={ hideFancodeDeeplinkContentPopup }
            buttonClicked={ hideFancodeDeeplinkContentPopup }
            provider={ PROVIDER_LIST.FANCODE }
            message={ partnerSubscriptionVerbiage?.blockPartnerContentPopupDTOLs?.title }
            buttonLabel={ partnerSubscriptionVerbiage?.blockPartnerContentPopupDTOLs?.primaryCTA || constants.OKAY }
            focusShouldRetain={ 10 }
            topGoLeft={ true }
          />
        </div>
        }
        { showChecksumPopup &&
        <NotificationsPopUp
          opener={ checksumModalRef }
          modalRef={ checksumModalRef }
          handleCancel={ hideChecksumModal }
          iconName={ SECURITY_CHECKSUM_VERBIAGES.icon1 }
          message={ miscellaneousVerbiages?.restrictPlayBackUIAlert || SECURITY_CHECKSUM_VERBIAGES.restrictPlayBackUIAlert }
          buttonLabel={ SECURITY_CHECKSUM_VERBIAGES.label }
          backButton={ constants.TOCLOSE }
          backIcon={ SECURITY_CHECKSUM_VERBIAGES.icon2 }
          buttonClicked={ () => hideChecksumModal() }
          focusShouldRetain={ 10 }
        /> }
      </FocusContext.Provider>
      { showRecommenedUpdatePopup &&
      <ForceUpdatePopup
        opener={ recommendedUpdatePopupRef }
        modalRef={ recommendedUpdatePopupRef }
        handleCancel={ hideRecommendedUpdatePopup }
        header={ configResponse.app.appUpgrade[getPlatformTypeForTA()].recommendedUpgradeHeader || FORCE_UPDATE_POPUP.header1 }
        info={ configResponse.app.appUpgrade[getPlatformTypeForTA()].recommendedMessage || FORCE_UPDATE_POPUP.info }
        buttonLabel2={ FORCE_UPDATE_POPUP.btn3 }
        buttonClicked2={ hideRecommendedUpdatePopup }
        backIcon={ FORCE_UPDATE_POPUP.icon }
        focusKeyRefrence={ 'DONE_BUTTON' }
        {
          ...( !isTizen && {
            buttonLabel:  FORCE_UPDATE_POPUP.btn1,
            buttonClicked1: redirectToPlayStore
          } )
        }
      />
      }
      { showFibrePlanPopUp &&
      <NotificationsPopUp
        opener={ fibrePlanModalRef }
        modalRef={ fibrePlanModalRef }
        handleCancel={ hideFibrePlanPopup }
        info={ updateFibrePopUpMessage( myPlanProps?.ispHeaderVerbiage, providerName ) || updateFibrePopUpMessage( FIBRE_PLAN.message, providerName ) }
        iconName={ FIBRE_PLAN.iconName }
        message={ FIBRE_PLAN.header }
        buttonLabel={ FIBRE_PLAN.buttonLabel }
        backButton={ constants.TOCLOSE }
        backIcon={ FIBRE_PLAN.backIcon }
        buttonClicked={ () => hideFibrePlanPopup() }
        focusShouldRetain={ 10 }
      /> }
      {
        qrCodeSuccess &&
        <QRCodeSucess
          zeroAppsPlanCloseQrCode={ ()=> {
            setTimeout( ()=> setFocus( restorefocusKey ), 100 )
            setQRCodeSuccess( false )
            zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.ZERO_APPS_NUDGE_CLOSE, myPlanProps )
          } }
          zeroAppsPlanCloseSuccessPopup={ ()=> {
            setTimeout( ()=> setFocus( restorefocusKey ), 100 )
            setQRCodeSuccess( false )
          } }
          myPlan={ false }
        />
      }
      { showCurrentAPIErrorPopup &&
      <NotificationsPopUp
        opener={ currentAPIErrorPopupRef }
        modalRef={ currentAPIErrorPopupRef }
        handleCancel={ hideCurrentSubscriptionPopup }
        info={ handleErrorMessage( responseSubscription?.error, responseSubscription?.response, constants.ERROR_MSG ) }
        iconName={ NOTIFICATION_RESPONSE.iconName }
        message={ NOTIFICATION_RESPONSE.message }
        buttonLabel={ constants.DONE_BTN }
        backButton={ constants.TOCLOSE }
        backIcon={ 'GoBack' }
        buttonClicked={ () => hideCurrentSubscriptionPopup() }
        focusShouldRetain={ 10 }
      /> }
      { showActivateAppleErrorPopup &&
      <NotificationsPopUp
        opener={ activateAppleErrorPopupRef }
        modalRef={ activateAppleErrorPopupRef }
        handleCancel={ hideActivateAppleErrorPopup }
        info={ handleErrorMessage( appleRedemptionResponse?.error || appleRedemptionError, appleRedemptionResponse, constants.ERROR_APPLE_MSG ) }
        iconName={ NOTIFICATION_RESPONSE.iconName }
        message={ NOTIFICATION_RESPONSE.message }
        buttonLabel={ constants.DONE_BTN }
        backButton={ constants.TOCLOSE }
        backIcon={ constants.BACK_TEXT }
        buttonClicked={ () => hideActivateAppleErrorPopup() }
        focusShouldRetain={ 10 }
      /> }
    </div>
  );
};

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} type - This is the type of Media card going forward (currently one of 'Portrait', 'Landscape')
  * @property {string} size - This is the type of size of Media card (currently one of 'small', 'Large')
  * @property {string} image - This is the media Image
  * @property {string} episodeTitle - This is the media Title
  * @property {string} url - redirection url
  * @property {function} onFocus - set the onFocus
  * @property {string} provider - set the provider'
  * @property {string} contractName - set the contractName'
  * @property {any} timeBlock - set the timeBlock
  * @property {string} indicator - set the progress indicator
  * * @property {string} freeEpisodesAvailable - set the text if episode is free
  */
export const propTypes = {
  type: PropTypes.oneOf( ['landscape', 'portrait'] ),
  size: PropTypes.oneOf( ['small', 'large', 'top10'] ),
  episodeTitle: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  onFocus: PropTypes.func,
  provider: PropTypes.string,
  contractName: PropTypes.string,
  timeBlock: PropTypes.any,
  indicator: PropTypes.string,
  onClick: PropTypes.func,
  freeEpisodesAvailable: PropTypes.bool,
  partnerSubscriptionType: PropTypes.string,
  providerName: PropTypes.string
};

/**
  * Default values for passed properties
  *
  * @type {object}
  * @property {string} type='landscape' - The media card type, default is landscape.
  * @property {string} size='small' - The media card size, default is small.
  */

MediaCard.propTypes = propTypes;

export default MediaCard;