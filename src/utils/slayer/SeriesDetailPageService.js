import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { COMMON_HEADERS } from '../constants';

export const SeriesDetailPageService = ( props ) => {

  let searchData = {};

  const searchParams = {
    url: serviceConst.SEARCH_DATA_URL,
    method: 'POST',
    headers: {
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    },
    data : {
      queryString: props?.inputValue,
      id: props?.id,
      parentType: props?.type,
      pageNumber: 1
    }
  }

  const { fetchData: searchFetchData, response: searchResponse, error: searchError, loading: searchLoading } = useAxios( {}, true );
  searchData = { searchFetchData: ( props ) => {
    const newParams = { ...searchParams, data: props }
    searchFetchData( newParams )
  }, searchResponse, searchError, searchLoading };

  return [searchData];
}