/* eslint-disable no-console */
import React, { useCallback, useEffect } from 'react'
import './SeasonTab.scss';
import PropTypes from 'prop-types';
import { useFocusable, FocusContext, setFocus, getCurrentFocusKey } from '@noriginmedia/norigin-spatial-navigation';
import Button from '../Button/Button';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

function SeasonTab( { tabheadList, handleClick, onFocus, buttonFromDetailPage, callBackFnTopPos, piSeasonList, seasonsFrom, currntIndex, setCurrntIndex } ){
  const { ref, focusKey } = useFocusable( { onFocus } )
  const { episodePageData } = useMaintainPageState() || null
  const previousPathName = useNavigationContext()


  const handleSetIndex = ( index, item, e )=>{
    previousPathName.previousMediaCardFocusBeforeSplash = item.seriesName
    episodePageData.selectedIndex = `${item.seriesName}_${index}`
    onCardFocus( e, index )
    setCurrntIndex( index )
    handleClick( item );
  }

  useEffect( ()=>{
    const buttonFocus = ['BUTTON_DELETE', 'BUTTON_CLEAR']
    if( !buttonFocus.includes( getCurrentFocusKey() ) ){
      window.location.pathname.includes( '/content/episode' ) && setFocus( episodePageData.selectedIndex )
    }
  }, [] )

  const onCardFocus = useCallback( ( rest, index ) => {
    if( ref.current ){
      { !!buttonFromDetailPage ? (
        ref.current.scrollLeft = -700 + rest.left - rest.node.offsetWidth
      ) : (
        ref.current.scrollLeft = rest.left - ( ref.current.clientWidth / 2 )
      ) }
    }
  }, [ref] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='SeasonTab'
        ref={ ref }
      >
        { tabheadList?.map( ( item, index )=>{
          return (
            <Button
              label={ item.seriesName }
              onFocus={ ( e ) => handleSetIndex( index, item, e ) }
              controlFrom='SeasonTab'
              focusKeyRefrence={ `${item.seriesName}_${index}` }
              totalLengthOfTabs={ tabheadList.length - 1 }
              buttonFromDetailPage={ buttonFromDetailPage }
              callBackFnTopPos={ callBackFnTopPos }
              textStyle={ currntIndex === index ? 'seasionTabText-2' : null }
              key={ index }
              piSeasonList={ piSeasonList }
              seasonsFrom={ seasonsFrom }
            >
              { item.seriesName }
            </Button>
          )
        } ) }
      </div>
    </FocusContext.Provider>
  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {any} tabheadList - Array of tabheadList items
  */
export const propTypes = {
  tabheadList: PropTypes.any
};

SeasonTab.propTypes = propTypes;

export default SeasonTab