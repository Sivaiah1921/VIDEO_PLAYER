/* eslint-disable no-console */

/**
 * This component gives the details about subscription
 *
 * @module views/components/SubscriberForm
 * @memberof -Common
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './SubscriberForm.scss';
import SubscriberCard from '../SubscriberCard/SubscriberCard';
import Text from '../Text/Text';
import { SubscriberDetailAPICall, CreateUserAPICall, UpdateUserAPICall, formatResponse, PubnubHandling } from '../../../utils/slayer/SubscriberFormService';
import constants, { ABMainFeature, ABSearchVariants, COMMON_HEADERS, PAGE_TYPE, USERS } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import Loader from '../Loader/Loader';
import { getBaID, setBaID, setBingeSubscriberId, setDthStatus, setSubscriberId, setLoginMsg, setLoginIcon, setProfileId, removeLoginIcon, removeLoginMsg, getRmn, getAuthToken, getAllLoginPath, setAllLoginPath, setUserStatus, setReferenceID, getPiLevel, getDthStatus, setABTestingData } from '../../../utils/localStorageHelper';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import { useLoginContext } from '../../core/LoginContextProvider/LoginContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { useUserContext } from '../../core/UserContextProvider/UserContextProvider';
import { loginBingeIdPageProceed, loginBingeIdPageVisit, loginSubIdPageProceed, loginSubIdPageVisit, login_failure, login_sid_enter, login_sid_select, login_subscription_select } from '../../../utils/mixpanel/mixpanelService';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { clearPILevelWhenComeBackToPI, handleErrorMessage, setMixpanelData, storeAllPaths, subscriberIdVerbiage, successfullyLogin, successfullyLoginRedirection, switchPubnubChannelHandling } from '../../../utils/util';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import Button from '../Button/Button';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { AssignedVariant } from '../../../utils/slayer/HomeService';
/**
   * Represents a SubscriberForm component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns SubscriberForm
   */
