import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAnonymousId, getAuthToken, getBeforeLoginAuthToken, getBeforeLoginDeviceToken, getDeviceToken, getDthStatus, getRmn, getSubscriberId, getTVDeviceId } from '../localStorageHelper';
import { COMMON_HEADERS, getPlatformType, getPlatformTypeForTA } from '../constants';

export const SubscriberFormService = ( props ) => {
  let deviceList = {};
  const deviceListParams = {
    url: serviceConst.DEVICE_LIST,
    method: 'GET',
    headers: {
      'authorization': getAuthToken() ? getAuthToken() : getBeforeLoginAuthToken(),
      'deviceName':COMMON_HEADERS.DEVICE_NAME,
      'subscriberId':getSubscriberId(),
      'dthStatus': getDthStatus(),
      'beforeLogin': !getAuthToken(),
      'deviceId':COMMON_HEADERS.DEVICE_ID,
      'device': getPlatformTypeForTA()
    }
  }
  const { fetchData: deviceListFetchData, response: deviceListResponse, error: deviceListError, loading: deviceListLoading } = useAxios( {}, true );
  deviceList = { deviceListFetchData: ( baId ) => deviceListFetchData( baId ? Object.assign( deviceListParams,
    {
      url: `${serviceConst.DEVICE_LIST}${baId.baId}`
    } ) : deviceListParams ), deviceListResponse, deviceListError, deviceListLoading };
  return [deviceList];
}

export const SubscriberDetailAPICall = ( ) => {
  let subscriberList = {}
  const subListParams = {
    url: serviceConst.SUBSCRIBER_LIST,
    method: 'GET',
    headers : {
      'mobileNumber':  getRmn(),
      'platform': COMMON_HEADERS.PLATFORM,
      'authorization': getAuthToken() ? getAuthToken() : getBeforeLoginAuthToken(),
      'content-type' : COMMON_HEADERS.CONTENT,
      'anonymousId': getAnonymousId(),
      'deviceType': COMMON_HEADERS.DEVICE_TYPE
    }
  }
  const { fetchData: subListFetchData, response: subListResponse, error: subListError, loading: subListLoading } = useAxios( subListParams, true );
  subscriberList = { subListFetchData: ( newcontentParams ) => {
    subListFetchData( Object.assign( subListParams, newcontentParams ) )
  }, subListResponse, subListError, subListLoading };

  return [subscriberList];
}

export const CreateUserAPICall = ( props ) => {
  let createUser = { }
  const createUserParams = {
    url: serviceConst.CREATE_USER,
    method: 'POST',
    headers: {
      'anonymousId': getAnonymousId(),
      'platform':  COMMON_HEADERS.PLATFORM,
      'deviceId': COMMON_HEADERS.DEVICE_ID,
      'deviceName': COMMON_HEADERS.DEVICE_NAME,
      'authorization': getBeforeLoginAuthToken(),
      'deviceToken': getDeviceToken()
    }
  }

  const { fetchData: createUserFetchData, response: createUserResponse, error: createUserError, loading: createUserLoading } = useAxios( createUserParams, !props );
  createUser = { createUserFetchData: ( newcreateUserParams ) => {
    createUserFetchData( Object.assign( createUserParams, { data: newcreateUserParams } ) )
  }, createUserResponse, createUserError, createUserLoading };

  return [createUser];
}

export const UpdateUserAPICall = ( props ) => {
  let updateUser = {}
  const updateUserParams = {
    url: serviceConst.UPDATE_USER,
    method: 'POST',
    headers: {
      'anonymousId': getAnonymousId(),
      'platform': getPlatformType( false ),
      'deviceId': COMMON_HEADERS.DEVICE_ID,
      'deviceName': COMMON_HEADERS.DEVICE_NAME,
      'authorization': getAuthToken() ? getAuthToken() : getBeforeLoginAuthToken(),
      'deviceToken': getDeviceToken() ? getDeviceToken() : getBeforeLoginDeviceToken(),
      'content-type': COMMON_HEADERS.CONTENT
    },
    data: props
  }

  const { fetchData: updateUserFetchData, response: updateUserResponse, error: updateUserError, loading: updateUserLoading } = useAxios( updateUserParams, true );
  updateUser = { updateUserFetchData: ( newupdateUserParams ) => {
    updateUserFetchData( Object.assign( updateUserParams, { data: newupdateUserParams } ) )
  }, updateUserResponse, updateUserError, updateUserLoading };

  return [updateUser];
}

