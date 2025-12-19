import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAuthToken, getBaID, getBeforeLoginAuthToken, getDthStatus, getSubscriberId } from '../localStorageHelper';
import { COMMON_HEADERS } from '../constants';
import { useMemo } from 'react';

export const DeviceManagementService = ( props ) => {
  let removeDevice = {};
  let renameDevice = {};

  const { fetchData: remDevFetchData, response: remDevResponse, error: remDevError, loading: remDevLoading } = useAxios( {}, true );
  removeDevice = {
    remDevFetchData: ( deviceIds ) => {
      const updatedParams = {
        url: serviceConst.REMOVE_DEVICE,
        method: 'DELETE',
        headers: {
          'x-authenticated-userid': getSubscriberId(),
          'authorization': getAuthToken() ? getAuthToken() : getBeforeLoginAuthToken(),
          dthStatus: getDthStatus(),
          platform: COMMON_HEADERS.PLATFORM,
          beforeLogin: !getAuthToken()
        },
        data: {
          baId: getBaID(),
          deviceIds: deviceIds.join( ',' )
        }
      }
      return remDevFetchData( updatedParams );
    },
    remDevResponse, remDevError, remDevLoading
  };


  const { fetchData: renameDevFetchData, response: renameDevResponse, error: renameDevError, loading: renameDevLoading } = useAxios( {}, true );
  renameDevice = { renameDevFetchData: () => renameDevFetchData( genEditProfileParams ), renameDevResponse, renameDevError, renameDevLoading };

  renameDevice = {
    renameDevFetchData: ( params ) => {
      renameDevFetchData( {
        url: serviceConst.RENAME_DEVICE,
        method: 'POST',
        headers: {
          'authorization': getAuthToken()
        },
        data: {
          'deviceName': params?.value,
          'deviceUniqueNumber': params?.deviceNumber,
          'subscriberId': params?.subscriberId,
          'subscriptionId' : params?.baId
        }
      } )
    }, renameDevResponse, renameDevError, renameDevLoading };

  return [removeDevice, renameDevice];
}

export const DeviceLastActivityService = () => {
  const authToken = getAuthToken();
  const baId = getBaID();
  const subscriberId = getSubscriberId();
  const dthStatus = getDthStatus();

  const deviceLastActivityParams = useMemo( () => ( {
    url: `${serviceConst.DEVICE_LAST_ACTIVITY}${baId}/${COMMON_HEADERS.DEVICE_ID}`,
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      dthStatus: dthStatus,
      authorization: authToken,
      subscriberId: subscriberId,
      platform: COMMON_HEADERS.PLATFORM
    },
    data: {}
  } ), [authToken, baId, subscriberId, dthStatus] ); // dependency array added to avoid unnecessary re-renders

  const {
    fetchData: deviceLastActivityFetchData,
    response: deviceLastActivityResponse,
    error: deviceLastActivityError,
    loading: deviceLastActivityLoading
  } = useAxios( {}, true );

  const deviceLastActivity = useMemo( () => ( {
    deviceLastActivityFetchData: () => deviceLastActivityFetchData( deviceLastActivityParams ),
    deviceLastActivityResponse,
    deviceLastActivityLoading,
    deviceLastActivityError
  } ), [deviceLastActivityFetchData, deviceLastActivityResponse, deviceLastActivityLoading, deviceLastActivityError, deviceLastActivityParams] );

  return [deviceLastActivity];
}
