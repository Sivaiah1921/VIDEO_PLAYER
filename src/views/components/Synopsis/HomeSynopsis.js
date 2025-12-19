/* eslint-disable no-console */
/**
 * This component will provide the content info on focus
 *
 * @module views/components/Synopsis
 * @memberof -Common
 */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Synopsis.scss';
import PItitle from '../PITitle/PITitle';
import PiDetailsDescription from '../PiDetailsDescription/PiDetailsDescription';
import { getContentDetailsSynopsis } from '../../../utils/slayer/PlaybackInfoService';
import { countLine } from '../../../utils/util';
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import classNames from 'classnames';
import { CARD_SIZE, isExcludedRail, LAYOUT_TYPE } from '../../../utils/constants';
/**
 * Represents a HomeSynopsis component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns HomeSynopsis
 */
export const HomeSynopsis = function( props ){
  const { homeDonglePageData } = useMaintainPageState() || null
  const { metaData, config } = props
  const [isCountLine, setCountLine] = useState( false );
  /* Commented due to TPSLS-925 */
  // const [reduceSynopsis, setReduceSynopsis] = useState( false )
  const { url } = useAppContext()

  useEffect( () => {
    const elm = document.querySelector( '.PiDetailsDescription__content > p' );
    if( elm ){
      countLine( elm, setCountLine );
    }

  }, [metaData] );
  /* Commented due to TPSLS-925 */
  // useEffect( ()=>{
  //   if( homeDonglePageData?.current?.layoutType === LAYOUT_TYPE.PORTRAIT && homeDonglePageData?.current?.cardSize === CARD_SIZE.LARGE ){
  //     setReduceSynopsis( true )
  //   }
  //   else {
  //     setReduceSynopsis( false )
  //   }
  // }, [homeDonglePageData?.current?.layoutType, homeDonglePageData?.current?.cardSize] )

  const renderSencondaryText = useMemo( () => {
    return ['BROWSE_BY_CHANNEL', 'BROWSE_BY_SPORTS', 'LANGUAGE', 'PROVIDER', 'GENRE'].includes( homeDonglePageData.current?.sectionSource )
  }, [homeDonglePageData.current] )

  return (
    homeDonglePageData.current ? (
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className={ classNames( 'Synopsis',
          // { 'Synopsis__large_portrait' : reduceSynopsis }
        ) }
        >
          <div className='Synopsis__header'>
            <div className='Synopsis__title'>
              <PItitle
                fromPlaybackInfo={ false }
                showExpiredText={ false }
                newRailSectionSource={ props.newRailSectionSource }
                contractName={ homeDonglePageData && homeDonglePageData.current && homeDonglePageData.current.contractName }
                { ...getContentDetailsSynopsis( metaData, config, homeDonglePageData && homeDonglePageData.current ? homeDonglePageData.current : null, url ) }
              />

            </div>
            <div className='Synopsis__description'>
              <PiDetailsDescription
                fromPlaybackInfo={ false }
                description={ homeDonglePageData.current?.description || metaData?.description }
                renderSencondaryText={ renderSencondaryText }
                { ...getContentDetailsSynopsis( metaData, config, homeDonglePageData && homeDonglePageData.current ? homeDonglePageData.current : null, url ) }
              />
            </div>
          </div>
        </div>
      </FocusContext.Provider>
    ) : (
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='Synopsis'></div>
      </FocusContext.Provider>
    )
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {object} metaData - provides the content info
 * @property {object} config - provides the App config into
 */
export const propTypes =  {
  metaData: PropTypes.object,
  config: PropTypes.object
};


HomeSynopsis.propTypes = propTypes;

export default HomeSynopsis;
