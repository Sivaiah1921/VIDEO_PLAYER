/* eslint-disable no-console */

import { trackEvent } from './mixpanel'
import MIXPANELCONFIG from '../mixpanelConfig'
import { COMMON_HEADERS, CONTENT_TYPE, PROVIDER_LIST, SECTION_SOURCE, SECTION_TYPE, USERS, APPLETV, constants, SUBSCRIPTION_STATUS, PACKS, MEDIA_CARD_TYPE, PRIME, APPLE_PRIME_ACTIVATION_JOURNEY, PAGE_TYPE, CHANNEL_RAIL_TYPE, PAGE_NAME, MIXPANEL_CONTENT_TYPE, ABMainFeature } from '../constants'
import { getAuthToken, getBufferDifference, getContentRailPositionData, getDthStatus, getFirstLaunch, getProductName, getRmn, getSubscriberId, getDeviceManagementFromLoginJourney, getRemovedDeviceNames, getRegion, getIsLoginToggleState, getUserInfo, getTrailerFromApi, getTrailerContentCategory, getChipData, getABTestingData } from '../localStorageHelper'
import { getContentTitle } from '../slayer/PlaybackInfoService'
import { isLiveContentType } from '../slayer/PlayerService'
import { doNotShowScreenSaver, freeEpisodeTagForMixpanel, generateMPdate, getBingePrimeStatus, getBingePrimeStatusMixpanel, getExistingPrimeMixpanel, getListOfDevices, getMixpanelData, getPageNameForMixpanel, getSource, getSourceForMixPanel, getContentIdForLastWatch, setMixpanelData, getABTestingFeatureConfig } from '../util'
import { getAppleActivationFlagStatus } from '../appleHelper'
import { CleverTapPushService } from '../slayer/CleverTapPushService'
import throttle from 'lodash/throttle';
import { getStringToArray } from '../commonHelper'

export const initEvents = () => {
  let timeStamp = new Date().toLocaleDateString( 'en-US', { day:'numeric', weekday:'short', year:'numeric', month:'short', hour: 'numeric', minute:'numeric' } )
  timeStamp = timeStamp.replace( /,(?=[^,]*$)/, '' )
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.FTV_BOOTUP, {
    [MIXPANELCONFIG.PARAMETER.TIMESTAMP]: timeStamp
  } )
  trackEvent( MIXPANELCONFIG.EVENT.BINGE_APP_LAUNCH, {
    [MIXPANELCONFIG.PARAMETER.FIRST_TIME]: getFirstLaunch() === 'true' ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.TIMESTAMP]: timeStamp,
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )
  getAuthToken() && CleverTapPushService( MIXPANELCONFIG.EVENT.BINGE_APP_LAUNCH )
}

export const player_app_launch = ( provider ) => {
  trackEvent( MIXPANELCONFIG.EVENT.THIRD_PARTY_APPLICATION_LAUNCH, {
    [MIXPANELCONFIG.PARAMETER.PARTNER_NAME]: provider
  } )
}

export const player_app_click = () => {
  trackEvent( MIXPANELCONFIG.EVENT.THIRD_PARTY_PARTNER_APP_CLICK )
}

export const player_auto_play_trailor = ( autoPlayVal ) => {
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_AUTOPLAY_TRAILER, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.AUTOPLAY]: autoPlayVal
  } )
}

export const bingeList_view_faviourite = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.VIEW_FAVORITE )
}

export const bingeList_delete_faviourite = ( item ) => {
  item.map( ( content ) => {
    trackEvent( MIXPANELCONFIG.EVENT.REMOVE_WATCHLIST, {
      [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: content.title,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: content.contentType,
      [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: content.genre,
      [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: content.partnerName,
      [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: MEDIA_CARD_TYPE.WATCHLIST,
      [MIXPANELCONFIG.PARAMETER.SOURCE]: constants.BINGELIST_PAGE,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: constants.BINGE_LIST_RAIL_TYPE
    } )
  } )
}

const heroBannerMixPanel = ( episode, responseSubscription, pageType, autoplay ) => {
  if( !episode ){
    return
  }
  const contentAuth = freeEpisodeTagForMixpanel( episode )
  const contentType = getMixpanelData( 'contentType' );
  return {
    [MIXPANELCONFIG.PARAMETER.TIMESTAMP]:  new Date().getTime(),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSource( pageType ),
    [MIXPANELCONFIG.PARAMETER.HERO_BANNER_NUMBER]: episode.position,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE]: episode?.language?.join() || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE_PRIMARY]: episode.language?.[0] || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: episode.genre?.join() || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE_PRIMARY]: episode.genre?.[0] || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: episode.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_AUTH]: contentAuth ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: episode.contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_RATING]: episode.masterRating || episode.rating || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: episode.title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: episode.title,
    [MIXPANELCONFIG.PARAMETER.FREE_CONTENT]: contentAuth ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.RELEASE_YEAR]: episode.releaseYear,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.ACTORS]: episode.actor?.join() || '',
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: responseSubscription?.responseData?.currentPack?.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: responseSubscription?.responseData?.currentPack?.subscriptionPackType,
    [MIXPANELCONFIG.PARAMETER.LIVE_CONTENT]: episode.liveContent ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getSource( pageType ),
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: !getAuthToken() ? MIXPANELCONFIG.VALUE.NO : autoplay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO

  }
}


export const home_hero_banner_click = ( data, responseSubscription, pageType, autoplay ) => {

  trackEvent( MIXPANELCONFIG.EVENT.HERO_BANNER_CLICKS, heroBannerMixPanel( data, responseSubscription, pageType, autoplay ) )
}

export const home_hero_banner_view = ( data, responseSubscription, pageType, autoplay ) => {
  trackEvent( MIXPANELCONFIG.EVENT.VIEW_HERO_BANNER, heroBannerMixPanel( data, responseSubscription, pageType, autoplay ) )
}


const horizontalSwipe = ( title, activeIndex ) => {
  return {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: 'HOME',
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: activeIndex + 1,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: SECTION_SOURCE.EDITORIAL,
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: SECTION_TYPE.HERO_BANNER
  }
}

export const home_hero_banner_horizontalSwipe = ( title, activeIndex ) => {
  trackEvent( MIXPANELCONFIG.EVENT.HORIZONTAL_SWIPE, horizontalSwipe( title, activeIndex ) )
}

export const app_rail_click = ( railTitle, railPosition, configType, title, responseSubscription, contentPosition, bbaOpen, sectionSource ) => {
  trackEvent( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ? MIXPANELCONFIG.EVENT.APPS_RAIL_CLICK : MIXPANELCONFIG.EVENT.REGULAR_APPS_RAIL_CLICK, {
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: railPosition,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: MIXPANELCONFIG.VALUE.HOME,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: configType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: title,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: responseSubscription?.responseData?.currentPack?.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType,
    ...( sectionSource === SECTION_SOURCE.PROVIDER && { [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER_POSITION]: contentPosition } ),
    ...( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS && { [MIXPANELCONFIG.PARAMETER.CLICK_TYPE]: bbaOpen } )
  } )
}

export const viewAppContent = ( provider ) => {
  trackEvent( MIXPANELCONFIG.EVENT.VIEW_APP_CONTENT, {
    [MIXPANELCONFIG.PARAMETER.APP_NAME]: provider
  } )
}

export const my_plan_view = ( myPlanProps ) => {
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_VIEW, {
    [MIXPANELCONFIG.PARAMETER.PRIME_PACK_ACTIVE]: MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_ACTIVE]: myPlanProps?.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.TENURE]: myPlanProps?.currentTenure || myPlanProps?.currentTenureOpen
  } )
}

export const pack_selected = ( title, type, amount, tenure, isChangeTenure, response ) => {
  const myPlanProps =  response && response.currentPack || null;
  trackEvent( MIXPANELCONFIG.EVENT.PACK_SELECTED, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: title,
    [MIXPANELCONFIG.PARAMETER.TYPE]: type,
    [MIXPANELCONFIG.PARAMETER.CHANGE_PLAN]:  MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.CHANGE_TENURE]:isChangeTenure ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.PAYABLE_AMOUNT]: parseFloat( amount ).toFixed( 2 ),
    [MIXPANELCONFIG.PARAMETER.DURATION]: tenure,
    [MIXPANELCONFIG.PARAMETER.PAYMENT_METHOD]: myPlanProps ? myPlanProps.paymentMethod : ''
  } )
}

export const pack_QR_code = ( myPlanProps ) => {
  const data =  myPlanProps && myPlanProps.paymentMethod || null;
  trackEvent( MIXPANELCONFIG.EVENT.PACK_QR_CODE, {
    [MIXPANELCONFIG.PARAMETER.PAYMENT_METHOD]: data ? data : ''
  } )
}

export const pack_QR_code_proceed = () => {
  trackEvent( MIXPANELCONFIG.EVENT.QR_CODE_PROCEED )
}

export const payment_initiate = ( planDetail ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PAYMENT_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: planDetail.planDetail.upgradeMyPlan,
    [MIXPANELCONFIG.PARAMETER.TENURE]: planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.AMOUNT]: planDetail.currentTenure?.offeredPriceValue
  } )
}

export const subscription_initiate = ( planDetail, response, previousPathName, productId, tenureId ) => {
  const change_tenure = productId !== tenureId ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
  const change_plan = response && response.currentPack?.productId === productId ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES

  trackEvent( MIXPANELCONFIG.EVENT.SUBSCRIPTION_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: planDetail.planDetail.upgradeMyPlan,
    [MIXPANELCONFIG.PARAMETER.TENURE]: planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getSourceForMixPanel( previousPathName ),
    [MIXPANELCONFIG.PARAMETER.CHANGE_TENURE]: change_tenure,
    [MIXPANELCONFIG.PARAMETER.CHANGE_PLAN]: change_plan
  } )
}


