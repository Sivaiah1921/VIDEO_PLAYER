
/**
 * Carousel component used by other mudules as a reusable component which returns ui for media carousel component. required fields can be passed as props
 *
 * @module views/components/Carousel
 * @memberof -Common
 */
import React, { useRef, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Carousel.scss';
import classNames from 'classnames';
import Image from '../Image/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import {
  Autoplay, Pagination, EffectFade
} from 'swiper/modules';
import { MIXPANEL_RAIL_TYPE, cloudinaryCarousalUrl, getBingePrimeStatus, getBingePrimeStatusMixpanel, getProviderLogo, getSourceForMixPanel, getTAUseCaseId, handleDistroRedirection, isCrownNew, setMixpanelData, getFilteredContentType, getMixpanelData, modalDom, contentDetailUrl, redirection } from '../../../utils/util';
import { useHistory } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { activateAppleTVSubscriptionClick, content_click, home_hero_banner_click, home_hero_banner_horizontalSwipe, home_hero_banner_view, bingelist_add, bingelist_remove_item } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { getAuthToken, setContentRailPositionData, setTrailerContentCategory, setTrailerCTA, setTrailerFromApi, setTrailerResumeTime } from '../../../utils/localStorageHelper';
import constants, { APPLE_PRIME_ACTIVATION_JOURNEY, COMMON_HEADERS, CONTENT_TYPE, DISTRO_CHANNEL, InterstitialPage_Routes, MIXPANEL_CONTENT_TYPE, PARTNER_SUBSCRIPTION_TYPE, PROVIDER_LIST, PAGE_NAME, MEDIA_CARD_TYPE, NON_HB_CONTENTS_TYPES, SECTION_SOURCE, HERO_BANNER_LAYOUT } from '../../../utils/constants';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { isLiveContentType, isSonyContent } from '../../../utils/slayer/PlayerService';
import { usePlayerContext } from '../../core/PlayerContextProvider/PlayerContextProvider';
import { getProviderWithoutToken, interstitialScreenRedirection, getChannelPlayableStatus, updateHBRailWithBingeListFav, convertHexToRgba } from '../../../utils/commonHelper';
import { AppleActivationRedemCode } from '../../../utils/slayer/AmazonPrimeService';
import { getAppleJourneyStatus } from '../../../utils/appleHelper';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { AddToBingListCall } from '../../../utils/slayer/BingeListService';
import get from 'lodash/get';
import { setBingeListPeopleProperties } from '../../../utils/mixpanel/mixpanel';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
  * Represents a Carousel component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Carousel
  */
