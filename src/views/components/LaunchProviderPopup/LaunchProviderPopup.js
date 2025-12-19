/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import './LaunchProviderPopup.scss';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import constants, { APPIDS, PAGE_TYPE, PRIME, PROVIDER_LIST, SENTRY_LEVEL, SENTRY_TAG, CONTENT_TYPE } from '../../../utils/constants';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { useHistory } from 'react-router-dom';
import { launchPartnerApp, getParamsTags, getLaunchAppID } from '../../../utils/slayer/PlaybackInfoService';
import Text from '../Text/Text';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { PlayingEventApiCalling } from '../../../utils/slayer/PlayerService';
import { getHotStarPopupCount, setHotStarPopupCount } from '../../../utils/localStorageHelper';
import classNames from 'classnames';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { primeRedirectionPopupProceed } from '../../../utils/mixpanel/mixpanelService';
import { clearEpisodeListData, contentPlayMixpanelEventForDeeplink, getTAUseCaseId, handleRedirectionParentalPinSetup, sendExecptionToSentry } from '../../../utils/util';
import { getPrimeNudgeStatus } from '../../../utils/primeHelper';

const LaunchProviderPopup = ( props ) => {

  const { provider, handleForgotAccount } =  props
  const history = useHistory();
  const { metaData, storedLastWatchData } = usePlayerContext()

  const episodeMeta = {
    type:  metaData?.contentType === CONTENT_TYPE.BRAND ? CONTENT_TYPE.TV_SHOWS : metaData?.contentType,
    id:  storedLastWatchData?.vodId || metaData?.vodId || metaData?.id
  };

  const [playerEventObj] = PlayingEventApiCalling( { metaData, watchedTime: 0 }, true );
  const { playerEventFetchData } = playerEventObj;

  const { profileAPIResult } = useProfileContext()
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const { liveContent, flexiPlanVerbiagesContext, storeRailData, episodePageData } = useMaintainPageState();
  const amazonSubscriptionVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage, [flexiPlanVerbiagesContext.current] )
  const appleDownloadVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.appleSubscriptionVerbiage?.lsDownloadPartnerPopup, [flexiPlanVerbiagesContext.current] )
  const providerImageSize = provider?.toLowerCase() === PROVIDER_LIST.APPLETV ? 120 : 90
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } )

  const providerchecker = config.available_partners.some( item => item.toLowerCase() === PROVIDER_LIST.HOTSTAR || item.toLowerCase() === PROVIDER_LIST.ZEE5 )
  const rmnNumber = profileAPIResult && profileAPIResult.data?.rmn;

  const mobileNumber = 'xxxxx' + rmnNumber?.slice( -5 )
  const unmaskedMobileNumber = rmnNumber

  const responseSubscription = useSubscriptionContext()
  const myPlanProps = responseSubscription?.responseData.currentPack

  const keys = Object.keys( config.Partnerpopupdetails )
  const values = Object.values( config.Partnerpopupdetails )
  let zee5 = keys.map( ( item, index ) => {
    if( item === `step${index + 1}Heading` ){
      return { item: values[index]?.replace( /{partner}/, `${provider} ` ) }
    }
  } )

  let hotstar = Object.entries( config.Partnerpopupdetails )
    .filter( ( [key, value] ) => key.includes( 'HotstarHeading' ) )
    .map( ( [key, value] ) => ( { 'item': value } ) );

  zee5 = zee5.filter( function( element ){
    return element !== undefined;
  } );
  hotstar = hotstar.filter( function( element ){
    return element !== undefined;
  } );

  console.log( ' prime data = ', amazonSubscriptionVerbiages )
  console.log( ' tagID = ', props.tagId ); // eslint-disable-line
  console.log( ' contentId = ', props.contentId ); // eslint-disable-line
  console.log( ' partnerDEEPlinkULR = ', props.partnerDeepLinkUrl ); // eslint-disable-line

  if( hotstar && hotstar.length >= 1 ){
    hotstar[1].item = `${hotstar[1].item} "${ mobileNumber }"`
  }

  let apple = Object.entries( config.Partnerpopupdetails )
    .filter( ( [key, value] ) => key.includes( 'AppleHeading' ) )
    .map( ( [key, value] ) => ( { 'item': value } ) );

  const primeData = amazonSubscriptionVerbiages && ( props.appLaunch ? amazonSubscriptionVerbiages.lsamazonRedirectionConfirmationPopup : amazonSubscriptionVerbiages.lsdownloadPrimeAppPopup ) || {}

  const popupDescription = provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR ? hotstar : provider?.toLowerCase() === PROVIDER_LIST.APPLETV ? apple : zee5
  const disneyLogo = !props.appLaunch ? 'Disney' : 'Disney1';
  const divStyle = {
    display: props.displayModal ? 'block' : 'none',
    zIndex: 999999
  };

  const downloadAppHandler = ( e ) => {
    e?.stopPropagation()
    window.webOS?.service.request( 'luna://com.webos.applicationManager', {
      method: 'launch',
      parameters: {
        id: APPIDS.PLAYSTORE,
        params: {
          'query': APPIDS.REDIRECT_PATH + getLaunchAppID( provider )
        }
      },
      onSuccess: ( res ) => {
        console.log( 'zee5 open success. ', res ); // eslint-disable-line
      },
      onFailure: ( res ) => {
        console.log( 'zee5 open fail. ', res ); // eslint-disable-line
        sendExecptionToSentry( res, `${ SENTRY_TAG.LAUNCH_STORE_ERROR } ${ provider } ${ getLaunchAppID( provider ) }`, SENTRY_LEVEL.ERROR );
      }
    }
    )
  }

  const onClickParental = ( e ) => {
    e?.stopPropagation()
    if( props.appLaunch ){
      if( props.parentalPinStatus ){
        const args = {
          providerName: props.providerName,
          tagid: props.tagId,
          partnerDeepLinkUrl: props.partnerDeepLinkUrl,
          contentId: props.contentId
        }
        handleRedirectionParentalPinSetup( history, args )
      }
      else {
        const taUseCaseId = getTAUseCaseId( storeRailData.current );
        contentPlayMixpanelEventForDeeplink( metaData, props, myPlanProps, responseSubscription, taUseCaseId, null )
        console.log( 'LAUNCHPROVIDERPOPUP targetURL = ', props.contentId + '?tag=' + props.tagId ); // eslint-disable-line
        playerEventFetchData( { type: episodeMeta?.type, id: episodeMeta?.id, watchDuration: 10 } );
        launchPartnerApp( props.providerName, getParamsTags( props.providerName, props.partnerDeepLinkUrl, props.tagId, props.contentId ), undefined, liveContent );
      }
      provider?.toLowerCase() === PROVIDER_LIST.PRIME && primeRedirectionPopupProceed( responseSubscription )
    }
  }

  const primeDescription = () => {
    if( !props.appLaunch ){
      return primeData.subTitle
    }
    else if( props.appLaunch ){
      if( getPrimeNudgeStatus( {}, {}, myPlanProps ) ){
        return primeData.subTitle3
      }
      else {
        return primeData.subTitle2
      }
    }
  }

  const renderPrimePopup = () => {
    return (
      <div className='launchProvider__prime'>
        <div className='launchProvider__prime--title'>
          <Text
            textStyle='prime-modal-title'
            color='white'
          >
            { primeData.title }
          </Text>
        </div>
        <div className='launchProvider__prime--subTitle'>
          <Text
            textStyle='prime-modal-subTitle'
            color='white'
          >
            { primeDescription() }
          </Text>
        </div>
      </div>
    )
  }

  const renderApplePopup = () => {
    return (
      <div className='launchProvider__apple'>
        <div className='launchProvider__apple--title'>
          <Text
            textStyle='apple-modal-title'
            color='white'
          >
            { appleDownloadVerbiages?.title }
          </Text>
        </div>
        <div className='launchProvider__apple--subTitle'>
          <Text
            textStyle='apple-modal-subTitle'
            color='white'
          >
            { appleDownloadVerbiages?.subTitle }
          </Text>
        </div>
      </div>
    )
  }

  const getImageRender = () =>{
    if( provider?.toLowerCase() === PROVIDER_LIST.PRIME ){
      return amazonSubscriptionVerbiages?.lsPrimeLogo
    }
    else if( provider?.toLowerCase() === PROVIDER_LIST.APPLETV ){
      return appleDownloadVerbiages?.appleLogo
    }
    else {
      return config?.providerLogo?.[provider?.toUpperCase()]?.logoCircular
    }
  }

  useEffect( ()=>{
    setFocus( 'BUTTON_PRIMARY_1' )
    return () => {
      window.location.pathname.includes( PAGE_TYPE.SERIES_DETAIL ) && clearEpisodeListData( episodePageData )
    }
  }, [] )

  useEffect( () => {
    if( props.appLaunch ){
      provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR && setHotStarPopupCount( getHotStarPopupCount() + 1 )
    }
  }, [props.appLaunch] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }>
        <Modal
          id='launchProviderModalId'
          customClassName='launchProviderModal'
          ref={ props.modalRef }
          opener={ props.opener }
          closeModalFn={ props.handleCancel }
        >
          <div
            className={
              classNames( 'launchProvider',
                { 'launchProvider__primeProvider' : provider?.toLowerCase() === PROVIDER_LIST.PRIME } )
            }
            style={ divStyle }
          >
            <span className='launchProvider__close'>
            </span>
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <div className='launchProvider__back'>
                <Button
                  onClick={
                    props.handleCancel
                  }
                  iconLeftImage={ 'Path' }
                  iconLeft={ true }
                  secondary={ true }
                  size='medium'
                  label={ constants.GOBACK }
                />
              </div>
            </FocusContext.Provider>
            <div className='launchProvider__image'>
              { /* { provider?.toLowerCase() === PROVIDER_LIST.HOTSTAR ? ( // TODO: Once updated svg will be shared we may need to revert, so commented
                <Icon name={ disneyLogo }/>
              ) : ( */ }
              <Image
                src={ getImageRender() }
                height={ providerImageSize }
                width={ providerImageSize }
              />
              { /* ) } */ }
            </div>
            <div className='launchProvider__modal-text'>
              <div
                className={
                  classNames( 'launchProvider__content',
                    { 'launchProvider__content--prime' : provider?.toLowerCase() === PROVIDER_LIST.PRIME },
                    { 'launchProvider__content--apple' : provider?.toLowerCase() === PROVIDER_LIST.APPLETV }
                  )
                }
              >
                { provider?.toLowerCase() === PROVIDER_LIST.PRIME ? renderPrimePopup() : provider?.toLowerCase() === PROVIDER_LIST.APPLETV ? renderApplePopup() :
                  props.appLaunch && config.hotstarPopup ? (
                    <><p className='launchProvider__content__3'>{ config.hotstarPopup?.hotstarTitle }</p><p className='launchProvider__content__4'>{ ` ${config.hotstarPopup?.hotstarDescription} ${unmaskedMobileNumber}` }</p></>
                  ) : (
                    popupDescription.map( ( item, index, steps ) =>{
                      if( providerchecker ){
                        if( item !== undefined ){
                          return (
                            <div className='launchProvider__flex'
                              key={ index }
                            >
                              {
                                !item.item?.includes( constants.APPLE_TV_VARBIAGE ) && (
                                  <div className='launchProvider__content__1'>
                                    <Text
                                      textStyle='proider-modal-header'
                                      color='white'
                                    >
                                      Step { index + 1 }
                                    </Text>
                                  </div>
                                )
                              }
                              <div className='launchProvider__content__2'>
                                <Text
                                  textStyle='proider-modal-text'
                                  color='white'
                                >
                                  { item.item }
                                </Text>
                              </div>
                            </div>
                          )
                        }
                      }
                    } )
                  ) }
              </div>
            </div>
            { !props.appLaunch ? (
              <div className={
                classNames( 'launchProvider__downloadButton',
                  { 'launchProvider__downloadButton--apple' : provider?.toLowerCase() === PROVIDER_LIST.APPLETV }
                )
              }
              >
                <Button
                  label={ provider?.toLowerCase() === PROVIDER_LIST.PRIME ? primeData.primaryCTA : provider?.toLowerCase() === PROVIDER_LIST.APPLETV ? appleDownloadVerbiages?.primaryCTA : constants.DOWNLOAD_NOW }
                  primary
                  onClick={ ( e ) => downloadAppHandler( e ) }
                  focusKeyRefrence={ 'BUTTON_PRIMARY_1' }
                />
              </div>
            ) : (
              <div className='launchProvider__buttons'>
                <div className='launchProvider__button'>
                  <Button
                    label={ provider?.toLowerCase() === PROVIDER_LIST.PRIME ? primeData.primaryCTA : constants.PROCEED }
                    primary
                    onClick={ ( e ) => onClickParental( e ) }
                    focusKeyRefrence={ 'BUTTON_PRIMARY_1' }
                  />
                </div>
                <>
                  {
                    provider?.toLowerCase() !== PROVIDER_LIST.PRIME && (
                      <div className='launchProvider__button'>
                        <Button
                          label={ constants.CANCEL }
                          primary
                          onClick={ props.handleCancel }
                          focusKeyRefrence={ 'BUTTON_PRIMARY_2' }
                        />
                      </div>
                    )
                  }
                  {
                    provider?.toLowerCase() === PROVIDER_LIST.PRIME && myPlanProps.apvDetails?.primePackStatus === PRIME.PACK_STATUS.ACTIVATED && (
                      <div className='launchProvider__button launchProvider__forgotButton'>
                        <Button
                          label={ primeData.accountRecoveryCTA }
                          primary
                          onClick={ handleForgotAccount }
                          focusKeyRefrence={ 'BUTTON_PRIMARY_2' }
                        />
                      </div>
                    )
                  }
                </>
              </div>
            )
            }
          </div>
        </Modal>
      </div>

    </FocusContext.Provider>
  )
}
export default LaunchProviderPopup;