export const subscription_success = ( planDetail, previousPathName, paymentStatusResponse, response, packResponse ) => {
  const myPlanProps =  response && response.currentPack || {};
  trackEvent( MIXPANELCONFIG.EVENT.SUBSCRIBE_SUCCESS, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: planDetail.planDetail.upgradeMyPlan,
    [MIXPANELCONFIG.PARAMETER.TENURE]:  planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.PACK_TENURE]: planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: planDetail.currentTenure?.offeredPriceValue,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: myPlanProps?.subscriptionPackType,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName.current ),
    [MIXPANELCONFIG.PARAMETER.PAYMENT_TYPE]: myPlanProps.paymentMode,
    [MIXPANELCONFIG.PARAMETER.PAYMENT_METHOD]: paymentStatusResponse.paymentMethod,
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_NAME]: myPlanProps.upgradeMyPlanType || '',
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_TYPE]: myPlanProps.subscriptionPackType || '',
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_PRICE]: myPlanProps.amountValue ? parseInt( myPlanProps.amountValue, 10 ).toFixed( 2 ) : '',
    [MIXPANELCONFIG.PARAMETER.FIRST_SUBSCRIPTION]: myPlanProps.upgradeMyPlanType ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_TENURE]: myPlanProps?.currentTenure || '',
    [MIXPANELCONFIG.PARAMETER.MOD_TYPE]: packResponse?.modificationType || MIXPANELCONFIG.VALUE.ADD
  } )
}

export const subscription_fail = ( planDetail, response, paymentStatusResponse, previousPathName, packResponse ) => {
  const myPlanProps =  response && response.currentPack || {};
  trackEvent( MIXPANELCONFIG.EVENT.SUBSCRIBE_FAILED, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: planDetail.planDetail.upgradeMyPlan,
    [MIXPANELCONFIG.PARAMETER.TENURE]:  planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.PACK_TENURE]: planDetail.currentTenure?.tenureType,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: planDetail.currentTenure?.offeredPriceValue,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName.current ),
    [MIXPANELCONFIG.PARAMETER.PAYMENT_TYPE]: myPlanProps.paymentMode,
    [MIXPANELCONFIG.PARAMETER.PAYMENT_METHOD]: paymentStatusResponse.paymentMethod,
    [MIXPANELCONFIG.PARAMETER.REASON]: paymentStatusResponse?.errorResponse || 'Timeout Error',
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_NAME]: myPlanProps.upgradeMyPlanType || '',
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_TYPE]: myPlanProps.subscriptionPackType || '',
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_PRICE]: myPlanProps.amountValue ? parseInt( myPlanProps.amountValue, 10 ).toFixed( 2 ) : '',
    [MIXPANELCONFIG.PARAMETER.FIRST_SUBSCRIPTION]: myPlanProps.upgradeMyPlanType ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.EXISTING_PACK_TENURE]: myPlanProps?.currentTenure || '',
    [MIXPANELCONFIG.PARAMETER.MOD_TYPE]: packResponse?.modificationType || MIXPANELCONFIG.VALUE.ADD
  } )
}

export const low_balance = ( previousPathName ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_LOW_BALANCE, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: previousPathName,
    [MIXPANELCONFIG.PARAMETER.DEVICE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DEFICIT]: ''

  } )
}

export const add_pack_continue = ( ) => {
  trackEvent( MIXPANELCONFIG.EVENT.ADD_PACK_CONTINUE, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID, // as per comments from TTN dsn = device id
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: getSubscriberId()
  } )
}

export const contact_us = () => {
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_CONTACTUS, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID
  } )
}

export const device_management = () => {
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_DEVICE_MANAGEMENT )
}

export const device_remove = ( deviceName ) => {
  const removeDeviceList = getListOfDevices( getRemovedDeviceNames() )

  trackEvent( MIXPANELCONFIG.EVENT.DEVICE_REMOVE_CONFIRM, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getAuthToken() ? MIXPANELCONFIG.VALUE.DEVICE_MANAGEMENT : MIXPANELCONFIG.VALUE.LOGIN,
    [MIXPANELCONFIG.PARAMETER.DEVICE]: deviceName,
    ...( !getAuthToken() && {
      ...( Array.isArray( removeDeviceList ) && Object.assign( {}, ...removeDeviceList ) ),
      [MIXPANELCONFIG.PARAMETER.DEVICE_ADDED]: COMMON_HEADERS.DEVICE_NAME
    } )
  } )
}

export const device_rename = ( ) => {
  trackEvent( MIXPANELCONFIG.EVENT.DEVICE_RENAME_CLICK )
};

export const edit_profile = ()=>{
  trackEvent( MIXPANELCONFIG.EVENT.EDIT_PROFILE, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.TYPE]: getDthStatus()
  } )
}

export const add_profile = ()=>{
  trackEvent( MIXPANELCONFIG.EVENT.ADD_PROFILE, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.TYPE]: getDthStatus()
  } )
}

export const edit_email = ( change ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_EMAIL, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.EMAIL_CHANGE]: change
  } )
}

export const faq_init = () => {
  trackEvent( MIXPANELCONFIG.EVENT.FAQ )
}

export const faq_view = ( id, question ) => {
  trackEvent( MIXPANELCONFIG.EVENT.FAQ_VIEW, {
    [MIXPANELCONFIG.PARAMETER.SECTION_POSITION]: id,
    [MIXPANELCONFIG.PARAMETER.FAQ_QUESTION]: question
  } )
}

export const home_clicks = ( source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_HOME_CLICKS, {
    [MIXPANELCONFIG.PARAMETER.SECTION]: source
  } )

}

export const browse_by_genre = ( pageType, props, responseSubscription ) => {
  trackEvent( MIXPANELCONFIG.EVENT.BROWSE_BY_GENRE_RAIL_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]:  MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE,
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: props.railPosition ? props.railPosition : 1,
    [MIXPANELCONFIG.PARAMETER.GENRE_SELECTED]: props.title,
    [MIXPANELCONFIG.PARAMETER.RAIL_GENRE_POSITION]: props.contentPosition ? props.contentPosition : 1,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: responseSubscription?.responseData?.currentPack?.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: responseSubscription?.responseData?.currentPack?.subscriptionPackType,
    [MIXPANELCONFIG.PARAMETER.FILTER_SELECTED]: props.title,
    [MIXPANELCONFIG.PARAMETER.PAGE_RESULT_SWIPE]:  MIXPANELCONFIG.VALUE.BROWSE_BY_GENRE
  } )
}

export const browse_by_language = ( pageType, props, responseSubscription ) => {
  trackEvent( MIXPANELCONFIG.EVENT.BROWSE_BY_LANGUAGE_RAIL_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]:  MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE,
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: props.railPosition ? props.railPosition : 1,
    [MIXPANELCONFIG.PARAMETER.LANGUAGE_SELECTED]: props.title,
    [MIXPANELCONFIG.PARAMETER.RAIL_LANGUAGE_POSITION]: props.contentPosition ? props.contentPosition : 1,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: responseSubscription?.responseData?.currentPack?.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: responseSubscription?.responseData?.currentPack?.subscriptionPackType,
    [MIXPANELCONFIG.PARAMETER.FILTER_SELECTED]: props.title,
    [MIXPANELCONFIG.PARAMETER.PAGE_RESULT_SWIPE]: MIXPANELCONFIG.VALUE.BROWSE_BY_LANGUAGE
  } )
}

export const page_click = ( pageType, pageContentInfo, source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PAGE_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: pageType,
    ...( pageContentInfo?.sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && {
      [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: pageContentInfo?.railPosition,
      [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: pageContentInfo?.railTitle,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: pageContentInfo?.configType,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE_2]: pageContentInfo?.railType,
      [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: pageContentInfo?.deviceType,
      [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: pageContentInfo?.contentPosition,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: pageContentInfo?.conetentTitle,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: CONTENT_TYPE.SUB_PAGE,
      [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
      [MIXPANELCONFIG.PARAMETER.SUB_SECTION]: pageContentInfo?.sectionSource
    } )
  } )
}

export const browse_page_click = ( pageType, pageContentInfo, source, optionPage ) => {
  trackEvent( MIXPANELCONFIG.EVENT.BROWSE_PAGE_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source,
    ...( pageContentInfo?.sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && {
      [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: pageContentInfo?.railPosition,
      [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: pageContentInfo?.railTitle,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: pageContentInfo?.configType,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE_2]: pageContentInfo?.railType,
      [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: pageContentInfo?.deviceType,
      [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: pageContentInfo?.contentPosition,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: pageContentInfo?.conetentTitle,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: CONTENT_TYPE.SUB_PAGE,
      [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
      [MIXPANELCONFIG.PARAMETER.SUB_SECTION]: pageContentInfo?.sectionSource,
      [MIXPANELCONFIG.PARAMETER.BROWSE_PAGE_NAME]: pageType,
      [MIXPANELCONFIG.PARAMETER.OPTION]: optionPage
    } )
  } )
}

export const login_failure = ( error, code ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_FAILURE, {
    [MIXPANELCONFIG.PARAMETER.ERROR]: error,
    [MIXPANELCONFIG.PARAMETER.ERROR_CODE]: code,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN,
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn()
  } );
}

export const log_out = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGOUT, {
    [MIXPANELCONFIG.PARAMETER.NEWSUB]: '',
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } );
}

export const login_invalid_RMN = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_RMN_ENTER_INVALID, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } );
}

export const login_rmn_enter  = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_RMN_ENTER, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } );
}

export const login_license_agreement  = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_LIC_AGREEMENT )
}

export const login_license_agreement_back  = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_LIC_AGREEMENT_BACK )
}

export const login_otp_resend = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_OTP_RESEND, {
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_get_otp = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_GET_OTP, {
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_new_login = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_PAGE_NEWLOGIN )
}

export const login_otp_enter = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_OTP_ENTER, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.METHOD]: MIXPANELCONFIG.VALUE.RMN,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const logout_failure = ( error, code ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGOUT_FAILED, {
    [MIXPANELCONFIG.PARAMETER.ERROR_MESSAGE]: error,
    [MIXPANELCONFIG.PARAMETER.ERROR_CODE]: code,
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_licence_checkbox = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_LIC_CHECKBOX )
}

