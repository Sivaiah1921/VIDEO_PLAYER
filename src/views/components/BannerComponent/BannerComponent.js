/* eslint-disable no-console */
/**
 * This component will show BannerComponent page
 *
 * @module views/components/BannerComponent
 * @memberof -Common
 */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './BannerComponent.scss';
import Image from '../Image/Image';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import PlayerComposer from '../Player/playerComposer';
import UseTimeout from '../../../utils/customHooks/UseTimeout';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { SECTION_SOURCE } from '../../../utils/constants';


/**
   * Represents a BannerComponent component
   *
   * @method
   * @param {object} props - React properties passed from composition
   * @returns BannerComponent
   */
export const BannerComponent = function( props ){
  const [playTrailor, setPlayTrailor] = useState( false );
  const { bgImg, alt, synopsisGradient, imageUrl, onFocus, playerProps, footerImage, imageGradient, notIntersect, isFocusOnEpisode, catalogPartner, liveContent, previewPoster = null, preimage = null, sectionSource, fromPiPage } = props;
  const { ref, focused } = useFocusable( { onFocus } );
  const { profileAPIResult } = useProfileContext();
  const { isExpandedMenu } = useHomeContext()
  const { autoPlaytrailerScreenSaver } = useMaintainPageState()

  const { startTimeout: startTrailorPlayback, stopTimeout: stopTrailorPlayback } = UseTimeout( () => {
    setPlayTrailor( profileAPIResult?.data?.autoPlayTrailer );
  }, 2000 );

  const setTrailorFalse = ()=> {
    setPlayTrailor( false );
    autoPlaytrailerScreenSaver.current = false
  }

  useEffect( ()=>{
    if( playTrailor ){
      autoPlaytrailerScreenSaver.current = true;
    }
  }, [playTrailor] )
  useEffect( ()=>{
    stopTrailorPlayback( setTrailorFalse );
    autoPlaytrailerScreenSaver.current = false;
    if( playerProps?.srcBanner && !isFocusOnEpisode ){
      startTrailorPlayback();
    }

    return ()=>{
      stopTrailorPlayback( setTrailorFalse );
      autoPlaytrailerScreenSaver.current = false;
    }
  }, [playerProps?.srcBanner, profileAPIResult, isFocusOnEpisode] )

  useEffect( () =>{
    if( liveContent ){
      stopTrailorPlayback( setTrailorFalse );
    }

  }, [liveContent] )

  // useEffect( () =>{
  //   if( isExpandedMenu ){
  //     stopTrailorPlayback( setTrailorFalse );
  //   }
  // }, [isExpandedMenu] )

  const bannerClassNames = useMemo( () => classNames( 'BannerComponent', { 'BannerComponent--withFocus': focused } ), [focused] );
  const backgroundClassNames = useMemo( () =>{
    return classNames( fromPiPage ? 'BannerComponent__backgroundImgPI' : 'BannerComponent__backgroundImg', {
      'BannerComponent__synopsisGradient': synopsisGradient,
      'BannerComponent__bbg': imageUrl && !footerImage,
      'BannerComponent__bbl': ( ( liveContent || sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ) ? preimage : ( previewPoster || bgImg ) ) && !imageUrl,
      'BannerComponent__catalogPartner': catalogPartner
    } )
  }, [synopsisGradient, imageUrl, footerImage, bgImg, catalogPartner, previewPoster, preimage]
  );
  return (
    <div
      className={ bannerClassNames }
      ref={ ref }
    >
      <div
        className={ backgroundClassNames }
      >
        { playTrailor ? (
          <div className='BannerComponent__trailor-banner'>
            <PlayerComposer { ...playerProps }
              setPlayTrailor={ setPlayTrailor }
              autoPlayTrailor={ true }
              railFocusedCardInfo={ props.railFocusedCardInfo }
              pageType={ window.location.pathname }
            /></div>
        ) : (
          <>
            { ( ( liveContent || sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ) ? ( preimage || bgImg ) : ( previewPoster || bgImg ) ) &&
              <Image
                src={ liveContent || sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL ? ( preimage || bgImg ) : ( previewPoster || bgImg ) }
                ariaLabel='Image'
                alt={ alt }
                notIntersect={ notIntersect }
              /> }
            { footerImage &&
            <div className='BannerComponent__footerImage'>
              <Image
                src={ footerImage }
                ariaLabel='Image'
                alt={ alt }
                notIntersect={ notIntersect }
              />
            </div>
            }
          </>
        ) }
      </div>
      {
        imageGradient && (
          <>
            <div className='BannerComponent__LinearGradient1'></div>
            <div className='BannerComponent__LinearGradient2'></div>
          </>
        )
      }
      { synopsisGradient &&
        <>
          <div className='BannerComponent__gradientSynopsis1'></div>
        </>
      }
    </div>
  )
}

/**
   * Property type definitions
   *
   * @type {object}
   * @property {string} bgImg - provides Banner bgImg
   * @property {bool} synopsisGradient - provides Banner gradient for synopsis
   * @property {string} alt - provides Banner alt text
   */
export const propTypes =  {
  bgImg: PropTypes.string.isRequired,
  synopsisGradient: PropTypes.bool,
  alt: PropTypes.string,
  imageUrl: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {boolean} synopsisGradient=false - Default linearGradient
 */
export const defaultProps = {
  synopsisGradient: false
};


BannerComponent.propTypes = propTypes;
BannerComponent.defaultProps = defaultProps;

export default BannerComponent;
