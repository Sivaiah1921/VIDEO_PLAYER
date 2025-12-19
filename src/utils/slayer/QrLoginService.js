import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAnonymousId, getRmn, getTVDeviceId } from '../localStorageHelper';
import { COMMON_HEADERS } from '../constants';

export const QrLoginService = () => {
  let generateLoginQr = {};

  const generateLoginQrParams = {
    url: serviceConst.GENERATE_LOGIN_QR,
    method: 'GET',
    headers: {
      'platform': COMMON_HEADERS.PLATFORM,
      'deviceId': COMMON_HEADERS.DEVICE_ID,
      'anonymousId': getAnonymousId(),
      'appVersion': COMMON_HEADERS.VERSION,
      'deviceName':COMMON_HEADERS.DEVICE_NAME
    }
  }

  const { fetchData: generateQrFetchData, response: generateQrResponse, error: generateQrError, loading: generateQrLoading } = useAxios( {}, true );
  generateLoginQr = { generateQrFetchData: () => generateQrFetchData( generateLoginQrParams ), generateQrResponse, generateQrError, generateQrLoading };
  return [generateLoginQr]
}


export const LoginQrStatus = () => {
  let generateLoginQrStatus = {};

  const generateLoginQrStatusParams = ( qrCodeId ) => ( {
    url: serviceConst.GENERATE_LOGIN_QR_STATUS,
    method: 'GET',
    headers: {
      'platform': COMMON_HEADERS.PLATFORM,
      'deviceId': getTVDeviceId(),
      'appVersion': COMMON_HEADERS.VERSION,
      'qrCodeId': qrCodeId || ''
    }
  } )

  const { fetchData: generateLoginQRStatusFetchData, response: generateLoginQrStatusResponse, error: generateLoginQrStatusError, loading: generateLoginQrStatusLoading } = useAxios( {}, true );
  generateLoginQrStatus = { generateLoginQRStatusFetchData: ( qrCodeId ) => generateLoginQRStatusFetchData( generateLoginQrStatusParams( qrCodeId ) ), generateLoginQrStatusResponse, generateLoginQrStatusError, generateLoginQrStatusLoading };
  return [generateLoginQrStatus]
}