export const Carousel = ( props ) => {
  const { profileAPIResult } = useProfileContext()
  const { focusKeyRefrence, url, pageType, items, sectionSource, layoutType, isBackground, spacerValue, isLinearGradient, isOverlayBackground, onFocus, sectionType, onIconAndMessageChange, caroselPageView, imageCardSize, layoutTypeForMixPanel, buttonCTAText, autoScroll } = props
  const [bannerInView, setBannerInView] = useState( {} )
  const [isFocused, setIsFocused] = useState( false )
  const { setCatalogFlag, setContentParams, setIsFav, setIsWatchListUpdated, catalogFlag } = useHomeContext()
  const carouselRef = useRef();
  const history = useHistory();
  const { railsRestoreId, piPageFocus, storeRailData, setLiveContent, setPlayerAction, setBroadcastMode } = useMaintainPageState() || null
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const { setMetaData, metaData } = usePlayerContext()
  const [appleActivationCodeRedemption] = AppleActivationRedemCode( true );
  const { appleFetchData, appleRedemptionResponse, appleRedemptionLoading } = appleActivationCodeRedemption;
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const previousPathName = useNavigationContext();

  const providerLogoList = useMemo( () => get( config, 'providerLogo' ), [config] )
  const filtererdType = useMemo( () => {
    return bannerInView?.contentType ? getFilteredContentType( bannerInView?.contentType ) : bannerInView?.contentType;
  }, [bannerInView?.contentType] );

  const [addRemoveBingeList] = AddToBingListCall( { type:filtererdType, id:bannerInView?.id, provider: bannerInView?.provider } );
  const { addRemoveBingeListFetchData, addRemoveBingeListResponse } = addRemoveBingeList;

  const autoPlay = useMemo( () => {
    return profileAPIResult?.data?.autoPlayTrailer !== false;
  }, [profileAPIResult] );

  let isFocus = true;
  const { ref, focused, focusKey } = useFocusable( {
    onFocus,
    onArrowPress: ( direction ) => {
      if( sectionSource !== SECTION_SOURCE.HERO_BANNER_NEW ){
        const carouselIndex = carouselRef.current?.swiper?.snapIndex;
        if( carouselIndex === 0 ){
          isFocus = false;
        }
        else {
          isFocus = true
        }
        if( direction === 'right' ){
          if( carouselIndex === carouselRef.current?.swiper?.slides.length - 1 ){
            carouselRef.current?.swiper?.slideTo( 0 )
          }
          else {
            carouselRef.current?.swiper?.slideNext();
          }
          isFocus = true;
        }
        if( direction === 'left' ){
          carouselRef.current?.swiper?.slidePrev();
          if( isFocus ){
            return false;
          }
          return true;
        }
      }
    },
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onEnterPress: () => {
      handleWatchNowCtaFn()
    }
  } );

  const handleWatchNowCtaFn = ()=>{
    if( !items ){
      return
    }
    const carouselInfo = items[carouselRef.current?.swiper?.snapIndex]
    if( carouselInfo ){
      setLiveContent( carouselInfo.liveContent || isLiveContentType( carouselInfo.contentType ) );
      setPlayerAction( carouselInfo?.playerAction )
      setBroadcastMode( carouselInfo?.broadcastMode )
      const MPItems = {
        pageType: getSourceForMixPanel( window.location.pathname ),
        title: carouselInfo.title,
        railPosition: props.railPosition + 1,
        contentType: carouselInfo.contentType,
        sectionSource: sectionSource,
        language: carouselInfo.language?.join() || '',
        primaryLanguage: carouselInfo.language?.[0] || '',
        genre: carouselInfo.genre?.join() || '',
        primaryGenre: carouselInfo.genre?.[0] || '',
        provider: carouselInfo.provider,
        contentPosition: carouselRef.current?.swiper?.snapIndex + 1,
        contentRating: carouselInfo.rating,
        contentTitle: carouselInfo.title,
        contentAuth: carouselInfo.partnerSubscriptionType?.toLowerCase() !== PARTNER_SUBSCRIPTION_TYPE.FREE,
        releaseYear: carouselInfo.releaseYear,
        deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
        actors: carouselInfo.actor?.join() || '',
        source: getSourceForMixPanel( window.location.pathname ),
        packPrice: responseSubscription?.responseData?.currentPack?.amountValue ? responseSubscription?.responseData?.currentPack?.amountValue : '',
        packName: responseSubscription?.responseData?.currentPack?.upgradeMyPlanType ? responseSubscription?.responseData?.currentPack?.upgradeMyPlanType : '',
        autoPlayed: autoPlay,
        liveContent: carouselInfo.liveContent,
        railTitle: constants.HERO_BANNER,
        sectionType: props.sectionType,
        channelName: '',
        channelNumber: '',
        bingePrimeStatus: getBingePrimeStatusMixpanel( responseSubscription ),
        bingePrimePackStatus: getBingePrimeStatus( responseSubscription )
      }
      const obj = {
        contentPosition: carouselRef.current?.swiper?.snapIndex + 1,
        railPosition: props.railPosition + 1,
        sectionType: props.sectionType,
        contentType: carouselInfo.contentType,
        sectionSource: props.sectionSource,
        railTitle: constants.HERO_BANNER,
        configType: props.configType,
        autoPlayed: autoPlay,
        railId: props.railId,
        contentId: carouselInfo.id
      }
      piPageFocus.current = 'BUTTON_PRIMARY'
      setContentRailPositionData( obj )
      let placeHolder = 'Editorial HB';
      let contentType = MIXPANEL_CONTENT_TYPE.EDITORIAL
      if( carouselInfo.isRecommendation ){
        placeHolder = `TA HB ${ storeRailData.leftMenuClicked }`
        contentType = MIXPANEL_CONTENT_TYPE.RECOMMENDED
      }
      if( bannerInView?.marketingAsset ){
        contentType = MIXPANEL_CONTENT_TYPE.MARKETING_ASSET
      }
      setMixpanelData( 'contentType', contentType )
      setMixpanelData( 'railType', `${imageCardSize}-${layoutTypeForMixPanel}-${MIXPANEL_RAIL_TYPE.HERO_BANNER }` )
      storeRailData.current = { sectionSource: carouselInfo.isRecommendation, placeHolder, sectionType }
      const taUseCaseId = getTAUseCaseId( storeRailData.current )
      /* MixPanel-Event */
      content_click( MPItems, getSourceForMixPanel( window.location.pathname ), taUseCaseId )
      home_hero_banner_click( bannerInView, responseSubscription, pageType, autoPlay )
      setTrailerCTA( 'View Trailer' )
      setTrailerResumeTime( 0 )

      if( bannerInView?.marketingAsset ){
        previousPathName.fromHereBannerClick = true
        if( !getAuthToken() ){
          previousPathName.isFromPrimeMarketingAsset = true
          previousPathName.current = window.location.pathname
          previousPathName.navigationRouting = window.location.pathname
          history.push( '/login' )
          return
        }
        else if( getAuthToken() ){
          history.push( {
            pathname: myPlanProps?.appSelectionRequired ? '/plan/current' : '/plan/subscription'
          } );
          return
        }
      }
      if( window.location.pathname.includes( 'discover' ) ){
        railsRestoreId.current = null
      }
      if( carouselInfo.heroBannerType === CONTENT_TYPE.HB_SEE_ALL_BINGE_CHANNEL ){
        history.push( {
          pathname: '/browse-by/live',
          search: `?live&title=${'liveChannels'}&railId=${carouselInfo?.linkUrl}`
        } )
      }
      else if( isLiveContentType( carouselInfo.contentType ) && getAuthToken() && getChannelPlayableStatus( myPlanProps?.liveChannelIds, myPlanProps?.subscriptionStatus, carouselInfo.id ) ){
        const args = {
          id: carouselInfo.id,
          type: carouselInfo.contentType,
          provider : carouselInfo.provider
        }
        handleDistroRedirection( history, args )
      }
      else if( carouselInfo.contentType === CONTENT_TYPE.HB_SEE_ALL ){
        previousPathName.fromHbSellAllPage = true;
        history.push( '/content/hero-banner-rail/' + carouselInfo.linkUrl )
      }
      else if( props.fromCatalogPartner ){
        setContentParams( {
          type: carouselInfo.seriesvrId ? carouselInfo.seriescontentType : carouselInfo.contentType,
          id: carouselInfo.seriesvrId ? carouselInfo.seriesvrId : carouselInfo.id,
          ...( carouselInfo.provider === DISTRO_CHANNEL.appType && { distroProvider: carouselInfo.provider } )
        } )
        setCatalogFlag( true )
        setMetaData( {
          ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
          provider: carouselInfo.provider,
          channelName: carouselInfo.channelName
        } )
      }
      else if( carouselInfo.contentType !== CONTENT_TYPE.CUSTOM_STATIC_HB ){
        let redirectionUrl;
        const args = {
          provider : carouselInfo.provider
        }
        if( carouselInfo.contentType === CONTENT_TYPE.HB_SEE_ALL ){
          redirectionUrl = '/content/detail/' + carouselInfo.contentType + '/' + carouselInfo.linkUrl
        }
        else {
          setMetaData( { // Set to access data in metadata on pi page as args will reset on route change from PI
            ...( metaData && Object.keys( metaData ).length > 0 ? metaData : {} ),
            provider: carouselInfo.provider,
            channelName: carouselInfo.channelName
          } )
          // redirectionUrl = '/content/detail/' + carouselInfo.contentType + '/' + carouselInfo.id
          redirectionUrl = contentDetailUrl( carouselInfo, false )
        }
        previousPathName.fromHereBannerClick = true;
        history.push( {
          pathname: redirectionUrl,
          args: args
        } )
      }
      else if( carouselInfo.heroBannerType === CONTENT_TYPE.APPLE_HB && getProviderWithoutToken( carouselInfo.provider, PROVIDER_LIST.APPLETV ) ){
        appleFetchData( { activationSource : APPLE_PRIME_ACTIVATION_JOURNEY.HERO_BANNER, viaPopUp: getAppleJourneyStatus( myPlanProps?.appleDetails ) } )
      }
    }
  }

  const handleNavigationForCarosel = ( direction ) => {
    const obj = {
      contentPosition: carouselRef.current?.swiper?.snapIndex + 1,
      railPosition: props.railPosition + 1,
      sectionType: props.sectionType,
      contentType: bannerInView?.contentType,
      sectionSource: props.sectionSource,
      railTitle: constants.HERO_BANNER,
      configType: props.configType,
      autoPlayed: autoPlay,
      railId: props.railId,
      contentId: bannerInView?.id
    }
    const carouselIndex = carouselRef.current?.swiper?.snapIndex;
    if( carouselIndex === 0 ){
      isFocus = false;
    }
    else {
      setContentRailPositionData( obj )
      isFocus = true
    }
    if( direction === 'right' ){
      if( carouselIndex === carouselRef.current?.swiper?.slides.length - 1 ){
        carouselRef.current?.swiper?.slideTo( 0 )
      }
      else {
        carouselRef.current?.swiper?.slideNext();
      }
      setContentRailPositionData( obj )
      isFocus = true;
    }
    if( direction === 'left' ){
      carouselRef.current?.swiper?.slidePrev();
      if( isFocus ){
        return false;
      }
      setContentRailPositionData( obj )
      return true;
    }
  }

  const SwiperSlideItems = useMemo( () => {
    return updateHBRailWithBingeListFav( items, responseSubscription?.bingeListRecord )?.map( ( content, index ) => (
      <FocusContext.Provider value={ focusKey }
        key={ `focus-${content.id || index}` }
      >
        <SwiperSlide key={ `focus-${content.id || index}` }>
          {
            sectionSource === SECTION_SOURCE.HERO_BANNER_NEW ? (
              <div style={ { background: content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_1 ? `${content?.gradientColor || '#000000'}` : '#000000' } }
                className='Carousel__NewCarouselSection'
              >
                { /* Top Section */ }
                <div className='Carousel__NewCarouselTopSection'>
                  {
                    Boolean( isLiveContentType( content?.contentType ) || content?.liveContent ) && (
                      <div className='Carousel__NewCarouselTopSectionMetaInfo--liveContent'>
                        <div className='liveContentCircle'></div>
                        <div className='liveContentText'>
                          <Text color='white'>
                            { isSonyContent( content?.provider ) ? ( content?.broadcastMode ) : constants.LIVE }
                          </Text>
                        </div>
                      </div>
                    )
                  }
                  <div className={ classNames( 'Carousel__NewCarouselTopSectionMetaInfo--provider', {
                    'Carousel__NewCarouselTopSectionMetaInfo--provider--visibility-hidden': ( !content?.provider )
                  } ) }
                  >
                    <Image
                      src={ `${getProviderLogo( providerLogoList, content?.provider, constants.LOGOPROVIDERBBA, url )}` }
                    />
                  </div>

                  { /* Main Content */ }
                  <div className='Carousel__NewCarouselTopLeftSection'>
                    <div className='Carousel__NewCarouselTopLeftSectionMetaInfo'>
                      {
                        content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_1 ? (
                          <div className='Carousel__mainImg'>
                            <div className={ classNames( 'Carousel__mainImg__titleImage', {
                              'Carousel__mainImg__titleImage--classA': ( content?.lsClassification === constants.CLASS_A ),
                              'Carousel__mainImg__titleImage--classB': ( content?.lsClassification === constants.CLASS_B ),
                              'Carousel__mainImg__titleImage--classC': ( content?.lsClassification === constants.CLASS_C ),
                              'Carousel__mainImg__titleImage--classD': ( content?.lsClassification === constants.CLASS_D ),
                              'Carousel__mainImg__titleImage--classE': ( content?.lsClassification === constants.CLASS_E ),
                              'Carousel__mainImg__titleImage--classF': ( content?.lsClassification === constants.CLASS_F ),
                              'Carousel__mainImg__titleImage--defaultImage': ( !content?.lsClassification ),
                              'Carousel__mainImg__titleImage--visibility-hidden': ( !content?.imageTitle?.includes( 'http' ) )
                            } ) }
                            >
                              <Image
                                src={ content?.imageTitle }
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='Carousel__PrimeContentText'>
                            <Text textStyle='prime-heroBanner-title'
                              color='white'
                            >
                              { content?.title }
                            </Text>
                          </div>
                        )
                      }
                      { content?.provider?.toLowerCase() === PROVIDER_LIST.PRIME && content?.marketingAsset && !getAuthToken() ? (
                        <div className='Carousel__marketingAssetInfo'>
                          <Image
                            src={ content?.subTitleImage }
                            alt={ 'subTitleImage' }
                            ariaLabel='Logo'
                          />
                          <Text color='white'
                            textStyle='basicTextStyles'
                          >{ content?.subTitle }</Text>
                        </div>
                      ) : (
                        <div className='Carousel--languageList'>
                          <Text color='white'>{ content?.metaDetailVerbiage }</Text>
                        </div>
                      ) }
                      <div className='Carousel--btns'>
                        { /* Watch Now Button */ }
                        <div className='Carousel--btns--watchNow'>
                          <Button
                            label={ NON_HB_CONTENTS_TYPES.includes( content?.contentType ) ? constants.VIEW_DETAILS : buttonCTAText }
                            onClick={ handleWatchNowCtaFn }
                            secondary={ true }
                            size='medium'
                            iconLeft
                            iconLeftImage='Play'
                            className={ classNames( {
                              'Button--play': isFocused,
                              'Button--transparent': !isFocused
                            } ) }
                            focusKeyRefrence={ `WATCH_NOW_CTA_CAROSEL_${index}` }
                            handleNavigationForCarosel={ handleNavigationForCarosel }
                            carouselIndexInfo={ index }
                            onFocus={ () => setIsFocused( true ) }
                            onBlur={ () => setIsFocused( false ) }
                          />
                        </div>
                        { /* Binge List Button */ }
                        <div className='Carousel--bingeList'>
                          { !NON_HB_CONTENTS_TYPES.includes( bannerInView?.contentType ) &&
                            !( bannerInView?.contentType === CONTENT_TYPE.LIVE || bannerInView?.contentType === CONTENT_TYPE.CUSTOM_LIVE_DETAIL || bannerInView?.marketingAsset ) && (
                            <Button
                              label={ constants.MY_BINGE_LIST }
                              onClick={ () => {
                                if( getAuthToken() ){
                                  addRemoveBingeListFetchData();
                                }
                                else {
                                  setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.ADD_TO_BINGE_LIST );
                                  history.push( '/login' );
                                }
                              } }
                              size='medium'
                              iconLeft
                              iconLeftImage={ content.isFavourite ? constants.TICK_ICON : constants.PLUS_ICON }
                              secondary={ true }
                              className='Button--mybingelist'
                              focusKeyRefrence={ `BINGE_LIST_CTA_CAROSEL_${index}` }
                              handleNavigationForCarosel={ handleNavigationForCarosel }
                              carouselIndexInfo={ index }
                            />
                          ) }
                        </div>
                      </div>
                    </div>
                  </div>

                  { /* Right Section */ }
                  <div
                    className={ classNames( 'Carousel__NewCarouselTopRightSection', {
                      'Carousel__NewCarouselTopRightSection--isFromCatalogPartner': props.fromCatalogPartner,
                      'Carousel__NewCarouselTopRightSection--forTypes': content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_3 || content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_2
                    } )
                    }
                  >
                    <div style={ { background: content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_1 ? `linear-gradient(90deg, ${content?.gradientColor || '#000000' } 8.31%, rgba(${convertHexToRgba( content?.gradientColor || '#000000' ) } ) 100%)` : 'linear-gradient(90deg, #000000 8.31%, rgba(0, 0, 0, 0) 100%)' } }
                      className={ classNames(
                        'Carousel__NewCarouselTopRightSectionGradient',
                        {
                          'Carousel__NewCarouselTopRightSectionGradient--forTypes':
                        content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_3 || content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_2
                        }
                      ) }
                    ></div>
                    <Image
                      src={ `${cloudinaryCarousalUrl( layoutType, url )}/${content?.imageLandscapeTv}` }
                      alt={ content?.altText }
                      isBackground={ isBackground }
                    />
                  </div>
                </div>
                <div style={ { background: content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_1 ? `linear-gradient(180deg, rgba(${convertHexToRgba( content?.gradientColor || '#000000' )}) 0%, ${ content?.gradientColor || '#000000' } 35%, #020005 100%)` : 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 35%, #020005 100%)' } }
                  className={ classNames(
                    'Carousel__NewCarouselBottomSection',
                    {
                      'Carousel__NewCarouselBottomSection--forTypes':
                      content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_3 || content.heroBannerLayout?.toLowerCase() === HERO_BANNER_LAYOUT.TYPE_2
                    }
                  ) }
                ></div>
              </div>
            ) : (
              <Image
                src={ `${cloudinaryCarousalUrl( layoutType, url )}/${content?.image}` }
                alt={ content?.altText }
                isBackground={ isBackground }
              />
            )
          }

          { /* Crown Logo */ }
          { isCrownNew( myPlanProps, bannerInView, config?.enableCrown ) && (
            <div className='carouselCrownLogo'>
              <Icon name='CrownWithBG' />
            </div>
          ) }
        </SwiperSlide>
      </FocusContext.Provider>
    ) );
  }, [items, sectionSource, bannerInView, myPlanProps, isFocused] );

  const handleSwiperChange = ( swiper ) => {
    const content = items.find( ( item, key ) => key === swiper.activeIndex )
    setBannerInView( content )
    if( isNewHeroBannerFocusRetain() && sectionSource === SECTION_SOURCE.HERO_BANNER_NEW && !modalDom() ){
      ( document?.querySelector( '.LeftNavContainer__expanded' ) === null && document?.querySelector( '.PlaybackInfo__Banner' ) === null ) && setTimeout( ()=> setFocus( `WATCH_NOW_CTA_CAROSEL_${swiper.activeIndex}` ), 10 )
    }

    /* MixPanel-Event */
    home_hero_banner_view( content, responseSubscription, pageType, autoPlay )
    home_hero_banner_horizontalSwipe( content?.title, swiper.activeIndex )
  }

  const isNewHeroBannerFocusRetain = () => {
    const includedPaths = ['/discover', '/browse-by-app', '/browse-by-sports'];
    return caroselPageView && sectionSource === SECTION_SOURCE.HERO_BANNER_NEW && includedPaths.some( path => window.location.pathname.startsWith( path ) );
  };

  useEffect( () => {
    const contentList = items;
    if( Array.isArray( contentList ) && contentList.length > 0 ){
      setBannerInView( contentList[0] )
      if( isNewHeroBannerFocusRetain() && !catalogFlag && !modalDom() ){
        setTimeout( ()=> setFocus( `WATCH_NOW_CTA_CAROSEL_0` ) )
      }
      /* MixPanel-Event */
      home_hero_banner_view( contentList[0], responseSubscription, pageType, autoPlay );
      const obj = {
        contentPosition: carouselRef.current?.swiper?.snapIndex + 1,
        railPosition: props.railPosition + 1,
        sectionType: props.sectionType,
        contentType: contentList[0]?.contentType,
        sectionSource: props.sectionSource,
        railTitle: constants.HERO_BANNER,
        configType: props.configType,
        autoPlayed: autoPlay,
        railId: props.railId,
        contentId: contentList[0]?.id
      }
      setContentRailPositionData( obj )
    }

  }, [window.location.pathname] );

  useEffect( ()=>{
    if( appleRedemptionResponse && appleRedemptionResponse.data && appleRedemptionResponse.data.activation_url ){
      /** Mixpanel Events from Hero Banner */
      activateAppleTVSubscriptionClick( APPLE_PRIME_ACTIVATION_JOURNEY.HERO_BANNER ) // set source to hero-banner.
      interstitialScreenRedirection( history, appleRedemptionResponse.data.activation_url, PROVIDER_LIST.APPLETV, null, null, InterstitialPage_Routes.apple, false, true );
    }
  }, [appleRedemptionResponse] )

  useEffect( () => {
    if( addRemoveBingeListResponse && addRemoveBingeListResponse.data ){
      setBingeListPeopleProperties( addRemoveBingeListResponse.data?.totalBingeListCount )
      setIsFav( true )
      if( addRemoveBingeListResponse.data.status || addRemoveBingeListResponse.data.isFavourite ){
        /* Mixpanel-event */
        bingelist_add( bannerInView, responseSubscription, constants.HERO_BANNER )
        // if( metaData && metaData.contentType && metaData.contentType !== CONTENT_TYPE.WEB_SHORTS ){
        //   addLearnAction()
        // }
        setIsWatchListUpdated( true )

      }
      else if( !addRemoveBingeListResponse.data.status || !addRemoveBingeListResponse.data.isFavourite ){
        /* Mixpanel-event */
        bingelist_remove_item( bannerInView, responseSubscription, MEDIA_CARD_TYPE.WATCHLIST, constants.HERO_BANNER )
      }
      onIconAndMessageChange( {
        iconName: constants.SUCCESS_ICON,
        message: ( addRemoveBingeListResponse.data.status || addRemoveBingeListResponse.data.isFavourite ) ? constants.ADDED_TO_BINGE_LIST : constants.REMOVE_FROM_BINGE_LIST
      } );
    }
  }, [addRemoveBingeListResponse] )


  return (
    <div className={ classNames( 'Carousel', {
      [`Carousel__bottomSpacer--${spacerValue}`]: spacerValue,
      'Carousel__bulletButtonsNewHBBanner':sectionSource === SECTION_SOURCE.HERO_BANNER_NEW,
      'Carousel__bulletButtonsOldHBBanner':sectionSource === SECTION_SOURCE.EDITORIAL,
      'Carousel--withFocus': focused
    } )
    }
    ref={ ref }
    >
      { items.length > 0 && ( window.location.pathname.includes( '/discover' ) || window.location.pathname.includes( '/browse-by-app' ) || window.location.pathname.includes( '/browse-by-sports' ) ) &&
        <Swiper
          ref={ carouselRef }
          pagination={ {
            type: 'bullets',
            clickable: 'true'
          } }
          effect='fade'
          speed={ 500 }
          direction='horizontal'
          modules={ [Pagination, Autoplay, EffectFade] }
          fadeEffect={ {
            crossFade: true
          } }
          slidesPerView={ 1 }
          spaceBetween={ 50 }
          className='mySwiper'
          keyboard={ {
            enabled: true
          } }
          autoplay={ autoScroll ? {
            delay: 4000,
            disableOnInteraction: false
          } : false }
          onSlideChange={ ( swiperCore ) => {
            const {
              activeIndex,
              snapIndex,
              previousIndex,
              realIndex,
              url
            } = swiperCore;
            handleSwiperChange( { activeIndex, snapIndex, previousIndex, realIndex, url } )
          } }
        >
          { SwiperSlideItems }
          { isLinearGradient &&
          <>
            <div className='Carousel__LinearGradient--top'></div>
            <div className='Carousel__LinearGradient--right'></div>
            <div className='Carousel__LinearGradient--bottom'></div>
            <div className='Carousel__LinearGradient--left'></div>
          </>
          }
          { isOverlayBackground &&
          <>
            <div className='Carousel__overlayBackground'></div>
            <div className='Carousel__overlayBgBottom'></div>
          </>
          }
        </Swiper>
      }
    </div>
  );
};

/**
   * property type definitions
   * @type object
   * @property {string} ImageSrc - sets the image src for image display
   * @property {string} altText - sets the alt text for image. Required for all images. If decorative image pass ''
   * @property {array} items - The elements to display as slides in the swiper
   * @property {string} spacerValue - Sets the margin bottom spacer value
   * @property {bool} isLinearGradient - Sets the margin bottom spacer value
   */
export const propTypes = {
  ImageSrc: PropTypes.string,
  altText: PropTypes.string,
  items: PropTypes.array.isRequired,
  spacerValue: PropTypes.string,
  isLinearGradient: PropTypes.bool,
  isOverlayBackground: PropTypes.bool
};

/**
  * Default values for passed properties
  *
  * @type {object}
  * @property {boolean} linearGradient=false - Default linearGradient
  */
export const defaultProps = {
  isLinearGradient: false,
  isOverlayBackground: false
};

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;

export default Carousel;