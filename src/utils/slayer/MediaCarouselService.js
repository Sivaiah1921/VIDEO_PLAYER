
import { serviceConst } from './serviceConst';
import constants, {
  COMMON_HEADERS,
  PAGE_TYPE,
  PACKS,
  ABMainFeature
} from '../../utils/constants';
import { getAnonymousId, getAuthToken, getProfileId, getDthStatus, getBaID, getSubscriberId, getBingeProduct, getUserSelectedApps, getSelectedPartner } from '../localStorageHelper';
import axios from 'axios';
import { ensureTrailingSlash, getABTestingFeatureConfig } from '../util';
import { experiment_started, recco_initiated } from '../mixpanel/mixpanelService';

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

export const MediaCarouselService = async( placeHolder, layoutType, appName ) => {
  const authToken = getAuthToken();
  const isGuest = !authToken;
  const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
  const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
  const url = isGuest ?
    ( ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) : serviceConst.TA_RECOMMENDATION_GUEST_URL ) + placeHolder ) :
    ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) : serviceConst.TA_RECOMMENDATION_URL ) + placeHolder;
  if( authToken ){
    experiment_started()
  }
  recco_initiated()
  const headers = {
    ...( isGuest && { anonymousId: getAnonymousId() } ),
    profileId: getProfileId(),
    dthstatus: getDthStatus() || PACKS.GUEST,
    platform: COMMON_HEADERS.RECO_PLATFORM,
    ...( getBaID() && { baid: getBaID() } ),
    ...( getSubscriberId() && { subscriberid: getSubscriberId() } ),
    pagetype: PAGE_TYPE.DONGLE_HOMEPAGE,
    deviceType: COMMON_HEADERS.DEVICE_TYPE,
    ...( authToken && {
      authorization: authToken,
      bingeproduct: getBingeProduct(),
      ...( getUserSelectedApps() ?
        { ticktick: true, partners: getUserSelectedApps() } :
        { ticktick: false } )
    } ),
    appVersion: COMMON_HEADERS.VERSION,
    appName: placeHolder?.includes( constants.UC_BEST_OF_PARTNER ) ? getSelectedPartner() : appName
  };

  const params = {
    layout: layoutType,
    max: 30
  };

  try {
    const response = await api.request( {
      url,
      method: 'POST',
      params,
      headers
    } );
    return response;
  }
  catch ( error ){
    // eslint-disable-next-line no-console
    console.error( 'MediaCarouselService error:', error );
    throw error;
  }
};
