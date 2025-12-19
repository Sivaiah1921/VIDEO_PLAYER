/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * component used to display a PrimeBannerSubscription for claiming free Amazon Prime membership
 *
 * @module views/components/BannerSubscription
 * @memberof -Common
 */
import React, { useMemo } from 'react';
import './BannerSubscription.scss';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { cloudinaryCarousalUrl } from '../../../utils/util';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { LAYOUT_TYPE } from '../../../utils/constants';
import Image from '../Image/Image';
import Text from '../Text/Text';

export const BannerSubscription = function( { onBannerClick, focusKeyReference, onFocus } ){
  const { url } = useAppContext();
  const { flexiPlanVerbiagesContext } = useMaintainPageState() || null

  const primeBannerVerbiages = useMemo( () => flexiPlanVerbiagesContext.current?.data?.amazonSubscriptionVerbiage?.lsAmazonClaimNudge, [flexiPlanVerbiagesContext.current] )
  const { ref, focusKey, focused, focusSelf } = useFocusable( {
    focusKey: focusKeyReference,
    onFocus,
    onEnterPress: () => {
      onBannerClick()
    }
  } );

  const onMouseEnterCallBackFn = ( ) => {
    focusSelf()
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }
        onMouseEnter={ onMouseEnterCallBackFn }
        onMouseUp={ onBannerClick }
        className={ classNames( 'BannerContainer',
          { 'BannerContainer--withFocus': focused }
        ) }
      >
        <div className='BannerContainer__leftSection'>
          <Image
            alt={ 'logo' }
            ariaLabel='Logo'
            src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PRIME_BANNER_LOGO, url ) }/${ primeBannerVerbiages?.logo }` }
          />
        </div>
        <div className='BannerContainer__rightSection'>
          <div className='BannerContainer__textSection'>
            <Text
              textStyle='prime-banner-text'
              color='white'
            >
              { primeBannerVerbiages?.text }
            </Text>
          </div>
          <Image
            alt={ 'PrimeImages' }
            ariaLabel='Image'
            src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PRIME_BANNER_IMAGES, url ) }/${ primeBannerVerbiages?.activateNowCTA }` }
          />
        </div>
      </div>
    </FocusContext.Provider>
  )
}


export default BannerSubscription;
