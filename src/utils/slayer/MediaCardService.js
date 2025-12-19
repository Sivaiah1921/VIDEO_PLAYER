import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAuthToken, getProfileId, getSubscriberId } from '../localStorageHelper';

export const MediaCardService = ( props ) => {
  let addText = {};

  const { fetchData: addTextFetchData, response: addTextResponse, error: addTextError, loading: addTextLoading } = useAxios( {}, true );
  addText = {
    addTextFetchData: ( addTextParams ) => {
      addTextFetchData( {
        url: serviceConst.ADD_SEARCH,
        method: 'POST',
        headers: {
          'x-authenticated-userid': getSubscriberId(),
          'authorization': getAuthToken()
        },
        data: {
          'subscriberId':getSubscriberId(),
          'profileId': getProfileId(),
          'searchText': addTextParams.searchText
        }
      } )
    }, addTextResponse, addTextError, addTextLoading };

  return [addText];
}