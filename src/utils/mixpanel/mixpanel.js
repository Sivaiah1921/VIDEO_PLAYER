import mixpanel from 'mixpanel-browser';
import { getBingeSubscriberId, getDthStatus, getLoginMsg, getMixPanelId, getSubscriberId } from '../localStorageHelper';
import { getBingeListPeopleProperties, getBingePrimeStatusPeopleProperties, getExistingPrimePeopleProperties, getMixpanelPeopleProperties, getMixpanelSuperProperties, getPlayerPeopleProperties } from '../mixPanelCommon';
import MIXPANELCONFIG from '../mixpanelConfig';
import { USERS } from '../constants';
import { login_success } from './mixpanelService';
import { trackErrorEvents, trackLogEvents } from '../logTracking';


const identifyUser = ( ) => {
  if( getMixPanelId() ){
    mixpanel.identify( getMixPanelId() );
  }
}

const setUserProperties = ( userInfo ) => {
  setSuperProperties( userInfo )
  setPeopleProperties( userInfo )
  setGroupProperties( )
}

const setSuperProperties = ( userInfo ) => {
  const superProperties = getMixpanelSuperProperties( userInfo )
  mixpanel.register && mixpanel.register( superProperties );
}

const setPeopleProperties = ( userInfo ) => {
  let properties = {}
  if( userInfo ){
    properties = getMixpanelPeopleProperties( userInfo );
    mixpanel.people && mixpanel.people.set( properties );
  }
}

export const setGroupProperties = () => {
  const groupPropertyCondtion = ( getDthStatus() === USERS.DTH_OLD_STACK_USER || getDthStatus() === USERS.DTH_NEW_STACK_USER ) ? getSubscriberId() : getBingeSubscriberId()
  mixpanel.set_group && mixpanel.set_group( [MIXPANELCONFIG.PARAMETER.SID], groupPropertyCondtion );
  if( getLoginMsg() ){
    /* Mixpanel-events */
    login_success()
  }
}

const trackEvent = ( eventType, data = {}, otherInfo ) => {
  const userAgent = ( typeof navigator !== 'undefined' && navigator.userAgent ) ? navigator.userAgent : '';
  if( !eventType ){ // eslint-disable-line no-console
    console.error( 'Event type is required for tracking' ); // eslint-disable-line no-console
    return;
  }
  if( userAgent.includes( 'Tizen' ) ){
    const match = userAgent.match( /(\d{2,3})\.\d+\.\d+\.\d+/ );
    let tizenVersion = 'unknown';
    if( match ){
      tizenVersion = match[1];
    }
    // eslint-disable-next-line no-param-reassign
    data.$browser_version = tizenVersion;
  }
  if( mixpanel && typeof mixpanel.track === 'function' ){
    data ? mixpanel.track( eventType, data ) : mixpanel.track( eventType );
  }
  else {
    // eslint-disable-next-line no-console
    console.error( 'Mixpanel track function is not available' );
  }
  if( data?.[MIXPANELCONFIG.PARAMETER.REASON] ){
    // tracking this specific event from useAxios error portion...
    if( eventType !== MIXPANELCONFIG.EVENT.SUBSCRIBE_FAILED ){
      trackErrorEvents( eventType, { message: data[MIXPANELCONFIG.PARAMETER.REASON], code: otherInfo?.[MIXPANELCONFIG.PARAMETER.ERROR_CODE], url: otherInfo?.[MIXPANELCONFIG.PARAMETER.API_END_POINT] } )
    }
  }
  else {
    trackLogEvents( eventType, data )
  }
}

const unsetSuperProperties = () => {
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.TS_SID );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.C_ID );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_NAME );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_PRICE );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_TYPE );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_ID );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_TENURE );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.RMN );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.STACK );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_END_DATE );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.PACK_START_DATE );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.SUBSCRIBED );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.SID );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.APPLE_COUPON_STATUS );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.USER_IDENTITY );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.BINGE_LIST_COUNT );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS );
  mixpanel.people.unset( MIXPANELCONFIG.PARAMETER.EXISTING_PRIME );

  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.TS_SID );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.C_ID );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_NAME );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_PRICE );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_TYPE );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_ID );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_TENURE );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.RMN );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.STACK );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_END_DATE );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.PACK_START_DATE );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.SUBSCRIBED );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.SID );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.APPLE_COUPON_STATUS );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.USER_IDENTITY );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.BINGE_LIST_COUNT );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.BINGE_PRIME_STATUS );
  mixpanel.unregister( MIXPANELCONFIG.PARAMETER.EXISTING_PRIME );
}

export const resetUserType = () =>{
  const superProperties = getMixpanelSuperProperties();
  superProperties[MIXPANELCONFIG.PARAMETER.USER_TYPE] = MIXPANELCONFIG.VALUE.GUEST;
  mixpanel?.register( superProperties );
}

const setPlayerPeopleProperties = ( contentPlayed ) => {
  const properties = getPlayerPeopleProperties( contentPlayed );
  mixpanel.people && mixpanel.people.set( properties );
}

export const setBingeListPeopleProperties = ( count ) =>{
  const properties = getBingeListPeopleProperties( count );
  mixpanel.people && mixpanel.people.set( properties );
}

export const setBingePrimeStatusPeopleProperties = ( status ) =>{
  const properties = getBingePrimeStatusPeopleProperties( status );
  mixpanel.people && mixpanel.people.set( properties );
}

export const setExistingPrimePeopleProperties = ( status ) =>{
  const properties = getExistingPrimePeopleProperties( status );
  mixpanel.people && mixpanel.people.set( properties );
}

export { trackEvent, identifyUser, setSuperProperties, setUserProperties, unsetSuperProperties, setPlayerPeopleProperties }

