/* eslint-disable no-console */
/**
 * Component provides parental pin setup info page
 *
 * @module views/components/ParentalPinSetupPage
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ParentalPinSetupPage.scss';
import NumberKeyboard from '../NumberKeyboard/NumberKeyboard';
import ParentalPinSetup from '../ParentalPinSetup/ParentalPinSetup';
import set from 'lodash/set';
import { COMMON_HEADERS, PAGE_TYPE, PROVIDER_LIST, constants, deepLinkPartners } from '../../../utils/constants';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import serviceConst from '../../../utils/slayer/serviceConst';
import { useAxios } from '../../../utils/slayer/useAxios';
import { getAuthToken, getBaID, getBingeSubscriberId, getDthStatus, getRmn, getSubscriberId } from '../../../utils/localStorageHelper';
import { parental_pin_incorrect, parental_pin_initiate, parental_pin_procced, parental_pin_init, my_account_current_subscription } from '../../../utils/mixpanel/mixpanelService';
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { getParamsTags, getPathName, launchPartnerApp } from '../../../utils/slayer/PlaybackInfoService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { PlayingEventApiCalling } from '../../../utils/slayer/PlayerService';
import { contentPlayMixpanelEventForDeeplink, getTAUseCaseId, redirection, userIsSubscribed } from '../../../utils/util';

/**
 * Represents a ParentalPinSetupPage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ParentalPinSetupPage
 */
