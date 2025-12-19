/* eslint-disable no-console */
/**
 * Carousel wraper component for all media card rails
 *
 * @module views/components/MediaCarousel
 * @memberof -Common
 */
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Text from '../Text/Text';
import { getRailComponent, getProviderLogo, getVisibleViewPortElements, contentDetailUrl, modalDom, renderImage, getBestOfAppLogo } from '../../../utils/util';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import './MediaCarousel.scss';
import {
  constants,
  CONTENT_TYPE,
  LAYOUT_TYPE,
  PAGE_NAME,
  SECTION_SOURCE,
  CARD_SIZE,
  isExcludedRail,
  isExcludedTitleRail,
  CHIP_RAIL_TYPE,
  PAGE_TYPE,
  CHANNEL_RAIL_TYPE
} from '../../../utils/constants';
import classNames from 'classnames';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder'
import Genre from '../Icons/Genre';
import GenreRailNew from '../Icons/GenreRailNew';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import Image from '../Image/Image';
import lottie from 'lottie-web';
import ChannelMediaCardSection from '../ChannelMediaCardSection/ChannelMediaCardSection';
import Button from '../Button/Button';
import { rail_chip_click } from '../../../utils/mixpanel/mixpanelService';
/**
  * Represents a MediaCarousel component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns MediaCarousel
  */
