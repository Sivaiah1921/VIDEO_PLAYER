/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * Component to display App/provider media card.
 *
 * @module views/components/AppMediaCard
 * @memberof -Common
 */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { cloudinaryCarousalUrl, getProviderLogo, getSourceForMixPanel, setMixpanelData, getMixpanelData } from '../../../utils/util';
import Image from '../Image/Image';
import Link from '../Link/Link';
import './AppMediaCard.scss';
import { LAYOUT_TYPE, SECTION_SOURCE, constants, PROVIDER_LIST, DISTRO_CHANNEL, PAGE_NAME, PAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { getDistroMeta, setContentRailPositionData, setDistroMeta, setSelectedPartner, setFromAppMediaCard } from '../../../utils/localStorageHelper';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { viewAppContent } from '../../../utils/mixpanel/mixpanelService';
import { getDistroEventTrackURL, getMetadataDistroTracking, TrackDistroEventCall } from '../../../utils/slayer/DistroService';
import { isDistroContent } from '../../../utils/slayer/PlayerService';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import Text from '../Text/Text';

/**
 * Represents a AppMediaCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppMediaCard
 */
let timeOut = null;
export const AppMediaCard = function( props ){
  const { onFocus, focusKeyRefrence, contentID, totalRails, setHomeCaroselInfo, isSubscritionModule, sectionSource, bbaProviderContent, railId, hasFocusedChild, railData, isKeyReleased, centerElementFocusKey, rightElementFocusKey, leftElementFocusKey, complementarytitle, COMMON_HEADERS } = props;
  const previousPathName = useNavigationContext();
  const { setTotalrailsList, setLastRailTitle, railsRestoreId, setLastFocusFrom, lastFocusFrom, catalogPage, topPositionRailValueContext, bbaRailRestoreId, bbaSelectedItem, setBBASelectedItem, bbaContentListId, setBbaContents, bbaContents, setOptionBba, homeDonglePageData } = useMaintainPageState() || null
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const { setContentInfo } = useHomeContext()
  const history = useHistory();
  const { profileAPIResult } = useProfileContext();
  const isAutoPlayed = useMemo( () => {
    return profileAPIResult?.data?.autoPlayTrailer ?
      MIXPANELCONFIG.VALUE.YES :
      MIXPANELCONFIG.VALUE.NO;
  }, [profileAPIResult] );
  const [distroTracking] = TrackDistroEventCall()
  const { trackDistroEvent } = distroTracking

  const { ref, focused } = useFocusable( {
    onFocus,
    onEnterPress: () => {
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false )
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
      if( direction === 'down' && sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
        bbaRailRestoreId.current = focusKeyRefrence
        if( document.querySelector( '.HomeMediaCarousel__bbaAppContent' ) ){
          setTimeout( () => {
            setFocus( 'BUTTON_FOCUS_0' )
          }, 0 );
          return false
        }
        else {
          setTimeout( () => {
            setFocus( 'BUTTON_EXPLORE' )
          }, 100 )
        }
      }
      if( direction === 'right' && sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
        let selectedItem = bbaSelectedItem
        selectedItem = ( selectedItem + 1 ) % props.totalRailLength;
        clearTimeout( timeOut );
        timeOut = setTimeout( () => {
          setBBASelectedItem( selectedItem )
          setFocus( rightElementFocusKey )
        } )
        return false
      }
      if( direction === 'left' && sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ){
        let selectedItem = bbaSelectedItem
        selectedItem = ( selectedItem - 1 + props.totalRailLength ) % props.totalRailLength;
        clearTimeout( timeOut );
        timeOut = setTimeout( () => {
          setBBASelectedItem( selectedItem )
          setFocus( leftElementFocusKey )
        } )
        return false
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );
  const providerLogoList = useMemo( () => get( config, 'providerLogo' ), [config] )
  const providerImage = ( provider, layout ) => {
    if( isSubscritionModule ){
      return props.image
    }
    let imageUrl = '';
    if( provider ){
      if( provider === constants.ZEEFIVE ){
        const newProvider = PROVIDER_LIST.ZEE5
        const providerImages = providerLogoList && providerLogoList[newProvider.toUpperCase( )];
        imageUrl = providerImages ? providerImages[constants.LOGOCIRCULAR] : '';
      }
      else {
        const providerImages = providerLogoList && provider && providerLogoList[provider.toUpperCase( )];
        imageUrl = providerImages ? providerImages[constants.LOGOCIRCULAR] : '';
      }
    }
    return imageUrl
  };
  const MPItems = useMemo( () => ( {
    pageType: getSourceForMixPanel( window.location.pathname ),
    title: props.title,
    railPosition: props.railPosition,
    contentType: props.contentType,
    sectionSource: props.sectionSource,
    language: props.language?.join() || '',
    primaryLanguage: props.language?.[0] || '',
    genre: props.genre?.join() || '',
    primaryGenre: props.genre?.[0] || '',
    provider: props.providerName,
    contentPosition: props.contentPosition,
    contentTitle: props.contentTitle,
    releaseYear: props.releaseYear || '',
    actors: props.actors?.join() || '',
    appName:props.providerName,
    liveContent: props.liveContent,
    railTitle: props.railTitle,
    sectionType: props.sectionType,
    channelName: props.channelName,
    channelNumber: props.channelNumber,
    id: contentID
  } ), [
    props.title,
    props.railPosition,
    props.contentType,
    props.sectionSource,
    props.language,
    props.genre,
    props.providerName,
    props.contentPosition,
    props.contentTitle,
    props.partnerSubscriptionType,
    props.releaseYear,
    props.actors,
    props.providerName,
    props.liveContent,
    props.railTitle,
    props.sectionType,
    props.channelName,
    props.channelNumber,
    contentID,
    window.location.pathname
  ] );
  useEffect( () => {
    if( focused ){
      props?.showSynopsis?.( {
        title: props.title,
        contentId: props.contentID,
        image: props.image,
        providerName: props.providerName,
        complementarytitle: props.complementarytitle
      // Add other props needed for synopsisCard
      }

      );
    }
  }, [focused, isKeyReleased] );
  useEffect( () => {
    if( focused ){
      const obj = {
        contentId: props.contentID,
        image: props.image,
        providerName: props.providerName,
        complementarytitle: props.complementarytitle,
        previewPoster:props.previewPoster,
        secondaryText:props.secondary,
        isKeyReleased: isKeyReleased
      }
      setContentRailPositionData( obj )
      props.setRailFocusedCardInfo && props.setRailFocusedCardInfo( MPItems );
      if( isKeyReleased ){
        homeDonglePageData.current = null
        homeDonglePageData.current = storeDongleResponseInContext;
      }
    }
  }, [focused, isKeyReleased] );
  useEffect( ()=>{
    if( bbaContents?.bbaInitCount && focused && window.location.pathname.includes( PAGE_TYPE.HOME ) ){
      setTimeout( ()=> setFocus( centerElementFocusKey ) )
      setBbaContents( { ...bbaContents, bbaInitCount: false } )
      bbaContentListId.current = 'BUTTON_FOCUS_0'
    }
  }, [focused] )

  useEffect( ()=> {

    return () => {
      clearTimeout( timeOut );
    }
  }, [] )


  useEffect( ()=> {
    if( props?.selectedProvider && sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS && isKeyReleased ){
      clearTimeout( timeOut );
      timeOut = setTimeout( () => setBbaContents( {
        ...bbaContents,
        bbaContent: bbaProviderContent,
        bbaDetailUrl: {
          provider:  bbaProviderContent?.provider,
          pageType: bbaProviderContent?.pageType,
          data: railData
        },
        bbarailId: railId,
        centerElementFocusKeyId: centerElementFocusKey
      } ), 230 );

      /* Mixpanel-event */
      viewAppContent( bbaProviderContent?.provider );
    }

  }, [props.selectedProvider, isKeyReleased] )
  const storeDongleResponseInContext = useMemo( () => {
    const {
      title,
      releaseYear: year,
      genre,
      providerName: provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      metaDetails,
      tagInfoDTO,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      image,
      contentType,
      contractName,
      imageCardSize: cardSize,
      layoutTypeForMixPanel: layoutType
    } = props;

    return {
      title,
      genre,
      provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      previewPoster,
      secondaryText,
      id:contentID,
      contractName,
      cardSize,
      layoutType
    };
  }, [
    props.title,
    props.genre,
    props.duration,
    props.providerName,
    props.partnerSubscriptionType,
    props.language,
    props.previewPoster,
    props.secondaryText,
    props.imageCardSize,
    props.layoutTypeForMixPanel,
    contentID
  ] );

  const onEnterPressCallBackFn = ()=> {
    setFromAppMediaCard( true )
    const nestedPrevBBSPageType = window.location.pathname.includes( '/discover' ) ? ( previousPathName.selectedDefaultPageType || PAGE_NAME.HOME ) : decodeURIComponent( window.location.pathname.split( '/' )[2] || '' )
    setMixpanelData( 'browsepagename', props.providerName )
    if( sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS && !props.selectedProvider ){
      setBBASelectedItem( props?.providerPosition );
    }
    else {
      setOptionBba( true )
      setMixpanelData( 'optionValue', 'NA' )
      setDistroMeta( {} )
      if( isDistroContent( props.providerName ) ){
        setDistroMeta( { ...getDistroMeta(), dai_session_id : DISTRO_CHANNEL.EVENTS.ff } )
        const data = getMetadataDistroTracking( DISTRO_CHANNEL.EVENTS.ff )
        trackDistroEvent( { url: getDistroEventTrackURL( data ) } )
      }

      catalogPage.appRailData = null
      setContentInfo( {} )
      previousPathName.discoverToHome = false
      const obj = {
        contentPosition: props.contentPosition,
        railPosition: props.railPosition,
        sectionType: props.sectionType,
        contentType: props.contentType,
        sectionSource: props.sectionSource,
        railTitle: props.railTitle,
        configType: props.configType,
        autoPlayed: isAutoPlayed,
        railId: props.railId,
        contentId: contentID,
        conetentTitle: props.title,
        previewPoster:props.previewPoster,
        secondaryText:props.secondaryText
      }
      setSelectedPartner( props.providerName?.toUpperCase() )
      setContentRailPositionData( obj )
      const railUniqId = Number( `${props.railId}${contentID}` )
      setTotalrailsList( Math.ceil( totalRails / 10 ) * 10 )
      setLastRailTitle( props.railTitle )
      railsRestoreId.current = railUniqId;
      const pathName = `/browse-by-app/${props.bbaRail ? props.providerName : props.title}/${props.pageType ? props.pageType : constants.ERROR}/${null }`;
      history.push( {
        pathname: pathName,
        args: {
          bbaOpen: MIXPANELCONFIG.VALUE.LOGO_CLICK
        },
        state: true
      } )
    }
  }

  const imagePath = useMemo( () => {
    if( props.bbaRail ){
      return getProviderLogo( providerLogoList, props.providerName, constants.LOGOPROVIDERBBA, url );
    }
    else {
      return `${cloudinaryCarousalUrl( LAYOUT_TYPE.CIRCULAR, url )}/${providerImage( props.title )}`;
    }
  }, [
    props.bbaRail,
    providerLogoList,
    props.providerName,
    props.title
  ] );

  return (
    <div className='AppMediaCard'>
      <div className={
        classNames( 'AppMediaCard__content',
          { 'AppMediaCard--withFocus': sectionSource === SECTION_SOURCE.PROVIDER_BROWSE_APPS ? props?.selectedProvider && focused : focused },
          { 'AppMediaCard--withoutFocus' : props?.bbaRail && props?.selectedProvider && !focused }
        ) }
      ref={ ref }
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseUp={ onEnterPressCallBackFn }
      >
        <Link secondary={ true }>
          <Image
            src={ imagePath }
            alt={ props.title }
          />
          { complementarytitle &&
          <Text
            textAlign='center'
            textStyle='complimentary-apps-text'
          >
            { complementarytitle }
          </Text> }
        </Link>
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} image - This is the media Image
 * @property {string} title - This is the alternate of media card
 * @property {bool} isFocussed - If media card is focussed or not
 * @property {string} url - redirection url
 * @property {string} previewPoster - This is the previewPoster Image
 * @property {string} secondaryText - This is the secondaryText of media card
 *
 */
export const propTypes =  {
  image: PropTypes.string,
  title: PropTypes.string,
  isFocussed: PropTypes.bool,
  url: PropTypes.string,
  secondaryText:PropTypes.string,
  previewPoster:PropTypes.string
};

AppMediaCard.propTypes = propTypes;

export default AppMediaCard;
