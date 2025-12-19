/* eslint-disable no-console */
/**
 * The PlayerContextProvider component is used to provide the user details to any component which needs it.
 *
 * @module views/core/PlayerContextProvider/PlayerContextProvider
 */
import React, { useState, useContext, createContext, useMemo } from 'react';

/**
 * Represents a PlayerContextProvider component
 *
 * @method
 * @param { Object } props - React properties passed from composition
 * @returns PlayerContextProvider
 */
export const PlayerContextProvider = function( { children } ){
  const [subtitlePlayUrl, setSubtitlePlayUrl] = useState( null )

  // Player Refactoring
  const [contentPlaybackData, setContentPlaybackData] = useState( null )
  const [trailor_url, setTrailor_url] = useState( null )
  const [storedContentInfo, setStoredContentInfo] = useState( null )
  const [storedLastWatchData, setStoredLastWatchData] = useState( null )
  const [metaData, setMetaData] = useState( null )
  const [playBackTitle, setPlayBackTitle] = useState( null );
  const [playbackRestoreTime, setPlaybackRestoreTime] = useState( null );
  const [trailerCurrentTime, setTrailerCurrentTime] = useState( null )
  const [trailerTotalTime, setTrailerTotalTime] = useState( null )
  const [initSonySDKResponse, setInitSonySDKResponse] = useState( null );
  const [sonyLiveErrorPage, setSetSonyLiveErrorPage] = useState( false );
  const [sunNxtGetTokenResponseContext, setSunNxtGetTokenResponseContext] = useState( null );
  const [sunNxtSuccessCallbackResponse, setSunNxtSuccessCallbackResponse] = useState( null );
  const [nextEpisodeTimer, setNextEpisodeTimer] = useState( 5 );
  const [sonyLivPartnerToken, setSonyLivPartnerToken] = useState( null );
  const [sonyLivPlayer, setSonyLivPlayer] = useState( null );
  const [isTrailerClicked, setIsTrailerClicked] = useState( false )
  const [isPlayClicked, setIsPlayClicked] = useState( false )
  const [contentPlayed, setContentPlayed] = useState( {
    watchDuration: 0,
    moviesPlayed: 0,
    moviesPlayedDuration: 0,
    showsPlayed: 0,
    showsPlayedDuration: 0,
    shortsPlayed: 0,
    shortsPlayedDuration: 0,
    seriesPlayed:0,
    seriesPlayedDuration: 0,
    catchupPlayed: 0,
    catchupPlayedDuration: 0
  } );

  const playerContextValue = useMemo( () => ( {
    playBackTitle, setPlayBackTitle,
    initSonySDKResponse, setInitSonySDKResponse,
    sonyLiveErrorPage, setSetSonyLiveErrorPage,
    sunNxtGetTokenResponseContext, setSunNxtGetTokenResponseContext,
    sunNxtSuccessCallbackResponse, setSunNxtSuccessCallbackResponse,
    subtitlePlayUrl, setSubtitlePlayUrl,
    contentPlaybackData, setContentPlaybackData,
    storedContentInfo, setStoredContentInfo,
    trailor_url, setTrailor_url,
    metaData, setMetaData,
    storedLastWatchData, setStoredLastWatchData,
    nextEpisodeTimer, setNextEpisodeTimer,
    sonyLivPartnerToken, setSonyLivPartnerToken,
    contentPlayed, setContentPlayed,
    sonyLivPlayer, setSonyLivPlayer,
    playbackRestoreTime, setPlaybackRestoreTime,
    trailerCurrentTime, setTrailerCurrentTime,
    trailerTotalTime, setTrailerTotalTime,
    isTrailerClicked, setIsTrailerClicked,
    isPlayClicked, setIsPlayClicked
  } ), [
    playBackTitle, setPlayBackTitle,
    initSonySDKResponse, setInitSonySDKResponse,
    sonyLiveErrorPage, setSetSonyLiveErrorPage,
    sunNxtGetTokenResponseContext, setSunNxtGetTokenResponseContext,
    sunNxtSuccessCallbackResponse, setSunNxtSuccessCallbackResponse,
    subtitlePlayUrl, setSubtitlePlayUrl,
    contentPlaybackData, setContentPlaybackData,
    storedContentInfo, setStoredContentInfo,
    trailor_url, setTrailor_url,
    metaData, setMetaData,
    storedLastWatchData, setStoredLastWatchData,
    nextEpisodeTimer, setNextEpisodeTimer,
    sonyLivPartnerToken, setSonyLivPartnerToken,
    contentPlayed, setContentPlayed,
    sonyLivPlayer, setSonyLivPlayer,
    playbackRestoreTime, setPlaybackRestoreTime,
    trailerCurrentTime, setTrailerCurrentTime,
    trailerTotalTime, setTrailerTotalTime,
    isTrailerClicked, setIsTrailerClicked,
    isPlayClicked, setIsPlayClicked
  ] );
  return (
    <PlayerContext.Provider
      value={ playerContextValue }
    >
      { children }
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

/**
 * Context provider for react reuse
 * @type object
 */
export const PlayerContext = createContext();

/**
 * context provider
 * @type object
 */
export const usePlayerContext = () => useContext( PlayerContext );
