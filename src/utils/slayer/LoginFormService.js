import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAnonymousId, getRmn, getTVDeviceId } from '../localStorageHelper';
import { COMMON_HEADERS } from '../constants';
export const LoginFormService = ( props ) => {
  let genOtp = {};
  let valOtp = {};
  let licenseAgreementData = {};

  const genOTPParams = {
    url: serviceConst.GENERATE_OTP_URL,
    method: 'POST',
    headers: {
      mobileNumber: props?.inputValue,
      platform: COMMON_HEADERS.PLATFORM,
      newOtpFlow: props?.newOtpFlow,
      dsn: getTVDeviceId(),
      unlocked: false
    }
  }

  const { fetchData: genOTPFetchData, response: genOTPResponse, error: genOTPError, loading: genOTPLoading } = useAxios( {}, true );
  genOtp = { genOTPFetchData: () => genOTPFetchData( genOTPParams ), genOTPResponse, genOTPError, genOTPLoading };

  const { fetchData: valOTPFetchData, response: valOTPResponse, error: valOTPError, loading: valOTPLoading } = useAxios( {}, true );
  valOtp = {
    valOTPFetchData: ( valOTPParams ) => {
      valOTPFetchData( {
        url: serviceConst.VALIDATE_OTP_URL,
        method: 'POST',
        headers: {
          anonymousId: getAnonymousId(), // TODO - add dynamic values after guest user flow is done
          'Content-Type': COMMON_HEADERS.CONTENT,
          'platform': COMMON_HEADERS.PLATFORM,
          'unlocked': false,
          'deviceId': getTVDeviceId()
        },
        data: {
          'mobileNumber': valOTPParams.inputValue || getRmn(),
          'otp': valOTPParams.otpValue,
          'dsn': getTVDeviceId(),
          'rmn': valOTPParams.inputValue || getRmn()
        }
      } )
    }, valOTPResponse, valOTPError, valOTPLoading };

  const { fetchData: licenseAgreementFetchData, response: licenseAgreementResponse, error: licenseAgreementError, loading: licenseAgreementLoading } = useAxios( {}, true );
  licenseAgreementData = {
    licenseAgreementFetchData: ( params ) => {
      licenseAgreementFetchData( {
        url: params.configEulaUrl,
        method: 'GET'
      } )

    }, licenseAgreementResponse, licenseAgreementError, licenseAgreementLoading };

  return [genOtp, valOtp, licenseAgreementData];
}