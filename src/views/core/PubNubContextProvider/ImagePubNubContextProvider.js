/* eslint-disable no-console */
import PubNub from 'pubnub';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../AppContextProvider/AppContextProvider';
import get from 'lodash/get';
import { getCloudinaryUrl, getMediaReadyUrl } from '../../../utils/util';

export const ImagePubNubContextProvider = function( { children } ){
  const { uuid, channelName, setUrlRender, configResponse } = useAppContext();
  const { config } = configResponse
  const listnerObj = useRef();
  let pubnub;
  useEffect( ()=>{
    if( uuid ){
      pubnub = new PubNub( {
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
        uuid: uuid,
        origin: 'tatasky.pubnubapi.com'
      } );
    }
  }, [uuid] )
  useEffect( () => {
    if( channelName ){
      const listener = subscribeChannels();
      listnerObj.current = listener
      return () => {
        unsubscribePubNubChannels( listener )
      }
    }
  }, [channelName] );

  const unsubscribePubNubChannels = listener => {
    if( pubnub ){
      pubnub.removeListener( listener );
      pubnub.unsubscribeAll();
    }
  };
  const subscribeChannels = () => {
    if( pubnub ){
      pubnub.subscribe( {
        channels: [channelName]
      } );
      const listener = {
        message( msg ){
          if( msg && msg.message && msg.message.isCloudinaryEnabled ){
            setUrlRender( getCloudinaryUrl( config ) )
          }
          else {
            setUrlRender( getMediaReadyUrl( config ) )
          }
        }
      };
      pubnub.addListener( listener );
      return listener;
    }
  };


  const onLogoutImage = () => {
    unsubscribePubNubChannels( listnerObj.current );
  }

  const imageContextValue = useMemo( () => ( {
    onLogoutImage
  } ), [onLogoutImage] )

  return (
    <ImagePubNubContext.Provider value={ imageContextValue }>
      { children }
    </ImagePubNubContext.Provider>
  )
}

export default ImagePubNubContextProvider;

export const ImagePubNubContext = createContext();

export const useImagePubNubContext = ( ) => useContext( ImagePubNubContext );