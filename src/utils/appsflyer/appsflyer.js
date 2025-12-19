/* eslint-disable no-console */
import AppsFlyerSDK from 'appsflyer-html5-ctv-sdk';
import { APPFLYER_UAT, SENTRY_LEVEL, SENTRY_TAG } from '../constants';
import { sendExecptionToSentry } from '../util';

export const appsflyerInit = async() => {
  let appsflyer;
  const config = APPFLYER_UAT;
  console.log( { config } );
  try {
    appsflyer = await new AppsFlyerSDK( config );
  }
  catch ( e ){
    console.log( e, 'Appsflyer not supported' );
    sendExecptionToSentry( e, `${ SENTRY_TAG.APPSFLYER_NOT_SUPPORTED }`, SENTRY_LEVEL.ERROR );
  }
  appsFlyerStart( appsflyer );
  appsFlyerLogEvent( appsflyer );
}

const appsFlyerStart = async( appsflyer ) =>{
  let response;
  try {
    response = await appsflyer.start();
    console.log( 'start API response success: ', JSON.stringify( response ) );
  }
  catch ( err ){
    console.log( 'start API response err: ', JSON.stringify( err ) );
    sendExecptionToSentry( err, `${ SENTRY_TAG.APPSFLYER_API_RESPONSE_ERROR }`, SENTRY_LEVEL.ERROR );
  }
}

const appsFlyerLogEvent = async( appsflyer ) =>{
  let response;
  try {
    response = await appsflyer.logEvent( 'app_launch', { 'app_launch_platform': 'LG' } );
    console.log( 'logEvent API response success: ' + JSON.stringify( response ) );
  }
  catch ( err ){
    console.log( 'logEvent API response err:, ' + JSON.stringify( err ) );
    sendExecptionToSentry( err, `${ SENTRY_TAG.APPSFLYER_LOG_EVENT_ERROR }`, SENTRY_LEVEL.ERROR );
  }
}