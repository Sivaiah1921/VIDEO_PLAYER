/* eslint-disable no-console */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './LoginInterstitial.scss';
import Text from '../Text/Text';
import { constants } from '../../../utils/constants';
import classNames from 'classnames';
import QRCode from 'react-qr-code';
import { qrRefresh } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { LoginQrStatus, QrLoginService } from '../../../utils/slayer/QrLoginService';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { setBeforeLoginAuthToken, setBeforeLoginDeviceToken, setDeviceToken, setRmn } from '../../../utils/localStorageHelper';
import get from 'lodash/get';
import parse from 'html-react-parser';
import { useHistory } from 'react-router-dom';
import Button from '../Button/Button';

const LoginInterstitial = React.memo( function( props ){
  const history = useHistory();

  const pollingIntervalRef = useRef( null );
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const qrLoginJourney = useMemo( () => get( config, 'qrLoginJourney' ), [config] );
  const { pollingPeriodicFrequency } = qrLoginJourney || {};
  const { setIsLoginToggle, setIsQrCodeJourney, setQrLoginDetails, localQRData, QrError, setQrError } = useMaintainPageState()
  const [generateLoginQr] = QrLoginService();
  const { generateQrFetchData, generateQrResponse, generateQrError, generateQrLoading } = generateLoginQr;
  const [generateLoginQrStatus] = LoginQrStatus()
  const { generateLoginQRStatusFetchData, generateLoginQrStatusResponse, generateLoginQrStatusError, generateLoginQrStatusLoading } = generateLoginQrStatus;
  const { seconds } = props

  const qrCodeUrl = localQRData.current?.data?.loginQrCode;
  const extractedQrCodeId = qrCodeUrl?.split( 'qrCodeId=' )[1];
  const [qrCodeId, setQrCodeId] = useState( extractedQrCodeId );
  const formatTime = ( timeInSeconds ) => {
    const minutes = Math.floor( timeInSeconds / 60 );
    const seconds = timeInSeconds % 60;
    const formatNumber = ( num ) => {
      return num < 10 ? `0${num}` : `${num}`;
    };

    return `${formatNumber( minutes )}:${formatNumber( seconds )}`;
  };

  useEffect( () => {
    if( generateQrResponse?.data && !generateQrLoading ){
      setQrError( false );
      const newQrCodeUrl = generateQrResponse.data.loginQrCode;
      const newExtractedQrCodeId = newQrCodeUrl?.split( 'qrCodeId=' )[1];

      if( newExtractedQrCodeId && newExtractedQrCodeId !== qrCodeId ){
        setQrCodeId( newExtractedQrCodeId );
      }

      localQRData.current = generateQrResponse;
    }
  }, [generateQrResponse, generateQrLoading] );



  useEffect( () => {
    let timeout;
    if( seconds <= 1 ){
      timeout = setTimeout( () => {
        generateQrFetchData();
        qrRefresh();
      }, 950 );
    }
    return () => {
      if( timeout ){
        clearTimeout( timeout );
      }
    };
  }, [seconds] );



  useEffect( () => {
    if( !qrCodeId ){
      return;
    }

    pollingIntervalRef.current = setInterval( () => {

      if( !QrError ){
        generateLoginQRStatusFetchData( qrCodeId )
      }

      if( generateLoginQrStatusResponse?.data?.userToken ){
        clearInterval( pollingIntervalRef.current );
        setBeforeLoginAuthToken( generateLoginQrStatusResponse.data.userToken )
        setBeforeLoginDeviceToken( generateLoginQrStatusResponse.data.deviceToken )
        setDeviceToken( generateLoginQrStatusResponse.data.deviceToken )
        setRmn( generateLoginQrStatusResponse.data.mobileNumber )
        setQrLoginDetails( generateLoginQrStatusResponse.data )
        setIsLoginToggle( true )
        setIsQrCodeJourney( true )
        history.push( {
          pathname: `/device/subscriber`
        } )
        console.log( 'User Logged In Successfully:', generateLoginQrStatusResponse.data );
      }
      else if( generateLoginQrStatusError ){
        console.error( 'Polling Error:', generateLoginQrStatusError );
        clearInterval( pollingIntervalRef.current );
        setIsQrCodeJourney( false )
      }
      else if( generateLoginQrStatusResponse && !generateLoginQrStatusResponse.data?.length && generateLoginQrStatusResponse.code !== 0 ){
        console.error( 'Polling Error:', generateLoginQrStatusError );
        clearInterval( pollingIntervalRef.current );
        setIsQrCodeJourney( false )
      }

    }, pollingPeriodicFrequency );
    return () => clearInterval( pollingIntervalRef.current );
  }, [qrCodeId, generateLoginQrStatusResponse, generateLoginQrStatusError] );


  const handleClick = () =>{
    generateQrFetchData();
  }
  return (
    <div className='LoginInterstitial'>
      { QrError ? (
        <>
          <div className='LoginInterstitial__Qrerror-container'>
            <div className='LoginInterstitial__error-message'>
              <Text
                textStyle=''
                color='white'
              >
                { constants.PREVIOUSLY_USED_LOGIN.ERROR_MESSAGE }
              </Text>
            </div>
            <div className='LoginInterstitial__retry-message'>
              <Text
                textStyle=''
                color='white'
              >
                { constants.PREVIOUSLY_USED_LOGIN.RETRY_MESSAGE }
              </Text>
            </div>
            <div className='LoginInterstitial__reload-btn'>
              <Button
                onClick={
                  handleClick
                }
                label={ constants.PREVIOUSLY_USED_LOGIN.RELOAD_QR }
                secondary
                size='medium'
                focusKeyRefrence={ 'USE_REMOTE_ERROR' }
              />
            </div>
            <div className='LoginInterstitial__ORText'>
              <Text
                textStyle=''
                color='white'
              >
                { constants.PREVIOUSLY_USED_LOGIN.OR }
              </Text>
            </div>
            <div className='LoginInterstitial__login-via-remote'>
              <Text
                textStyle=''
                color='white'
              >
                { constants.PREVIOUSLY_USED_LOGIN.LOGIN_VIA_REMOTE }
              </Text>
            </div>
          </div>
        </>
      ) : (
        <div className='LoginInterstitial__bottomContainer--phone'>
          {
            localQRData.current?.data && Object.keys( localQRData.current.data ).length > 0 && (
              <div className='LoginInterstitial__container--steps'>
                <div className='LoginInterstitial__leftSide'>
                  <div className='leftSide_text'>
                    <Text>
                      { parse( localQRData.current.data.verbiages?.stepOneHeading ) }
                    </Text>
                    <Text textStyle='body-2'>
                      { localQRData.current.data.verbiages?.stepOneDetail }
                    </Text>
                  </div>
                  {
                    localQRData.current.data?.loginQrCode && (
                      <div className='LoginInterstitial__leftSide__qr'>
                        <QRCode
                          value={ localQRData.current?.data?.loginQrCode }
                          size={ window.innerWidth === 1920 ? 290 : 190 }
                        />
                      </div>
                    )
                  }
                </div>
                <div className='LoginInterstitial__rightSide'>
                  <div className='rightSide_text'>
                    <Text>
                      { parse( localQRData.current.data?.verbiages?.stepTwoHeading ) }
                    </Text>
                    <Text textStyle='body-2'>
                      { localQRData.current.data?.verbiages?.stepTwoDetail }
                    </Text>
                  </div>
                  <div className={
                    classNames( 'LoginInterstitial__rightSide__code',
                      { 'LoginInterstitial__rightSide__alert':  seconds <= 30 }
                    ) }
                  >
                    <div>
                      { localQRData.current.data?.redirectCode && Array.from( localQRData.current.data?.redirectCode )?.map( ( digit, index )=>(
                        <span key={ index }
                          className='code-digit'
                        >{ digit }</span>
                      ) ) }
                    </div>
                    <div className='LoginInterstitial__rightSide__expirytext'>
                      <span className={
                        classNames( 'LoginInterstitial__rightSide__timer',
                          { 'LoginInterstitial__rightSide__alert':  seconds <= 30 && seconds > 0 }
                        ) }
                      >{ localQRData.current.data?.verbiages?.codeRefreshMessage } { formatTime( seconds ) }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      ) }

    </div>
  )
} );

export default LoginInterstitial;
