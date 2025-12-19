/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * The component each previously used logged in rmns for the previously used login screen
 *
 * @module views/components/PreviousUsedLogin
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './PreviousUsedLogin.scss';
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { formatMobileNumberWithEllipsis } from '../../../utils/util';
import Text from '../Text/Text';
import { useHistory } from 'react-router-dom';
import { setRmn } from '../../../utils/localStorageHelper';
import { LoginFormService } from '../../../utils/slayer/LoginFormService';
import Image from '../Image/Image';
import constants from '../../../utils/constants';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { login_get_otp, previouslyRMNClickOnRMN } from '../../../utils/mixpanel/mixpanelService';

/**
 * Represents a PreviousUsedLogin component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PreviousUsedLogin
 */
export const PreviousUsedLogin = function( props ){
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const { loginVerbiages, setIsLoginToggle } = useMaintainPageState()
  const [previuosLoginLoader, setPreviuosLoginLoader] = useState( false )
  const [genOtp] = LoginFormService( { inputValue: props.user?.mobileNumber, otpValue: '', newOtpFlow: config?.newOtpFlow } );
  const { genOTPFetchData, genOTPResponse, genOTPError, genOTPLoading } = genOtp;
  const { onFocus, focusKeyRefrence } = props
  const history = useHistory();
  const loaderPath = `${window.assetBasePath}loader.gif`;
  useEffect( () => {
    if( genOTPResponse?.code === 0 || genOTPError ){
      previouslyRMNClickOnRMN( props.user?.mobileNumber )
      setPreviuosLoginLoader( false )
      setRmn( props.user?.mobileNumber )
      if( genOTPResponse && genOTPResponse.data && Object.keys( genOTPResponse.data ).length > 0 ){
        loginVerbiages.current = {
          resendOTPVerbiage: genOTPResponse.data.resendOtpInVerbiage,
          enterOtpVerbiage: genOTPResponse.data.enterOtpVerbiage,
          resendOtpVerbiageAfterResend: genOTPResponse.data.resendOtpVerbiage,
          secondsVerbiage: genOTPResponse.data.secondsVerbiage,
          resendOtpHeading: genOTPResponse.data.resendOtpHeading
        }
      }
      setIsLoginToggle( false )
      history.push( {
        pathname: `/verify-otp`
      } )
      /* Mixpanel-event */
      login_get_otp();
    }
  }, [genOTPResponse, genOTPError] );
  const { ref, focused } = useFocusable( {
    onFocus,
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null,
    onEnterPress:()=>{
      setPreviuosLoginLoader( true )
      genOTPFetchData()
    } }
  );

  const onMouseUpCallFn = ()=> {
    setPreviuosLoginLoader( true )
    genOTPFetchData()
  }
  return (
    <div className='PreviousUsedLogin'>
      { previuosLoginLoader && (
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div className='Loader PreviousUsedLogin__loader'>
            <Image
              src={ loaderPath }
            />
          </div>
        </FocusContext.Provider>
      ) }
      <div
        className={ classNames(
          props.enableQrLoginJourney && !props.QrError ? 'PreviousUsedLogin__buttonQRLogin' : 'PreviousUsedLogin__button',
          {
            [`PreviousUsedLogin__button${props.enableQrLoginJourney && !props.QrError ? 'QRLogin' : ''}--withFocus`]: focused
          }
        ) }
        key={ props.index }
        ref={ ref }
        role='button'
        tabIndex='0'
        onMouseEnter={ props?.onMouseEnterCallBackFn }
        onMouseUp={ onMouseUpCallFn }
      >
        <Text
          textStyle='header-3'
          color='bingeBlue-25'
        >
          { formatMobileNumberWithEllipsis( props.user?.mobileNumber ) }
        </Text>

        { props.user?.premiumUser &&
        <div className={ props.enableQrLoginJourney && !props.QrError ? 'PreviousUsedLogin__premiumUserQRLogin' : 'PreviousUsedLogin__premiumUser' }>
          <Icon className='PreviousUsedLogin__icon'
            name={ 'CrownGoldForward' }
          />
        </div>
        }
        <Icon
          className='PreviousUsedLogin__forwardIcon'
          name={ 'ArrowForward' }
        />
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} user -  Sets the user info like mobile number and premium tag
 * @property {number} index -  Sets the index
 */
export const propTypes =  {
  user: PropTypes.object,
  index: PropTypes.number
};

PreviousUsedLogin.propTypes = propTypes;

export default PreviousUsedLogin;
