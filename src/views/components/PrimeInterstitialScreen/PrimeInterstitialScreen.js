/* eslint-disable no-console */
/**
 * This component will show to the user about activation
 *
 * @module views/components/PrimeInterstitialScreen
 * @memberof -Common
 */
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import './PrimeInterstitialScreen.scss';
import Button from '../Button/Button';
import { useLocation, useHistory } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { getPubnubChannelName, modalDom, downloadAppHandler, contentPlayMixpanelEventForDeeplink, cloudinaryCarousalUrl, setMixpanelData, clearPILevelWhenComeBackToPI, getTAUseCaseId, sendExecptionToSentry } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { PrimeNudgeService } from '../../../utils/slayer/AmazonPrimeService';
import { getLaunchAppID, launchPartnerApp } from '../../../utils/slayer/PlaybackInfoService';
import { FocusContext, useFocusable, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, COMMON_HEADERS, CONTENT_TYPE, LAYOUT_TYPE, PLAYER, PRIME, SENTRY_LEVEL, SENTRY_TAG, isTizen } from '../../../utils/constants';
import { getActivatePopUpModalFlag, getPiLevel } from '../../../utils/localStorageHelper';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { activatePrime, primeInterstitialPageViewed } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import LaunchProviderPopupSamsung from '../LaunchProviderPopupSamsung/LaunchProviderPopupSamsung';
import get from 'lodash/get';
import { PlayingEventApiCalling } from '../../../utils/slayer/PlayerService';

/**
 * Represents a PrimeInterstitialScreen component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PrimeInterstitialScreen
 */
