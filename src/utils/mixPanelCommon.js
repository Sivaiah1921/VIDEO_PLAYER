/* eslint-disable no-console */
import { getAuthToken, getBingeSubscriberId, getDeviceInfo, getDeviceList, getDthStatus, getGuestMixPanelId, getMixPanelId, getRmn, getSubscriberId, getTVDeviceId, getUserInfo } from './localStorageHelper';
import MIXPANELCONFIG from './../utils/mixpanelConfig';
import { COMMON_HEADERS, USERS, isTizen } from './constants';
import { appleCoupanStatus } from './util';

const parseDMY = date => {
  if( date ){
    const [d, m, y] = date.split( /\D/ );
    return new Date( y, m - 1, d );
  }
  return new Date()
};

export const getMixpanelPeopleProperties = ( userInfo ) => {
  let deviceList = {};
  if( getDeviceList() ){
    JSON.parse( getDeviceList() )?.forEach( ( device, index ) => {
      deviceList[`DEVICE-${index + 1}`] = device.deviceName;
    } );
  }

  const expirydate = parseDMY( userInfo.expiryDate )
  if( Object.keys( userInfo ).length ){
    return {
      'RMN': userInfo.rmn || getRmn(),
      'FIRST-NAME': userInfo.firstName,
      'LAST-NAME': userInfo.lastName,
      'SID': userInfo.sid,
      'STACK': userInfo.stack,
      'TP-RMN': userInfo.rmn || getRmn(),
      'NAME': userInfo.profileName ? userInfo.profileName : COMMON_HEADERS.DEVICE_NAME,
      'TS-SID': userInfo.sid,
      'PROFILE-NAME': userInfo.profileName,
      'EMAIL': userInfo.email,
      'FIRST-TIME-LOGIN': userInfo.firstTimeLogin ?
        MIXPANELCONFIG.VALUE.YES :
        MIXPANELCONFIG.VALUE.NO,
      'FIRST-LOGIN-DATE': userInfo.firstTimeLoginDate || '',
      'BINGE-ACCOUNTS-COUNT': userInfo.bingeAccountCount,
      'SUBSCRIBED': userInfo.subscribed,
      'LOGGED-IN-DEVICE-COUNT':  JSON.parse( getDeviceList() )?.length || 0,
      'FREE-TRIAL': userInfo.planType?.toLowerCase() === MIXPANELCONFIG.VALUE.FREE ?
        MIXPANELCONFIG.VALUE.YES :
        MIXPANELCONFIG.VALUE.NO,
      'PACK-NAME': userInfo.packName,
      'PACK-PRICE': userInfo.packPrice,
      'SUBSCRIPTION-TYPE': userInfo.subscriptionType ?
        userInfo.subscriptionType :
        MIXPANELCONFIG.VALUE.UNSUBSCRIBED,
      'BURN-RATE-TYPE': userInfo.burnType,
      'FREE-TRIAL-ELIGIBLE': userInfo.freeTrialEligible ?
        MIXPANELCONFIG.VALUE.YES :
        MIXPANELCONFIG.VALUE.NO,
      'FREE-TRIAL-TAKEN': userInfo.freeTrialAvailed ?
        MIXPANELCONFIG.VALUE.YES :
        MIXPANELCONFIG.VALUE.NO,
      'PACK-RENEWAL-DATE': userInfo.packRenewalDate ? userInfo.packRenewalDate : '',
      'RENEWAL-DUE-DATE': userInfo.packRenewalDate,
      'LAST-USED-AT': new Date().getTime() > new Date( expirydate ).getTime() ? new Date( expirydate ) : new Date(),
      'LAST-APP-USAGE-DATE': new Date(),
      'PACK-START-DATE': userInfo.packStartDate,
      'PACK-END-DATE': userInfo.packEndDate,
      'PROFILE-ID': userInfo.profileId,
      'LAST-PACK-TYPE': userInfo.lastPackType,
      'LAST-PACK-PRICE': userInfo.lastPackPrice,
      'LAST-PACK-NAME': userInfo.lastPackName,
      'LAST-BILLING-TYPE': userInfo.lastBillingType,
      'DAYS-REMAINING-IN-PAID-SUBSCRIPTION': userInfo.packDuration,
      'FIRST-PAID-PACK-SUBSCRIPTION-DATE': userInfo.firstPaidPackSubscriptionDate,
      'TOTAL-PAID-PACK-RENEWALS': userInfo.totalPaidPackRenewal,
      'DATE-OF-SUBSCRIPTION': userInfo.packStartDate,
      'FIRST-PACK-SUBSCRIPTION-DATE': userInfo.firstPaidPackSubscriptionDate,
      'MIXPANEL-ID': userInfo.mixpanelId,
      'PACK-TYPE': userInfo.subscriptionPlanType,
      'DATE': new Date(),
      'DEVICE-TYPE': COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
      'FS': MIXPANELCONFIG.VALUE.NO,
      ...deviceList,
      $distinctId: getSubscriberId(),
      $CleverTap_user_id: getSubscriberId(),
      ...( ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) && { [MIXPANELCONFIG.PARAMETER.TS_SID]: getSubscriberId() } ),
      ...( getDthStatus() !== USERS.DTH_OLD_STACK_USER && getBingeSubscriberId() && { [MIXPANELCONFIG.PARAMETER.C_ID]: getBingeSubscriberId() } )
    };
  }

};

