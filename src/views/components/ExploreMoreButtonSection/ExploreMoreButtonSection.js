/* eslint-disable no-console */
/**
 * Explore more button for the new BBA Rail
 *
 * @module views/components/ExploreMoreButtonSection
 * @memberof -Common
 */
import React from 'react';
import Button from '../Button/Button';
import { useHistory } from 'react-router-dom';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';
import { getDistroMeta, setContentRailPositionData, setDistroMeta, setFromAppMediaCard } from '../../../utils/localStorageHelper';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import {
  constants,
  CONTENT_TYPE,
  DISTRO_CHANNEL

} from '../../../utils/constants';
import { TrackDistroEventCall, getDistroEventTrackURL, getMetadataDistroTracking } from '../../../utils/slayer/DistroService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { isDistroContent } from '../../../utils/slayer/PlayerService';
import { setMixpanelData } from '../../../utils/util';

/**
 * Represents a ExploreMoreButtonSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ExploreMoreButtonSection
 */
export const ExploreMoreButtonSection = function( props ){
  const { appTitle, bbaDetailUrl, bbaRailRestoreId, bbaContentListId } = props;
  const { ref, focusKey } = useFocusable( { } )
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const history = useHistory()
  const { profileAPIResult } = useProfileContext();
  const { catalogPage, setOptionBba } = useMaintainPageState() || null
  const isAutoPlayed = profileAPIResult && profileAPIResult.data?.autoPlayTrailer ? MIXPANELCONFIG.VALUE.YES : MIXPANELCONFIG.VALUE.NO

  const [distroTracking] = TrackDistroEventCall()
  const { trackDistroEvent } = distroTracking

  return (
    <FocusContext.Provider value={ focusKey }>
      <div ref={ ref }>
        <Button
          label={ `${config?.cms_constant?.provider_browse_by_apps_button} ${appTitle }` }
          size='medium'
          iconLeft={ false }
          focusKeyRefrence={ constants.BUTTON_EXPLORE }
          onClick={ ()=>{
            setDistroMeta( {} )
            if( isDistroContent( bbaDetailUrl.provider ) ){
              setDistroMeta( { ...getDistroMeta(), dai_session_id : DISTRO_CHANNEL.EVENTS.ff } )
              const data = getMetadataDistroTracking( DISTRO_CHANNEL.EVENTS.ff )
              trackDistroEvent( { url: getDistroEventTrackURL( data ) } )
            }
            if( bbaDetailUrl && bbaDetailUrl.data ){
              const obj = {
                contentPosition: 0,
                railPosition: bbaDetailUrl.data.position,
                sectionType: bbaDetailUrl.data.sectionType,
                contentType: CONTENT_TYPE.SUB_PAGE,
                sectionSource: bbaDetailUrl.data.sectionSource,
                railTitle: bbaDetailUrl.data.title,
                configType: bbaDetailUrl.data.configType,
                autoPlayed: isAutoPlayed,
                railId: bbaDetailUrl.data.id
              }
              setContentRailPositionData( obj )
            }
            setFromAppMediaCard( true )
            setOptionBba( true )
            setMixpanelData( 'browsepagename', appTitle )
            setMixpanelData( 'optionValue', 'NA' )
            catalogPage.appRailData = null
            history.push( {
              pathname: `/browse-by-app/${bbaDetailUrl.provider}/${bbaDetailUrl.pageType ? bbaDetailUrl.pageType : constants.ERROR}/${null }`,
              args: {
                bbaOpen: MIXPANELCONFIG.VALUE.EXPLORE_CTA_CLICK
              },
              state: true
            } )
          } }
          callBackFnTopPos={ ()=>{
            if( !document.querySelector( '.HomeMediaCarousel__bbaAppContent' ) ){
              setTimeout( () => {
                setFocus( bbaRailRestoreId.current )
              }, 0 );
            }
            else {
              setTimeout( () => {
                setFocus( bbaContentListId.current )
              }, 0 );
            }
          } }
        />
      </div>
    </FocusContext.Provider>

  )
}

export default ExploreMoreButtonSection;
