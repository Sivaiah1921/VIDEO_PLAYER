import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { COMMON_HEADERS } from '../constants';
import { getAnonymousId } from '../localStorageHelper';

export const PreviouslyUsedLoginPaneService = ( props ) => {
  let prevUsedRMN = {};

  const prevRMNParams = {
    url: serviceConst.PREVIOUSLY_USED_RMN,
    method: 'GET',
    headers: {
      deviceId: COMMON_HEADERS.DEVICE_ID,
      anonymousId: getAnonymousId()
    }
  }

  const { fetchData: prevRMNFetchData, response: prevRMNResponse, error: prevRMNError, loading: prevRMNLoading } = useAxios( {}, true );
  prevUsedRMN = { prevRMNFetchData: () => prevRMNFetchData( prevRMNParams ), prevRMNResponse, prevRMNError, prevRMNLoading };

  return [prevUsedRMN];

}