export const results_click = ( props ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_RESULT_CLICKS, {
    [MIXPANELCONFIG.PARAMETER.POSITION]: props.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: props.contentTitle ? props.contentTitle : props.title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: props.contentType,
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: props.inputValue
  // [MIXPANELCONFIG.PARAMETER.APP_NAME]:props.providerName,
  } )
}

export const mixPanelAppleTvPlayerData = ( ) => {
  return {
    [MIXPANELCONFIG.PARAMETER.BUFFER_DURATION_SECONDS] : 0,
    [MIXPANELCONFIG.PARAMETER.BUFFER_DURATION_MINUTES] : 0,
    [MIXPANELCONFIG.PARAMETER.START_TIME] : 0,
    [MIXPANELCONFIG.PARAMETER.STOP_TIME] : 0,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_PAUSE] : 0,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_RESUME] : 0,
    [MIXPANELCONFIG.PARAMETER.SEEK_BAR_PROGRESS] : '',
    [MIXPANELCONFIG.PARAMETER.VIDEO_QUALITY] : 0,
    [MIXPANELCONFIG.PARAMETER.WATCH_DURATION_SECONDS] : 0,
    [MIXPANELCONFIG.PARAMETER.WATCH_DURATION_MINUTES] : 0
  }
}

export const content_click = ( MPItems, source, taUseCaseObject, sectionSource = null, chipName = null, chipPosition = null ) => {
  const data = getContentRailPositionData()
  const contentType = getMixpanelData( 'contentType' );
  const railType = getMixpanelData( 'railType' );
  const title =  MPItems.contentTitle ? MPItems.contentTitle : MPItems.title ;
  const userInfo = JSON.parse( getUserInfo() ) || {};
  const chipData = getChipData( 'chipData' ) || {}
  const isReccoLiveRail = contentType === MIXPANEL_CONTENT_TYPE.RECOMMENDED && MPItems.contentType.toLowerCase() === constants.LIVE.toLowerCase()
  const railExperimentConfig = isReccoLiveRail ? ( getAuthToken() ? getABTestingFeatureConfig( ABMainFeature.railRecommendation ) : getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation ) ) : getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  railExperimentConfig?.experimentKey
  const segment = railExperimentConfig?.segment
  const variant =  railExperimentConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.CONTENT_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source === MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL ? getMixpanelData( 'channelName' ) : getPageNameForMixpanel( source ),
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: MPItems.railTitle || data.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: MPItems.railPosition || data.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]:  isReccoLiveRail ? SECTION_SOURCE.RECOMMENDATION : contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_ID]: MPItems.id,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: isReccoLiveRail ? railType?.replace( MIXPANEL_CONTENT_TYPE.RECOMMENDED, SECTION_SOURCE.RECOMMENDATION ) : railType,
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: MPItems.sectionType || MIXPANELCONFIG.VALUE.RAIL.toUpperCase(),
    ...( MPItems.language && { [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE] : MPItems.language } ),
    ...( MPItems.primaryLanguage && { [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE_PRIMARY] : MPItems.primaryLanguage } ),
    ...( MPItems.genre && { [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE] : MPItems.genre } ),
    ...( MPItems.primaryGenre && { [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE_PRIMARY] : MPItems.primaryGenre } ),
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE_PRIMARY]: MPItems.primaryGenre,
    [MIXPANELCONFIG.PARAMETER.APP_NAME]: MPItems.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: MPItems.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_AUTH]: MPItems.contentAuth ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: MPItems.contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: MPItems.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_RATING]: MPItems.contentRating,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.FREE_CONTENT]: MPItems.contentAuth ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.RELEASE_YEAR]: MPItems.releaseYear,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: MPItems.deviceType,
    [MIXPANELCONFIG.PARAMETER.ACTORS]: MPItems.actors,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: userInfo && Object.keys( userInfo ).length > 0 ? userInfo.packPrice : '',
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]:  userInfo && Object.keys( userInfo ).length > 0 ? userInfo.packName : '',
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: MPItems.autoPlayed,
    [MIXPANELCONFIG.PARAMETER.LIVE_CONTENT]: isLiveContentType( MPItems.contentType ) ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.LIVE_CHANNEL_ASSET]: MPItems.channelName,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NUMBER]: MPItems.channelNumber,
    [MIXPANELCONFIG.PARAMETER.TA_USECASE_ID]: taUseCaseObject,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: getMixpanelData( 'channelName' ),
    ...( MPItems.provider?.toLowerCase() === PROVIDER_LIST.APPLETV && mixPanelAppleTvPlayerData( ) ),
    ...( getMixpanelData( 'bingeListSource' ) && bingeListMixpanel() ),
    ...( MPItems.provider?.toLowerCase() === PROVIDER_LIST.PRIME && ( MPItems.bingePrimePackStatus !== PRIME.PACK_STATUS.SUSPEND && MPItems.bingePrimePackStatus !== PRIME.PACK_STATUS.CANCELLED ) && { [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: MPItems.bingePrimeStatus } ),
    ...( MPItems.searchInputValue && { [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: MPItems.searchInputValue } ),
    [MIXPANELCONFIG.PARAMETER.BROWSE_PAGE_NAME]: getMixpanelData( 'browsepagename' ),
    [MIXPANELCONFIG.PARAMETER.OPTION]: getMixpanelData( 'optionValue' ),
    ...( ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && {
      [MIXPANELCONFIG.PARAMETER.CHIP_NAME]: chipName || chipData.chipName,
      [MIXPANELCONFIG.PARAMETER.CHIP_POSITION]: chipPosition,
      [MIXPANELCONFIG.PARAMETER.RAIL_NAME]:  MPItems.railTitle || data.railTitle,
      [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
      [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
      [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
    } )

  } )

  if( getAuthToken() ){
    const cleverTapData = {
      contentGenrePrimary: ( Array.isArray( MPItems.primaryGenre ) && MPItems.primaryGenre.length > 0 ) ? MPItems.primaryGenre[0] : MPItems.primaryGenre,
      contentLanguagePrimary: MPItems.primaryLanguage,
      contentParentTitle: title,
      contentTitle: title,
      contentPartner: MPItems.provider,
      contentPosition: MPItems.contentPosition,
      contentRating: MPItems.contentRating,
      contentType: contentType,
      railCategory: MPItems.sectionType || MIXPANELCONFIG.VALUE.RAIL.toUpperCase(),
      railPosition: MPItems.railPosition || data.contentPosition,
      railTitle: MPItems.railTitle || data.railTitle,
      railType: railType,
      region: constants.INDIA,
      releaseYear: MPItems.releaseYear || ''
      // clevertapUserID: ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? getSubscriberId() : getDthStatus() === USERS.NON_DTH_USER ? getRmn() : getRmn()
    }

    CleverTapPushService( MIXPANELCONFIG.EVENT.CONTENT_CLICK, cleverTapData );
  }
}

export const experiment_started = () => {
  const railConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const experimentKey =  railConfig?.experimentKey
  const segment = railConfig?.segment
  const variant =  railConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.EXPERIMENT_STARTED, {
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )

}

export const recco_initiated = () => {
  const railConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const railGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )

  const reccoConfig  = getAuthToken() ? railConfig : railGuestConfig
  const experimentKey =  reccoConfig?.experimentKey
  const segment = reccoConfig?.segment
  const variant =  reccoConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.RECCO_INITIATED, {
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )

}

const debouncedTrackSwipe = throttle( ( eventData ) => {
  trackEvent( MIXPANELCONFIG.EVENT.HORIZONTAL_SWIPE, eventData );
}, 300 ); // Adjust delay as needed

export const card_horizontal_swipe = ( title, position, previousPathName, sectionSource ) => {
  debouncedTrackSwipe( {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getSourceForMixPanel( previousPathName ),
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: position,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: getRailType( sectionSource ),
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: sectionSource
  } );
};

export const shuffle_click = ( title, position ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SHUFFLE_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: 'Home',
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: position,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: 'SHUFFLE'
  } )
}

export const my_account = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_ACCOUNT, {
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.USER_TYPE]: ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? MIXPANELCONFIG.VALUE.TP : MIXPANELCONFIG.VALUE.NON_TP
  } )
}

export const my_account_email = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_EMAIL, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.EMAIL_CHANGE]: 'N'
  } )
}

export const my_account_current_subscription = ()=>{
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_CURRENT_SUB, {
    [MIXPANELCONFIG.PARAMETER.SID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID
  } )
}

export const my_account_recharge_initiate = ( amount ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.TP_RECHARGE_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: MIXPANELCONFIG.VALUE.MY_ACCOUNT,
    [MIXPANELCONFIG.PARAMETER.AMOUNT]: amount
  } )
}

export const login_page_visit = ( isLoginToggle ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_PAGE_VISIT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: isLoginToggle ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}


export const my_account_refresh = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.ACCOUNT_REFRESH )
}

export const renew_plan = ( responseData ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_RENEW_PLAN, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseData?.currentPack?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_ACTIVE]: responseData?.currentPack?.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]: responseData?.currentPack?.daysRemaining
  } )
}

export const renew_change_plan = ( responseData ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_RENEW_CHANGE_PLAN, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: responseData.currentPack?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]: responseData?.currentPack?.daysRemaining
  } )
}

export const add_pack = ( )=>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_ADD_PACK, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: getSubscriberId()
  } )
}

export const parental_pin_init = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.PARENTAL_CONTROL_CLICK )
}

export const parental_pin_initiate = ( previousPathName ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.PIN_ENTRY_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName ),
    [MIXPANELCONFIG.PARAMETER.DEVICE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL
  } )
}

export const parental_pin_incorrect = ( previousPathName ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.PIN_ENTRY_INCORRECT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName ),
    [MIXPANELCONFIG.PARAMETER.DEVICE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL
  } )

}

export const parental_pin_procced = ( previousPathName ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.PIN_ENTRY_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName )
  } )
}