export const MediaCarousel = function( props ){
  const [genereRotate, setGenereRotate] = useState( 0 )
  const mouseEntryRef = useRef( false )
  const scrollMomentRef = useRef( '' )
  const prevXRef = useRef( 0 )
  const previousPathName = useNavigationContext()
  const { onFocus, setExpandShow, focusKeyRefrence, clickOnLivePlay, contentRailType, placeHolder, directlyPlayable, setShowNotification, setNotificationMessage, setNotificationIcon, setIsFocusOnEpisode, totalRailList, position, fetchHorizontalContent, isKeyReleased, topPositionRailValue, setRailFocusedCardInfo, activeContent, onSelectChip, setRailSectionSource, setActiveRailSelections } = props;
  const { title, layoutType, sectionSource, contentList, placeHolder: phFromRail, totalCount, imageMetadata, backgroundImage, provider, descriptionHeader, description, specialAnimation, specialImage, bannerColorCode, railSubTitle, appName, railType, bannerColorCodeEnabled, isTitleEnabledLs, titleEnabledLs, labelImage, chipList, sectionType, id, enableUI, ribbonColor } = props.railData;

  const { genereDirection, genereRotationRef } = useMaintainPageState() || null

  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const providerLogoList = get( config, 'providerLogo' );
  const partnerLogo = useMemo( () => get( config, 'Partnerpopupdetails' ), [config] );
  const noContentListOfChipText = useMemo( () => get( config, 'noContentChip' ), [config] );
  const [bestofappName, setBestOfAppName] = useState( '' )
  const [imagesrc, setImagesrc] = useState( '' )
  const [mouseEntered, setMouseEntered] = useState( false )

  const MediaCarouselRef = useRef( null );
  const rotationRef = useRef( 0 )
  const callNext = useRef( true )

  const { ref, focusKey, focusSelf } = useFocusable( { onFocus, focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null } );

  const RailComponent = useMemo( () => getRailComponent( sectionSource, layoutType, null, railType ), [sectionSource, layoutType] );
  const layout_Type = SECTION_SOURCE[sectionSource] ? layoutType : LAYOUT_TYPE.LANDSCAPE;
  const section_src = SECTION_SOURCE[sectionSource] ? sectionSource : SECTION_SOURCE.EDITORIAL
  const cardSize = SECTION_SOURCE[sectionSource] ? imageMetadata?.cardSize : '' ;
  const svgContainer = useRef( null )
  const labelImageContainer = useRef( null )

  const specialBannerRibbonColor = ( enableUI && ribbonColor ) || ''

  const onCardFocus = useCallback( ( { x, ...rest }, id, rail, contentRail, index ) => {
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && !mouseEntryRef.current ){
      rail_chip_click( rail, title, position )
      setTimeout( ()=> setRailSectionSource( true ), 10 )
    }
    if( sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL && !( !!props.openSeriesInfo ) && callNext.current && contentRail && contentRail.contentList.length && totalCount && contentRail.contentList.length < totalCount && ( contentRail.contentList.length - index - 10 ) <= 3 && !contentRail.isEndReached ){
      fetchHorizontalContent( contentRail.id, contentRail.originalContentListLength, { sectionSource: contentRail.sectionSource, pagingState: contentRail.pagingState } )
      callNext.current = false
      setTimeout( () => {
        callNext.current = true
      }, 400 );
    }
    if( props.openSeriesInfo && callNext.current && ( contentRail.contentList.length < totalCount ) && ( ( contentRail.contentList.length ) - ( index + 1 ) ) <= 3 ){
      props.nextSeasonPagination( index )
      callNext.current = false
      setTimeout( () => {
        callNext.current = true
      }, 400 );
    }
    if( isLiveContentType( rail.contentType ) || props?.isHBAvailable ){
      props.liveFocusCard && props.liveFocusCard( id, rail.provider )
    }
    setExpandShow && setExpandShow( true )

    if( contentRail.sectionSource === SECTION_SOURCE.GENRE ){
      const screenWidth = window.innerWidth
      const cardWidth = document.querySelector( '.MediaCarousel__GENRE--LANDSCAPE' ).clientWidth

      const getVisibleElements = () => {
        const container = document.querySelector( '.MediaCarousel__GenereRailItems' );
        const containerRect = container.getBoundingClientRect();
        const elements = container.getElementsByClassName( 'GenreMediaCard' );
        const visibleElements = [];

        for ( let i = 0; i < elements.length; i++ ){
          const elementRect = elements[i].getBoundingClientRect();
          if(
            containerRect &&
            elementRect.left >= containerRect.left &&
            elementRect.right <= containerRect.right &&
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom
          ){
            visibleElements.push( elements[i].innerText );
          }
        }

        return visibleElements;
      };
      if( index === 0 ){
        document.querySelector( '.MediaCarousel__GenereRailItems' ).style.marginLeft = '10rem'
      }
      const visibleElements = getVisibleElements()

      if( genereDirection.current === 'right' || scrollMomentRef.current === 'right' ){
        if( visibleElements.includes( rest.node.innerText ) === false ){
          document.querySelector( '.MediaCarousel__GenereRailItems' ).style.marginLeft = '7rem'
          if( MediaCarouselRef.current ){
            if( mouseEntryRef.current ){
              setTimeout( ()=>{
                MediaCarouselRef.current.scrollLeft = ( ( index - ( visibleElements.length - 1 ) ) * cardWidth ) - 120
                MediaCarouselRef.current.scrollBehavior = 'auto'
              }, 200 )
            }
            else {
              MediaCarouselRef.current.scrollLeft = ( ( index - ( visibleElements.length - 1 ) ) * cardWidth ) - 120
              MediaCarouselRef.current.scrollBehavior = 'auto'
            }

          }
          rotationRef.current = rotationRef.current - 180
          if( !!genereRotationRef.current === false ){
            setGenereRotate( -( rotationRef.current ) )
          }
          else {
            setGenereRotate( 0 )
            genereRotationRef.current = null
          }
        }
      }
      else if( genereDirection.current === 'left' || scrollMomentRef.current === 'left' ){
        const container = visibleElements.length > 4 ? ( screenWidth === 1920 ? 400 : 250 ) : ( screenWidth === 1920 ? 1160 : 760 )
        if( visibleElements.includes( rest.node.innerText ) === false ){
          if( MediaCarouselRef.current ){
            if( mouseEntryRef.current ){
              setTimeout( ()=>{
                MediaCarouselRef.current.scrollLeft = rest.left - container
                MediaCarouselRef.current.scrollBehavior = 'auto'
              }, 200 )
            }
            else {
              MediaCarouselRef.current.scrollLeft = rest.left - container
              MediaCarouselRef.current.scrollBehavior = 'auto'
            }
          }
          rotationRef.current = rotationRef.current + 180
          if( !!genereRotationRef.current === false ){
            setGenereRotate( ( -rotationRef.current ) )
          }
          else {
            setGenereRotate( 0 )
            genereRotationRef.current = null
          }
        }
      }

    }
    else if( contentRail.sectionSource === SECTION_SOURCE.LANGUAGE ){
      const totalItems = getVisibleViewPortElements( contentRail.sectionSource, null, contentRailType )
      const visibleIndexes = totalItems?.slice( 1, 8 )
      if( MediaCarouselRef.current ){
        if( document?.querySelector( '.AlphanumericKeyboard' ) === null && !mouseEntryRef.current ){
          MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 )
          MediaCarouselRef.current.scrollBehavior = 'auto'
        }
        if( mouseEntryRef.current ){
          if( !visibleIndexes?.includes( index ) ){
            if( document?.querySelector( '.AlphanumericKeyboard' ) === null ){
              if( scrollMomentRef.current === 'left' ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 120 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
              else if( scrollMomentRef.current === 'right' ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 + 10 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
            }
            else {
              // eslint-disable-next-line no-lonely-if
              if( scrollMomentRef.current === 'left' ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 790 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
              else if( scrollMomentRef.current === 'right' ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 + 80 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )

              }
            }
          }
        }
        else {
          MediaCarouselRef.current.scrollLeft = rest.left - ( ref.current.clientWidth / 2 ) - 300
          MediaCarouselRef.current.scrollBehavior = 'auto'
        }
      }
    }
    else if( contentRail.sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
      const visibleIndexes = getVisibleViewPortElements( null, null, contentRailType )
      if( mouseEntryRef.current ){
        if( !visibleIndexes.includes( index ) ){
          if( scrollMomentRef.current === 'left' ){
            setTimeout( ()=>{
              MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width - 10 )
              MediaCarouselRef.current.scrollBehavior = 'auto'
            }, 200 )
          }
          else if( scrollMomentRef.current === 'right' ){
            setTimeout( ()=>{
              MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 ) + 200
              MediaCarouselRef.current.scrollBehavior = 'auto'
            }, 200 )
          }
        }
      }
      else {
        MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width * 4 ) - 200 )
        MediaCarouselRef.current.scrollBehavior = 'auto'
      }
    }
    else {
      if( MediaCarouselRef.current ){
        const visibleIndexes = ( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL || sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL || sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ) ? getVisibleViewPortElements( sectionSource, contentRail?.id ) : getVisibleViewPortElements( null, contentRail?.id, contentRailType )
        if( mouseEntryRef.current ){
          if( !visibleIndexes?.includes( index ) ){
            if( scrollMomentRef.current === 'left' ){
              if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 1.7 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
              else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 690 )
                }, 200 )
              }
              else if( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 580 )
                }, 200 )
              }
              else {
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width - 10 )
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
            }
            else if( scrollMomentRef.current === 'right' ){
              if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
                setTimeout( ()=>{
                  // console.log( '#inside special else', MediaCarouselRef.current.scrollLeft, rest.left, rest.width )
                  MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 500 ) )
                }, 200 )
              }
              else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 )
                }, 200 )
              }
              else if( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
                setTimeout( ()=>{
                  MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 )
                }, 200 )
              }
              else {
                setTimeout( ()=>{
                  if( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE && !isExcludedRail( sectionSource ) ){
                    MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 380 ) * 4 )
                  }
                  else {
                    MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 )
                  }
                  MediaCarouselRef.current.scrollBehavior = 'auto'
                }, 200 )
              }
            }
          }
        }
        else {
          if( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE && !isExcludedRail( sectionSource ) ){
            MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 380 ) * 4 )
          }
          else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
            scrollHorizontal( rest.left - ( ( rest.width ) * 1.7 ) );
          }
          else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
            scrollHorizontal( rest.left - ( rest.width * 3.35 ) );
          }
          else if( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.LANGUAGE || ( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && railType === constants.SPORTS ) || ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.STANDALONE ) || ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && layout_Type === 'SQUARE' ) ){
            scrollHorizontal( rest.left - ( ( rest.width + 50 ) * 4 ) );
          }
          else {
            MediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 )
          }
          MediaCarouselRef.current.scrollBehavior = 'auto'
        }
      }
      previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${props.railData.id + 1000}${id}`
    }
  }, [MediaCarouselRef, mouseEntryRef.current, scrollMomentRef.current] );

  const scrollHorizontal = ( left ) => {
    if( MediaCarouselRef.current ){
      try {
        MediaCarouselRef.current.scrollTo( {
          left: left
        } )
      }
      catch ( e ){
        MediaCarouselRef.current.scrollLeft = left;
      }
    }
  }

  const onMouseEnterCallBackFn = ( parentId, id ) => {
    setFocus( `BUTTON_FOCUS_${parentId + 1000}${id}` )
  }

  const handleMouseMove = ( event ) => {
    const mouseX = event.clientX;
    if( mouseX < prevXRef.current ){
      scrollMomentRef.current = 'left'
    }
    else if( mouseX > prevXRef.current ){
      scrollMomentRef.current = 'right'
    }
    prevXRef.current = mouseX;
  };

  const onMouseEnterpageFn = () =>{
    mouseEntryRef.current = true
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      setMouseEntered( mouseEntryRef.current )
    }
  }
  const onMouseLeavepageFn = () =>{
    mouseEntryRef.current = false
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      setMouseEntered( mouseEntryRef.current )
    }
  }

  useEffect( () => {
    const getMouseStateChange = ( event ) =>{
      if( event.detail && event.detail.visibility ){
        mouseEntryRef.current = true
      }
      else {
        mouseEntryRef.current = false
      }
      sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && setMouseEntered( mouseEntryRef.current )
    }
    document.addEventListener( 'cursorStateChange', getMouseStateChange )
    return () => {
      document.removeEventListener( 'cursorStateChange', getMouseStateChange );
    };
  }, [] );

  useEffect( () => {
    if( ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL || sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ) && props.focusFrom === PAGE_NAME.LIVE && !modalDom() ){
      focusSelf();
    }
  }, [props.focusFrom] )

  useEffect( () => {
    let animItem;

    const loadAnimation = async() => {
      try {
        const response = await fetch( specialAnimation );
        if( !response.ok ){
          throw new Error( `Failed to fetch animation: ${response.statusText}` );
        }
        const animationData = await response.json();

        animItem = lottie.loadAnimation( {
          container: svgContainer.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData
        } );

        animItem.play();
      }
      catch ( error ){
        console.error( 'Error loading Lottie animation:', error );
      }
    };

    if( specialAnimation?.endsWith( '.json' ) ){
      loadAnimation();
    }

    return () => {
      if( animItem ){
        animItem.destroy();
      }
    };
  }, [specialAnimation] );

  useEffect( () => {
    let animItem;

    const loadAnimation = async() => {
      try {
        const response = await fetch( labelImage );
        if( !response.ok ){
          throw new Error( `Failed to fetch animation: ${response.statusText}` );
        }
        const animationData = await response.json();

        animItem = lottie.loadAnimation( {
          container: labelImageContainer.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData
        } );

        animItem.play();
      }
      catch ( error ){
        console.error( 'Error loading Lottie animation:', error );
      }
    };

    if( labelImage?.endsWith( '.json' ) ){
      loadAnimation();
    }

    return () => {
      if( animItem ){
        animItem.destroy();
      }
    };
  }, [labelImage] );

  const selectedPartnerChipIndex = useMemo( () => {
    return activeContent?.selectedIndex ?? 0;
  }, [activeContent] );


  const contentToDisplay = useMemo( () => {
    return activeContent?.content || ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList?.[0] : contentList?.[0] );
  }, [activeContent, contentList] );

  const handleChangeChannelClick = ( content, indexPosition, railId, sectionSource ) =>{
    onSelectChip( railId, content, indexPosition, sectionSource )
  }

  const SwiperSlideItems = useMemo( () => {
    const renderedRails = sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList : contentList
    return renderedRails?.map( ( content, index ) => (
      <div
        className={
          classNames( `MediaCarousel__${section_src}${section_src === SECTION_SOURCE.SERIES_SPECIAL_RAIL ? `` : `--${layout_Type}`}${isExcludedRail( sectionSource ) || !cardSize || ( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.MEDIUM ) ? `` : `--${cardSize}`}`,
            { 'MediaCarousel__animationStart': props.animationStart && props.onShuffleClick },
            { 'MediaCarousel__animationEnd': !props.animationStart && props.onShuffleClick },
            { 'MediaCarousel__selectedChannelCard': activeContent?.selectedIndex === index } )
        }
        key={ content.id }
      >
        <RailComponent
          image={ renderImage( content, sectionSource, layout_Type, section_src, url, contentRailType ) }
          alt={ content.title }
          title={ content.seriesvrId ? content.seriesTitle : content.title }
          episodeTitle={ content.episodeTitle }
          position={ index + 1 }
          languagesGenres={ content.languagesGenres }
          metaDetails={ content.metaDetails }
          tagInfoDTO={ content.tagInfoDTO }
          previewPoster={ content.previewPoster }
          secondaryText={ content.secondaryText }
          contentNativeName={ content.contentNativeName }
          type={ 'portrait' }
          onFocus={ ( e )=>onCardFocus( e, content.id, content, props.railData, index ) }
          focusKeyRefrence={ sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL ? `BUTTON_FOCUS_${props.railData.id + 1000}${content.id}` : `BUTTON_FOCUS_${id}${content.chipId }` }
          totalRailLength={ contentList?.length }
          totalRails={ props.totalRailLength }
          railTitle={ props.railData.title }
          railId={ props.railData.id }
          cardIndexValue={ index }
          onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( props.railData.id, content.id ) }
          pageType={ content.pageType }
          imageUrl={ content.newBackgroundImage }
          url={ contentDetailUrl( content, true ) }
          provider={ `${getProviderLogo( providerLogoList, content.provider, constants.LOGO_SQUARE, url )}` }
          indicator='' // Todo: take this from api response
          timeBlock={ content.contentType === CONTENT_TYPE.TV_SHOWS ? content.duration || content.totalDuration : null }
          showTimeBlock={ props.showTimeBlock }
          openSeriesInfo={ props?.openSeriesInfo }
          description={ content.seriesvrId ? content.seriesDescription : content.description }
          totalDuration={ content.totalDuration }
          callBackFn={ props?.callBackFn }
          contentID={ content.seriesvrId ? content.seriesvrId : content.id }
          contentType={ content.seriesvrId ? content.seriescontentType : content.contentType }
          freeEpisodesAvailable={ content.freeEpisodesAvailable }
          contractName={ content.contractName }
          rentalExpiry={ content.rentalExpiry }
          partnerSubscriptionType={ content.partnerSubscriptionType }
          nonSubscribedPartnerList={ props.nonSubscribedPartnerList }
          isLowerPlan={ props.isLowerPlan }
          status={ props.status }
          providerName={ content.provider }
          playback_url={ content.playerDetail?.playUrl }
          providerContentId={ content.providerContentId }
          isPlayable={ props?.isPlayable }
          openRelatedShowsInfo={ props?.openRelatedShowsInfo }
          setShowSynopsis={ props?.setShowSynopsis }
          setBannerShow={ props?.setBannerShow }
          showEpisodeId={ props?.showEpisodeId }
          setExpandShow={ props?.setExpandShow }
          episodeId={ content.episodeId || content.episodeNumber }
          episodeDuration={ content.duration }
          partnerDeepLinkUrl={ content.partnerDeepLinkUrl }
          releaseYear={ content.releaseYear }
          setHomeCaroselInfo={ props?.setCaroselPageView }
          topPositionRailValue={ topPositionRailValue }
          contentList={ contentList }
          railPosition={ position + 1 }
          contentPosition={ content.position }
          newImage={ content.newImage }
          sectionSource={ sectionSource }
          placeHolder={ placeHolder || phFromRail }
          contentTitle={ content.title }
          actors={ content.actor }
          packName={ content.packName }
          liveContent={ content.liveContent }
          broadcastMode={ content?.broadcastMode }
          playerAction={ content?.playerAction }
          configType={ props?.configType }
          source={ props?.source }
          setRailFocusedCardInfo={ setRailFocusedCardInfo }
          duration={ content.duration }
          rating={ content.rating }
          masterRating={ props.masterRating }
          sectionType={ props.railData?.sectionType }
          genre={ content.genre || content.genres }
          language={ content.language || content.languages }
          { ...( sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL && { hideCrown: true } ) }
          clickOnLivePlay={ clickOnLivePlay }
          contentRailType={ contentRailType }
          { ...( contentRailType === 'CatalogPartnerContent' && { appRailData: props.appRailData } ) }
          directlyPlayable={ directlyPlayable }
          isRecommendation={ content.isRecommendation }
          isKeyReleased={ isKeyReleased }
          runtimePlaybackURLGenerationRequired={ content.runtimePlaybackURLGenerationRequired }
          railType={ railType }
          selectedSeason={ props.selectedSeason }
          setShowNotification={ setShowNotification }
          setNotificationMessage={ setNotificationMessage }
          setNotificationIcon={ setNotificationIcon }
          setIsFocusOnEpisode={ setIsFocusOnEpisode }
          focusFromLiveMoreLikeThis={ props.focusFrom === constants.LIVE_RAILS }
          handlePlayerClickFromPI={ props.handlePlayerClickFromPI }
          imageCardSize={ props?.railData?.imageMetadata?.cardSize }
          layoutTypeForMixPanel={ props.railData?.layoutType }
          { ...( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL && provider && {
            bannerTitle: content.title,
            timeBlock: content.duration || content.totalDuration
          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.STANDALONE ) && {
            isFromChannelRail: true,
            contentTitle: content.title,
            contentPosition: index + 1,
            railType: CHANNEL_RAIL_TYPE.STANDALONE,
            channelLayoutType: content?.layoutType || LAYOUT_TYPE.LANDSCAPE
          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS || sectionSource === SECTION_SOURCE.TITLE_RAIL ) && {
            catalogPageTitle: props?.catalogPageTitle,
            catalogPageRailItems: props?.catalogPageRailItems,
            bannerColorCodeEnabled: bannerColorCodeEnabled,
            isTitleEnabledLs: isTitleEnabledLs || titleEnabledLs,
            timeBlock: content.duration || content.totalDuration
          } )
          }
          {
            ...( ( ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) ) ) && {
              channelData:content,
              contentIndex: index,
              contentPosition: index + 1,
              secondary: true,
              label: sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? ( content?.chipDisplayText || content?.chipName ) : content?.title,
              className: ( activeContent?.selectedIndex ?? 0 ) === index ? `selectedCard ${!!( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && content?.chipIcon ) && 'withLeftImage'}` : `nonSelectedCard ${!!( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && content?.chipIcon ) && 'withLeftImage'}`,
              size: 'medium',
              catalogWidth: ( content?.chipDisplayText || content?.chipName )?.length,
              imageLeft: sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && true,
              // ...( sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL ?
              //   {
              //     onClick: () => handleChangeChannelClick( content, index, id, sectionSource )
              //   } : {
              //     chipContentFetchData: handleChangeChannelClick
              //   } ),
              ...( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && !mouseEntered ? // this code work as both scenario's mouse pointer
                {
                  chipContentFetchData: handleChangeChannelClick
                } : {
                  onClick: () => handleChangeChannelClick( content, index, id, sectionSource )
                } ),
              chipsContentList: renderedRails,
              currentSelectedChipdata: contentToDisplay,
              selectedPartnerChipIndex: selectedPartnerChipIndex,
              setActiveRailSelections: setActiveRailSelections,
              mouseEntered: mouseEntered
            }
          }
          totalRailList={ totalRailList }
          parentFocusKey={ focusKeyRefrence }
          showPlayButtonIcon={ props?.showPlayButtonIcon || false }
        />
      </div>
    ) );
  }, [isKeyReleased, topPositionRailValue, contentList, activeContent, mouseEntered] )

  const searchLeftPanelOpen = document.querySelector( '.Search__containerLeft' ) !== null
  useEffect( ()=>{
    if( appName ){
      setBestOfAppName( getBestOfAppLogo( appName, partnerLogo ) )
    }
  }, [appName] )

  useEffect( ()=>{
    const imageurl = getProviderLogo( providerLogoList, bestofappName, constants.LOGO_SQUARE, url );
    if( imageurl ){
      setImagesrc( `${ imageurl }` )
    }
  }, [bestofappName] )

  return (
    <div ref={ ref }>
      { SwiperSlideItems?.length &&
      <FocusContext.Provider value={ focusKey }>
        <div
          className={
            classNames(
            `MediaCarousel MediaCarousel_${ contentRailType } MediaCarousel_${ props.railData?.id }`,
            {
              'MediaCarousel__SeriesSpecialRailbottom': sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL,
              'MediaCarousel__specialRailbottom': sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL,
              'MediaCarousel__BackgroundBannerRailbottom': sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
              'MediaCarousel__browseByChannels': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ),
              'MediaCarousel__ChipsbrowseByChannels': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ),
              'MediaCarousel__ChipsbrowseByChannelsWithOutMouse': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) && !mouseEntryRef.current
            }
            ) }
          onMouseEnter={ onMouseEnterpageFn }
          onMouseLeave={ onMouseLeavepageFn }
          onMouseMove={ handleMouseMove }
        >
          <div className='MediaCarousel__heading'>
            {
              isExcludedTitleRail( sectionSource ) && !props?.openSeriesInfo &&
              <>
                { imagesrc ? (
                  <div className='MediaCarousel--bestofAppx-provider'>
                    <Image
                      src={ imagesrc }
                    />
                  </div>
                ) : (
                  <div className={ labelImage ? 'MediaCarousel__labelImage' : 'MediaCarousel__visibility-hidden' }>
                    { labelImage?.endsWith( '.json' ) ? (
                      <div className='MediaCarousel__labelImage-lottieAnimation'
                        ref={ labelImageContainer }
                      >
                      </div>
                    ) :
                      (
                        <Image src={ labelImage || '' }
                          alt=''
                        />
                      ) }
                  </div>
                )
                }
                <div>
                  <Text color='railTitle'
                    textStyle={ appName ? 'bestApps-heading' : 'rail-heading' }
                  >
                    { title }
                  </Text>
                  <Text color='railSubHeading'
                    textStyle='rail-sub-heading'
                  >
                    { railSubTitle }
                  </Text>
                </div>
              </>
            }

            {
              Boolean( sectionSource === SECTION_SOURCE.BINGE_CHANNEL || sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL || title === 'TATA PLAY Darshan' || title === 'Darshan News' ) && (
                <div className='MediaCarousel__liveCircle' />
              )
            }
          </div>
          { SwiperSlideItems &&
          <div className='MediaCarousel__suffle'>
            { sectionSource === 'GENRE' ? (
              <div
                className={
                  classNames( 'MediaCarousel__Rail',
                    { 'MediaCarousel__ExtraPadding' : cardSize === CARD_SIZE.LARGE,
                      'MediaCarousel__RailGenreRail': sectionSource === 'GENRE'
                    } )
                }
              >
                <div className='MediaCarousel__GenreRail'>
                  <div
                    className={
                      classNames(
                        {
                          'MediaCarousel__GenreBackgroundReel1': !!searchLeftPanelOpen === false,
                          'MediaCarousel__GenreBackgroundReelLeft': !!searchLeftPanelOpen
                        } )
                    }
                  >
                    <GenreRailNew />
                  </div>
                </div>
                <div className='MediaCarousel__wrapperGenreCard'>
                  <div className='MediaCarousel__GenreCard'>
                    <Genre count={ genereRotate }/>
                    <div className='MediaCarousel__GenreCardBg'></div>
                  </div>
                  <div className='MediaCarousel__GenreCardText'>
                    <Text color='railTitle'
                      textStyle='header-genere'
                    >
                      Browse
                    </Text>
                    <Text color='railTitle'
                      textStyle='header-genere'
                    >
                      By Genre
                    </Text>
                  </div>
                </div>
                <div
                  className='MediaCarousel__GenereRailItems'
                  ref={ MediaCarouselRef }
                >
                  { SwiperSlideItems }
                </div>
              </div>
            ) : (
              <>
                {
                  sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL && (
                    <>
                      <div className='MediaCarousel__SeriesSpecialRailWelcome'>
                        {
                          backgroundImage && (
                            <div className='MediaCarousel__SeriesSpecialRailWelcome__backgroundImage'>
                              <Image
                                src={ backgroundImage }
                              />
                            </div>
                          )
                        }
                        {
                          provider && (
                            <div className='MediaCarousel__SeriesSpecialRailWelcome__railLogo'>
                              <Image
                                src={ `${getProviderLogo( providerLogoList, provider, constants.LOGOPROVIDERBBA, url )}` }
                              />
                            </div>
                          )
                        }
                        <div style={ { background: `linear-gradient(270deg, ${'#000000' } 0%, rgba(2, 0, 5, 0) 36.6%)` } }
                          className='MediaCarousel__SeriesSpecialRailWelcome__gradient'
                        />
                      </div>
                    </>
                  )
                }
                {
                  sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL && (
                    <>
                      <div className='MediaCarousel__specialRailWelcome'>
                        <div className='MediaCarousel__specialRailWelcome__backgroundImage'>
                          <Image
                            src={ backgroundImage }
                          />
                        </div>
                        {
                          enableUI && (
                            <div className='MediaCarousel__specialRailWelcome__headerContentWrapper'>
                              <div className='MediaCarousel__specialRailWelcome__headerContentWrapper--headerText'
                                style={ { backgroundColor: specialBannerRibbonColor } }
                              >
                                <Text color='white'>{ title }</Text>
                              </div>
                              <div className='MediaCarousel__specialRailWelcome__headerContentWrapper--polygon'
                                style={ { backgroundColor: specialBannerRibbonColor } }
                              ></div>
                            </div>
                          )
                        }
                        {
                          ( descriptionHeader || description ) && <div className='MediaCarousel__specialRailWelcome__headerSubText'>
                            <Text color='white'
                              textStyle='header-2'
                            >{ descriptionHeader }</Text>
                            <div className='subTextContent'>
                              <Text color='white'>{ description }</Text>
                            </div>
                          </div>
                        }
                        {
                          specialAnimation?.endsWith( '.json' ) ? (
                            <div className='MediaCarousel__specialRailWelcome__lottieAnimation'
                              ref={ svgContainer }
                            >
                            </div>
                          ) :
                            specialAnimation?.endsWith( '.gif' ) ? (
                              <div className='MediaCarousel__specialRailWelcome__specialImage' >
                                <Image src={ specialAnimation }></Image>
                              </div>
                            ) : (
                              specialImage ? (
                                <div className='MediaCarousel__specialRailWelcome__specialImage' >
                                  <Image src={ specialImage }></Image>
                                </div>
                              ) :
                                null
                            )
                        }
                        <div className='MediaCarousel__specialRailWelcome__gradient'/>
                      </div>
                      <div className='MediaCarousel__specialRailWelcomeColour'/>
                    </>
                  )
                }
                {
                  sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL && (
                    <>
                      <div className='MediaCarousel__episodeRailWelcome'>
                        {
                          backgroundImage && (
                            <div className='MediaCarousel__episodeRailWelcome__backgroundImage'>
                              <Image
                                src={ backgroundImage }
                              />
                            </div>
                          )
                        }
                        {
                          provider && (
                            <div className='MediaCarousel__episodeRailWelcome__railLogo'>
                              <Image
                                src={ `${getProviderLogo( providerLogoList, provider, constants.LOGOPROVIDERBBA, url )}` }
                              />
                            </div>
                          )
                        }
                        <div style={ { background: `linear-gradient( 90deg, rgba( 255, 255, 255, 0.1 ) 94%, ${bannerColorCode} 100% )` } }
                          className='MediaCarousel__episodeRailWelcome__gradient'
                        />
                      </div>
                      <div style={ { backgroundColor: bannerColorCode } }
                        className='MediaCarousel__episodeRailWelcomeColour'
                      />
                    </>
                  )
                }
                <div
                  className={
                    classNames( 'MediaCarousel__Rail',
                      { 'MediaCarousel__ExtraPadding' : cardSize === CARD_SIZE.LARGE,
                        'MediaCarousel__RailLive': sectionSource === SECTION_SOURCE.BINGE_CHANNEL,
                        'MediaCarousel__BackgroundBannerRail': sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
                        [`MediaCarousel__BackgroundBannerRail_${props.railData?.id}`]: sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
                        'MediaCarousel__specialRail': ( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ),
                        [`MediaCarousel__specialRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ),
                        'MediaCarousel__SeriesSpecialRail': ( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ),
                        [`MediaCarousel__SeriesSpecialRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ),
                        'MediaCarousel__chipRail': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ),
                        [`MediaCarousel__chipRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL )
                      } )
                  }
                  ref={ MediaCarouselRef }
                >
                  { SwiperSlideItems }
                </div>
              </>
            ) }
          </div>
          }
          { contentToDisplay && ( ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) ) &&
          <>
            {
              contentToDisplay?.appContentList?.length > 0 ? (
                <ChannelMediaCardSection
                  railPosition={ position }
                  sectionSource={ sectionSource }
                  sectionType={ sectionType }
                  configType={ props?.configType }
                  placeHolder={ placeHolder }
                  railId={ id }
                  channelContent={ contentToDisplay }
                  currentBroadCasterIndexPosition={ selectedPartnerChipIndex + 1 }
                  chipDataList={ sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList : contentList } // { contentList } //
                  selectedChipIndex={ selectedPartnerChipIndex }
                  railLayOutType={ layout_Type }
                  chipRailType={ railType }
                  section_src={ section_src }
                  cardSize={ cardSize }
                  setRailSectionSource={ setRailSectionSource }
                  isKeyReleased={ isKeyReleased }
                  isTitleEnabledLs={ ( isTitleEnabledLs || titleEnabledLs ) }
                  bannerColorCodeEnabled={ bannerColorCodeEnabled }
                  renderFrom={ PAGE_TYPE.PARTNER_PAGE }
                  setShowSynopsis={ props?.setShowSynopsis }
                  railTitle={ props?.railData?.title }
                />
              ) : (
                <div
                  className={
                    classNames( `ChipCardSection__channelAppWithNoContent`,
                      { 'ChipCardSection__channelAppWithNoContent--bingTop10Contents': railType === CHANNEL_RAIL_TYPE.BINGE_TOP_10,
                        'ChipCardSection__channelAppWithNoContent--LANSCAPE_LARGE': ( ( railType === CHANNEL_RAIL_TYPE.EDITORIAL || railType === CHANNEL_RAIL_TYPE.TITLE ) && layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE ),
                        'ChipCardSection__channelAppWithNoContent--PORTRAIT_LARGE': ( ( railType === CHANNEL_RAIL_TYPE.EDITORIAL || railType === CHANNEL_RAIL_TYPE.BINGE_TOP_10 ) && layout_Type === LAYOUT_TYPE.PORTRAIT && cardSize === CARD_SIZE.LARGE )
                      }
                    )
                  }
                >
                  <FocusContext.Provider focusable={ false }
                    value=''
                  > <Button
                      label={ noContentListOfChipText }
                    />
                  </FocusContext.Provider>
                </div>
              )
            }
          </>
          }
        </div>
      </FocusContext.Provider> }
    </div>

  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} railData - rail data
   */
export const propTypes = {
  railData: PropTypes.object
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {boolean} openSeriesInfo -sets the Info of seriesCard details
 */

export const defaultProps = {
  openSeriesInfo: false
};

MediaCarousel.propTypes = propTypes;

export default MediaCarousel;
