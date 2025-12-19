/* eslint-disable no-console */
/**
 * This component will provide the information about users subscription plan
 *
 * @module views/components/MyPlanSetup
 * @memberof -Common
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import './MyPlanSetup.scss';
import UpgradeMyPlan from '../UpgradeMyPlan/UpgradeMyPlan';
import { constants, LAYOUT_TYPE, SUBSCRIPTION_TYPE, PROVIDER_LIST } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import SelectDeviceCard from '../SelectDeviceCard/SelectDeviceCard';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import Loader from '../Loader/Loader';
import { getLowerPlan, getAuthToken } from '../../../utils/localStorageHelper';
import { useHistory } from 'react-router-dom';
import Button from '../Button/Button';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { CancelSubscription } from '../../../utils/slayer/SubscriptionPackageService';
import NotificationsPopUp from '../NotificationsPopUp/NotificationsPopUp';
import ComboPack from '../ComboPack/ComboPack';
import classNames from 'classnames';
import UpgrageSubscription from '../UpgrageSubscription/UpgrageSubscription';
import { cancel_plan, cancel_plan_later, cancel_plan_proceed, dont_cancel_plan, my_plan_view, zeroAppMixpanelEvents } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import NeflixComboPlan from '../NeflixComboPlan/NeflixComboPlan';
import { cloudinaryCarousalUrl, isIspEnabled, modalDom, setMixpanelData, storeAllPaths, truncateTextEllipse } from '../../../utils/util';
import BingeAnyWhere from '../BingeAnyWhere/BingeAnyWhere';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import Text from '../Text/Text';
import QRCodeSucess from '../QRCodeSucess/QRCodeSucess';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import AppMediaCard from '../AppMediaCard/AppMediaCard';
import Image from '../Image/Image';
/**
    * Represents a MyPlanSetup component
    *
    * @method
    * @param {object} props - React properties passed from composition
    * @returns MyPlanSetup
    */
