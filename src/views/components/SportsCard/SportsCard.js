/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * Making a new card component for sports and other nested cards
 *
 * @module views/components/SportsCard
 * @memberof -Common
 */
import React, { useMemo, useEffect } from 'react';
import './SportsCard.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Image from '../Image/Image';
import Text from '../Text/Text';
import Link from '../Link/Link';
import { useHistory } from 'react-router-dom';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { setContentRailPositionData, setFromSportsMediaCard, setSelectedPartner } from '../../../utils/localStorageHelper';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { page_click, browse_page_click } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { setMixpanelData, getSourceForMixPanel, getMixpanelData } from '../../../utils/util';
import { constants, COMMON_HEADERS, SECTION_SOURCE, PROVIDER_LIST_NEW_HEIGHT, PARTNER_SUBSCRIPTION_TYPE, MIXPANEL_CONTENT_TYPE, PROVIDER_LIST_MORE_HEIGHT, PROVIDER_LIST, PAGE_NAME } from '../../../utils/constants';

/**
 * Represents a SportsCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SportsCard
 */
export const SportsCard = function( props ){
  const history = useHistory();
  const previousPathName = useNavigationContext()
  const { setContentInfo } = useHomeContext()
  const { setTotalrailsList, setLastRailTitle, railsRestoreId, railRestoreTitle, railCardTitle, setLastFocusFrom, lastFocusFrom, catalogPage, topPositionRailValueContext, setSubCatalogPagesInfo, optionBba, homeDonglePageData, donglePageData } = useMaintainPageState() || null
  const { image, title, onFocus, setHomeCaroselInfo, focusKeyRefrence, contentID, totalRails, sectionSource, railType, bannerColorCodeEnabled, isTitleEnabledLs, layoutTypeForMixPanel, imageCardSize, isKeyReleased, contentNativeName, secondaryText, previewPoster } = props;
  let timeOut;
  const { ref, focused } = useFocusable( {
    onFocus,
    onEnterPress: () => {
      onEnterPressCallBackFn()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false )
      const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
      if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) ){
        setHomeCaroselInfo && setHomeCaroselInfo( true );
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );
  const storeDongleResponseInContext = useMemo( () => {
    const {
      title,
      releaseYear: year,
      genre,
      duration,
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
      sectionSource,
      contentType,
      contractName,
      imageCardSize: cardSize,
      layoutTypeForMixPanel: layoutType
    } = props;

    return {
      title,
      year,
      genre,
      provider,
      partnerSubscriptionType,
      language,
      languagesGenres,
      metaDetails,
      tagInfoDTO,
      contentNativeName,
      previewPoster,
      secondaryText,
      description,
      sectionSource,
      image,
      contentType,
      id:contentID,
      contractName,
      cardSize,
      layoutType
    };
  }, [
    props.title,
    props.releaseYear,
    props.genre,
    props.duration,
    props.providerName,
    props.partnerSubscriptionType,
    props.language,
    props.languagesGenres,
    props.metaDetails,
    props.tagInfoDTO,
    props.contentNativeName,
    props.previewPoster,
    props.secondaryText,
    props.description,
    props.image,
    props.sectionSource,
    props.contentType,
    props.contractName,
    props.imageCardSize,
    props.layoutTypeForMixPanel,
    contentID
  ] );
  const onEnterPressCallBackFn = () => {
    setFromSportsMediaCard( true )
    catalogPage.appRailData = null
    setMixpanelData( 'railType', ( `${imageCardSize}-${layoutTypeForMixPanel}-${railType}` ) )
    setContentInfo( {} )
    const obj = {
      contentPosition: props.contentPosition,
      railPosition: props.railPosition,
      sectionType: props.sectionType,
      contentType: props.contentType,
      sectionSource: props.sectionSource,
      railTitle: props.railTitle,
      configType: props.configType,
      railId: props.railId,
      contentId: contentID,
      railType: railType,
      deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
      conetentTitle: props.title,
      contentNativeName:props.contentNativeName,
      previewPoster:props.previewPoster,
      secondaryText:props.secondaryText
    }
    setSelectedPartner( props.providerName?.toUpperCase() )
    setContentRailPositionData( obj )
    const railUniqId = Number( `${props.railId}${contentID}` )
    setTotalrailsList( Math.ceil( totalRails / 10 ) * 10 )
    setLastRailTitle( `${props.railId }_${ props.railTitle }` )
    railsRestoreId.current = railUniqId;
    railRestoreTitle.current = props.railTitle
    railCardTitle.current = title
    const nestedPrevBBSPageType = window.location.pathname.includes( '/discover' ) ? ( previousPathName.selectedDefaultPageType || PAGE_NAME.HOME ) : decodeURIComponent( window.location.pathname.split( '/' )[2] || '' )
    if( window.location.pathname.includes( props.pageType ) ){
      return
    }
    /* Mixpanel-event */
    page_click( props.title, obj, nestedPrevBBSPageType )
    browse_page_click( props.title, obj, nestedPrevBBSPageType, getMixpanelData( 'optionValue' ) )
    const pathName = `/browse-by-app/${ props.title}/${props.pageType ? props.pageType : constants.ERROR}/${railType}`;
    if( props?.catalogPageTitle && props?.catalogPageRailItems ){
      const catalogPageInfo = [{
        title : props?.catalogPageTitle,
        currentPageFocusKey : focusKeyRefrence,
        railItems: props?.catalogPageRailItems
      }]
      setSubCatalogPagesInfo( prevState => [...prevState, ...catalogPageInfo] );
    }
    history.push( {
      pathname: pathName,
      args: {
        bbaOpen: MIXPANELCONFIG.VALUE.LOGO_CLICK
      },
      state: true
    } )
  }
  const MPItems = useMemo( () => ( {
    // pageType: getSourceForMixPanel( window.location.pathname ),
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
    deviceType: COMMON_HEADERS.DEVICE_TYPE_MIXPANEL,
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
      const obj = {
        contentPosition: props.contentPosition,
        railPosition: props.railPosition,
        sectionType: props.sectionType,
        contentType: props.contentType,
        sectionSource: props.sectionSource,
        railTitle: props.railTitle,
        configType: props.configType,
        railId: props.railId,
        contentId: contentID,
        contentTitle: props.title,
        placeHolder: props.placeHolder,
        contentPartner: props.providerName,
        contentNativeName:props.contentNativeName,
        previewPoster:props.previewPoster,
        secondaryText:props.secondaryText,
        isKeyReleased: isKeyReleased
      }
      setContentRailPositionData( obj )
      props.setRailFocusedCardInfo && props.setRailFocusedCardInfo( MPItems );
      if( isKeyReleased ){
        homeDonglePageData.current = null
        homeDonglePageData.current = storeDongleResponseInContext;
        if( window.location.pathname.includes( '/browse-by-app/' ) ){
          donglePageData.current = storeDongleResponseInContext
        }
      }
    }
  }, [focused, isKeyReleased] );

  return (
    <div className={
      classNames( 'SportsCard',
        { 'SportsCard--withFocus': focused }
      ) }
    focused={ focused ? focused.toString() : undefined }
    ref={ ref }
    onMouseEnter={ props?.onMouseEnterCallBackFn }
    onMouseUp={ onEnterPressCallBackFn }
    >
      <Link>
        <div className={
          classNames(
            { 'SportsCard__TournamentImage':sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && railType !== constants.SPORTS },
            { 'SportsCard__SportsImage': sectionSource === SECTION_SOURCE.BROWSE_BY_SPORTS && railType === constants.SPORTS } ) }
        >
          <Image
            src={ image }
            alt={ title }
            notIntersect={ true }
          />
        </div>
        {
          railType !== constants.SPORTS && (
            <>
              { bannerColorCodeEnabled && (
                <div className='SportsCard__CardGradient' />
              ) }
              { isTitleEnabledLs && (
                <div className='SportsCard__CardTitle'>
                  <Text
                    color='white'
                    textAlign='center'
                    htmlTag='span'
                  >
                    { props.title }
                  </Text>
                </div>
              ) }
            </>
          )
        }
      </Link>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - language card title
 * @property {string} image - language card image src
 * @property {string} url - language card redirection url
 * @property {bool} isFocussed - language card is focusses
 * @property {string} contentNativeName - contentNativeName of the genre
 * @property {string} previewPoster - previewPoster of the genre
 * @property {string} secondaryText - secondaryText of the genre
 */
export const propTypes =  {
  title: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  isFocussed: PropTypes.bool,
  contentNativeName: PropTypes.string,
  secondaryText:PropTypes.secondaryText,
  previewPoster:PropTypes.previewPoster
};

SportsCard.propTypes = propTypes;
export default SportsCard;
