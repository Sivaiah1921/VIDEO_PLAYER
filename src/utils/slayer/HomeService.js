/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { COMMON_HEADERS, LAYOUT_TYPE, PAGE_TYPE, PAGE_NAME, CUSTOM_PAGE_TYPE, PACKS, ABMainFeature, getPlatformType } from '../constants';
import { getAuthToken, getSubscriberId, getProfileId, getDeviceInfo, getRmn, getAnonymousId, getUserSelectedApps, getBaID, getDthStatus, getSideListData, getBingeProduct, getTVDeviceId, getUserInfo } from '../localStorageHelper';
import { useNavigationContext } from '../../views/core/NavigationContextProvider/NavigationContextProvider';
import { useHomeContext } from '../../views/core/HomePageContextProvider/HomePageContextProvider';
import { useMemo, useCallback } from 'react';
import { ensureTrailingSlash, getABTestingFeatureConfig } from '../util';

export const HomeService = ( props ) => {
  const previousPathName = useNavigationContext();
  const pageType = useMemo( () => (
    !!previousPathName.discoverToHome ?
      PAGE_TYPE.DONGLE_HOMEPAGE :
      props.pageType || PAGE_TYPE.DONGLE_HOMEPAGE
  ), [previousPathName, props.pageType] );

  const homeUrl = useMemo( () => {
    const baseUrl = getUserSelectedApps() ?
      serviceConst.HOME_TICKTICK_URL :
      serviceConst.HOME_URL;
    return baseUrl.replace( '$pageType', pageType );
  }, [pageType] );

  const homeParams = useMemo( () => ( {
    url: homeUrl,
    method: 'GET',
    headers: {
      'platform': COMMON_HEADERS.PLATFORM,
      'rule': COMMON_HEADERS.RULE,
      filterLiveSeeAll: true,
      device_details: JSON.stringify( getDeviceInfo() ),
      locale: COMMON_HEADERS.LOCALE,
      profileId: getProfileId(),
      ...( getSubscriberId() && {
        subscriberid: getSubscriberId(),
        cl_subscriberid: getSubscriberId()
      } ),
      ...( getAuthToken() && {
        authorization: getAuthToken()
      } ),
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    },
    params: { ...props.pageData }
  } ), [homeUrl, props.pageData] );

  const {
    fetchData,
    response,
    error,
    loading
  } = useAxios( homeParams, props.skip );

  const {
    fetchData: custFetchData,
    response: custResponse,
    error: custError,
    loading: custLoading
  } = useAxios( {}, true );

  const updateHomeData = useCallback( ( newHomeParams ) => {
    fetchData( { ...homeParams, ...newHomeParams } );
  }, [fetchData, homeParams] );

  const tvodParams = useMemo( () => ( {
    url: `${serviceConst.TVOD}/${getSubscriberId()}`,
    method: 'GET',
    params: {
      layoutType: LAYOUT_TYPE.PORTRAIT
    },
    headers: {
      authorization: getAuthToken()
    }
  } ), [] );

  const tvodFetchData = useCallback( () => {
    custFetchData( tvodParams );
  }, [custFetchData, tvodParams] );

  const data = useMemo( () => ( {
    fetchData: updateHomeData,
    response,
    error,
    loading
  } ), [updateHomeData, response, error, loading] );

  const tvodData = useMemo( () => ( {
    tvodFetchData,
    tvodResponse: custResponse,
    tvodError: custError,
    tvodLoading: custLoading
  } ), [tvodFetchData, custResponse, custError, custLoading] );

  return [data, tvodData];
};


