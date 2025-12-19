/* eslint-disable no-console */
import get from 'lodash/get'
import { PROVIDER_LIST } from '../../../../utils/constants';
import { getSmartUrl } from './NoAuthPlaybackUrl';
import axios from 'axios';

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

export const getTrailorPlayUrl = async( contentInfoResponse, myPlanProps ) => {
  const metaData = get( contentInfoResponse, 'data.meta', {} );
  const provider = get( metaData, 'provider' );

  const playbackData = get( contentInfoResponse, 'data.detail', {} );
  let trailor_url = get( playbackData, 'trailerUrl' ) || get( playbackData, 'dashWidewineTrailerUrl' );
  if( !trailor_url ){
    trailor_url = get( playbackData, 'partnerTrailerInfo' )
  }
  if( provider?.toLowerCase() === PROVIDER_LIST.SHEMAROO_ME ){
    if( trailor_url ){
      const params = {
        url: getSmartUrl( trailor_url, myPlanProps?.shemarromeConfig ),
        method: 'GET'
      }
      const result = await api.request( params );
      const response = result.data

      if( response.adaptive_urls?.length > 0 ){
        trailor_url = response.adaptive_urls[0].playback_url
      }
    }
  }
  console.log( 'trailor_url --1', trailor_url )
  return trailor_url

}