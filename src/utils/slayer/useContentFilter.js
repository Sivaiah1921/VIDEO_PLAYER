import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../../views/core/AppContextProvider/AppContextProvider';
import { useMaintainPageState } from '../../views/core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import constants, { APPLE_REDIRECTION_KEYS, CONTENT_TYPE, getPlatformType, PACKS, PROVIDER_LIST, SECTION_SOURCE, ALLOWED_HERO_BANNER_LIST, ALLOWED_HERO_BANNER_LAYOUT_LIST } from '../constants';
import { isLiveContentType } from './PlayerService';
import { getAuthToken, getProductName, getUserInfo } from '../localStorageHelper';
import { getAppleJourneyStatus } from '../appleHelper';
import { getProviderWithoutToken } from '../commonHelper';


export const useContentFilter = ( ) => {
  const [availableProviders, setAvailableProviders] = useState( [] )
  const { configResponse } = useAppContext();
  const { config, marketingAssetList } = configResponse;
  const { availableProvidersList } = useMaintainPageState() || null

  const platformType = useMemo( () => getPlatformType( false ), [] );
  const token = useMemo( () => getAuthToken(), [getAuthToken()] );
  const productName = useMemo( () => getProductName(), [getProductName()] );
  const isFreemium = productName === PACKS.FREEMIUM;

  const userInfo = useMemo( () => {
    try {
      return JSON.parse( getUserInfo() || '{}' );
    }
    catch {
      return {};
    }
  }, [getUserInfo()] );

  useEffect( () =>{
    if( config ){
      const providers = []
      if( config.availableProviders ){
        config.availableProviders && config.availableProviders.map( data=>{
          if( data.platform.includes( platformType ) ){
            providers.push( data.providerName.toLowerCase() )
          }
        } )
      }
      if( config.non_generic_partners ){
        config.non_generic_partners && config.non_generic_partners[platformType].map( ( item ) =>{
          providers.push( item.toLowerCase() )
        } )
      }
      if( providers.length === 0 ){
        config.available_partners && config.available_partners.map( ( item ) =>{
          providers.push( item.toLowerCase() )
        } )
      }
      setAvailableProviders( [...new Set( [...providers] )] )
      availableProvidersList.current = [...new Set( [...providers] )]
    }

  }, [config] )

  // Function to remove deboardedItems from an array of availableProvidersList,
  const removeDeboardProviders = useCallback( ( availableProvidersList = [], deboardedPartnersList = [] ) =>{
    const lowerCasedeboardedPartnersList = deboardedPartnersList.map( item => item.toLowerCase() );
    return availableProvidersList.filter( item => !lowerCasedeboardedPartnersList.includes( item.toLowerCase() ) );
  }, [availableProvidersList] )

  const filterData = ( railItems ) => {
    const uniqueData = railItems;
    if( uniqueData ){
      return uniqueData.map( ( item ) => {
        return { ...item, contentList: filterRail( item.contentList, null, item.sectionSource ) }
      } )
    }
    return []

  };

  const filterCheck = useCallback( ( nestedItem, myPlanProps, sectionSource ) => {
    let deboardPartnersList = [];
    let showMarketingAssets = false
    const HERO_BANNER_SECTIONS = [SECTION_SOURCE.HERO_BANNER, SECTION_SOURCE.HERO_BANNER_NEW];
    const isHeroBannerSection = HERO_BANNER_SECTIONS.includes( sectionSource );
    if( token ){
      deboardPartnersList = sectionSource === constants.SEARCH_PAGES ? userInfo?.searchDeboardedPartnersList?.map( item => item.toLowerCase() ) : userInfo?.deboardedPartnersList?.map( item => item.toLowerCase() )
      showMarketingAssets = userInfo?.marketingAssetList?.includes( constants.PRIME_MARKETING_VALUE )
    }
    else {
      deboardPartnersList = sectionSource === constants.SEARCH_PAGES ? config?.searchDeboardedPartnersList?.map( item => item.toLowerCase() ) : config?.deboardedPartnersList?.map( item => item.toLowerCase() )
      showMarketingAssets = marketingAssetList?.includes( constants.PRIME_MARKETING_VALUE )
    }
    /** HERO BANNER Should be visible for those users who is having APPLE PACK plus entitlementStatus is ENTITLED plus activationBannerType is REACTIVATION RENEW & MIGRATION */
    if( nestedItem.heroBannerType === CONTENT_TYPE.APPLE_HB && getProviderWithoutToken( nestedItem.provider, PROVIDER_LIST.APPLETV ) ){
      const journey = getAppleJourneyStatus( myPlanProps?.appleDetails )
      if( ( token || isFreemium ) ){
        return false;
      }
      else if( APPLE_REDIRECTION_KEYS.includes( myPlanProps?.appleDetails?.entitlementStatus ) && nestedItem.activationBannerType === journey && myPlanProps?.subscriptionStatus === constants.ACTIVE ){
        return true;
      }
    }
    if( isHeroBannerSection ){
      return ALLOWED_HERO_BANNER_LIST?.includes( nestedItem?.heroBannerType ) && ALLOWED_HERO_BANNER_LAYOUT_LIST.includes( nestedItem?.heroBannerLayout ); // Allow only specific hero banners
    }
    if( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ){ // For BBC channels we are not verifying the provider key
      return true
    }
    else {
      if( availableProvidersList.current.includes( nestedItem.provider?.toLowerCase() ) ){
        if( nestedItem?.marketingAsset ){
          return !!showMarketingAssets // for MarketingContents verifing based on config/current API marketingAssetList array and content marketAsset boolen values basis
        }
        else {
          return !deboardPartnersList?.includes( nestedItem.provider?.toLowerCase() ) // Allow content if provider is in availableProvidersList and not in deboarded list
        }
      }
      if( !nestedItem.provider ){
        return true; // Non-hero sections with no provider also allowing the content thisis exiting logic
      }
      if( !nestedItem.hasOwnProperty( 'provider' ) ){
        return true;
      }
      if( isLiveContentType( nestedItem.contentType ) ){
        return true;
      }
      return false;
    }
  }, [token, isFreemium, userInfo, config, availableProvidersList] )

  const filterRail = ( railItems, myPlanProps, sectionSource ) => {
    if( railItems && Array.isArray( railItems ) ){
      const uniqueData = railItems.filter( ( ele, index ) => railItems.findIndex( obj => obj.id === ele.id ) === index );
      if( uniqueData ){
        const filteredListData = uniqueData?.filter( ( nestedItem ) => filterCheck( nestedItem, myPlanProps, sectionSource ) )
        if( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ){
          return filteredListData.slice( 0, 10 )
        }
        return filteredListData
      }
    }
    return []
  };

  const filterRailBingeList = ( railItems ) => {
    const afterDeboaredAvailablePartnerList = removeDeboardProviders( availableProvidersList.current, userInfo?.deboardedPartnersList )
    const uniqueData = railItems.filter( ( ele, index ) => railItems.findIndex( obj => obj.contentId === ele.contentId ) === index );
    if( uniqueData ){
      return uniqueData?.filter( ( nestedItem ) => afterDeboaredAvailablePartnerList?.includes( nestedItem.provider?.toLowerCase() ) || !nestedItem.provider )
    }

  };

  const filterChipRailList = ( railItems = [] ) => {
    let deboardPartnersList = null
    if( token ){
      deboardPartnersList = userInfo?.deboardedPartnersList?.map( item => item.toLowerCase() )
    }
    else {
      deboardPartnersList = config?.deboardedPartnersList?.map( item => item.toLowerCase() )
    }
    return railItems?.filter( ( nestedItem ) => !deboardPartnersList?.includes( nestedItem.provider?.toLowerCase() ) )
  };

  return { availableProviders, filterData, filterRail, filterRailBingeList, filterChipRailList }

};