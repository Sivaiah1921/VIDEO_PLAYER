/* eslint-disable no-console */
/**
 * To launch popup for deeplink partner for samsung
 *
 * @module views/components/LaunchProviderPopupSamsung
 * @memberof -Common
 */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './LaunchProviderPopupSamsung.scss';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import constants, { APPLETV, PAGE_TYPE, PROVIDER_LIST, appleVerbiage, hotstarverbiage, lionsgateverbiage, primeVerbiage, zee5verbiage } from '../../../utils/constants';
import Icon from '../Icon/Icon';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Text from '../Text/Text';
import Image from '../Image/Image';
import { getHotStarPopupCount, getRmn, setHotStarPopupCount } from '../../../utils/localStorageHelper';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { getPrimeNudgeStatus } from '../../../utils/primeHelper';
import { clearEpisodeListData } from '../../../utils/util';


/**
 * Represents a LaunchProviderPopupSamsung component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns LaunchProviderPopupSamsung
 */
const LaunchProviderPopupSamsung = function( props ){

  const { profileAPIResult } = useProfileContext()

  const { provider } =  props
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const { flexiPlanVerbiagesContext, episodePageData } = useMaintainPageState();
  const amazonSubscriptionVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } )

  const providerchecker = config.available_partners.some( item => item.toLowerCase() === PROVIDER_LIST.HOTSTAR || item.toLowerCase() === PROVIDER_LIST.ZEE5 )
  const rmnNumber = profileAPIResult && profileAPIResult.data?.rmn;

  const mobileNumber = 'xxxxx' + rmnNumber?.slice( -5 )
  const unmaskedMobileNumber = rmnNumber


  console.log( ' SAMSUNG = ', props, config ); // eslint-disable-line
  console.log( ' tagID = ', props.tagId ); // eslint-disable-line
  console.log( ' contentId = ', props.contentId ); // eslint-disable-line

  const disneyLogo = !props.appLaunch ? constants.DISNEY_LOGO : constants.DISNEY_LOGO_Other;
  const divStyle = {
    display: props.displayModal ? 'block' : 'none',
    zIndex: 999999
  };
  useEffect( ()=>{
    setFocus( 'BUTTON_PRIMARY_1' )
    return () => {
      window.location.pathname.includes( PAGE_TYPE.SERIES_DETAIL ) && clearEpisodeListData( episodePageData )
    }
  }, [] )

  useEffect( () => {
    if( props.appLaunch ){
      setHotStarPopupCount( getHotStarPopupCount() + 1 )
    }
  }, [props.appLaunch] )

  const renderSamsungPopUp = ( verbiage ) => {
    return (
      <>
        <div className='launchProviderSamsung__header'>
          <Text
            textStyle='provider-modal-header'
            color='white'
          >
            { verbiage?.header }
          </Text>
        </div>
        { verbiage?.others?.steps?.map( ( item, index ) =>{
          if( providerchecker ){
            if( item !== undefined ){
              return (
                <div className='launchProviderSamsung__flex'
                  key={ index }
                >
                  <div className='launchProviderSamsung__content__1'>
                    <Text
                      textStyle='provider-modal-descrption-steps'
                      color='white'
                    >
                      { item.text1 }
                    </Text>
                  </div>
                  <div className='launchProviderSamsung__content__2'>
                    <Text
                      textStyle='provider-modal-descrption-details'
                      color='purple-25'
                    >
                      { getText( item, index ) }
                      { /* { ( provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR && index === 1 ) ? ( item.text2 + ` "${getRmn()}"` ) : item.text2 } */ }
                    </Text>
                  </div>
                </div>
              )
            }
          }
        } ) }
        <div className='launchProviderSamsung__buttons'>
          <div className='launchProviderSamsung__button'>
            <Button
              label={ verbiage?.others?.buttonHeader || constants.OK }
              primary
              onClick={ props.handleCancel }
              focusKeyRefrence={ 'BUTTON_PRIMARY_1' }
            />
          </div>
        </div>
      </>
    )
  };

  const renderPopup = () => {
    switch ( provider?.toLowerCase() ){
      case PROVIDER_LIST.HOTSTAR:
        return renderSamsungPopUp( config.hotstarverbiage || hotstarverbiage )
      case PROVIDER_LIST.ZEE5:
        return renderSamsungPopUp( config.zee5verbiage || zee5verbiage )
      case PROVIDER_LIST.LIONSGATE:
        return renderSamsungPopUp( config.lionsgateverbiage || lionsgateverbiage )
      case PROVIDER_LIST.APPLETV:
        return renderSamsungPopUp( config.appleTVRedemptionDetails.filter( z => z.category === APPLETV.APPLE_TV_WATCH_CONTENT_CONSUMED )?.[0] || appleVerbiage.filter( z => z.category === APPLETV.APPLE_TV_WATCH_CONTENT_CONSUMED )?.[0] )
      case PROVIDER_LIST.PRIME:
        return renderSamsungPopUp( config.primeVerbiages?.samsungVerbiages || primeVerbiage )
    }
  }

  const getText = ( data, index ) => {
    switch ( provider?.toLowerCase() ){
      case PROVIDER_LIST.HOTSTAR:
        return index === 1 ? ( data.text2 + ` "${getRmn()}"` ) : data.text2;
      case PROVIDER_LIST.PRIME:
        return index === 1 ? getPrimeNudgeStatus( {}, {}, props.myPlanProps ) ? data.text2 : data.text3 : data.text2;
      default:
        return data.text2;
    }
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }>
        <Modal
          id='launchProviderModalId'
          customClassName='launchProviderModalSamsung'
          ref={ props.modalRef }
          opener={ props.opener }
          closeModalFn={ props.handleCancel }
        >
          <div className='launchProviderSamsung'
            style={ divStyle }
          >
            <span className='launchProviderSamsung__close'>
            </span>
            <div className='launchProviderSamsung__image'>
              { provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR ? (
                <Icon name={ disneyLogo }/>
              ) : (
                <Image
                  src={ provider?.toLowerCase() === PROVIDER_LIST.PRIME ? amazonSubscriptionVerbiages?.lsPrimeLogo : config?.providerLogo?.[provider?.toUpperCase()]?.logoCircular }
                  height={ 90 }
                  width={ 90 }
                />
              ) }
            </div>
            <div className='launchProviderSamsung__modal-text'>
              <div className='launchProviderSamsung__content'>
                { renderPopup() }
              </div>
            </div>
          </div>

        </Modal>
      </div>

    </FocusContext.Provider>
  )
}

export default LaunchProviderPopupSamsung;