export const filterPrimaryMenu = ( menuItems, currentPlan ) => {
  const authToken = getAuthToken();
  const bLoggedIn = !!authToken;

  // Prepare list to prepend, if needed
  const prependedItems = [];

  if( !bLoggedIn ){
    prependedItems.push( {
      platform: 'LG',
      pageName: 'Login',
      pageType: PAGE_TYPE.LOGIN,
      skipDiscover: true
    } );
  }

  if( !currentPlan ){
    prependedItems.push( {
      platform: 'LG',
      pageName: 'Subscribe',
      pageType: PAGE_TYPE.CURRENT_SUBSCRIPTION,
      skipDiscover: true
    } );
  }

  // Merge prependedItems with the original menuItems
  const updatedMenu = [...prependedItems, ...menuItems];

  // Define map for quick lookup of custom category by pageType or pageName
  const customCategoryMap = new Map();
  const customCategories = [
    {
      pageName: 'Categories',
      pageType: PAGE_TYPE.OTHER_CATEGORIES,
      customPageType: CUSTOM_PAGE_TYPE.DONGLE_CATEGORIES
    },
    {
      pageName: 'Search',
      pageType: PAGE_TYPE.SEARCH,
      customPageType: CUSTOM_PAGE_TYPE.DONGLE_SEARCH
    },
    {
      pageName: PAGE_NAME.ACCOUNT,
      pageType: bLoggedIn ? PAGE_TYPE.ACCOUNT : PAGE_TYPE.ACCOUNT_LOGIN,
      customPageType: CUSTOM_PAGE_TYPE.DONGLE_ACCOUNTS
    },
    {
      pageName: 'Binge List',
      pageType: PAGE_TYPE.BINGE_LIST,
      customPageType: CUSTOM_PAGE_TYPE.DONGLE_WATCHLIST
    }
  ];

  customCategories.forEach( cat => {
    customCategoryMap.set( cat.customPageType, cat );
    customCategoryMap.set( cat.pageName, cat );
  } );

  // Enhance menu items with custom category data
  updatedMenu.forEach( item => {
    const match = customCategoryMap.get( item.pageType ) || customCategoryMap.get( item.pageName );
    if( match ){
      item.pageType = match.pageType;
      item.skipDiscover = true;
    }
  } );

  // Deduplicate by `pageName`
  const seen = new Set();
  const dedupedMenu = updatedMenu.filter( item => {
    if( seen.has( item.pageName ) ){
      return false;
    }
    seen.add( item.pageName );
    return true;
  } );

  return dedupedMenu;
};


export const filterSecondaryMenu = ( menuItems ) => {
  const bLoggedIn = !!getAuthToken();

  const customCategories = [
    {
      pageName: 'Categories',
      pageType: PAGE_TYPE.OTHER_CATEGORIES
    },
    {
      pageName: 'Search',
      pageType: PAGE_TYPE.SEARCH
    },
    {
      pageName: PAGE_NAME.ACCOUNT,
      pageType: bLoggedIn ? PAGE_TYPE.ACCOUNT : PAGE_TYPE.ACCOUNT_LOGIN
    },
    {
      pageName: 'Binge List',
      pageType: PAGE_TYPE.BINGE_LIST
    }
  ];

  // Create a map for fast lookup by pageName
  const categoryMap = new Map( customCategories.map( cat => [cat.pageName, cat] ) );

  menuItems.forEach( item => {
    const match = categoryMap.get( item.pageName );
    if( match ){
      item.pageType = match.pageType;
      item.skipDiscover = true;
    }
  } );

  // Deduplicate by pageName
  const seen = new Set();
  const dedupedMenu = menuItems.filter( item => {
    if( seen.has( item.pageName ) ){
      return false;
    }
    seen.add( item.pageName );
    return true;
  } );

  return dedupedMenu;
};

