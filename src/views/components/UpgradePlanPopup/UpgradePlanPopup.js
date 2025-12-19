/* eslint-disable no-console */
/**
 * This component is used to show UpgradePlanPopup
 *
 * @module views/components/UpgradePlanPopup
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './UpgradePlanPopup.scss';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Icon from '../Icon/Icon';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { planUpgradeConfirmationNotNow, planUpgradeConfirmationProceed, planUpgradeConfirmationView } from '../../../utils/mixpanel/mixpanelService';

/**
 * Represents a UpgradePlanPopup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns UpgradePlanPopup
 */
export const UpgradePlanPopup = function( props ){

  const { ref, focusKey, focusSelf, focused } = useFocusable( {
    isFocusBoundary: true
  } );
  const { modalRef, handleCancel, handleUpgradePlan, configInfo, metaData } = props;
  const { flexiPlanVerbiagesContext } = useMaintainPageState() || null
  const partnerForFDOVerbiages = flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages?.upgradePopupConfirmationOnPartnerFDO


  useEffect( () => {
    setFocus( 'UPGRADE_BUTTON1' )
    /* Mixpanel-event */
    planUpgradeConfirmationView( metaData )
    return () =>{
      hideModal()
    }
  }, [] )

  const hideModal = () => {
    modalRef.current?.close();
  };

  return (
    <div className='UpgradePlanPopup'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='UpgradePlanPopupModalId'
            customClassName={ 'UpgradePlanPopupModal' }
            ref={ modalRef }
            // opener={ opener }
            handleCancel={ handleCancel }
            closeModalFn={ handleCancel }
            callBackFunc={ handleCancel }
          >
            <div className='UpgradePlanPopup__layout'>

              <div className='UpgradePlanPopup__header'>
                <Icon name='CrownGoldForward24x24'/>
                <Text textStyle='appleTv-header'
                  textAlign='center'
                >
                  { configInfo?.header }
                </Text>

              </div>
              <div className='UpgradePlanPopup__content'>
                <Text textStyle='appleTv-content'
                  textAlign='center'
                >
                  { partnerForFDOVerbiages?.title }
                </Text>

              </div>

              <div className='UpgradePlanPopup__upgradeButton'>
                <Button
                  label={ partnerForFDOVerbiages?.primaryButtonText }
                  onClick={ ()=>{
                    handleUpgradePlan()
                    /* Mixpanel-event */
                    planUpgradeConfirmationProceed( metaData )
                  } }
                  focusKeyRefrence={ 'UPGRADE_BUTTON1' }
                />
              </div>
              <div className='UpgradePlanPopup__upgradeButton'>
                <Button
                  label={ partnerForFDOVerbiages?.secondaryButtonText }
                  onClick={ ()=>{
                    hideModal()
                    /* Mixpanel-event */
                    planUpgradeConfirmationNotNow( metaData )
                  } }
                  focusKeyRefrence={ 'UPGRADE_BUTTON2' }
                />
              </div>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='UpgradePlanPopup__closeButton' >
                  <Button
                    label={ 'To Close' }
                    iconLeft={ true }
                    iconLeftImage='Path'
                    size='medium'
                    onClick={ handleCancel }
                    // disabled={ true }
                  />
                </div>
              </FocusContext.Provider>
            </div>
          </Modal>
        </div>
      </FocusContext.Provider>
    </div>

  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} modalRef - Sets the ref for modal
 * @property {object} opener - Sets the ref for opener
 */
export const propTypes =  {
  modalRef: PropTypes.object,
  opener: PropTypes.object
};

UpgradePlanPopup.propTypes = propTypes;

export default UpgradePlanPopup;