export const ParentalPinSetupPage = function( props ){
  const { metaData, storedLastWatchData } = usePlayerContext()
  const lastWatchedSeconds = storedLastWatchData?.secondsWatched
  const episodeMeta = {
    type: metaData?.contentType,
    id: metaData?.vodId || metaData?.id
  };
  const [playerEventObj] = PlayingEventApiCalling( { metaData, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;

  const { numberPressed, setNumberPressed } = useHomeContext()
  const [wrongPin, setWrongPin] = useState( false )
  const [fourDigitPin, setFourDigitPin] = useState( false )
  const [value, setValue] = useState( [] )
  const [currentPlan, setCurrentPlan] = useState( null );
  const history = useHistory()
  const location = useLocation();
  const previousPathName = useNavigationContext()
  const count = 4
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack
  const { providerName, tagid, partnerDeepLinkUrl, contentId, contentType, subscriptionSuccess } =  location.args || {};
  const { liveContent, storeRailData } = useMaintainPageState();


  const parentalValidationParams = {
    url: serviceConst.PARENTAL_PIN_VALIDATE,
    method: 'POST',
    headers: {
      dthStatus: getDthStatus(),
      deviceType: COMMON_HEADERS.DEVICE_TYPE,
      authorization: getAuthToken(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      subscriberId: getSubscriberId(),
      platform: COMMON_HEADERS.PLATFORM
      // ppStatus: 'new'
    },
    data: {
      baId: getBaID(),
      bingeSubscriberId: getBingeSubscriberId(),
      mobileNumber: getRmn(),
      isLogin: true,
      contentAgeRating: ''
    }
  };

  const { fetchData, response, error, loading } = useAxios( {}, true );

  const changeState = ( o, data ) => {
    const appendArray = o.concat( parseInt( data, 10 ) )
    if( ( appendArray ).length <= 4 ){
      return appendArray
    }
    else {
      return o
    }
  }

  useEffect( ()=>{
    if( numberPressed.keyValue ){
      setValue( o => changeState( o, numberPressed.keyValue ) )
    }
  }, [numberPressed] )

  useEffect( () => {
    /* Mixpanel-event */
    parental_pin_initiate( previousPathName.current )
    parental_pin_init()
    return () => {
      setNumberPressed( {} )
    }
  }, [] )

  useEffect( ()=>{
    if( value.length === 4 ){
      setFourDigitPin( true )
    }
    else {
      setFourDigitPin( false )
    }
  }, [value] )

  useEffect( ()=>{
    if( myPlanProps ){
      const isSubscribed = userIsSubscribed( myPlanProps )
      setCurrentPlan( isSubscribed )
    }
  }, [myPlanProps] )

  const redirectionToSpecificScreen = () => {
    if( previousPathName.current?.includes( PAGE_TYPE.ACCOUNT_URL ) || previousPathName.current?.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION ) ){
      previousPathName.current?.includes( PAGE_TYPE.ACCOUNT_URL ) && my_account_current_subscription()
      if( currentPlan ){
        history.replace( '/plan/current' )
      }
      else {
        history.replace( '/plan/subscription' )
      }
      previousPathName.current = null
    }
    else if( providerName && ( deepLinkPartners.includes( providerName.toLowerCase() ) ) ){
      playerEventFetchData( { type: episodeMeta?.type, id:  episodeMeta?.id, watchDuration: 10 } );
      const taUseCaseId = getTAUseCaseId( storeRailData.current );
      contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
      launchPartnerApp( providerName, getParamsTags( providerName, partnerDeepLinkUrl, tagid, contentId ), contentType, liveContent, lastWatchedSeconds );
    }
    else if( subscriptionSuccess ){
      history.replace( redirection( myPlanProps ) )
    }
    else {
      const path = getPathName( metaData?.provider );
      history.replace( path )
    }
  }

  const appLaunchMethod = () => {
    if( response ){
      const code = response.code;
      if( code === 0 ){ // success case
        setWrongPin( false )
        redirectionToSpecificScreen()
      }
      else {
        setWrongPin( true )
        /* Mixpanel-event */
        parental_pin_incorrect( previousPathName.current )
      }
    }
  }

  useEffect( () => {
    appLaunchMethod( response )
  }, [response] );

  const onKeyboardPress = ( newValue ) => {
    if( !value || value?.length <= 3 ){
      setValue( [...value, newValue] )
    }
  }

  const onClearEvent = () => {
    setWrongPin( false )
    value.length = 0;
    setValue( [...value] )
  }

  const onRemoveEvent = () => {
    setWrongPin( false )
    setValue( [...value?.slice( 0, -1 )] )
  }

  const proceedSubmitFn = () => {
    /* Mixpanel-event */
    parental_pin_procced( previousPathName.current )
    const pinValue = value.join( '' )
    const pinPayload = { ...parentalValidationParams.data, parentalLock : pinValue }
    const updatedPayload = set( parentalValidationParams, 'data', pinPayload );
    fetchData( updatedPayload );
  }

  return (
    <div className='ParentalPinSetupPage'>
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='ParentalPinSetupPage__header'>
          <Button
            onClick={ ()=> history.goBack() }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.GOBACK }
          />
          <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
        </div>
      </FocusContext.Provider>
      <div className='ParentalPinSetupPage__content'>
        <NumberKeyboard
          onChange={ onKeyboardPress }
          clearBtnLabel={ constants.PARENTALPIN_SETUP.CLEARBTN_LABEL }
          deleteBtnLabel={ constants.PARENTALPIN_SETUP.DELETEBTN_LABEL }
          onClear={ onClearEvent }
          onRemove={ onRemoveEvent }
        />
        <ParentalPinSetup
          icon={ constants.PARENTALPIN_SETUP.ICON }
          title={ constants.PARENTALPIN_SETUP.TITLE }
          subtitle={ constants.PARENTALPIN_SETUP.SUBTITLE }
          count={ count }
          helpText={ constants.PARENTALPIN_SETUP.HELPTEXT }
          btnLabel={ constants.PARENTALPIN_SETUP.BUTTON_LABEL }
          inputValue={ value }
          proceedSubmitFn={ proceedSubmitFn }
          fourDigitPin={ fourDigitPin }
          wrongPin={ wrongPin }
        />
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} icon - parental pin icon
 * @property {string} title - parental pin title
 * @property {string} subtitle - parental pin subtitle
 * @property {string} helpText - parental pin help text
 * @property {number} count - no of digits code
 * @property {string} btnLabel - button label
 * @property {array} inputValue - input value
 * @property {func} onChange - set the onChange
 * @property {string} deleteBtnLabel - set the deleteBtnLabel
 * @property {string} clearBtnLabel - set the clearBtnLabel
 * @property {func} onClear - clear input
 * @property {func} onRemove - remove single item from input
 */
export const propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  count: PropTypes.number,
  helpText: PropTypes.string,
  btnLabel: PropTypes.string,
  inputValue: PropTypes.array,
  onChange: PropTypes.func,
  deleteBtnLabel: PropTypes.string,
  clearBtnLabel: PropTypes.string,
  onClear: PropTypes.func,
  onRemove: PropTypes.func
};


ParentalPinSetupPage.propTypes = propTypes;

export default ParentalPinSetupPage;