export const formatResponse = ( subscriber, loginType = 'OTP' ) => {
  let response = {}
  if( subscriber ){
    response = {
      'dthStatus': subscriber.dthStatus,
      'login': loginType,
      'subscriberId': subscriber.subscriberId,
      'isPastBingeUser': subscriber.isPastBingeUser,
      'mobileNumber' : getRmn(),
      'eulaChecked': true,
      'packageId': '',
      'deviceId': getTVDeviceId(),
      'bingeSubscriberId': subscriber.bingeSubscriberId,
      'baId': subscriber.baId
    }
  }
  return response;
}

export const findElement = ( response, element ) => {
  let result = { }
  response.data.map( item => {
    item.accountDetailsDTOList.map( ( nestedItem ) => {
      if( nestedItem.baId === element.baId ){
        result = item
      }
    } )
  } );
  return { result }
}

export const PubnubHandling = () => {
  let pubnubHandle = {}
  const pubnubParams = {
    url: serviceConst.PUBNUB_HANDLING,
    method: 'GET',
    headers: {}
  }

  const { fetchData: pubnubFetchData, response: pubnubResponse, error: pubnubError, loading: pubnubLoading } = useAxios( pubnubParams, true );
  pubnubHandle = { pubnubFetchData: ( params ) => {
    pubnubFetchData( Object.assign( pubnubParams, { headers: params } ) )
  }, pubnubResponse, pubnubError, pubnubLoading };

  return [pubnubHandle];
}


export const PubNubWrapperService = () => { // pubsub Reload Data of Msgs
  let pubNubDetail = {};

  const { fetchData: pubNubDetailFetchData, response: pubNubDetailResponse, error: pubNubDetailError, loading: pubNubDetailLoading } = useAxios( {}, true );

  pubNubDetail = { pubNubDetailFetchData: ( params ) => {
    const pubNubDetailParams = {
      url: serviceConst.PUBNUB_WRAPPER,
      method: 'GET',
      headers: {
        'Authorization': getAuthToken(), // Dynamically fetched
        'sid': getSubscriberId(),
        'dthStatus': getDthStatus(),
        ...params
      }
    };
    pubNubDetailFetchData( pubNubDetailParams );
  },
  pubNubDetailResponse,
  pubNubDetailError,
  pubNubDetailLoading
  };

  return [pubNubDetail];
};

// export const CentrifugeTokenGenarator = () => { // pubsub switching here
//   let centrifugeTokenGenarator = {}
//   const centrifugeTokenParams = {
//     url: serviceConst.CENTRIFUGO_TOKEN_GENARATOR,
//     method: 'POST',
//     headers: {
//       'anonymousId': getAnonymousId(),
//       'platform': getPlatformType( false ),
//       'deviceToken': getDeviceToken() ? getDeviceToken() : getBeforeLoginDeviceToken(),
//       'content-type': COMMON_HEADERS.CONTENT,
//       'u_id':'demo-user-1',
//       'channel_name':'TestMJ',
//       'expiry':72000,
//       'x-admin-key':'BuDoopH5bZGrFwTDaECI5Jq5GvkQsMad'
//     }
//   }

//   const { fetchData: centrifugeTokenAPI, response: centrifugeTokenResponse, error: centrifugeTokenError, loading: centrifugeTokenLoading } = useAxios( centrifugeTokenParams, false );

//   centrifugeTokenGenarator = { centrifugeTokenAPI: ( ) => {
//     centrifugeTokenAPI( centrifugeTokenParams )
//   }, centrifugeTokenResponse, centrifugeTokenError, centrifugeTokenLoading };

//   return [centrifugeTokenGenarator];
// }

export const CentrifugeTokenGenarator = () => {
  const centrifugeTokenParams = {
    url: serviceConst.CENTRIFUGO_TOKEN_GENARATOR,
    method: 'POST',
    headers: {
      anonymousId: getAnonymousId(),
      platform: getPlatformType( false ),
      deviceToken: getDeviceToken() || getBeforeLoginDeviceToken(),
      'content-type': COMMON_HEADERS.CONTENT,
      u_id: 'demo-user-1',
      channel_name: 'TestMJ',
      expiry: 72000,
      'x-admin-key': 'BuDoopH5bZGrFwTDaECI5Jq5GvkQsMad'
    }
  };

  const {
    fetchData,
    response: centrifugeTokenResponse,
    error: centrifugeTokenError,
    loading: centrifugeTokenLoading
  } = useAxios( centrifugeTokenParams, true );

  const fetchCentrifugeToken = async() => {
    const result = await fetchData( centrifugeTokenParams );
    return result?.data || result || centrifugeTokenResponse;
  };

  return [{
    fetchCentrifugeToken,
    centrifugeTokenResponse,
    centrifugeTokenError,
    centrifugeTokenLoading
  }];
};

