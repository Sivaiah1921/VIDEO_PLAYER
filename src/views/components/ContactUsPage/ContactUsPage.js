/**
 * This component will provide contact information
 *
 * @module views/components/ContactUsPage
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import './ContactUsPage.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import TSMoreService from '../../../utils/slayer/TSMoreService';
import { constants } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { modalDom } from '../../../../src/utils/util';
import parse from 'html-react-parser';
import Loader from '../Loader/Loader';
import { contact_us } from '../../../utils/mixpanel/mixpanelService';
import classNames from 'classnames';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
/**
 * Represents a ContactUsPage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ContactUsPage
 */
export const ContactUsPage = function( props ){
  const previousPathName = useNavigationContext();
  const history = useHistory();
  const { tSMoreLoading, tSMoreError, tSMoreResponse } = TSMoreService();
  const infoTextTop = tSMoreResponse?.data?.contactUs?.text1 || '';
  const infoTextBottom = tSMoreResponse?.data?.contactUs?.text2 || '';
  const heading = tSMoreResponse?.data?.contactUs?.heading || '';
  const subHeading = tSMoreResponse?.data?.contactUs?.subHeading || '';
  const contactUs = tSMoreResponse?.data?.contactUs || {};
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );

  useEffect( () => {
    if( previousPathName.contactUS ){
      setFocus( previousPathName.contactUS )
      previousPathName.contactUS = null
    }
    else {
      setFocus( 'BUTTON_FAQ' )
    }
    contact_us()
  }, [] )

  useEffect( () => {
    if( !tSMoreLoading && !modalDom() ){
      focusSelf()
    }
  }, [tSMoreLoading] );

  const onClickTerms = ( ) => {
    previousPathName.contactUS = 'BUTTON_TERMS'
    history.push( {
      pathname: '/terms-of-use'
    } )
  }

  const onClickFAQ = ( ) => {
    previousPathName.contactUS = 'BUTTON_FAQ'
    history.push( {
      pathname: '/faqs'
    } )
  }


  return (
    <div ref={ ref }>
      { tSMoreLoading ? <Loader /> : (
        <>
          <div className='ContactUsPage' >
            <FocusContext.Provider value={ focusKey }>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='ContactUsPage__header'>
                  <Button
                    onClick={ ()=> history.goBack() }
                    iconLeftImage='GoBack'
                    iconLeft={ true }
                    secondary={ true }
                    label={ constants.TOCLOSE }
                  />
                  <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
                </div>
              </FocusContext.Provider>
              <div className='ContactUsPage__title'>
                <Icon name={ constants.CONSTACT_US.icon } />
                <Text
                  color='white'
                  textStyle='title-2'
                >
                  { heading }
                </Text>
              </div>
              <div className='ContactUsPage__rootSection'>
                <div className='ContactUsPage__leftSection'>
                  <div className='ContactUsPage__helpSection'>
                    <Text
                      color='white'
                      textStyle='header-5'
                    >
                      { subHeading }
                    </Text>
                    <div className='ContactUsPage__helpSection--text'>
                      <div className='ContactUsPage__helpSection--textTop'>
                        <Text
                          textStyle='header-4'
                        >
                          { parse( infoTextTop ) }
                        </Text>
                      </div>
                      <div className='ContactUsPage__helpSection--textBottom'>
                        <Text
                          textStyle='header-4'
                        >
                          { parse( infoTextBottom ) }
                        </Text>
                      </div>
                    </div>
                    <div className='ContactUsPage__helpSection--button'>
                      <Button
                        onFocus={ ()=>{
                          previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_FAQ'
                          previousPathName.contactUS = 'BUTTON_FAQ'
                        } }
                        label={ constants.CONSTACT_US.btnTitleFAQ }
                        primary={ true }
                        size='large'
                        onClick={ onClickFAQ }
                        className={
                          classNames( 'ContactUsPage__helpSection--buttonFAQ' )
                        }
                        focusKeyRefrence='BUTTON_FAQ'
                      ></Button>
                      <Button
                        onFocus={ ()=>{
                          previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_TERMS'
                          previousPathName.contactUS = 'BUTTON_TERMS'
                        } }
                        label={ constants.CONSTACT_US.btnTitleTerms }
                        primary={ true }
                        size='large'
                        onClick={ onClickTerms }
                        className={
                          classNames( 'ContactUsPage__helpSection--buttonTerms' )
                        }
                        focusKeyRefrence='BUTTON_TERMS'
                      ></Button>
                    </div>
                  </div>
                </div>
                <div className='ContactUsPage__rightSection'>
                  { contactUs && contactUs.qrCodeLink &&
                  <div className='ContactUsPage__qrCode QrCodePopUp__content--QRCode'>
                    <QRCode
                      value={ contactUs.qrCodeLink }
                      size={ 250 }
                      fgColor={ '#220046' }
                    />
                  </div>
                  }
                  {
                    contactUs && contactUs.qrCodeText && (
                      <Text
                        color='white'
                        textStyle='title-2'
                      >
                        { parse( contactUs.qrCodeText ) }
                      </Text>
                    )
                  }
                </div>
              </div>
            </FocusContext.Provider>
          </div>
          <div className='ContactUsPage__background'></div>
        </>
      ) }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} icon - contact icon
 * @property {string} title - contact page title
 * @property {string} infoText - contact page info text
 * @property {string} email - contact email
 * @property {string} emailText - contact email label text
 * @property {string} telephoneText - telephone label text
 * @property {string} telephone - telephone no
 * @property {string} helpLinkTitle - help link title
 * @property {string} helpText - help text
 * @property {string} btnTitleFAQ - button label for FAQ
 * @property {string} btnTitleTerms - button label for terms
 * @property {func} onClickTerms - onclick function for terms button
 * @property {func} onClickFAQ - onclick function for FAQ button
 */
export const propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  infoText: PropTypes.string,
  email: PropTypes.string,
  emailText: PropTypes.string,
  telephoneText: PropTypes.string,
  telephone: PropTypes.string,
  helpLinkTitle: PropTypes.string,
  helpText: PropTypes.string,
  btnTitleFAQ: PropTypes.string,
  btnTitleTerms: PropTypes.string,
  onClickTerms: PropTypes.func,
  onClickFAQ: PropTypes.func
};


ContactUsPage.propTypes = propTypes;
export default ContactUsPage;