export const MyPlanSetup = function( props ){
  const [isExpanded, setIsExpanded] = useState( false );
  const [showCancelModal, setShowCancelModal] = useState( false );
  const [bingeAnywhere, setBingeAnyWhere] = useState( false );
  const [qrCodeSuccess, setQRCodeSuccess] = useState( false );
  const [notification, setNotification] = useState( {} );

  const modalRef = useRef();
  const buttonRef = useRef()

  const { responseData, cardProps, response, loading } = useSubscriptionContext()
  const { loading: fetchAllPacksLoading } = responseData.allPacks;
  const myPlanProps = responseData.currentPack || {}

  const { complementaryAppsList, nonComplementaryAppsList, primeAddOn, addonPartnerList = [] } = myPlanProps

  const selectCardProps = cardProps
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const history = useHistory()
  const [cancelSubscriptionObj] = CancelSubscription()

  const previousPathName = useNavigationContext();
  const { cancelSubsription, cancelSubscriptionResponse, cancelSubscriptionError, cancelSubscriptionLoading } = cancelSubscriptionObj ;
  const { flexiPlanVerbiagesContext, fromSideMenuSubscribe } = useMaintainPageState() || null
  const { ref, focusKey } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );

  const complementaryAppsVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.complementaryAppsVerbiages, [flexiPlanVerbiagesContext.current] )
  const isFiberplan = useMemo( () => isIspEnabled( myPlanProps ), [myPlanProps] )
  const fdoChangesPlanVerbiageInfo = useMemo( () => flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages, [flexiPlanVerbiagesContext.current] )
  const addOnDetailsVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.addOnDetails, [flexiPlanVerbiagesContext.current] )

  const handleCancelSubscription = ( args ) => {
    setBingeAnyWhere( false )
    if( args.deviceName === constants.CHANGE_PLAN || args.deviceName === constants.CHANGE_TENURE ){
      setBingeAnyWhere( true )
    }
    else if( args.title === constants.CHOOSE_ONE_APP ){
      setMixpanelData( 'zeroAppSource', 'MYPLAN' )
      setQRCodeSuccess( true )
    }
    else {
      setShowCancelModal( true )
      const notification = {
        iconName: 'Alert',
        message: response && response.data && response.data.planOption && response.data.planOption.cancellationOption.bingeCancelHeaderMessage,
        info: response && response.data && response.data.planOption && response.data.planOption.cancellationOption.bingeCancelFooterMessage,
        additionalInfo: response && response.data && response.data.planOption && response.data.planOption.cancellationOption.bingeCancelExpiryVerbiage,
        buttonLabel: 'Yes, Cancel Plan',
        backButton: 'To Close',
        backIcon: 'GoBack'
      }
      setNotification( notification )
    }
  }

  const renderComplementaryAppsUi = () =>{

    const toggleviewApps = ()=>{
      setIsExpanded( prevState => !prevState );
    }

    return (
      <div className='MyPlanSetup__complementaryAppsSection'>
        <div className='MyPlanSetup__complementaryAppsHeader'>
          <Image
            alt={ 'Images' }
            src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PROMO_IMAGES, url ) }/${ complementaryAppsVerbiages?.complimentaryHeaderImage }` }
          />
          <Text
            textAlign='center'
            textStyle='complimentary-apps-title'
            color='white'
          >
            { complementaryAppsVerbiages?.complementaryTitle }
          </Text>
        </div>
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div className='MyPlanSetup__complementaryMultiApps'>
            {
              complementaryAppsList && complementaryAppsList.length > 0 && complementaryAppsList.slice( 0, isExpanded ? complementaryAppsList.length : constants.COMPLEMENTARY_SECTION_ROW_MAX_APPS )?.map( ( elm, index ) => (
                <AppMediaCard
                  key={ elm?.title + '_' + index }
                  title={ elm?.title }
                  image={ elm?.squareImageUrl }
                  isSubscritionModule={ true }
                  complementarytitle={ truncateTextEllipse( elm?.categoryName, 17 ) }
                />
              ) )
            }
          </div>
        </FocusContext.Provider>
        { complementaryAppsList?.length > constants.COMPLEMENTARY_SECTION_ROW_MAX_APPS && (
          <div className='MyPlanSetup__complementaryMoreSection'>
            <Button
              label={ isExpanded ? `${ complementaryAppsVerbiages?.viewLessComplimentaryAppsCtaText }` : `${ complementaryAppsVerbiages?.viewMoreComplimentaryAppsCtaText }` }
              size='medium'
              onClick={ toggleviewApps }
              focusKeyRefrence={ 'COMPLEMENTARY_APPS' }
              iconRightImage={ isExpanded ? constants.MINUS_ICON : constants.PLUS_ICON }
              iconRight
            />
          </div>
        ) }
      </div>
    )
  }

  const renderNonComplementaryApps = ( appsList )=>{
    return appsList.filter( function( appItem ){
      const nonComplementaryPartners = nonComplementaryAppsList?.map( function( item ){
        return item.partnerName;
      } );
      return nonComplementaryPartners.indexOf( appItem.title ) !== -1;
    } );

  }

  useEffect( ()=>{
    storeAllPaths( window.location.pathname )
    if( myPlanProps.isNetflixCombo || myPlanProps.isCombo ){
      setFocus( 'CANCELLED_PACKAGECARD' )
    }
  }, [] )

  useEffect( () => {
    if( previousPathName.fromSideBarToSubcription ){
      previousPathName.subscriptionPath = 'subscription/currentPlan'
      previousPathName.fromSideBarToSubcription = false
    }
    /* Mixpanel-event */
    if( myPlanProps && myPlanProps.upgradeMyPlan && getAuthToken() ){
      my_plan_view( myPlanProps )
    }
  }, [myPlanProps] )

  useEffect( ( ) => {
    if( cancelSubscriptionResponse ){
      /* Mixpanel-event */
      cancel_plan( myPlanProps )
      if( cancelSubscriptionResponse.data && cancelSubscriptionResponse.code === 0 ){
        document.querySelector( '.screensaver' ) ? document.querySelector( '.screensaver' ).style.display = 'none' : null;
        const notification = {
          iconName: 'Success',
          message: cancelSubscriptionResponse.data.deactivateMessage?.header,
          info: cancelSubscriptionResponse.data.deactivateMessage?.footer,
          additionalInfo: cancelSubscriptionResponse.data.deactivateMessage?.message,
          buttonLabel: 'Done'
        }
        hideModal()
        setNotification( notification )
      }
      else {
        const notification = {
          iconName: 'AlertRed',
          message:   cancelSubscriptionResponse.message,
          info:  'Please try again',
          buttonLabel: 'Done',
          backButton: 'To Close',
          backIcon: 'GoBack'
        }
        hideModal()
        setNotification( notification )
      }

    }

  }, [cancelSubscriptionResponse] )

  useEffect( () =>{
    if( cancelSubscriptionError ){
      const notification = {
        iconName: 'AlertRed',
        message: cancelSubscriptionError.response?.data?.message || cancelSubscriptionError.message,
        info:  'Please try again',
        buttonLabel: 'Done',
        backButton: 'To Close',
        backIcon: 'GoBack'
      }
      setNotification( notification )
    }

  }, [cancelSubscriptionError] )

  useEffect( () => {
    if( notification ){
      if( notification.info ){
        setTimeout( () => {
          showModal();
        }, 500 );
      }
    }
  }, [notification] )

  const cancelSubsriptionPlan = () => {
    setShowCancelModal( false )
    notification.buttonLabel !== 'Done' && setShowCancelModal( true )
    /* Mixpanel-event */
    cancel_plan_proceed( myPlanProps );
    cancelSubsription();
    if( notification && notification.buttonLabel === 'Done' ){
      history.push( '/discover' )
    }
  }

  const showModal = () => {
    setShowCancelModal( true )
    modalRef?.current?.showModal()
  }

  const hideModal = () => {
    setShowCancelModal( false )
    modalRef?.current?.close()
  }

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `SELECT_${id}` )
  }

  const handleCancelPopup = () => {
    hideModal();
    /* Mixpanel-events */
    cancel_plan_later( myPlanProps );
    dont_cancel_plan( myPlanProps );
    setTimeout( ()=> {
      setFocus( `SELECT_${previousPathName.selectedPlanType}` )
      previousPathName.selectedPlanType = null
    }, 100 )

  }

  const renderBoldText = ( text = '' ) => {
    if( !text.includes( '<b>' ) ){
      return text;
    }

    const [left, rest] = text.split( '<b>' );
    const [bContent, right] = rest.split( '</b>' );

    return (
      <>
        { left.trimEnd() }{ '\u00A0' }<b>{ bContent.trim() }</b>{ '\u00A0' }{ right.trimStart() }
      </>
    );
  };



  useEffect( () =>{
    if( cardProps.length > 0 && !fetchAllPacksLoading && !modalDom() ){
      setTimeout( ()=> {
        if( previousPathName.selectedPlanType === null ){
          if( myPlanProps?.appSelectionRequired ){
            selectCardProps[0]?.deviceName === constants.CHOOSE_ONE_APP && setFocus( `SELECT_${selectCardProps[0]?.deviceName}` )
          }
          else {
            setFocus( `SELECT_${selectCardProps[0]?.deviceName}` )
          }
        }
        else {
          setFocus( `SELECT_${previousPathName.selectedPlanType}` )
          previousPathName.selectedPlanType = null
        }
      }, 300 )
    }
  }, [fetchAllPacksLoading, myPlanProps] )

  const BackgroundImage = config?.welcomeScreen?.backgroundImage;

  const isSelectedCardLength = selectCardProps.length === 0;

  const handleGoBack = () => {
    if( fromSideMenuSubscribe.current ){
      history.push( '/discover' )
      fromSideMenuSubscribe.current = false
    }
    else {
      history.goBack()
    }
  }

  return (
    <div>
      { fetchAllPacksLoading && getAuthToken() ? <Loader /> : (
        getLowerPlan() ? (
          <UpgrageSubscription
            { ...myPlanProps }
            fdoRequested={ myPlanProps.fdoRequested }
            footerMsg={ myPlanProps.footerMsg }
          />
        ) : (
          <div className='MyPlanSetup'
            ref={ ref }
          >
            <FocusContext.Provider value={ focusKey }>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className={ classNames( 'MyPlanSetup__header', {
                  'MyPlanSetup__header--comboPack': myPlanProps.isNetflixCombo || myPlanProps.isCombo,
                  'MyPlanSetup__header--withNoRightSection': isSelectedCardLength
                } ) }
                >
                  <Button
                    onClick={ () => {
                      handleGoBack()
                    } }
                    iconLeftImage='GoBack'
                    iconLeft={ true }
                    secondary={ true }
                    label={ constants.GOBACK }
                  />
                  <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
                </div>
              </FocusContext.Provider>
              <div className={ classNames( 'MyPlanSetup__content', {
                'MyPlanSetup__content--withNoRightSection': isSelectedCardLength
              } ) }
              >
                <div className='MyPlanSetup__leftSection'>
                  <FocusContext.Provider focusable={ false }
                    value=''
                  >
                    { myPlanProps.isNetflixCombo || myPlanProps.isCombo ? (
                      <>
                        { myPlanProps.isNetflixCombo ?

                          <NeflixComboPlan { ...myPlanProps } /> :
                          myPlanProps.isCombo &&

                            <ComboPack
                              { ...myPlanProps }
                              supperComboPack={ myPlanProps.isNetflixCombo }
                            />
                        }
                      </>
                    ) : (
                      <UpgradeMyPlan
                        { ...myPlanProps }
                        isFiberplan={ isFiberplan }
                        selectCardProps={ selectCardProps }
                        morePlanLogos={ isSelectedCardLength }
                        isButtonVisible={ isSelectedCardLength }
                        fdoChangesPlanVerbiages={ flexiPlanVerbiagesContext.current?.data?.myPlanVerbiages }
                        apps={ myPlanProps.apps } // apps={ nonComplementaryAppsList?.length > 0 ? renderNonComplementaryApps( myPlanProps.apps ) : myPlanProps.apps }   for future reference
                        nonComplementaryAppsText={ `${nonComplementaryAppsList?.length} Apps` }
                        complementaryAppsList={ complementaryAppsList }
                      />
                    ) }
                  </FocusContext.Provider>
                  { complementaryAppsList?.length > 0 && renderComplementaryAppsUi() }
                  { primeAddOn?.addOnEligibility && addOnDetailsVerbiages?.primeAddOnDetails?.primeAddOnText && addonPartnerList?.map( String ).some( partner => partner.toLowerCase() === PROVIDER_LIST.PRIME ) &&
                  <FocusContext.Provider focusable={ false }
                    value=''
                  >
                    <div className='MyPlanSetup__PrimeLitefdoVerbiage'>
                      <AppMediaCard
                        title={ 'image' }
                        image={ addOnDetailsVerbiages?.primeAddOnDetails?.primeLogo }
                        isSubscritionModule={ true }
                      />
                      <div className='MyPlanSetup__PrimeLitefdoVerbiage--info'>
                        { renderBoldText( addOnDetailsVerbiages?.primeAddOnDetails?.primeAddOnText || '' ) }
                      </div>
                    </div>
                  </FocusContext.Provider>
                  }
                  { fdoChangesPlanVerbiageInfo?.partnerChangeRequestMessage && !( !!fdoChangesPlanVerbiageInfo?.partnerChangeFDORaised ) &&
                  <div className='MyPlanSetup__fdoVerbiage--info'>
                    { fdoChangesPlanVerbiageInfo?.partnerChangeRequestMessage }
                    <span className='MyPlanSetup__fdoVerbiage--dateInfo'>
                      { fdoChangesPlanVerbiageInfo?.partnerChangeRequestDate }
                    </span>
                  </div>
                  }
                </div>

                { selectCardProps?.length > 0 &&
                  <div className='MyPlanSetup__rightSection'>
                    { selectCardProps.map( ( args, index ) => (
                      <SelectDeviceCard { ...args }
                        key={ args.deviceName + '_' + index }
                        index={ index }
                        blockFocus
                        focusKeyRefrence={ 'SELECT_' + args.deviceName }
                        onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( args.deviceName ) }
                        { ...( args.type && { onDeviceClick:  () => handleCancelSubscription( args ) } ) }
                        onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'SELECT_' + args.deviceName }
                        isComplementaryAppsRender={ complementaryAppsList.length > 0 }
                      />
                    ) ) }
                  </div> }
              </div>
            </FocusContext.Provider>

            { showCancelModal &&
              <NotificationsPopUp
                modalRef={ modalRef }
                handleCancel={ () => handleCancelPopup() }
                opener={ buttonRef }
                buttonClicked={ () => {
                  cancelSubsriptionPlan()
                } }
                { ...notification }
                focusKeyRefrence={ 'DONE_BUTTON' }
                showModalPopup={ showCancelModal }
              /> }

            {
              bingeAnywhere && <BingeAnyWhere />
            }
            {
              qrCodeSuccess &&
              <QRCodeSucess
                zeroAppsPlanCloseQrCode={ ()=> {
                  setFocus( `SELECT_${previousPathName.selectedPlanType}` )
                  setQRCodeSuccess( false )
                  zeroAppMixpanelEvents( MIXPANELCONFIG.EVENT.ZERO_APPS_NUDGE_CLOSE, myPlanProps )
                } }
                myPlan={ true }
              />
            }
            {
              myPlanProps.footerMsg && myPlanProps.subscriptionType === SUBSCRIPTION_TYPE.ATV && (
                <div
                  className={ classNames( 'MyPlanSetup__footerATVMessage', {
                    'MyPlanSetup__footerATVMessage--withRightSection': selectCardProps?.length > 0
                  } ) }
                >
                  <Text
                    textAlign={ selectCardProps?.length > 0 ? 'left' : 'center' }
                    textStyle='body-4'
                    color={ 'white' }
                  >
                    { myPlanProps.footerMsg }
                  </Text>
                </div>
              )
            }
            {
              myPlanProps.fiberVerbiage && (
                <div
                  className={
                    isSelectedCardLength ?
                      'MyPlanSetup__footerVerbiage' :
                      'MyPlanSetup__footerVerbiage--selected'
                  }
                >
                  <Text
                    textAlign='center'
                    textStyle='body-2'
                    color='white'
                  >
                    { parse( myPlanProps.fiberVerbiage ) }
                  </Text>
                </div>
              )
            }
          </div>
        )
      ) }
      <BackgroundComponent
        bgImg={ BackgroundImage }
        alt='Login BackgroundImage'
        isGradient={ false }
      />
    </div>
  )
}

/**
    * Property type definitions
    *
    * @type {object}
    * @property {object} planDetail - provide the information about selected plan
    * @property {array} selectCardOptions - provide the options like change tenure, change plan & cancel plan
    */
export const propTypes = {
  planDetail: PropTypes.shape( {
    upgradeMyPlanTitle: PropTypes.string,
    upgradeMyPlanType: PropTypes.string,
    upgradeMyPlan: PropTypes.string,
    apps: PropTypes.array
  } ),
  selectCardOptions: PropTypes.arrayOf(
    PropTypes.shape( {
      iconImage: PropTypes.string,
      deviceName: PropTypes.string,
      iconImageArrow: PropTypes.string,
      url: PropTypes.string
    } ).isRequired
  )
};

MyPlanSetup.propTypes = propTypes;
export default MyPlanSetup;
