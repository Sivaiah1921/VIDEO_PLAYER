/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/**
 * Carousel wraper component for all media card rails
 *
 * @module views/components/HomeMediaCarousel
 * @memberof -Common
 */
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Text from '../Text/Text';
import useRenderImage, { getRailComponent, getProviderLogo, getVisibleViewPortElements, getInitialCardCount, contentDetailUrl, modalDom, renderImage, getBestOfAppLogo, getCustomLayoutType } from '../../../utils/util';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import {
  constants,
  CONTENT_TYPE,
  LAYOUT_TYPE,
  PAGE_TYPE,
  SECTION_SOURCE,
  PAGE_NAME,
  CARD_SIZE,
  isExcludedRail,
  CHANNEL_RAIL_TYPE,
  PROVIDER_LIST,
  isExcludedTitleRail,
  CHIP_RAIL_TYPE
} from '../../../utils/constants';
import ShuffleMediaCard from '../ShuffleMediaCard/ShuffleMediaCard';
import classNames from 'classnames';
import Image from '../Image/Image';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder'
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import Genre from '../Icons/Genre';
import GenreRailNew from '../Icons/GenreRailNew';
import './HomeMediaCarousel.scss';
import SelectLanguage from '../SelectLanguage/SelectLanguage';
import Icon from '../Icon/Icon';
import AppMediaCardSection from '../AppMediaCardSection/AppMediaCardSection';
import SelectPromo from '../SelectPromo/SelectPromo';
import lottie from 'lottie-web';
import ChannelMediaCardSection from '../ChannelMediaCardSection/ChannelMediaCardSection';
import { getAuthToken, setChipData } from '../../../utils/localStorageHelper';
import { rail_chip_click } from '../../../utils/mixpanel/mixpanelService';
import Button from '../Button/Button';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';


/**
   * Represents a HomeMediaCarousel component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns HomeMediaCarousel
   */

