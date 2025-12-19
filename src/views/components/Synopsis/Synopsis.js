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
import { getContentDetailsSynopsis, getContentTitleSynopsis } from '../../../utils/slayer/PlaybackInfoService';
import { countLine } from '../../../utils/util';
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
/**
 * Represents a Synopsis component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Synopsis
 */
export const Synopsis = function( props ){
  const { donglePageData } = useMaintainPageState() || null
  const { metaData, config } = props
  const { url } = useAppContext()
  const [isCountLine, setCountLine] = useState( false );

  useEffect( () => {
    const elm = document.querySelector( '.PiDetailsDescription__content > p' );
    if( elm ){
      countLine( elm, setCountLine );
    }

  }, [metaData] );

  const renderSencondaryText = useMemo( () => {
    return ['BROWSE_BY_CHANNEL', 'BROWSE_BY_SPORTS', 'LANGUAGE', 'PROVIDER', 'GENRE', 'BINGE_CHANNEL'].includes( donglePageData.current?.sectionSource )
  }, [donglePageData.current] )

  return (
    donglePageData.current ? (
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='Synopsis'>
          <div className='Synopsis__header'>
            <div className='Synopsis__title'>
              <PItitle
                fromPlaybackInfo={ true }
                showExpiredText={ false }
                contractName={ donglePageData.current?.contractName }
                { ...getContentDetailsSynopsis( metaData, config, donglePageData.current, url ) }
              />

            </div>
            <div className='Synopsis__description'>
              <PiDetailsDescription
                fromPlaybackInfo={ false }
                description={ getContentTitleSynopsis && getContentTitleSynopsis( metaData, donglePageData.current ).description }
                { ...getContentDetailsSynopsis( metaData, config, donglePageData && donglePageData.current ? donglePageData.current : null, url ) }
                renderSencondaryText={ renderSencondaryText }
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


Synopsis.propTypes = propTypes;

export default Synopsis;
