/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * SelectDeviceCard card molecule
 *
 * @module views/components/SelectDeviceCard
 * @memberof -Common
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './SelectDeviceCard.scss';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { renew_plan } from '../../../utils/mixpanel/mixpanelService';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Checkbox from '../Checkbox/Checkbox';
import classNames from 'classnames';
import constants, { LAYOUT_TYPE } from '../../../utils/constants';
import Image from '../Image/Image';
import { cloudinaryCarousalUrl } from '../../../utils/util';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
/**
  * Represents a SelectDeviceCard component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns SelectDeviceCard
  */

const SelectDeviceCard = ( props ) => {
  const { deviceName, deviceType, iconImageArrow, url, focusKeyRefrence, baId, onFocus, index, blockFocus, isDeviceChecked, deviceId, isNotCurrentDevice, isPrimaryDevice, onSelected, isFromDeviceManagePage, lastActivity, primaryDeviceText, thisDeviceText, deviceIcon, isComplementaryAppsRender, isFromDeviceManagement = false } = props;
  const checkboxRef = useRef( )

  const { responseData } = useSubscriptionContext()
  const { fromRenewPurchase } = useMaintainPageState()
  const previousPathName = useNavigationContext();

  const { url: deviceUrl } = useAppContext();

  const history = useHistory();
  const { ref, focused } = useFocusable(
    {
      focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
      isFocusBoundary: true,
      onArrowPress: ( direction ) => {
        if( blockFocus ){
          if( direction === 'left' && isComplementaryAppsRender ){
            return true
          }
          else if( direction === 'right' || direction === 'left' ){
            return false;
          }
          else if( direction === 'up' && index === 0 ){
            return false;
          }
        }
      },
      onEnterPress:( ) => {
        if( !isFromDeviceManagement ){
          previousPathName.selectedPlanType = deviceName
        }
        togglingCheckBoxFn()
        if( props.onDeviceClick ){
          props.onDeviceClick( baId )
        }
        else if( url ){
          history.push( {
            pathname: url
          } )
        }
        if( url?.includes( '/plan/purchase/' ) ){
          fromRenewPurchase.current = true
          /* Mixpanel-events */
          renew_plan( responseData )
        }
      },
      onFocus
    }
  );

  const onMouseUpCallBackFn = () =>{
    if( !isFromDeviceManagement ){
      previousPathName.selectedPlanType = deviceName
    }
    togglingCheckBoxFn()
    if( props.onDeviceClick ){
      props.onDeviceClick( baId )
    }
    else if( url ){
      history.push( {
        pathname: url
      } )
    }
    if( url?.includes( '/plan/purchase/' ) ){
      fromRenewPurchase.current = true
      /* Mixpanel-events */
      renew_plan( responseData )
    }
  }

  const togglingCheckBoxFn = () =>{
    if( checkboxRef.current ){
      if( !checkboxRef.current.checked ){
        checkboxRef.current.checked = true
        onSelected( checkboxRef.current.checked, deviceId )
      }
      else {
        checkboxRef.current.checked = false
        onSelected( checkboxRef.current.checked, deviceId )
      }
    }
  }

  useEffect( () => {
    if( focusKeyRefrence ){
      setTimeout( () => {
        !isFromDeviceManagement && focusKeyRefrence.includes( 'CARD' ) && setFocus( 'CARD0' )
      }, 200 )
    }
  }, [] );

  let iconImage = props.iconImage
  if( deviceType === constants.OTHER_DEVICES ){
    iconImage = constants.NO_DEVICE_ICON
  }
  else if( deviceType === 'NA' ){
    iconImage = ''
  }
  else if( deviceType === 'plan-option' ){
    iconImage = props.iconImage
  }
  else {
    iconImage = 'SelectDeviceIcon'
  }

  return (
    <div
      className={
        classNames( 'SelectDeviceCard',
          { 'SelectDeviceCard--withFocus': focused,
            'SelectDeviceCard__withPrimaryDevice': isPrimaryDevice && lastActivity?.length > 0,
            'SelectDeviceCard__withCurrentDevice': !isNotCurrentDevice && thisDeviceText
          } )
      }
      ref={ ref }
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseUp={ onMouseUpCallBackFn }
    >
      <div className='SelectDeviceCard__topSection'>
        { iconImage === constants.NO_DEVICE_ICON ?
          (
            <Image
              alt={ 'DeviceIcon' }
              ariaLabel='Image'
              src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.DEVICE_MANAGEMENT_IMAGES, deviceUrl ) }/${ deviceIcon }` }
            />
          ) : (
            <Icon className='SelectDeviceCard__Icon'
              name={ iconImage }
            />
          )
        }
        <Text
          textStyle='body-2'
          color='white'
        >
          { deviceName }
        </Text>
        { isNotCurrentDevice && !isPrimaryDevice && (
          <Checkbox
            id={ deviceId }
            name={ deviceName }
            label={ deviceName }
            checked={ isDeviceChecked }
            isCustom={ true }
            checkboxRef={ checkboxRef }
            onChange={ () => {} }
          >
          </Checkbox>
        )
        }
        { thisDeviceText &&
        <Text
          textStyle='deviceManagementSubText'
          color='white'
        >
          { thisDeviceText || constants.THIS_DEVICE }
        </Text> }
      </div>
      { isFromDeviceManagePage && lastActivity?.length > 0 && (
        <div className='SelectDeviceCard__moddleSection'>
          <Text
            textStyle='deviceManagementSubText'
            color='white'
          >
            <span className='SelectDeviceCard__moddleSection--span'> { lastActivity[0] } </span>{ lastActivity[1] }
          </Text>
        </div>
      ) }
      { isPrimaryDevice && (
        <div className='SelectDeviceCard__primaryDeviceSection'>
          <Text
            textStyle='deviceManagementPrimaryText'
            color='white'
          >
            { primaryDeviceText }
          </Text>
        </div>
      ) }
      {
        iconImageArrow && (
          <Icon className='SelectDeviceCard__ArrowIcon'
            name={ iconImageArrow }
          />
        )
      }
    </div>
  );
};

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} deviceName - select card title
 * @property {string} iconImage - select card iconImage
 * @property {string} iconImageArrow - select card ArrowImg
 * @property {string} url - select card Url
 * @property {string} deviceType - select device type
 */
export const propTypes = {
  deviceName: PropTypes.string,
  iconImage: PropTypes.string,
  iconImageArrow: PropTypes.string,
  url: PropTypes.string,
  deviceType: PropTypes.string
};

SelectDeviceCard.propTypes = propTypes;

export default SelectDeviceCard;