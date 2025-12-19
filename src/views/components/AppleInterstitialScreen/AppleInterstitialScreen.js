/* eslint-disable no-console */
/**
 * This component will show to the user about activation
 *
 * @module views/components/AppleInterstitialScreen
 * @memberof -Common
 */
import React, { useEffect, useMemo } from 'react';
import './AppleInterstitialScreen.scss';
import { useLocation, useHistory } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import constants, { APPLETV, APPLE_PRIME_ACTIVATION_JOURNEY, LAYOUT_TYPE } from '../../../utils/constants';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import get from 'lodash/get';
import { clearPILevelWhenComeBackToPI, cloudinaryCarousalUrl, getPubnubChannelName, modalDom } from '../../../utils/util';
import Button from '../Button/Button';
import { appleQrCodeView } from '../../../utils/mixpanel/mixpanelService';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { getPiLevel, setAppleToastInfo } from '../../../utils/localStorageHelper';
import { getAppleJourneyStatus } from '../../../utils/appleHelper';

/**
 * Represents a AppleInterstitialScreen component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppleInterstitialScreen
 */
export const AppleInterstitialScreen = function( props ){

  const history = useHistory();
  const location = useLocation();
  const { messages } = usePubNubContext()
  const { activation_url, isFromActivationPopup, isFromHeroBanner } = location.args || {};
  const { url } = useAppContext();
  const { flexiPlanVerbiagesContext, setIsActivePopUpOpen, receivePubnubAfterScanning } = useMaintainPageState() || null
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData?.currentPack


  const AppleInterstitialScreenVerbiages = useMemo( () => {
    return flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage?.lsAppleInterstitialScreenVerbiages || {}
  }, [flexiPlanVerbiagesContext.current] )

  const arrayOfPosterImages = [
    AppleInterstitialScreenVerbiages.image1,
    AppleInterstitialScreenVerbiages.image2,
    AppleInterstitialScreenVerbiages.image3,
    AppleInterstitialScreenVerbiages.image4,
    AppleInterstitialScreenVerbiages.image5
  ].filter( image => image ); // Filter out any undefined or null values

  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true } );

  useEffect( ()=>{
    appleQrCodeView( getAppleJourneyStatus( myPlanProps?.appleDetails ), isFromActivationPopup ? APPLE_PRIME_ACTIVATION_JOURNEY.SUBSCRIPTION_SUCCESS : isFromHeroBanner ? APPLE_PRIME_ACTIVATION_JOURNEY.HERO_BANNER : APPLE_PRIME_ACTIVATION_JOURNEY.PI_PAGE )
    return ()=>{
      isFromActivationPopup && setIsActivePopUpOpen( true )
    }
  }, [] )

  useEffect( () => {
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      const appleStatus = get( pubnubPush.deviceInfo[0]?.appleDetails, 'entitlementStatus', '' )
      if( appleStatus && appleStatus !== APPLETV.CLAIM_STATUS.ENTITLED ){
        isFromActivationPopup && setIsActivePopUpOpen( true );
        if( isFromHeroBanner || isFromActivationPopup ){
          setAppleToastInfo( { appleStatus: appleStatus } );
        }
        else {
          receivePubnubAfterScanning.current = { status: appleStatus };
        }
        history.goBack();
        setTimeout( () => {
          const piLevelClear = getPiLevel()
          clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
        }, 10 );
      }
    }
  }, [messages[getPubnubChannelName()]?.message] )

  useEffect( ()=> {
    !modalDom() && focusSelf()
  }, [] )


  return (
    <div className='AppleInterstitialPage'
      ref={ ref }
    >
      <FocusContext.Provider value={ focusKey }>
        <div className='AppleInterstitialScreen'>
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='AppleInterstitialScreen__header'>
              <Button
                onClick={ ()=> {
                  history.goBack()
                  setTimeout( () => {
                    const piLevelClear = getPiLevel()
                    clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
                  }, 10 );
                } }
                iconLeftImage='GoBack'
                iconLeft={ true }
                secondary={ true }
                label={ constants.GOBACK }
              />
              <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
            </div>
          </FocusContext.Provider>
          <div className='AppleInterstitialScreen__topSection'>
            { arrayOfPosterImages.length > 0 && arrayOfPosterImages.map( ( posterImage ) => {
              return (
                <Image
                  alt={ 'appleImages' }
                  ariaLabel='Image'
                  src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PROMO_IMAGES, url ) }/${ posterImage }` }
                />
              )
            } ) }
          </div>
          <div className='AppleInterstitialScreen__bodySection'>
            <div className='AppleInterstitialScreen__appleHeaderSection'>
              <Image
                alt={ 'AppleLoGO' }
                ariaLabel='Image'
                src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PROMO_LOGO, url ) }/${ AppleInterstitialScreenVerbiages?.others?.appleverbiagelogo }` }
              />
              <Text
                textStyle='apple-header'
                color='white'
                className='AppleInterstitialScreen__appleTopSection--Text'
              >
                { AppleInterstitialScreenVerbiages?.subHeader }
              </Text>
            </div>
            <div className='AppleInterstitialScreen__appleMiddleSection'>
              <div className='AppleInterstitialScreen__appleMiddleLeftSection'>
                { AppleInterstitialScreenVerbiages?.others?.steps?.length > 0 && AppleInterstitialScreenVerbiages.others.steps.map( ( item, index )=>{
                  return (
                    <div className='AppleInterstitialScreen__steps'
                      key={ index }
                    >
                      <div className='AppleInterstitialScreen__leftContentHeader'>
                        <Text
                          color='white'
                        >
                          { item.text1 }
                        </Text>
                      </div>
                      <div className='AppleInterstitialScreen__leftContentBody'>
                        <Text
                          color='white'
                        >
                          { item.text2 }
                        </Text>
                      </div>
                    </div>
                  )
                } ) }
                <div className='AppleInterstitialScreen__leftContentNote' >
                  <Text
                    color='white'
                  >
                    { AppleInterstitialScreenVerbiages?.others?.message }
                  </Text>
                </div>
              </div>
              <div className='AppleInterstitialScreen__appleDivider'></div>
              <div className='AppleInterstitialScreen__appleMiddleRightSection'>
                <div className='AppleInterstitialScreen__appleMiddleRightSection--Qrtext'>
                  <Text
                    color='white'
                  >
                    { AppleInterstitialScreenVerbiages?.header }
                  </Text>
                </div>
                <div className='AppleInterstitialScreen__appleMiddleRightSection--QrSection'>
                  <div className='AppleInterstitialScreen__appleMiddleRightSection--QrCode'>
                    <QRCode
                      value={ activation_url || '' }
                      size={ window.innerWidth === 1920 ? 254 : 180 }
                      fgColor={ '#000000' }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='AppleInterstitialScreen__hiddenButton'>
              <Button
                label={ constants.APP_EXIT_SCREEN.buttonLabelNo }
                secondary
                size='medium'
                focusKeyRefrence={ `APPLE_BUTTON` }
              />
            </div>
          </div>
        </div>
      </FocusContext.Provider>
    </div>
  )
}

export default AppleInterstitialScreen;
