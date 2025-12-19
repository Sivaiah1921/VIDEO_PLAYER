/* eslint-disable no-console */
/**
 * MyAccount Page
 *
 * @module views/components/MyAccount
 * @memberof -Common
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Text from '../Text/Text';
import UserProfileDetail from '../UserProfileDetail/UserProfileDetail';
import UserAccountDetail from '../UserAccountDetail/UserAccountDetail';
import Button from '../Button/Button';
import Divider from '../Divider/Divider';
import AccountCard from '../AccountCard/AccountCard';
import { COMMON_HEADERS, constants, PAGE_TYPE, USERS } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import { useHistory, useLocation } from 'react-router-dom';
import './MyAccount.scss';
import { myAccountRail, BalanceAPICall, LogoutAPICall, RechargeAPICall, RefreshAPICall } from '../../../utils/slayer/MyAccountService';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { Notifications } from '../Notifications/Notifications';
import { formatPhoneNumber, modalDom, showToastMsg, userIsSubscribed } from '../../../../src/utils/util';
import AutoPlayTrailer from '../AutoPlayTrailer/AutoPlayTrailer';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import { getAgeRating, getAuthToken, getBaID, getProfileId, getSubscriberId, getContentLangSet, removeContentLang, getDthStatus, getCodeResponse, removeCodeResponse, setData, getData, clearData, getLastRefreshedTime, setPrevKey, setLastRefreshedTime, getPrevKey } from '../../../utils/localStorageHelper';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import QrCodePopUp from '../QrCodePopUp/QrCodePopUp';
import parse from 'html-react-parser';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { low_balance, my_account, my_account_current_subscription, my_account_email, my_Account_recharge, my_account_recharge_initiate, my_account_refresh, logout_failure, settingsVisit, settingsMenuOptions, subMenuOptionClicked } from '../../../utils/mixpanel/mixpanelService';
import { useLoginContext } from '../../core/LoginContextProvider/LoginContextProvider';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import classNames from 'classnames';
import Image from '../Image/Image';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useImagePubNubContext } from '../../core/PubNubContextProvider/ImagePubNubContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import mixpanel from 'mixpanel-browser';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { onLogoutAction } from '../../../utils/logoutHelper';

/**
  * Represents a MyAccount component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns MyAccount
  */