export const mixPanelData = ( location, metaData, responseSubscription, source ) => {
  const contentAuth = freeEpisodeTagForMixpanel( metaData )
  const userInfo = JSON.parse( getUserInfo() ) || {};

  return {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getPageNameForMixpanel( source ),
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: location?.args?.railTitle || location?.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: location?.args?.railPosition || location?.railPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: metaData.contentType,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: getRailType( location?.args?.sectionSource || location?.sectionSource ),
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: location?.sectionSource === SECTION_SOURCE.EDITORIAL || location?.sectionSource === SECTION_SOURCE.RECOMMENDATION ? location.sectionType : location.sectionSource ? location.sectionSource : MIXPANELCONFIG.VALUE.RAIL,
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE]: metaData.audio?.join() || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE_PRIMARY]: metaData.audio?.[0] || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: metaData.genre?.join() || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE_PRIMARY]: metaData.genre?.[0] || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: metaData.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_AUTH]: contentAuth ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: metaData.contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: location?.args?.contentPosition || location?.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_RATING]: metaData.masterRating,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: isLiveContentType( metaData.contentType ) ? metaData.title : metaData.vodTitle,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: isLiveContentType( metaData.contentType ) ? metaData.title : metaData.vodTitle,
    [MIXPANELCONFIG.PARAMETER.FREE_CONTENT]: contentAuth ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.RELEASE_YEAR]: metaData.releaseYear,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.ACTORS]: metaData.actor?.join() || '',
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: userInfo && Object.keys( userInfo ).length > 0 ? userInfo.packPrice : '',
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: userInfo && Object.keys( userInfo ).length > 0 ? userInfo.subscriptionPlanType : '',
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]:  userInfo && Object.keys( userInfo ).length > 0 ? userInfo.packName : '',
    [MIXPANELCONFIG.PARAMETER.LIVE_CONTENT]: isLiveContentType( metaData.contentType ) ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
    // [MIXPANELCONFIG.PARAMETER.APP_NAME]:metaData.provider
  }
}

export const bingelist_add = ( metaData, responseSubscription, source ) =>{
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.ADD_WATCHLIST, mixPanelData( data, metaData, responseSubscription, source ) )
}

export const bingelist_remove_item = ( metaData, responseSubscription, pageName, source )=>{
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.REMOVE_WATCHLIST, { ...mixPanelData( data, metaData, responseSubscription, source ),
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: pageName,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: constants.BINGE_LIST_RAIL_TYPE
  } )
}

export const getAppleStatus = ( statusinfo ) =>{
  if( statusinfo === APPLETV.CLAIM_STATUS.NOTINITIATED ){
    return APPLETV.CLAIM_STATUS.APPLE_NOT_CLAIMED
  }
  else if( statusinfo === APPLETV.CLAIM_STATUS.PENDING ){
    return APPLETV.CLAIM_STATUS.APPLE_PENDING
  }
  else {
    return constants.DEFAULT
  }
}

export const view_content = ( metaData, responseSubscription, source, taUseCaseObject, autoPlay, inputValue ) =>{
  const data = getContentRailPositionData();
  const contentType = getMixpanelData( 'contentType' );
  const railType = getMixpanelData( 'railType' );
  const isReccoLiveRail = contentType === MIXPANEL_CONTENT_TYPE.RECOMMENDED && metaData.contentType.toLowerCase() === constants.LIVE.toLowerCase()
  trackEvent( MIXPANELCONFIG.EVENT.VIEW_CONTENT_DETAIL, { ...mixPanelData( data, metaData, responseSubscription, source ),
    [MIXPANELCONFIG.PARAMETER.TITLE]: isLiveContentType( metaData.contentType ) ? metaData.title : getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.TA_USECASE_ID]: taUseCaseObject,
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: autoPlay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: getMixpanelData( 'contentType' ),
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: getMixpanelData( 'railType' ),
    [MIXPANELCONFIG.PARAMETER.CONTENT_ID]: getContentIdForLastWatch( metaData ),
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source === MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL ? getMixpanelData( 'channelName' ) : getPageNameForMixpanel( source ),
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: getMixpanelData( 'channelName' ),
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue,
    [MIXPANELCONFIG.PARAMETER.APP_NAME]:metaData.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]:  isReccoLiveRail ? SECTION_SOURCE.RECOMMENDATION : contentType,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: isReccoLiveRail ? railType?.replace( MIXPANEL_CONTENT_TYPE.RECOMMENDED, SECTION_SOURCE.RECOMMENDATION ) : railType,
    ...( metaData.provider?.toLowerCase() === PROVIDER_LIST.APPLETV && { [MIXPANELCONFIG.PARAMETER.PI_PAGENAME] : getAppleStatus( responseSubscription?.responseData?.currentPack?.bingeAppleState ) } ),
    ...( getMixpanelData( 'bingeListSource' ) && bingeListMixpanel() ),
    ...( ( metaData?.trailerFromPartner ) && { [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY] : constants.TRAILER } )
  } )
}

export const mixPanelDataViewContent = ( metaData ) => {
  return {
    [MIXPANELCONFIG.PARAMETER.PRIMARY]: metaData.audio?.[0] || '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.TITLE]: getContentTitle( metaData ).title
  }
}

export const synopsis_more_click = ( metaData, responseSubscription, source ) =>{
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.SYNOPSIS_MORE_CLICK, { ...mixPanelData( data, metaData, responseSubscription, source ), ...mixPanelDataViewContent( metaData ),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: MIXPANELCONFIG.VALUE.CONTENT_DETAIL_UPPERCASE
  } )
}

export const play_trailor = ( metaData, responseSubscription, source, autoPlay ) =>{
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.PLAY_TRAILER, { ...mixPanelData( data, metaData, responseSubscription, source ),
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: autoPlay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: MIXPANELCONFIG.VALUE.REGULAR
  } )
}

