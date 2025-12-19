import { COMMON_HEADERS } from '../constants';
import { getAuthToken } from '../localStorageHelper';
import serviceConst from './serviceConst';
import { useAxios } from './useAxios';

export const LogTrackingService = () => {
  let logTracking = {}
  const logTrackingParams = {
    url: getAuthToken() ? serviceConst.LOG_TRACKING_AUTH_USER : serviceConst.LOG_TRACKING_GUEST_USER,
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      ...( getAuthToken() && { authorization: getAuthToken() } )
    },
    data: {}
  }

  const { fetchData: logTrackingFetchData, response: logTrackingResponse, error: logTrackingError, loading: logTrackingLoading } = useAxios( logTrackingParams, true );
  logTracking = { logTrackingFetchData: ( data ) => logTrackingFetchData( { ...logTrackingParams, data: data } ), logTrackingResponse, logTrackingLoading, logTrackingError }

  return [logTracking]
}