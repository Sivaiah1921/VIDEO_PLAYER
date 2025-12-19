/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * The ScreenSaverContextProvider component is used to provide the mixpanel content details to any component which needs it.
 *
 * @module views/core/ScreenSaverContextProvider/ScreenSaverContextProvider
 */
import React, { useState, createContext, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../AppContextProvider/AppContextProvider';
import { useRegisterContext } from '../RegisterContextProvider/RegisterContextProvider';
import classNames from 'classnames';
import { useFocusable, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { screen_saver_show } from '../../../utils/mixpanel/mixpanelService';
import { useHistoryContext } from '../HistoryContextProvider/HistoryContextProvider';
import { doNotShowScreenSaver, modalDom } from '../../../utils/util';
import { useMaintainPageState } from '../MaintainPageStateProvoder/MaintainPageStateProvoder';
import Icon from '../../components/Icon/Icon';
import constants from '../../../utils/constants';
import Button from '../../components/Button/Button';
import get from 'lodash/get';
/**
 * Represents a ScreenSaverContextProvider component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns ScreenSaverContextProvider
 */
export const ScreenSaverContextProvider = function( { children } ){
  const { screenSaverVisible, autoPlaytrailerScreenSaver } = useMaintainPageState()
  const historyObject = useHistoryContext();
  const registerContext = useRegisterContext() || {};
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const enableQrLoginJourney = useMemo( () => get( config, 'qrLoginJourney.enable' ), [config] );
  const [showScreenSaver, setShowScreenSaver] = useState( false );
  const screensaverTimeout = useRef();
  const [currentIndex, setCurrentIndex] = useState( 0 );
  const [animationStart, setAnimationStart] = useState( true );
  const currentFocusStateRef = useRef( null )
  const { ref } = useFocusable( {
    isFocusBoundary: true
  } );
  const screenSaverDom = useMemo( () => document.querySelector( '.screensaver' ), [] );

  const onKeyPressForRemoveSplash = () => {
    if( showScreenSaver ){
      setCurrentIndex( 0 )
      setTimeout( () => {
        screenSaverVisible.current = false;
      }, 100 );
      setShowScreenSaver( false )
      startTimeout();
    }
  }
  const onKeyPressForShowSplash = () => {
    if( !showScreenSaver ){
      setCurrentIndex( 0 )
      startTimeout();
    }
  }
  const onBlur = () => {
    if( !showScreenSaver && registerContext.screenSaverData.length > 0 ){
      setShowScreenSaver( false )
      clearTimeout( screensaverTimeout.current );
    }
  };
  const onFocus = () => {
    if( !showScreenSaver && registerContext.screenSaverData.length > 0 ){
      startTimeout()
    }
  };
  useEffect( () => {
    window.onfocus = ()=> onFocus();
    window.onblur = ()=> onBlur();
  }, [config, showScreenSaver] );
  useEffect( () => {
    const rc = registerContext
    const cf = config
    historyObject.current?.listen( () => {
      if( cf && rc.screenSaverData.length > 0 && doNotShowScreenSaver( enableQrLoginJourney ) ){
        setShowScreenSaver( false )
        clearTimeout( screensaverTimeout.current );
        const timeout = setTimeout( () => !autoPlaytrailerScreenSaver.current && activeScreensaver( rc ), config.screen_saver_time * 1000 );
        screensaverTimeout.current = timeout;
      }
    } )
  }, [historyObject.current, registerContext, config, autoPlaytrailerScreenSaver] )
  useEffect( () => {
    if( showScreenSaver ){
      window.addEventListener( 'keydown', ()=>onKeyPressForRemoveSplash( ) );
    }
    else {
      window.addEventListener( 'keydown', ()=>onKeyPressForShowSplash( ) );
    }
    return () => {
      window.removeEventListener( 'keydown', ()=> onKeyPressForRemoveSplash( ) );
      window.removeEventListener( 'keydown', ()=> onKeyPressForShowSplash( ) );
    }
  }, [showScreenSaver, config] );
  const startTimeout = () => {
    if( config && registerContext.screenSaverData.length > 0 && doNotShowScreenSaver( enableQrLoginJourney ) ){
      clearTimeout( screensaverTimeout.current );
      const timeout = setTimeout( () => !autoPlaytrailerScreenSaver.current && activeScreensaver(), config.screen_saver_time * 1000 );
      screensaverTimeout.current = timeout;
    }
  }
  const activeScreensaver = ( rc ) => {
    currentFocusStateRef.current = getCurrentFocusKey()
    setAnimationStart( false )
    setShowScreenSaver( true )
    screenSaverVisible.current = true
  }
  useEffect( () => {
    if( config && showScreenSaver && registerContext.screenSaverData.length > 0 ){
      const intervalID = setInterval( () => {
        let nextId = currentIndex + 1;
        if( registerContext.screenSaverData[nextId] ){
          // do nothing
        }
        else {
          nextId = 0;
        }
        setCurrentIndex( nextId );
      }, config.screen_saver_rotation_time * 1000 );
      return () => clearInterval( intervalID );
    }
  }, [currentIndex, config, showScreenSaver] )
  useEffect( ()=>{
    if( !animationStart ){
      setTimeout( () => {
        setAnimationStart( true )
      }, 100 );
    }
  }, [animationStart] )
  useEffect( ()=>{
    if( showScreenSaver && doNotShowScreenSaver( enableQrLoginJourney ) && registerContext.screenSaverData.length > 0 ){
      if( modalDom() ){
        modalDom().style.display = 'none'
      }
      setFocus( 'SCREEN_SAVER' )
    }
    else {
      if( modalDom() ){
        modalDom().style.display = 'block'
      }
      currentFocusStateRef.current && setFocus( currentFocusStateRef.current )
    }
  }, [showScreenSaver] )
  useEffect( ()=>{
    const observer = new MutationObserver( () => {
      const isInDOM = document.contains( document.querySelector( '.Loader' ) );
      if( isInDOM ){
        setCurrentIndex( 0 )
        setShowScreenSaver( false )
        startTimeout();
      }
      else {
        // ..
      }
    } );
    observer.observe( document, { childList: true, subtree: true } );
  }, [config] )
  useEffect( ()=>{
    const screenShowData = registerContext && Object.keys( registerContext ).length > 0 && Array.isArray( registerContext.screenSaverData ) && registerContext.screenSaverData.length > 0 ? registerContext.screenSaverData : null
    screenShowData && showScreenSaver && screen_saver_show( screenShowData[currentIndex] )
  }, [screenSaverDom, currentIndex, showScreenSaver] )
  useEffect( () => {
    const getMouseStateChange = ( event ) =>{
      if( event.detail && event.detail.visibility ){
        clearTimeout( screensaverTimeout.current )
      }
      else {
        startTimeout();
      }
    }
    document.addEventListener( 'cursorStateChange', getMouseStateChange )
    return () => {
      document.removeEventListener( 'cursorStateChange', getMouseStateChange );
    };
  }, [config] );
  return (
    <ScreenSaverContext.Provider value=''
      ref={ ref }
    >
      {
        registerContext.isOnline && showScreenSaver && doNotShowScreenSaver( enableQrLoginJourney ) && registerContext.screenSaverData.length > 0 && (
          <>
            <div className='screensaver-bingelogo'>
              <Icon
                name={ constants.MY_ACCOUNT.BINGE_LOGO }
              />
            </div>
            <div
              id='screensaver'
              className='screensaver'
              onMouseUp={ () => {
                setShowScreenSaver( false )
                clearTimeout( screensaverTimeout.current );
                setCurrentIndex( 0 )
              } }
            >
              { registerContext.screenSaverData.map( ( src, index ) => {
                return (
                  <img
                    className={ classNames( 'animation',
                      {
                        'active' : currentIndex === index
                      } ) }
                    src={ src }
                    key={ index }
                    alt={ `Screensaver-${index}` }
                  />
                )
              } ) }
              <div style={ { opacity: 0 } }>
                <Button
                  label={ 'No' }
                  secondary
                  size='medium'
                  focusKeyRefrence={ `SCREEN_SAVER` }
                />
              </div>
            </div>
          </>
        )
      }
      { children }
    </ScreenSaverContext.Provider>
  )
}

export default ScreenSaverContextProvider;
export const ScreenSaverContext = createContext();