export const trailer_started = ( metaData, responseSubscription, source, autoPlay ) =>{
  const data = getContentRailPositionData();
  const railType = getMixpanelData( 'railType' );
  const contentType = getMixpanelData( 'contentType' );
  setMixpanelData( 'isTrailerFromAPI', getTrailerFromApi() ? constants.API : constants.OTHERS )
  setMixpanelData( 'autoPlayPage', getSource( window.location.pathname )?.toUpperCase() )
  if( metaData ){
    trackEvent( MIXPANELCONFIG.EVENT.TRAILER_STARTED, { ...mixPanelData( data, metaData, responseSubscription, source ),
      [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: autoPlay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
      [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: MIXPANELCONFIG.VALUE.REGULAR,
      [MIXPANELCONFIG.PARAMETER.AUTO_PLAY_PAGE]:getMixpanelData( 'autoPlayPage' ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: contentType,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: railType,
      [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getMixpanelData( 'playerSource' ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: constants.TRAILER,
      [MIXPANELCONFIG.PARAMETER.SOURCE]:getMixpanelData( 'playerSource' ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: metaData?.brandTitle || metaData?.vodTitle,
      [MIXPANELCONFIG.PARAMETER.TRAILER_SOURCE]: getMixpanelData( 'isTrailerFromAPI' )
    } )
  }
}

export const trailer_viewed = ( metaData, responseSubscription, source, autoPlay, totalWatchedTime, trailerContentCategory ) =>{
  const data = getContentRailPositionData();
  const railType = getMixpanelData( 'railType' );
  const contentType = getMixpanelData( 'contentType' );
  if( trailerContentCategory === constants.TRAILER && metaData ){
    trackEvent( MIXPANELCONFIG.EVENT.TRAILER_VIEWED, { ...mixPanelData( data, metaData, responseSubscription, source ),
      [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: autoPlay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
      [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: MIXPANELCONFIG.VALUE.REGULAR,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: contentType,
      [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: railType,
      [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: getMixpanelData( 'playerSource' ),
      [MIXPANELCONFIG.PARAMETER.AUTO_PLAY_PAGE]: getMixpanelData( 'autoPlayPage' ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: constants.TRAILER,
      [MIXPANELCONFIG.PARAMETER.SOURCE]:getMixpanelData( 'playerSource' ),
      [MIXPANELCONFIG.PARAMETER.TRAILER_SOURCE]: getMixpanelData( 'isTrailerFromAPI' ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: metaData?.brandTitle || metaData?.vodTitle,
      [MIXPANELCONFIG.PARAMETER.WATCH_DURATION]:   totalWatchedTime ? Number( totalWatchedTime.toFixed( 2 ) ) : 0
    } )
  }

}

export const see_all_episode = ( metaData, responseSubscription, source ) =>{
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.SEE_ALL_EPISODES, { ...mixPanelData( data, metaData, responseSubscription, source ), ...mixPanelDataViewContent( metaData ) } )
}

export const player_pause = ( player, props, metaData, played, paused ) =>{
  const diff = ( Math.abs( played - paused ) );
  trackEvent( MIXPANELCONFIG.EVENT.DEBUG_PAUSE_CONTENT, {
    [MIXPANELCONFIG.PARAMETER.PAUSE_START_TIME]: generateMPdate( played ),
    [MIXPANELCONFIG.PARAMETER.PAUSE_STOP_TIME]: generateMPdate( paused ),
    [MIXPANELCONFIG.PARAMETER.PAUSE_DURATION]: Math.round( diff ),
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: SECTION_SOURCE.EDITORIAL,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]:  props?.railFocusedCardInfo ? getContentTitle( props?.railFocusedCardInfo ).title : metaData ? getContentTitle( metaData ).title : getContentTitle( props ).title

  } )
}

export const player_resume = ( videoElement, props, metaData, played, paused ) =>{
  if( videoElement?.currentTime ){
    trackEvent( MIXPANELCONFIG.EVENT.DEBUG_RESUME_CONTENT, {
      [MIXPANELCONFIG.PARAMETER.PAUSE_START_TIME]: generateMPdate( played ),
      [MIXPANELCONFIG.PARAMETER.PAUSE_STOP_TIME]: generateMPdate( paused ),
      [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: SECTION_SOURCE.EDITORIAL,
      [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: props?.railFocusedCardInfo ? getContentTitle( props?.railFocusedCardInfo ).title : metaData ? getContentTitle( metaData ).title : getContentTitle( props ).title
    } )
  }
}

export const player_buffer_start = ( props, bufferStart ) => {
  trackEvent( MIXPANELCONFIG.EVENT.DEBUG_BUFFER_START, {
    [MIXPANELCONFIG.PARAMETER.BUFFER_START_TIME]: bufferStart, // Surabhi
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: SECTION_SOURCE.EDITORIAL,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: props?.railFocusedCardInfo ? getContentTitle( props?.railFocusedCardInfo ).title : getContentTitle( props ).title
  } )
}

export const player_buffer_stop = ( props, bufferStart, bufferStop ) => {
  trackEvent( MIXPANELCONFIG.EVENT.DEBUG_BUFFER_STOP, {
    [MIXPANELCONFIG.PARAMETER.BUFFER_START_TIME]: bufferStart, // Surabhi
    [MIXPANELCONFIG.PARAMETER.BUFFER_STOP_TIME]: bufferStop, // Surabhi
    [MIXPANELCONFIG.PARAMETER.BUFFER_DURATION]: bufferStop - bufferStart, // Surabhi
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: SECTION_SOURCE.EDITORIAL,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: props?.railFocusedCardInfo ? getContentTitle( props?.railFocusedCardInfo ).title : getContentTitle( props ).title
  } )
}

export const playerDCEvent = ( event, videoElement, metaData, props, source, myPlanProps, error, playCount, pauseCount, played, paused, taUseCaseObject, liveContent, responseSubscription, watchNowCTA, totalWatchedTime, autoPlayTrailor, inputValue ) => {
  let videoQuality = '1080*1920'
  const contentAuth = freeEpisodeTagForMixpanel( metaData )
  const currentTime = videoElement?.currentTime;
  const railInfoProp = props.railFocusedCardInfo || metaData;
  const location = getContentRailPositionData();
  const title = getContentTitle( railInfoProp )?.title;
  const contentType = getMixpanelData( 'contentType' );
  const railType = getMixpanelData( 'railType' );
  const primaryGenre = getStringToArray( railInfoProp?.genre )
  const primaryLanguage = getStringToArray( railInfoProp?.audio || railInfoProp?.language )
  const playerSource =   getMixpanelData( 'playerSource' )
  const railExperimentConfig = playerSource?.toLowerCase() === 'search' ? getABTestingFeatureConfig( ABMainFeature.searchFeature ) : ( getAuthToken() ? getABTestingFeatureConfig( ABMainFeature.railRecommendation ) : getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation ) )
  const experimentKey =  railExperimentConfig?.experimentKey
  const segment = railExperimentConfig?.segment
  const variant =  railExperimentConfig?.variant
  trackEvent( event, {
    [MIXPANELCONFIG.PARAMETER.APP_NAME]:railInfoProp?.provider || metaData?.provider,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source === MIXPANELCONFIG.VALUE.BROWSE_BY_CHANNEL ? getMixpanelData( 'channelName' ) : source,
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: location.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_NAME]:  location.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: location?.railPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: contentType,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: railType,
    [MIXPANELCONFIG.PARAMETER.RAIL_CATEGORY]: location?.sectionType ? location.sectionType : MIXPANELCONFIG.VALUE.RAIL,
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE]: railInfoProp?.audio?.toString() || railInfoProp?.language?.toString(),
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE_PRIMARY]: primaryLanguage,
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: railInfoProp?.genre?.toString(),
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE_PRIMARY]: primaryGenre,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: railInfoProp?.provider || metaData?.provider,
    [MIXPANELCONFIG.PARAMETER.CONTENT_AUTH]: contentAuth ? MIXPANELCONFIG.VALUE.NO : MIXPANELCONFIG.VALUE.YES,
    [MIXPANELCONFIG.PARAMETER.CONTENT_CATEGORY]: railInfoProp?.contentType,
    [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: location?.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_RATING]: railInfoProp?.contentRating || railInfoProp?.rating,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: metaData?.channelName || title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: title,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: getMixpanelData( 'channelName' ),
    [MIXPANELCONFIG.PARAMETER.FREE_CONTENT]: contentAuth ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.RELEASE_YEAR]: railInfoProp?.releaseYear,
    [MIXPANELCONFIG.PARAMETER.DEVICE_TYPE]: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
    [MIXPANELCONFIG.PARAMETER.ACTORS]: railInfoProp?.actor?.toString() || '',
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'contentView' ),
    [MIXPANELCONFIG.PARAMETER.BUFFER_DURATION_SECONDS]: getBufferDifference() ? getBufferDifference() / 1000 : 0, // Surabhi
    [MIXPANELCONFIG.PARAMETER.BUFFER_DURATION_MINUTES]: getBufferDifference() ? Number( ( getBufferDifference() / 60000 ).toFixed( 2 ) ) : 0, // Surabhi
    [MIXPANELCONFIG.PARAMETER.START_TIME]: played ? generateMPdate( played ) : 0, // Surabhi
    [MIXPANELCONFIG.PARAMETER.STOP_TIME]: paused ? generateMPdate( paused ) : 0, // Surabhi
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_PAUSE]: pauseCount || 0,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_RESUME]: playCount || 0,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: myPlanProps?.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: myPlanProps?.subscriptionPackType,
    [MIXPANELCONFIG.PARAMETER.DURATION_SECONDS]: totalWatchedTime ? Number( totalWatchedTime.toFixed( 2 ) ) : 0,
    [MIXPANELCONFIG.PARAMETER.DURATION_MINUTES]: totalWatchedTime ? Number( ( totalWatchedTime / 60 ).toFixed( 2 ) ) : 0,
    [MIXPANELCONFIG.PARAMETER.VIDEO_QUALITY]: videoQuality, // Gauri need to put this
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: liveContent ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.LIVE_CONTENT]: liveContent ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.SEEK_BAR_PROGRESS]: currentTime ? `${Math.round( ( Math.trunc( currentTime ) / Math.trunc( videoElement?.duration ) ) * 100 )}%` : `0%`,
    ...( taUseCaseObject && { [MIXPANELCONFIG.PARAMETER.TA_USECASE_ID] : taUseCaseObject } ),
    ...( error && { [MIXPANELCONFIG.PARAMETER.REASON] : typeof error === 'object' ? error.message || `${ constants.STATUS_CODE } ${ error.code }` : error } ),
    ...( getMixpanelData( 'bingeListSource' ) && bingeListMixpanel() ),
    [MIXPANELCONFIG.PARAMETER.PI_SKIP]: liveContent ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    ...( railInfoProp?.provider?.toLowerCase() === PROVIDER_LIST.PRIME && ( getBingePrimeStatus( responseSubscription ) !== PRIME.PACK_STATUS.SUSPEND && getBingePrimeStatus( responseSubscription ) !== PRIME.PACK_STATUS.CANCELLED ) && {
      [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
      [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: watchNowCTA ? watchNowCTA : getExistingPrimeMixpanel( responseSubscription )
    } ),
    ...( ( event === MIXPANELCONFIG.EVENT.PLAY_CONTENT || event === MIXPANELCONFIG.EVENT.CONTENT_PLAY_END ) && {
      [MIXPANELCONFIG.PARAMETER.CONTENT_ID]: railInfoProp?.id || getContentIdForLastWatch( metaData ),
      [MIXPANELCONFIG.PARAMETER.APP_NAME]:railInfoProp?.provider || metaData?.provider,
      [MIXPANELCONFIG.PARAMETER.BROWSE_PAGE_NAME]: getMixpanelData( 'browsepagename' ),
      [MIXPANELCONFIG.PARAMETER.OPTION]: getMixpanelData( 'optionValue' ),
      [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
      [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
      [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant,
      ...( inputValue && { [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue } ),
      ...( ( getContentRailPositionData()?.sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && !autoPlayTrailor ) && {
        [MIXPANELCONFIG.PARAMETER.CHIP_NAME]: getChipData()?.name,
        [MIXPANELCONFIG.PARAMETER.CHIP_POSITION]: getChipData()?.position
      } ),
      ...( contentType === MIXPANELCONFIG.EVENT.SEARCH && { [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue } )
    } )
  }, {
    ...( event === MIXPANELCONFIG.EVENT.CONTENT_PLAY_FAIL && error && {
      [MIXPANELCONFIG.PARAMETER.ERROR_CODE]: error.response?.data?.code?.toString() || error.code,
      [MIXPANELCONFIG.PARAMETER.APP_NAME]:railInfoProp?.provider || metaData?.provider,
      [MIXPANELCONFIG.PARAMETER.API_END_POINT]: error.response?.request?.responseURL || ( error.data?.[0]?.data?.[0] && error.data[0].data[0] ) || ( error.data?.length > 0 && error.data[0] ) || error.url || error.config?.url
    } )
  } )

  if( getAuthToken() && !autoPlayTrailor && event === MIXPANELCONFIG.EVENT.PLAY_CONTENT ){
    const cleverTapData = {
      contentGenrePrimary: railInfoProp?.genre?.[0],
      contentLanguagePrimary: railInfoProp?.audio?.[0] || railInfoProp?.language?.[0],
      contentParentTitle: title,
      contentTitle: title,
      contentPartner: railInfoProp?.provider || metaData?.provider,
      contentPosition: location?.contentPosition,
      contentRating: railInfoProp?.contentRating || railInfoProp?.rating,
      contentType: contentType,
      railCategory:location?.sectionType ? location.sectionType : MIXPANELCONFIG.VALUE.RAIL,
      railPosition: location?.railPosition,
      railTitle: location?.railTitle,
      railType: railType,
      region: constants.INDIA,
      releaseYear: railInfoProp?.releaseYear || ''
      // clevertapUserID: ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? getSubscriberId() : getDthStatus() === USERS.NON_DTH_USER ? getRmn() : getRmn()
    }
    CleverTapPushService( MIXPANELCONFIG.EVENT.PLAY_CONTENT, cleverTapData );
  }
}

export const player_play_event = ( event, videoElement, metaData, props, source, myPlanProps, error, playCount, pauseCount, played, paused, taUseCaseObject, liveContent, responseSubscription, watchNowCTA, totalWatchedTime, autoPlayTrailor, inputValue ) =>{
  playerDCEvent( event, videoElement, metaData, props, source, myPlanProps, error, playCount, pauseCount, played, paused, taUseCaseObject, liveContent, responseSubscription, watchNowCTA, totalWatchedTime, autoPlayTrailor, inputValue )
}

export const pack_QR_code_refresh = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.PACK_QR_CODE_REFRESH )
}

export const device_rename_success = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.DEVICE_RENAME_SUCCESS )
}

export const search_home = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_HOME, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: 'HOME'
  } )
}

export const search_results = ( inputValue, selectedLang, selectedGen, count, recentSearchClicked, selectedSuggestion ) =>{
  const source = recentSearchClicked ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_RECENT_SEARCH :
    selectedSuggestion ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_AUTO_COMPLETE :
      MIXPANELCONFIG.VALUE.SEARCH_SOURCE_MANUAL
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_RESULT, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.FILTER_LANGUAGE]: selectedLang?.toString(),
    [MIXPANELCONFIG.PARAMETER.SEARCH_TYPE]: MIXPANELCONFIG.VALUE.SEARCH_TYPE,
    [MIXPANELCONFIG.PARAMETER.SEARCH_COUNT]: count,
    [MIXPANELCONFIG.PARAMETER.FILTER_GENRE]: selectedGen?.toString(),
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )

}

