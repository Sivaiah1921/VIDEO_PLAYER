/* eslint-disable no-console */
/**
 * Free trial card
 *
 * @module views/components/TenurePlanPage
 * @memberof -Common
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TenurePlanPage.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import PlanCard from '../PlanCard/PlanCard';
import { useParams } from 'react-router-dom';
import { formatResponse, fetchTenure, getPlanDetail } from '../../../utils/slayer/SubscriptionPackageService';
import { CHANGE_PLAN_TYPE, constants, PROVIDER_LIST } from '../../../utils/constants';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Loader from '../Loader/Loader';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider'
import Button from '../Button/Button';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { myPlanChangeTenure, packTenureView, pack_selected } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import PackageCard from '../PackageCard/PackageCard';
import { storeAllPaths } from '../../../utils/util';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import FlexiTenurePage from '../FlexiTenurePage/FlexiTenurePage';
import AppMediaCard from '../AppMediaCard/AppMediaCard';

/**
  * Represents a TenurePlanPage component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns TenurePlanPage
  */
export const TenurePlanPage = function( props ){
  const loaderPath = `${window.assetBasePath}loader.gif`;
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const isSelectedTenure = useRef( false )
  const history = useHistory();
  const { productId, type, location } = useParams();
  const [plan, setPlan] = useState( null )
  const [selectedTenure, setSelectedTenure] = useState( null )
  const [isFlexiTenure, setIsFlexiTenure] = useState( false )
  const previousPathName = useNavigationContext();
  const { responseData, response: currentPlanResponse } = useSubscriptionContext();
  const { flexiPlanVerbiagesContext } = useMaintainPageState();
  const { fetchData, response, error, loading } = responseData.allPacks;
  const { packResponse, plancard } = formatResponse( response )
  const plandetail = fetchTenure( plancard, productId, type, currentPlanResponse, location )
  const { headTitle, title, records, flexiPlan } = plandetail
  const packInfo = useMemo( ()=> getPlanDetail( plancard, productId, selectedTenure, responseData.currentPack, currentPlanResponse, type, flexiPlanVerbiagesContext ), [selectedTenure] )
  const { deviceDetails, apps, nonAvailablePartners, nonAvailablePartnersSamsung, ahaFooterMessage, jioCinemaFooterMessage } = packInfo.planDetail
  const { primeAddOn = {} } = packInfo.currentTenure
  const myPlanProps = responseData.currentPack || {}
  const { addonPartnerList = [] } = myPlanProps


  const onSelectedFn = ( item ) =>{
    myPlanChangeTenure( item.plan, title )
    const object = {
      plan: item.plan,
      amount: item.amountWithoutCurrency
    }
    localStorage.setItem( 'tenurePageData', JSON.stringify( object ) )
    setPlan( item )
    isSelectedTenure.current = true
    previousPathName.selectedtenure = item.plan
  }

  const { ref, focusKey } = useFocusable(
    {
      isFocusBoundary: true
    }
  );

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

  useEffect( () => {
    if( records && records.length > 0 && !isSelectedTenure.current && !loading ){
      if( previousPathName.selectedtenure === null ){
        setTimeout( ()=>setFocus( `TENURE_${ records[0].plan }` ), 500 )
      }
      else {
        setTimeout( ()=>{
          setFocus( `TENURE_${ previousPathName.selectedtenure }` )
          previousPathName.selectedtenure = null
          isSelectedTenure.current = false
        }, 500 )
      }
    }
    !loading && setFocus( 'TEMPERARY_FOCUS_ELEMENT' )
  }, [loading] )

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `TENURE_${id}` )
  }

  useEffect( ()=>{
    packTenureView( title )
    storeAllPaths( window.location.pathname )
    if( previousPathName.current?.includes( '/content/detail' ) ){
      // ..
    }
    else {
      previousPathName.current = window.location.pathname
    }
  }, [] )

  useEffect( () => {
    const myPlanProps = responseData.currentPack;
    if( plan ){
      if( myPlanProps && myPlanProps?.upgradeMyPlanType ){
        /* Mixpanel-event */
        pack_selected( title, MIXPANELCONFIG.VALUE.UPGRADE, plan.amountWithoutCurrency, plan.plan, true, responseData )
      }
      else {
        /* Mixpanel-event */
        pack_selected( title, MIXPANELCONFIG.VALUE.FRESH, plan.amountWithoutCurrency, plan.plan, true, responseData )
      }
    }

  }, [plan] )

  const handleCancelSubscription = ( ) => {
    setIsFlexiTenure( true )
  }

  const BackgroundImage = config?.welcomeScreen?.backgroundImage;
  return (
    <div>
      { loading ? <Loader /> : (
        <div className='TenurePlanPage'>
          <BackgroundComponent
            bgImg={ BackgroundImage }
            alt='Login BackgroundImage'
            isGradient={ false }
          />
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='TenurePlanPage__topSection'>
              <Button
                onClick={ ()=> history.goBack() }
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
          <div className='TenurePlanPage__header'>
            <Text
              textStyle='title-1'
              color='white'
              htmlTag='span'
            >
              { headTitle }
            </Text>
          </div>
          <div className='TenurePlanPage__content'>
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='TenurePlanPage__leftPanel'>
                {
                  !selectedTenure && type === CHANGE_PLAN_TYPE.TENURE ? (
                    <div className='TenurePlanPage__loader'>
                      <Image
                        src={ loaderPath }
                      />
                    </div>
                  ) : (
                    <>
                      <div className='TenurePlanPage__apps'>
                        <PackageCard
                          title={ title }
                          titlePremium={ true }
                          titleIcon={ 'CrownWithBG' }
                          appLabel={ 'apps' }
                          deviceDetails={ deviceDetails }
                          deviceIcon={ 'Devices' }
                          monthlyPlan={ '' }
                          apps={ apps }
                          // remaingApps={ true }
                          appsToShow={ 31 }
                          verbiageToShow={ 32 }
                          nonAvailablePartners={ nonAvailablePartners }
                          nonAvailablePartnersSamsung={ nonAvailablePartnersSamsung }
                          ahaFooterMessage={ ahaFooterMessage }
                          jioCinemaFooterMessage={ jioCinemaFooterMessage }
                        />
                      </div>
                      {
                        myPlanProps?.primeAddOn?.addOnEligibility && primeAddOn?.text && addonPartnerList?.map( String ).some( partner => partner.toLowerCase() === PROVIDER_LIST.PRIME ) && (
                          <div className='TenurePlanPage__PrimeLitefdoVerbiage'>
                            <AppMediaCard
                              title={ 'image' }
                              image={ primeAddOn?.logo || '' }
                              isSubscritionModule={ true }
                            />
                            <div className='TenurePlanPage__PrimeLitefdoVerbiage--info'>
                              <div className='prime-line'>{ renderBoldText( primeAddOn?.text?.split( /\n|\r\n|\\n/ )[0] || '' ) }</div>
                              <div className='prime-line'>{ renderBoldText( primeAddOn?.text?.split( /\n|\r\n|\\n/ )[1] || '' ) }</div>
                            </div>
                          </div>
                        )
                      }
                    </>
                  )
                }
              </div>
            </FocusContext.Provider>
            <FocusContext.Provider value={ focusKey }>
              <div className='TenurePlanPage__rightPanel'
                ref={ ref }
              >
                { /* {
                  headerVerbiage && (
                    <div className='TenurePlanPage__rightPanel--header'>
                      { headerVerbiage }
                    </div>
                  )
                } */ }
                {
                  records.map( ( item, index ) => (
                    <PlanCard { ...item }
                      key={ item.plan + '_' + index }
                      onSelected={ ( e )=> onSelectedFn( item ) }
                      focusKeyRefrence={ 'TENURE_' + item.plan }
                      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( item.plan ) }
                      type={ type }
                      productId={ productId }
                      onFocus={ ()=>{
                        setSelectedTenure( item.tenureId )
                        previousPathName.previousMediaCardFocusBeforeSplash = 'TENURE_' + item.plan
                      } }
                      { ...flexiPlan && {
                        flexiPlan: flexiPlan,
                        handleFlexiTenureClick: () => {
                          setIsFlexiTenure( true )
                        }
                      } }
                    />
                  ) )
                }

              </div>
            </FocusContext.Provider>
          </div>
          { isFlexiTenure &&
            <FlexiTenurePage planDetails={ plan }
              closeFlexiQRPopup={ handleCancelSubscription }
            />
          }
        </div>
      ) }
    </div>
  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} title - set the title of the card
  * @property {string} headTitle - set the Hearder title of the card
  * @property {string} records - set the list of planCards
  * @property {string} apps - set the list of cards
  */

export const propTypes = {
  title: PropTypes.string,
  headTitle: PropTypes.string,
  records: PropTypes.array,
  apps: PropTypes.array
};


TenurePlanPage.propTypes = propTypes;

export default TenurePlanPage;
