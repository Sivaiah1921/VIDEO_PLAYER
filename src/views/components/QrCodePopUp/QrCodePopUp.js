/**
 * This component is used to show the QR popup where we can scan the QR
 *
 * @module views/components/QrCodePopUp
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './QrCodePopUp.scss';
import Modal from '../Modal/Modal';
import QRCode from 'react-qr-code';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { getDthStatus } from '../../../utils/localStorageHelper';
import { USERS } from '../../../utils/constants';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { pack_QR_code_refresh } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import Image from '../Image/Image';

/**
 * Represents a QRCodePopUp component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns QrCodePopUp
 */
export const QrCodePopUp = function( props ){
  const previousPathName = useNavigationContext()
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true,
    trackChildren: true
  } );
  const { modalRef, handleCancel, opener, goBack, heading, info, url, size, additionalInfo, balanceBtnLabel, handleClick, showQRcode, flexiHeading, flexiCrown, flexiInfo, doneCta, zeroAppsPlanCloseQrCode, customClassName, primeInfo, primeAdditionalInfo, focusShouldRetain } = props;

  const hideModal = () => {
    modalRef.current?.close();
  };

  const checkBalanceEvent = () => {
    /* Mixpanel-event */
    pack_QR_code_refresh();
    handleClick && handleClick();
    modalRef.current.close();
  }

  useEffect( () => {
    if( showQRcode ){
      setTimeout( ()=> {
        setFocus( 'CHECK_BALANCE' )
      }, focusShouldRetain || 0 )
    }
  }, [showQRcode] )

  useEffect( ()=>{
    return () => {
      hideModal()
    }
  }, [] )

  return (
    <div className='QrCodePopUp'>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          <Modal
            id='QrCodePopUpModalId'
            customClassName={ customClassName ? customClassName : info === '' ? 'QrCodePopUpModal' : 'QrCodePopUpModalDTHUsers' }
            ref={ modalRef }
            opener={ opener }
            handleCancel={ handleCancel }
            closeModalFn={ handleCancel }
            callBackFunc={ handleCancel }
            zeroAppsPlanCloseQrCode={ zeroAppsPlanCloseQrCode }
          >
            <div className='QrCodePopUp__content'>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='QrCodePopUp__content--goBack'>
                  <Button
                    onClick={ () => {
                      handleCancel()
                      zeroAppsPlanCloseQrCode && zeroAppsPlanCloseQrCode()
                    } }
                    iconLeftImage='GoBack'
                    iconLeft={ true }
                    secondary={ true }
                    size='small'
                    label={ goBack }
                  />
                </div>
              </FocusContext.Provider>

              <div className='QrCodePopUp__content--body'>
                { flexiCrown && <Image src={ flexiCrown } /> }
                { flexiHeading &&
                <Text textStyle='flexi-heading'
                  textAlign='center'
                >
                  { flexiHeading }
                </Text>
                }
                { primeInfo &&
                <Text textStyle='flexi-heading'
                  textAlign='center'
                >
                  { primeInfo }
                </Text>
                }
                { primeAdditionalInfo &&
                <Text textStyle='flexi-subHeading'
                  textAlign='center'
                >
                  { primeAdditionalInfo }
                </Text>
                }
                <Text textStyle='body-2'
                  textAlign='center'
                >
                  { info }
                </Text>
                <Text textStyle='flexi-subHeading'
                  textAlign='center'
                >
                  { flexiInfo }
                </Text>
                <Text textStyle='body-3'
                  textAlign='center'
                >
                  { additionalInfo }
                </Text>
                <Text textStyle='title-3'>
                  { heading }
                </Text>
                { url &&
                <div className='QrCodePopUp__content--QRCode'>
                  <QRCode
                    value={ url }
                    size={ +size }
                  />
                </div>
                }
                { doneCta &&
                <div className='QrCodePopUp__checkBalance QrCodePopUp__fibreDoneCTA'>
                  <Button
                    onFocus={ ()=>{
                      previousPathName.previousMediaCardFocusBeforeSplash = 'CHECK_BALANCE'
                    } }
                    label={ doneCta }
                    onClick={ () => {
                      handleCancel()
                      zeroAppsPlanCloseQrCode && zeroAppsPlanCloseQrCode()
                    } }
                    focusKeyRefrence={ 'CHECK_BALANCE' }
                  />
                </div> }
                { getDthStatus() === USERS.DTH_OLD_STACK_USER && props?.subscriptionType !== 'ANYWHERE' && balanceBtnLabel &&
                <div className='QrCodePopUp__checkBalance'>
                  <Button
                    onFocus={ ()=>{
                      previousPathName.previousMediaCardFocusBeforeSplash = 'CHECK_BALANCE'
                    } }
                    label={ balanceBtnLabel }
                    onClick={ () => checkBalanceEvent() }
                    focusKeyRefrence={ 'CHECK_BALANCE' }
                  />
                </div> }
              </div>
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
 * @property {string} goBack - Sets the Go back string
 * @property {string} heading - Sets the heading of the modal
 * @property {string} url - Sets the uel of the qr code
 * @property {string} size - Sets the size of qr code
 * @property {string} additionalInfo - Sets the additional info at end of the modal
 */
export const propTypes =  {
  modalRef: PropTypes.object,
  opener: PropTypes.object,
  goBack: PropTypes.string,
  heading: PropTypes.string,
  url: PropTypes.string,
  size: PropTypes.string,
  additionalInfo: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} size='136' - The default size of QR code
 */
export const defaultProps =  {
  size: '136'
};

QrCodePopUp.propTypes = propTypes;
QrCodePopUp.defaultProps = defaultProps;

export default QrCodePopUp;
