import React, { useEffect } from 'react';
import { useAxios } from './useAxios';
import serviceConst from './serviceConst';
import { getAuthToken, getBaID, getDthStatus, getSubscriberId, getDeviceToken } from '../localStorageHelper';
import constants, { COMMON_HEADERS, USERS } from '../constants';
import MIXPANELCONFIG from '../mixpanelConfig';
const { GET_PROFILE, GET_BALANCE, LOGOUT_URL } = serviceConst;

export const ProfileAPICall = ( ) => {
  let profileData = {};
  const profileParams = {
    url: GET_PROFILE + '/' + getBaID(),
    method: 'GET',
    headers: {
      dthStatus: getDthStatus(),
      authorization: getAuthToken(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      subscriberId: getSubscriberId()
    }
  }
  const { fetchData: fetchProfile, response: profileResponse, error: profileError, loading: profileLoading } = useAxios( profileParams, true )
  profileData = { fetchProfile: ( newParams ) => {
    fetchProfile( profileParams )
  }, profileResponse, profileError, profileLoading };

  return [profileData];

};

export const BalanceAPICall = ( ) => {
  let balanceData = {};
  const balanceParams = {
    url: GET_BALANCE,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      dthStatus: getDthStatus(),
      subscriberId: getSubscriberId()
    },
    data: {
      'baId': getBaID()
    }
  }
  const { fetchData: fetchBalance, response: balanceResponse, error: balanceeError, loading: balanceLoading } = useAxios( balanceParams, true )
  balanceData = { fetchBalance: ( newParams ) => {
    fetchBalance( Object.assign( balanceParams, { data: newParams } ) )
  }, balanceResponse, balanceeError, balanceLoading };

  return [balanceData];

};

export const LogoutAPICall = ( ) => {
  let logout = {};
  const logoutParams = {
    url: `${LOGOUT_URL}/${getBaID()}`,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      dthStatus: getDthStatus(),
      deviceid: COMMON_HEADERS.DEVICE_ID,
      devicetoken: getDeviceToken(),
      dthstatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      subscriberid: getSubscriberId(),
      baId: getBaID()
    }
  }
  const { fetchData: fetchLogout, response: logoutResponse, error: logoutError, loading: logoutLoading } = useAxios( {}, true )
  logout = { fetchLogout: () => fetchLogout( logoutParams ), logoutResponse, logoutError, logoutLoading };

  return [logout];

};


export const myAccountRail = [{
  title: 'Parental PIN',
  iconName: constants.PARENTALPIN_SETUP.ICON,
  url: '#',
  textStyle: 'autoPlay-subtitle',
  subMenuOption: 'SUBMENU-PARENTALCONTROL'
}, {
  title: 'Video Language',
  iconName: 'ContentLanguage',
  url: '#',
  textStyle: 'autoPlay-subtitle',
  subMenuOption: 'SUBMENU-VIDEOLANGUAGE'
},
{
  title: 'Transaction History',
  iconName: constants.TRANSACTION_HISTORY_PAGE.ICON,
  url: '#',
  textStyle: 'account-cards-text',
  subMenuOption: 'SUBMENU-TRANSACTION-HISTORY'
}, {
  title: 'Contact Us',
  iconName: 'Contact',
  url: '#',
  textStyle: 'autoPlay-subtitle'
},
{
  title: 'Autoplay Trailers',
  iconName: 'AutoplayTrailer',
  url: '#',
  textStyle: 'autoPlay-subtitle'
}, {
  title: 'Device Management',
  iconName: 'DeviceManagement',
  url: '#',
  textStyle: 'account-cards-text',
  subMenuOption: 'SUBMENU-MANAGEDEVICES'
}, {
  title: 'Log Out',
  iconName: 'Logout36x36',
  url: '#',
  textStyle: 'autoPlay-subtitle',
  subMenuOption: 'SUBMENU-LOGOUT'
}];


export const RechargeAPICall = ( ) => {
  let recharge = {};
  const rechargeParams = {
    url: serviceConst.RECHARGE_URL,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      sid: getSubscriberId(),
      'Content-Type': COMMON_HEADERS.PLATFORM,
      baId: getBaID(),
      dthStatus: getDthStatus(),
      source: MIXPANELCONFIG.VALUE.HAMBURGER
    }
  }
  const { fetchData: fetchRechargeQr, response: rechargeResponse, error: rechargeError, loading: rechargeLoading } = useAxios( {}, true )
  recharge = { fetchRechargeQr: () => fetchRechargeQr( rechargeParams ), rechargeResponse, rechargeError, rechargeLoading };

  return [recharge];

};

export const RefreshAPICall = () => {
  let refreshAccount = {};
  const params = {
    url:  serviceConst.REFRESH_ACCOUNT,
    method: 'POST',
    headers: {
      authorization: getAuthToken(),
      baId: getBaID(),
      'Content-Type': COMMON_HEADERS.CONTENT,
      dthStatus: getDthStatus()
    },
    data:{}
  }

  if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
    params.data = {
      'sid': getSubscriberId(),
      'dsn': getBaID(),
      'isThirdPartyForceUpdate':false,
      'isUpdateEntitlements':false
    }
  }
  const { fetchData: fetchRefreshAccount, response: refreshAccountResponse, error: refreshAccountError, loading: refreshAccountLoading } = useAxios( {}, true )
  refreshAccount = { fetchRefreshAccount: () => fetchRefreshAccount( params ), refreshAccountResponse, refreshAccountError, refreshAccountLoading };

  return [refreshAccount];
}