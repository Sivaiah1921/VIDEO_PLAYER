/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/**
 * This component will provide the playback information of movies &amp; series
 *
 * @module views/components/PlaybackInfo
 * @memberof -Common
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './PlaybackInfo.scss';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import BannerComponent from '../BannerComponent/BannerComponent';
import Button from '../Button/Button';
import PItitle from '../PITitle/PITitle';
import LanguageList from '../LanguageList/LanguageList';
import PiDetailsDescription from '../PiDetailsDescription/PiDetailsDescription';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import Text from '../Text/Text';
import { CONTENT_TYPE, constants, LAYOUT_TYPE, COMMON_HEADERS, PROVIDER_LIST, PAGE_NAME, SONY_CONSTANTS, deepLinkPartners, SECTION_SOURCE, APPLETV, SECURITY_CHECKSUM_VERBIAGES, MEDIA_CARD_TYPE, DISTRO_CHANNEL, SUBSCRIPTION_STATUS, PLAYER, PACKS, isTizen, getPlatformTypeForTA, FORCE_UPDATE_POPUP, PRIME, FIBRE_PLAN, NOTIFICATION_RESPONSE, SENTRY_LEVEL, SENTRY_TAG, SDK_PARTNERS, CONTENTTYPE_SERIES, APPLE_PRIME_ACTIVATION_JOURNEY, APPLE_ERROR_STATUS_KEYS, APPLE_REDIRECTION_KEYS, SubscriptionNotFoundData, PAGE_TYPE } from '../../../utils/constants';
import SeasonTab from '../SeasonTab/SeasonTab';
import PIDetails from '../PIDetails/PIDetails';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import { getPlaceHolder, getContentDetails, getContentTitle, getPlaybackData, FetchDetails, PlayLA, getLaunchAppID, checkAuthType, getPathName, FetchZeeTagId, launchPartnerApp, getParamsTags, ContentInfo, RelatedShows, RecommendationRail, ParentalPin, LastWatch, SeriesList, CSDInfoAPI, ZeeTrailerPlayback } from '../../../utils/slayer/PlaybackInfoService';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AddToBingListCall, AddtoFavLA } from '../../../utils/slayer/BingeListService';
import { cloudinaryCarousalUrl, countLine, truncateWithThreeDots, handleNullInString, sendExecptionToSentry, getTAUseCaseId, getLArefuseCase, modalDom, redirection, getFilteredContentType, setMixpanelData, getMixpanelData, convertStringToCamelCase, compareBuildVersions, redirectToPlayStore, isCrownNew, showToastMsg, contentPlayMixpanelEventForDeeplink, handleRedirectionParentalPinSetup, updateFibrePopUpMessage, clearEpisodeListData, getContentIdByType, MIXPANEL_RAIL_TYPE, handleErrorMessage, removeSonySDK, isIspEnabled, getContentIdForLastWatch, getVodID, isEmptyObject } from '../../../utils/util';
import Notifications from '../Notifications/Notifications';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import Synopsis from '../Synopsis/Synopsis';
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import parse from 'html-react-parser';
import { getAuthToken, setData, getHotStarPopupCount, getAgeRating, getProductName, getPiLevel, setPiLevel, getPrimeRedirectionPopupCount, getDeviceToken, setPrimeRedirectionPopupCount, getSmartTroubleshootingRefreshCount, setSmartTroubleshootingRefreshCount, getSmartTroubleshootingTrackEventCount, setSmartTroubleshootingTrackEventCount, getContentRailPositionData, getBaID, getTrailerCTA, setTrailerCTA, setTrailerFromApi, setTrailerContentCategory, setProviderName, getProviderName } from '../../../utils/localStorageHelper';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import serviceConst from '../../../utils/slayer/serviceConst';
import { bingelist_add, bingelist_remove_item, playLiveTV, playNonSubscribedLiveTV, play_trailor, see_all_episode, synopsis_more_click, view_content, watchLearnAction, applePlayCtaClicked, player_play_event, zeroAppMixpanelEvents, learnActionForOrphanContent, appleErrorInfo, appleActivationError, primeRedirectionPopupClicked, trailer_started } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import LaunchProviderPopup from '../LaunchProviderPopup/LaunchProviderPopup';
import SearchService, { LiveSearchLA, SearchLA } from '../../../utils/slayer/SearchService';
import Image from '../Image/Image';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { GetSonyLivToken, GetTagData, PlayingEventApiCalling, getPlayableUrls, isDistroContent, isLiveContentType } from '../../../utils/slayer/PlayerService';
import AppleJourneyModals from '../AppleJourneyModals/AppleJourneyModals';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { setBingeListPeopleProperties } from '../../../utils/mixpanel/mixpanel';
import ForceUpdatePopup from '../ForceUpdatePopup/ForceUpdatePopup';
import { AppleAndPrimeService, AppleActivationRedemCode } from '../../../utils/slayer/AmazonPrimeService';
import { getPrimeNudgeStatus, getPrimeStatus, handlePrimeCTA, handleStatusResponsePrime } from '../../../utils/primeHelper';
import { getActiveSubscriptionStatus, getChannelPlayableStatus, getProviderWithToken, getProviderWithoutToken, getRefreshUserSubscription, getSubscriptionStatus, getTrackMaTriggerFrequency } from '../../../utils/commonHelper';
import { getTrailorPlayUrl } from '../Player/PlayerNew/TrailorUrl';
import QRCodeSucess from '../QRCodeSucess/QRCodeSucess';
import FancodeDeeplinkPopup from '../FancodeDeeplinkPopup/FancodeDeeplinkPopup';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { getAppleActivationFlagStatus, getAppleJourneyStatus, handleAppleInterstitialPageNav, handleApplePlayBackLG, handleApplePlayBackSamsung } from '../../../utils/appleHelper';
import { getIsOrphanContent, loadEpisodesFromLocalStorage } from '../../../utils/playerCommons/playersHelper';
import BannerSubscription from '../BannerSubscription/BannerSubscription';
import PrimeJourneyModals from '../PrimeJourneyModals/PrimeJourneyModals';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { trackErrorEvents } from '../../../utils/logTracking';
import UseSonyLivSDK from '../PlayerSonLiv/UseSonyLivSDK';
import { LiveClickLA } from '../../../utils/slayer/HomeService';


export const truncateWithThreeDotsAutoSuggestion = ( source, size, isCountLine ) => {
  return isCountLine || ( source.length > size ) ? parse( source.slice( 0, size - 1 ) + `....` ) : source;
}

/**
   * Represents a PlaybackInfo component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns PlaybackInfo
   */
