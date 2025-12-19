/* eslint-disable no-console */
/**
 * App Content section for the new BBA Rail
 *
 * @module views/components/AppMediaCardSection
 * @memberof -Common
 */
import React, { useMemo } from 'react';
import AppContentSection from '../AppContentSection/AppContentSection';
import ExploreMoreButtonSection from '../ExploreMoreButtonSection/ExploreMoreButtonSection';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { cloudinaryCarousalUrl } from '../../../utils/util';
import constants, { LAYOUT_TYPE } from '../../../utils/constants';
import HomeMediaCard from '../HomeMediaCard/HomeMediaCard';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';

/**
 * Represents a AppMediaCardSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppMediaCardSection
 */
export const AppMediaCardSection = ( props ) => {
  const { bbaContents: { bbaContent, bbaDetailUrl, bbarailId }, bbaRailRestoreId, bbaContentListId } = useMaintainPageState() || null

  const { ref, focusKey } = useFocusable( { } )
  const { url } = useAppContext();
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );


  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `BUTTON_FOCUS_${id}` )
  }

  const appContent = useMemo( () => bbaContent?.appContentList?.map( ( content, index )=>(
    <HomeMediaCard
      url={ `/content/detail/${ content.contentType }/${ content.id }` }
      key={ index }
      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
      image={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PORTRAIT, url ) }/${ content.image }` }
      type={ 'portrait' }
      focusKeyRefrence={ `BUTTON_FOCUS_${index}` }
      providerName={ content.provider }
      partnerSubscriptionType={ content.partnerSubscriptionType }
      contentType={ content.contentType }
      freeEpisodesAvailable={ content.freeEpisodesAvailable }
      contractName={ content.contractName }
      nonSubscribedPartnerList={ myPlanProps ? myPlanProps?.nonSubscribedPartnerList : [] }
      isLowerPlan={ myPlanProps && myPlanProps.isLowerPlan }
      status={ myPlanProps && myPlanProps.subscriptionStatus }
      isFromBBARail={ true }
      totalRailLength={ bbaContent?.appContentList?.length }
      cardIndexValue={ index }
      onFocus={ ()=>{
        bbaContentListId.current = `BUTTON_FOCUS_${index}`
      } }
      contentID={ content.id }
      providerContentId={ content.providerContentId }
      contentPosition={ index + 1 }
      railTitle={ constants.BROWSE_BY_APP }
      railId={ bbarailId }
      railType={ constants.BROWSE_BY_APP }
      railPosition={ props?.railPosition }
      sectionSource={ props?.sectionSource }
      sectionType={ props?.sectionType }
      configType={ props?.configType }
      placeHolder={ props?.placeHolder }
      genre={ content.genres }
      title={ content.title }
      language={ content.language }
    />
  )
  ), [bbaContent] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        ref={ ref }
        className='HomeMediaCarousel__appRailContent'
      >
        <div className='HomeMediaCarousel__appRailContent--content'>
          { bbaContent?.appContentList?.length > 0 && <AppContentSection appContent={ appContent }/> }
        </div>
        <div className='HomeMediaCarousel__appRailContent--button'>
          <ExploreMoreButtonSection
            appTitle={ bbaContent?.title }
            bbaDetailUrl={ bbaDetailUrl }
            bbaRailRestoreId={ bbaRailRestoreId }
            bbaContentListId={ bbaContentListId }
            bbarailId={ bbarailId }
          />
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default AppMediaCardSection;
