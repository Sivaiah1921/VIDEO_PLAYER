import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { COMMON_HEADERS } from '../constants';
import { getAuthToken, getDeviceInfo, getProfileId, getSubscriberId, getTVDeviceId } from '../localStorageHelper';

export const AppContextService = () => {
  const { TSMORE_CONFIG } = serviceConst;
  let config = {};
  const configParams = {
    url: TSMORE_CONFIG,
    method: 'GET'
  }

  const { fetchData: getConfig, response: configResponse, error: configError, loading: configLoading } = useAxios( configParams, true );
  config = { getConfig: () => getConfig( configParams ), configResponse, configError, configLoading };

  return [config];
}


export const RegisterUserCall = ( ) => {
  let registerUser = {}
  const registerUserParams = {
    url: serviceConst.REGISTER_USER,
    method: 'POST',
    headers : {
      deviceId: getTVDeviceId()
    }
  }
  const { fetchData: fetchRegisterUser, response: registerUserResponse, error: registerUserError, loading: registerUserLoading } = useAxios( registerUserParams, true );
  registerUser = { fetchRegisterUser: ( ) => {
    fetchRegisterUser( Object.assign( registerUserParams ) )
  }, registerUserResponse, registerUserError, registerUserLoading };


  return [registerUser]
}

export const GetScreenSaver = () => {
  let screensaverData = {}
  const getScreenSaverContent = {
    url: serviceConst.SCRREN_SAVER_URL,
    method: 'GET',
    headers:{
      rule: COMMON_HEADERS.RULE,
      platform: COMMON_HEADERS.PLATFORM,
      device_details: JSON.stringify( getDeviceInfo() ),
      locale: COMMON_HEADERS.LOCALE,
      profileId: getProfileId(),
      ...( getSubscriberId() && { cl_subscriberid : getSubscriberId() } ),
      ...( getSubscriberId() && { subscriberid : getSubscriberId() } ),
      ...( getAuthToken() && { authorization : getAuthToken() } )
    }
  }
  const { fetchData: screenSaverFetchData, response: screenSaverResponse, error: screenSaverError, loading: screenSaverLoading } = useAxios( {}, true );
  screensaverData = { screenSaverFetchData: () => screenSaverFetchData( getScreenSaverContent ), screenSaverResponse, screenSaverError, screenSaverLoading };

  return [screensaverData]
}