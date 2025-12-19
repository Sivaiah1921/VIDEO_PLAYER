/* eslint-disable no-console */
/**
 * This component will be used to show the animated splash logo on the loading of the app.
 *
 * @module views/components/Splash
 * @memberof -Common
 */
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AppContainer from '../../../views/core/AppContainer/AppContainer';
import ErrorBoundary from '../../../views/core/ErrorBoundary/ErrorBoundary';
import './Splash.scss';
import { getAppEnv, getDeviceLaunchCount, getTVDeviceId, setDeviceLaunchCount, setTVDeviceId } from '../../../utils/localStorageHelper';
import { initializeAnalyticsEvents, initializeUserSubscriptionST } from '../../../utils/commonHelper';
import classNames from 'classnames';
import { getDeviceId } from '../../core/RegisterContextProvider/RegisterContextProvider';

/**
  * Represents a Splash component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Splash
  */
export const Splash = function( props ){
  const history = useHistory()
  const [showSplash, setShowSplash] = useState( true );
  const videoRef = useRef( null );
  const splashPath = `${window.assetBasePath}splash_video.mp4`;
  const hasModuleRoutes = Boolean( props.config?.ModuleRoutes );


  const onSplashEnd = () =>{
    hasModuleRoutes ? setShowSplash( false ) : history.push( '/discover' );
    appLaunchEvent()
    initializeAnalyticsEvents();
  }

  const dataCleanup = () => {
    const deviceID = getTVDeviceId();
    if( !deviceID ){
      return;
    }
    localStorage.clear()
    setTVDeviceId( deviceID )
    setDeviceLaunchCount( 1 )
    initializeUserSubscriptionST()
  }

  const appLaunchEvent = () => {
    console.log( 'Envs', getAppEnv(), process.env.REACT_APP_NODE_ENV ) // eslint-disable-line

    const localEnv = getAppEnv()
    const liveEnv = process.env.REACT_APP_NODE_ENV

    if( localEnv && localEnv !== liveEnv ){
      console.log( 'envs are different. Updating localEnv.' );  // eslint-disable-line
      dataCleanup()
    }
    else {
      console.log( 'envs are the same. No update needed.' );  // eslint-disable-line
    }
  }
  useEffect( () => {
    getDeviceId( false );
  }, [] )

  useEffect( () =>{
    if( videoRef.current ){
      videoRef.current.onplaying = () => {
        console.log( 'playing event on Splash' ); // eslint-disable-line
        videoRef.current.muted = false;
      }
      setDeviceLaunchCount( getDeviceLaunchCount() + 1 )
      initializeUserSubscriptionST();
    }
  }, [] )

  return (
    <div className='Splash'>
      {
        // getTVDeviceId() ?
        ( showSplash ? (
          <div className='Splash__container'>
            <video className='Splash__container--fullscreen-bg__video'
              muted
              ref={ videoRef }
              autoPlay
              id='splashVideo'
              onEnded={ onSplashEnd }
            >
              <source
                src={ splashPath }
                type='video/mp4'
              />
            </video>
          </div>
        ) : (
          hasModuleRoutes && (
            <div className={ classNames( 'Splash__routesVisibility', { 'Splash__routesVisibility--visible': !showSplash } ) }>
              <ErrorBoundary>
                <AppContainer>
                  <props.config.ModuleRoutes />
                </AppContainer>
              </ErrorBoundary>
            </div>
          )
        ) )
        // : <div className='Splash__notFoundPage'> <Text>Page Not Found </Text></div>
      }
    </div>
  )
}

export default Splash;