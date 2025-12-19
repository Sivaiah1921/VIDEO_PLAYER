/* eslint-disable no-console */
/**
 * This component is used to show ActivateJourneyPopUp
 *
 * @module views/components/ActivateJourneyPopUp
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import './ActivateJourneyPopUp.scss';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Image from '../Image/Image';
import { interstitialScreenRedirection } from '../../../utils/commonHelper';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, InterstitialPage_Routes, PROVIDER_LIST } from '../../../utils/constants';
import { activateAppleTVSubscriptionClick } from '../../../utils/mixpanel/mixpanelService';
import { AppleActivationRedemCode } from '../../../utils/slayer/AmazonPrimeService';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { getAppleJourneyStatus } from '../../../utils/appleHelper';

/**
 * Represents a ActivateJourneyPopUp component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ActivateJourneyPopUp
 */
export const ActivateJourneyPopUp = function( props ){
  const { modalRef, handleCancel, skipActivateJouneyModal, historyObject, applePrimePopupVerbiages, entitlementStatusData } = props;

  const { setIsActivePopUpOpen, restoreActivePopupKey, hasPrimeCtaClicked } = useMaintainPageState();

  const [appleActivationCodeRedemption] = AppleActivationRedemCode( true );
  const { appleFetchData, appleRedemptionResponse, appleRedemptionLoading } = appleActivationCodeRedemption;

  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData?.currentPack

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );

  const handleAppleInterstitialNav = ( redeemAppleUrl ) => {
    /** Mixpanel Events from Activation Popup */
    activateAppleTVSubscriptionClick( APPLE_PRIME_ACTIVATION_JOURNEY.SUBSCRIPTION_SUCCESS ) // Set source to subscrition success.
    restoreActivePopupKey.current = getCurrentFocusKey()
    setIsActivePopUpOpen( false );
    handleCancel();
    interstitialScreenRedirection( historyObject.current, redeemAppleUrl, PROVIDER_LIST.APPLETV, null, null, InterstitialPage_Routes.apple, true, false );
  };

  const handlePrimeInterstitialNav = () => {
    restoreActivePopupKey.current = getCurrentFocusKey()
    setIsActivePopUpOpen( false );
    handleCancel();
    hasPrimeCtaClicked.current = true
    interstitialScreenRedirection( historyObject.current, entitlementStatusData.primeActivation_url, PROVIDER_LIST.PRIME, null, null, InterstitialPage_Routes.prime, true, false );
  };

  const getVeribiageDetailsFn = ( entitlementStatusData, contentType ) => { // TODO: this has multiple ternary checks, at line 63 & 65 use if else
    if( contentType === constants.ACTIVATION_POPUP_HEADER ){
      return entitlementStatusData.hasApplePrimeEnabled ? applePrimePopupVerbiages?.applePrimeHeader : entitlementStatusData.hasPrimeEnabled ? applePrimePopupVerbiages?.primeHeader : entitlementStatusData.hasAppleEnabled ? applePrimePopupVerbiages?.appleHeader : ''
    }
    else {
      return entitlementStatusData.hasApplePrimeEnabled ? applePrimePopupVerbiages?.applePrimeSubHeader : entitlementStatusData.hasPrimeEnabled ? applePrimePopupVerbiages?.primeSubHeader : entitlementStatusData.hasAppleEnabled ? applePrimePopupVerbiages?.appleSubHeader : ''
    }
  }

  useEffect( () => {
    if( restoreActivePopupKey.current !== null ){
      if( restoreActivePopupKey.current === 'UPGRADE_BUTTON_PRIME' ){
        entitlementStatusData.hasPrimeEnabled ? setTimeout( ()=> setFocus( restoreActivePopupKey.current ), 100 ) : setTimeout( ()=> setFocus( 'UPGRADE_BUTTON_APPLE' ), 100 )
      }
      else {
        entitlementStatusData.hasAppleEnabled ? setTimeout( ()=> setFocus( restoreActivePopupKey.current ), 100 ) : setTimeout( ()=> setFocus( 'UPGRADE_BUTTON_PRIME' ), 100 )
      }
    }
    else if( entitlementStatusData.hasPrimeEnabled ){
      setTimeout( ()=> setFocus( 'UPGRADE_BUTTON_PRIME' ), 100 )
    }
    else if( entitlementStatusData.hasAppleEnabled ){
      setTimeout( ()=> setFocus( 'UPGRADE_BUTTON_APPLE' ), 100 )
    }
  }, [] );

  useEffect( ()=>{
    if( appleRedemptionResponse && appleRedemptionResponse.data && appleRedemptionResponse.data.activation_url ){
      handleAppleInterstitialNav( appleRedemptionResponse.data.activation_url )
    }
  }, [appleRedemptionResponse] )

  return (
    <div className='ActivateJourneyPopUp'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='ActivateJourneyPopUpModalId'
            customClassName={ 'ActivateJourneyPopUpModal' }
            ref={ modalRef }
            closeModalFn={ skipActivateJouneyModal }
            callBackFunc={ handleCancel }
          >
            <div className='ActivateJourneyPopUp__layout'>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='ActivateJourneyPopUp__closeButton'>
                  <Button
                    label={ constants.GOBACK }
                    iconLeft={ true }
                    iconLeftImage='Path'
                    size='medium'
                    onClick={ skipActivateJouneyModal }
                  />
                </div>
              </FocusContext.Provider>
              <div className='ActivateJourneyPopUp__header'>
                <div className='ActivateJourneyPopUp__header--providerlogos'>
                  { entitlementStatusData.hasPrimeEnabled && (
                    <Image
                      src={ applePrimePopupVerbiages?.primelogo }
                      height={ 120 }
                      width={ 120 }
                    />
                  ) }
                  { entitlementStatusData.hasAppleEnabled && (
                    <Image
                      src={ applePrimePopupVerbiages?.applelogo }
                      height={ 120 }
                      width={ 120 }
                    />
                  ) }
                </div>
                <Text textStyle='appleTv-header'
                  textAlign='center'
                >
                  { getVeribiageDetailsFn( entitlementStatusData, constants.ACTIVATION_POPUP_HEADER ) }
                </Text>
              </div>
              <div className='ActivateJourneyPopUp__content'>
                <Text textStyle='appleTv-content'
                  textAlign='center'
                >
                  { getVeribiageDetailsFn( entitlementStatusData, constants.ACTIVATION_POPUP_SUBHEADER ) }
                </Text>
              </div>
              { entitlementStatusData.hasPrimeEnabled && (
                <div className='ActivateJourneyPopUp__upgradeButton'>
                  <Button
                    label={ applePrimePopupVerbiages?.primeActivateButton }
                    onClick={ () => {
                      handlePrimeInterstitialNav();
                    } }
                    focusKeyRefrence={ 'UPGRADE_BUTTON_PRIME' }
                  />
                </div>
              ) }
              { entitlementStatusData.hasAppleEnabled && (
                <div className='ActivateJourneyPopUp__upgradeButton'>
                  <Button
                    label={ applePrimePopupVerbiages?.appleActivateButton }
                    onClick={ () => {
                      appleFetchData( { activationSource : APPLE_PRIME_ACTIVATION_JOURNEY.SUBSCRIPTION_SUCCESS, viaPopUp: getAppleJourneyStatus( myPlanProps?.appleDetails ) } )
                    } }
                    focusKeyRefrence={ 'UPGRADE_BUTTON_APPLE' }
                  />
                </div>
              ) }
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>
  );
};


export default ActivateJourneyPopUp;