export const PlaybackInfo = function( props ){
  const [seasonID, setSeasonID] = useState();
  const [isCountLine, setCountLine] = useState( false );
  const [series, setSeries] = useState();
  const [isError, setIsError] = useState( false );
  const [fallbackId, setFallbackId] = useState( );
  const [liveFocused, setLiveFocused] = useState( false );
  const [fetchLiveData, setFetchLiveData] = useState( false )
  const [currntIndex, setCurrntIndex] = useState( 0 )
  const [showFibrePlanPopUp, setshowFibrePlanPopUp] = useState( false )
  const [placeHolderForMovies, setPlaceHolderForMovies] = useState();
  const [modalPopup, setModalPopup] = useState( false )
  const [showChecksumPopup, setshowChecksumPopup] = useState( false )
  const [showNotification, setShowNotification] = useState( false );
  const [notificationMessage, setNotificationMessage] = useState( '' )
  const [notificationIcon, setNotificationIcon] = useState( 'Success' )
  const [showSynopsis, setShowSynopsis] = useState( false );
  const [providerName, setProvider] = useState();
  const [bingeIcon, setBingeIcon] = useState( 'Plus' )
  const [appProviderState, setAppProviderState] = useState( '' )
  const [loaderOnLiveWhenContentChanges, setLoaderOnLiveWhenContentChanges] = useState( false );
  const [isFocusOnEpisode, setIsFocusOnEpisode] = useState( false )
  const [showRecommenedUpdatePopup, setshowRecommenedUpdatePopup] = useState( false )
  const [fancodeDeeplinkPopup, setFancodeDeeplinkPopup] = useState( false )
  const [contentList, setContentList] = useState( [] )
  const [seriesLengthZero, setSeriesLengthZero] = useState( false )
  const [bannerShow, setBannerShow] = useState( true );
  const [expandShow, setExpandShow] = useState( false );
  const { parentContentType, parentContentId } = useParams()
  const [type, setType] = useState( getFilteredContentType( parentContentType ) )
  const [id, setId] = useState( parentContentId )
  const [configAuthType, setConfigAuthType] = useState( null );
  const [seasonLoader, setSeasonLoader] = useState( false );
  const [playStatus, setPlayStatus] = useState( '' );
  const [launchProviderPopupToTrue, setLaunchProviderPopupToTrue] = useState( false );
  const [appLaunch, setAppLaunch] = useState( false );
  const [parentalPinStatus, setParentalPinStatus] = useState( false );
  const [appleButtonClick, setAppleButtonClick] = useState( null )
  const [tagId, setTagId] = useState();
  const [qrCodeSuccess, setQRCodeSuccess] = useState( false );
  const [seasonList, setSeasonList] = useState( [] );
  const [showCurrentAPIErrorPopup, setShowCurrentAPIErrorPopup] = useState( false )
  const [showActivateAppleErrorPopup, setShowActivateAppleErrorPopup] = useState( false )
  const [primeRedirectionPopup, setPrimeRedirectionPopup] = useState( null )
  const [piLoader, setPILoader] = useState( true );
  const [metaData, setPIMetaData] = useState( {} );
  const [zeeLoader, setZeeLoader] = useState( true );
  const [isTrailerStartedEvent, setIsTrailerStartedEvent] = useState( true )
  const currentPILevel = useRef( 0 );

  const modalRef = useRef();
  const buttonRef = useRef();
  const checksumModalRef = useRef();
  const launchProviderRef = useRef();
  const seasonPlayRef = useRef( null )
  const railsDatapositionRef = useRef( [] )
  const seasonTabpositionRef = useRef( null )
  const counterRef = useRef( 0 )
  const sessonTabPositionRetainRef = useRef( null )
  const callApi = useRef( true )
  const positionCounter = useRef( -1 )
  const fallbackApi = useRef( false )
  const clearTimeOutRef = useRef( null )
  const recommendedUpdatePopupRef = useRef();
  const clearFocusValueRef = useRef( null );
  const fibrePlanModalRef = useRef();
  const pageNumber = useRef( 0 )
  const fancodeDeeplinkPopupRef = useRef();
  const currentAPIErrorPopupRef = useRef();
  const activateAppleErrorPopupRef = useRef()
  const trailerFromDeepLinkUrl = useRef( null )

  const { contentParams, setIsFav, catalogFlag, bingeListFlag, searchFlag, isValidCheckSum, setIsWatchListUpdated, contentInfo } = useHomeContext()
  const { filterRail } = useContentFilter( );
  const previousPathName = useNavigationContext()
  const { setPlayBackTitle, metaData: metaDataObj, setContentPlaybackData, storedContentInfo, setStoredContentInfo, setTrailor_url, trailor_url, setMetaData, setStoredLastWatchData, storedLastWatchData, contentPlaybackData, trailerCurrentTime, trailerTotalTime, setTrailerCurrentTime, setIsPlayClicked, isTrailerClicked, setIsTrailerClicked } = usePlayerContext()
  const { configResponse, url } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const { ref, focusKey, focused } = useFocusable( {
    isFocusBoundary: true
  } );
  const { profileAPIResult } = useProfileContext()
  const { donglePageData, episodePageData, piPageFocus, liveContent, storeRailData, playEventFromPopupRef, flexiPlanVerbiagesContext, receivePubnubAfterScanning, episodeCardId, selectedPackageCard, setLiveContent, setIsLoginToggle, setPlayerAction, setBroadcastMode, selectedpartnerId, homeDonglePageData } = useMaintainPageState() || null
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack
  const myPlanPropsForUnsubscribe = responseSubscription?.responseData.currentPackForUnsubscribe
  const currentPlan = myPlanProps?.upgradeMyPlanType
  const { liveChannelIds, subscriptionStatus } = myPlanProps || {};
  const { onLogin } = usePubNubContext();

  const [contentInfoDetails] = ContentInfo( { type, id, liveChannelIds, subscriptionStatus, provider:providerName } )
  const { contentInfoFetchData, contentInfoResponse = storedContentInfo, contentInfoError, contentInfoLoading } = contentInfoDetails;
  const { config } = configResponse;

  const [relatedShows] = RelatedShows( { type, id } );
  const { relatedShowsFetchData, relatedShowsResponse, relatedShowsError, relatedShowLoading } = relatedShows;

  const [recoRail] = RecommendationRail( {} )
  const { recoFetchData, recoResponse, recoError, recoLoading } = recoRail;

  const [parentalPin] = ParentalPin( { rating : metaData.masterRating } )
  const { parentalPinFetchData, parentalPinResponse, parentalPinError, parentalPinLoading } = parentalPin;

  const [CSDInfoObj] = CSDInfoAPI( { }, true );
  const { fetchCSDInfoAPI, CSDInfoAPIResponse } = CSDInfoObj;

  const [lastWatch] = LastWatch( { type, id, meta: metaData, provider: metaData.provider } )
  const { lastWatchFetchData, lastWatchResponse, lastWatchError, lastWatchLoading } = lastWatch

  const [seriesList] = SeriesList()
  const { seasonFetchData, seasonResponse, seasonError, seasonLoading } = seriesList;

  const [fetchDetailsObj] = FetchDetails( type, id );
  const { fetchDetailsFetch, fetchDetailsLoading, fetchDetailsResponse, fetchDetailsError } = fetchDetailsObj

  const [addRemoveBingeList] = AddToBingListCall( { type, id, provider: metaData.provider } );
  const { addRemoveBingeListFetchData, addRemoveBingeListResponse } = addRemoveBingeList;

  const refUsecase = useMemo( () => getLArefuseCase( config, type, recoResponse, bingeListFlag, searchFlag, catalogFlag ), [config, recoResponse, type, bingeListFlag, searchFlag, catalogFlag] )

  const [LearnActionBingeListData] = AddtoFavLA( { type, id, provider: metaData.provider, taShowType: metaData.taShowType, vodId: getVodID( metaData ), refUsecase: refUsecase } );
  const { addLearnAction } = LearnActionBingeListData

  const [playLAData] = PlayLA( { type, id, provider: metaData.provider, taShowType: metaData.taShowType, vodId: getVodID( metaData ), refUsecase: refUsecase } );
  const { addPlayLA } = playLAData

  const [searchLearnAction] = SearchLA( { type, id, provider: metaData.provider, taShowType: metaData.taShowType, vodId: getVodID( metaData ) } );
  const { searchLAFetchData } = searchLearnAction;
  const [liveSearchLAData] = LiveSearchLA( { id:metaData?.id, provider: metaData?.provider, refUsecase: constants.SEARCH_CLICK_USE_CASE } )
  const { liveSearchLA } = liveSearchLAData
  const [liveClickLAData] = LiveClickLA( { id:metaData?.id, provider:metaData?.provider, refUsecase: constants.LIVE_CLICK_USE_CASE } )
  const { liveClickLA } = liveClickLAData
  const [liveRecommendation] = SearchService( ).reverse();
  const { liveRecommendationFetchData, liveRecommendationResponse, liveRecommendationError, liveRecommendationLoading } = liveRecommendation;

  const [entitlementStatus] = AppleAndPrimeService();
  const { entitlementStatusFetchData, entitlementStatusResponse, entitlementStatusError, entitlementStatusLoading } = entitlementStatus;

  const { provider, providerContentId, playBackTitle } = getPlaybackData( contentInfoResponse, type, configAuthType );

  const zee5PartnerUniqueId = responseSubscription?.response?.data?.partnerUniqueIdInfo?.ZEE5?.partnerUniqueId;
  const tagObj = FetchZeeTagId( '', true, zee5PartnerUniqueId );
  const { tagFetchData, tagResponse } = tagObj;

  const getTagObj = GetTagData( '', true );
  const { fetchToken, getTokenResponse } = getTagObj;

  const [playerEventObj] = PlayingEventApiCalling( { metaData, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;

  const getTokenObj = GetSonyLivToken( '', true );
  const { fetchSonyLivToken, sonyLivGetTokenResponse } = getTokenObj;

  const [appleActivationCodeRedemption] = AppleActivationRedemCode( true );
  const { appleFetchData, appleRedemptionResponse, appleRedemptionError } = appleActivationCodeRedemption;

  const flexiPlanVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages, [flexiPlanVerbiagesContext.current] )
  const miscellaneousVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.miscellaneousVerbiages, [flexiPlanVerbiagesContext.current] )
  const amazonSubscriptionVerbiage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )
  const partnerSubscriptionVerbiage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.partnerSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )
  const appleToastMessage = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )
  let autoPlay = true;
  if( profileAPIResult && profileAPIResult.data?.autoPlayTrailer === false ){
    autoPlay = false;
  }
  const loaderPath = `${window.assetBasePath}loader.gif`;
  const showingPlayIcon = [constants.SUBSCRIBE_TO_WATCH, constants.UPGRADE_TO_WATCH, constants.LOGIN_TO_WATCH, APPLETV.BUTTON, constants.SUBSCRIBE_TO_WATCH1]
  const imagePath = get( contentInfo, 'data', {} ) && get( contentInfo, 'data', {} ).previewImage ? get( contentInfo, 'data', {} ).previewImage : donglePageData?.current?.image
  const contractName = get( contentInfoResponse, 'data.detail', {} );
  const channelMeta = get( contentInfoResponse, 'data.channelMeta', {} );
  const { showSonyPILoader } = UseSonyLivSDK( providerName, true );
  const data = getContentRailPositionData()
  const [zeeTrailer]  = ZeeTrailerPlayback( )
  const { fetchzeeTrailer, zeeTrailerResponse, zeeTrailerError, zeeTrailerLoading }  = zeeTrailer
  const playUrl = useMemo( () => contentInfoResponse?.data?.detail?.playUrl, [contentInfoResponse] );
  const fetchLiveRecommendatation = ( liveOffset, genre, audio ) => {
    liveRecommendationFetchData( {
      id:id,
      genre: genre || metaDataObj?.primaryGenre || constants.NEWS_GENRE,
      lang: audio || ( metaDataObj?.audio?.length > 0 ? metaDataObj.audio[0] : convertStringToCamelCase( constants.ENGLISH ) ),
      limit: 20,
      offset: liveOffset
    } );
  }

  const handlePrimeAppInstall = ( pinRequired ) => {
    if( getPrimeRedirectionPopupCount() >= config?.primeVerbiages?.primePopUpFrequency?.launchFrequency ){
      if( pinRequired ){
        const args = {
          providerName: provider,
          contentId: providerContentId,
          contentType: type
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
        playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
        launchPartnerApp( provider, providerContentId, '', '', 0 );
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
          providerName: provider,
          contentId: providerContentId,
          partnerDeepLinkUrl: storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl,
          contentType: type
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
        playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
        // hotstar do not require content type, hence passing undefined
        launchPartnerApp( provider, getParamsTags( provider, storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl, tagId, providerContentId ), undefined, liveContent );
      }
    }
    else {
      setAppLaunch( true )
      setAppProviderState( provider )
      setIsFocusOnEpisode( true )
      setLaunchProviderPopupToTrue( true )
      playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
      setTimeout( () => {
        launchProviderRef?.current?.showModal();
      }, 100 );
    }
  }

  const trailerCTA = ()=>{
    if( trailerCurrentTime > 0 && trailerCurrentTime >= trailerTotalTime ){
      setIsTrailerStartedEvent( true )
      setTrailerCTA( 'Replay Trailer' )
    }
    else if( trailerCurrentTime > 0 && trailerCurrentTime < trailerTotalTime ){
      setIsTrailerStartedEvent( false )
      setTrailerCTA( 'Resume Trailer' )
    }
    else {
      setTrailerCTA( 'View Trailer' )
    }
  }

  useEffect( ()=>{
    if( isTrailerClicked ){
      trailerCTA()
    }
  }, [trailerCurrentTime] )



  const checkAppInstalled = ( pinRequired ) => {
    window.webOS && webOS.service.request( 'luna://com.webos.applicationManager', {
      method: 'getAppLoadStatus',
      parameters: { appId: getLaunchAppID( provider ) },
      onSuccess: function( inResponse ){
        console.log( 'SUCCESS oF GETAPP LOAD STATUS'); // eslint-disable-line
        if( inResponse.exist ){
          if( provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR ){
            handleHotStarAppInstall( pinRequired )
          }
          else if( trailerFromDeepLinkUrl.current ){
            launchPartnerApp( provider, metaData?.partnerDeepLinkUrl, type === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : type, liveContent );
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.ZEE5 ){
            tagFetchData();
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.APPLETV ){
            if( !pinRequired ){
              const taUseCaseId = getTAUseCaseId( storeRailData.current );
              contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
              playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
              launchPartnerApp( provider, getParamsTags( provider, storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl, '', providerContentId ), type === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : type, liveContent );
            }
            else if( pinRequired ){
              const args = {
                providerName: provider,
                contentId: providerContentId,
                partnerDeepLinkUrl: storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl,
                contentType: type
              }
              handleRedirectionParentalPinSetup( history, args )
            }
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.PRIME ){
            handlePrimeAppInstall( pinRequired )
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.JIO_CINEMA ){
            console.log( 'INSIDE SUCCESS OF APP INSTALLED and going to launch JIO^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' ) ; // eslint-disable-line
            if( !pinRequired ){
              const taUseCaseId = getTAUseCaseId( storeRailData.current );
              contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
              launchPartnerApp( provider, getParamsTags( provider, '', '', storedLastWatchData?.providerContentId ? storedLastWatchData.providerContentId : providerContentId ), type === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : type, liveContent );
              playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
            }
            else {
              const args = {
                providerName: provider,
                contentId: providerContentId,
                contentType: type
              }
              handleRedirectionParentalPinSetup( history, args )
            }
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.LIONSGATE ){
            fetchToken();
          }
        }
        else {
          setAppLaunch( false )
          setLaunchProviderPopupToTrue( true )
          setIsFocusOnEpisode( true )
          setTimeout( () => {
            launchProviderRef?.current?.showModal();
          }, 100 );
        }
      },
      onFailure: function( inError ){
        console.log( 'Failed to check app installation' );
        console.log( '[' + inError.errorCode + ']: ' + inError.errorText, getLaunchAppID( provider ), 'check app installation' );
        sendExecptionToSentry( inError, `${ SENTRY_TAG.APP_INSTALLATION_FAILED } ${ provider } ${ getLaunchAppID( provider ) }`, SENTRY_LEVEL.ERROR );
        // To-Do something
      }
    } );
  }

  const getPlaybackURL = ( lastWatchData ) => {
    let playURL = null, licenceUrl = null, epidsSet = null;
    if( providerName?.toLowerCase() === PROVIDER_LIST.SHEMAROO_ME ){
      playURL = lastWatchData.partnerDeepLinkUrl;
    }
    else if( configAuthType === 'JWTToken' || provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
      playURL = lastWatchData.dashWidewinePlayUrl;
    }
    else {
      playURL = lastWatchData.playUrl;
    }
    return playURL;
  }

  const viewContentDetailEvent = ( ) => {
    /* Mixpanel-event */
    let autoPlayValue  = false
    if( !getAuthToken() && trailor_url ){
      autoPlayValue = true
    }
    if( getAuthToken() && trailor_url ){
      autoPlayValue = profileAPIResult && profileAPIResult.data?.autoPlayTrailer
    }
    const taUseCaseId = getTAUseCaseId( storeRailData.current )
    const source = getMixpanelData( 'contentView' )
    view_content( metaData, responseSubscription, source, taUseCaseId, autoPlay, props.inputValue )
  }


  const fetchDataRecommendations = ( contentType, showType, id, provider ) => {
    callApi.current = false
    const placeHolder = getPlaceHolder( config, contentType );
    if( placeHolder ){
      setPlaceHolderForMovies( placeHolder );
      recoFetchData( { config, contentType, showType, id, provider, fallback: false } )
    }
  }

  const onSeasonClick = ( item ) => {
    callApi.current = false
    if( ( item.seriesName === 'Episode' || item.seriesName === 'Other Episode' ) && seriesLengthZero ){
      return null
    }
    else {
      item.id ? setSeasonID( item.id ) : setSeasonID( metaData.brandId )
    }
  }

  const callBackFnTopPos = () =>{
    const minPosition = Math.min( ...railsDatapositionRef.current )
    if( ref.current ){
      ref.current.scrollTop = minPosition - 500
    }
    setBannerShow( true );
  }

  const onRailFocus = useCallback( ( { y, ...rest }, fkr, isPrimeNudgeEnable ) => {
    if( fkr ){
      previousPathName.previousMediaCardFocusBeforeSplash = fkr
    }
    railsDatapositionRef.current.push( rest.top )
    const minPosition = Math.min( ...railsDatapositionRef.current )
    const totalHeight = ref.current?.clientHeight
    if( rest.node?.className === 'SeasonTab' ){
      if( document.querySelector( '.PlaybackInfo__seriescontent' ) ){
        document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '1.8rem'
      }
      counterRef.current ++
      seasonTabpositionRef.current = rest.top
      if( counterRef.current <= 1 ){
        const addedValue = isPrimeNudgeEnable ? -230 : 0
        sessonTabPositionRetainRef.current = totalHeight - ( rest.top + addedValue )
      }
      if( ref.current ){
        ref.current.scrollTop = seasonTabpositionRef.current !== null && sessonTabPositionRetainRef.current
      }
      setIsFocusOnEpisode( true )
    }
    else if( rest.node?.className.includes( 'MediaCarousel' ) ){
      if( document.querySelector( '.PlaybackInfo__seriescontent' ) ){
        document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '1.8rem'
      }
      if( document.querySelector( '.PlaybackInfo__scrollContainer' ) !== null ){
        setTimeout( ()=> {
          if( document.querySelector( '.PlaybackInfo__scrollContainer' ) ){
            document.querySelector( '.PlaybackInfo__scrollContainer' ).scrollTop = sessonTabPositionRetainRef.current
          }
        }, 10 )
      }
      setIsFocusOnEpisode( true )
    }
    else if( rest.node?.className === 'PiDetailsDescription' ){
      if( document.querySelector( '.PlaybackInfo__seriescontent' ) ){
        document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '0'
      }
      if( ref.current ){
        ref.current.scrollTop = 0
      }
    }
    else if( rest.node?.className.includes( 'Button--play ' ) ){
      setIsFocusOnEpisode( false )
      if( document.querySelector( '.PlaybackInfo__seriescontent' ) ){
        document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '0'
      }
      if( ref.current ){
        ref.current.scrollTop = 0
      }
      setBannerShow( true );
    }
    else if( seasonPlayRef.current === null ){
      if( ref.current ){
        ref.current.scrollTop = 0
      }
    }
    else if( ref.current ){
      ref.current.scrollTop = rest.top
    }

  }, [ref] );

  const onRailFocusViewAll = useCallback( ( { y, ...rest }, isPrimeNudgeEnable ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_VIEW_ALL'
    railsDatapositionRef.current.push( rest.top )
    const totalHeight = ref.current?.clientHeight
    if( rest.node?.className.includes( 'Button--viewAllEpisodes' ) ){
      if( document.querySelector( '.PlaybackInfo__seriescontent' ) ){
        document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '1.8rem'
      }
      seasonTabpositionRef.current = rest.top
      counterRef.current ++
      if( counterRef.current <= 1 ){
        const addedValue = isPrimeNudgeEnable ? -230 : 0
        sessonTabPositionRetainRef.current = totalHeight - ( rest.top + addedValue )
      }
      if( ref.current ){
        ref.current.scrollTop = seasonTabpositionRef.current !== null && sessonTabPositionRetainRef.current
      }
    }
  }, [ref] );

  const onPrimeCardFocus = useCallback( ( { y, ...rest } ) =>{
    if( rest.node?.className.includes( 'BannerContainer' ) && document.querySelector( '.PlaybackInfo__seriescontent' ) ){
      document.querySelector( '.PlaybackInfo__seriescontent' ).style.marginTop = '0'
    }
  }, [ref] )

  const openModal = () => {
    setModalPopup( true )
    modalRef.current?.showModal();
    setIsFocusOnEpisode( true )
    /* Mixpanel-event */
    synopsis_more_click( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL )
  };

  const hideModal = () => {
    setModalPopup( false )
    setIsFocusOnEpisode( false )
    setTimeout( ()=> setFocus( 'BUTTON_MODAL' ), 100 )
  };

  const hideLaunchProviderModal = () => {
    setLaunchProviderPopupToTrue( false )
    setIsFocusOnEpisode( false )
    launchProviderRef?.current?.close();
    setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
  };

  const MouseWheelHandler = ( e ) => {
    const deltaY = e.deltaY; // Vertical distance scrolled by the mouse wheel
    if( deltaY < 0 && !modalDom() ){
      setShowSynopsis( false )
      setBannerShow( true )
      clearTimeout( clearTimeOutRef.current );
      clearTimeOutRef.current = setTimeout( ()=>{
        if( document.querySelector( '.PlaybackInfo__scrollContainer' ) ){
          document.querySelector( '.PlaybackInfo__scrollContainer' ).scrollTop = 0
        }
      }, 100 )
    }
  }

  const onViewAllClick = () => {
    clearEpisodeListData( episodePageData )
    piPageFocus.current = 'BUTTON_PRIMARY'
    episodeCardId.current = null
    /* Mixpanel-event */
    see_all_episode( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL )
    history.push( {
      pathname: `/content/episode/${type}/${id}`,
      args: {
      }
    } )
  }

  const fetchRecommendationFallback = () => {
    if( fallbackApi.current ){
      relatedShowsFetchData()
    }
    else if( !fallbackApi.current ){
      fallbackApi.current = true
      if( metaData.seriesId && seasonList.length > 0 ){
        recoFetchData( { config, contentType: seasonList[0].contentType, showType: CONTENT_TYPE.VOD, id: metaData.vodId, provider: seasonList[0].provider, fallback: true, genre: metaData.masterGenre?.toString() || metaData.genre?.toString() } )
      }
      else {
        recoFetchData( { config, contentType: metaData.contentType, showType: metaData.parentContentType, id: metaData.vodId, provider: metaData.provider, fallback: true, genre: metaData.masterGenre?.toString() || metaData.genre?.toString() } )
      }
    }
  }

  const handleSubscriptionRedirection = ( boolean ) => {
    let flag = true;
    try {
      const refreshUserSubscription = getRefreshUserSubscription( config );
      const trackMaTriggerFrequency = getTrackMaTriggerFrequency( config );
      if( refreshUserSubscription >= 1 && getSmartTroubleshootingRefreshCount() < refreshUserSubscription ){
        flag = false;
        setSmartTroubleshootingRefreshCount( getSmartTroubleshootingRefreshCount() + 1 );
        onLogin( true, { playCTAClicked: true, provider: provider } );
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
          selectedPackageCard.current = currentPlan
          previousPathName.current = window.location.pathname
          previousPathName.navigationRouting = window.location.pathname
        }
        selectedpartnerId.current = metaData.partnerId
        history.push( redirection( myPlanProps ) )
      }
    }
  }

  const hideFibrePlanPopup = () =>{
    setshowFibrePlanPopUp( false )
    fibrePlanModalRef.current?.close()
    setFocus( 'BUTTON_PRIMARY' )
  }
  const openFibrePlanPopup = () => {
    setshowFibrePlanPopUp( true )
    setTimeout( () =>{
      fibrePlanModalRef.current?.showModal();
    }, 20 )
  }

  const openFancodeDeeplinkContentPopup = () => {
    setFancodeDeeplinkPopup( true )
    fancodeDeeplinkPopupRef?.current?.showModal();
  }

  const hideFancodeDeeplinkContentPopup = () => {
    setFancodeDeeplinkPopup( false )
    fancodeDeeplinkPopupRef.current?.close()
    setFocus( 'BUTTON_PRIMARY' )
  }

  const handlePlayerClick = () => {
    piPageFocus.current = 'BUTTON_PRIMARY'
    setIsPlayClicked( true )
    setIsTrailerClicked( false )
    if( !getAuthToken() ){
      setshowChecksumPopup( false )
      previousPathName.current = window.location.pathname
      previousPathName.navigationRouting = window.location.pathname
      setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.PLAYBACK )
      setIsLoginToggle( true )
      history.push( '/login' )
    }
    else if( getAuthToken() ){
      const label = getContentLabel()
      const contentDetails = getContentDetails( metaData, config, channelMeta, url, ( lastWatchResponse?.data?.durationInSeconds > 0 ? lastWatchResponse.data : null ) );
      const isPaidContent = isCrownNew( myPlanProps, { ...contentDetails, contractName: contractName.contractName }, true )
      if( isPaidContent && responseSubscription && ( responseSubscription.error?.response?.data?.message || ( responseSubscription.response && responseSubscription.response.code !== 0 ) ) ){
        // Calling Current API incase of Upstream error in current API ( Ajay Aligned )
        responseSubscription?.setBaid?.( 0 );
        setTimeout( () => {
          responseSubscription?.setBaid?.( getBaID() );
        }, 0 );
        setTimeout( () =>{
          openCurrentSubscriptionPopup()
        }, 20 )
      }
      else if( ( label?.includes( constants.PLAYBTN_LABEL ) || storedLastWatchData?.lastWatchedSeconds > 0 ) && configAuthType?.toLowerCase() === constants.AUTH_TYPE_UNKNOWN && compareBuildVersions( COMMON_HEADERS.VERSION, configResponse.app.appUpgrade[getPlatformTypeForTA()].recommendedVersion ) ){
        setTimeout( () => {
          openRecommendedUpdatePopup()
        }, 400 )
      }
      else if( label?.includes( constants.PLAYBTN_LABEL ) && metaData && metaData.partnerSubscriptionType === constants.PREMIUM && !isValidCheckSum ){
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        setshowChecksumPopup( true )
        setTimeout( () =>{
          checksumModalRef.current?.showModal();
        }, 20 )
        player_play_event( MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL, null, metaData, props, getMixpanelData( 'playerSource' ), myPlanProps, miscellaneousVerbiages?.restrictPlayBackMixPanelReason || SECURITY_CHECKSUM_VERBIAGES.restrictPlayBackMixPanelReason, 0, 0, 0, 0, taUseCaseId, isLiveContentType( type ), responseSubscription, null );
      }
      else if( isLiveContentType( type ) ){
        if( getChannelPlayableStatus( liveChannelIds, subscriptionStatus, id ) ){
          playNonSubscribedLiveTV( metaData, channelMeta )
          parentalPinFetchData()
        }
        else {
          handleSubscriptionRedirection( true );
        }
      }
      else if( !isLiveContentType( type ) ){
        if( isPaidContent && !metaData.trailerFromPartner ){
          selectedPackageCard.current = currentPlan
          previousPathName.current = window.location.pathname
          previousPathName.navigationRouting = window.location.pathname
          const isFibrePack = isIspEnabled( myPlanProps )
          if( isFibrePack ){
            openFibrePlanPopup()
          }
          else if( provider?.toLowerCase() === flexiPlanVerbiages?.partnerForFDORaised?.toLowerCase() && flexiPlanVerbiages?.partnerChangeFDORaised ){
            setAppleButtonClick( APPLETV.UPGRADEBUTTON ) // This needs to be checked sarthak
            setIsFocusOnEpisode( true )
          }
          else if( myPlanProps?.appSelectionRequired ){
            setMixpanelData( 'zeroAppSource', 'CONTENTPLAYBACK' )
            setQRCodeSuccess( true )
          }
          else if( getAgeRating() && getAgeRating() !== constants.NO_RESTRICTION ){
            handleRedirectionParentalPinSetup( history, { subscriptionSuccess: true } )
          }
          else {
            handleSubscriptionRedirection();
          }
        }
        else if( metaData.trailerFromPartner ){
          if( playUrl ){
            setTrailor_url( playUrl )
            handleTrailorClick( 'BUTTON_PRIMARY' )
          }
          else if( provider?.toLowerCase() === PROVIDER_LIST.ZEE5 ){
            trailerFromDeepLinkUrl.current = true
            checkAppInstalled( );
          }
        }
        else if( getProviderWithoutToken( provider, PROVIDER_LIST.PRIME ) ){
          handlePrimeCTA( myPlanProps, entitlementStatusFetchData, parentalPinFetchData, handleSubscriptionRedirection );
        }
        else if( getProviderWithoutToken( provider, PROVIDER_LIST.APPLETV ) ){
          if( isTizen ){
            handleApplePlayBackSamsung( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, appleToastMessage?.lsPendingToastMessage, setNotificationIcon )
          }
          else {
            handleApplePlayBackLG( myPlanProps, appleFetchData, setShowNotification, setNotificationMessage, appleToastMessage?.lsPendingToastMessage, setNotificationIcon, responseSubscription, previousPathName, parentalPinFetchData, playEventFromPopupRef, metaData )
          }
        }
        else if( provider?.toLowerCase() === PROVIDER_LIST.FANCODE && metaData?.runtimePlaybackURLGenerationRequired ){
          if( contentPlaybackData.playBackType === constants.DEEPLINK ){
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
  }
  const handleTrailorClick = ( type ) => {
    piPageFocus.current = type
    /* Mixpanel-event */
    previousPathName.current = window.location.pathname
    setIsTrailerClicked( true )
    setIsPlayClicked( false )
    play_trailor( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, autoPlay )
    if( isTrailerStartedEvent ){
      trailer_started( metaData, responseSubscription, PAGE_NAME.CONTENT_DETAIL, autoPlay )
      setTrailerContentCategory( 'TRAILER' )
    }
    // setProviderContentId( providerContentId )
    setPlayBackTitle( playBackTitle )
    // setIsViewTrailorPiPage( true )
    history.push( {
      pathname: `/Trailor`
    } )
  }

  const isSeries = () => {
    let isSeries = false;
    if( type === CONTENT_TYPE.SERIES || type === CONTENT_TYPE.BRAND || type === CONTENT_TYPE.TV_SHOWS ){
      isSeries = true;
    }
    return isSeries;
  }

  const setPlayText = () => {
    let S = '';
    let E = '';

    S = lastWatchResponse.data.season ? ' S' + lastWatchResponse.data.season : ''; // isSeries() ? ' S1' : '';
    E = lastWatchResponse.data.season ? ' E' + lastWatchResponse.data.episodeId : ''; // isSeries() ? ' E1' : '';

    if( playStatus?.toLowerCase() === 'resume' ){
      if( isSeries() ){
        return 'Resume' + S + E;
      }
      else {
        return 'Resume'
      }
    }
    else if( playStatus?.toLowerCase() === 'replay' ){
      if( isSeries() ){
        return 'Replay' + S + E;
      }
      else {
        return 'Replay'
      }
    }
    else if( playStatus?.toLowerCase() === 'play' || 'play now' ){
      if( isSeries() ){
        return constants.PLAYBTN_LABEL + S + E;
      }
      else {
        return constants.PLAYBTN_LABEL
      }
    }
    else {
      return '';
    }
  }


  const enableClaimPrime = () => {
    return getProviderWithToken( provider, PROVIDER_LIST.PRIME ) && getSubscriptionStatus( myPlanProps, SUBSCRIPTION_STATUS.ACTIVE ) && getPrimeNudgeStatus( receivePubnubAfterScanning.current, entitlementStatusResponse, myPlanProps )
  }


  const getContentLabel = () => {
    const playLabel = config?.playButtonVerbiages?.playCTA || constants.PLAYBTN_LABEL;
    const subscribeToWatchLabel = config?.playButtonVerbiages?.unsubscribedCTA || constants.SUBSCRIBE_TO_WATCH;
    const upgradeToWatchLabel = config?.playButtonVerbiages?.upgradeCTA || constants.UPGRADE_TO_WATCH;
    const playButtonVerbiages = config?.playButtonVerbiages
    const contentDetails = getContentDetails( metaData, config, channelMeta, url )
    // const isPaidContent = isCrown( myPlanProps?.subscriptionStatus, myPlanProps?.isLowerPlan, myPlanProps?.nonSubscribedPartnerList, getContentDetails( metaData, config, channelMeta, url ).provider, getContentDetails( metaData, config, channelMeta, url ).partnerSubscriptionType, contractName.contractName, getContentDetails( metaData, config, channelMeta, url )?.contentType, getContentDetails( metaData, config, channelMeta, url ).freeEpisodesAvailable ) && !!config?.configVerbiage
    const isPaidContent = isCrownNew( myPlanProps, { ...contentDetails, contractName: contractName.contractName }, true ) && !!config?.configVerbiage
    const otherText = ( isLiveContentType( type ) || liveContent ) ? playLabel : ( playStatus ) ? setPlayText() : `${playLabel}${( metaData?.taShowType === 'VOD-TV_SHOWS' ) ? handleNullInString( ( ' S' + metaData.season + ' E' + metaData.episodeId ) ) : ''}`
    if( !getAuthToken() ){
      return playButtonVerbiages?.guestCTA || constants.LOGIN_TO_WATCH
    }
    else if( getAuthToken() ){
      if( isPaidContent && !isLiveContentType( type ) && !metaData.trailerFromPartner ){
        if( myPlanProps?.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE ){
          return subscribeToWatchLabel;
        }
        else {
          const itemArray = myPlanProps?.nonSubscribedPartnerList || []
          const nonListedPatner = itemArray.length > 0 && provider && itemArray.filter( data => data?.partnerName?.toLowerCase() === provider?.toLowerCase() ).length > 0
          const isPatnerPremiumContent = contentDetails?.partnerSubscriptionType?.includes( constants.PREMIUM )
          if( ( myPlanProps?.subscriptionStatus === constants.ACTIVE || redirection( myPlanProps ) === '/plan/current' ) && ( nonListedPatner || isPatnerPremiumContent ) ){
            return upgradeToWatchLabel;
          }
          else if( myPlanProps?.subscriptionStatus === constants.ACTIVE && !nonListedPatner ){
            return otherText // TODO: liveContent case need to verify
          }
          else if( getProductName() === PACKS.FREEMIUM || ( getProviderWithoutToken( provider, PROVIDER_LIST.PRIME ) && getPrimeStatus( {}, myPlanProps?.apvDetails?.primePackStatus, PRIME.PACK_STATUS.CANCELLED ) ) ){
            return subscribeToWatchLabel;
          }
          else {
            return playLabel;
          }
        }
      }
      else if( metaData.trailerFromPartner ){
        return otherText
      }
      else if( getProviderWithoutToken( provider, PROVIDER_LIST.APPLETV ) && myPlanProps?.appleDetails?.entitlementStatus === APPLETV.CLAIM_STATUS.ENTITLEMENT_INITIATED ){
        return APPLETV.BUTTON
      }
      else if( getProviderWithoutToken( provider, PROVIDER_LIST.APPLETV ) && APPLE_REDIRECTION_KEYS.includes( myPlanProps?.appleDetails?.entitlementStatus ) ){
        return getAppleJourneyStatus( myPlanProps?.appleDetails ) === APPLETV.CLAIM_STATUS.ENTITLED ? APPLETV.BUTTON : otherText
      }
      else if( isLiveContentType( type ) && !getChannelPlayableStatus( liveChannelIds, subscriptionStatus, id ) ){
        return contentInfoResponse?.data?.piPageCTATextLs?.header || playLabel
      }
      else {
        return otherText // TODO: liveContent case need to verify
      }
    }
  }

  const showTitle = ( metaData ) =>{
    if( metaData?.contentType === CONTENT_TYPE.MOVIES ){
      return 'Related Movies'
    }
    else if( metaData?.contentType === CONTENT_TYPE.WEB_SHORTS ){
      return 'Related Shorts'
    }
    else {
      return 'Related Shows'
    }
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
    setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
  };

  const fetchPlaybackUrls = async( storedLastWatchData, contentSUbscriberDetailInfo ) => {
    let nonLivePlaybackUrls;
    if( contentSUbscriberDetailInfo ){
      console.log( 'contentSUbscriberDetailInfo', contentInfoResponse, contentSUbscriberDetailInfo )
      nonLivePlaybackUrls = await getPlayableUrls( myPlanProps, contentSUbscriberDetailInfo, config, storedLastWatchData )
    }
    else {
      nonLivePlaybackUrls = await getPlayableUrls( myPlanProps, contentInfoResponse, config, storedLastWatchData )
    }
    setContentPlaybackData( nonLivePlaybackUrls )
  };

  const getTrailerFromPlayBackAPI = ()=>{

    const newParams = {
      provider : metaData?.provider,
      partnerContentId: metaData?.brandProviderContentId || metaData?.providerContentId,
      contentType: metaData.contentType
    }
    if( !isEmptyObject( newParams ) ){
      fetchzeeTrailer( newParams )
    }
  }

  const getTrailor = async() => {
    const trailor_url =  await getTrailorPlayUrl( contentInfoResponse, myPlanProps )
    if( trailor_url ){
      setTrailor_url( trailor_url );
      setZeeLoader( false )
    }
    else if( contentInfoResponse?.data?.meta?.provider.toLowerCase() === PROVIDER_LIST.ZEE5 && !contentInfoResponse?.data?.meta?.trailerFromPartner ){
      getTrailerFromPlayBackAPI()
    }
    else {
      setZeeLoader( false )
    }

  };

  const openCurrentSubscriptionPopup = () => {
    setShowCurrentAPIErrorPopup( true )
    currentAPIErrorPopupRef?.current?.showModal();
  }
  const hideCurrentSubscriptionPopup = () => {
    setShowCurrentAPIErrorPopup( false )
    currentAPIErrorPopupRef?.current?.close()
    setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
  };

  const openActivateAppleErrorPopup = () => {
    setShowActivateAppleErrorPopup( true )
    activateAppleErrorPopupRef?.current?.showModal();
  }

  const hideActivateAppleErrorPopup = () => {
    setShowActivateAppleErrorPopup( false )
    activateAppleErrorPopupRef?.current?.close();
    setTimeout( ()=> setFocus( 'BUTTON_PRIMARY' ), 100 )
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
      previousPathName.playerScreen = '';
      previousPathName.storeLiveData = []
      previousPathName.storeLiveTitle = '';
      previousPathName.storeLiveSectionSource = '';
      previousPathName.storeLiveId = '';
      previousPathName.previousId = '';
      previousPathName.liveTotalRecords = 0
      clearTimeout( clearTimeOutRef.current );
      clearTimeout( clearFocusValueRef.current );
      if( isLiveContentType( type ) ){
        setContentPlaybackData( null )
      }
      setTrailerCurrentTime( null )
      setTrailor_url()
      setTrailerContentCategory( )
      setTrailerFromApi()
      trailerFromDeepLinkUrl.current = null
    }
  }, [] )

  useEffect( () => {
    const elm = document.querySelector( '.PiDetailsDescription__content > p' );
    countLine( elm, setCountLine );
  }, [getContentTitle( metaData, channelMeta ).description] );

  useEffect( () => {
    if( recoResponse && recoResponse.data && Array.isArray( recoResponse.data.contentList ) && recoResponse.data.contentList.length > 0 ){
      fallbackApi.current = false
      const response = recoResponse.data.contentList?.map( v => ( { ...v, isRecommendation: true } ) )
      setContentList( response )
    }
    if( recoResponse && recoResponse.data && Array.isArray( recoResponse.data.contentList ) && recoResponse.data.contentList.length === 0 ){
      fetchRecommendationFallback()
    }
    if( recoResponse && recoResponse.data && !recoResponse.data.contentList ){
      fetchRecommendationFallback()
    }
    if( recoResponse && !recoResponse.data ){
      fetchRecommendationFallback()
    }
    if( recoError ){
      fetchRecommendationFallback()
    }
  }, [recoResponse, recoError] )

  useEffect( () => {
    if( relatedShowsResponse?.data?.contentList.length ){
      fallbackApi.current = false
      const response = relatedShowsResponse.data.contentList?.map( v => ( { ...v, isRecommendation: false } ) )
      setContentList( response )
    }
  }, [relatedShowsResponse] )

  useEffect( ()=>{
    positionCounter.current > 0 ? setLoaderOnLiveWhenContentChanges( true ) : setLoaderOnLiveWhenContentChanges( false )
  }, [positionCounter.current] )

  useEffect( () => {
    if( entitlementStatusResponse || entitlementStatusError ){
      if( getProviderWithToken( metaData?.provider, PROVIDER_LIST.PRIME ) ){
        handleStatusResponsePrime( entitlementStatusResponse, entitlementStatusError, history, config, myPlanProps, metaData?.provider, providerContentId, type, receivePubnubAfterScanning.current, setNotificationIcon, setNotificationMessage, setShowNotification );
        receivePubnubAfterScanning.current = {}
        if( entitlementStatusResponse?.data?.primeStatus?.entitlement_status === PRIME.PACK_STATUS.ACTIVATED ){
          setTimeout( () => {
            setFocus( 'BUTTON_PRIMARY' )
          }, 1000 );
        }
      }
      else if( getProviderWithToken( metaData?.provider, PROVIDER_LIST.APPLETV ) ){
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
    if( receivePubnubAfterScanning.current?.status ){
      setFocus( 'BUTTON_PRIMARY' )
      if( getProviderWithToken( metaData?.provider, PROVIDER_LIST.PRIME ) || getProviderWithToken( metaData?.provider, PROVIDER_LIST.APPLETV ) ){
        entitlementStatusFetchData( { primePrimaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
      }
    }
  }, [receivePubnubAfterScanning.current, metaData?.provider] )

  useEffect( () => {
    if( parentalPinError ){
      showToastMsg( setShowNotification, setNotificationMessage, constants.LOGIN_MSG )
    }
  }, [parentalPinError] )

  useEffect( ( ) => {
    if( catalogFlag || bingeListFlag || searchFlag ){
      setType( contentParams.type )
      setId( contentParams.id )
      setProvider( contentParams?.provider )
    }

  }, [contentParams] )

  useEffect( ( ) => {
    if( fallbackId ){
      setType( CONTENT_TYPE.BRAND )
      setId( fallbackId )
    }
  }, [fallbackId] )

  useEffect( () => {
    if( id ){
      callApi.current = true
      setShowSynopsis( false )
      isLiveContentType( type ) && setFocus( piPageFocus.current );
    }
  }, [id] )

  useEffect( () => {
    if( liveRecommendationResponse?.data ){
      previousPathName.storeLiveData = previousPathName.previousId === id ? previousPathName.storeLiveData.concat( liveRecommendationResponse.data.contentList || [] ) : liveRecommendationResponse.data.contentList || []
      previousPathName.storeLiveTitle = liveRecommendationResponse.data.title || '';
      previousPathName.storeLiveSectionSource = liveRecommendationResponse.data.sectionSource || '';
      previousPathName.storeLiveId = liveRecommendationResponse.data.id || '';
      previousPathName.previousId = id;
      previousPathName.liveTotalRecords = liveRecommendationResponse.data.totalCount
    }
  }, [liveRecommendationResponse, liveRecommendationError] )

  useEffect( () => {
    if( tagResponse || getTokenResponse ){
      const res = tagResponse?.data?.tag || getTokenResponse?.data?.tag;
      setTagId( res );
      setAppLaunch( true )
    }
    console.log( 'partnerDeeplinkUrl = ', storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl + ' &tag= ' + tagId ); // eslint-disable-line
  }, [tagResponse, getTokenResponse] );

  useEffect( ()=>{
    if( appLaunch && ( provider?.toLowerCase() === PROVIDER_LIST.ZEE5 || provider?.toLowerCase() === PROVIDER_LIST.LIONSGATE ) ){
      if( parentalPinStatus ){
        const args = {
          providerName: provider,
          tagid: tagId,
          partnerDeepLinkUrl: storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl,
          contentId: providerContentId,
          contentType: type === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : type
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        playerEventFetchData( { type, id: storedLastWatchData?.vodId || metaData?.vodId || id, watchDuration: 10 } );
        const taUseCaseId = getTAUseCaseId( storeRailData.current )
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
        launchPartnerApp( provider, getParamsTags( provider, storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl, tagId, storedLastWatchData?.providerContentId ? storedLastWatchData?.providerContentId : providerContentId ), type, liveContent, storedLastWatchData?.lastWatchedSeconds );
      }
    }
  }, [appLaunch] )

  useEffect( () => {
    if( parentalPinResponse ){
      previousPathName.isSearch = false
      previousPathName.current = window.location.pathname
      const pinRequired = parentalPinResponse.data.pinRequired
      setParentalPinStatus( pinRequired )
      const pContentVodId = getVodID( metaData, storedLastWatchData );
      watchLearnAction( getContentTitle( metaData ).title, metaData?.contentType, metaData?.provider )
      addPlayLA( pContentVodId )

      if( deepLinkPartners.includes( provider?.toLowerCase() ) ){
        checkAppInstalled( pinRequired );
      }
      else {
        setPlayBackTitle( storedLastWatchData?.contentTitle ? storedLastWatchData.contentTitle : playBackTitle )
        isLiveContentType( type ) && playLiveTV( metaData, channelMeta )
        if( !pinRequired ){
          previousPathName.previousMediaCardFocusBeforeSplash = null;
        }
        console.log( 'live arguments from PI', type, id, metaData?.provider )
        if( configAuthType === 'JWTToken' || provider?.toLowerCase() === PROVIDER_LIST.TATASKY ){
          const CSDVodID = lastWatchResponse?.data.vodId || metaData.vodId;
          fetchCSDInfoAPI( { url: `${serviceConst.CONTENT_INFO_SUBTITLE}${CSDVodID}` } )
        }
        else {
          history.push( {
            pathname:  getPathName( metaData.provider, pinRequired, metaData.contentType ),
            args: {
              type: type,
              id: id,
              provider: metaData.provider
            }
          } )
        }
      }
    }
  }, [parentalPinResponse] );

  useEffect( ()=>{
    if( CSDInfoAPIResponse && ( configAuthType === 'JWTToken' || provider?.toLowerCase() === PROVIDER_LIST.TATASKY ) ){
      if( lastWatchError || ( lastWatchResponse && lastWatchResponse.code !== 0 ) ){
        fetchPlaybackUrls( null, CSDInfoAPIResponse );
      }
      else {
        fetchPlaybackUrls( lastWatchResponse.data, CSDInfoAPIResponse );
      }
    }
  }, [CSDInfoAPIResponse] )

  useEffect( ()=>{
    if( contentPlaybackData && ( configAuthType === 'JWTToken' || provider?.toLowerCase() === PROVIDER_LIST.TATASKY ) && CSDInfoAPIResponse ){
      const pinRequired = parentalPinResponse.data.pinRequired
      const CSDPlaybackData = CSDInfoAPIResponse.data.meta;
      console.log( 'CSDPlaybackData', CSDPlaybackData )
      history.push( {
        pathname:  getPathName( CSDPlaybackData.provider, pinRequired, CSDPlaybackData.contentType ),
        args: {
          type: CSDPlaybackData.contentType,
          id: CSDPlaybackData.vodId,
          provider: CSDPlaybackData.provider
        }
      } )
    }
  }, [contentPlaybackData] )

  useEffect( ()=>{
    if( Object.keys( metaData ).length ){
      const piLevel = getPiLevel()
      metaData.autoPlayed = profileAPIResult && profileAPIResult.data?.autoPlayTrailer
      setProvider( metaData.provider )
      if( isLiveContentType( type ) ){
        setPiLevel( 1 )
      }
      else {
        setPiLevel( piLevel + 1 )
      }
      viewContentDetailEvent( )
      const data = getContentRailPositionData() || {}
      if( !data.railId && ( previousPathName.isSearch || catalogFlag ) ){
        if( metaData && metaData.contentType && metaData.contentType !== CONTENT_TYPE.WEB_SHORTS ){
          searchLAFetchData()
        }
        if( metaData?.contentType === CONTENT_TYPE.LIVE ){
          liveSearchLA()
        }
      }
      if( metaData?.contentType === CONTENT_TYPE.LIVE && ( getMixpanelData( 'playerSource' )?.toUpperCase() === PAGE_NAME.HOME.toUpperCase() || getMixpanelData( 'playerSource' ) === constants.LIVE_TV || getMixpanelData( 'playerSource' )?.toLowerCase() === PAGE_NAME.SEARCH.toLowerCase() ) ){
        liveClickLA()
      }
      getIsOrphanContent( metaData ) && learnActionForOrphanContent( metaData, responseSubscription, getMixpanelData( 'contentView' ) )
      CONTENTTYPE_SERIES.includes( metaData?.contentType?.toUpperCase() ) && loadEpisodesFromLocalStorage()
      if( getAuthToken() && metaData.provider && !( isLiveContentType( type ) ) ){
        const lastWatchParams = {
          url: metaData.provider.toLowerCase() === PROVIDER_LIST.TATASKY ? serviceConst.LAST_WATCH_TATAPLAY : serviceConst.LAST_WATCH,
          data: {
            'contentType': type,
            'contentId': Number( id ),
            'vodId': Number( getContentIdForLastWatch( metaData ) )
          }
        };
        lastWatchFetchData( lastWatchParams )
      }
    }
  }, [metaData] )

  useEffect( () => {
    if( providerName ){
      const configAuthType = checkAuthType( config?.availableProviders, providerName );
      setConfigAuthType( configAuthType );
    }
  }, [providerName] );

  useEffect( () => {
    if( modalPopup ){
      setFocus( 'BUTTON_MODAL' );
    }
  }, [modalPopup] );


  useEffect( () => {

    const data = getContentRailPositionData()
    if( !window.location.pathname.includes( 'plan/subscription' ) && !window.location.pathname.includes( '/plan/change-tenure' ) ){

      setProviderName( data?.contentPartner )
    }
    const contentPartner = getProviderName()

    if( id && previousPathName.playerScreen !== PAGE_TYPE.PLAYER_SCREEN ){
      currentPILevel.current++;
      if( config ){
        setPILoader( true );
        const distroExist = id.toString()?.includes?.( DISTRO_CHANNEL.appType )
        if( distroExist || contentParams.distroProvider === DISTRO_CHANNEL.appType || location?.search?.includes?.( 'provider=DistroTV' ) ){
          const _id = distroExist ? id.toString()?.split?.( '?' )?.[0] : id
          contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${_id}`, headers: {
            appType: DISTRO_CHANNEL.appType
          } } )
        }
        else if( ( homeDonglePageData.current?.provider?.toLowerCase() === PROVIDER_LIST.TIMESPLAY || contentPartner?.toLowerCase() === PROVIDER_LIST.TIMESPLAY ) && isLiveContentType( type ) ){
          contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${id}`, headers: {
            appType:  'TimesPlay'
          } } )
        }
        else {
          contentInfoFetchData( '', type, id )
        }
      }
    }
  }, [id, config] );

  useEffect( ()=>{
    if( fetchDetailsResponse && fetchDetailsResponse.code === 0 ){
      if( fetchDetailsResponse.data && fetchDetailsResponse.data.parent ){
        const id = fetchDetailsResponse.data.parent.id
        setFallbackId( id )
      }
    }
    else if( fetchDetailsError ){
      const piLevel = getPiLevel()
      setPiLevel( piLevel + 1 )
    }
  }, [fetchDetailsResponse, fetchDetailsError] )

  // Method to fetch seasonData
  const fetchSeasonData = ( seasonID ) => {
    if( !seasonID ){
      return;
    }

    const url =
      seasonID === metaData.brandId ?
        `${serviceConst.SERIES_LIST_TRAILER_MORE}${seasonID}/list` :
        `${serviceConst.SERIES_LIST}${seasonID}/list`;

    seasonFetchData( { url, pageNumber: 0 } );
  };

  // Handle season response
  useEffect( () => {
    if( seasonResponse?.data?.items?.length ){
      if( seasonResponse.data.offset === 0 ){
        fetchDataRecommendations(
          seasonResponse.data.items[0].contentType,
          CONTENT_TYPE.VOD,
          metaData?.vodId,
          seasonResponse.data.items[0].provider
        );
      }
      setSeasonLoader( false );
      // Deduplicate before setting season list
      setSeasonList( ( prev ) => {
        const existingIds = new Set( prev.map( item => item.id ) );
        const filteredNewItems = seasonResponse.data.items.filter( item => !existingIds.has( item.id ) );
        return [...prev, ...filteredNewItems];
      } );
    }
  }, [seasonResponse] );

  // Handle season ID changes
  useEffect( () => {
    if( seasonID ){
      setSeasonList( [] );
      pageNumber.current = 0;
      setSeasonLoader( true );
      fetchSeasonData( seasonID );
    }
  }, [seasonID] );

  useEffect( () => {
    if( id && contentInfoResponse && ( contentInfoResponse !== storedContentInfo || previousPathName.playerScreen === PAGE_TYPE.PLAYER_SCREEN ) || contentInfoError ){
      const isLive = isLiveContentType( type );
      const metaData = isLive ?
        get( contentInfoResponse, 'data.meta[0]', {} ) :
        get( contentInfoResponse, 'data.meta', {} );

      setPIMetaData( metaData );
      setStoredContentInfo( contentInfoResponse );

      if( contentInfoError || contentInfoResponse.code !== 0 ){
        setIsError( true );
        setPILoader( false );
        !isLive && fetchDetailsFetch( type, id );
      }

      setMetaData( {
        ...( metaData && Object.keys( metaData ).length ? metaData : {
          contentType: channelMeta?.contentType
        } ),
        channelId: channelMeta?.id,
        channelName: channelMeta?.channelName
      } );

      if( contentInfoResponse ){
        !isLive && getTrailor();
        setLiveContent( contentInfoResponse.data?.meta?.liveContent || isLive );
        contentInfoResponse.data?.meta?.playerAction && setPlayerAction( contentInfoResponse.data?.meta?.playerAction )
        contentInfoResponse.data?.meta?.broadcastMode && setBroadcastMode( contentInfoResponse.data?.meta?.broadcastMode )
        if( !contentInfoResponse.data || Object.keys( contentInfoResponse?.data )?.length === 0 ){
          setLoaderOnLiveWhenContentChanges( false );
          setIsError( positionCounter.current === -1 );
          !isLive && fetchDetailsFetch( type, id );
          return
        }

        setIsError( false );

        let seriesList = contentInfoResponse.data?.seriesList || [];

        // Include Shorts if available
        if( contentInfoResponse.data?.shorts?.labelName && contentInfoResponse.data?.shorts?.enabled ){
          seriesList = [...seriesList, { seriesName: contentInfoResponse.data.shorts.labelName }];
        }

        if( seriesList.length === 0 ){
          setSeriesLengthZero( true );

          if( !metaData.seriesId ){
            if( metaData.contentType === CONTENT_TYPE.WEB_SHORTS ){
              relatedShowsFetchData()
            }
            else {
              fetchDataRecommendations( metaData?.contentType, metaData.parentContentType, metaData?.vodId, metaData?.provider )
            }
          }
          else if( metaData.seriesId ){
            seriesList = [
              {
                seriesName:
                  metaData.parentContentType === CONTENT_TYPE.SERIES && metaData?.contentType === CONTENT_TYPE.SERIES ?
                    'Episode' :
                    'Other Episode',
                id: metaData.seriesId
              }
            ];
            setSeasonID( metaData.seriesId )
          }
        }
        else {
          setSeasonID( seriesList[0]?.id )
        }

        setSeries( seriesList );

        if( isLive && !fetchLiveData ){
          setFetchLiveData( true );
          fetchLiveRecommendatation( 0, contentInfoResponse.data.channelMeta?.primaryGenre || contentInfoResponse.data.meta?.[0]?.primaryGenre || contentInfoResponse.data.channelMeta?.genre?.[0] || contentInfoResponse.data.meta?.[0]?.genre?.[0], contentInfoResponse.data.meta?.[0]?.audio?.[0] );
        }
        isLive && setLoaderOnLiveWhenContentChanges( false );
        isLive && setZeeLoader( false );
        ( isLive || !getAuthToken() ) && setPILoader( false );
      }
    }
  }, [contentInfoResponse, config, contentInfoError, id] )

  useEffect( ()=>{
    if( addRemoveBingeListResponse && addRemoveBingeListResponse.data ){
      setBingeListPeopleProperties( addRemoveBingeListResponse.data?.totalBingeListCount )
      previousPathName.isSearch = false
      setIsFav( true )
      setShowNotification( true )
      setNotificationIcon( 'Success' )
      if( metaData.provider === 'Tatasky' ){
        addRemoveBingeListResponse.data.isFavourite ? setNotificationMessage( constants.ADDED_TO_BINGE_LIST ) : setNotificationMessage( constants.REMOVE_FROM_BINGE_LIST )
        !addRemoveBingeListResponse.data.isFavourite ? setBingeIcon( 'Plus' ) : setBingeIcon( 'Tick' )
      }
      else {
        addRemoveBingeListResponse.data.status ? setNotificationMessage( constants.ADDED_TO_BINGE_LIST ) : setNotificationMessage( constants.REMOVE_FROM_BINGE_LIST )
        !addRemoveBingeListResponse.data.status ? setBingeIcon( 'Plus' ) : setBingeIcon( 'Tick' )
      }
      if( addRemoveBingeListResponse.data.status || addRemoveBingeListResponse.data.isFavourite ){
        /* Mixpanel-event */
        bingelist_add( metaData, responseSubscription, data?.railTitle === constants.HERO_BANNER ? constants.HERO_BANNER : PAGE_NAME.CONTENT_DETAIL )
        if( metaData && metaData.contentType && metaData.contentType !== CONTENT_TYPE.WEB_SHORTS ){
          addLearnAction()
        }
        setIsWatchListUpdated( true )

      }
      else if( !addRemoveBingeListResponse.data.status || !addRemoveBingeListResponse.data.isFavourite ){
        /* Mixpanel-event */
        bingelist_remove_item( metaData, responseSubscription, MEDIA_CARD_TYPE.WATCHLIST, data?.railTitle === constants.HERO_BANNER ? constants.HERO_BANNER : getMixpanelData( 'bingeListSource' ) || PAGE_NAME.CONTENT_DETAIL )
      }
      setTimeout( () => {
        setShowNotification( false )
      }, 3000 );
    }
  }, [addRemoveBingeListResponse] )

  useEffect( ()=>{
    if( lastWatchResponse && lastWatchResponse.data ){
      const contentDetails = getContentDetails( metaData, config, channelMeta, url );
      const isPaidContent = isCrownNew( myPlanProps, { ...contentDetails, contractName: contractName.contractName }, true )
      if( metaData.trailerFromPartner ){
        fetchPlaybackUrls( lastWatchResponse.data )
      }
      else if( !isPaidContent && !isLiveContentType( type ) && !deepLinkPartners.includes( provider?.toLowerCase() ) && !SDK_PARTNERS.includes( provider?.toLowerCase() ) && configAuthType !== 'JWTToken' && provider?.toLowerCase() !== PROVIDER_LIST.TATASKY ){
        fetchPlaybackUrls( lastWatchResponse.data )
      }
      setStoredLastWatchData( lastWatchResponse.data )
      // TODO - Replay
      if( lastWatchResponse.data.secondsWatched >= ( lastWatchResponse.data.durationInSeconds > 0 ? lastWatchResponse.data.durationInSeconds : metaData?.duration * 60 ) && provider?.toLowerCase() !== PROVIDER_LIST.APPLETV && !metaData?.runtimePlaybackURLGenerationRequired && !metaData.trailerFromPartner ){
        setStoredLastWatchData( {
          ...lastWatchResponse.data,
          secondsWatched: 0,
          contentTitle: lastWatchResponse.data.contentTitle
        } )
        !liveContent && setPlayStatus( 'replay' );
      }
      else if( lastWatchResponse.data.secondsWatched >= 1 ){
        !liveContent && setPlayStatus( 'Resume' )
      }
      else if( lastWatchResponse.data.secondsWatched === 0 ){
        setPlayStatus( constants.PLAYBTN_LABEL )
      }
      else {
        setPlayStatus( '' )
      }
      !lastWatchResponse.data.isFavourite ? setBingeIcon( 'Plus' ) : setBingeIcon( 'Tick' )
      setPILoader( false );
    }
  }, [lastWatchResponse] )

  useEffect( () =>{ // Handling playback URLs in case of lastWatchError
    if( lastWatchError || ( lastWatchResponse && lastWatchResponse.code !== 0 ) ){
      const contentDetails = getContentDetails( metaData, config, channelMeta, url );
      const isPaidContent = isCrownNew( myPlanProps, { ...contentDetails, contractName: contractName.contractName }, true ) // Third param is true to maintain existing functionality of is crown and passed config.enableCrown from other places to handle UI logic
      if( !isPaidContent && !isLiveContentType( type ) && !deepLinkPartners.includes( provider?.toLowerCase() ) && configAuthType !== 'JWTToken' && provider?.toLowerCase() !== PROVIDER_LIST.TATASKY ){
        fetchPlaybackUrls( null )
      }
      setPILoader( false )
    }
  }, [lastWatchResponse, lastWatchError] )

  useEffect( ()=>{
    if( !isLiveContentType( type ) && !modalDom() ){
      clearFocusValueRef.current = setTimeout( () => {
        setFocus( piPageFocus.current )
        episodePageData.selectedIndex = null
        setExpandShow( false )
      }, 100 );
    }
  }, [id, providerName] )

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

  useEffect( ()=>{
    if( isLiveContentType( type ) || liveContent ){
      setStoredLastWatchData( null );
    }
  }, [type] )

  useEffect( ()=>{
    if( metaData && !metaData.trailerFromPartner && metaData.provider?.toLowerCase() === PROVIDER_LIST.ZEE5 ){
      getTrailerFromPlayBackAPI()
    }
  }, [metaData] )

  useEffect( ()=>{
    if( zeeTrailerResponse && !zeeTrailerLoading ){
      setZeeLoader( false );
      if( zeeTrailerResponse.data?.url ){
        setTrailerFromApi( true )
        setTrailerContentCategory( 'TRAILER' )
        setTrailor_url( zeeTrailerResponse.data.url )
      }
    }
    else if( zeeTrailerError ){
      setZeeLoader( false );
    }
  }, [zeeTrailerResponse, zeeTrailerLoading, zeeTrailerError] )

  return (
    <div ref={ ref }>
      <div
        className={ classNames( 'PlaybackInfo', {
          'PlaybackInfo--Empty':  isError
        } ) }
      >
        {
          ( showSonyPILoader || piLoader || zeeLoader ) && !liveFocused ? <Loader /> : (
            <FocusContext.Provider value={ focusKey }>
              <div
                id='scrollContainer'
                className={ seasonID ? 'PlaybackInfo__scrollContainer' : 'PlaybackInfo__scrollContainerWithOutSeasons' }
                ref={ ref }
              >
                <InfiniteScroll
                  dataLength={ contentList.length }
                  scrollableTarget='scrollContainer'
                  className={ isLiveContentType( type ) && 'PlaybackInfo__infiniteScroll' }
                  style={ {
                    overflow: 'hidden'
                  } }
                >
                  { isError ? (
                    <ErrorPage error={ handleErrorMessage( contentInfoError, contentInfoResponse, constants.CONTENT_NOT_AVAILABLE ) } />
                  ) : (
                    <>
                      <div className={ 'PlaybackInfo__Banner' }>
                        { bannerShow &&
                          <FocusContext.Provider focusable={ false }
                            value=''
                          >
                            <BannerComponent
                              imageGradient
                              alt='Background BannerComponent image'
                              playerProps={ {
                                srcBanner: trailor_url
                              } }
                              bgImg={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.TOP_LANDSCAPE, url ) }/${ metaData?.boxCoverImage }` }
                              isFocusOnEpisode={ isFocusOnEpisode }
                              liveContent={ isLiveContentType( type ) }
                              fromPiPage={ true }
                            />
                          </FocusContext.Provider>
                        }
                      </div>
                      <div
                        className={
                          classNames( 'PlaybackInfo__header',
                            { 'PlaybackInfo__header--withSynopsis': showSynopsis },
                            { 'PlaybackInfo__header--withLive': isLiveContentType( type ) }
                          )
                        }
                      >
                        { !showSynopsis && <div className={ `PlaybackInfo__synopsis ${ isLiveContentType( type ) ? 'PlaybackInfo__liveSynopsis' : '' }` }>
                          <div className='PlaybackInfo__title'>
                            <PItitle
                              fromPlaybackInfo={ true }
                              showExpiredText={ true }
                              contractName={ contractName.contractName }
                              seasonList={ contentInfoResponse && contentInfoResponse.data && contentInfoResponse.data.seriesList && contentInfoResponse.data.seriesList.length > 0 ? contentInfoResponse.data.seriesList : null }
                              { ...getContentDetails( metaData, config, channelMeta, url ) }
                              descriptionLive={ getContentTitle( metaData, channelMeta ).description }
                              durationLive={ getContentTitle( metaData, channelMeta ).duration }
                              id={ id }
                              showLiveUI={ true }
                            />
                          </div>
                          {
                            isLiveContentType( type ) &&
                              (
                                <>
                                  <div className='live-pi-description' >
                                    <Text
                                      textStyle='pi-description'
                                      color='white'
                                    >
                                      { truncateWithThreeDots( getContentTitle( metaData, channelMeta ).description, 150, false ) || '\u00A0' }
                                    </Text>
                                  </div>
                                  <div className='PlaybackInfo__languageList'>
                                    <LanguageList
                                      LanguageList={ metaData?.audio }
                                    />
                                  </div>
                                  {
                                    ( providerName?.toLowerCase() === PROVIDER_LIST.DISTRO_TV || providerName?.toLowerCase() === PROVIDER_LIST.TIMESPLAY ) && channelMeta?.poweredBy && channelMeta?.providerImageUrl && !getActiveSubscriptionStatus( subscriptionStatus ) &&
                                    <div className='live-pi-distroInfo'>
                                      <Text
                                        textStyle='pi-distroText'
                                        color='white'
                                      >
                                        { channelMeta?.poweredBy }
                                      </Text>
                                      <Image
                                        src={ `${cloudinaryCarousalUrl( LAYOUT_TYPE.DISTRO_POWERED_IMAGE, url, '' )}/${channelMeta?.providerImageUrl}` }
                                      />
                                    </div>
                                  }
                                </>
                              )
                          }
                          {
                            !isLiveContentType( type ) && (
                              <>
                                <div className={
                                  classNames( 'PlaybackInfo__description' ) }
                                >
                                  <PiDetailsDescription
                                    fromPlaybackInfo={ true }
                                    btnLabel={ constants.MORE_LABEL }
                                    description={ getContentTitle && truncateWithThreeDots( getContentTitle( metaData, channelMeta ).description, 145, isCountLine ) }
                                    iconImage='Plus'
                                    url='url'
                                    modalRef={ modalRef }
                                    openModal={ openModal }
                                    modelOpen={ setModalPopup }
                                    onFocus={ ( e )=> onRailFocus( e, 'BUTTON_MODAL' ) }
                                    focusKeyRefrence={ 'BUTTON_MODAL' }
                                    descriptionLive={ getContentTitle( metaData, channelMeta ).description }
                                    durationLive={ getContentTitle( metaData, channelMeta ).duration }
                                    id={ id }
                                  />
                                  { modalPopup && (
                                    <PIDetails
                                      modalRef={ modalRef }
                                      handleCancel={ hideModal }
                                      opener={ buttonRef }
                                      title={ getContentTitle && getContentTitle( metaData, channelMeta ).title }
                                      description={ getContentTitle && getContentTitle( metaData, channelMeta ).description }
                                      starring={ {
                                        title: constants.STARRING,
                                        details: metaData?.actor
                                      } }
                                      director={ {
                                        title: constants.DIRECTOR,
                                        details: metaData?.director
                                      } }
                                      producers={ {
                                        title: constants.PRODUCERS,
                                        details: metaData?.producer
                                      } }
                                      subtitles={ {
                                        title: constants.SUBTITLES,
                                        details: metaData?.subtitles
                                      } }
                                      audio={ {
                                        title: constants.AUDIO,
                                        details: metaData?.audio
                                      } }
                                      backtitle={ constants.CLOSE }
                                    />
                                  ) }
                                </div>
                                <div className='PlaybackInfo__languageList'>
                                  <LanguageList
                                    LanguageList={ metaData?.audio }
                                  />
                                </div>
                                {
                                  launchProviderPopupToTrue &&
                                  <LaunchProviderPopup
                                    provider={ provider }
                                    displayModal={ true }
                                    modalRef={ launchProviderRef }
                                    appLaunch={ appLaunch }
                                    parentalPinStatus={ parentalPinResponse?.data.pinRequired }
                                    handleCancel={ hideLaunchProviderModal }
                                    providerName={ appProviderState }
                                    tagID={ tagId }
                                    contentId={ providerContentId }
                                    partnerDeepLinkUrl={ storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl }
                                  />
                                }
                              </>
                            )
                          }
                          <div className='PlaybackInfo__buttons'>
                            {
                              isLiveContentType( type ) && previousPathName.storeLiveData && previousPathName.storeLiveData.length > 0 ? (
                                <FocusContext.Provider value={ focusKey }>
                                  <Button
                                    label={ getContentLabel() }
                                    size='medium'
                                    iconLeft={ !showingPlayIcon.includes( getContentLabel() ) }
                                    iconLeftImage='Play'
                                    primary={ !!focused }
                                    secondary={ !focused }
                                    className='Button--play'
                                    focusKeyRefrence={ 'BUTTON_PRIMARY' }
                                    onClick={ handlePlayerClick }
                                    textStyle={ 'buttonInputText' }
                                    onFocus={ ( e )=> onRailFocus( e, 'BUTTON_PRIMARY' ) }
                                  />
                                </FocusContext.Provider>
                              ) : (
                                <Button
                                  label={ getContentLabel() }
                                  size='medium'
                                  iconLeft={ !showingPlayIcon.includes( getContentLabel() ) }
                                  iconLeftImage='Play'
                                  primary={ !!focused }
                                  secondary={ !focused }
                                  className='Button--play'
                                  focusKeyRefrence={ 'BUTTON_PRIMARY' }
                                  onClick={ handlePlayerClick }
                                  textStyle={ 'buttonInputText' }
                                  onFocus={ ( e )=> onRailFocus( e, 'BUTTON_PRIMARY' ) }
                                  isPrimeEntitled={ enableClaimPrime() }
                                />
                              )
                            }
                            <FocusContext.Provider focusable={ false }
                              value=''
                            >
                              <AppleJourneyModals
                                appleButtonClick={ appleButtonClick }
                                setAppleButtonClick={ setAppleButtonClick }
                                parentalPinFetchData={ parentalPinFetchData }
                                currentPlan={ currentPlan }
                                metaData={ metaData }
                                responseSubscription={ responseSubscription }
                                setIsFocusOnEpisode={ setIsFocusOnEpisode }
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
                                partnerDeepLinkUrl={ storedLastWatchData?.partnerDeepLinkUrl || metaData?.partnerDeepLinkUrl }
                                tagID={ tagId }
                              />
                            </FocusContext.Provider>
                            { trailor_url && ( !autoPlay || !getAuthToken() ) && !isLiveContentType( type ) && !metaData.trailerFromPartner &&
                            <Button
                              label={ getTrailerCTA() }
                              size='medium'
                              secondary
                              onClick={ () => handleTrailorClick( 'BUTTON_VIEW_TRAILER' ) }
                              textStyle={ 'buttonInputText' }
                              focusKeyRefrence={ 'BUTTON_VIEW_TRAILER' }
                              onFocus={ ( e )=> previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_VIEW_TRAILER' }
                            /> }
                            {
                              !isLiveContentType( type ) && (
                                <Button
                                  onClick={ () => {
                                    piPageFocus.current = 'BUTTON_BINGELIST'
                                    if( getAuthToken() ){
                                      addRemoveBingeListFetchData()
                                    }
                                    else {
                                      previousPathName.current = window.location.pathname
                                      previousPathName.navigationRouting = window.location.pathname
                                      setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.ADD_TO_BINGE_LIST )
                                      setIsLoginToggle( true )
                                      history.push( '/login' )
                                    }
                                  } }
                                  label={ 'My Binge List' }
                                  size='medium'
                                  iconLeft
                                  iconLeftImage={ bingeIcon }
                                  secondary
                                  className='Button--mybingelist'
                                  textStyle={ 'buttonInputText' }
                                  focusKeyRefrence='BUTTON_BINGELIST'
                                  onFocus={ ( e )=> previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_BINGELIST' }
                                />
                              )
                            }
                          </div>
                          {
                            enableClaimPrime() &&
                              <BannerSubscription
                                focusKeyReference={ 'BUTTON_CLAIMPRIME' }
                                onFocus={ onPrimeCardFocus }
                                onBannerClick={ () => {
                                  piPageFocus.current = 'BUTTON_CLAIMPRIME'
                                  entitlementStatusFetchData( { primePrimaryIdentity: myPlanProps.apvDetails?.primaryIdentity } )
                                } }
                              />
                          }
                        </div> }
                        {
                          isLiveContentType( type ) && previousPathName.storeLiveData.length > 0 ? (
                            <div className='PlaybackInfo__liveRails'>
                              <MediaCarousel
                                liveFocusCard={ ( liveId, providerName )=> {
                                  positionCounter.current++
                                  setLiveFocused( true );
                                  console.log( 'val1' )
                                  if( positionCounter.current >= 0 ){
                                    // localStorage.setItem( 'liveId', liveId )
                                    contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${liveId}`, headers: {
                                      ...( isDistroContent( providerName ) && { appType: DISTRO_CHANNEL.appType } ),
                                      ...( providerName?.toLowerCase() === PROVIDER_LIST.TIMESPLAY && { appType:'TimesPlay' } )
                                    } } )
                                    if( previousPathName.liveTotalRecords > previousPathName.storeLiveData.length && previousPathName.storeLiveData?.length - 4 < positionCounter.current ){
                                      fetchLiveRecommendatation( previousPathName.storeLiveData.length )
                                    }
                                  }
                                }
                                }
                                railData={ { id: previousPathName.storeLiveId, contentList: previousPathName.storeLiveData, title: previousPathName.storeLiveTitle, sectionSource: previousPathName.storeLiveSectionSource, layoutType: LAYOUT_TYPE.LANDSCAPE } }
                                contentRailType={ 'LiveContent' }
                                focusFrom={ liveFocused && constants.LIVE_RAILS }
                                handlePlayerClickFromPI={ handlePlayerClick }
                              />
                            </div>
                          ) :
                            seasonID &&
                            <div className='PlaybackInfo__seriescontent'
                              ref={ seasonTabpositionRef }
                            >
                              <SeasonTab
                                tabheadList={ series }
                                handleClick={ ( e ) => onSeasonClick( e ) }
                                onFocus={ ( e ) => onRailFocus( e, null, enableClaimPrime() ) }
                                callBackFnTopPos={ callBackFnTopPos }
                                piSeasonList={ seasonList }
                                seasonsFrom='piSeasonList'
                                currntIndex={ currntIndex }
                                setCurrntIndex={ setCurrntIndex }
                              />
                              <Button
                                onFocus={ ( e ) => onRailFocusViewAll( e, enableClaimPrime() ) }
                                label={ constants.VIEW_ALL }
                                size='medium'
                                secondary
                                className='Button--viewAllEpisodes'
                                onClick={ () => onViewAllClick() }
                                textStyle={ 'buttonInputText' }
                                focusKeyRefrence='BUTTON_VIEW_ALL'
                              />
                            </div>
                        }
                        {
                          !isLiveContentType( type ) && (
                            <div className={ `${ ( !showSynopsis ) ? 'PlaybackInfo__seasonContainer' : seasonList.length > 0 ? 'PlaybackInfo__seasonContainerwithOutSynapsis' : 'PlaybackInfo__seasonContainer' }` }>
                              { seasonID && (
                                <div className={ `${ expandShow ? 'PlaybackInfo__seasons' : 'PlaybackInfo__seasonsTab' } ` } >
                                  { !seasonLoader ?
                                    ( seasonList &&
                                    <div
                                      ref={ seasonPlayRef }
                                    >
                                      <MediaCarousel
                                        railData={ { title: CONTENT_TYPE.SERIES, contentList: seasonList,
                                          layoutType: 'LANDSCAPE',
                                          sectionSource: 'EDITORIAL',
                                          id: 1000,
                                          totalCount: seasonResponse?.data?.total
                                        } }
                                        openSeriesInfo={ true }
                                        onFocus={ ( e ) => onRailFocus( e ) }
                                        nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
                                        isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
                                        status={ myPlanProps && myPlanProps.subscriptionStatus }
                                        releaseYear={ metaData.releaseYear }
                                        setExpandShow={ setExpandShow }
                                        contentRailType={ constants.SERIES_CONTENT }
                                        masterRating={ metaData.masterRating }
                                        directlyPlayable={ true }
                                        selectedSeason={ seasonID }
                                        setShowNotification={ setShowNotification }
                                        setNotificationMessage={ setNotificationMessage }
                                        setNotificationIcon={ setNotificationIcon }
                                        liveFocusCard={ ( liveId, providerName )=> {
                                          contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${liveId}`, headers: {
                                            ...( isDistroContent( providerName ) && { appType: DISTRO_CHANNEL.appType } )
                                          } } )
                                        } }
                                        nextSeasonPagination={ ()=>{
                                          pageNumber.current = pageNumber.current + 20
                                          seasonFetchData( { url: serviceConst.SERIES_LIST + metaData.seriesId + '/list', pageNumber: pageNumber.current } );
                                        } }
                                        showPlayButtonIcon={ true }
                                      />
                                    </div> ) : (
                                      <FocusContext.Provider focusable={ false }
                                        value=''
                                      >
                                        <div className='PlaybackInfo__seasonsLoader'>
                                          <Image
                                            src={ loaderPath }
                                          />
                                        </div>
                                      </FocusContext.Provider>
                                    )
                                  }
                                </div>
                              ) }

                              <div className={ ` ${ !showSynopsis ? 'Synopsis__contentNotVisible' : seasonList.length > 0 ? 'Synopsis__contentVisible' : 'Synopsis__contentLoading' }` }>
                                <div className='Synopsis__content'>
                                  <div className={ 'PlaybackInfo__Banner' }>
                                    { !bannerShow &&
                                    <FocusContext.Provider focusable={ false }
                                      value=''
                                    >
                                      <BannerComponent
                                        imageGradient
                                        alt='Background BannerComponent image'
                                        bgImg={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.TOP_LANDSCAPE, url ) }/${ imagePath }` }
                                        liveContent={ isLiveContentType( type ) }
                                        fromPiPage={ true }
                                      />
                                    </FocusContext.Provider>
                                    }
                                  </div>
                                  <div className='Synopsis__content--title'>
                                    <Icon
                                      name='ArrowUp'
                                    />
                                    <Text
                                      textStyle='header-5'
                                      color='white'
                                      textAlign='center'
                                    >
                                      { getContentDetails( metaData, config, channelMeta, url ).cardTitle }
                                    </Text>
                                  </div>
                                </div>
                                <FocusContext.Provider focusable={ false }
                                  value=''
                                >
                                  <div ref={ ref }>
                                    <Synopsis
                                      contractName={ contractName.contractName }
                                      metaData={ get( contentInfo, 'data', {} ) ? get( contentInfo, 'data', {} ) : donglePageData.current }
                                      config={ config }
                                    />
                                  </div>
                                </FocusContext.Provider>
                              </div>
                              <div className={ ` ${ !showSynopsis ? ( metaData?.contentType === CONTENT_TYPE.MOVIES ? 'PlaybackInfo__seasonsSynopsisAfter1' : 'PlaybackInfo__seasonsSynopsisBefore' ) : seasonList.length > 0 && 'PlaybackInfo__seasonsSynopsisAfter2' }` } >
                                {
                                  contentList?.length &&
                                  <>
                                    <div
                                      className={
                                        classNames(
                                          { 'PlaybackInfo__seasons--withSynopsis': showSynopsis } )
                                      }
                                    >
                                      <MediaCarousel
                                        railData={ { title: showTitle( metaData ), sectionSource: SECTION_SOURCE.RECOMMENDATION, id: relatedShowsResponse ? 3000 : 2000, layoutType: 'LANDSCAPE', contentList : filterRail( contentList ) } || {} }
                                        onFocus={ ( e ) => onRailFocus( e ) }
                                        openRelatedShowsInfo={ true }
                                        setShowSynopsis={ setShowSynopsis }
                                        setBannerShow={ setBannerShow }
                                        nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
                                        isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
                                        status={ myPlanProps && myPlanProps.subscriptionStatus }
                                        showTimeBlock
                                        contentRailType={ constants.RELATED_CONTENT }
                                        placeHolder={ placeHolderForMovies }
                                        liveFocusCard={ ( liveId, providerName )=> {
                                          contentInfoFetchData( { url: `${serviceConst.BOX_SET_LIVE}/${liveId}`, headers: {
                                            ...( isDistroContent( providerName ) && { appType: DISTRO_CHANNEL.appType } ),
                                            ...( providerName?.toLowerCase() === PROVIDER_LIST.TIMESPLAY && { appType:'TimesPlay' } )
                                          } } )
                                        } }
                                        railType={ recoResponse && recoResponse.code === 0 ? MIXPANEL_RAIL_TYPE.TA_RELATED_RAIL : MIXPANEL_RAIL_TYPE.SYSTEM_RELATED_RAIL }
                                        setIsFocusOnEpisode={ setIsFocusOnEpisode }
                                      />
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                          )
                        }

                      </div>
                    </>
                  ) }
                </InfiniteScroll>
              </div>
              {
                loaderOnLiveWhenContentChanges && (
                  <FocusContext.Provider focusable={ false }
                    value=''
                  >
                    <div className='PlaybackInfo__loader'>
                      <Image
                        src={ loaderPath }
                      />
                    </div>
                  </FocusContext.Provider>
                )
              }

            </FocusContext.Provider>
          ) }
      </div>
      <div className='PlaybackInfo__notifications'>
        {
          showNotification && (
            <Notifications
              iconName={ notificationIcon }
              message={ notificationMessage }
            />
          )
        }
      </div>

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
        info={ updateFibrePopUpMessage( myPlanProps?.ispHeaderVerbiage, provider ) || updateFibrePopUpMessage( FIBRE_PLAN.message, provider ) }
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
            setFocus( 'BUTTON_PRIMARY' )
            setQRCodeSuccess( false )
            zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.ZERO_APPS_NUDGE_CLOSE, myPlanProps )
          } }
          zeroAppsPlanCloseSuccessPopup={ ()=> {
            setFocus( 'BUTTON_PRIMARY' )
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
  )
}

export default PlaybackInfo;