
import CryptoJS from 'crypto-js';
import { useAppContext } from '../../views/core/AppContextProvider/AppContextProvider';
import { sendExecptionToSentry } from '../util';
import { SENTRY_LEVEL, SENTRY_TAG } from '../constants';

export const useDecrypetedPlayURL = () => {
  const { configResponse } = useAppContext();
  const { config } = configResponse;

  const getDecryptedPlayURL = ( encryptedData ) => {
    if( !encryptedData ){
      return ''
    }
    try {
      const version = encryptedData.slice( -2 )
      const secretKey = config.dd[version]
      const formattedDecryptUrl = encryptedData.slice( 0, -3 )

      const decryptedText = CryptoJS.AES.decrypt(
        formattedDecryptUrl, CryptoJS.enc.Base64.parse( secretKey ),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        } );
      // eslint-disable-next-line no-console
      console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] Decrypted Live Play URL: `, decryptedText.toString( CryptoJS.enc.Utf8 ) )
      return decryptedText.toString( CryptoJS.enc.Utf8 );
    }
    catch ( error ){
      // eslint-disable-next-line no-console
      console.log( `##[${( performance.now() / 1000 ).toFixed( 2 )} sec] Decrypted Live Play URL Error: `, error )
      sendExecptionToSentry( error, `${ SENTRY_TAG.DECRYPTED_LIVE_URL_ERROR }`, SENTRY_LEVEL.INFO );
      return ''
    }
  }

  return { getDecryptedPlayURL }
};


