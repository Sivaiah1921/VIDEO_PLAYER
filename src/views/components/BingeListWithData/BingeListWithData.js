import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import constants, { LAYOUT_TYPE, MEDIA_CARD_TYPE } from '../../../utils/constants';
import MediaCard from '../MediaCard/MediaCard';
import { cloudinaryCarousalUrl, getProviderLogo, modalDom } from '../../../utils/util';
import get from 'lodash/get';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { BulkRemoveBingeListCall } from '../../../utils/slayer/BingeListService';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { bingeList_cancel, bingeList_delete_faviourite, bingeList_remove, bingeList_select } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import Loader from '../Loader/Loader';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { setBingeListPeopleProperties } from '../../../utils/mixpanel/mixpanel';
import classNames from 'classnames';
export const railsDataposition = []

const BingeListMediaContext = ( { bingeList, editable, bingeIds, onRailFocus, selectBingeItem, hasMore, loadMore, bingeRail } ) => {
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const providerLogoList = get( config, 'providerLogo' );
  const { ref, focusKey } = useFocusable( {
    onArrowPress:( direction )=>{
      if( direction === 'right' ){
        return false;
      }
    }
  } );

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `BUTTON_FOCUS_${id}` )
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <InfiniteScroll
        dataLength={ Array.isArray( bingeList ) && bingeList.length > 0 ? bingeList.length : 0 }
        scrollableTarget='scrollContainer'
        next={ loadMore }
        hasMore={ hasMore }
        scrollThreshold={ 1 }
      >
        <div id='scrollContainer'
          className={ classNames( 'BingeListPage__listingBingeList calculateWidth', { 'BingeListPage__listingBingeList--mediaCardEditable': editable } ) }
          ref={ ref }
        >
          { bingeList?.length > 0 && bingeList?.map( ( episode, index ) => {
            return (
              <MediaCard
                contentID={ episode.contentId }
                title={ episode.title }
                genre={ episode.subTitles }
                language={ episode.audioLanguage }
                mediaCardEditable={ bingeIds?.indexOf( episode.contentId ) >= 0 }
                editable={ editable }
                key={ index }
                provider={ `${getProviderLogo( providerLogoList, episode.provider, constants.LOGO_SQUARE, url )}` }
                image={ `${cloudinaryCarousalUrl( LAYOUT_TYPE.SEARCH_PAGE, url )}/${episode.image}` }
                type={ 'landscape' }
                onFocus={ ( e )=>{
                  onRailFocus( e, episode.contentId )
                } }
                callBackFn={ () => editable && selectBingeItem( episode.contentId, episode.contentType, episode.title, episode.subTitles, episode.provider ) }
                freeEpisodesAvailable={ episode.freeEpisodesAvailable }
                contractName={ episode.contractName }
                partnerSubscriptionType={ episode.partnerSubscriptionType }
                providerName={ episode.provider }
                contentType={ episode.contentType }
                focusKeyRefrence={ `BUTTON_FOCUS_${ episode.contentId }` }
                onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( episode.contentId ) }
                railTitle={ bingeRail }
                contentPosition={ index + 1 }
                railPosition={ 0 }
                mediaCardType={ MEDIA_CARD_TYPE.WATCHLIST }
                providerContentId={ episode.providerContentId }
              />
            )
          } ) }
        </div>
      </InfiniteScroll>
    </FocusContext.Provider>
  )
}