export const getMixpanelSuperProperties = ( userData ) => {
  const device = getDeviceInfo() || {}
  const userInfo = userData || JSON.parse( getUserInfo() );

  return {
    [MIXPANELCONFIG.PARAMETER.APP_VERSION]: COMMON_HEADERS.VERSION,
    ...( getRmn() && { [MIXPANELCONFIG.PARAMETER.RMN]: getRmn() } ),
    [MIXPANELCONFIG.PARAMETER.DEVICE_ID]: getTVDeviceId(),
    [MIXPANELCONFIG.PARAMETER.PLATFORM]: COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.SOURCE_PLATFORM]: COMMON_HEADERS.MP_PLATFORM,
    [MIXPANELCONFIG.PARAMETER.USER_TYPE]: !getAuthToken() ? MIXPANELCONFIG.VALUE.GUEST : ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? MIXPANELCONFIG.VALUE.TP : MIXPANELCONFIG.VALUE.NON_TP,
    [MIXPANELCONFIG.PARAMETER.USER_IDENTITY]: getAuthToken() ? getMixPanelId() : getGuestMixPanelId(),
    ...( ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) && { [MIXPANELCONFIG.PARAMETER.TS_SID]: getSubscriberId() } ),
    ...( ( getDthStatus() !== USERS.DTH_OLD_STACK_USER && getBingeSubscriberId() ) && { [MIXPANELCONFIG.PARAMETER.C_ID]: getBingeSubscriberId() } ),
    ...( Object.keys( device ).length > 0 && {
      [MIXPANELCONFIG.PARAMETER.TV_Model]: device.modelName,
      [MIXPANELCONFIG.PARAMETER.TV_OS_Version]: device.sdkVersion,
      [MIXPANELCONFIG.PARAMETER.TV_Software_Version]: device.version,
      ...( device.screenWidth && device.screenHeight ) && {
        [MIXPANELCONFIG.PARAMETER.TV_Resolution]: device.screenWidth + ' * ' + device.screenHeight
      },
      [MIXPANELCONFIG.PARAMETER.TV_isUHD]: device.uhd
    } ),
    [MIXPANELCONFIG.PARAMETER.TV_Brand]: isTizen ? MIXPANELCONFIG.VALUE.TV_BRAND_SAMSUNG : MIXPANELCONFIG.VALUE.TV_BRAND_LG,
    [MIXPANELCONFIG.PARAMETER.TV_OS]: isTizen ? MIXPANELCONFIG.VALUE.TV_OS_SAMSUNG : MIXPANELCONFIG.VALUE.TV_OS_LG,
    ...( getAuthToken() && userInfo && Object.keys( userInfo ).length > 0 && {
      [MIXPANELCONFIG.PARAMETER.PACK_NAME]:  userInfo.packName || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_TYPE]:  userInfo.subscriptionPlanType || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_PRICE]: userInfo.packPrice || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_TENURE]:  userInfo.tenure || 'NA',
      [MIXPANELCONFIG.PARAMETER.STACK]:  userInfo.stack || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_ID]:  userInfo.packId || 'NA',
      [MIXPANELCONFIG.PARAMETER.SUBSCRIBED]: userInfo.subscribed || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_START_DATE]:  userInfo.packStartDate || 'NA',
      [MIXPANELCONFIG.PARAMETER.PACK_END_DATE]:  userInfo.packEndDate || 'NA',
      [MIXPANELCONFIG.PARAMETER.APPLE_COUPON_STATUS]: appleCoupanStatus( userInfo ) || 'NA',
      [MIXPANELCONFIG.PARAMETER.PRIME_ELIGIBLE]:  userInfo.primeMixpanelInfo.primeEligible || 'NA',
      [MIXPANELCONFIG.PARAMETER.PRIME_SELECTED]: userInfo.primeMixpanelInfo.primeSelected || 'NA',
      [MIXPANELCONFIG.PARAMETER.PRIME_ACTIVATED]: userInfo.primeMixpanelInfo.primeActivated || 'NA',
      [MIXPANELCONFIG.PARAMETER.PRIME_ADD_ON_SELECTED]: userInfo.primeAddOnMixpanelInfo?.primeAddOnSelected || '',
      [MIXPANELCONFIG.PARAMETER.PRIME_ADD_ON_ELIGIBLE]: userInfo.primeAddOnMixpanelInfo?.primeAddOnEligible || '',
      [MIXPANELCONFIG.PARAMETER.PRIME_ADD_ON_ACTIVATED]: userInfo.primeAddOnMixpanelInfo?.primeAddOnActivated || ''
    } )
  }
}

