/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { getAuthToken, getDeviceToken, setData } from '../../../utils/localStorageHelper';
import { COMMON_HEADERS, isTizen, PROVIDER_LIST, SONY_CONSTANTS } from '../../../utils/constants';
import { GetSonyLivToken } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { removeSonySDK } from '../../../utils/util';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';


const UseSonyLivSDK = ( providerName, shouldInitSDK ) => {
  const { initSonySDKResponse, setInitSonySDKResponse, setSetSonyLiveErrorPage, sonyLivPartnerToken, setSonyLivPartnerToken, sonyLivPlayer, setSonyLivPlayer } = usePlayerContext()
  const getTokenObj = GetSonyLivToken( '', true );
  const { fetchSonyLivToken, sonyLivGetTokenResponse } = getTokenObj;
  const previousPathName = useNavigationContext();

  const [showSonyPILoader, setShowSonyPILoader] = useState( false );

  const loadSonyScript = ( sonyLivPartnerToken ) => {
    if( !window.SPN_MANAGER && !window.sdkloadattempt ){
      window.sdkloadattempt = true;
      const scriptEle = document.createElement( 'script' );
      scriptEle.setAttribute( 'type', 'text/javascript' );
      scriptEle.setAttribute( 'id', 'sonyScriptFile' );
      scriptEle.setAttribute(
        'src',
        isTizen ?
          process.env.REACT_APP_SAMSUNG_SONY_SDK_PATH :
          process.env.REACT_APP_LG_SONY_SDK_PATH
      );
      scriptEle.setAttribute( 'async', false );
      document.head.appendChild( scriptEle );
      scriptEle?.addEventListener( 'load', () => {
        initSonySDK( sonyLivPartnerToken );
      } );
      scriptEle?.addEventListener( 'error', () => {
        console.log( 'PI---error loading sony sdk ') // eslint-disable-line
      } );
    }
  }

  const initSonySDK = ( token ) => {
    window.SPN_MANAGER.initSDK(
      {
        shortToken: getDeviceToken(), // '73Wi8uC1MJJIQ5kHM7k7DnKJujTkYL6D',
        uniqueId: SONY_CONSTANTS.UNIQUE_ID, // 'TATASky',
        deviceType: SONY_CONSTANTS.DEVICE_TYPE, // 'TSMOBILE',
        deviceToken: COMMON_HEADERS.DEVICE_ID, // SONY_CONSTANTS.DEVICE_TOKEN, // '1675156660606', // 'G070L822932321XJ',
        partnerToken: token,
        useIFrame: true,
        createPlayer: false
      },
      initializeCallback
    );
    isTizen ? setData( 'USE_SAMSUNG_SPN_SDK', 'true' ) : setData( 'USE_LG_SPN_SDK', 'true' );
  }

  const initializeCallback = ( res )=>{
    setInitSonySDKResponse( res );
    if( res.success ){
      setSetSonyLiveErrorPage( false )
      const player = window.SPN_MANAGER.createPlayer();
      const config = {
        playerDiv: document.getElementById( 'playerWrapper' )
      };
      if( document.getElementById( 'playerWrapper' ) ){
        player.prefetchPlayerSdk( config, function( res ){
          console.log( 'prefetchPlayerSdk :: ', res );
        } );
      }
      window.sonyplayer = player;
      setSonyLivPlayer( player );
    }
    else if( !res.success ){
      setSetSonyLiveErrorPage( true )
    }
    setShowSonyPILoader( false );
  }

  // Effect to fetch the SonyLiv token when provider matches
  useEffect( ()=>{
    if( providerName?.toLowerCase() === PROVIDER_LIST.SONYLIV && getAuthToken() && shouldInitSDK ){
      fetchSonyLivToken();
    }
  }, [shouldInitSDK, providerName] )

  // Effect to update the token and remove SDK if token changes
  useEffect( () => {
    if(
      shouldInitSDK &&
      sonyLivGetTokenResponse?.data?.token &&
      ( sonyLivGetTokenResponse.data.token !== sonyLivPartnerToken )
    ){
      removeSonySDK();
      setSonyLivPartnerToken( sonyLivGetTokenResponse.data.token );
    }
  }, [sonyLivGetTokenResponse, sonyLivPartnerToken] );

  // Effect to load the SonyLiv script when all conditions are met
  useEffect( () => {
    if( sonyLivPartnerToken && !window.SPN_MANAGER ){
      previousPathName.subscriptionRootPage = 'CONTENT';
      setData( 'PLAY_TATA_ADS', true );
      setData( 'ENABLE_4K', true );
      loadSonyScript( sonyLivPartnerToken );
    }
  }, [sonyLivPartnerToken, providerName] );

  useEffect( ()=>{
    if( !window.SPN_MANAGER && getAuthToken() && providerName?.toLowerCase() === PROVIDER_LIST.SONYLIV ){
      setShowSonyPILoader( true );
    }
    else {
      setShowSonyPILoader( false );
    }
  }, [getAuthToken()] )

  return { initSonySDKResponse, showSonyPILoader };
}

export default UseSonyLivSDK;