export const BingeListCall = ( pageType, skip ) => {
  const subscriberId = getSubscriberId();
  const profileId = getProfileId();
  const authToken = getAuthToken();

  const defaultParams = useMemo( () => ( {
    url: serviceConst.BINGE_LIST_SERVICE,
    method: 'GET',
    params: {
      subscriberId,
      profileId,
      pagingState: null
    },
    headers: {
      authorization: authToken,
      subscriberId,
      platform: COMMON_HEADERS.PLATFORM,
      deviceType: COMMON_HEADERS.DEVICE_TYPE
    }
  } ), [subscriberId, profileId, authToken] );

  const {
    fetchData: bingeListFetchData,
    response: bingeListResponse,
    error: bingeListError,
    loading: bingeListLoading
  } = useAxios( {}, skip );

  const fetchBingeList = ( overrideParams = {} ) => {
    bingeListFetchData( {
      ...defaultParams,
      ...overrideParams,
      params: {
        ...defaultParams.params,
        ...( overrideParams.params || {} )
      },
      headers: {
        ...defaultParams.headers,
        ...( overrideParams.headers || {} )
      }
    } );
  };

  return [{
    bingeListFetchData: fetchBingeList,
    bingeListResponse,
    bingeListError,
    bingeListLoading
  }];
};

export const HorizontalFetchRailContent = () => {
  const authToken = getAuthToken();
  const subscriberId = getSubscriberId();
  const mobileNumber = getRmn();
  const anonymousId = getAnonymousId();

  const defaultParams = useMemo( () => ( {
    url: serviceConst.DYNAMIC_RAIL_INFO,
    method: 'GET',
    params: {},
    headers: {
      authorization: authToken,
      subscriberId,
      platform: COMMON_HEADERS.PLATFORM,
      mobilenumber: mobileNumber,
      deviceType: 'WEB',
      anonymousId,
      rule: COMMON_HEADERS.RULE
    }
  } ), [authToken, subscriberId, mobileNumber, anonymousId] );

  const {
    fetchData: horizontalFetchData,
    response: horizontalResponse,
    error: horizontalError,
    loading: horizontalLoading
  } = useAxios( {}, true ); // `true` means skip on mount

  const fetchHorizontalContent = useCallback( ( overrideParams = {} ) => {
    horizontalFetchData( {
      ...defaultParams,
      ...overrideParams,
      params: {
        ...defaultParams.params,
        ...( overrideParams.params || {} )
      },
      headers: {
        ...defaultParams.headers,
        ...( overrideParams.headers || {} )
      }
    } );
  }, [defaultParams, horizontalFetchData] );

  return [{
    horizontalFetchData: fetchHorizontalContent,
    horizontalResponse,
    horizontalError,
    horizontalLoading
  }];
};

export const UcBrowseByApps = ()=> {

  const { sidebarList, customPageType } = useHomeContext()
  let useCase = ''
  const authToken = getAuthToken();
  const baid = getBaID();
  const anonymousId = getAnonymousId();
  const subscriberId = getSubscriberId();
  const profileId = getProfileId();
  const dthStatus = getDthStatus() || PACKS.GUEST;
  const currentPage =  ( window.location.pathname === '/discover' ) ? PAGE_TYPE.DONGLE_HOMEPAGE : customPageType;
  if( sidebarList?.data ){
    useCase = sidebarList?.data?.items?.find( ele => ele?.pageType === currentPage )?.browseByAppUseCase
  }


  const browseByAppsUrl = useMemo( () => {
    const recommendedConfig = getABTestingFeatureConfig( ABMainFeature.railRecommendation )
    const recommendedGuestConfig = getABTestingFeatureConfig( ABMainFeature.railGuestRecommendation )
    if( !useCase ){
      return '';
    }
    return authToken ?
      ( recommendedConfig?.address ? ensureTrailingSlash( recommendedConfig.address ) + useCase :
        serviceConst.TA_BROWSE_BY_APPS.replace( '$useCase', useCase ) ) :
      ( recommendedGuestConfig?.address ? ensureTrailingSlash( recommendedGuestConfig.address ) + useCase :
        serviceConst.TA_BROWSE_BY_APPS_GUEST.replace( '$useCase', useCase ) );
  }, [useCase, authToken] );

  const defaultParams = useMemo( () => ( {
    url: browseByAppsUrl,
    method: 'POST',
    headers: {
      ...( authToken ? { authorization: authToken } : { anonymousId } ),
      ...( baid && { baid } ),
      ...( subscriberId && { subscriberid: subscriberId } ),
      'content-type': 'application/json',
      profileId,
      dthstatus: dthStatus,
      platform: COMMON_HEADERS.RECO_PLATFORM
    }
  } ), [browseByAppsUrl, authToken, anonymousId, baid, subscriberId, profileId, dthStatus] );

  const {
    fetchData: ucBrowseByAppsFetchData,
    response: ucBrowseByAppsResponse,
    error: ucBrowseByAppsError,
    loading: ucBrowseByAppsLoading
  } = useAxios( {}, true ); // skip on mount

  const fetchUcBrowseByApps = useCallback( ( overrideParams = {} ) => {
    ucBrowseByAppsFetchData( {
      ...defaultParams,
      ...overrideParams,
      headers: {
        ...defaultParams.headers,
        ...( overrideParams.headers || {} )
      },
      params: {
        ...( overrideParams.params || {} )
      }
    } );
  }, [ucBrowseByAppsFetchData, defaultParams] );

  return [{
    ucBrowseByAppsFetchData: fetchUcBrowseByApps,
    ucBrowseByAppsResponse,
    ucBrowseByAppsError,
    ucBrowseByAppsLoading
  }];
};

