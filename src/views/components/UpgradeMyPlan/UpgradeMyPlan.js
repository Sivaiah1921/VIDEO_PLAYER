/**
 * Upgrade My Plan
 *
 * @module views/components/UpgradeMyPlan
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './UpgradeMyPlan.scss';
import Text from '../Text/Text';
import classNames from 'classnames';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { modalDom } from '../../../utils/util';
import PackageCard from '../PackageCard/PackageCard';

/**
 * Represents a UpgradeMyPlan component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns UpgradeMyPlan
 */
export const UpgradeMyPlan = function( props ){
  const { complementaryAppsList, nonComplementaryAppsText, isFiberplan } = props

  const { focusKey, ref, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true
  } );

  useEffect( ()=>{
    if( Boolean( props.isButtonVisible && !props.footerMsg && props.selectCardProps?.length === 0 ) ){
      setFocus( 'CONTINUE_WATCHING' )
    }
    else {
      !modalDom() && complementaryAppsList?.length > 0 ? setTimeout( ()=> setFocus( 'COMPLEMENTARY_APPS' ) ) : setTimeout( ()=> focusSelf() )
    }
  }, [] )
  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }
        className={ classNames( 'UpgradeMyPlan', {
          'UpgradeMyPlan--morePlanLogos': props.morePlanLogos
        } ) }
      >
        <div className={ props.confirmPurchase ? '' : 'UpgradeMyPlan__title' }>
          <Text
            textAlign='left'
            textStyle='title-1'
            color='white'
          >
            { props.upgradeMyPlanTitle }
          </Text>
        </div>
        <div className='UpgradeMyPlan__content'>
          <div className='UpgradeMyPlan__left'>
            <div className='UpgradeMyPlan__left--apps'>
              <PackageCard
                { ... props }
                title={ props.confirmPurchase ? props.upgradeMyPlan : props.upgradeMyPlanType }
                titlePremium={ true }
                titleIcon={ 'CrownWithBG' }
                appLabel={ 'apps' }
                deviceDetails={ props.deviceDetails }
                deviceIcon={ 'Devices' }
                monthlyPlan={ props.confirmPurchase ? '' : props?.upgradeMyPlan }
                apps={ props.apps }
                expiryFooterMessage={ props.footerMsg || props.myPlanOpenFSDetailsFooterMessage }
                focusKeyRefrence={ `CANCELLED_PACKAGECARD` }
                fdoChangesPlanVerbiages={ props?.fdoChangesPlanVerbiages }
                packValidityMessage={ props.upgradeMyPlanExpire || props.myPlanOpenFSDetailsRenewalMessage }
                nonComplementaryAppsText={ nonComplementaryAppsText }
                isFiberplan={ isFiberplan }
              />
            </div>
          </div>
        </div>
        { /* { Boolean( ( props.footerMsg && props.morePlanLogos && props.fdoRequested ) || ( props.footerMsg && props.subscriptionStatus === 'ACTIVE' ) && props.selectCardProps?.length === 0 || props.upgradeFDOCheck ) ? (
          <div className={ !props.upgradeFDOCheck ? 'UpgradeMyPlan__footer' : 'UpgradeMyPlan__cancelFooter' }>
            <Text
              textAlign='center'
              textStyle='body-2'
              color='purple-25'
            >
              { props.footerMsg }
            </Text>
          </div>
        ) : props.subscriptionStatus !== SUBSCRIPTION_STATUS.DEACTIVE && (
          <div className='UpgradeMyPlan__footerAny'>
            { props.footerMsg?.split( '\n' ).map( text => {
              return (
                <Text
                  textAlign='center'
                  textStyle='body-2'
                  color='purple-25'
                >
                  { text }
                </Text>
              )
            } ) }
          </div>
        ) } */ }
        { /* { Boolean( props.isButtonVisible && !props.footerMsg && props.selectCardProps?.length === 0 ) &&
        <div
          className='UpgradeMyPlan__button'
        >
          <Button
            onClick={ ()=> {
              loginMyPlanStartWatching()
              navigateToHome( history )
            } }
            label={ 'Continue Watching' }
            size={ 'medium' }
            focusKeyRefrence='CONTINUE_WATCHING'
          />
        </div> } */ }
      </div>
    </FocusContext.Provider>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} upgradeMyPlanTitle - set the upgradeMyPlanTitle
 * @property {array} apps - set the apps of the card
 * @property {string} upgradeMyPlanType - set the apps of the upgradeMyPlanType
 * @property {string} upgradeMyPlan - set the apps of the upgradeMyPlan
 * @property {bool} morePlanLogos - set the apps of the morePlanLogos
 */
export const propTypes = {
  upgradeMyPlanTitle: PropTypes.string,
  upgradeMyPlan: PropTypes.string,
  upgradeMyPlanType: PropTypes.string,
  morePlanLogos: PropTypes.bool,
  apps: PropTypes.array
};

/**
  * Default values for passed properties
  *
  * @type {object}
  * @property {boolean} morePlanLogos=false - Default morePlanLogos
  */
export const defaultProps = {
  morePlanLogos: false
};


UpgradeMyPlan.propTypes = propTypes;
UpgradeMyPlan.defaultProps = defaultProps;

export default UpgradeMyPlan;
