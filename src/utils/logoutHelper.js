/* eslint-disable no-param-reassign */
import constants, { PAGE_TYPE, isTizen } from './constants';
import { getAnonymousId, getDeviceInfo, getFirstLaunch, getGuestMixPanelId, getPrefferedLanguageGuest, getTVDeviceId, removeDeviceManagementFromLoginJourney, removeRemovedDeviceNames, setAnonymousId, setDeviceInfo, setFirstLaunch, setGuestMixPanelId, setLogoutIcon, setLogoutMsg, setPreferredLanguageGuest, setProfileId, setTVDeviceId } from './localStorageHelper';
import { resetUserType, unsetSuperProperties } from './mixpanel/mixpanel';
import { log_out } from './mixpanel/mixpanelService';
import { removeSonySDK, removeMXSDK, removeSunNxtSdk } from './util';

export const onLogoutAction = ( mixpanel, setProfileAPIResult, setResult, setResultForUnsubscribe, setCardProps, currentResponseCondition, history, setCustomPageType, setDefaultPageType, previousPathName, successFullPlanPurchasePubnub, setSidebarList, setBaid, onLogout, onLogoutImage, setSubscriber, setResponse, setMetaData, setSonyLivPartnerToken, setBingeListRecord, setIsQrCodeJourney, setInitiateTimer ) => {
  removeSonySDK();
  setSonyLivPartnerToken( null );
  removeMXSDK()
  removeSunNxtSdk()
  const anonymousId = getAnonymousId();
  const deviceID = getTVDeviceId();
  const deviceInfo = getDeviceInfo();
  const distinctId = getGuestMixPanelId();
  const firstLaunch = getFirstLaunch();
  const preferredLanguageGuest = getPrefferedLanguageGuest() || '';
  mixpanel.register( { 'distinct_id': distinctId } )
  /* Mixpanel-events */
  log_out()
  localStorage.clear();
  setInitiateTimer( false );
  setDeviceInfo( deviceInfo )
  setAnonymousId( anonymousId )
  setProfileId( anonymousId )
  setPreferredLanguageGuest( preferredLanguageGuest )
  setProfileAPIResult && setProfileAPIResult( null )
  setTVDeviceId( deviceID )
  setGuestMixPanelId( distinctId )
  setFirstLaunch( firstLaunch )
  setLogoutMsg( constants.LOGOUT_SUCCESS )
  setLogoutIcon( 'Success' )
  setResult && setResult( {} )
  setResultForUnsubscribe && setResultForUnsubscribe( {} )
  setCardProps && setCardProps( [] )
  setBingeListRecord?.( [] )
  if( currentResponseCondition ){
    currentResponseCondition.current = {}
  }
  if( previousPathName ){
    previousPathName.focusedItem = null
    previousPathName.current = '/discover'
    previousPathName.refreshPage = true
  }
  if( successFullPlanPurchasePubnub ){
    successFullPlanPurchasePubnub.current = false
  }
  history && history.push( '/splash' );
  setCustomPageType && setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
  setDefaultPageType && setDefaultPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
  setSidebarList && setSidebarList( {} )
  setBaid && setBaid( 0 )
  onLogout && onLogout()
  onLogoutImage && onLogoutImage()
  setSubscriber && setSubscriber()
  setResponse && setResponse( null )
  /* Mixpanel-events */
  unsetSuperProperties()
  resetUserType()
  setMetaData && setMetaData( {} )
  removeDeviceManagementFromLoginJourney()
  removeRemovedDeviceNames()
  setIsQrCodeJourney( false )
}