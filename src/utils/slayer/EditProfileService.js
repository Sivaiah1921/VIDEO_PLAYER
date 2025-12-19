import { useAxios } from './useAxios';
import serviceConst from './serviceConst';
import { getAuthToken, getBaID, getDeviceToken, getDthStatus, getRmn, getSubscriberId, getTVDeviceId } from '../localStorageHelper';
const { EDIT_PROFILE_V2, EDIT_PROFILE_V3 } = serviceConst;

const EditProfileService = ( props ) => {
  let editProfileData = {};

  const { fetchData: genEditProfileFetchData, response: genEditProfileResponse, error: genEditProfileError, loading: genEditProfileLoading } = useAxios( {}, true );
  editProfileData = { genEditProfileFetchData: () => genEditProfileFetchData( genEditProfileParams ), genEditProfileResponse, genEditProfileError, genEditProfileLoading };

  editProfileData = {
    genEditProfileFetchData: ( params ) => {
      genEditProfileFetchData( {
        url:  getDthStatus() === 'DTH With Binge Old Stack' ? EDIT_PROFILE_V2 : EDIT_PROFILE_V3,
        method: 'POST',
        headers: {
          authorization: getAuthToken(),
          dthStatus: getDthStatus(),
          deviceid: getTVDeviceId(),
          deviceToken: getDeviceToken(),
          'x-authenticated-userid': getSubscriberId()
        },
        data: {
          baId: getBaID(),
          emailId: params.email,
          rmn: getRmn(),
          subscriberId: getSubscriberId(),
          subscriberName: getDthStatus() === 'DTH With Binge Old Stack' ? '' : params.fullName
        }
      } )
    }, genEditProfileResponse, genEditProfileError, genEditProfileLoading };

  return [editProfileData];

};

export default EditProfileService;