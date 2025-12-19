/**
 * This component will show hero banner to rail info
 *
 * @module views/components/HeroBannerDetailView
 * @memberof -Common
 */
let timeOut = null;
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './HeroBannerDetailView.scss';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import BannerComponent from '../BannerComponent/BannerComponent';
import { cloudinaryCarousalUrl, handleErrorMessage, modalDom, truncateWithThreeDots } from '../../../utils/util';
import constants, { LAYOUT_TYPE, SECTION_SOURCE } from '../../../utils/constants';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import PITitle from '../PITitle/PITitle';
import { getContentDetails, useHBRailInfo } from '../../../utils/slayer/PlaybackInfoService';
import { useParams } from 'react-router-dom';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import PiDetailsDescription from '../PiDetailsDescription/PiDetailsDescription';
import { ErrorPage } from '../ErrorPage/ErrorPage';
/**
 * Represents a HeroBannerDetailView component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns HeroBannerDetailView
 */
export const HeroBannerDetailView = function( props ){
  const [HBDetail, setHBDetail] = useState();
  const [response, setResponse] = useState( {} )
  const [focusedItem, setfocusedItem] = useState( {} )
  const [isError, setIsError] = useState( false );

  const { configResponse, url } = useAppContext();
  const { config } = configResponse;

  const { HBID } = useParams()
  const [HBRailObj] = useHBRailInfo( { id : HBID } )
  const { fetchHBRail, HBRailResponse, HBRailError, HBRailLoading } = HBRailObj
  const { focusKey, focusSelf } = useFocusable( {
    isFocusBoundary: true
  } )
  const { railsRestoreId } = useMaintainPageState()

  const urlInfo = `${ cloudinaryCarousalUrl( LAYOUT_TYPE.HERO_BANNER_SYNOPSIS, url ) }/${ HBDetail?.backgroundImage }`

  const onRailFocus = useCallback( ( { y, ...rest }, fkr ) => {
  }, [] );

  const handleFocus = ( id ) => {
    setfocusedItem( id )
  }

  useEffect( () =>{
    fetchHBRail()
  }, [] )

  useEffect( () =>{
    if( HBRailResponse && HBRailResponse.data ){
      setResponse( HBRailResponse.data )
      setIsError( false )
      setFocus( constants.HB_VIEW_ALL_PAGE_FOCUS )
      clearTimeout( timeOut );
      timeOut = setTimeout( () =>{
        if( railsRestoreId.heroBannerRail ){
          setFocus( `BUTTON_FOCUS_${ railsRestoreId.heroBannerRail }` )
          railsRestoreId.heroBannerRail = null
        }
        else {
          !modalDom() && focusSelf()
        }
      }, 200 )
    }
    else if( HBRailResponse && ( HBRailResponse.code !== 0 || HBRailError ) ){
      setIsError( true )
    }
  }, [HBRailResponse] )

  useEffect( ( ) => {
    if( focusedItem ){
      if( response && response.contentList?.length > 0 ){
        const result = response.contentList.find( ( item ) => item.id === focusedItem )
        setHBDetail( result )
      }
      else if( response && response.contentList?.length === 0 ){
        setIsError( true )
      }
    }
  }, [focusedItem, response] )

  useEffect( () => {
    return () => {
      clearTimeout( timeOut );
    }
  }, [] );

  return (
    <>
      {
        isError ? <ErrorPage error={ handleErrorMessage( HBRailError, HBRailResponse, constants.CONTENT_NOT_AVAILABLE ) } /> : (
          <div className='HeroBannerDetailView'>
            <div className='HeroBannerDetailView__Banner'>
              <BannerComponent
                bgImg={ urlInfo }
                alt='Background BannerComponent image'
                synopsisGradient={ true }
                imageGradient
              />
            </div>
            <div className='HeroBannerDetailView__topView'>
              <PITitle
                fromPlaybackInfo={ true }
                contractName={ HBDetail?.contractName }
                { ...getContentDetails( HBDetail, config, {}, url ) }
              />

              { HBDetail?.summary &&
              <div className='HeroBannerDetailView__description'>
                <PiDetailsDescription
                  fromPlaybackInfo={ true }
                  description1={ HBDetail?.summary }
                  description={ truncateWithThreeDots( HBDetail?.summary, 150, false ) }
                />
              </div>
              }
            </div>
            <div className='HeroBannerDetailView__rail' >
              <FocusContext.Provider value={ focusKey }>
                <MediaCarousel
                  railData={ {
                    id: response.id, title: response.title, contentList: response.contentList,
                    layoutType: response?.layoutType,
                    sectionSource: SECTION_SOURCE.HB_SEE_ALL,
                    imageMetadata: response?.imageMetadata || { cardSize: 'SMALL' }
                  } }
                  liveFocusCard={ ( liveId, providerName )=> {
                    handleFocus( liveId )
                  }
                  }
                  onFocus={ ( e ) => onRailFocus( e ) }
                  isHBAvailable={ true }
                />
              </FocusContext.Provider>
            </div>
          </div>
        ) }
    </>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};


HeroBannerDetailView.propTypes = propTypes;
export default HeroBannerDetailView;
