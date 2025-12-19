import React, { useEffect, useState } from 'react';
import './BingeListPage.scss';
import EmptyBingeList from '../EmptyBingeList/EmptyBingeList';
import BingeListWithData from '../BingeListWithData/BingeListWithData';
import { BingeListContentCall } from '../../../utils/slayer/BingeListService';
import Loader from '../Loader/Loader';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { getProfileId, getSubscriberId, getAuthToken, setContentRailPositionData, getContentRailPositionData } from '../../../utils/localStorageHelper';
import Notifications from '../Notifications/Notifications';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useHistory } from 'react-router-dom';
import { bingeList_view_faviourite } from '../../../utils/mixpanel/mixpanelService';
import constants from '../../../utils/constants';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import PlaybackInfo from '../PlaybackInfo/PlaybackInfo';
import { setMixpanelData } from '../../../utils/util';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';

export const BingeListPage = () => {
  const { bingeListFlag, isFav, setIsFav, setEditable } = useHomeContext()
  const { setIsLoginToggle } = useMaintainPageState()
  const { filterRailBingeList } = useContentFilter()
  const previousPathName = useNavigationContext();
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const [bingeRail, setBingeRail] = useState( '' )
  const [hasMore, setHasMore] = useState( true )
  const [pagingState, setPagingState] = useState( null )
  const [bingeListData] = BingeListContentCall( { pagingState } );
  const { bingeListFetchData, bingeListResponse, bingeListLoading } = bingeListData
  const [bingeList, setBingeList] = useState( [] );
  const [removedItems, setRemovedItems] = useState( 0 );
  const [showNotification, setShowNotification] = useState( false );
  const [fullPageLoader, setFullPageLoader] = useState( true );
  const [halfPageLoader, setHalfPageLoader] = useState( false );
  const [loadData, setLoadData] = useState( false );
  const [verbiage, setVerbiage] = useState( {} )
  const [refetchApi, setRefetchApi] = useState( false )
  const BackgroundImage = config?.welcomeScreen?.backgroundImage;
  const history = useHistory();


  useEffect( () => {
    if( !getAuthToken() ){
      previousPathName.hasAuthenticated = 'Guest User'
      setMixpanelData( 'loginEntry', constants.LOGIN_ENTRY.BINGE_LIST )
      setIsLoginToggle( true )
      history.replace( '/login' )
    }
    else {
      previousPathName.current = window.location.pathname;
    }
    /* MixPanel-Events */
    bingeList_view_faviourite()
  }, [] )

  useEffect( ()=>{
    if( getAuthToken() ){
      bingeListFetchData( )
    }
  }, [getAuthToken()] )

  useEffect( ()=>{
    setFullPageLoader( true )
    const obj = getContentRailPositionData()
    const cloneObj = { ...obj, railTitle: 'FAVOURITE', sectionSource: 'RAIL', railPosition: 0 }
    setContentRailPositionData( cloneObj )
    return ()=>{
      setEditable( false )
    }
  }, [] )

  useEffect( ()=>{
    if( bingeListResponse && bingeListResponse.data ){
      setVerbiage( { bingeListEmpty: bingeListResponse.data.bingeListEmpty, subHeader: bingeListResponse.data.subHeader, cta: bingeListResponse.data.cta } )
      setHasMore( bingeListResponse.data.continuePaging )
      bingeListResponse.data.continuePaging && setPagingState( bingeListResponse.data.pagingState )
      setTimeout( () => {
        setHalfPageLoader( false )
        setFullPageLoader( false )
      }, 2000 );
      setBingeRail( bingeListResponse.data.configType )
      loadData ? setBingeList( [...bingeList, ...bingeListResponse.data.list] ) : setBingeList( bingeListResponse.data.list )
    }
  }, [bingeListResponse] )

  const refetch = () => {
    setRefetchApi( true )
    setLoadData( false )
    setPagingState( null )
    const params = {
      'subscriberId': getSubscriberId(),
      'profileId': getProfileId(),
      'pagingState': null
    }
    bingeListFetchData( { params: params } );
    setShowNotification( true )
  }

  useEffect( ()=>{
    if( showNotification ){
      setTimeout( ()=> setShowNotification( false ), 3000 )
    }
  }, [showNotification] )

  const loadMore = () => {
    setLoadData( true )
    bingeListFetchData()
  }

  useEffect( () => {
    if( isFav ){
      const params = {
        'subscriberId': getSubscriberId(),
        'profileId': getProfileId(),
        'pagingState': null
      }
      setBingeList( [] )
      setLoadData( false )
      setPagingState( null )
      bingeListFetchData( { params: params } )
    }
  }, [isFav] )

  return (
    <>
      { fullPageLoader ? <Loader /> : (
        <div className={ !bingeListFlag ? 'showChild BingeListPage' : 'hideChild BingeListPage' } >
          {
            bingeList && Array.isArray( bingeList ) && ( filterRailBingeList( bingeList ).length > 0 ) && (
              <BingeListWithData refetch={ refetch }
                bingeList={ filterRailBingeList( bingeList ) }
                setRemovedItems={ setRemovedItems }
                hasMore={ hasMore }
                loadMore={ loadMore }
                bingeRail={ bingeRail }
                halfPageLoader={ halfPageLoader }
                setMediaCardLoader={ ()=> setHalfPageLoader( true ) }
                removedItems={ removedItems }
                refetchApi={ refetchApi }
              />
            )
          }
          {
            bingeList && Array.isArray( bingeList ) && filterRailBingeList( bingeList ).length === 0 && !bingeListLoading && (
              <EmptyBingeList
                bgImg={ BackgroundImage }
                alt='background BingeList image'
                content={ verbiage && Object.keys( verbiage ).length > 0 ? verbiage.subHeader : constants.BINGE_LIST_VERBIAGE.SUBHEADER }
                icon='BingeListInterset'
                title={ verbiage && Object.keys( verbiage ).length > 0 ? verbiage.bingeListEmpty : constants.BINGE_LIST_VERBIAGE.EMPTY }
                buttonLabel={ verbiage && Object.keys( verbiage ).length > 0 ? verbiage.cta : constants.BINGE_LIST_VERBIAGE.BUTTON_CTA }
              />
            )
          }
          { showNotification &&
          <div className='BingeListPage__notification'>
            <Notifications
              iconName='Success'
              message={ `${removedItems} ${ removedItems === 1 ? 'Item' : 'Items'} Removed Successfully` }
            />
          </div>
          }
        </div>
      ) }
      { bingeListFlag &&
      <div className={ bingeListFlag ? 'showChild' : 'hideChild' }>
        <PlaybackInfo />
      </div>
      }
    </>
  )
}

export const propTypes = {};

BingeListPage.propTypes = propTypes;
export default BingeListPage;