export const SubscriberForm = function( props ){
  const [apiError, setApiError] = useState();
  const [selectedsSubscriber, setSelectedSubscriber] = useState()
  const [showSubscriberCard, setShowSubscriberCard] = useState( false )
  const [customLoading, setCustomLoading] = useState( false )
  const [arrowDown, setArrowDown] = useState( false );
  const [isError, setIsError] = useState( false );

  const newUser = useRef( false )

  const { setSidebarList } = useHomeContext()
  const { fromConfirmPurchase, fromSideMenuSubscribe, isQrCodeJourney, QrLoginDetails, setFromNewLogin, isPubnubWrapper } = useMaintainPageState()
  const { setProfileAPIResult } = useProfileContext()
  const previousPathName = useNavigationContext()
  const { onLogin } = usePubNubContext()
  const { metaData } = usePlayerContext()
  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } );
  const { setBaid, responseData, currentResponseCondition, error, loading: currentLoading } = useSubscriptionContext( ) || {};
  const { subscriber, setSubscriber } = useLoginContext( ) || {};
  const { setUser } = useUserContext() || {}

  const [subscriberList] = SubscriberDetailAPICall( );
  const { subListFetchData, subListResponse, subListError, subListLoading } = subscriberList;

  const [createUser] = CreateUserAPICall();
  const { createUserFetchData, createUserResponse, createUserError, createUserLoading } = createUser;

  const [updateUser] = UpdateUserAPICall();
  const { updateUserFetchData, updateUserResponse, updateUserError, updateUserLoading } = updateUser;

  const [pubnubHandle] = PubnubHandling();
  const { pubnubFetchData, pubnubResponse, pubnubError } = pubnubHandle;

  const history = useHistory();

  const { configResponse } = useAppContext();
  const { config } = configResponse;

  const BackgroundImage = config?.welcomeScreen?.backgroundImage;
  const myPlanProps = responseData.currentPack

  const [assignedVariantData] = AssignedVariant()
  const { assignedVariant, assignedVariantResponse, assignedVariantLoading, assignedVariantError } = assignedVariantData
  const updateAuth = ( selectedsSubscriber ) => {
    const loginType = isQrCodeJourney ? constants.QR_JOURNEY : constants.OTP;
    if( selectedsSubscriber ){
      setSubscriberId( selectedsSubscriber.subscriberId )
      setDthStatus( selectedsSubscriber.dthStatus )
      /* Mixpanel-events */
      if( !isQrCodeJourney ){
        loginBingeIdPageProceed( selectedsSubscriber )
      }
      setCustomLoading( true )
      const formattedResponse = formatResponse( selectedsSubscriber, loginType )
      updateUserFetchData( formattedResponse );
      setSubscriber( formattedResponse )
      setBingeSubscriberId( formattedResponse.bingeSubscriberId )
    }
  }

  const checkUserType = ( newUser, myPlanProps ) => {
    setFromNewLogin( false )
    successfullyLoginRedirection( setSidebarList, previousPathName, newUser, myPlanProps, history, fromConfirmPurchase, metaData, fromSideMenuSubscribe )
    isPubnubWrapper.current = true
  }

  const onCardClick = ( res ) => {
    /* Mixpanel-events */
    login_subscription_select( res.subscriptionId )
    login_sid_select( res.subscriberId )
    loginSubIdPageProceed( res.subscriberId )
    login_sid_enter( res.subscriberId )
    setCustomLoading( true )
    setSelectedSubscriber( res )
    updateAuth( res )
  }

  const showLoader = () => {
    if( getAuthToken() ){
      return customLoading || currentLoading
    }
    else {
      return customLoading
    }
  }

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `subscriberCard${id}` )
  }

  const mousePointerClick = () => {
    history.goBack()
    setAllLoginPath( [] )
    setTimeout( () => {
      const piLevelClear = getPiLevel()
      clearPILevelWhenComeBackToPI( piLevelClear, window.location.pathname )
    }, 10 );
  }

  const onRailFocus = useCallback( ( { y, ...rest } ) => {
    rest.top > 550 ? setArrowDown( true ) : setArrowDown( false );
    if( ref.current ){
      ref.current.scrollTop = rest.top - 550
    }
  }, [ref] );

  useEffect( ()=>{
    if( getRmn() && !isQrCodeJourney ){
      setCustomLoading( true )
      subListFetchData()
    }
    storeAllPaths( window.location.pathname )
  }, [] )

  useEffect( () => {
    setFocus( 'subscriberCard0' )
  }, [focusSelf] );

  useEffect( () => {
    if( subListError ){
      setCustomLoading( false )
      setApiError( subListError )
      setIsError( true )
    }
    else if( subListResponse && subListResponse.code !== 0 ){
      setCustomLoading( false )
      setApiError( subListResponse )
      setIsError( true )
    }
    if( ( subListResponse && subListResponse.data && Array.isArray( subListResponse.data.accountDetails ) ) ){
      if( subListResponse.data.accountDetails.length === 0 ){
        setCustomLoading( true )
        const formattedResponse = {
          'dthStatus': 'Non DTH User',
          'eulaChecked': true,
          'isPastBingeUser': false,
          'login': 'OTP',
          'subscriberId': getRmn(),
          'mobileNumber':  getRmn(),
          'packageId': '',
          'referenceId': null
        }
        createUserFetchData( formattedResponse );
      }
      if( subListResponse.data.accountDetails.length === 1 ){
        if( subListResponse.data.accountDetails[0].dthStatus === USERS.DTH_WITHOUT_BINGE ){
          setDthStatus( subListResponse.data.accountDetails[0].dthStatus )
          setSubscriberId( subListResponse.data.accountDetails[0].subscriberId )
          const formattedResponse = {
            'dthStatus': subListResponse.data.accountDetails[0].dthStatus,
            'eulaChecked': true,
            'isPastBingeUser': false,
            'login': 'OTP',
            'subscriberId': subListResponse.data.accountDetails[0].subscriberId,
            'mobileNumber':  getRmn(),
            'packageId': '',
            'referenceId': null
          }
          createUserFetchData( formattedResponse );
          // eslint-disable-next-line no-console
          console.log( 'create user' )
        }
        else {
          // eslint-disable-next-line no-console
          console.log( 'update user' )
          updateAuth( subListResponse.data.accountDetails[0] );
        }
        setSelectedSubscriber( subListResponse.data.accountDetails[0] )
      }
      if( subListResponse.data.accountDetails.length > 1 ){
        /* Mixpanel-events */
        loginBingeIdPageVisit()
        loginSubIdPageVisit()
        setFocus( 'subscriberCard0' )
        setCustomLoading( false )
        setShowSubscriberCard( true );
      }
    }

    if( QrLoginDetails ){
      updateAuth( QrLoginDetails );
    }

  }, [subListResponse, subListError, QrLoginDetails] )

  useEffect( () => {
    if( selectedsSubscriber && Object.keys( selectedsSubscriber ).length > 0 ){
      setProfileId( selectedsSubscriber.profileId );
      setReferenceID( selectedsSubscriber.referenceId );
    }
  }, [selectedsSubscriber] )

  useEffect( () => {
    if( updateUserError ){
      setCustomLoading( false )
      setApiError( updateUserError )
      setIsError( true )
      setLoginMsg( updateUserError.message )
      setLoginIcon( 'Alert' )
      login_failure( updateUserError.message || constants.SOMETHING_WENT_WRONG, updateUserError.code )
    }
    else if( updateUserResponse && updateUserResponse.code !== 0 ){
      setCustomLoading( false )
      setApiError( updateUserResponse )
      setIsError( true )
      login_failure( updateUserResponse.message || constants.SOMETHING_WENT_WRONG, updateUserResponse.code )
    }

    if( updateUserResponse && updateUserResponse.data ){
      if( updateUserResponse?.code === 0 ){
        successfullyLogin( updateUserResponse )
        setUserStatus( constants.UPDATE_USER )
        setProfileAPIResult( {
          data: 'LoginDeviceCall'
        } )
        setCustomLoading( false )
        updateUserResponse.data?.userAuthenticateToken && setBaid( updateUserResponse.data?.baId )
        onLogin( false )
        switchPubnubChannelHandling( getDthStatus(), pubnubFetchData, 'pubnub' )
        newUser.current = false
        setMixpanelData( 'loginType', MIXPANELCONFIG.VALUE.PREVUSED )
        setUser( updateUserResponse.data )
      }
      else if( updateUserResponse.code === 200007 || updateUserResponse.message === constants.DEVICE_LIMIT_EXCEED ){
        login_failure( updateUserResponse.message || constants.SOMETHING_WENT_WRONG, updateUserResponse.code )
        onLogin( false )
        setCustomLoading( false )
        setSubscriberId( selectedsSubscriber?.subscriberId )
        setBaID( selectedsSubscriber?.baId )
        setDthStatus( selectedsSubscriber?.dthStatus )
        history.push( { pathname: `/device/setting/device-management/${ getBaID() }/${ COMMON_HEADERS.DEVICE_ID }` } )
      }
      else {
        setCustomLoading( false )
        removeLoginMsg();
        removeLoginIcon();
        setApiError( { message: updateUserResponse.message || constants.SUBSCRIBER_NOT_FOUND } )
        setIsError( true )
        login_failure( updateUserResponse.message || constants.SUBSCRIBER_NOT_FOUND, updateUserResponse.code )
      }
    }
    else if( updateUserResponse && updateUserResponse.code === 0 && !updateUserResponse.data ){
      setCustomLoading( false )
      removeLoginMsg();
      removeLoginIcon();
      setApiError( { message: constants.SOMETHING_WENT_WRONG } )
      setIsError( true )
      login_failure( updateUserResponse.message || constants.SOMETHING_WENT_WRONG, updateUserResponse.code )
    }
  }, [updateUserResponse, updateUserError] )

  useEffect( () => {
    if( ( createUserResponse && createUserResponse.code === 0 ) || ( updateUserResponse && updateUserResponse.code === 0 ) ){
      if( currentResponseCondition.current === true && myPlanProps && Object.keys( myPlanProps ).length > 0 ){
        checkUserType( newUser, myPlanProps )
      }
      else if( currentResponseCondition.current === false && myPlanProps && Object.keys( myPlanProps ).length === 0 ){
        checkUserType( newUser, myPlanProps )
      }
      else if( myPlanProps && Object.keys( myPlanProps ).length === 0 && error?.response?.status !== 401 ){
        checkUserType( newUser, myPlanProps )
      }
    }
  }, [myPlanProps, currentResponseCondition, error] )

  useEffect( () => {
    if( createUserError ){
      setCustomLoading( false )
      setApiError( createUserError )
      setIsError( true )
      setLoginMsg( createUserError.message )
      setLoginIcon( 'Alert' )
    }
    else if( createUserResponse && createUserResponse.code !== 0 ){
      setCustomLoading( false )
      setApiError( createUserResponse )
      setIsError( true )
    }
    else if( createUserResponse && !createUserResponse.data ){
      setCustomLoading( false )
      setApiError( { message: constants.SOMETHING_WENT_WRONG } )
      setIsError( true )
    }
    else if( createUserResponse && createUserResponse.data ){
      successfullyLogin( createUserResponse )
      setProfileAPIResult( {
        data: 'LoginDeviceCall'
      } )
      setUserStatus( constants.NEW_USER )
      setCustomLoading( false )
      createUserResponse.data?.userAuthenticateToken && setBaid( createUserResponse.data?.baId )
      onLogin( false )
      switchPubnubChannelHandling( getDthStatus(), pubnubFetchData, 'pubnub' )
      newUser.current = true
      setMixpanelData( 'loginType', MIXPANELCONFIG.VALUE.NEW )
      setUser( createUserResponse.data )
    }
  }, [createUserResponse, createUserError] )

  useEffect( ()=>{
    if( getAuthToken() ){
      assignedVariant()
    }

  }, [getAuthToken()] )

  const getVariantName = ( featureKey )=>{
    if( getAuthToken() && assignedVariantResponse ){
      let address;
      const enableFeature = assignedVariantResponse?.data?.find( f => f.featureKey?.toUpperCase() === featureKey );
      if( enableFeature ){
        const key = enableFeature.assignedTestVariant?.testKey?.toUpperCase();
        address = enableFeature.assignedTestVariant?.address || '';
        let experimentKey = enableFeature?.experimentKey
        let segment = enableFeature?.segment
        let variantName = enableFeature.assignedTestVariant?.description
        setABTestingData( featureKey, {
          experimentKey: experimentKey,
          segment: segment,
          variant: variantName,
          address: address
        } );
      }
    }
  }

  useEffect( ()=>{
    ABSearchVariants.currentSearchVariant = getVariantName(
      ABMainFeature.searchFeature
    );

    ABSearchVariants.currentRecommendationVariant = getVariantName(
      ABMainFeature.railRecommendation
    );
    ABSearchVariants.currentRecommendationVariant = getVariantName(
      ABMainFeature.railGuestRecommendation
    );
    ABSearchVariants.currentliveRelatedRecommendationVariant = getVariantName(
      ABMainFeature.liveRelatedRecommendation
    );
    ABSearchVariants.currentwebShortRelatedRecommendationVariant = getVariantName(
      ABMainFeature.webShortRelatedRecommendation
    );
  }, [assignedVariantResponse] )

  // useEffect( ()=>{
  //   if( pubnubResponse && pubnubResponse.data ){
  //     const swicthingChannelName = true ? 'centrifuge' : 'pubnub'
  //     const modifiedData = { ...pubnubResponse.data, pubsub: ['pubnub', 'centrifuge'] }
  //     console.log( 'CONFIG-SWITCH:-PUBSUB-USER_API', modifiedData, swicthingChannelName );
  //   }
  // }, [pubnubResponse, pubnubError] )

  return (
    <div className='SubscriberForm'>
      <BackgroundComponent
        bgImg={ BackgroundImage }
        alt='Login BackgroundImage'
        isGradient={ false }
      />
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='SubscriberForm__header'>
          <Button
            onClick={ ()=> mousePointerClick() }
            iconLeftImage='GoBack'
            iconLeft={ true }
            secondary={ true }
            label={ constants.GOBACK }
          />
          <Icon
            name={ constants.MY_ACCOUNT.BINGE_LOGO }
          />
        </div>
      </FocusContext.Provider>
      <FocusContext.Provider value={ focusKey }>
        <div className='SubscriberForm'
          ref={ ref }
        >
          { isError ? (
            <div className='SubscriberForm__Error'>
              <ErrorPage
                error={ handleErrorMessage( apiError, null, null ) }
                hideHeader={ true }
              />
            </div>
          ) : (
            <div className='SubscriberForm__container'>
              { showSubscriberCard &&
              <>
                <div className='SubscriberForm__title'>
                  <Text textStyle='header-2'>
                    { subscriberIdVerbiage( subListResponse, 'selectSubscriberIdVerbiage', constants.SUBSCRIBER_LIST_TITLE ) }
                  </Text>
                </div><div className='SubscriberForm__info'>
                  <Text textStyle='body-3'>
                    { subscriberIdVerbiage( subListResponse, 'loginVerbiage', constants.SUBSCRIBER_MSG ) }
                  </Text>
                </div>
                <div className='SubscriberForm__list'
                  id='scrollContainer'
                  ref={ ref }
                >
                  <div className='SubscriberForm__left'>
                    { subListResponse?.data?.accountDetails?.map( ( args, index ) => (
                      <SubscriberCard { ...args }
                        icon='ArrowForward'
                        onCardClick={ () => onCardClick( args ) }
                        focusKeyRefrence={ 'subscriberCard' + index }
                        onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
                        onFocus={ onRailFocus }
                      />
                    ) ) }
                  </div>
                  { subListResponse?.data?.accountDetails?.length > 6 &&
                  <div className='SubscriberForm__right'>
                    <Divider vertical={ true } />
                    <Icon name='ArrowDown'
                      className={
                        classNames( 'SubscriberForm__arrow',
                          { 'SubscriberForm__arrowDownRotate180': arrowDown
                          } )
                      }
                    />
                  </div>
                  }
                </div>
              </>
              }

            </div>
          ) }
        </div>
        {
          showLoader() &&
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <Loader />
            </FocusContext.Provider>
        }
      </FocusContext.Provider>
    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} title - subscription form title
   * @property {string} subscriberInfo - subscription detailed info text
   * @property {array} subscriberIdList - array of object with url, subscriptionId, statusText & icon
   */
export const propTypes =  {
  title: PropTypes.string,
  subscriberInfo: PropTypes.string,
  subscriberIdList: PropTypes.arrayOf(
    PropTypes.shape( {
      url: PropTypes.string.isRequired,
      subscriptionId: PropTypes.string.isRequired,
      statusText: PropTypes.string,
      icon: PropTypes.string.isRequired
    } )
  )
};

SubscriberForm.propTypes = propTypes;
export default SubscriberForm;