export const LiveClickLA = ( props ) => {
  const type = 'CHANNEL'
  let liveClickLAData = {}
  const params = {
    url: serviceConst.LIVE_CLICK_LA + '/' + type + '/' + props.id + '/LIVE',
    method: 'POST',
    params: {
      refUsecase: props.refUsecase
    },
    headers:{
      authorization: getAuthToken(),
      platform:  COMMON_HEADERS.RECO_PLATFORM,
      provider: props.provider,
      dthstatus: getDthStatus(),
      ...( getAuthToken() && { bingeproduct: getBingeProduct() } ),
      profileid: getProfileId(),
      baid:  getBaID(),
      subscriberid:  getSubscriberId(),
      contentType: COMMON_HEADERS.CONTENT
    },
    data: {}
  }

  const { fetchData: liveClickLA, response: liveClickLAResponse, error: liveClickLAError, loading:liveClickLALoading } = useAxios( {}, true );
  liveClickLAData = { liveClickLA: ( newParams ) => liveClickLA( Object.assign( params, newParams ) ), liveClickLAResponse, liveClickLAError, liveClickLALoading };
  return [liveClickLAData];
}

export const AllFeature = ( ) => {
  let allFeatureData = {}
  const params = {
    url: serviceConst.ALL_FEATURE,
    method: 'GET',
    headers:{
      contentLength: 0,
      contentType: COMMON_HEADERS.CONTENT
    },
    data: {}
  }

  const { fetchData: allFeature, response: allFeatureResponse, error: allFeatureError, loading:allFeatureLoading } = useAxios( {}, true );
  allFeatureData = { allFeature: ( newParams ) => allFeature( Object.assign( params, newParams ) ), allFeatureResponse, allFeatureError, allFeatureLoading };
  return [allFeatureData];
}

export const AssignedVariant = ( ) => {
  let assignedVariantData = {}
  let userInfo = getUserInfo()
  const params = {
    url: serviceConst.ASSIGNED_VARIANT,
    method: 'GET',
    headers:{
      authorization: getAuthToken(),
      subscriberid:  getSubscriberId(),
      dthstatus: getDthStatus(),
      platform:  getPlatformType( false ),
      rmn:getRmn(),
      accountid: getSubscriberId(),
      deviceid: getTVDeviceId(),
      isFlexi: false,
      tpfUser: false,
      subscriptiontype : userInfo?.planType || PACKS.ADD_PACK_FREEMIUM
    },
    data: {}
  }

  const { fetchData: assignedVariant, response: assignedVariantResponse, error: assignedVariantError, loading:assignedVariantLoading } = useAxios( {}, true );
  assignedVariantData = { assignedVariant: ( newParams ) => assignedVariant( Object.assign( params, newParams ) ), assignedVariantResponse, assignedVariantError, assignedVariantLoading };
  return [assignedVariantData];
}