export const getPlayerPeopleProperties = ( contentPlayed ) => {
  return {
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_MOVIES_PLAYED]: contentPlayed.moviesPlayed,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_SHOWS_PLAYED]: contentPlayed.showsPlayed,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_SHORTS_PLAYED]: contentPlayed.shortsPlayed,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_SERIES_PLAYED]: contentPlayed.seriesPlayed,
    [MIXPANELCONFIG.PARAMETER.NUMBER_OF_CATCHUP_PLAYED]: contentPlayed.catchupPlayed,
    [MIXPANELCONFIG.PARAMETER.DURATION_OF_MOVIES_PLAYED]: `${contentPlayed.moviesPlayedDuration} minutes`,
    [MIXPANELCONFIG.PARAMETER.DURATION_OF_SERIES_PLAYED]: `${contentPlayed.seriesPlayedDuration} minutes`,
    [MIXPANELCONFIG.PARAMETER.DURATION_OF_SHORTS_PLAYED]: `${contentPlayed.shortsPlayedDuration} minutes`,
    [MIXPANELCONFIG.PARAMETER.DURATION_OF_SHOWS_PLAYED]: `${contentPlayed.showsPlayedDuration} minutes`,
    [MIXPANELCONFIG.PARAMETER.DURATION_OF_CATCHUP_PLAYED]: `${contentPlayed.catchupPlayedDuration} minutes`,
    [MIXPANELCONFIG.PARAMETER.WATCH_DURATION]: contentPlayed.watchDuration
  }
}

export const getBingeListPeopleProperties = ( count ) =>{
  return {
    [MIXPANELCONFIG.PARAMETER.BINGE_LIST_COUNT]: count
  }
}

export const getBingePrimeStatusPeopleProperties = ( status ) =>{
  return {
    [MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS]: status
  }
}

export const getExistingPrimePeopleProperties = ( status ) =>{
  return {
    [MIXPANELCONFIG.PARAMETER.EXISTING_PRIME]: status
  }
}