export const search_event = ( inputValue, recentSearchClicked, selectedSuggestion, selectedLang, selectedGen ) =>{
  const source = recentSearchClicked ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_RECENT_SEARCH :
    selectedSuggestion ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_AUTO_COMPLETE :
      MIXPANELCONFIG.VALUE.SEARCH_SOURCE_MANUAL
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.SEARCH, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.FILTER_LANGUAGE]: selectedLang?.toString(),
    [MIXPANELCONFIG.PARAMETER.FILTER_GENRE]: selectedGen?.toString(),
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )

}

export const search_no_result = ( inputValue, selectedLang, recentSearchClicked, selectedSuggestion ) =>{
  const source = recentSearchClicked ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_RECENT_SEARCH :
    selectedSuggestion ? MIXPANELCONFIG.VALUE.SEARCH_SOURCE_AUTO_COMPLETE :
      MIXPANELCONFIG.VALUE.SEARCH_SOURCE_MANUAL
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant
  trackEvent( MIXPANELCONFIG.EVENT.NO_SEARCH_RESULT, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.SEARCH_TYPE]: MIXPANELCONFIG.VALUE.SEARCH_TYPE,
    [MIXPANELCONFIG.PARAMETER.SEARCH_COUNT]: 0,
    [MIXPANELCONFIG.PARAMETER.FILTER_LANGUAGE]: selectedLang?.toString(),
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )
}

export const search_result_swipe = ( inputValue ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_RESULT_SWIPE, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: inputValue
  } )
}

export const login_subscription_select = ( subscriptionId ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SUBSCRIPTIONID_SELECT, {
    ...( subscriptionId && { [MIXPANELCONFIG.PARAMETER.SUBSCRIPTION_ID]: subscriptionId } ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_sid_select = ( subscriberId ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SID_SELECT, {
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: subscriberId,
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.WO]: COMMON_HEADERS.WO,
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_sid_enter = ( subscriberId ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SID_ENTER, {
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: subscriberId,
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const login_success = () => {
  const removeDeviceList = getListOfDevices( getRemovedDeviceNames() )

  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SUCCESS, {
    [MIXPANELCONFIG.PARAMETER.USER_STATE]: getProductName() === PACKS.FREEMIUM ? PACKS.FREEMIUM : PACKS.SUBSCRIBED,
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.USER_TYPE]: ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? MIXPANELCONFIG.VALUE.TP : MIXPANELCONFIG.VALUE.NON_TP,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.TYPE]: getMixpanelData( 'loginType' ),

    ...( getDeviceManagementFromLoginJourney() && {
      ...( Array.isArray( removeDeviceList ) && Object.assign( {}, ...removeDeviceList ) ),
      [MIXPANELCONFIG.PARAMETER.DEVICE_ADDED]: COMMON_HEADERS.DEVICE_NAME
    } ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const term_condition = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.TERM_AND_CONDITIONS )
}

export const term_privacy_policy = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.PRIVACY_POLICY )
}

export const device_removed = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.REMOVE_DEVICE )
}

export const cancel_plan = ( myPlanProps ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_CANCEL_PLAN, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]:myPlanProps?.daysRemaining
  } )
}

export const cancel_plan_proceed = ( myPlanProps ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_CANCEL_PLAN_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]:myPlanProps?.daysRemaining
  } )
}
export const cancel_plan_later = ( myPlanProps )=>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_CANCEL_PLAN_LATER, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]:myPlanProps?.daysRemaining
  } )
}
export const dont_cancel_plan = ( myPlanProps )=>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_DONT_CANCEL_PLAN, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: myPlanProps?.subscriptionPackType
  } )
}

export const subscription_page_initiate  = ( pageName ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SUBSCRIPTION_PAGE_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSource( pageName )
  } )
}

export const subscription_page_proceed  = ( pageName, title ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SUBSCRIPTION_PAGE_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSource( pageName ),
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: title
  } )
}

export const payment_success_continue_watching = ()=>{
  trackEvent( MIXPANELCONFIG.EVENT.PAYMENT_SUCCESS_POPUP_STARTWATCHING )
}

export const my_plan_renew_other_option = ( myPlanProps ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_RENEW_OTHER_OPTIONS, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]: myPlanProps?.daysRemaining
  } )
}

export const my_plan_renew_change_tenure = ( myPlanProps ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_RENEW_CHANGE_TENURE, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps?.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.DAYS_REMAINING]: myPlanProps?.daysRemaining
  } )
}




export const login_confirm_pack = ( suffientBalance, packInfo ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_CONFIRMPACK, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.FLOW] : suffientBalance ? 'DIRECT' : 'LOW_BALANCE',
    [MIXPANELCONFIG.PARAMETER.ORIGINALSUB] : `${ packInfo?.planDetail?.upgradeMyPlan } ${ packInfo?.params?.amountWithoutCurrency }`
  } )
}

export const my_Account_recharge = ( recommendedAmount ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MYACCOUNT_RECHARGE, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.RECOMMENDED_AMOUNT]: recommendedAmount
  } )
}

export const screen_saver_show = ( imageUrl ) =>{
  doNotShowScreenSaver() && trackEvent( MIXPANELCONFIG.EVENT.SCREENSAVER_SHOW, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.IMAGE_URL]: imageUrl
  } )
}

export const startFreeTrial = ( previousPathName ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.START_FREE_TRIAL, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName )
  } )
}

export const getRailType = ( sectionSource ) =>{
  return sectionSource?.toLowerCase() === 'recommendation' ? MIXPANELCONFIG.VALUE.RECOMMENDATION : MIXPANELCONFIG.VALUE.EDITORIAL
}

export const watchLearnAction = ( title, contentType, provider ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.WATCH_LEARN_ACTION, {
    [MIXPANELCONFIG.PARAMETER.TITLE_OF_CONTENT]: title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: contentType,
    [MIXPANELCONFIG.PARAMETER.PROVIDER]: provider
  } )
}

export const leftMenuClick = () =>{
  trackEvent( MIXPANELCONFIG.EVENT.MENU_CLICK )
}

export const leftMenuOptionClicked = ( label, pageType ) =>{
  if( pageType === PAGE_TYPE.LOGIN || pageType === PAGE_TYPE.BINGE_LIST || pageType === PAGE_TYPE.CURRENT_SUBSCRIPTION ){
    return;
  }
  trackEvent( MIXPANELCONFIG.EVENT.MENU_OPTION, {
    [MIXPANELCONFIG.PARAMETER.OPTION_SELECTED]: label
  } )
}

export const categorySelected = ( label ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MENU_CATEGORY, {
    [MIXPANELCONFIG.PARAMETER.CATEGORY_SELECTED]: label
  } )
}

export const playLiveTV = ( metaData, channelMeta ) => {
  const data = getContentRailPositionData()
  trackEvent( MIXPANELCONFIG.EVENT.PLAY_LIVETV, {
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: channelMeta.channelName,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: metaData.title,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NUMBER]: channelMeta.channelNumber,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: CONTENT_TYPE.LIVE,
    [MIXPANELCONFIG.PARAMETER.DURATION]: metaData.duration,
    [MIXPANELCONFIG.PARAMETER.DURATION_IN_SECONDS]: metaData.duration ? metaData.duration * 60 : 0,
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: channelMeta.genre,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: data.sectionSource,
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE]: metaData.audio,
    [MIXPANELCONFIG.PARAMETER.CONTENT_LANGUAGE_PRIMARY]: metaData.audio?.[0],
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: data.railPosition,
    [MIXPANELCONFIG.PARAMETER.CONTENT_POSITION]: data.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CONFIG_TYPE]: data.sectionSource,
    [MIXPANELCONFIG.PARAMETER.TIME_TAKEN_IN_TUNING]: ''
  } )
}

export const playNonSubscribedLiveTV = ( metaData, channelMeta ) => {
  trackEvent( MIXPANELCONFIG.EVENT.CHANNEL_NOT_SUBSCRIBED, {
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: channelMeta.channelName,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: metaData.title,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NUMBER]: channelMeta.channelNumber,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TYPE]: CONTENT_TYPE.LIVE,
    [MIXPANELCONFIG.PARAMETER.OSD_TYPE_VALUE]: '',
    [MIXPANELCONFIG.PARAMETER.ERROR_CODE_VALUE]: '',
    [MIXPANELCONFIG.PARAMETER.CONTENT_GENRE]: channelMeta.genre
  } )
}

export const pack_selection_initiate = ( previousPathName, myPlanProps ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PACK_SELECTION_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getSourceForMixPanel( previousPathName ).includes( PAGE_NAME.HOME ) ? constants.LOGIN_ENTRY.LEFT_MENU : getSourceForMixPanel( previousPathName ),
    [MIXPANELCONFIG.PARAMETER.PAYMENT_METHOD]: myPlanProps && Object.keys( myPlanProps ).length > 0 ? myPlanProps.paymentMethod : ''
  } )
}