export const BingeListWithData = ( props ) => {
  const { bingeListFlag, setIsFav, editable, setEditable } = useHomeContext()
  const history = useHistory()
  const previousPathName = useNavigationContext()
  const { bingeList, refetch, setRemovedItems, hasMore, loadMore, bingeRail, setMediaCardLoader, halfPageLoader, removedItems, refetchApi } = props
  const [bingeIds, setBingeIDs] = useState( [] )
  const [payload, setPayload] = useState( [] )
  const refSrcoll = useRef( null )
  const [bulkRemoveBingeListData] = BulkRemoveBingeListCall( { contentIdAndType: payload } );
  const { bulkRemoveFetchData, bulkRemoveResponse } = bulkRemoveBingeListData
  const onRailFocus = useCallback( ( { y, ...rest }, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${index}`
    railsDataposition.push( rest.top )
    const minPosition = Math.min( ...railsDataposition )
    if( refSrcoll.current ){
      refSrcoll.current.scrollTop = rest.top === minPosition ? y : rest.top - refSrcoll.current.clientHeight + 600
    }
  }, [refSrcoll] );
  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } );

  useEffect( () => {
    if( !bingeListFlag && !modalDom() ){
      focusSelf()
    }
  }, [bingeListFlag] )

  useEffect( ()=>{
    if( bulkRemoveResponse && bulkRemoveResponse.code === 0 ){
      setBingeIDs( [] )
      bingeList_delete_faviourite( payload )
      refetch()
      setRemovedItems( bulkRemoveResponse.data.count )
      bingeList_remove( bulkRemoveResponse.data.count )
      setIsFav( true )
      setBingeListPeopleProperties( bulkRemoveResponse.data.totalBingeListCount )
    }
  }, [bulkRemoveResponse] )

  useEffect( ()=> {
    if( !halfPageLoader && refetchApi ){
      setFocus( 'BUTTON_BINGE_DONE' )
    }
  }, [halfPageLoader] )
  const selectBingeItem = ( id, type, title, genre, partner ) => {
    const uniqueData = [...new Set( bingeIds )];
    const currentIndex = uniqueData?.indexOf( id );
    const newChecked = [...uniqueData];
    const newPayload = [...payload];
    if( currentIndex === -1 ){
      newChecked.push( id )
      newPayload.push( {
        contentId: id,
        contentType: type,
        title: title,
        partnerName: partner,
        genre: genre
      } )
    }
    else {
      newChecked.splice( currentIndex, 1 )
      newPayload.splice( currentIndex, 1 )
    }
    setBingeIDs( newChecked )
    setPayload( newPayload )
  }

  return (
    <div
      id='scrollContainer'
      className='BingeListPage__scrollContainer'
      ref={ refSrcoll }
    >
      <div className='BingeListPage__Header'>
        <FocusContext.Provider value={ focusKey }>
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='BingeListPage__topHeader'>
              <Button
                onClick={ () => history.goBack() }
                iconLeftImage='GoBack'
                iconLeft={ true }
                secondary={ true }
                label={ constants.GOBACK }
              />
              <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
            </div>
          </FocusContext.Provider>
          <div ref={ ref }>
            <div className='BingeListPage__TopBanner'>
              <div className='BingeListPage__Container'>
                <Icon
                  className='BingeListPage__Logo'
                  name='BingeListInterset'
                />
                <div className='BingeListPage__title'>
                  <Text>{ constants.BINGE_LIST }</Text>
                </div>
              </div>
              <FocusContext.Provider value={ focusKey }>
                <div>
                  {
                    !editable ? (
                      <div>
                        <Button
                          onClick={ () => {
                            setBingeIDs( [] )
                            setEditable( true )
                            bingeList_select()
                          } }
                          className='BingeListPage__buttonEdit'
                          label={ constants.EDIT }
                          size='medium'
                          secondary
                          focusKeyRefrence='BUTTON_BINGE_EDIT'
                          onFocus={ ()=>previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_BINGE_EDIT' }
                        />
                      </div>
                    ) :
                      (
                        <div className='BingeListPage__checkedONE'>
                          { bingeIds.length > 0 ? (
                            <Button
                              onClick={ () => {
                                if( payload.length > 0 ){
                                  setMediaCardLoader()
                                  bulkRemoveFetchData( { contentIdAndType: payload } )
                                }
                              } }
                              className='BingeListPage__buttonRemove'
                              label={ constants.REMOVE }
                              size='medium'
                              secondary
                              focusKeyRefrence='BUTTON_BINGE_REMOVE'
                              onFocus={ ()=>previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_BINGE_REMOVE' }
                            />
                          ) : (
                            <FocusContext.Provider focusable={ false }
                              value=''
                            >
                              <Button
                                onClick={ () => {
                                  if( payload.length > 0 ){
                                    setMediaCardLoader()
                                    bulkRemoveFetchData( { contentIdAndType: payload } )
                                  }
                                } }
                                className='BingeListPage__buttonRemove'
                                label={ constants.REMOVE }
                                size='medium'
                                secondary
                              />
                            </FocusContext.Provider>
                          ) }
                          <Button
                            onClick={ () => {
                              setRemovedItems( 0 )
                              setBingeIDs( [] )
                              setPayload( [] )
                              setEditable( false )
                              Number( removedItems ) === 0 && bingeList_cancel()
                            } }
                            className='BingeListPage__buttonDone'
                            label={ constants.DONE }
                            size='medium'
                            secondary
                            focusKeyRefrence='BUTTON_BINGE_DONE'
                            onFocus={ ()=>previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_BINGE_DONE' }
                          />
                        </div>
                      )
                  }
                </div>
              </FocusContext.Provider>
            </div>
            {
              halfPageLoader ? <Loader /> : (
                <BingeListMediaContext bingeList={ bingeList }
                  editable={ editable }
                  bingeIds={ bingeIds }
                  onRailFocus={ onRailFocus }
                  selectBingeItem={ selectBingeItem }
                  hasMore={ hasMore }
                  loadMore={ loadMore }
                  bingeRail={ bingeRail }
                />
              ) }


          </div>
        </FocusContext.Provider>
      </div>
    </div>
  )
}

export const propTypes = {
  bingeList: PropTypes.array,
  refetch: PropTypes.func
};

BingeListWithData.propTypes = propTypes;
export default BingeListWithData;