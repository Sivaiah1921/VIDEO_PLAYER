/* eslint-disable no-console */
/**
 * This component provides Device management details
 *
 * @module views/components/DeviceManagementPage
 * @memberof -Common
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import './DeviceManagementPage.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import classNames from 'classnames';
import SelectDeviceCard from '../SelectDeviceCard/SelectDeviceCard';
import Button from '../Button/Button';
import { constants, PLAYER, USERS } from '../../../utils/constants';
import { PubnubHandling, SubscriberFormService, UpdateUserAPICall } from '../../../utils/slayer/SubscriberFormService';
import { DeviceManagementService } from '../../../utils/slayer/DeviceManagementService';
import { Notifications } from '../Notifications/Notifications';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { getAuthToken, getBaID, getCodeResponse, getDthStatus, getTVDeviceId, removeCodeResponse, setDeviceManagementFromLoginJourney, setLoginIcon, setLoginMsg, setRemovedDeviceNames, setUserStatus } from '../../../utils/localStorageHelper';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useLoginContext } from '../../core/LoginContextProvider/LoginContextProvider';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { getOldStackDeviceList, getOtherStackDeviceList, getPubnubChannelName, getScrollInputs, handleErrorMessage, modalDom, storeAllPaths, successfullyLogin, successfullyLoginRedirection, switchPubnubChannelHandling } from '../../../utils/util';
import { device_management, device_remove, device_rename, deviceListingview, deviceremoveSkip, listDevices } from '../../../utils/mixpanel/mixpanelService';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useUserContext } from '../../core/UserContextProvider/UserContextProvider';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import Divider from '../Divider/Divider';

/**
 * Represents a DeviceManagementPage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns DeviceManagementPage
 */
