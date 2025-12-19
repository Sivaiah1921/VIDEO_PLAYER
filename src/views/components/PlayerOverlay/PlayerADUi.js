import React from 'react';
import './PlayerADUi.scss';
import Button from '../Button/Button';
import constants from '../../../utils/constants';
import { PlayPause } from './PlayPause';
import Text from '../Text/Text';
import classNames from 'classnames';
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import ProgressBar from '../ProgressBar/ProgressBar';

export const PlayerADUi = ( props )=>{
  const { isVideoPlaying, toggleVideoPlay, hidePauseIcon, loading, multipleAds, currentAdNumber, totalNumnerOfAds, adDuration, adCurrentTime, isAdStarted, goBackToPrevPage } = props;

  return (
    <>
      <div className='playerADUiContainer__topGradient' />
      <div className='playerADUiContainer' >
        <FocusContext.Provider focusable={ false }
          value=''
        >
          <div className='playerADUiContainer__back'>
            <Button
              onClick={ ()=> goBackToPrevPage() }
              iconLeftImage={ 'Path' }
              iconLeft={ true }
              secondary={ true }
              size='medium'
              label={ constants.GOBACK }
            />
          </div>
        </FocusContext.Provider>
        <PlayPause
          isVideoPlaying={ isVideoPlaying }
          toggleVideoPlay={ toggleVideoPlay }
          hidePauseIcon={ hidePauseIcon }
          loading={ loading }
        />
        <div className='playerADUiContainer__bottomUI'>
          <div className='adsCountContainer' >
            <div className={ classNames( 'ads', { 'ads--single': !multipleAds } ) } >
              <Text
                color='white'
              >
                { multipleAds ? constants.ADS : constants.AD }
              </Text>
            </div>
            { multipleAds &&
            <div className='adsCount'>
              <Text
                color='white'
              >
                { `${currentAdNumber} of ${totalNumnerOfAds}` }
              </Text>
            </div> }
          </div>
          <div className='adsProgressBar' >
            <FocusContext.Provider focusable={ false }
              value=''
            >
              <ProgressBar
                progress={ 100 }
                seekTo={ ()=>{} }
                addTimer={ adDuration - adCurrentTime }
                controlsVisibility={ isAdStarted }
                progressBarPosition
                isAdUI
              />
            </FocusContext.Provider>
          </div>
        </div>
      </div>
    </>
  )
}