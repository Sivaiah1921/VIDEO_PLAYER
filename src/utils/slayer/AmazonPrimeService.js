import { COMMON_HEADERS, USERS } from '../constants';
import { getAuthToken, getBingeSubscriberId, getDthStatus, getSubscriberId, getTVDeviceId, getReferenceID } from '../localStorageHelper';
import serviceConst from './serviceConst';
import { useAxios } from './useAxios';

export const PrimeNudgeService = () => {
  let primeNudge = {}
  const primeNudgeParams = {
    url: serviceConst.PRIME_NUDGE,
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      authorization: getAuthToken()
    },
    data: {}
  }

  const { fetchData: primeNudgeFetchData, response: primeNudgeResponse, error: primeNudgeError, loading: primeNudgeLoading } = useAxios( primeNudgeParams, true );
  primeNudge = { primeNudgeFetchData: ( params ) => primeNudgeFetchData( { ...primeNudgeParams, ...Object.assign( primeNudgeParams.data, params ) } ), primeNudgeResponse, primeNudgeLoading, primeNudgeError }


  return [primeNudge]
}

export const AppleAndPrimeService = () => {
  let entitlementStatus = {}
  const applePrimeParams = {
    url: serviceConst.APPLE_PRIME_ENTITLEMENT_STATUS_URL,
    method: 'GET',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      authorization: getAuthToken(),
      platform: COMMON_HEADERS.PLATFORM,
      ...( getDthStatus() !== USERS.DTH_OLD_STACK_USER && { accountId: getBingeSubscriberId() } ),
      subscriberId: getSubscriberId(),
      deviceId: getTVDeviceId(),
      referenceId: getReferenceID(),
      primePrimaryIdentity: '',
      partners:''
    }
  }

  const { fetchData: entitlementStatusFetchData, response: entitlementStatusResponse, error: entitlementStatusError, loading: entitlementStatusLoading } = useAxios( applePrimeParams, true );
  entitlementStatus = { entitlementStatusFetchData: ( params ) => entitlementStatusFetchData( { ...applePrimeParams, ...Object.assign( applePrimeParams.headers, params ) } ), entitlementStatusResponse, entitlementStatusLoading, entitlementStatusError }

  return [entitlementStatus]
}

export const AppleActivationRedemCode = ( skip ) => {
  let appleActivationCodeRedemption = {}
  const appleParams = {
    url: serviceConst.APPLE_ACTIVATION_URL,
    method: 'GET',
    params : {
      'referenceId': getReferenceID(),
      'platform':COMMON_HEADERS.PLATFORM
    },
    headers: {
      sid: getSubscriberId(),
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      'content-type': COMMON_HEADERS.CONTENT,
      'viaPopUp': '',
      'activationSource':'',
      'interstitialPage': COMMON_HEADERS.YES
    }
  }
  const { fetchData: appleFetchData, response: appleResponse, error: appleError, loading: appleLoading } = useAxios( appleParams, skip )
  appleActivationCodeRedemption = { appleFetchData: ( params ) => appleFetchData( { ...appleParams, ...Object.assign( appleParams.headers, params ) } ), appleRedemptionResponse: appleResponse, appleRedemptionError: appleError, appleRedemptionLoading: appleLoading };
  return [appleActivationCodeRedemption]
}

export const PrimeAccountRecoveryService = () => {
  let primeAccountRecovery = {}
  const primeAccountRecoveryParams = {
    url: serviceConst.PRIME_ACCOUNT_RECOVERY_URL,
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      authorization: getAuthToken()
    },
    data: {
      subscriberId: getSubscriberId()
    }
  }

  const { fetchData: primeAccountRecoveryFetchData, response: primeAccountRecoveryResponse, error: primeAccountRecoveryError, loading: primeAccountRecoveryLoading } = useAxios( primeAccountRecoveryParams, true );
  primeAccountRecovery = { primeAccountRecoveryFetchData: ( params ) => primeAccountRecoveryFetchData( { ...primeAccountRecoveryParams, ...Object.assign( primeAccountRecoveryParams.data, params ) } ), primeAccountRecoveryResponse, primeAccountRecoveryLoading, primeAccountRecoveryError }

  return [primeAccountRecovery]
}

export const PrimeFetchRecoveryService = () => {
  let primeFetchRecovery = {}
  const primeFetchRecoveryParams = {
    url: serviceConst.PRIME_FETCH_RECOVERY_URL,
    method: 'GET',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      authorization: getAuthToken(),
      platform: COMMON_HEADERS.PLATFORM,
      ...( getDthStatus() !== USERS.DTH_OLD_STACK_USER && { accountId: getBingeSubscriberId() } ),
      subscriberId: getSubscriberId(),
      deviceId: getTVDeviceId()
    }
  }

  const { fetchData: primeFetchRecoveryFetchData, response: primeFetchRecoveryResponse, error: primeFetchRecoveryError, loading: primeFetchRecoveryLoading } = useAxios( primeFetchRecoveryParams, true );
  primeFetchRecovery = { primeFetchRecoveryFetchData: ( params ) => primeFetchRecoveryFetchData( { ...primeFetchRecoveryParams, ...Object.assign( primeFetchRecoveryParams.headers, params ) } ),
    primeFetchRecoveryResponse, primeFetchRecoveryLoading, primeFetchRecoveryError }
  return [primeFetchRecovery]
}
