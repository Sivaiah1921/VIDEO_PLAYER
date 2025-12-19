/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/**
 * The AppContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/AppContextProvider/AppContextProvider
 */
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import get from 'lodash/get';
import { AppContextService } from '../../../utils/slayer/AppContextService';
import { ABMainFeature, ABSearchVariants, getPlatformType } from '../../../utils/constants';
import { getCloudinaryUrl, getMediaReadyUrl } from '../../../utils/util';
import { getAuthToken, setABTestingData } from '../../../utils/localStorageHelper';
import { DeviceLastActivityService } from '../../../utils/slayer/DeviceManagementService';
import { AllFeature, AssignedVariant } from '../../../utils/slayer/HomeService';

/**
 * Represents a AppContextProvider component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns AppContextProvider
 */
export const AppContextProvider = function( { children } ){
  const [uuid, setUuid] = useState( null );
  const [channelName, setChannelName] = useState( null );
  const [urlRender, setUrlRender] = useState( null );
  const [config] = AppContextService( );
  const { getConfig, configResponse, configError, configLoading } = config

  const [deviceLastActivity] = DeviceLastActivityService();
  const { deviceLastActivityFetchData } = deviceLastActivity

  const [allFeatureData] = AllFeature()
  const { allFeature, allFeatureResponse, allFeatureLoading, allFeatureError } = allFeatureData
  const [assignedVariantData] = AssignedVariant()
  const { assignedVariant, assignedVariantResponse, assignedVariantLoading, assignedVariantError } = assignedVariantData

  useEffect( () => {
    getConfig()
    allFeature()
  }, [] )


  useEffect( () => {
    if( getAuthToken() ){
      deviceLastActivityFetchData()
      assignedVariant()
    }
  }, [getAuthToken()] )

  useEffect( ()=>{
    if( configResponse && configResponse.code === 0 && configResponse.data && configResponse.data.config ){
      const platform = getPlatformType( false ).toLowerCase()
      const pubnubInfo = configResponse.data.config.mediaReady[platform]
      setUuid( pubnubInfo.uuid )
      setChannelName( pubnubInfo.bingeLSAndroid )
      if( window.webOS ){
        if( pubnubInfo.isCloudinaryEnabledLSLG ){
          setUrlRender( getCloudinaryUrl( configResponse.data.config ) )
        }
        else {
          setUrlRender( getMediaReadyUrl( configResponse.data.config ) )
        }
      }
      else if( window.tizen ){
        if( pubnubInfo.isCloudinaryEnabledLSSAMSUNG ){
          setUrlRender( getCloudinaryUrl( configResponse.data.config ) )
        }
        else {
          setUrlRender( getMediaReadyUrl( configResponse.data.config ) )
        }
      }
      else {
        setUrlRender( getMediaReadyUrl( configResponse.data.config ) )
      }
    }

  }, [configResponse] )



  function getVariantName( featureKey ){
    const { gemeni, hybridElastic, elastic } = ABSearchVariants;
    let variantName = elastic;
    const feature = allFeatureResponse?.data?.find( f => f.featureKey?.toUpperCase() === featureKey );
    const testVariant = feature?.testVariants?.find( v => v.inProduction === true );
    let address;
    if( testVariant ){
      const key = testVariant.testKey?.toUpperCase();
      address = testVariant?.address || '';
      let experimentKey =  feature?.experimentCacheDto?.experimentKey || '';
      let variantName = testVariant?.description
      setABTestingData( featureKey, {
        experimentKey: experimentKey,
        variant: variantName,
        address: address
      } );
    }
    if( getAuthToken() && assignedVariantResponse ){
      const enableFeature = assignedVariantResponse?.data?.find( f => f.featureKey === featureKey );
      let address;
      if( enableFeature ){
        const key = enableFeature.assignedTestVariant?.testKey?.toUpperCase();
        address = enableFeature.assignedTestVariant?.address || '';
        let experimentKey = enableFeature?.experimentKey
        let segment = enableFeature?.segment
        let variantName = enableFeature.assignedTestVariant?.description
        setABTestingData( featureKey, {
          experimentKey: experimentKey,
          segment: segment,
          variant: variantName,
          address: address
        } );
      }
    }

    return variantName;
  }

  useEffect( ()=>{
    ABSearchVariants.currentSearchVariant = getVariantName(
      ABMainFeature.searchFeature
    );

    ABSearchVariants.currentRecommendationVariant = getVariantName(
      ABMainFeature.railRecommendation
    );
    ABSearchVariants.currentRecommendationVariant = getVariantName(
      ABMainFeature.railGuestRecommendation
    );
    ABSearchVariants.currentliveRelatedRecommendationVariant = getVariantName(
      ABMainFeature.liveRelatedRecommendation
    );
    ABSearchVariants.currentwebShortRelatedRecommendationVariant = getVariantName(
      ABMainFeature.webShortRelatedRecommendation
    );
  }, [allFeatureResponse, assignedVariantResponse] )


  const contextValue = useMemo( () => ( {
    configResponse: get( configResponse, 'data', {} ) || {},
    uuid, channelName,
    url: urlRender,
    setUrlRender
  } ), [configResponse, uuid, channelName, urlRender, setUrlRender] );

  return (
    <AppContext.Provider value={ contextValue } >
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider;

/**
 * Context provider for react reuse
 * @type object
 */
export const AppContext = createContext();

/**
 * context provider
 * @type object
 */
export const useAppContext = ( ) => useContext( AppContext );
