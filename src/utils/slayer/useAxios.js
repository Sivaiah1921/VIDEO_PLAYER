/* eslint-disable no-console */
/**
 * Custom hook for calling APIs using axios
 *
 * @module utils/services/useAxios
 */

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { COMMON_HEADERS, SENTRY_LEVEL, SENTRY_TAG, PAYMENT_STATUS } from '../constants';
import { sendExecptionToSentry } from '../util';
import { LOG_ERROR_CODE_NOT_TRACKING, trackErrorEvents } from '../logTracking';
import MIXPANELCONFIG from '../mixpanelConfig';
import { getTVDeviceId } from '../localStorageHelper';

/**
  * Setting default baseurl in Axios
  *
  * @method
  * @returns { object }
  */

const api = axios.create( {
  baseURL: process.env.REACT_APP_APIPATH
} );

// api.defaults.headers.common['platform'] = COMMON_HEADERS.PLATFORM

/**
  * Returns states for the API response, loading and error
  *
  * @method
  * @returns { object }
  */

export const useAxios = ( axiosParams, skip = false ) => {
  const [response, setResponse] = useState( undefined );
  const [error, setError] = useState( null );
  const [loading, setLoading] = useState( !skip );
  const axiosCancelToken = useRef();

  const fetchData = async( params, syncParams ) => {
    setLoading( true );
    if( axiosCancelToken.current && params?.url?.includes( 'search-connector/v3/binge/search?' ) ){
      axiosCancelToken.current.cancel();
      setResponse( undefined );
    }
    else if( axiosCancelToken.current && params?.url?.includes( 'content-subscriber-detail/pub/api/v1/content-detail/series' ) ){
      axiosCancelToken.current.cancel();
      setResponse( undefined );
    }
    axiosCancelToken.current = axios.CancelToken.source();

    const updatedParams = {
      ...params,
      cancelToken: axiosCancelToken.current.token
    }

    if( axiosParams.url?.includes( 'surl.shemaroome.com' ) || axiosParams.url?.includes( 'api/content/episode/info' ) || axiosParams.url?.includes( 'zee5-playback-api/v2/tag/fetch' ) || axiosParams.url?.includes( '/boxset' ) || axiosParams.url?.includes( 'content-detail-binge/pub/api/v5/channels' ) ){
      delete api.defaults.headers.common['platform'];
    }
    else {
      api.defaults.headers.common['platform'] = COMMON_HEADERS.PLATFORM
      api.defaults.headers.common['appVersion'] = COMMON_HEADERS.VERSION
    }
    try {
      if( params.url && getTVDeviceId() ){
        const result = await api.request( updatedParams );
        if( syncParams ){
          setResponse( { response: result.data, syncParams } );
        }
        else {
          setResponse( result.data );
        }
        const { data } = result || {}
        const { code, data: innerData, message } = data || {}

        if( code && ( !LOG_ERROR_CODE_NOT_TRACKING.includes( code.toString() ) && ( ( innerData && Object.keys( innerData ).length === 0 ) || innerData === null ) ) ){
          console.log( 'ERROR-LOG', result, params.url )
          trackErrorEvents( MIXPANELCONFIG.EVENT.API_FAILURE, { message: message, code: code, url: params.url } )
        }
        else if( innerData?.paymentStatus === PAYMENT_STATUS.FAILED ){
          trackErrorEvents( MIXPANELCONFIG.EVENT.SUBSCRIBE_FAILED, { message: innerData?.errorResponse, code: code, url: params.url } )
        }
        setError( null ); // Clear the error state on successful response
        return result; // hand back raw axios response for callers that await
      }
    }
    catch ( error ){
      const statusCode = error?.response?.status;
      // eslint-disable-next-line no-console
      console.log( 'error', error )
      if( error && error.response && error.response.config ){
        error.response.config.url && sendExecptionToSentry( error, `${ SENTRY_TAG.API_ERROR } ${error.response.config.url}`, SENTRY_LEVEL.INFO );
      }
      if( statusCode === 429 ){
        console.warn( 'Rate limit hit' );
        setResponse( undefined ); // Clear old data
      }
      setError( error );
      error && !window.location.pathname.includes( 'player' ) && trackErrorEvents( MIXPANELCONFIG.EVENT.API_FAILURE, { ...error, message: error.response?.data?.message || error.message, url: error.response?.request?.responseURL || params.url } )
      return undefined;
    }
    finally {
      setLoading( false );
    }
  };

  useEffect( () => {
    !skip && fetchData( axiosParams );
  }, [] );

  return { fetchData, response, error, loading };
};