export const pack_selection_view = ( title ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PACK_SELECTION_VIEWS, {
    [MIXPANELCONFIG.PARAMETER.PLAN_NAME]: title
  } )
}

export const loginMyPlanStartWatching = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_MY_PLAN_STARTWATCHING )
}

export const loginEmail = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_EMAIL, {
    [MIXPANELCONFIG.PARAMETER.DSN]: COMMON_HEADERS.DEVICE_ID,
    [MIXPANELCONFIG.PARAMETER.SUBSCRIBERID]: getSubscriberId(),
    [MIXPANELCONFIG.PARAMETER.EMAIL_CHANGE]: MIXPANELCONFIG.VALUE.YES
  } )
}

export const settingsVisit = () => {
  trackEvent( MIXPANELCONFIG.EVENT.SETTINGS_VISITS )
}

export const settingsMenuOptions = ( title ) => {
  trackEvent( MIXPANELCONFIG.EVENT.SETTINGS_MENU_OPTION, {
    [MIXPANELCONFIG.PARAMETER.TITLE]: title
  } )
}

export const myPlanChangeTenure = ( tenure, title ) => {
  trackEvent( MIXPANELCONFIG.EVENT.MY_PLAN_CHANGE_TENURE, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: title,
    [MIXPANELCONFIG.PARAMETER.TENURE]: tenure
  } )
}

export const packTenureView = ( title ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PACK_TENURE_VIEW, {
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: title
  } )
}

export const upgradePopup = () => {
  trackEvent( MIXPANELCONFIG.EVENT.UPGRADE_POPUP )
}

export const upgradePopupCancel = () => {
  trackEvent( MIXPANELCONFIG.EVENT.UPGRADE_POPUP_CANCEL )
}

export const upgradePopupUprade = () => {
  trackEvent( MIXPANELCONFIG.EVENT.UPGRADE_POPUP_UPGRADE )
}

export const homeSubscribeClick = () => {
  trackEvent( MIXPANELCONFIG.EVENT.HOME_SUBSCRIBE_CLICK, {
    [MIXPANELCONFIG.PARAMETER.PLATFORM]: COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.USER_TYPE]: !getDthStatus() ? MIXPANELCONFIG.VALUE.GUEST : ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? MIXPANELCONFIG.VALUE.TP : MIXPANELCONFIG.VALUE.NON_TP
  } )
}

export const previouslyRMNLands = ( isLoginToggle ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_RMN_SELECT_PAGE_VISIT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: isLoginToggle ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const previouslyRMNClickOnRMN = ( rmn ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_RMN_SELECT_PAGE_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.SELECTED_RMN]: rmn || getRmn(),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const previouslyRMNClickOnNewRMN = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_RMN_SELECT_PAGE_NEWLOGIN, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const onOTPScreen = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_OTP_PAGE_VISIT, {
    [MIXPANELCONFIG.PARAMETER.RMN]: getRmn(),
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const playerAppleEvent = () => {
  trackEvent( MIXPANELCONFIG.EVENT.PACK_SELECTION_VIEWS, {
    [MIXPANELCONFIG.PARAMETER.PLAN_NAME]: title
  } )
}

export const helpClicked = ( source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.HELP_CLICKED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.HELP_TYPE]: MIXPANELCONFIG.VALUE.APPLE_ACTIVATION_VIDEO
  } )
}

export const helpClosed = ( source, playerTime ) => {
  trackEvent( MIXPANELCONFIG.EVENT.HELP_CLOSED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.HELP_TYPE]: MIXPANELCONFIG.VALUE.APPLE_ACTIVATION_VIDEO,
    [MIXPANELCONFIG.PARAMETER.PLAY_DURATION]: playerTime,
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: MIXPANELCONFIG.VALUE.YES
  } )
}

export const applePlayCtaClicked = ( metaData, responseSubscription, source ) => {
  const location = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.APPLE_PLAY_CTA_CLICKED, { ...mixPanelData( location, metaData, responseSubscription, source )
  } )
}

export const activateAppleTvSubscriptionClick = ( metaData, responseSubscription, source, openFromPopup, autoPlay ) => {
  const location = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.ACTIVATE_APPLE_TV_SUBSCRIPTION_CLICK, { ...mixPanelData( location, metaData, responseSubscription, source ),
    [MIXPANELCONFIG.PARAMETER.AUTO_PLAYED]: autoPlay ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO,
    [MIXPANELCONFIG.PARAMETER.VIA_POPUP]: openFromPopup ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO
  } )
}

export const contentLanguageOpen = ( source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.CONTENT_LANG_OPEN, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source
  } )
}

export const contentLanguageProceed = () => {
  trackEvent( MIXPANELCONFIG.EVENT.CONTENT_LANG_PROCEED )
}

export const contentLanguageSkip = () => {
  trackEvent( MIXPANELCONFIG.EVENT.CONTENT_LANG_SKIP )
}

export const contentLanguageSelect = ( languages, launchCount ) => {
  const languagesObject = {};
  let source;
  languages?.forEach( ( language, index ) => {
    languagesObject['LANGUAGE' + ( index + 1 )] = language;
  } );
  if( +launchCount === 1 ){
    source = MIXPANELCONFIG.VALUE.APP_LAUNCH
  }
  else if( +launchCount > 1 ){
    source = MIXPANELCONFIG.VALUE.NUDGE
  }
  trackEvent( MIXPANELCONFIG.EVENT.CONTENT_LANG_SELECT, { ...languagesObject,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source
  } )
}

export const loginBingeIdPageVisit = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_BINGEID_PAGE_VISIT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const loginBingeIdPageProceed = ( data ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_BINGEID_PAGE_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.BINGE_ID]: data.bingeSubscriberId,
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const bingeList_remove = ( count ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.BINGELIST_REMOVE, {
    [MIXPANELCONFIG.PARAMETER.BINGE_LIST_REMOVE_COUNT]: count
  } )
}

export const bingeList_select = () => {
  trackEvent( MIXPANELCONFIG.EVENT.BINGELIST_SELECT )
}

export const bingeList_cancel = () => {
  trackEvent( MIXPANELCONFIG.EVENT.BINGELIST_CANCEL )
}

export const bingeListMixpanel = () => {
  return {
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: MEDIA_CARD_TYPE.WATCHLIST,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'bingeListSource' ),
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: constants.BINGE_LIST_RAIL_TYPE
  }
}

export const planUpgradeConfirmationView = ( metaData ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PLAN_UPGRADE_CONFIRMATION_VIEW, {
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: metaData.provider
  } )
}

export const planUpgradeConfirmationNotNow = ( metaData ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PLAN_UPGRADE_CONFIRMATION_NOTNOW, {
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: metaData.provider
  } )
}

export const planUpgradeConfirmationProceed = ( metaData ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PLAN_UPGRADE_CONFIRMATION_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_TITLE]: getContentTitle( metaData ).title,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: metaData.provider
  } )
}

export const autoSuggestionInitiate = ( count, keyword, matches ) => {
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.AUTO_SUGGESTION_INITIATE, {
    [MIXPANELCONFIG.PARAMETER.MATCH_COUNT]: count,
    [MIXPANELCONFIG.PARAMETER.MATCHES]: matches,
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant,
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: keyword
  } )
}

export const autoSuggestionClicked = ( count, keyword ) => {
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.AUTO_SUGGESTION_CLICKED, {
    [MIXPANELCONFIG.PARAMETER.CLICKED_POSITION]: count,
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: keyword,
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant
  } )
}

export const searchSkiped = ( searchResults, autoCompleteSuggestion, keyword ) => {
  const searchResultTitles = {};
  const autoCompleteTitles = {};
  const populateTitles = ( sourceArray, targetObj, keyPrefix ) => {
    for ( let i = 0; i < 5; i++ ){
      // eslint-disable-next-line no-param-reassign
      targetObj[`${keyPrefix}-${i + 1}`] = sourceArray?.[i]?.title || 'Not Available';
    }
  };
  if( Array.isArray( searchResults ) ){
    populateTitles( searchResults, searchResultTitles, MIXPANELCONFIG.PARAMETER.SEARCH_RESULTS );
  }
  populateTitles( autoCompleteSuggestion, autoCompleteTitles, MIXPANELCONFIG.PARAMETER.AUTO_COMPLETE_SUGGESTION );
  const searchConfig = getABTestingFeatureConfig( ABMainFeature.searchFeature )
  const experimentKey =  searchConfig?.experimentKey
  const segment = searchConfig?.segment
  const variant =  searchConfig?.variant

  trackEvent( MIXPANELCONFIG.EVENT.SEARCH_SKIPED, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD]: keyword,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: MIXPANELCONFIG.VALUE.HOME,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: MIXPANELCONFIG.EVENT.SEARCH_HOME,
    [MIXPANELCONFIG.PARAMETER.SEARCH_TYPE]: MIXPANELCONFIG.VALUE.SEARCH_TYPE,
    [MIXPANELCONFIG.PARAMETER.EXPERIMENT_NAME]: experimentKey,
    [MIXPANELCONFIG.PARAMETER.SEGMENT_NAME]: segment,
    [MIXPANELCONFIG.PARAMETER.VARIANT_NAME]: variant,
    ...searchResultTitles,
    ...autoCompleteTitles
  } )
}

export const primeInterstitialPageViewed = ( event, source, responseSubscription ) => {
  trackEvent( event, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source
  } )
}

