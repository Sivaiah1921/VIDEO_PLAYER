/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/**
 * Subscription Package
 *
 * @module views/components/SubscriptionPackage
 * @memberof -Common
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './SubscriptionPackage.scss';
import Icon from '../Icon/Icon';
import PackageCard from '../PackageCard/PackageCard';
import Text from '../Text/Text';
import { formatResponse } from '../../../utils/slayer/SubscriptionPackageService';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider'
import { constants, LAYOUT_TYPE, PACKS, PAGE_TYPE, USERS } from '../../../utils/constants';
import Button from '../Button/Button';
import { useParams } from 'react-router-dom';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { subscription_page_initiate } from '../../../utils/mixpanel/mixpanelService';
import { getAuthToken, getBaID, getDthStatus, getProductName, getSubscriberId, getUserInfo, getUserStatus, setUserStatus } from '../../../utils/localStorageHelper';
import { accountDeactivateVerbiageOnUI, cloudinaryCarousalUrl, handleErrorMessage, storeAllPaths } from '../../../utils/util';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Image from '../Image/Image';
import classNames from 'classnames';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { ErrorPage } from '../ErrorPage/ErrorPage';
/**
 * Represents a SubscriptionPackage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SubscriptionPackage
 */
export const SubscriptionPackage = function( props ){
  const [isError, setIsError] = useState( false );
  const [currentPlan, setCurrentPlan] = useState( null );
  const [packageList, setPackageList] = useState( [] );
  const [currentFocus, setCurrentFocus] = useState( null )

  const packIntervalId = useRef();
  const clearTimeOutRef = useRef( null )
  const packCardScrollRef = useRef( null );

  const { configResponse, url } = useAppContext();
  const { config, marketingVerbiage } = configResponse;
  const history = useHistory();
  const { responseData, setBaid, fetchPackList } = useSubscriptionContext()
  const { fromSideMenuSubscribe } = useMaintainPageState();
  const { fetchData, response, error, loading } = responseData.allPacks;
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = responseSubscription?.responseData.currentPack
  const { plancard, packResponse } = formatResponse( response, myPlanProps );
  const { ref } = useFocusable();
  const { option } = useParams()
  const previousPathName = useNavigationContext();

  const BackgroundImage = config?.welcomeScreen?.backgroundImage;

  const onPackCardFocus = useCallback( ( { x, y, ...rest }, packIndex ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = 'PACKCARD' + packIndex
    if( packCardScrollRef.current ){
      packCardScrollRef.current.scrollLeft = rest.left - ( packCardScrollRef.current.clientWidth / 2 )
    }
  }, [packCardScrollRef] );

  const loaderCondition = () => {
    return packageList?.length === 0;
  }

  const onMouseEnterCallBackFn = ( id ) => {
    if( currentFocus !== id ){
      setFocus( `PACKCARD${id}` )
    }
  }

  const onMouseLeaveCallBackFn = ( id ) =>{
    if( currentFocus !== id ){
      setFocus( `PACKCARD${id}` )
    }
  }

  const packageCard = ( elm, index ) => (
    <PackageCard
      tag={ option && elm.tag ? constants.RENEW_PLAN_VERBIAGE : elm.tag }
      title={ elm.title }
      titlePremium={ elm.titlePremium }
      titleIcon={ elm.titleIcon }
      appLabel={ elm.appLabel }
      deviceDetails={ elm.deviceDetails }
      deviceIcon={ elm.deviceIcon }
      trialEndDate={ elm.trialEndDate }
      balanceDetails={ elm.balanceDetails }
      monthlyPlan={ elm.monthlyPlan }
      apps={ elm.apps }
      onFocus={ ( e ) => onPackCardFocus( e, index ) }
      productId={ elm.productId }
      focusKeyRefrence={ 'PACKCARD' + index }
      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
      onMouseLeaveCallBackFn={ () => onMouseLeaveCallBackFn( index ) }
      tenureCount={ elm.tenure?.length }
      currentFocus={ currentFocus }
      indexOfCard={ index }
      packCycle={ elm.packCycle }
      amount={ elm.amountValue }
      tenure={ elm.tenure }
      nonAvailablePartners={ elm.nonAvailablePartners }
      nonAvailablePartnersSamsung={ elm.nonAvailablePartnersSamsung }
      ahaFooterMessage={ elm.ahaFooterMessage }
      jioCinemaFooterMessage={ elm.jioCinemaFooterMessage }
      remaingApps={ true }
      appsToShow={ 23 }
      verbiageToShow={ 24 }
      remainingAppsAlwaysVisible={ true }
      flexiPlan={ elm.flexiPlan }
      flexiPlanImageUrl={ elm.flexiPlanImageUrl }
      addonVerbiageImage={ false }
    />
  )

  const renderPackagesList = packageList?.map( ( elm, index ) => {
    if( index !== currentFocus && !option ){
      return (
        <React.Fragment key={ elm.title + index }>
          { packageCard( elm, index ) }
        </React.Fragment>
      )
    }
    else {
      return (
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <React.Fragment key={ elm.title + index }>
            { packageCard( elm, index ) }
          </React.Fragment>
        </FocusContext.Provider>
      )
    }

  } )

  const headerVerbiages = ( isSubTitle ) => {
    if( !getAuthToken() ){
      return plancard.subscriptionPackageTitle;
    }
    else {
      if( getProductName() === PACKS.FREEMIUM ){
        return plancard.subscriptionPackageTitle;
      }
      else {
        return isSubTitle ? plancard.subscriptionPackageSubTitle : plancard.subscriptionPackageTitle;
      }
    }
  }

  const handleGoBack = () => {
    if( fromSideMenuSubscribe.current ){
      history.push( '/discover' )
      fromSideMenuSubscribe.current = false
    }
    else {
      history.goBack()
    }
  }

  // const getPrimeEligebleUser = () =>{ // currently commenting this Method for new Prime Journy as now Both DTH and Non DTH users can avail to acces the Prime contents and Marketing assets
  //   const userInfo = JSON.parse( getUserInfo() ) || {};
  //   if( !!previousPathName.isFromPrimeMarketingAsset ){
  //     return !userInfo?.marketingAssetList?.includes( constants.PRIME_MARKETING_VALUE )
  //   }
  // }

  useEffect( ()=>{
    if( getAuthToken() && getUserStatus() === constants.NEW_USER ){
      packIntervalId.current = setInterval( () => {
        fetchPackList( {
          'baId': getBaID() ? getBaID() : null,
          'dthStatus': getDthStatus(),
          'accountId': getSubscriberId()
        } )
      }, 5000 );
    }
    return () => {
      packIntervalId.current && clearInterval( packIntervalId.current )
      clearTimeout( clearTimeOutRef.current )
      packIntervalId.current = null;
      clearTimeOutRef.current = null;
      previousPathName.selectedtenure = null;
    }
  }, [] )

  useEffect( ()=>{
    let filteredPacks = [];
    if( accountDeactivateVerbiageOnUI( myPlanProps ) ){
      filteredPacks = plancard?.subscriptionPackages?.filter( item => item.monthlyPlan !== '' )
    }
    else {
      filteredPacks = myPlanProps && plancard?.subscriptionPackages?.filter( item => item.monthlyPlan !== '' && ( item.productId !== myPlanProps.productId || item.title !== myPlanProps.upgradeMyPlanType ) && item.amountValue !== myPlanProps.amountValue )
    }
    filteredPacks?.length === 0 ? setBaid( 0 ) : (
      setPackageList( filteredPacks ),
      packIntervalId.current && clearInterval( packIntervalId.current )
    )
    !loading && setFocus( 'TEMPERARY_FOCUS_ELEMENT' )
  }, [loading] )

  useEffect( ()=>{
    if( packageList && packageList.length > 0 && ( window.location.pathname.includes( PAGE_TYPE.SUBSCRIPTION_PAGE ) || window.location.pathname.includes( PAGE_TYPE.CURRENT_SUBSCRIPTION_RENEW ) ) ){
      setUserStatus( constants.UPDATE_USER )
      const currentIdexPack = packageList?.findIndex( ( item ) => item.tag === constants.CURRENT_PLAN )
      const indexOfLastCard = packageList?.length - 1
      setCurrentFocus( currentIdexPack )
      clearTimeOutRef.current = setTimeout( ()=>{
        if( previousPathName.selectedPlanCard === null ){
          if( currentIdexPack === indexOfLastCard ){
            setFocus( `PACKCARD${currentIdexPack - 1}` )
          }
          else {
            setFocus( `PACKCARD${currentIdexPack + 1}` )
          }
        }
        else {
          setFocus( `PACKCARD${previousPathName.selectedPlanCard}` )
          previousPathName.selectedPlanCard = null
        }
      }, 300 )
    }
  }, [packageList] )

  useEffect( ()=>{
    if( Array.isArray( myPlanProps?.tenure ) && myPlanProps.tenure.length > 0 ){
      const subscription = myPlanProps.tenure.find( subs=> subs.currentTenure )
      setCurrentPlan( subscription )
    }

  }, [myPlanProps] )

  useEffect( () => {
    storeAllPaths( window.location.pathname )
    if( previousPathName.fromSideBarToSubcription ){
      previousPathName.subscriptionPath = 'subscription/currentPlan'
      previousPathName.fromSideBarToSubcription = false
    }
    /* Mixpanel-event */
    subscription_page_initiate( previousPathName.current )
  }, [] )

  useEffect( ()=>{
    if( error || ( response && ( response.code !== 0 || response.data === null ) ) || ( plancard?.subscriptionPackages?.length === 0 && !packIntervalId.current ) ){
      setIsError( true )
    }
    else if( plancard?.subscriptionPackages?.length > 0 ){
      setIsError( false );
    }
  }, [error, response] )

  return (
    <div ref={ ref }>
      {
        loading ? <Loader /> :
          isError ? (
            <div className='SubscriptionPackage__error'>
              <ErrorPage
                error={ handleErrorMessage( error, response, constants.ERROR_MSG ) }
                onBack={ handleGoBack }
              />
            </div>
          ) :
            (
              loaderCondition() ? <Loader /> : (
                <div>
                  { Array.isArray( plancard.subscriptionPackages ) &&
                  <>
                    <div className='SubscriptionPackage'>
                      <BackgroundComponent
                        bgImg={ BackgroundImage }
                        alt='Login BackgroundImage'
                        isGradient={ false }
                      />
                      <FocusContext.Provider focusable={ false }
                        value=''
                      >
                        <div className='SubscriptionPackage__topSection'>
                          <Button
                            onClick={ ()=> handleGoBack() }
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
                      <div className='SubscriptionPackage__header'>
                        <div className='SubscriptionPackage__header--title'>
                          { ( getAuthToken() && getProductName() !== PACKS.FREEMIUM ) &&
                          <Icon
                            name={ plancard.subscriptionPackageTitleIcon }
                          />
                          }
                          <Text
                            textAlign='left'
                            textStyle='title-1'
                            color={ headerVerbiages() === plancard.subscriptionPackageTitle ? 'white' : 'error-600' }
                            htmlTag='p'
                          >
                            { headerVerbiages() }

                          </Text>
                        </div>
                        {
                          ( getAuthToken() && getProductName() !== PACKS.FREEMIUM ) &&
                          <Text
                            textAlign='center'
                            textStyle='body-1'
                            color='white'
                            htmlTag='p'
                          >
                            { headerVerbiages( true ) }

                          </Text>
                        }


                        { ( !getAuthToken() || getProductName() === PACKS.FREEMIUM ) &&
                        <div className='SubscriptionPackage__header--sections'>
                          <div className='SubscriptionPackage__header--section1'>
                            <Image
                              src={ `${ config?.open_platform?.guest_user_heading_image_1 }` }
                            />
                            <Text
                              textAlign='left'
                              textStyle='subtitle-4'
                              color={ 'white' }
                              htmlTag='p'
                            >
                              { config?.open_platform?.guest_user_heading_text_1 }
                            </Text>
                          </div>
                          <div className='SubscriptionPackage__header--divider'></div>
                          <div className='SubscriptionPackage__header--section2'>
                            <Image
                              src={ `${ config?.open_platform?.guest_user_heading_image_2 }` }
                            />
                            <Text
                              textAlign='left'
                              textStyle='subtitle-4'
                              color={ 'white' }
                              htmlTag='p'
                            >
                              { config?.open_platform?.guest_user_heading_text_2 }
                            </Text>
                          </div>
                          <div className='SubscriptionPackage__header--divider'></div>
                          <div className='SubscriptionPackage__header--section3'>
                            <Image
                              src={ `${ config?.open_platform?.guest_user_heading_image_3 }` }
                            />
                            <Text
                              textAlign='left'
                              textStyle='subtitle-4'
                              color={ 'white' }
                              htmlTag='p'
                            >
                              { config?.open_platform?.guest_user_heading_text_3 }
                            </Text>
                          </div>
                        </div>
                        }
                      </div>
                    </div>
                    <div className={
                      classNames( `SubscriptionPackage__content`,
                        { 'SubscriptionPackage__contentCardTwo': Array.isArray( packageList ) && packageList.length === 2 },
                        { 'SubscriptionPackage__contentCardOne': Array.isArray( packageList ) && packageList.length === 1 }
                      ) }
                    ref={ packCardScrollRef }
                    >
                      {
                        renderPackagesList
                      }
                    </div>
                  </>
                  }
                </div>
              )
            )
      }
    </div>

  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} subscriptionPackageTitleIcon - set the subscriptionPackageTitleIcon of the subscription
 * @property {string} subscriptionPackageTitle - set the subscriptionPackageTitle
 * @property {string} subscriptionPackageSubTitle - set the subscriptionPackageSubTitle
 * @property {array} subscriptionPackages - set the subscriptionPackages
 */
export const propTypes = {
  subscriptionPackageTitleIcon: PropTypes.string,
  subscriptionPackageTitle: PropTypes.string,
  subscriptionPackageSubTitle: PropTypes.string,
  subscriptionPackages: PropTypes.array
};


SubscriptionPackage.propTypes = propTypes;

export default SubscriptionPackage;
