/* eslint-disable no-console */
/**
 * Channel Content section for the Composite Rail
 *
 * @module views/components/ChannelMediaCardSection
 * @memberof -Common
 */
import React, { useCallback, useMemo, useRef } from 'react';
import { FocusContext, setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { cloudinaryCarousalUrl, contentDetailUrl, getProviderLogo, getRailComponentForChips } from '../../../utils/util';
import constants, { CARD_SIZE, CHANNEL_RAIL_TYPE, LAYOUT_TYPE, SECTION_SOURCE } from '../../../utils/constants';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import classNames from 'classnames';
import './ChannelMediaCardSection.scss'
import throttle from 'lodash/throttle';
import get from 'lodash/get';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';

/**
 * Represents a ChannelMediaCardSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ChannelMediaCardSection
 */
export const ChannelMediaCardSection = ( props ) => {
  const { railId, channelContent, currentBroadCasterIndexPosition, chipDataList, selectedChipIndex, section_src, sectionSource, railLayOutType, cardSize, setRailSectionSource, isKeyReleased, chipRailType, isTitleEnabledLs, bannerColorCodeEnabled, renderFrom, setShowSynopsis, focusKeyChip, setRailFocusedCardInfo } = props
  const channelRailRef = useRef( null );
  // const isNewChipRef = useRef( null );
  const { url, configResponse } = useAppContext();
  const { config } = configResponse;
  const responseSubscription = useSubscriptionContext( );
  const { filterChipRailList } = useContentFilter()

  const { ref, focusKey } = useFocusable( {
    focusKey: focusKeyChip
  } )

  const providerLogoList = useMemo( () => get( config, 'providerLogo', [] ), [config] );
  const RailComponent = useMemo( () => getRailComponentForChips( sectionSource, chipRailType, renderFrom ) || React.Fragment, [sectionSource, chipRailType, renderFrom] );

  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );

  const onMouseEnterCallBackFn = ( index ) => {
    setFocus( `BUTTON_FOCUS_${railId}_${index}` )
  }

  const scrollHorizontal = ( left ) => {
    if( channelRailRef.current ){
      try {
        channelRailRef.current.scrollTo( {
          left: left
        } )
      }
      catch ( e ){
        channelRailRef.current.scrollLeft = left;
      }
    }
  }

  // useEffect( () => {
  //   console.log( '#channelcontent', channelContent, selectedChipIndex )
  //   if( channelContent?.appContentList?.length > 0 ){
  //     isNewChipRef.current = true;
  //   }
  // }, [selectedChipIndex] );

  const onCardFocus =  useCallback( throttle( ( { x, ...rest }, contentInfoDetails ) => {
    if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL || ( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && chipRailType === CHANNEL_RAIL_TYPE.COMPOSITE ) ){
      setRailSectionSource( false )
      setTimeout( ()=>{
        setRailSectionSource( false )
      }, 10 )
    }

    if( channelRailRef.current ){
      if( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ){
        scrollHorizontal( rest.left - ( rest.width * 4 ) )
      }
      else if( railLayOutType === LAYOUT_TYPE.LANDSCAPE && cardSize === CARD_SIZE.LARGE ){
        scrollHorizontal( rest.left - ( ( rest.width - 380 ) * 4 ) );
      }
      else if( railLayOutType === LAYOUT_TYPE.PORTRAIT && cardSize === CARD_SIZE.SMALL ){
        scrollHorizontal( rest.left - ( ( rest.width * 4 ) + 10 ) );
      }
      else if( railLayOutType === LAYOUT_TYPE.TOP_PORTRAIT ){
        scrollHorizontal( rest.left - ( ( rest.width - 120 ) * 4 ) );
      }
      else {
        scrollHorizontal( rest.left - ( ( rest.width - 153 ) * 4 ) );
      }
    }
  }, isKeyReleased ? 0 : 500 ), [channelRailRef.current] )

  const appContent = useMemo( ()=> {
    const filterDeboardContentList = filterChipRailList( channelContent?.appContentList ) || [];
    const rendercontentList = chipRailType === CHANNEL_RAIL_TYPE.BINGE_TOP_10 ? filterDeboardContentList.slice( 0, 10 ) : filterDeboardContentList;
    // console.log( `[${( performance.now() / 1000 ).toFixed( 2 )} sec] #logSequence-3:`, rendercontentList );
    return rendercontentList?.map( ( content, index )=>(
      <div
        className={
          classNames( `ChipCardSection__${section_src}--${railLayOutType}--${cardSize}`,
          )
        }
        key={ `${channelContent.selectedContentId}_${content.id}` }
      >
        <RailComponent
          key={ content.id }
          position={ index + 1 }
          url={ contentDetailUrl( content, true ) }
          onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
          image={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PORTRAIT, url ) }/${ content.image }` }
          title={ content.seriesvrId ? content.seriesTitle : content.title }
          description={ content.seriesvrId ? content.seriesDescription : content.description }
          duration={ content.duration }
          language={ content.language || content.languages || content.audio || content.subTitles }
          genre={ content.genre || content.genres }
          releaseYear={ content.releaseYear }
          focusKeyRefrence={ `BUTTON_FOCUS_${railId}_${index}` }
          providerName={ content.provider }
          provider={ `${getProviderLogo( providerLogoList, content.provider, constants.LOGO_SQUARE, url )}` }
          partnerSubscriptionType={ content.partnerSubscriptionType }
          contentType={ content.contentType }
          freeEpisodesAvailable={ content.freeEpisodesAvailable }
          contractName={ content.contractName }
          nonSubscribedPartnerList={ myPlanProps?.nonSubscribedPartnerList ? myPlanProps.nonSubscribedPartnerList : [] }
          isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
          status={ myPlanProps && myPlanProps.subscriptionStatus }
          isFromChannelRail={ true }
          cardIndexValue={ index }
          onFocus={ ( e )=> onCardFocus( e, content ) }
          contentID={ content.id }
          contentTitle={ content.title }
          providerContentId={ content.providerContentId }
          channelLayoutType={ content.layoutType || LAYOUT_TYPE.LANDSCAPE }
          timeBlock={ content.duration || content.totalDuration }
          contentPosition={ index + 1 }
          railTitle={ props?.railTitle }
          railId={ railId }
          railType={ chipRailType }
          railPosition={ props?.railPosition }
          sectionSource={ props?.sectionSource }
          sectionType={ props?.sectionType }
          configType={ props?.configType }
          placeHolder={ props?.placeHolder }
          broadCasterTitle={ channelContent.title }
          broadCasterPosition={ currentBroadCasterIndexPosition }
          totalNoChannelCards={ channelContent?.appContentList?.length || 0 }
          currentChannelIndex={ index + 1 }
          chipDataList={ chipDataList }
          selectedChipIndex={ selectedChipIndex }
          isKeyReleased={ isKeyReleased }
          isChipTitleEnabledLs={ chipRailType === CHANNEL_RAIL_TYPE.TITLE ? isTitleEnabledLs : false }
          bannerColorCodeEnabled={ chipRailType === CHANNEL_RAIL_TYPE.TITLE ? bannerColorCodeEnabled : false }
          setShowSynopsis={ setShowSynopsis }
          chipName={ channelContent?.chipName }
          chipPosition={ channelContent?.indexPosition }
          totalRailLength={ rendercontentList?.length }
          setRailFocusedCardInfo={ setRailFocusedCardInfo }
          previewPoster={ content.previewPoster }
          secondaryText={ content.secondaryText }
          languagesGenres={ content.languagesGenres }
          metaDetails={ content.metaDetails }
          tagInfoDTO={ content.tagInfoDTO }
        />
      </div>
    ) )
  }, [channelContent, chipDataList, selectedChipIndex, railId] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }
        key={ channelContent?.chipId }
      >
        { channelContent?.appContentList?.length > 0 && (
          <div>
            <div
              className={
                classNames( `ChipCardSection__channelAppContent`,
                  { 'ChipCardSection__channelAppContent--bingTop10Contents': chipRailType === CHANNEL_RAIL_TYPE.BINGE_TOP_10 },
                )
              }
              ref={ channelRailRef }
            >
              { appContent }
            </div>
          </div>
        )
        }
      </div>
    </FocusContext.Provider>
  )
}

export default ChannelMediaCardSection;