export const HomeMediaCarousel = function( props ){
  const { onFocus, focusFrom, CarouselLength, setExpandShow, focusKeyRefrence, isKeyReleased, topPositionRailValue, fetchHorizontalContent, position, hasPageContainCarouselList, setRailFocusedCardInfo, activeContent, onSelectChip, setRailSectionSource, chipLoaderState, setActiveRailSelections } = props;
  const { title, id, layoutType, sectionSource, contentList, provider, sectionType, placeHolder, totalCount, promoText, backgroundImage, buttonCTAText, providerPromoImage, railContentType, bannerColorCode, descriptionHeader, description, specialAnimation, specialImage, labelImage, imageMetadata, railType, railSubTitle, appName, bannerColorCodeEnabled, isTitleEnabledLs, titleEnabledLs, subTitle, subTitleImage, loggedInSubtitle, chipList, enableUI, ribbonColor } = props.railData || {};
  const [genereRotate, setGenereRotate] = useState( 0 )
  const [loadCount, setLoadCount] = useState( getInitialCardCount( sectionSource, layoutType, railType ) );
  const [mouseEntered, setMouseEntered] = useState( false )
  const mouseEntryRef = useRef( false )
  const scrollMomentRef = useRef( '' )
  const prevXRef = useRef( 0 )
  const callNext = useRef( true )
  const rotationRef = useRef( 0 )
  const HomeMediaCarouselRef = useRef( null );
  const { railsRestoreId, lastRailTitle, checkRecRailRef, railCardTitle, railRestoreTitle, genereDirection, genereRotationRef, bbaSelectedItem, setBBASelectedItem, newChipSelected } = useMaintainPageState() || null;
  const previousPathName = useNavigationContext();
  const { configResponse, url } = useAppContext();
  const { ref, focusKey, focusSelf, hasFocusedChild } = useFocusable( { onFocus, trackChildren: true, focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null } );

  const { config } = configResponse;
  const providerLogoList = useMemo( () => get( config, 'providerLogo' ), [config] );
  const partnerLogo = useMemo( () => get( config, 'Partnerpopupdetails' ), [config] );
  const noContentListOfChipText = useMemo( () => get( config, 'noContentChip' ), [config] );
  const [bestofappName, setBestOfAppName] = useState( '' )
  const [imagesrc, setImagesrc] = useState( '' )
  const RailComponent = useMemo( () => getRailComponent( sectionSource, layoutType, 'HOME', railType ), [sectionSource, layoutType] );
  const layout_Type = useMemo( () => SECTION_SOURCE[sectionSource] ? layoutType : LAYOUT_TYPE.LANDSCAPE, [sectionSource] );
  const section_src = useMemo( () => SECTION_SOURCE[sectionSource] ? sectionSource : SECTION_SOURCE.EDITORIAL, [sectionSource] );
  const cardSize = useMemo( () => SECTION_SOURCE[sectionSource] ? imageMetadata?.cardSize : '', [sectionSource] );
  const svgContainer = useRef( null )
  const labelImageContainer = useRef( null )

  const specialBannerRibbonColor = ( enableUI && ribbonColor ) || ''

  const { filterChipRailList } = useContentFilter()

  const getRailsScrollPositionCallBack = useCallback( ( rest, selectedSectionSource, withMouseEntry, scrollMovement, visibleIndexes, currentIndexValue ) =>{
    if( HomeMediaCarouselRef.current ){
      let defaultScrollValue = 0
      if( withMouseEntry && scrollMovement === 'left' && !visibleIndexes.includes( currentIndexValue ) ){
        if( selectedSectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width - 10 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.LANGUAGE ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 150 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 150 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 310 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.PROVIDER ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 150 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_CHANNEL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 120 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( sectionSource === 'SHUFFLE_RAIL' && selectedSectionSource === 'HOME_MEDIACARDS' && currentIndexValue === 0 ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 250 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 580 )
          }, 200 )
        }
        else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 690 )
          }, 200 )
        }
        else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( rest.width + 360 )
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width + 300 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === 'HOME_MEDIACARDS' ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width - 10 ) ) || defaultScrollValue
          }, 200 )
        }
      }
      else if( withMouseEntry && scrollMovement === 'right' && !visibleIndexes.includes( currentIndexValue ) ){
        if( selectedSectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width * 3 ) + 200 ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.LANGUAGE ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width * 7 + 30 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width * 7 + 30 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width * 3 + 30 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.PROVIDER ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width * 7 + 30 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_CHANNEL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 )
          }, 200 )
        }
        else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 4 )
          }, 200 )
        }
        else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = rest.left - ( rest.width * 1.7 )
          }, 200 )
        }
        else if( selectedSectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          setTimeout( ()=>{
            HomeMediaCarouselRef.current.scrollLeft = ( rest.left - ( rest.width - 300 ) ) || defaultScrollValue
          }, 200 )
        }
        else if( selectedSectionSource === 'HOME_MEDIACARDS' ){
          setTimeout( ()=>{
            if( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE && !isExcludedRail( sectionSource ) || sectionSource === SECTION_SOURCE.WATCHLIST ){
              HomeMediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 380 ) * 4 ) || defaultScrollValue
            }
            else {
              HomeMediaCarouselRef.current.scrollLeft = rest.left - ( ( rest.width - 139 ) * 4 ) || defaultScrollValue
            }
          }, 200 )
        }
      }
    }
  }, [HomeMediaCarouselRef, mouseEntryRef.current, scrollMomentRef.current] )

  const onCardFocus = useCallback(
    throttle( ( { x, ...rest }, id, contentRail, index, provider, content ) => {
      // if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
      if( ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL || ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.COMPOSITE ) ) && !mouseEntryRef.current ){
        rail_chip_click( content, title, position )
        setTimeout( ()=> setRailSectionSource( true ), 10 )
      }
      if( contentRail.mixedRail && ( index + 1 === totalCount ) ){
        props.appendRecommendationDataWithMixedRail( contentRail )
      }
      if( sectionSource !== SECTION_SOURCE.BINGE_CHIP_RAIL && callNext.current && contentRail && contentRail.contentList.length && totalCount && contentRail.contentList.length < totalCount && ( contentRail.contentList.length - index - 10 ) <= 3 && !contentRail.isEndReached ){ // BINGE_CHIP_RAIL for horizantal fectch need to work on this
        fetchHorizontalContent( contentRail.id, contentRail.originalContentListLength, { sectionSource: contentRail.sectionSource, pagingState: contentRail.pagingState } )
        callNext.current = false
        setTimeout( () => {
          callNext.current = true
        }, 400 );
      }
      const newCount = loadCount + Math.floor( rest.left / rest.width );
      const count = contentRail.isPagination || contentRail.contentList.length;
      if( count >= newCount ){
        setLoadCount( newCount );
      }
      // Modified this line for one of the edge case, from search, login & subscribe user is not able to open a sidebar by pressing a left key from APP rail. if( isExpanded ) check is not correctly applicable in this case.
      if( document.querySelector( '.LeftNavContainer__expanded' ) ){
        previousPathName.expandedMenu = true ;
      }
      if( ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL || sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ) && window.location.pathname.includes( PAGE_TYPE.CONTENT_DETAIL ) ){
        props.liveFocusCard && props.liveFocusCard( id )
      }
      setExpandShow && setExpandShow( true )

      if( contentRail.sectionSource === SECTION_SOURCE.GENRE ){
        const screenWidth = window.innerWidth
        const cardWidth = document.querySelector( '.HomeMediaCarousel__GENRE--LANDSCAPE' )?.clientWidth + 10

        const getVisibleElements = () => {
          const container = document.querySelector( '.HomeMediaCarousel__GenereRailItems' );
          const containerRect = container.getBoundingClientRect();
          const elements = container.getElementsByClassName( 'GenreMediaCard' );
          const visibleElements = [];

          for ( let i = 0; i < elements.length; i++ ){
            const elementRect = elements[i].getBoundingClientRect();
            if( containerRect &&
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

        if( index === 0 && document.querySelector( '.HomeMediaCarousel__GenereRailItems' ) ){
          document.querySelector( '.HomeMediaCarousel__GenereRailItems' ).style.marginLeft = '10rem'
        }
        const visibleElements = getVisibleElements()
        if( genereDirection.current === 'right' || scrollMomentRef.current === 'right' ){
          if( visibleElements.includes( rest.node.innerText ) === false ){
            const rightAdjestmentValue = screenWidth === 1920 ? 150 : 90
            document.querySelector( '.HomeMediaCarousel__GenereRailItems' ).style.marginLeft = '5rem'
            if( HomeMediaCarouselRef.current ){
              if( mouseEntryRef.current ){
                setTimeout( ()=>{
                  HomeMediaCarouselRef.current.scrollLeft = ( ( index - ( visibleElements.length - 1 ) ) * cardWidth ) - rightAdjestmentValue
                }, 200 )
              }
              else {
                HomeMediaCarouselRef.current.scrollLeft = ( ( index - ( visibleElements.length - 1 ) ) * cardWidth ) - rightAdjestmentValue
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
          const container = screenWidth === 1920 ? 510 : 350
          if( visibleElements.includes( rest.node.innerText ) === false ){
            if( HomeMediaCarouselRef.current ){
              if( mouseEntryRef.current ){
                setTimeout( ()=>{
                  HomeMediaCarouselRef.current.scrollLeft = rest.left - container
                }, 200 )
              }
              else {
                HomeMediaCarouselRef.current.scrollLeft = rest.left - container
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
      else if( mouseEntryRef.current ){
        if( sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
          const visibleIndexes = getVisibleViewPortElements( null, contentRail?.id )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ){
          const totalItems = getVisibleViewPortElements( sectionSource, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 3 )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.LANGUAGE ){
          const totalItems = getVisibleViewPortElements( sectionSource, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 7 )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && railType === constants.SPORTS ){
          const totalItems = getVisibleViewPortElements( sectionSource, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 7 )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.PROVIDER ){
          const totalItems = getVisibleViewPortElements( sectionSource, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 6 ) // TODO: Siva to explain this block
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.BINGE_CHANNEL ){
          const visibleIndexes = getVisibleViewPortElements( sectionSource, contentRail?.id )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL ){
          const visibleIndexes = getVisibleViewPortElements( sectionSource, contentRail?.id )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
          const visibleIndexes = getVisibleViewPortElements( sectionSource, contentRail?.id )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
          const visibleIndexes = getVisibleViewPortElements( sectionSource, contentRail?.id )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          const totalItems = getVisibleViewPortElements( sectionSource, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 6 )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, sectionSource, mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
        else if( sectionSource !== SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
          const totalItems = getVisibleViewPortElements( null, contentRail?.id )
          const visibleIndexes = totalItems.slice( 1, 6 )
          HomeMediaCarouselRef.current && getRailsScrollPositionCallBack( rest, 'HOME_MEDIACARDS', mouseEntryRef.current, scrollMomentRef.current, visibleIndexes, index )
        }
      }
      else {
      // eslint-disable-next-line no-lonely-if
        if( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL || sectionSource === SECTION_SOURCE.SHUFFLE_RAIL ){
          scrollHorizontal( rest.left - ( ( rest.width * 4 ) + 10 ) );
        }
        else if( sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ){
          scrollHorizontal( rest.left - ( ( rest.width * 3 ) - 200 ) );
        }
        else if( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ){
          scrollHorizontal( rest.left - ( rest.width * 3.35 ) );
        }
        else if( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ){
          scrollHorizontal( rest.left - ( ( rest.width ) * 1.7 ) );
        }
        else if( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.LANGUAGE || ( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && railType === constants.SPORTS ) || ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.STANDALONE ) || ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && layout_Type === 'SQUARE' ) ){
          scrollHorizontal( rest.left - ( ( rest.width + 50 ) * 4 ) );
        }
        else if( ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL || sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) ){
          scrollHorizontal( rest.left - 650 );
        }
        else if( sectionSource !== SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
          if( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE && !isExcludedRail( sectionSource ) ){
            scrollHorizontal( rest.left - ( ( rest.width - 380 ) * 4 ) );
          }
          else {
            scrollHorizontal( rest.left - ( ( rest.width - 137 ) * 4 ) ); // value changed to 137 from 153 because portrait cards are cropping on 1280 resolution.
          }
        }
      }
      previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${props.railData.id}${id}`
    }, props.isKeyReleased ? 0 : 500 ), [HomeMediaCarouselRef, mouseEntryRef.current, scrollMomentRef.current] );

  const scrollHorizontal = ( left ) => {
    if( HomeMediaCarouselRef.current ){
      try {
        HomeMediaCarouselRef.current.scrollTo( {
          left: left
        } )
      }
      catch ( e ){
        HomeMediaCarouselRef.current.scrollLeft = left;
      }
    }
  }

  const onMouseEnterCallBackFn = ( parentId, contentId ) => {
    if( sectionSource !== SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
      setFocus( `BUTTON_FOCUS_${parentId}${contentId}` )
    }
    else {
      setFocus( `BUTTON_FOCUS_${id}${contentList[6]?.id}` )
    }
  }

  const onMouseEnterCallBackShuffleFn = ( id ) => {
    setFocus( `BUTTON_FOCUS_${id}` )
    props?.setShuffleCardFocus( true )
  }

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

  const handleRightBBAArrowClick = () => {
    if( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
      let selectedItem = bbaSelectedItem
      selectedItem = ( selectedItem + 1 ) % contentList.length;
      setBBASelectedItem( selectedItem );
      setFocus( `BUTTON_FOCUS_${id}${contentList[7]?.id}` )
    }
  }

  const handleLeftBBAArrowClick = () => {
    if( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
      let selectedItem = bbaSelectedItem
      selectedItem = ( selectedItem - 1 + contentList.length ) % contentList.length;
      setBBASelectedItem( selectedItem );
      setFocus( `BUTTON_FOCUS_${id}${contentList[5]?.id}` )
    }
  }

  const selectedPartnerChipIndex = useMemo( () => {
    // console.log( '#inside homemeda selected1', title, position, activeContent )
    // setChipData( activeContent,
    //   title,
    //   position, )
    // // rail_chip_click( activeContent, title, position )

    // return activeContent?.selectedIndex ?? 0;
    if( !activeContent || !activeContent.content || activeContent.content.length === 0 ){
      return activeContent?.selectedIndex ?? 0;
    }

    return activeContent?.selectedIndex ?? 0;
  }, [activeContent] );


  const contentToDisplay = useMemo( () => {
    return activeContent?.content || ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList?.[0] : contentList?.[0] );
  }, [activeContent, contentList] );

  const handleChangeChannelClick = ( content, indexPosition, railId, sectionSource, title, position ) =>{
    onSelectChip( railId, content, indexPosition, sectionSource, title, position )
  }

  const renderImage = useRenderImage();
  const SwiperSlideItems = useMemo( () => {
    const reqLength = sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ? contentList.length : sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList.length : Math.min( contentList.length, loadCount );
    const requiredLength = sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ? reqLength : reqLength + 1;
    const renderedRails = sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList : contentList

    return renderedRails.slice( 0, requiredLength )?.map( ( content, index ) => ( // either chipList or contenList // Need To Check
      <div
        className={
          classNames( `HomeMediaCarousel__${section_src}${!getCustomLayoutType( section_src, layout_Type ) ? `` : `--${getCustomLayoutType( section_src, layout_Type )}`}${isExcludedRail( sectionSource ) || !cardSize || ( layout_Type === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.MEDIUM ) ? `` : `--${cardSize}`}`,
            { 'HomeMediaCarousel__animationStart': props.animationStart && props.onShuffleClick },
            { 'HomeMediaCarousel__animationEnd': !props.animationStart && props.onShuffleClick },
            { 'HomeMediaCarousel__selectedChannelCard': activeContent?.selectedIndex === index } // need to verify with selectedcontentId
          )
        }
        key={ content.id }
      >
        <RailComponent
          key={ content.id }
          image={ renderImage( content, sectionSource, layout_Type, section_src, url, null ) }
          title={ content.seriesvrId ? content.seriesTitle : content.title }
          description={ content.seriesvrId ? content.seriesDescription : content.description }
          railTitle={ title }
          railId={ id }
          onFocus={ ( e ) => onCardFocus( e, content.id, props.railData, index, content.provider, content ) }
          focusKeyRefrence={ `BUTTON_FOCUS_${id}${ sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? content.chipId : content.id}` }
          totalRailLength={ contentList?.length }
          totalRails={ props.totalRailLength }
          setHomeCaroselInfo={ props.setCaroselPageView }
          contentID={ content.seriesvrId ? content.seriesvrId : content.id }
          imageCardSize={ props?.railData?.imageMetadata?.cardSize }
          layoutTypeForMixPanel={ props.railData?.layoutType }
          topPositionRailValue={ props?.topPositionRailValue }
          onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( id, content.id ) }
          url={ contentDetailUrl( content, true ) }
          liveContent={ content.liveContent }
          broadcastMode={ content?.broadcastMode }
          playerAction={ content?.playerAction }
          sectionSource={ sectionSource }
          placeHolder={ placeHolder }
          contractName={ content.contractName }
          sectionType={ sectionType }
          configType={ props.configType }
          genereRotate={ genereRotate }
          freeEpisodesAvailable={ content.freeEpisodesAvailable }
          contentType={ content.seriesvrId ? content.seriescontentType : content.contentType }
          providerName={ content.provider }
          isKeyReleased={ isKeyReleased }
          partnerSubscriptionType={ content.partnerSubscriptionType }
          railPosition={ position + 1 }
          cardIndexValue={ index }
          providerContentId={ content.providerContentId }
          language={ content.language || content.languages || content.audio || content.subTitles }
          languagesGenres={ content.languagesGenres }
          metaDetails={ content.metaDetails }
          tagInfoDTO={ content.tagInfoDTO }
          contentNativeName={ content.contentNativeName }
          previewPoster={ content.previewPoster }
          secondaryText={ content.secondaryText }
          hasPageContainCarouselList={ hasPageContainCarouselList }
          duration={ content.duration }
          provider={ `${getProviderLogo( providerLogoList, content.provider, constants.LOGO_SQUARE, url )}` }
          railType={ props.railData.railType }
          totalRailList={ props?.totalRailList }
          parentFocusKey={ focusKeyRefrence }
          setRailFocusedCardInfo={ setRailFocusedCardInfo }
          marketingAsset={ content.marketingAsset }
          channelId={ content?.id }
          genre={ content.genres || content.genre }
          { ...( railContentType && {
            railContentType: railContentType
          } ) }
          { ...( ( sectionSource === SECTION_SOURCE.GENRE ) && {
            imageUrl: content.newBackgroundImage
          } )
          }
          {
            ...( ( ( sectionSource === SECTION_SOURCE.LANGUAGE || sectionSource === SECTION_SOURCE.GENRE ) && ( layoutType === LAYOUT_TYPE.LANDSCAPE || layoutType === LAYOUT_TYPE.CIRCULAR ) ) ) && {
              source: props.source,
              contentPosition: index + 1,
              newImage: content.newImage
            }

          }
          {
            ...( ( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ) ) && {
              bbaRail: true,
              selectedProvider: content.selectedProvider,
              providerPosition: content.providerIndex,
              bbaProviderContent:content,
              hasFocusedChild: hasFocusedChild,
              railData: props.railData,
              centerElementFocusKey: `BUTTON_FOCUS_${id}${contentList[6]?.id}`,
              rightElementFocusKey: `BUTTON_FOCUS_${id}${contentList[7]?.id}`,
              leftElementFocusKey: `BUTTON_FOCUS_${id}${contentList[5]?.id}`
            }
          }
          {
            ...( ( sectionSource === SECTION_SOURCE.PROVIDER || sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ) && ( layoutType === LAYOUT_TYPE.CIRCULAR || layoutType === LAYOUT_TYPE.LANDSCAPE ) ) && {
              pageType: content.pageType,
              contentPosition: index + 1
            }
          }
          { ...( ( sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL && layoutType === LAYOUT_TYPE.TOP_PORTRAIT ) && {
            position: index + 1,
            contractName: content.contractName,
            partnerSubscriptionType: content.partnerSubscriptionType,
            providerName: content.provider,
            setShowSynopsis: props?.setShowSynopsis,
            actors: content.actor,
            appName:provider,
            genre: content.genre || content.genres,
            language: content.language || content.languages || content.audio || content.subTitles,
            contentPosition: index + 1,
            releaseYear: content.releaseYear
          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.BINGE_CHANNEL && layoutType === LAYOUT_TYPE.LANDSCAPE ) && {
            contentList: contentList,
            contentPosition: index + 1,
            language: content.language || content.languages || content.audio || content.subTitles,
            genre: content.genre || content.genres,
            providerName: content.provider,
            channelName: content.channelName,
            channelNumber: content.channelNumber
          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.SHUFFLE_RAIL || sectionSource === SECTION_SOURCE.RECOMMENDATION || sectionSource === SECTION_SOURCE.EDITORIAL || sectionSource === SECTION_SOURCE.TVOD || sectionSource === SECTION_SOURCE.CONTINUE_WATCHING || sectionSource === SECTION_SOURCE.LIVE_EVENT_RAIL ) && {
            actors: content.actor,
            appName:provider,
            genre: content.genre || content.genres,
            language: content.language || content.languages || content.audio || content.subTitles,
            contentPosition: index + 1,
            releaseYear: content.releaseYear,
            setShowSynopsis: props?.setShowSynopsis,
            setBannerShow: props?.setBannerShow,
            contractName: content.contractName,
            partnerSubscriptionType: content.partnerSubscriptionType,
            providerName: content.provider,
            rentalExpiry: content.rentalExpiry

          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL ) && {
            contentList: contentList,
            hideCrown: true,
            actors: content.actor,
            appName: provider,
            genre: content.genre || content.genres,
            language: content.language || content.languages || content.audio || content.subTitles,
            contentPosition: index + 1,
            releaseYear: content.releaseYear,
            contractName: content.contractName,
            partnerSubscriptionType: content.partnerSubscriptionType,
            providerName: content.provider,
            channelName: content.channelName,
            channelNumber: content.channelNumber
          } ) }
          { ...( ( sectionSource === SECTION_SOURCE.CONTINUE_WATCHING || sectionSource === SECTION_SOURCE.WATCHLIST ) && {
            providerName: content.provider,
            genre: content.genre || content.genres || content.subTitles,
            partnerSubscriptionType: content.partnerSubscriptionType,
            language: content.language || content.languages || content.audio || content.subTitles
          } ) }
          { ...( ( sectionSource === constants.EPISODE_RAIL ) && {
            timeBlock: content.duration || content.totalDuration,
            showTimeBlock: false
          } )
          }
          { ...( sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL && provider && {
            bannerTitle: content.title,
            timeBlock: content.duration || content.totalDuration
          } )
          }
          { ...( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL && {
            genre: content.genre || content.genres
          } )
          }
          { ...( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL && {
            genre: content.genre || content.genres
          } )
          }
          { ...( ( sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS || sectionSource === SECTION_SOURCE.TITLE_RAIL ) && {
            bannerColorCodeEnabled: bannerColorCodeEnabled,
            isTitleEnabledLs: ( isTitleEnabledLs || titleEnabledLs ),
            timeBlock: content.duration || content.totalDuration,
            pageType: content.pageType,
            contentPosition: index + 1
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
          {
            ...( ( ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL || sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) ) ) && {
              channelData:content,
              contentIndex: index,
              contentPosition: index + 1,
              secondary: true,
              label: sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? ( content?.chipDisplayText || content?.chipName ) : content?.title,
              className: ( activeContent?.selectedIndex ?? 0 ) === index ? `selectedCard ${!!( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && content?.chipIcon ) && 'withLeftImage'}` : `nonSelectedCard ${!!( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && content?.chipIcon ) && 'withLeftImage'}`,
              size: 'medium',
              catalogWidth: ( content?.chipDisplayText || content?.chipName )?.length,
              imageLeft: !!( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && content?.chipIcon ),
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
              setRailSectionSource: setRailSectionSource,
              chipsContentList: renderedRails,
              currentSelectedChipdata: contentToDisplay,
              selectedPartnerChipIndex: selectedPartnerChipIndex,
              setActiveRailSelections: setActiveRailSelections,
              mouseEntered: mouseEntered,
              chipLoaderState: chipLoaderState
            }
          }
        />
      </div>
    ) )
  }, [isKeyReleased, topPositionRailValue, loadCount, contentList, mouseEntered, activeContent, selectedPartnerChipIndex] );

  useEffect( () => {
    if( focusFrom === PAGE_NAME.CATALOG_PRTNR && !CarouselLength && !modalDom() ){
      focusSelf();
    }
    if( railsRestoreId.current !== null && window.location.pathname.includes( 'discover' ) ){
      if( document.querySelector( '.Home__rails' ) !== null ){
        if( !!checkRecRailRef.isrecommendedRail || sectionSource === SECTION_SOURCE.CONTINUE_WATCHING ){
          if( props.railData.title === railRestoreTitle.current ){
            const list = props.railData.contentList.map( item => item.title )
            list?.includes( railCardTitle.current ) ? setFocus( `BUTTON_FOCUS_${railsRestoreId.current}` ) : setTimeout( ()=> setFocus( `BUTTON_FOCUS_${lastRailTitle}` ), 100 )
          }
        }
        else if( window.location.pathname.includes( 'discover' ) ){
          setFocus( `BUTTON_FOCUS_${railsRestoreId.current}` )
        }
      }
    }
  }, [] );

  useEffect( () => {
    const getMouseStateChange = ( event ) => {
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
    <FocusContext.Provider value={ focusKey }>
      <div
        className={
          classNames(
            `HomeMediaCarousel HomeMediaCarousel_${ props.railData?.id }`,
            { 'HomeMediaCarousel__browseByApp': sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS,
              'HomeMediaCarousel__BackgroundBannerRailbottom': sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
              'HomeMediaCarousel__specialRailbottom': sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL,
              'HomeMediaCarousel__SeriesSpecialRailbottom': sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL,
              'HomeMediaCarousel__CompositeRail': sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && CHIP_RAIL_TYPE.includes( railType ),
              'HomeMediaCarousel__browseByChannels': sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && CHIP_RAIL_TYPE.includes( railType ),
              'HomeMediaCarousel__ChipsbrowseByChannels': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ),
              'HomeMediaCarousel__ChipsbrowseByChannelsWithOutMouse': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) && !mouseEntryRef.current
            }
          ) }
        ref={ ref }
        onMouseEnter={ onMouseEnterpageFn }
        onMouseLeave={ onMouseLeavepageFn }
        onMouseMove={ handleMouseMove }
      >
        <div className='HomeMediaCarousel__heading'>
          {
            isExcludedTitleRail( sectionSource ) && (
              <>
                {
                  sectionSource === SECTION_SOURCE.MARKETING_ASSET ?
                    (
                      subTitleImage && (
                        <div className='HomeMediaCarousel--bestofAppx-provider'>
                          <Image src={ subTitleImage }
                            alt='provider logo'
                          />
                        </div>
                      )
                    ) :
                    (
                      imagesrc ? (
                        <div className='HomeMediaCarousel--bestofAppx-provider'>
                          <Image src={ imagesrc } />
                        </div>
                      ) : (
                        <div className={ labelImage ? 'HomeMediaCarousel__labelImage' : 'HomeMediaCarousel__visibility-hidden' }>
                          { labelImage?.endsWith( '.json' ) ? (
                            <div
                              className='HomeMediaCarousel__labelImage-lottieAnimation'
                              ref={ labelImageContainer }
                            />
                          ) : (
                            <Image src={ labelImage }
                              alt=''
                            />
                          ) }
                        </div>
                      )
                    )
                }
                <div className={ classNames( 'HomeMediaCarousel__Title', {
                  'HomeMediaCarousel__Title--channelRailTitle': (
                    sectionSource === SECTION_SOURCE.BINGE_CHANNEL || sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL
                  )
                } ) }
                >
                  <Text color='railTitle'
                    textStyle='rail-heading'
                  >
                    { title }
                  </Text>

                  <Text color='railSubHeading'
                    textStyle='rail-sub-heading'
                  >
                    { sectionSource === SECTION_SOURCE.MARKETING_ASSET ?
                      ( !getAuthToken() ? subTitle : loggedInSubtitle ) :
                      railSubTitle }
                  </Text>
                </div>
              </>
            )
          }
          {
            Boolean( sectionSource === SECTION_SOURCE.BINGE_CHANNEL || sectionSource === SECTION_SOURCE.DARSHAN_CHANNEL || title === 'TATA PLAY Darshan' || title === 'Darshan News' ) && (
              <div className='HomeMediaCarousel__liveCircle' />
            )
          }
        </div>
        {
          sectionSource === SECTION_SOURCE.SHUFFLE_RAIL && provider && (
            <div className='HomeMediaCarousel--provider'>
              <Image
                src={ `${getProviderLogo( providerLogoList, provider, constants.LOGO_SQUARE, url )}` }
              />
            </div>
          )
        }
        <FocusContext.Provider value={ focusKey }>
          <div className='HomeMediaCarousel__suffle'>
            {
              sectionSource === SECTION_SOURCE.LANGUAGE_NUDGE && (
                <SelectLanguage
                  setCaroselPageView={ props?.setCaroselPageView }
                  setHomeCaroselInfo={ props.setCaroselPageView }
                  focusKeyRefrence={ `BUTTON_FOCUS_${id}` }
                  topPositionRailValue={ props?.topPositionRailValue }
                />
              )
            }
            {
              ( sectionSource === SECTION_SOURCE.PROMO_BANNER ) && (
                <SelectPromo
                  setCaroselPageView={ props.setCaroselPageView }
                  setHomeCaroselInfo={ props.setCaroselPageView }
                  focusKeyRefrence={ `BUTTON_FOCUS_${id}` }
                  topPositionRailValue={ props.topPositionRailValue }
                  promoText={ promoText }
                  promoBgImage={ backgroundImage }
                  promoCta={ buttonCTAText }
                  promoLogoImage={ providerPromoImage }
                />
              )
            }
            {
              sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL && (
                <>
                  <div className='HomeMediaCarousel__episodeRailWelcome'>
                    {
                      backgroundImage && (
                        <div className='HomeMediaCarousel__episodeRailWelcome__backgroundImage'>
                          <Image
                            src={ backgroundImage }
                          />
                        </div>
                      )
                    }
                    {
                      provider && (
                        <div className='HomeMediaCarousel__episodeRailWelcome__railLogo'>
                          <Image
                            src={ `${getProviderLogo( providerLogoList, provider, constants.LOGOPROVIDERBBA, url )}` }
                          />
                        </div>
                      )
                    }
                    <div style={ { background: `linear-gradient( 90deg, rgba( 255, 255, 255, 0.1 ) 94%, ${bannerColorCode} 100% )` } }
                      className='HomeMediaCarousel__episodeRailWelcome__gradient'
                    />
                  </div>
                  <div style={ { backgroundColor: bannerColorCode } }
                    className='HomeMediaCarousel__episodeRailWelcomeColour'
                  />
                </>
              )
            }
            {
              sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL && (
                <>
                  <div className='HomeMediaCarousel__specialRailWelcome'>
                    <div className='HomeMediaCarousel__specialRailWelcome__backgroundImage'>
                      <Image
                        src={ backgroundImage }
                      />
                    </div>
                    {
                      enableUI && (
                        <div className='HomeMediaCarousel__specialRailWelcome__headerContentWrapper'>
                          <div className='HomeMediaCarousel__specialRailWelcome__headerContentWrapper--headerText'
                            style={ { backgroundColor: specialBannerRibbonColor } }
                          >
                            <Text color='white'>{ title }</Text>
                          </div>
                          <div className='HomeMediaCarousel__specialRailWelcome__headerContentWrapper--polygon'
                            style={ { backgroundColor: specialBannerRibbonColor } }
                          >
                          </div>
                        </div>
                      )
                    }
                    {
                      ( descriptionHeader || description ) && <div className='HomeMediaCarousel__specialRailWelcome__headerSubText'>
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
                        <div className='HomeMediaCarousel__specialRailWelcome__lottieAnimation'
                          ref={ svgContainer }
                        >
                        </div>
                      ) :
                        specialAnimation?.endsWith( '.gif' ) ? (
                          <div className='HomeMediaCarousel__specialRailWelcome__specialImage' >
                            <Image src={ specialAnimation }></Image>
                          </div>
                        ) : (
                          specialImage ? (
                            <div className='HomeMediaCarousel__specialRailWelcome__specialImage' >
                              <Image src={ specialImage }></Image>
                            </div>
                          ) :
                            null
                        )
                    }
                    <div className='HomeMediaCarousel__specialRailWelcome__gradient'/>
                  </div>
                  <div className='HomeMediaCarousel__specialRailWelcomeColour'/>
                </>
              )
            }
            {
              sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL && (
                <>
                  <div className='HomeMediaCarousel__SeriesSpecialRailWelcome'>
                    {
                      backgroundImage && (
                        <div className='HomeMediaCarousel__SeriesSpecialRailWelcome__backgroundImage'>
                          <Image
                            src={ backgroundImage }
                          />
                        </div>
                      )
                    }
                    {
                      provider && (
                        <div className='HomeMediaCarousel__SeriesSpecialRailWelcome__railLogo'>
                          <Image
                            src={ `${getProviderLogo( providerLogoList, provider, constants.LOGOPROVIDERBBA, url )}` }
                          />
                        </div>
                      )
                    }
                    <div style={ { background: `linear-gradient(270deg, ${'#000000' } 0%, rgba(2, 0, 5, 0) 36.6%)` } }
                      className='HomeMediaCarousel__SeriesSpecialRailWelcome__gradient'
                    />
                  </div>
                </>
              )
            }
            {
              sectionSource === SECTION_SOURCE.SHUFFLE_RAIL && SwiperSlideItems?.length >= 0 ? (
                <div
                  className={
                    classNames( 'HomeMediaCarousel__Rail' )
                  }
                  ref={ HomeMediaCarouselRef }
                >
                  { sectionSource === 'SHUFFLE_RAIL' && (
                    <ShuffleMediaCard
                      onFocus={ () => {
                        props?.setShuffleCurrent( false )
                        props?.setShuffleCardFocus( true )
                      } }
                      onPressHandleFn={ ()=>{
                        props.onPressHandleFn()
                      } }
                      icon='Shuffle'
                      title='Shuffle'
                      mixPanelTitle={ props.railData.mixPanelTitle }
                      focusKeyRefrence={ `BUTTON_FOCUS_${id}` }
                      onMouseEnterCallBackShuffleFn={ () => onMouseEnterCallBackShuffleFn( id ) }
                      setHomeCaroselInfo={ props?.setCaroselPageView }
                      setShuffleCurrent={ props?.setShuffleCurrent }
                      topPositionRailValue={ props?.topPositionRailValue }
                      setShuffleCardFocus={ props?.setShuffleCardFocus }
                      railPosition={ position + 1 }
                    />
                  ) }
                  { SwiperSlideItems }
                </div>
              ) : sectionSource === 'GENRE' ? (
                <>
                  <div className='HomeMediaCarousel__GenreRail'>
                    <div className='HomeMediaCarousel__GenreBackgroundReel1'>
                      <GenreRailNew />
                    </div>
                  </div>
                  <div className='HomeMediaCarousel__wrapperGenreCard'>
                    <div className='HomeMediaCarousel__GenreCard'>
                      <Genre count={ genereRotate }/>
                      <div className='HomeMediaCarousel__GenreCardBg'></div>
                    </div>
                    <div className='HomeMediaCarousel__GenreCardText'>
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
                    className='HomeMediaCarousel__GenereRailItems'
                    ref={ HomeMediaCarouselRef }
                  >
                    { SwiperSlideItems }
                  </div>
                </>
              ) : (
                <>
                  { sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS &&
                  <div
                    onClick={ handleLeftBBAArrowClick }
                    className='HomeMediaCarousel__BBAArrowLeft'
                  >
                    <Icon name='BBAArrowLeft' />
                  </div>
                  }
                  <div
                    className={
                      classNames( 'HomeMediaCarousel__Rail',
                        { 'HomeMediaCarousel__ExtraPadding' : cardSize === CARD_SIZE.LARGE && layout_Type === LAYOUT_TYPE.LANDSCAPE && !( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && railType === CHANNEL_RAIL_TYPE.STANDALONE ) || ( sectionSource === SECTION_SOURCE.WATCHLIST ),
                          'HomeMediaCarousel__BBARail': sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS,
                          'HomeMediaCarousel__AppRail': ( title === SECTION_SOURCE.BROWSE_BY_APP_RAIL || title === SECTION_SOURCE.BROWSE_BY_APPS || sectionSource === SECTION_SOURCE.BINGE_TOP_10_RAIL ),
                          'HomeMediaCarousel__BackgroundBannerRail': sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
                          [`HomeMediaCarousel__BackgroundBannerRail_${props.railData?.id}`]: sectionSource === SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
                          'HomeMediaCarousel__specialRail': ( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ),
                          [`HomeMediaCarousel__specialRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.SPECIAL_BANNER_RAIL ),
                          'HomeMediaCarousel__SeriesSpecialRail': ( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ),
                          [`HomeMediaCarousel__SeriesSpecialRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.SERIES_SPECIAL_RAIL ),
                          'HomeMediaCarousel__chipRail': ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ),
                          [`HomeMediaCarousel__chipRail_${props.railData?.id}`]: ( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL )
                        }
                      ) }
                    ref={ HomeMediaCarouselRef }
                  >
                    { SwiperSlideItems }
                  </div>
                  { sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS &&
                  <div
                    onClick={ handleRightBBAArrowClick }
                    className='HomeMediaCarousel__BBAArrowRight'
                  >
                    <Icon name='BBAArrowRight' />
                  </div>
                  }
                </>
              ) }
          </div>
        </FocusContext.Provider>
        { ( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ) &&
        <AppMediaCardSection
          railPosition={ position }
          sectionSource={ sectionSource }
          sectionType={ sectionType }
          configType={ props?.configType }
          placeHolder={ placeHolder }

        />
        }
        { contentToDisplay && ( ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL || sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ) && CHIP_RAIL_TYPE.includes( railType ) ) &&
        ( filterChipRailList( contentToDisplay?.appContentList )?.length > 0 ? (
          <ChannelMediaCardSection
            railPosition={ position }
            focusKeyChip={ `CHANNEL_MEDIA_CARD_SECTION_${id}_${contentToDisplay?.selectedContentId}` }
            sectionSource={ sectionSource }
            sectionType={ sectionType }
            configType={ props?.configType }
            placeHolder={ placeHolder }
            railId={ id }
            railTitle={ title }
            channelContent={ contentToDisplay }
            currentBroadCasterIndexPosition={ selectedPartnerChipIndex + 1 }
            chipDataList={ sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ? chipList : contentList }
            selectedChipIndex={ selectedPartnerChipIndex }
            railLayOutType={ layout_Type }
            chipRailType={ railType }
            section_src={ section_src }
            cardSize={ cardSize }
            setRailSectionSource={ setRailSectionSource }
            isKeyReleased={ isKeyReleased }
            isTitleEnabledLs={ ( isTitleEnabledLs || titleEnabledLs ) }
            bannerColorCodeEnabled={ bannerColorCodeEnabled }
            renderFrom={ PAGE_TYPE.DONGLE_HOMEPAGE }
            setRailFocusedCardInfo={ setRailFocusedCardInfo }
          />
        ) : (
          <>
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
              > { chipLoaderState ? '' :
                  (
                    <Button
                      label={ noContentListOfChipText }
                    />
                  ) }
              </FocusContext.Provider>
            </div>
          </>
        ) )
        }
      </div>
    </FocusContext.Provider>
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

HomeMediaCarousel.propTypes = propTypes;

export default HomeMediaCarousel;