export const PrimeInterstitialScreen = function( props ){

  const [launchProviderPopupToTrue, setLaunchProviderPopupToTrue] = useState( false );

  const launchProviderRef = useRef();

  const location = useLocation();
  const history = useHistory();
  const { metaData } = usePlayerContext()
  const { url } = useAppContext();
  const { activation_url, provider, providerContentId, type, isFromActivationPopup } = location.args || {};
  const { messages } = usePubNubContext()
  const responseSubscription = useSubscriptionContext()
  const myPlanProps = responseSubscription?.responseData.currentPack
  const [playerEventObj] = PlayingEventApiCalling( { metaData, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;
  const { flexiPlanVerbiagesContext, receivePubnubAfterScanning, primeManualBack, storeRailData, setIsActivePopUpOpen } = useMaintainPageState() || null
  const [primeNudge] = PrimeNudgeService();
  const { primeNudgeFetchData } = primeNudge;

  const primeInterstitialScreenVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage?.lsPrimeInterstitialVerbiageUpdated, [flexiPlanVerbiagesContext.current] )
  const arrayOfPosterImages = [primeInterstitialScreenVerbiages?.image1, primeInterstitialScreenVerbiages?.image2, primeInterstitialScreenVerbiages?.image3, primeInterstitialScreenVerbiages?.image4, primeInterstitialScreenVerbiages?.image5]

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true } );

  const checkAppInstalled = () => {
    console.log( 'INSIDE CHECK INSTALLED APP' ); //  eslint-disable-line
    window.webOS && webOS.service.request( 'luna://com.webos.applicationManager', {
      method: 'getAppLoadStatus',
      parameters: { appId: getLaunchAppID( provider ) },
      onSuccess: function( inResponse ){
        console.log( 'SUCCESS oF GETAPP LOAD STATUS'); // eslint-disable-line
        if( inResponse.exist ){
          const taUseCaseId = getTAUseCaseId( storeRailData.current );
          contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, MIXPANELCONFIG.VALUE.YES )
          playerEventFetchData( { type, id: metaData?.vodId, watchDuration: 10 } );
          launchPartnerApp( provider, providerContentId, '', '', 0 );
        }
        else {
          downloadAppHandler( provider?.toLowerCase() )
        }
      },
      onFailure: function( inError ){
        console.log( 'Failed to check app installation' );
        console.log( '[' + inError.errorCode + ']: ' + inError.errorText, getLaunchAppID( provider ), 'check app installation' );
        sendExecptionToSentry( inError, `${ SENTRY_TAG.APP_INSTALLATION_FAILED } ${ provider } ${ getLaunchAppID( provider ) }`, SENTRY_LEVEL.ERROR );
      }
    } );
  }

  const showPopup = () => {
    setLaunchProviderPopupToTrue( true )
    setTimeout( () => {
      launchProviderRef?.current?.showModal();
    }, 100 );
  }

  const watchNowCTA = () => {
    primeNudgeFetchData( { platform: COMMON_HEADERS.PLATFORM, primaryIdentity: myPlanProps.apvDetails?.primaryIdentity || '' } )
    if( isTizen ){
      showPopup();
    }
    else {
      checkAppInstalled();
    }
  }

  const hideLaunchProviderModal = () => {
    setLaunchProviderPopupToTrue( false )
    launchProviderRef?.current?.close();
    setTimeout( ()=> setFocus( 'WATCH_NOW_CTA' ), 100 )
  };

  const onKeyPress = useCallback( ( e ) => {
    if( [PLAYER.UP, PLAYER.DOWN, PLAYER.LEFT, PLAYER.RIGHT].includes( e.keyCode ) ){
      getCurrentFocusKey().includes( 'HIDDEN_FOCUS_BUTTON' ) && setFocus( 'WATCH_NOW_CTA' )
    }
  }, [] )

  useEffect( () => {
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      const apv = get( pubnubPush, 'apv', {} )
      if( apv && apv.status && apv.status !== '' && apv.status !== PRIME.PACK_STATUS.ENTITLED ){
        if( isFromActivationPopup ){
          setIsActivePopUpOpen( true )
          history.goBack();
        }
        else {
          receivePubnubAfterScanning.current = apv
          history.goBack();
          setTimeout( () => {
            const piLevelClear = getPiLevel()
            clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
          }, 10 );
        }
      }
    }
  }, [messages[getPubnubChannelName()]?.message] )

  useEffect( () => {
    setMixpanelData( 'playerSource', constants.PLAYER_SOURCE.DETAIL_SCREEN )
    activatePrime( getActivatePopUpModalFlag() === APPLE_PRIME_ACTIVATION_JOURNEY.APPLE_PRIME_POPUP_INITIATED ? APPLE_PRIME_ACTIVATION_JOURNEY.SUBSCRIPTION_SUCCESS : MIXPANELCONFIG.VALUE.PI_PAGE, responseSubscription )
    primeInterstitialPageViewed( MIXPANELCONFIG.EVENT.PRIME_INTERSTITIAL_PAGE_VIEWED, MIXPANELCONFIG.VALUE.PI_PAGE, responseSubscription )
    return () => {
      if( Object.keys( receivePubnubAfterScanning.current ).length === 0 ){
        primeManualBack.current = true
      }
      isFromActivationPopup && setIsActivePopUpOpen( true )
    }
  }, [] );

  useEffect( ()=> {
    !modalDom() && setFocus( 'HIDDEN_FOCUS_BUTTON' )
  }, [] )

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  return (
    <div className='PrimeInterstitialPage'
      ref={ ref }
    >
      <FocusContext.Provider value={ focusKey }>
        <div className='PrimeInterstitialScreen'>
          <div className='PrimeInterstitialScreen__headSection'>
            { arrayOfPosterImages.map( ( posterPrimeImage ) => {
              return (
                <Image
                  alt={ 'PrimeImages' }
                  ariaLabel='Image'
                  src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PROMO_IMAGES, url ) }/${ posterPrimeImage }` }
                />
              )
            } ) }
          </div>
          <div className='PrimeInterstitialScreen__bodySection'>
            <div className='PrimeInterstitialScreen__primeTopSection'>
              <Image
                alt={ 'primelogo' }
                ariaLabel='Image'
                src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PROMO_LOGO, url ) }/${ primeInterstitialScreenVerbiages?.apvLogo }` }
              />
              <Text
                textStyle='prime-header'
                color='white'
                className='PrimeInterstitialScreen__primeTopSection--Text'
              >
                { primeInterstitialScreenVerbiages?.mainDescription }
              </Text>
            </div>
            <div className='PrimeInterstitialScreen__primeCenterSection'>
              <div className='PrimeInterstitialScreen__primeSectionQrText'>
                <div className='PrimeInterstitialScreen__primeSectionQrText--HeaderText'>
                  <Text
                    textStyle='prime-qrCode-header'
                    color='white'
                  >
                    { primeInterstitialScreenVerbiages?.claimHeader }
                  </Text>
                </div>
                <div className='PrimeInterstitialScreen__primeSectionQrText--QrCodeText'>
                  <Text
                    textStyle='prime-qrCode-subHeader'
                    color='white'
                  >
                    { primeInterstitialScreenVerbiages?.qrcodeDescription }
                  </Text>
                </div>
              </div>
              <div className='PrimeInterstitialScreen__primeSectonQrCode'>
                <QRCode
                  value={ `${ activation_url }?source=PI-PAGE` }
                  size={ window.innerWidth === 1920 ? 254 : 180 }
                  fgColor={ '#000000' }
                />
              </div>
            </div>
          </div>
          <div className='PrimeInterstitialScreen__footerSection'>
            <div className='PrimeInterstitialScreen__footerTopSection'>
              <Image
                alt={ 'primefooterImage' }
                ariaLabel='Image'
                src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PRIME_LITE_BENEFIT, url ) }/${ primeInterstitialScreenVerbiages?.lsPrimeFooterImage }` }
              />
            </div>
            <div className='PrimeInterstitialScreen__footerBottomSectionLink'>
              <div className='PrimeInterstitialScreen__footerBottomLeftSectionLink'>
                <div>
                  {
                    primeInterstitialScreenVerbiages?.tncDescription
                  }
                  <span className='PrimeInterstitialScreen__footerBottomSectionLink--span'>{ primeInterstitialScreenVerbiages?.tncUrlPrimeAmazon }</span>and
                  <span className='PrimeInterstitialScreen__footerBottomSectionLink--span'>{ primeInterstitialScreenVerbiages?.tncUrlPrime }</span>
                </div>
                <div className='PrimeInterstitialScreen__footerBottomSectionLink--benefitsMsg'>
                  { primeInterstitialScreenVerbiages?.primeBenifitsMessage }
                </div>
              </div>
              <div className='PrimeInterstitialScreen__footerBottomRightSectionLink'>
                <Icon
                  name={ constants.BINGE_LOGO }
                />
              </div>
            </div>

          </div>
        </div>
      </FocusContext.Provider>
      {
        launchProviderPopupToTrue && isTizen && (
          <LaunchProviderPopupSamsung
            provider={ provider }
            displayModal={ true }
            modalRef={ launchProviderRef }
            appLaunch={ false }
            parentalPinStatus={ false }
            handleCancel={ hideLaunchProviderModal }
            providerName={ provider }
            // tagID={ tagID }
            contentId={ providerContentId }
            opener={ launchProviderRef }
            myPlanProps={ myPlanProps }
          />
        )
      }
    </div>
  )
}

export default PrimeInterstitialScreen;
