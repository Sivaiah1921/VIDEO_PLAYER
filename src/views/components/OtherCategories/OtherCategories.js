/* eslint-disable no-console */
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import constants, { LAYOUT_TYPE } from '../../../utils/constants';
import { OtherCategoryService } from '../../../utils/slayer/OtherCategoryService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import Icon from '../Icon/Icon';
import MediaCard from '../MediaCard/MediaCard';
import './OtherCategories.scss';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { cloudinaryCarousalUrl } from '../../../utils/util';
import { categorySelected } from '../../../utils/mixpanel/mixpanelService';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';

export const railsDataposition = []

export const OtherCategories = () => {
  const { setCustomPageType } = useHomeContext()
  const { url } = useAppContext();
  const previousPathName = useNavigationContext()
  const [categories, setCategories] = useState( [] );
  const history = useHistory();
  const refSrcoll = useRef( null )
  const [fetchCategories] = OtherCategoryService();
  const { fetchData, response, error, loading } = fetchCategories;
  const { ref, focusKey } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true
  } );

  useEffect( () => {
    previousPathName.current = 'other-categories'
    previousPathName.navigationRouting = 'other-categories'
    setCustomPageType( '' )
    if( !loading && !isLoader ){
      setTimeout( ()=>{
        if( document?.querySelector( '.LeftNavContainer__expanded' ) === null ){
          previousPathName.restoreCardId === null ? setFocus( 'BUTTON_FOCUS_0' ) : setFocus( `BUTTON_FOCUS_${previousPathName.restoreCardId}` )
          previousPathName.restoreCardId = null
        }
      }, 200 )
    }
  }, [loading] )

  useEffect( () => {
    if( response?.data ){
      if( response.data?.items && response.data?.items.length > 0 ){
        setCategories( response.data.items );
      }
      else {
        setCategories( [] );
      }
    }
  }, [response] );

  const onRailFocus = useCallback( ( { y, ...rest }, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${index}`
    railsDataposition.push( rest.top )
    const minPosition = Math.min( ...railsDataposition )
    if( refSrcoll.current ){
      refSrcoll.current.scrollTop = rest.top === minPosition ? y : rest.top - refSrcoll.current.clientHeight + 560
    }
  }, [refSrcoll] );


  const openDiscoveredCategory = ( episodePageType, pageName, indexOfCard ) => {
    categorySelected( pageName )
    previousPathName.showExitPopop = false
    setCustomPageType( episodePageType )
    previousPathName.navigationSubRouting = true
    previousPathName.restoreCardId = indexOfCard
    history.push( {
      pathname: `/discover/${episodePageType}`
    } )
    previousPathName.dongeAPI = episodePageType
  }
  const onMouseEnterCallBackFn = ( id )=>{
    setFocus( `BUTTON_FOCUS_${id}` )
  }

  return (
    <div className='OtherCategories'
      ref={ ref }
    >
      <div
        id='scrollContainer'
        className='OtherCategories__scrollContainer'
        ref={ refSrcoll }
      >
        <InfiniteScroll
          dataLength={ Array.isArray( categories ) && categories.length > 0 ? categories.length : 0 }
          scrollableTarget='scrollContainer'
        >
          <div className='OtherCategories__Header'>
            <FocusContext.Provider value={ focusKey }>
              <div className='OtherCategories__topHeader'>
                <Icon
                  classNames='OtherCategories__topHeaderRight'
                  name={ constants.MY_ACCOUNT.BINGE_LOGO }
                />
              </div>
              <div ref={ ref }>
                <div className='OtherCategories__listingOtherCategories'>
                  { categories?.length > 0 && categories?.map( ( episode, index ) => (
                    <MediaCard
                      key={ index }
                      image={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.LANDSCAPE, url ) }/${ episode.subPageImage }` }
                      type={ 'landscape' }
                      onFocus={ ( e )=>{
                        onRailFocus( e, index )
                      } }
                      tag={ episode.pageName }
                      callBackFn={ ()=> openDiscoveredCategory( episode.pageType, episode.pageName, index ) }
                      hideCrown={ true }
                      railTitle='Other-Categories'
                      cardTopIndexes={ index }
                      focusKeyRefrence={ `BUTTON_FOCUS_${index}` }
                      onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
                    />
                  ) ) }
                </div>
              </div>
            </FocusContext.Provider>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export const propTypes = {};

OtherCategories.propTypes = propTypes;
export default OtherCategories;