export const primeRedirectionPopupClicked = ( responseSubscription ) => { // removing this ( BINGE_PRIME_STATUS, EXISTING_PRIME ) mixpanel poperties as per the contract TPSLS-1193
  trackEvent( MIXPANELCONFIG.EVENT.PRIME_REDIRECTION_POPUP, {
    // [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    // [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const primeRedirectionPopupProceed = ( responseSubscription ) => { // removing this ( BINGE_PRIME_STATUS, EXISTING_PRIME ) mixpanel poperties as per the contract TPSLS-1193
  trackEvent( MIXPANELCONFIG.EVENT.PRIME_REDIRECTION_POPUP_PROCEED, {
    // [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    // [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const activatePrime = ( source, responseSubscription ) => { // removing this ( BINGE_PRIME_STATUS, EXISTING_PRIME ) mixpanel poperties as per the contract TPSLS-1193
  trackEvent( MIXPANELCONFIG.EVENT.ACTIVATE_PRIME, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : source
    // [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    // [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const zeroAppMixpanelEvents = ( eventName, myPlanProps ) => {
  trackEvent( eventName, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : getMixpanelData( 'zeroAppSource' ),
    [MIXPANELCONFIG.PARAMETER.PACK_NAME]: myPlanProps.upgradeMyPlanType,
    [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: myPlanProps.amountValue,
    [MIXPANELCONFIG.PARAMETER.PACK_TENURE]: myPlanProps.currentTenure,
    [MIXPANELCONFIG.PARAMETER.PACK_TYPE]: myPlanProps.subscriptionPackType
  } )
}

export const appActivationPopup = ( provider ) => {
  trackEvent( MIXPANELCONFIG.EVENT.APPS_ACTIVATION_POPUP, {
    [MIXPANELCONFIG.PARAMETER.APPS ] : provider
  } )
}

export const appActivationPopupExit = ( provider ) => {
  trackEvent( MIXPANELCONFIG.EVENT.APPS_ACTIVATION_POPUP_EXIT, {
    [MIXPANELCONFIG.PARAMETER.ACTIVATION_PENDING ] : provider
  } )
}

export const activateAppleTVSubscriptionClick = ( source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.ACTIVATE_APPLE_TV_SUBSCRIPTION_CLICK, {
    [MIXPANELCONFIG.PARAMETER.SOURCE ]: source,
    [MIXPANELCONFIG.PARAMETER.INTERSTITAL_PAGE ]: MIXPANELCONFIG.VALUE.YES // Todo : It should be dynamic
  } )
}

export const loginOtpPageBack = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_OTP_PAGE_BACK, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.RMN] : getRmn(),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const loginExit = ( type ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_EXIT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_PAGE] : type,
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const loginSubIdPageVisit = () => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SUBID_PAGE_VISIT, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const loginSubIdPageProceed = ( sub ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LOGIN_SUBID_PAGE_PROCEED, {
    [MIXPANELCONFIG.PARAMETER.SOURCE] : getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.SUBSCRIPTION_ID] : sub,
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: getIsLoginToggleState() ? MIXPANELCONFIG.VALUE.QR_CODE : MIXPANELCONFIG.VALUE.RMN
  } )
}

export const subMenuOptionClicked = ( label ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.MENU_OPTION, {
    [MIXPANELCONFIG.PARAMETER.OPTION_NAME]: label
  } )
}

export const autoSuggestionScrolled = ( keyword ) => {
  trackEvent( MIXPANELCONFIG.EVENT.AUTO_SUGGESTION_SCROLLED, {
    [MIXPANELCONFIG.PARAMETER.SEARCH_KEYWORD] : keyword
  } )
}

export const learnActionForOrphanContent = ( metaData, responseSubscription, source ) => {
  const data = getContentRailPositionData();
  trackEvent( MIXPANELCONFIG.EVENT.LA_NOT_TRIGGERED, { ...mixPanelData( data, metaData, responseSubscription, source ),
    [MIXPANELCONFIG.PARAMETER.REASON ] : MIXPANELCONFIG.VALUE.LA_ERROR
  } )
}

export const appleQrCodeView = ( journeyStatus, source ) => {
  trackEvent( MIXPANELCONFIG.EVENT.ACTIVATE_APPLE_TV_QR_VIEWED, {
    [MIXPANELCONFIG.PARAMETER.PLATFORM ] : COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.VIA_POPUP ] : getAppleActivationFlagStatus( journeyStatus ),
    [MIXPANELCONFIG.PARAMETER.SOURCE ] : source,
    [MIXPANELCONFIG.PARAMETER.INTERSTITAL_PAGE ] : MIXPANELCONFIG.VALUE.YES
  } )
}

export const appleErrorInfo = () => {
  trackEvent( MIXPANELCONFIG.EVENT.BOKU_ERROR_NUDGE, {
    [MIXPANELCONFIG.PARAMETER.PLATFORM ] : COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.ERROR_REASON ] : APPLETV.ERROR_REASON,
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER ] : APPLE_PRIME_ACTIVATION_JOURNEY.APPLE
  } )
}

export const appleActivationError = ( error, code ) => {
  trackEvent( MIXPANELCONFIG.EVENT.ERROR_POPUP, {
    [MIXPANELCONFIG.PARAMETER.PLATFORM ] : COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.ERROR_MESSAGE ] : error,
    [MIXPANELCONFIG.PARAMETER.ERROR_CODE ] : code
  } )
}

export const primeRedirectionPopupForgotAccount = ( responseSubscription ) => { // removing this ( BINGE_PRIME_STATUS, EXISTING_PRIME ) mixpanel poperties as per the contract TPSLS-1193
  trackEvent( MIXPANELCONFIG.EVENT.PRIME_REDIRECTION_POPUP_FORGOTACCOUNT, {
    // [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    // [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const primeRedirectionPopupForgotAccountFail = ( responseSubscription ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PRIME_FORGOTACCOUNT_FAIL, {
    [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const primeRedirectionPopupForgotAccountRetry = ( responseSubscription ) => {
  trackEvent( MIXPANELCONFIG.EVENT.PRIME_FORGOTACCOUNT_RETRY, {
    [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: getBingePrimeStatusMixpanel( responseSubscription ),
    [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: getExistingPrimeMixpanel( responseSubscription )
  } )
}

export const smartSubscriptionRefresh = ( provider, status ) =>{
  trackEvent( MIXPANELCONFIG.EVENT.SMART_SUBSCRIPTION_REFRESH, {
    [MIXPANELCONFIG.PARAMETER.CONTENT_PARTNER]: provider,
    [MIXPANELCONFIG.PARAMETER.NEW_SUBSCRIPTION_STATUS]: status
  } )
}

export const listDevices = ( value ) => {
  trackEvent( MIXPANELCONFIG.EVENT.LIST_DEVICES, {
    [MIXPANELCONFIG.PARAMETER.DEVICE_LIST]: value
  } );
};

export const deviceListingview = ( value ) => {
  trackEvent( MIXPANELCONFIG.EVENT.DEVICE_LISTING_VIEW, {
    [MIXPANELCONFIG.PARAMETER.DEVICE_LIST]: value
  } )
}

export const deviceremoveSkip = ( ) => {
  trackEvent( MIXPANELCONFIG.EVENT.DEVICE_REMOVE_SKIP, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getAuthToken() ? MIXPANELCONFIG.VALUE.DEVICE_MANAGEMENT : MIXPANELCONFIG.VALUE.LOGIN
  } )
}

export const qrRefresh = () => {
  trackEvent( MIXPANELCONFIG.EVENT.QR_REFRESH, {
    [MIXPANELCONFIG.PARAMETER.SOURCE]: getMixpanelData( 'loginEntry' ),
    [MIXPANELCONFIG.PARAMETER.LOGIN_MODE]: MIXPANELCONFIG.VALUE.QR_CODE
  } )
}

export const channelBroadcasterClick = ( MPItems, railType, source, broadCasterTitle, broadCasterPosition ) => {
  const data = getContentRailPositionData()
  trackEvent( MIXPANELCONFIG.EVENT.CHANNEL_RAIL_INTERACTED, {
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: MPItems.railTitle || data.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: railType === CHANNEL_RAIL_TYPE.STANDALONE ? constants.STANDALONE_CHANNEL_RAIL : constants.COMPOSITE_CHANNEL_RAIL,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.BROADCAST_PARTNER]: broadCasterTitle,
    [MIXPANELCONFIG.PARAMETER.PARTNER_POSITION]: broadCasterPosition
  } )
}

export const channelRailClick = ( MPItems, railType, source, broadCasterTitle, broadCasterPosition ) => {
  const data = getContentRailPositionData()
  trackEvent( MIXPANELCONFIG.EVENT.CHANNELS_RAIL_CLICK, {
    [MIXPANELCONFIG.PARAMETER.RAIL_TITLE]: MPItems.railTitle || data.railTitle,
    [MIXPANELCONFIG.PARAMETER.RAIL_TYPE]: railType === CHANNEL_RAIL_TYPE.STANDALONE ? MIXPANELCONFIG.VALUE.STANDALONE_CHANNEL_RAIL : MIXPANELCONFIG.VALUE.COMPOSITE_CHANNEL_RAIL,
    [MIXPANELCONFIG.PARAMETER.PAGE_NAME]: source,
    [MIXPANELCONFIG.PARAMETER.SOURCE]: source,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_POSITION]: MPItems.contentPosition,
    [MIXPANELCONFIG.PARAMETER.CHANNEL_NAME]: MPItems.contentTitle,
    [MIXPANELCONFIG.PARAMETER.BROADCAST_PARTNER]: broadCasterTitle,
    [MIXPANELCONFIG.PARAMETER.PARTNER_POSITION]: broadCasterPosition
  } )
}

export const rail_chip_click = ( selectedContent = null, title = null, position = null ) =>{
  const data = getContentRailPositionData();
  const chipLocalStorageData = getChipData()
  trackEvent( MIXPANELCONFIG.EVENT.RAIL_CHIP_CLICK, {
    [MIXPANELCONFIG.PARAMETER.CHIP_NAME]: selectedContent?.chipName || chipLocalStorageData?.value?.content?.chipName,
    [MIXPANELCONFIG.PARAMETER.CHIP_POSITION]: selectedContent?.indexPosition,
    [MIXPANELCONFIG.PARAMETER.RAIL_POSITION]: position || chipLocalStorageData?.position,
    [MIXPANELCONFIG.PARAMETER.RAIL_NAME]: title || chipLocalStorageData?.title,
    [MIXPANELCONFIG.PARAMETER.OPTION]: getMixpanelData( 'browsepagename' )
  } )
}