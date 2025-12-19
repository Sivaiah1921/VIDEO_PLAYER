/* eslint-disable no-lonely-if */
import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import './SelectPromo.scss';
import { getAuthToken, getProductName } from '../../../utils/localStorageHelper';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import Image from '../Image/Image';
import { cloudinaryCarousalUrl, getBgImg, userIsSubscribed } from '../../../utils/util';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { LAYOUT_TYPE, PACKS } from '../../../utils/constants';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';

function SelectPromo( props ){
  const { onFocus, focusKeyRefrence, setHomeCaroselInfo, topPositionRailValue, setCaroselPageView, promoText, promoBgImage, promoCta, promoLogoImage } = props;
  const [currentPlan, setCurrentPlan] = useState( null )
  const history = useHistory();
  const { setLastFocusFrom, lastFocusFrom, homeDonglePageData, topPositionRailValueContext, railsRestoreId } = useMaintainPageState() || null
  const { setContentInfo } = useHomeContext()
  const responseSubscription = useSubscriptionContext( );
  const { url } = useAppContext();
  const myPlanProps = useMemo( () => {
    return responseSubscription?.responseData?.currentPack;
  }, [responseSubscription] );
  const modifiedPromoText = promoText.replace( '\\n', '' )

  const { ref, focused } = useFocusable( {
    onFocus,
    onEnterPress: () => {
      onSelectPromoClick()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false )
      if( direction === 'up' && topPositionRailValueContext.current === 0 ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  useEffect( ()=>{
    if( myPlanProps ){
      const isSubscribed = userIsSubscribed( myPlanProps )
      setCurrentPlan( isSubscribed )
    }
  }, [myPlanProps] )

  const onSelectPromoClick = () => {
    if( !getAuthToken() ){
      history.push( '/plan/subscription' )
      railsRestoreId.current = null
    }
    else {
      if( getProductName() === PACKS.FREEMIUM ){
        history.push( '/plan/subscription' )
      }
      else {
        history.push( '/plan/current' )
      }
    }
  }

  return (
    <div
      ref={ ref }
      className='SelectPromo'
    >
      <div className='SelectPromo__BannerImage'>
        <Image
          alt={ 'promoBgImage' }
          ariaLabel='Image'
          src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.HERO_BANNER, url ) }/${ promoBgImage }` }
        />
      </div>
      <div className='SelectPromo__subContainer'>
        <div className='SelectPromo__subContainer--primelogo'>
          <Image
            alt={ 'promoLogoImage' }
            ariaLabel='Image'
            src={ getBgImg( promoLogoImage, url ) }
            notIntersect={ true }
          />
        </div>
        <div className='SelectPromo__subContainer--BannerText'>
          <Text
            textStyle='promo-text'
          >
            { modifiedPromoText }
          </Text>
        </div>
        <div
          className={
            classNames( 'SelectPromo__subContainer--langMessage',
              { 'SelectPromo__subContainer--withFocus': focused },
            ) }
        >
          <Button
            label={ promoCta }
            primary={ true }
            className={ 'SelectPromo__subContainer--Btn' }
            languageNudgeCallBack={ setCaroselPageView }
            onClick={ onSelectPromoClick }
            onFocus={ ()=> {
              homeDonglePageData.current = null
              setContentInfo( {} )
            } }
          />
        </div>
      </div>

    </div>
  )

}

export default SelectPromo;