const AccountBottomComponent = ( { myAccountRail, handleNavFn, previousPathName, profileLoading } ) => {
  const [railLeftMargin, setRailLeftMargin] = useState( false );

  const accountScrollRef = useRef( null );

  const { ref, focusKey } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    saveLastFocusedChild: false
  } );
  const previousPath = previousPathName;

  const onCardFocus = useCallback( ( rest, i ) => {
    previousPath.previousMediaCardFocusBeforeSplash = `ACCOUNT_CARD_${i}`;
    ( i >= 4 ) ? setRailLeftMargin( true ) : setRailLeftMargin( false );
    if( accountScrollRef.current ){
      // left: rest.left - accountScrollRef.current.clientWidth + 290  // keeping this code for reference
      accountScrollRef.current.scrollLeft = rest.left - ( rest.width * 4 )
    }
  }, [accountScrollRef] );

  const onMouseEnterCallBackFn = ( id ) => {
    previousPath.previousMediaCardFocusBeforeSplash = `ACCOUNT_CARD_${id}`
    setFocus( `ACCOUNT_CARD_${id}` )
  }

  const MyAccountRail = myAccountRail.map( ( elm, i ) => (
    <AccountCard
      title={ elm.title }
      iconName={ elm.iconName }
      url={ elm.url }
      onFocus={ ( e ) => onCardFocus( e, i ) }
      key={ i }
      onPressHandleFn={ ()=>handleNavFn( elm.title, i, elm.subMenuOption ) }
      focusKeyRefrence={ `ACCOUNT_CARD_${i}` }
      textStyle={ elm.textStyle }
      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( i ) }
      onMouseUpCallBackFn={ ()=>handleNavFn( elm.title, i, elm.subMenuOption ) }
      profileLoading={ profileLoading }
    />
  ) );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className={ classNames( 'MyAccount__rail', {
        [`MyAccount__rail--left`]: railLeftMargin
      } ) }
      ref={ ref }
      >
        <div className='MyAccount__railContainer'
          ref={ accountScrollRef }
        >
          { MyAccountRail }
          <FocusContext.Provider value=''
            focusable={ false }
          >
            <Button
              primary={ true }
              label='Primary'
              disabled={ false }
              size='medium'
            />
          </FocusContext.Provider>
        </div>
      </div>
    </FocusContext.Provider>
  )
}
export const MyAccount = function( ){
  const [isMailChanged, setMailChanged] = useState( false );
  const [loaderState, setLoaderState] = useState( false )
  const [showModal, setShowModal] = useState( false )
  const [showLogoutModal, setShowLogoutModal] = useState( false )
  const [showQRcode, setshowQRcode] = useState( false )
  const [showNotificationModal, setshowNotificationModal] = useState( false )
  const [keyValue, setKeyValue] = useState( null )
  const [showNotification, setShowNotification] = useState( false );
  const [notificationMessage, setNotificationMessage] = useState( '' )
  const [balanceLoader, setBalanceLoader] = useState( getDthStatus() !== USERS.NON_DTH_USER )

  const modalRef = useRef();
  const buttonRef = useRef();
  const modelCloseRef = useRef( false )
  const QRCodeDetails = useRef()
  const modalRefQR = useRef();
  const intervalIDRef = useRef( null );
  const modalRefNotification = useRef();
  const modalRefLogout = useRef();

  const { setCustomPageType, setSidebarList, setDefaultPageType } = useHomeContext();
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const { onLogout } = usePubNubContext()
  const { onLogoutImage } = useImagePubNubContext()
  const history = useHistory();
  const location = useLocation();
  const { setSubscriber } = useLoginContext( ) || {};
  const previousPathName = useNavigationContext();
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );
  const { successFullPlanPurchasePubnub, currentPlan, selectedDevicesIdsList, setIsQrCodeJourney, setInitiateTimer, setQrLoginDetails } = useMaintainPageState() || null
  const { setMetaData, setSonyLivPartnerToken } = usePlayerContext()
  const { setBaid, setResult, setResultForUnsubscribe, currentResponseCondition, setCardProps, fetchPackList, setBingeListRecord } = useSubscriptionContext( ) || {};
  const responseSubscription = useSubscriptionContext( );


  const [balanceData] = BalanceAPICall();
  const { fetchBalance, balanceResponse, balanceeError, balanceLoading } = balanceData || {}
  const balanceDetails = balanceResponse?.data;

  const { profileAPIResult, setProfileAPIResult, profileLoading, setResponse } = useProfileContext()
  const profileData = profileAPIResult || {}
  const profileDetails = profileData.data;
  const fullName = profileDetails?.firstName + ' ' + profileDetails?.lastName;

  const { code, message } = getCodeResponse() || ''
  const [logout] = LogoutAPICall();

  const [recharge] = RechargeAPICall();
  const { fetchLogout, logoutResponse, logoutError, logoutLoading } = logout || {}
  const { fetchRechargeQr, rechargeResponse, rechargeError, rechargeLoading } = recharge || {}

  const [refreshAccount] = RefreshAPICall()
  const { fetchRefreshAccount, refreshAccountResponse, refreshAccountError, refreshAccountLoading } = refreshAccount

  const { pageType } = location.args || '';
  const loaderPath = `${window.assetBasePath}loader.gif`;
  let getTime = '';
  const myPlanProps = responseSubscription?.responseData.currentPack
  const amount =  balanceDetails?.balanceQueryRespDTO?.balance && parse( `&#8377;${ balanceDetails.balanceQueryRespDTO.balance }` )
  const paymentMethod = balanceDetails?.paymentMethod;
  const BackgroundImage = config?.welcomeScreen?.backgroundImage;

  const openModal = () => {
    setShowModal( true )
    if( modalRef.current && !modalRef.current.open ){
      modalRef.current.showModal();
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal( true )
    if( modalRefLogout.current && !modalRefLogout.current.open ){
      modalRefLogout.current.showModal();
    }
  }

  const openNotificationModal = () => {
    setshowNotificationModal( true )
    if( modalRefNotification.current && !modalRefNotification.current.open ){
      modalRefNotification.current.showModal();
    }
  };

  const hideModal = () => {
    modalRef.current.close();
    setShowModal( false )
    modelCloseRef.current = true
    setTimeout( ()=> setFocus( 'ACCOUNT_CARD_4' ), 100 )
  };

  const hideModalQR = () => {
    setshowQRcode( false )
    modalRefQR?.current?.close();
    setFocus( 'ACCOUNT_CARD_4000' )
  };

  const hideNotificationModal = () => {
    setshowNotificationModal( false )
    setFocus( 'ACCOUNT_CARD_4000' )
  };

  const hideLogoutModal = () => {
    setShowLogoutModal( false )
    setTimeout( ()=> setFocus( 'ACCOUNT_CARD_6' ), 100 )
  };

  const handleNavFn = ( title, key, subMenuOption )=>{
    settingsMenuOptions( title )
    setPrevKey( key )
    setKeyValue( key )
    subMenuOption && subMenuOptionClicked( subMenuOption )
    switch ( title ){
      case 'Video Language': history.push( {
        pathname: `/content/languages`,
        args: {
          fromAccount: true
        }
      } )
        break;
      case 'Device Management': history.push( {
        pathname: `/device/setting/device-management/${ getBaID() }/${ COMMON_HEADERS.DEVICE_ID }`
      } )
        break;
      case 'Transaction History': history.push( {
        pathname: '/device/transactionHistory'
      } )
        break;
      case 'Parental PIN': history.push( {
        pathname: getAgeRating() ? `/device/parentalPinSetup` : `/device/no-parentalPinSetup`
      } )
        break;
      case 'Autoplay Trailers': setTimeout( ()=>{
        openModal()
      }, 100 )
        break;
      case 'Contact Us': history.push( {
        pathname: '/contact'
      } )
        break;
      case 'Log Out': setTimeout( ()=>{
        openLogoutModal()
      }, 100 )
        break;
      default:
        return null
    }

  }

  const refreshButtonHandler = ( ) => {
    subMenuOptionClicked( 'SUBMENU-ACCOUNTREFRESH' )
    setData( 'refreshCounter', JSON.parse( getData( 'refreshCounter' ) ) + 1 );
    if( JSON.parse( getData( 'refreshCounter' ) ) > 3 ){
      showToastMsg( setShowNotification, setNotificationMessage, constants.ACCOUNT_REFRESH_LIMIT );
    }
    else {
      fetchRefreshAccount();
      setLoaderState( true );
      if( !intervalIDRef.current ){
        intervalIDRef.current = setTimeout( () => {
          setData( 'refreshCounter', 0 );
          intervalIDRef.current = null;
        }, 120000 )
      }
    }
  }

  const clickEventHandler = ( cardType ) => {
    if( cardType === 'MY_ACCOUNT_EDIT_PROFILE' ){
      subMenuOptionClicked( 'SUBMENU-EDITPROFILE' )
      setPrevKey( 2000 )
      history.push( {
        pathname: '/account/profile/edit',
        args: {
          profileName: fullName.trim() ? fullName : null,
          profileNameDisplay: fullName.trim() ? fullName : COMMON_HEADERS.DEVICE_NAME,
          profileMobileNumber: profileDetails?.rmn,
          email: profileDetails?.email
        }
      } )
    }
    else if( cardType === 'MY_ACCOUNT_MYPLAN' ){
      setPrevKey( 1000 )
      if( getAgeRating() && getAgeRating() !== 'No Restriction' ){
        previousPathName.current = window.location.pathname
        history.push( `/device/fourDigitParentalPinSetup` )
      }
      else if( currentPlan.current ){
        my_account_current_subscription()
        previousPathName.current = window.location.pathname
        previousPathName.rootPathContainer = window.location.pathname
        subMenuOptionClicked( 'SUBMENU-MYPLAN' )
        history.push( '/plan/current' )
      }
      else {
        my_account_current_subscription()
        previousPathName.current = window.location.pathname
        previousPathName.rootPathContainer = window.location.pathname
        subMenuOptionClicked( 'SUBMENU-SUBSCRIBE' )
        history.push( '/plan/subscription' )
      }
    }
  }

  const handleLogout = () => {
    fetchLogout()
  }

  const openModalQR = () => {
    modalRefQR.current?.close();
    setTimeout( () => {
      setshowQRcode( true )
      if( modalRefQR.current && !modalRefQR.current.open ){
        modalRefQR.current.showModal();
      }
    }, 500 );
  };

  const handleRecharge = () =>{
    subMenuOptionClicked( 'SUBMENU-RECHARGE' )
    setPrevKey( 4000 )
    if( getDthStatus() !== USERS.NON_DTH_USER ){
      if( !rechargeResponse ){
        fetchRechargeQr();
      }
      else {
        openModalQR()
      }
      if( balanceDetails ){
        my_account_recharge_initiate( balanceDetails.recommendedAmount )
      }
    }
  }

  const rightTextSubscription = () => {
    let planName = '';
    if( currentPlan.current && myPlanProps && Boolean( myPlanProps.isNetflixCombo || myPlanProps.isCombo ) ){
      planName = 'Combo'
    }
    else if( currentPlan.current === myPlanProps?.productId ){
      planName = ''
    }
    else {
      planName = currentPlan.current
    }
    return planName
  }

  useEffect( () => {
    previousPathName.contactUS = 'BUTTON_FAQ'
    previousPathName.subscriptionRootPage = 'MY-ACCOUNT';
    previousPathName.current = window.location.pathname
    if( getDthStatus() !== USERS.NON_DTH_USER ){
      setBalanceLoader( true )
      fetchBalance( {
        'baId': getBaID()
      } )
    }
    const contentLangNotificationShow = getContentLangSet();
    if( contentLangNotificationShow ){
      setShowNotification( true )
      setNotificationMessage( constants.LANGUAGEUPDATEMSG )

      setTimeout( () => {
        setShowNotification( false )
        removeContentLang()
      }, 3000 );
    }
    my_account();
    if( previousPathName.pageName === constants.MY_ACCOUNT.EDIT_PROFILE ){
      my_account_email()
      previousPathName.pageName = ''
    }
  }, [] )

  useEffect( () => {
    parseInt( code, 10 ) === 0 ? setMailChanged( true ) : setMailChanged( false );
    setTimeout( () => {
      setMailChanged( false );
      removeCodeResponse();
    }, 2000 );
  }, [code] );

  useEffect( () => {
    settingsVisit()
    selectedDevicesIdsList.current = []
    const prevKeyValue = pageType === PAGE_TYPE.ACCOUNT ? 1000 : getPrevKey()
    if( prevKeyValue === null && !modalDom() ){
      focusSelf()
    }
    else {
      setTimeout( ()=> setFocus( `ACCOUNT_CARD_${prevKeyValue}` ), 100 )
    }
  }, [] );

  useEffect( () => {
    setData( 'refreshCounter', 0 );
    const lastRefreshed = getLastRefreshedTime()
    if( !lastRefreshed ){
      const setTime = JSON.stringify( new Date().toLocaleString( 'en-US', { hour: 'numeric', minute: 'numeric', hour12: true } ) );
      const getTime = 'Last refreshed ' + setTime.replace( /"([^"]+(?="))"/g, '$1' );
      setLastRefreshedTime( getTime );
    }

    return () => {
      clearTimeout( intervalIDRef.current );
      clearData( 'refreshCounter' );
    }
  }, [] );

  useEffect( () =>{
    if( balanceResponse || balanceeError ){
      setBalanceLoader( false )
    }
    if( balanceResponse && balanceResponse.data && balanceResponse.data.lowBalance ){
      low_balance( PAGE_TYPE.ACCOUNT )
    }
  }, [balanceResponse, balanceeError] )


  useEffect( ()=>{
    if( myPlanProps ){
      const isSubscribed = userIsSubscribed( myPlanProps )
      currentPlan.current = isSubscribed
    }
  }, [myPlanProps] )

  useEffect( () => {
    if( logoutResponse?.code === 0 || logoutError ){
      if( logoutError ){
        logout_failure( logoutError?.code, logoutError?.message );
      }
      setQrLoginDetails( null );
      onLogoutAction( mixpanel, setProfileAPIResult, setResult, setResultForUnsubscribe, setCardProps, currentResponseCondition, history, setCustomPageType, setDefaultPageType, previousPathName, successFullPlanPurchasePubnub, setSidebarList, setBaid, onLogout, onLogoutImage, setSubscriber, setResponse, setMetaData, setSonyLivPartnerToken, setBingeListRecord, setIsQrCodeJourney, setInitiateTimer )
    }
  }, [logoutResponse, logoutError] )

  /* Commented due to - TPSLS-645
     If everyhting works fine this code can be removed later on
  */
  // useEffect( ()=>{
  //   if( profileLoading && modelCloseRef.current ){
  //     setFocus( 'ACCOUNT_CARD_4' )
  //   }
  // }, [profileLoading] )

  useEffect( () => {
    if( rechargeResponse && rechargeResponse.data ){
      QRCodeDetails.current = {
        url:rechargeResponse.data?.qrCodeUrl,
        size: '250',
        goBack:'Go Back',
        info: rechargeResponse.data?.title,
        balanceBtnLabel: constants.CHECK_BALANCE
      };
      if( balanceDetails ){
        my_Account_recharge( balanceDetails.recommendedAmount );
      }
      openModalQR()
    }

  }, [rechargeResponse] )

  useEffect( () => {
    if( refreshAccountResponse || refreshAccountError ){
      const setTime = JSON.stringify( new Date().toLocaleString( 'en-US', { hour: 'numeric', minute: 'numeric', hour12: true } ) );
      const getTime = 'Last refreshed ' + setTime.replace( /"([^"]+(?="))"/g, '$1' );
      setLastRefreshedTime( getTime );
      if( refreshAccountResponse && refreshAccountResponse.code === 0 ){
        setProfileAPIResult( {
          data: 'RefreshDeviceCall'
        } )
        setTimeout( () => {
          setFocus( 'ACCOUNT_CARD_3000' )
        }, 500 );
        my_account_refresh();
        setBaid( 0 )
        setTimeout( () => {
          setBaid( getBaID() )
        }, 0 );
        fetchPackList( {
          'baId': getBaID() ? getBaID() : null,
          'dthStatus': getDthStatus(),
          'accountId': getSubscriberId()
        } )
        showToastMsg( setShowNotification, setNotificationMessage, constants.ACCOUNT_REFRESH_SUCCESS );

      }
      setLoaderState( false )
    }
  }, [refreshAccountResponse, refreshAccountError] )

  return (
    <>
      { Boolean( profileLoading || balanceLoader ) &&
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='Loader'>
          <Image
            src={ loaderPath }
          />
        </div>
      </FocusContext.Provider> }
      <div className='MyAccount'>
        <BackgroundComponent
          bgImg={ BackgroundImage }
          alt='Login BackgroundImage'
          isGradient={ false }
        />
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div className='MyAccount__header'>
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
        <FocusContext.Provider value={ focusKey }>
          <div className='MyAccount__content'>
            <div className='MyAccount__title'>
              <Text
                textAlign='left'
                textStyle='title-2'
                color='white'
              >
                { constants.MY_ACCOUNT.MYACCOUNT_TITLE }
              </Text>
            </div>
            <div className='MyAccount__userInfo'>
              <div className='MyAccount__userInfoLeft'>
                <UserProfileDetail
                  profileName={ profileDetails?.firstName ? fullName : COMMON_HEADERS.DEVICE_NAME }
                  aliasName={ profileDetails?.aliasName ? profileDetails.aliasName : COMMON_HEADERS.DEVICE_NAME }
                  mobileNumber={ formatPhoneNumber( profileDetails?.rmn ) }
                  mailId={ profileDetails?.email }
                  profileImage={ profileDetails?.profileImage }
                />
                <Divider
                  horizontal={ true }
                  horizontalGradient={ false }
                />
                <UserAccountDetail
                  balance={ amount }
                  lastRefreshtime={ getLastRefreshedTime() }
                  rechargeDueDate={ balanceDetails?.balanceQueryRespDTO?.endDate }
                  paymentMethod={ paymentMethod }
                />
              </div>
              <FocusContext.Provider value={ focusKey }>
                <div className='MyAccount__userInfoRight'
                  ref={ ref }
                >
                  <Button
                    secondary={ true }
                    label={ currentPlan.current ? constants.MY_ACCOUNT.MYPLAN : constants.MY_ACCOUNT.SUBSCRIBE }
                    disabled={ false }
                    size='medium'
                    iconLeftImage='CrownGoldForward'
                    className='MyAccount__btnCrownGoldForward'
                    iconLeft={ true }
                    rightTextSubscription={ rightTextSubscription() }
                    onClick={ ()=>clickEventHandler( 'MY_ACCOUNT_MYPLAN' ) }
                    focusKeyRefrence='ACCOUNT_CARD_1000'
                    textStyle='buttonInputText'
                    profileLoading={ balanceLoader || loaderState || profileLoading }
                    onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'ACCOUNT_CARD_1000' }
                  />
                  <Button
                    secondary={ true }
                    label={ constants.MY_ACCOUNT.EDIT_PROFILE }
                    disabled={ false }
                    size='medium'
                    iconLeftImage='Profile24x24'
                    iconLeft={ true }
                    iconRight={ false }
                    onClick={ ()=>clickEventHandler( 'MY_ACCOUNT_EDIT_PROFILE' ) }
                    focusKeyRefrence='ACCOUNT_CARD_2000'
                    textStyle='buttonInputText'
                    profileLoading={ balanceLoader || loaderState || profileLoading }
                    onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'ACCOUNT_CARD_2000' }
                  />
                  <Button
                    secondary={ true }
                    label={ constants.MY_ACCOUNT.REFRESH_ACCOUNT }
                    disabled={ false }
                    size='medium'
                    iconLeftImage='Refresh24x24'
                    iconLeft={ true }
                    iconRight={ false }
                    onClick={ refreshButtonHandler }
                    focusKeyRefrence='ACCOUNT_CARD_3000'
                    textStyle='buttonInputText'
                    profileLoading={ balanceLoader || loaderState || profileLoading }
                    onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'ACCOUNT_CARD_3000' }
                  />
                  { getDthStatus() !== USERS.NON_DTH_USER &&
                  <Button
                    secondary={ true }
                    label={ constants.MY_ACCOUNT.RECHARGE }
                    disabled={ false }
                    size='medium'
                    iconLeftImage='AutoRenewal24x24'
                    iconLeft={ true }
                    ref={ buttonRef }
                    profileLoading={ balanceLoader || loaderState || profileLoading }
                    onClick={ () => handleRecharge() }
                    focusKeyRefrence='ACCOUNT_CARD_4000'
                    onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'ACCOUNT_CARD_4000' }
                  /> }
                </div>
              </FocusContext.Provider>
              { showQRcode &&
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <QrCodePopUp
                  modalRef={ modalRefQR }
                  handleCancel={ hideModalQR }
                  handleClick={ () => fetchBalance( {
                    'baId': getBaID()
                  } ) }
                  opener={ buttonRef }
                  { ...QRCodeDetails.current }
                  showQRcode={ showQRcode }
                  subscriptionType={ responseSubscription?.responseData.currentPack?.subscriptionType }
                />
              </FocusContext.Provider>
              }
            </div>
            <div className='MyAccount__divider'>
              <div className='MyAccount__divider--image'></div>
            </div>


            { isMailChanged &&
            <div className='MyAccount__notification'>
              <Notifications
                iconName='Success'
                message={ message || constants.EMAIL_CHANGE_SUCCESSFULLY }
              />
            </div>
            }
            { showModal &&
            <AutoPlayTrailer
              title='Autoplay Trailer'
              subtitle='When autoplay is on, the trailer will start playing automatically'
              iconName='AutoplayTrailer80x80'
              buttonLabel='Done'
              modalRef={ modalRef }
              handleCancel={ hideModal }
              opener={ buttonRef }
              id='switcher'
              name='switcher'
              toggleButton='true'
              authorization={ getAuthToken() }
              deviceId={ COMMON_HEADERS.DEVICE_ID }
              subscriberId={ getSubscriberId() }
              profileId={ getProfileId() }
              baId={ getBaID() }
            />
            }
            {
              showNotificationModal &&
              <NotificationsPopUp
                modalRef={ modalRefNotification }
                opener={ buttonRef }
                handleCancel={ hideNotificationModal }
                iconName='AutoRenewal'
                message='A link has been sent to your Registered Mobile Number +9191111167543'
                buttonLabel='Done'
                showModalPopup={ showNotificationModal }
              />
            }
            {
              showLogoutModal &&
              <NotificationsPopUp
                modalRef={ modalRefLogout }
                opener={ buttonRef }
                handleCancel={ hideLogoutModal }
                iconName='Logout80x81'
                message='Are you sure you want to Log Out?'
                info='You will miss out on the latest content from your favourite apps.'
                buttonLabel='Proceed'
                backButton='To Close'
                backIcon='GoBack'
                showModalPopup={ showLogoutModal }
                buttonClicked={ () => handleLogout() }
              />
            }
          </div>
          <AccountBottomComponent myAccountRail={ myAccountRail }
            handleNavFn={ handleNavFn }
            previousPathName={ previousPathName }
            profileLoading={ balanceLoader || loaderState || profileLoading }
          />
        </FocusContext.Provider>
        <div className='MyAccount__version'>
          <Text color='white'
            textStyle='body-4'
          >App Version { COMMON_HEADERS.VERSION }</Text>
        </div>
        <div className='MyAccount__background'></div>
        <div className='MyAccount__notification'>
          {
            showNotification && (
              <Notifications
                iconName='Success'
                message={ notificationMessage }
              />
            )
          }
        </div>
      </div>
    </>
  )
}

export default MyAccount;