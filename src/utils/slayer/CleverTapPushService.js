/* eslint-disable no-console */
import { COMMON_HEADERS, getPlatformType } from '../constants';
import { getAuthToken, getBaID, getDthStatus, getRmn, getSubscriberId, getTVDeviceId } from '../localStorageHelper';
import serviceConst from './serviceConst';
import { useAxios } from './useAxios';
import axios from 'axios';

export const CleverTapPushService = async( event, dataObj ) => {
  const cleverTapPushParams = {
    url: process.env.REACT_APP_APIPATH + '/' + ( getAuthToken() ? serviceConst.CLEVER_PUSH_AUTH_PUSH : serviceConst.CLEVER_PUSH_GUEST_USER ),
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      dthStatus: getDthStatus() || '',
      ...( getAuthToken() && {
        authorization: getAuthToken()
      } ),
      eventType: event,
      appVersion: COMMON_HEADERS.VERSION,
      platform: getPlatformType()
    },
    data: {}
  }

  const cleverTapPushData = {}
  const updatedData = {
    eventType: event,
    platform: getPlatformType(),
    dthStatus: getDthStatus() || '',
    rmn: getRmn() || '',
    sid: getSubscriberId() || '',
    baId: getBaID() || '',
    deviceId: getTVDeviceId() || '',
    ...dataObj
  }
  await axios.post( cleverTapPushParams.url, { userEvent: updatedData }, { headers: cleverTapPushParams.headers } )
    .then( res => {
      cleverTapPushData.response = res
    } )
    .catch( error => {
      cleverTapPushData.error = error
    } )
  return cleverTapPushData;
}