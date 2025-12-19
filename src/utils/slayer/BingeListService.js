/* eslint-disable no-console */
import { COMMON_HEADERS } from '../constants';
import { getAuthToken, getBaID, getBingeProduct, getDthStatus, getProfileId, getReferenceID, getSubscriberId } from '../localStorageHelper';
import { getContentIdByType, splitByDash } from '../util';
import serviceConst from './serviceConst'
import { useAxios } from './useAxios';

export const BingeListContentCall = ( props ) => {
  let bingeListData = {}
  const getAllBingeListContent = {
    url: serviceConst.BINGE_LIST_SERVICE,
    method: 'GET',
    params: {
      'subscriberId': getSubscriberId(),
      'profileId': getProfileId(),
      'pagingState': props.pagingState
    },
    headers:{
      authorization: getAuthToken(),
      'subscriberId': getSubscriberId(),
      platform: COMMON_HEADERS.PLATFORM,
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  }
  const { fetchData: bingeListFetchData, response: bingeListResponse, error: bingeListError, loading: bingeListLoading } = useAxios( {}, true );
  bingeListData = { bingeListFetchData: ( params ) => bingeListFetchData( Object.assign( getAllBingeListContent, params ) ), bingeListResponse, bingeListError, bingeListLoading };

  return [bingeListData]
}

export const AddToBingListCall = ( props ) => {
  let addRemoveBingeList = {};
  let addOrRemoveToBingeListParams
  if( props?.provider === 'Tatasky' ){
    addOrRemoveToBingeListParams = {
      url:  serviceConst.ADD_REMOVE_BINGELIST_TATAPLAY,
      method: 'POST',
      data: {
        'subscriberId': getSubscriberId(),
        'profileId': getProfileId(),
        'contentId': props?.id,
        'contentType': props?.type
      },
      headers:{
        authorization: getAuthToken(),
        dthStatus: getDthStatus(),
        'profileId': getProfileId(),
        'platform': COMMON_HEADERS.PLATFORM,
        deviceType: COMMON_HEADERS.DEVICE_TYPE
      }
    }
  }
  else {
    addOrRemoveToBingeListParams = {
      url:  serviceConst.ADD_REMOVE_BINGELIST,
      method: 'GET',
      params: {
        'subscriberId': getSubscriberId(),
        'profileId': getProfileId(),
        'contentId': props?.id,
        'contentType': props?.type
      },
      headers:{
        authorization: getAuthToken(),
        dthStatus: getDthStatus(),
        'profileId': getProfileId(),
        'platform': COMMON_HEADERS.PLATFORM,
        referenceId: getReferenceID(),
        deviceType: COMMON_HEADERS.DEVICE_TYPE
      }
    }
  }
  const { fetchData: addRemoveBingeListFetchData, response: addRemoveBingeListResponse, error: addRemoveBingeListError, loading: addRemoveBingeListLoading } = useAxios( addOrRemoveToBingeListParams, true );
  addRemoveBingeList = { addRemoveBingeListFetchData: () => addRemoveBingeListFetchData( addOrRemoveToBingeListParams ), addRemoveBingeListResponse, addRemoveBingeListError, addRemoveBingeListLoading };
  return [addRemoveBingeList]
}

export const BulkRemoveBingeListCall = ( props ) => {
  let bulkRemoveBingeListData = {}
  const removeBingeListContent = {
    url: serviceConst.BULK_REMOVE,
    method: 'POST',
    data: {
      'contentIdAndType': props?.contentIdAndType,
      'subscriberId': getSubscriberId(),
      'profileId': getProfileId()
    },
    headers:{
      authorization: getAuthToken(),
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      profileId: getProfileId(),
      subscriberid: getSubscriberId(),
      referenceId: getReferenceID()
    }
  }
  const { fetchData: bulkRemoveFetchData, response: bulkRemoveResponse, error: bulkRemoveError, loading: bulkRemoveLoading } = useAxios( {}, true );
  bulkRemoveBingeListData = { bulkRemoveFetchData: () => bulkRemoveFetchData( removeBingeListContent ), bulkRemoveResponse, bulkRemoveError, bulkRemoveLoading };

  return [bulkRemoveBingeListData];
}

export const AddtoFavLA = ( props ) => {
  const type = splitByDash( props.taShowType ) || props.type
  const id = getContentIdByType( props )

  let AddtoFavLA = {}
  const params = {
    url: serviceConst.LA_BINGE_LIST + '/' + type + '/' + id + '/VOD',
    method: 'POST',
    params: {
      refUsecase: props.refUsecase,
      platform:  COMMON_HEADERS.RECO_PLATFORM
    },
    headers:{
      provider: props.provider,
      dthStatus: getDthStatus(),
      bingeproduct: getBingeProduct(),
      profileid: getProfileId(),
      baid:  getBaID(),
      authorization: getAuthToken(),
      subscriberid:  getSubscriberId(),
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      contentType: COMMON_HEADERS.CONTENT,
      hasSeriesID: true
    },
    data: {}
  }

  const { fetchData: addLearnAction, response: learnActionResponse, error: learnActionError, loading: learnActionLoading } = useAxios( {}, true );
  AddtoFavLA = { addLearnAction: () => addLearnAction( params ), learnActionResponse, learnActionError, learnActionLoading };

  return [AddtoFavLA];
}
