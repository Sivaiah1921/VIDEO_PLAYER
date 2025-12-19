/* eslint-disable no-console */
/**
 * PITitle card molecule
 *
 * @module views/components/PITitle
 * @memberof -Common
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Image from '../Image/Image';
import './PITitle.scss';
import './PiTitleHome.scss';
import Icon from '../Icon/Icon';
import { cloudinaryCarousalUrl, convertNumberToHHMM, isCrownNew, millisToMinutes, timeDifferenceCalculate } from '../../../utils/util';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import constants, { LAYOUT_TYPE, CONTENT_TYPE, SECTION_SOURCE, PROVIDER_LIST } from '../../../utils/constants';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { HomeService } from '../../../utils/slayer/HomeService';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';


/**
  * Represents a PITitle component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns PITitle
  */

const PITitle = ( props ) => {
  const [showAll, setShowAll] = useState( false );

  const { cardTitle, durationLive, iconUrl, year, time, category, ageLimit, partnerSubscriptionType, provider, contractName, language, languagesGenres, metaDetails, contentNativeName, previewPoster, secondaryText, showExpiredText, contentType, descriptionLive, freeEpisodesAvailable, id, showLiveUI, newRailSectionSource } = props;
  const [data, tvodData] = HomeService( { pageData: '', pagetype: '', skip: true } );
  const { tvodFetchData, tvodResponse } = tvodData
  const previousPathName = useNavigationContext()
  const { isCWWatchingRailContentRef, homeDonglePageData, donglePageData } = useMaintainPageState()
  const responseSubscription = useSubscriptionContext( );
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const { configResponse, url } = useAppContext();
  const { parentContentType } = useParams();
  const { config } = configResponse;

  const type = useMemo( () => {
    return parentContentType || contentType
  }, [parentContentType, contentType] );

  useEffect( ()=>{
    contractName === constants.CONTRACT_NAME && showExpiredText && tvodFetchData()
  }, [contractName, showExpiredText] )

  useEffect( ()=>{
    const response = tvodResponse && tvodResponse.data ? tvodResponse.data.items : []
    if( response.length > 0 ){
      const info = response.find( ( data )=> parseInt( data.id, 10 ) === parseInt( id, 10 ) )
      previousPathName.rentalExpiryTime = info && Object.keys( info ).length ? info.rentalExpiry : ''
    }
  }, [tvodResponse] )


  const getLanguageOfContent = useCallback( ( language ) => {
    if( !Array.isArray( language ) || language.length === 0 ){
      return null;
    }

    const filtered = language.filter( item => item !== '' );

    if( filtered.length === 1 ){
      return filtered[0]; // Show full name
    }

    const visible = filtered.slice( 0, 3 ).map( lang => lang.slice( 0, 3 ) );
    const remainingCount = filtered.length - 3;

    return remainingCount > 0 ?
    `${visible.join( ', ' )} +${remainingCount} more` :
      visible.join( ', ' );
  }, [] );
  return (
    <>
      {
        props?.fromPlaybackInfo ? (
          <>
            <div
              className='piTitleCard'
            >
              <div
                className={
                  classNames( 'piTitleCard__leftPanel',
                    { 'piTitleCard__leftPanel--live': isLiveContentType( type ) && showLiveUI } )
                }
              >
                {
                  isLiveContentType( type ) && showLiveUI ? (
                    <Image
                      src={ `${cloudinaryCarousalUrl( LAYOUT_TYPE.CIRCULAR, url, '' )}/${iconUrl}` }
                      height={ 80 }
                      width={ 80 }
                    />
                  ) : (
                    <Image
                      src={ iconUrl }
                      height={ 54 }
                      width={ 54 }
                    />
                  ) }

              </div>
              <div className={ classNames( 'piTitleCard__rightPanel', { 'piTitleCard__rightPanel--live': isLiveContentType( type ) && showLiveUI } ) } >
                <div className={
                  classNames( 'piTitleCard__rightPanel__rightTopPanel',
                    { 'piTitleCard__rightPanel__rightTopPanelLive': isLiveContentType( type ) && showLiveUI,
                      'piTitleCard__rightPanel__rightTopPanel__homePageTopPanel' : window.location.pathname.includes( '/discover' )
                    } )
                }
                >
                  {
                    isLiveContentType( type ) && showLiveUI ? (
                      <>
                        <Text
                          textStyle='pi-title'
                          color='white'
                          htmlTag='span'
                        >
                          { cardTitle || '\u00A0' }
                        </Text>
                      </>
                    ) : (
                      <Text
                        textStyle='pi-title'
                        color='white'
                      >
                        { cardTitle || '\u00A0' }
                      </Text>
                    ) }
                </div>
                <div className='piTitleCard__rightPanel__rightBottomPanel'>
                  {
                    isLiveContentType( type ) && showLiveUI ? (
                      <div className='piTitleCard__rightPanel__description'>
                        <div className='PlaybackInfo__liveContent'>
                          <div className='PlaybackInfo__liveCircle' />
                          <Text color='white'>{ constants.LIVE }</Text>
                        </div>
                        { provider?.toLowerCase() !== PROVIDER_LIST.TIMESPLAY &&
                        <Text
                          htmlTag='span'
                          color='white'
                        >
                          { `\u00A0\u00A0${durationLive}` || '\u00A0' }
                        </Text>
                        }
                      </div>
                    ) : (
                      <>
                        {
                          // provider && isCrown( props.status, props.isLowerPlan, props.nonSubscribedPartnerList, provider, partnerSubscriptionType, contractName, contentType, freeEpisodesAvailable ) && (
                          provider && isCrownNew( myPlanProps, props, config?.enableCrown ) && (
                            <div className='piTitleCard__rightPanel__crown'>
                              <Icon
                                name='CrownWithBG'
                              />
                            </div>
                          )
                        }


                        {
                          year && Boolean( Number( year ) ) && (
                            <div className={
                              classNames( '',
                                { 'piTitleCard__showYearOrLanguage' : Boolean( time ) } )
                            }
                            >
                              <Text textStyle='year-category'
                                color='white'
                              >{ year } </Text>
                            </div>
                          )
                        }
                        { newRailSectionSource !== SECTION_SOURCE.WATCHLIST && (
                          ( !Number( year ) ) && Array.isArray( language ) && language.filter( item => item !== '' )?.length > 0 && (
                            <div className={
                              classNames( '',
                                { 'piTitleCard__showYearOrLanguage' : Boolean( time ) } )
                            }
                            >
                              <Text textStyle='year-category'
                                color='white'
                              >{ getLanguageOfContent( language.filter( item => item !== '' ) ) || [] } </Text>
                            </div>
                          )
                        )
                        }
                        {
                          (
                            isCWWatchingRailContentRef.current ||
                    newRailSectionSource === 'EPISODE_RAIL' ||
                    props.contentType === CONTENT_TYPE.MOVIES ||
                    props.contentType === CONTENT_TYPE.WEB_SHORTS
                          ) && Boolean( time ) ? (
                              (
                                <div className='piTitleCard__rightPanel__rightBottomPanel__time'>
                                  <Text textStyle='year-category'
                                    color='white'
                                  >
                                    { `${contractName === 'RENTAL' && window.location.pathname.includes( '/discover' ) ? `${millisToMinutes( time )}` : convertNumberToHHMM( time )}` }
                                  </Text>
                                </div>
                              )
                            ) : ( ( ( props.contentType === CONTENT_TYPE.TV_SHOWS ||
                        props.contentType === CONTENT_TYPE.BRAND ||
                        props.contentType === CONTENT_TYPE.SERIES ) &&
                        props.seasonList?.length > 0 &&
                        ( <div className='piTitleCard__rightPanel__rightBottomPanel__time'>
                          <Text textStyle='year-category'
                            color='white'
                          >
                            {
                              props.seasonList.length === 1 ?
                                '1 Season' :
                                  `${props.seasonList.length} Seasons`
                            }
                          </Text>
                        </div>
                        ) ) )
                        }
                        <div className={ classNames( '', {
                          'piTitleCard__rightPanel__rightBottomPanel__categories--nobar': newRailSectionSource === SECTION_SOURCE.WATCHLIST,
                          'piTitleCard__rightPanel__rightBottomPanel__categories': category?.length > 0,
                          'piTitleCard__rightPanel__rightBottomPanel__no-age-with-category': !ageLimit
                        } ) }
                        >
                          <Text textStyle='year-category'
                            color='white'
                          >
                            { category?.map( ( el, idx ) => (
                              <Text
                                key={ idx }
                                htmlTag='span'
                                textStyle='year-category'
                              >
                                { idx ? ', ' + el : el }
                              </Text>
                            ) )
                            }
                          </Text>
                        </div>

                        {
                          ageLimit &&
                          <div className='piTitleCard__rightPanel__rightBottomPanel__ageLimit'>
                            <Text textStyle='age-limit'
                              color='white'
                            >
                              { ageLimit }
                            </Text>
                          </div>
                        }
                      </>
                    ) }
                </div>
                {
                  contractName === 'RENTAL' && previousPathName.rentalExpiryTime && showExpiredText && (
                    <div className='piTitleCard__rightPanel__expiry'>
                      <Text textStyle='planCard-subtitle'
                        textAlign='center'
                        htmlTag='span'
                      >{ timeDifferenceCalculate( previousPathName.rentalExpiryTime ) && `Expires in ${timeDifferenceCalculate( previousPathName.rentalExpiryTime )}` }</Text>
                    </div>
                  )
                }
              </div>
            </div>
          </>
        ) : (
          <div
            className='piTitleCardHome'
          >
            <div
              className={
                classNames( 'piTitleCardHome__leftPanel',
                  { 'piTitleCardHome__leftPanel--live': isLiveContentType( type ) && showLiveUI } )
              }
            >
              {
                isLiveContentType( type ) && showLiveUI ? (
                  <Image
                    src={ `${cloudinaryCarousalUrl( LAYOUT_TYPE.CIRCULAR, url, '' )}/${iconUrl}` }
                    height={ 80 }
                    width={ 80 }
                  />
                ) : (
                  <Image
                    src={ iconUrl }
                    height={ 54 }
                    width={ 54 }
                  />
                ) }

            </div>
            <div className={ classNames( 'piTitleCardHome__rightPanel', { 'piTitleCardHome__rightPanel--live': isLiveContentType( type ) && showLiveUI } ) } >
              <div className={
                classNames( 'piTitleCardHome__rightPanel__rightTopPanel',
                  { 'piTitleCardHome__rightPanel__rightTopPanelLive': isLiveContentType( type ) && showLiveUI,
                    'piTitleCardHome__rightPanel__rightTopPanel__homePageTopPanel' : window.location.pathname.includes( '/discover' )
                  } )
              }
              >
                {
                  isLiveContentType( type ) && showLiveUI ? (
                    <>
                      <Text
                        textStyle='pi-title'
                        color='white'
                        htmlTag='span'
                      >
                        { cardTitle || '\u00A0' }
                      </Text>
                    </>
                  ) : (
                    <Text textStyle='pi-title'
                      color='white'
                    >
                      { ( homeDonglePageData.current?.sectionSource || donglePageData.current?.sectionSource ) === 'LANGUAGE' ?
        `${contentNativeName || ''}${contentNativeName && cardTitle ? ' | ' : ''}${cardTitle || ''}` :
                        ( contentNativeName || cardTitle )
                      }
                    </Text>
                  ) }
              </div>
              { ( () => {
                const isLive = isLiveContentType( type );
                const hasLanguage = Boolean( getLanguageOfContent( language ) );
                const hasGenres = Boolean( languagesGenres );
                const hasMetadata = Boolean( metaDetails );
                const hasAgeLimit = Boolean( ageLimit ) &&
    !['BROWSE_BY_CHANNEL', 'BROWSE_BY_SPORTS', 'LANGUAGE', 'BINGE_CHANNEL', 'PROVIDER', 'GENRE', 'DARSHAN_CHANNEL']
      .includes( homeDonglePageData.current?.sectionSource );
                const showCrown = Boolean( provider && isCrownNew( myPlanProps, props, config?.enableCrown ) );

                const shouldRender =
    ( isLive && ( hasLanguage || hasMetadata || hasAgeLimit ) ) ||
    ( !isLive && ( hasGenres || hasMetadata || hasAgeLimit || showCrown ) );

                if( !shouldRender ){
                  return null;
                }

                return (
                  <div className='piTitleCardHome__rightPanel__rightBottomPanel'>
                    { isLive && showLiveUI ? (
                      <div className='piTitleCardHome__rightPanel__description'>
                        <div className='PlaybackInfo__liveContent'>
                          <div className='PlaybackInfo__liveCircle' />
                          <Text color='white'>{ constants.LIVE }</Text>
                        </div>
                        <Text htmlTag='span'
                          color='white'
                        >
                          { `\u00A0\u00A0${durationLive}` || '\u00A0' }
                        </Text>
                      </div>
                    ) : (
                      <>
                        { /* Metadata Row */ }
                        <div className='piTitleCardHome__metadataRow'>
                          { showCrown && (
                            <div className='piTitleCardHome__rightPanel__crown'>
                              <Icon name='CrownWithBG' />
                            </div>
                          ) }
                          { /* { year && Number( year ) && (
                  <Text textStyle='year-category'
                    color='white'
                  >
                    { year }
                  </Text>
                ) } */ }
                          { /*
                { contentType && (
                  <Text textStyle='year-category'
                    color='white'
                  >
                    { contentType }
                  </Text>
                ) } */ }
                          { /* Time or Season Count */ }
                          { /* { ( isCWWatchingRailContentRef.current || newRailSectionSource === 'EPISODE_RAIL' || props.contentType === CONTENT_TYPE.MOVIES || props.contentType === CONTENT_TYPE.WEB_SHORTS ) && time ? (
                  <Text textStyle='year-category'
                    color='white'
                  >
                    { contractName === 'RENTAL' && window.location.pathname.includes( '/discover' ) ? millisToMinutes( time ) : convertNumberToHHMM( time ) }
                  </Text>
                ) : (
                  props.contentType === CONTENT_TYPE.TV_SHOWS && props.seasonList?.length > 0 && (
                    <Text textStyle='year-category'
                      color='white'
                    >
                      { props.seasonList.length === 1 ? '1 Season' : `${props.seasonList.length} Seasons` }    </Text>
                  )
                ) } */ }
                          { metaDetails && (
                            <Text textStyle='year-category'
                              color='white'
                            >
                              { metaDetails }
                            </Text>
                          ) }

                          { hasAgeLimit && (
                            <div className={ `piTitleCardHome__rightPanel__rightBottomPanel__ageLimit ${ !metaDetails ? 'piTitleCardHome__rightPanel__rightBottomPanel__ageLimit--noBullet' : '' }` } >
                              <Text textStyle='age-limit'
                                color='white'
                              >
                                { ageLimit }
                              </Text>
                            </div>
                          ) }
                        </div>

                        { /* Language / Genres Block */ }
                        <div className='piTitleCardHome__rightPanel__rightBottomPanel__genresBlock'>
                          { ( hasGenres || hasLanguage ) && (
                            <Text textStyle='year-category'
                              color='white'
                            >
                              { hasGenres ? languagesGenres :
                                getLanguageOfContent( language ) }
                            </Text>
                          )
                          }
                        </div>
                      </>
                    ) }
                  </div>
                );
              } )() }

              {
                contractName === 'RENTAL' && previousPathName.rentalExpiryTime && showExpiredText && (
                  <div className='piTitleCardHome__rightPanel__expiry'>
                    <Text textStyle='planCard-subtitle'
                      textAlign='center'
                      htmlTag='span'
                    >{ timeDifferenceCalculate( previousPathName.rentalExpiryTime ) && `Expires in ${timeDifferenceCalculate( previousPathName.rentalExpiryTime )}` }</Text>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </>
  );
};

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} cardTitle - PITitle card title
  * @property {string} iconUrl - PITitle card iconUrl
  * @property {string} year - PITitle card year
  * @property {string} time - PITitle card time
  * @property {array} category - PITitle card category
  * @property {string} ageLimit - PITitle card ageLimit
  * @property {string} partnerSubscriptionType - PITitle card partnerSubscriptionType
  */
export const propTypes = {
  cardTitle: PropTypes.string.isRequired,
  iconUrl: PropTypes.string.isRequired,
  year: PropTypes.string,
  time: PropTypes.any,
  category: PropTypes.array,
  ageLimit: PropTypes.string,
  partnerSubscriptionType: PropTypes.string,
  provider: PropTypes.string
};

PITitle.propTypes = propTypes;

export default PITitle;