export const DeviceManagementPage = function( props ){
  const [isDeviceRemoved, setIsDeviceRemoved] = useState( false );
  const [isDeviceRenamed, setDeviceRenamed] = useState( false );
  const [totalDevicesList, setTotalDevicesList] = useState( [] )
  const [deviceVerbiages, setDeviceVerbiages] = useState( {} )
  const [isError, setIsError] = useState( false );
  const [isUserSelectDevice, setIsUserSelectDevice] = useState( false )

  const loader = useRef( false );
  const keyPositionRef = useRef( '' )
  const selectedDevicesRef = useRef()

  const { setSidebarList } = useHomeContext()
  const { setProfileAPIResult } = useProfileContext()
  const previousPathName = useNavigationContext()
  const { messages, onLogin } = usePubNubContext()
  const { metaData } = usePlayerContext()
  const history = useHistory();
  const { setBaid, responseData, currentResponseCondition } = useSubscriptionContext( ) || {};
  const { fromConfirmPurchase, fromSideMenuSubscribe, selectedDevicesIdsList } = useMaintainPageState();
  const { subscriber, setSubscriber } = useLoginContext( ) || {};
  const { setUser } = useUserContext() || {}
  const { ref, focusKey, focusSelf } = useFocusable(
    {
      isFocusBoundary: true
    }
  );

  const { code, message } = getCodeResponse() || ''
  const [deviceList] = SubscriberFormService( );
  const [removeDevice] = DeviceManagementService();
  const { deviceListFetchData, deviceListResponse, deviceListError, deviceListLoading } = deviceList;
  const { remDevFetchData, remDevResponse, remDevError, remDevLoading } = removeDevice;
  const [updateUser] = UpdateUserAPICall();
  const { updateUserFetchData, updateUserResponse, updateUserError, updateUserLoading } = updateUser;
  const [pubnubHandle] = PubnubHandling();
  const { pubnubFetchData } = pubnubHandle;

  const myPlanProps = responseData.currentPack

  const fetchDevice = () => {
    onLogin( false )
    !loader.current && deviceListFetchData?.( { baId: getBaID() } );
  }

  const renameDeviceHandler = ( deviceName, baId, subcriptionId, deviceNumber, index ) => {
    previousPathName.loggedInDeviceId = index
    history.push( {
      pathname: '/device/renameDevice',
      args: {
        deviceName: deviceName,
        baId: subcriptionId,
        subscriberId: baId,
        deviceNumber: deviceNumber
      }
    } )
    /* MixPanel-Event */
    device_rename()
  };

  const checkUserType = ( newUser, myPlanProps ) => {
    successfullyLoginRedirection( setSidebarList, previousPathName, newUser, myPlanProps, history, fromConfirmPurchase, metaData, fromSideMenuSubscribe )
  }

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `SELECT_${id}` )
  }

  const onSelected = ( isChecked, deviceId ) =>{
    const UpdatedList = totalDevicesList?.map( ( item )=> {
      if( item.deviceNumber === deviceId ){
        return { ...item, isChecked: isChecked }
      }
      return item
    } )
    const selectedDevicesIds = UpdatedList.filter( item => item.isChecked ).map( item => item.deviceNumber )
    const selectedDevicesNames = UpdatedList.filter( item => item.isChecked ).map( item => item.deviceName )
    selectedDevicesIdsList.current = selectedDevicesIds || []
    selectedDevicesRef.current = selectedDevicesNames || []
    setIsUserSelectDevice( selectedDevicesIdsList.current.length > 0 )
    setTotalDevicesList( UpdatedList )
  }

  const onRailFocus = useCallback( ( { y, ...rest }, typeOfCta ) => {
    if( ref.current ){
      const value1 = typeOfCta === 'deviceCta' ? 100 : 135
      const value2 = typeOfCta === 'deviceCta' ? 140 : 165
      const scrollValue = getScrollInputs( value1, value2 )
      if( keyPositionRef.current === 'up' ){
        ref.current.scrollTop = y - scrollValue
      }
      else {
        ref.current.scrollTop = y - scrollValue
      }
    }
  }, [ref] );

  const onKeyPress = useCallback( ( e ) => {
    if( e.keyCode === PLAYER.UP ){
      keyPositionRef.current = 'up'
    }
    else if( e.keyCode === PLAYER.DOWN ){
      keyPositionRef.current = 'down'
    }
  } );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  useEffect( () => {
    if( updateUserError ){
      onLogin( false )
      setLoginMsg( updateUserError.message )
      setLoginIcon( 'Alert' )
    }
    else if( updateUserResponse && updateUserResponse.code !== 0 ){
      onLogin( false )
      setLoginMsg( updateUserResponse.message )
      setLoginIcon( 'Alert' )
    }
    if( updateUserResponse && updateUserResponse?.data ){
      if( updateUserResponse?.code === 0 ){
        successfullyLogin( updateUserResponse )
        setUserStatus( constants.UPDATE_USER )
        setProfileAPIResult( {
          data: 'LoginDeviceCall'
        } )
        updateUserResponse.data?.userAuthenticateToken && setBaid( updateUserResponse.data?.baId )
        onLogin( false )
        switchPubnubChannelHandling( getDthStatus(), pubnubFetchData, 'pubnub' )
        setUser( updateUserResponse.data )
      }
    }
  }, [updateUserResponse, updateUserError] )

  useEffect( () => {
    if( !deviceListLoading && !modalDom() ){
      focusSelf()
    }
  }, [deviceListLoading] );

  useEffect( () => {
    if( deviceListError ){
      setIsError( true )
    }
  }, [deviceListError] )

  useEffect( ()=>{
    deviceListFetchData?.( { baId: getBaID() } );
    /* MixPanel-Event */
    device_management()
    if( !getAuthToken() ){
      storeAllPaths( window.location.pathname )
      setDeviceManagementFromLoginJourney( true )
    }
  }, [] )
  useEffect( () => {
    if( deviceListResponse ){
      if( deviceListResponse.code === 0 ){
        if( previousPathName.loggedInDeviceId !== null ){
          setFocus( `DEVICE_${previousPathName.loggedInDeviceId}` )
          previousPathName.loggedInDeviceId = null
        }
        onLogin( false )
        if( !getAuthToken() && isDeviceRemoved ){
          setTimeout( () => {
            updateUserFetchData( subscriber )
          }, 1000 );
        }
        const updatedDeviceList = deviceListResponse.data?.deviceList.map( ( value )=> {
          const isChecked = selectedDevicesIdsList.current?.includes( value.deviceNumber );
          return { ...value, isChecked:isChecked }
        } )
        setTotalDevicesList( updatedDeviceList )
        setDeviceVerbiages( deviceListResponse.data?.verbiages )
        setIsUserSelectDevice( selectedDevicesIdsList.current.length >= 1 )
        const deviceNamesList = deviceListResponse.data?.deviceList.map( item => item.deviceName )
        /* MixPanel-Event */
        deviceListingview( deviceNamesList )
        getAuthToken() && listDevices( deviceNamesList )
      }
      else {
        setIsError( true )
      }
    }
  }, [deviceListResponse] )

  useEffect( () =>{
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        const oldStackDeviceList = getOldStackDeviceList( pubnubPush )
        if( getAuthToken() && deviceListResponse?.data && !deviceListLoading && oldStackDeviceList && oldStackDeviceList.length !== deviceListResponse.data?.deviceList?.length ){
          fetchDevice()
        }
        else if( getAuthToken() && deviceListResponse && !deviceListLoading && oldStackDeviceList && oldStackDeviceList.length === deviceListResponse.data?.deviceList?.length ){
          const results = oldStackDeviceList.filter( ( { deviceId: id1 } ) => !deviceListResponse.data.deviceList.some( ( { deviceNumber: id2 } ) => id2 === id1 ) );
          results && results.length > 0 && fetchDevice()
        }
      }
      else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        const otherStackDeviceList = getOtherStackDeviceList( pubnubPush )
        if( getAuthToken() && deviceListResponse && !deviceListLoading && otherStackDeviceList && otherStackDeviceList.length !== deviceListResponse.data?.deviceList?.length ){
          fetchDevice()
        }
        else if( getAuthToken() && deviceListResponse && !deviceListLoading && otherStackDeviceList && otherStackDeviceList.length === deviceListResponse.data?.deviceList?.length ){
          const results = otherStackDeviceList.filter( ( { deviceId: id1 } ) => !deviceListResponse.data.deviceList.some( ( { deviceNumber: id2 } ) => id2 === id1 ) );
          results && results.length > 0 && fetchDevice()
        }
      }
    }
  }, [messages[getPubnubChannelName()]?.message, deviceListResponse, deviceListLoading] )

  useEffect( () => {
    if( remDevResponse?.code === 0 ){
      setRemovedDeviceNames( selectedDevicesRef.current )
      /* MixPanel-Event */
      device_remove( selectedDevicesIdsList.current )
      !getAuthToken() && (
        loader.current = true
      )
      setIsDeviceRemoved( true );
      selectedDevicesIdsList.current = []
      setTimeout( () => {
        setIsDeviceRemoved( false );
      }, 3000 );
      deviceListFetchData?.( { baId: getBaID() } );
    }
  }, [remDevResponse] )

  useEffect( () => {
    if( code === 0 ){
      setDeviceRenamed( true );
      setTimeout( () => {
        removeCodeResponse()
        setDeviceRenamed( false );
      }, 3000 );
    }
  }, [code] );

  useEffect( () => {
    if( updateUserResponse ){
      if( typeof currentResponseCondition.current === 'boolean' && currentResponseCondition.current && myPlanProps && Object.keys( myPlanProps ).length > 0 ){
        checkUserType( false, myPlanProps )
      }
      else if( typeof currentResponseCondition.current === 'boolean' && !currentResponseCondition.current && myPlanProps && Object.keys( myPlanProps ).length === 0 ){
        checkUserType( false, myPlanProps )
      }
    }
  }, [myPlanProps, currentResponseCondition, updateUserResponse] )

  return (
    <React.Fragment>
      <div ref={ ref }>
        {
          Boolean( deviceListLoading || loader.current ) ?
            (
              <FocusContext.Provider focusable={ false }
                value=''
              ><Loader /></FocusContext.Provider>
            ) : (
              <div className='DeviceManagementPage'>
                <FocusContext.Provider value={ focusKey }>
                  { isError ? (
                    <div>
                      <ErrorPage error={ handleErrorMessage( deviceListError, deviceListResponse, constants.ERROR_MSG ) }/>
                    </div>
                  ) : (
                    <>
                      <FocusContext.Provider focusable={ false }
                        value=''
                      >
                        <div className='DeviceManagementPage__topHeader'>
                          <Button
                            onClick={ ()=>{
                              getAuthToken() ? history.goBack() : history.go( -2 ) // For 5th user login scenario user land to Devicemanagementpage and  when user clicks back key we land to OTP screen.
                              /* MixPanel-Event */
                              deviceremoveSkip()
                            } }
                            iconLeftImage='GoBack'
                            iconLeft={ true }
                            secondary={ true }
                            label={ constants.TOCLOSE }
                          />
                          <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO }/>
                        </div>
                      </FocusContext.Provider>
                      <div className='DeviceManagementPage__header'>
                        <Icon name='DeviceManagement32x32' />
                        <Text
                          textStyle='title-2'
                          color='white'
                        >
                          { getAuthToken() ? constants.DEVICE_MANAGEMENT : constants.DEVICE_LIMIT_EXCEEDED }
                        </Text>
                      </div>
                      <div className='DeviceManagementPage__detail'>
                        <div
                          className={ classNames( { 'DeviceManagementPage__detail--subSectionLogin': !getAuthToken(),
                            'DeviceManagementPage__detail--subSection': getAuthToken()
                          } )
                          }
                        >
                          <div className='DeviceManagementPage__detail--subSection__loggedDevices'>
                            <Text
                              textStyle='title-2'
                              color='white'
                            >
                              { deviceVerbiages?.header }
                            </Text>
                            <Text
                              textStyle='autoPlay-subtitle'
                              color='white'
                            >
                              { deviceVerbiages?.subHeader }
                            </Text>
                          </div>
                          <div
                            className={
                              classNames( 'DeviceManagementPage__detail--deviceSection',
                                { 'DeviceManagementPage__detail--deviceSectionLoggedInUser': getAuthToken(),
                                  'DeviceManagementPage__detail--deviceSectionNotLoggedInUser': !getAuthToken()
                                } )
                            }
                          >
                            { totalDevicesList?.length > 0 &&
                            <div className='DeviceManagementPage__detail--deviceList'>
                              <div
                                ref={ ref }
                                id='scrollContainer'
                                className='DeviceManagementPage__listScroll'
                              >
                                <InfiniteScroll
                                  dataLength={ 1 }
                                  scrollableTarget='scrollContainer'
                                >
                                  { totalDevicesList?.map( ( device, index ) => (
                                    <div className='DeviceManagementPage__detail--device'>
                                      <SelectDeviceCard
                                        deviceType={ constants.OTHER_DEVICES }
                                        deviceName={ device.deviceName }
                                        deviceId={ device.deviceNumber }
                                        url={ device.url }
                                        isDeviceChecked={ device.isChecked }
                                        onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( device.deviceNumber ) }
                                        focusKeyRefrence={ 'SELECT_' + device.deviceNumber }
                                        isNotCurrentDevice={ device.deviceNumber !== getTVDeviceId() }
                                        onSelected={ onSelected }
                                        isFromDeviceManagePage={ true }
                                        onFocus={ ( e ) => onRailFocus( e, 'deviceCta' ) }
                                        isPrimaryDevice={ device.primary }
                                        lastActivity={ device.lastActivity?.split( /<\/?b>/ )?.filter( Boolean ) }
                                        primaryDeviceText={ device.primaryDeviceText }
                                        thisDeviceText={ device.thisDeviceText }
                                        deviceIcon={ device.deviceIcon }
                                        isFromDeviceManagement={ true }
                                      />
                                      { getAuthToken() && (
                                        <Button
                                          textStyle='buttonInputText'
                                          label={ constants.RENAME }
                                          size='medium'
                                          secondary={ true }
                                          className='DeviceManagementPage__detail--renameBtn'
                                          key={ index }
                                          onFocus={ ( e ) => onRailFocus( e, 'buttonCta' ) }
                                          focusKeyRefrence={ `DEVICE_${index + 1}` }
                                          onClick={ () => renameDeviceHandler( device.deviceName, device.baId, device.subscriptionId, device.deviceNumber, index + 1 ) }
                                        />
                                      ) }
                                    </div>
                                  ) ) }
                                </InfiniteScroll>
                              </div>
                            </div>
                            }
                            <div className='DeviceManagementPage__detail--deviceListScroll'>
                              <Divider vertical={ true } />
                            </div>
                          </div>
                          { deviceVerbiages?.deviceFooterMessage && (
                            <div
                              className={ classNames( { 'DeviceManagementPage__detail--deviceCountInfo': !getAuthToken(),
                                'DeviceManagementPage__detail--deviceCountInfoLoggedIn': getAuthToken()
                              } )
                              }
                            >
                              <Text
                                textStyle='subtitle-3'
                                color='white'
                              >
                                { deviceVerbiages.deviceFooterMessage }
                              </Text>
                            </div>
                          ) }
                          { isUserSelectDevice ? (
                            <div
                              className={
                                classNames( 'DeviceManagementPage__detail--removeDevice',
                                  { 'DeviceManagementPage__detail--removeDeviceLoggedIn': getAuthToken(),
                                    'DeviceManagementPage__detail--removeDeviceNotLoggedIn': !getAuthToken()
                                  } )
                              }
                            >
                              <Button
                                label={ selectedDevicesIdsList.current.length >= 2 ? deviceVerbiages?.ctaMultiSelectionVerbiage : deviceVerbiages?.ctaSingleSelectionVerbiage }
                                size='medium'
                                focusKeyRefrence={ 'REMOVE_BUTTON' }
                                onClick={ ()=> remDevFetchData( selectedDevicesIdsList.current ) }
                              />
                            </div>
                          ) : (
                            <div
                              className={
                                classNames( 'DeviceManagementPage__detail--removeDevice',
                                  { 'DeviceManagementPage__detail--removeDeviceLoggedIn': getAuthToken(),
                                    'DeviceManagementPage__detail--removeDeviceNotLoggedIn': !getAuthToken()
                                  } )
                              }
                            >
                              <FocusContext.Provider value=''
                                focusable={ false }
                              >
                                <Button
                                  label={ deviceVerbiages?.ctaSingleSelectionVerbiage }
                                  size='medium'
                                  disabled={ true }
                                  notFossabeButton
                                />
                              </FocusContext.Provider>
                            </div>
                          ) }
                        </div>
                      </div>
                      { ( isDeviceRemoved || isDeviceRenamed ) &&
                      <div className='DeviceManagementPage__notification'>
                        <Notifications
                          iconName='Success'
                          message={ isDeviceRenamed ? message : constants.DEVICE_REMOVED_SUCCESS_MESSAGE }
                        />
                      </div>
                      }
                    </>
                  ) }
                </FocusContext.Provider>
              </div>
            ) }
      </div>
    </React.Fragment>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - Page Title
 * @property {string} sectionTitle - Section title
 * @property {string} sectionText - Section help Text
 * @property {string} primaryDeviceTitle - Primary device title
 * @property {string} deviceInfoText - Primary device selected info text
 * @property {string} deviceCountInfo - Primary device count info text
 * @property {string} otherDeviceTitle - Other devices title
 * @property {array} deviceList - All devices list inclues primary & secondary devices
 */
export const propTypes = {
  title: PropTypes.string,
  sectionTitle: PropTypes.string,
  sectionText: PropTypes.string,
  primaryDeviceTitle: PropTypes.string,
  deviceInfoText: PropTypes.string,
  deviceCountInfo: PropTypes.string,
  otherDeviceTitle: PropTypes.string,
  deviceList: PropTypes.arrayOf(
    PropTypes.shape( {
      iconImage: PropTypes.string,
      deviceName: PropTypes.string,
      iconImageArrow: PropTypes.string,
      url: PropTypes.string,
      btnLabel: PropTypes.string,
      isPrimary: PropTypes.bool
    } )
  )
};



DeviceManagementPage.propTypes = propTypes;
export default DeviceManagementPage;