import CryptoJS from 'crypto-js';
import { getBaID, getProfileId, getRmn, getValidationKey } from '../localStorageHelper';
import { CHECKSUM_SECRET_KEY } from '../constants';

export const useCheckSum = () => {
  const getEncryptionKey = ( currentSubscription ) => {
    const plainText = `${currentSubscription.productId}_${getBaID()}_${getProfileId()}_${getRmn()}_${currentSubscription.subscriptionStatus}`
    const secretKey = getValidationKey() || CHECKSUM_SECRET_KEY

    const key = CryptoJS.enc.Utf8.parse( secretKey );
    const iv = CryptoJS.enc.Utf8.parse( secretKey?.substring( 0, 16 ) );
    const dataBytes = CryptoJS.enc.Utf8.parse( plainText );

    const cipher = CryptoJS.AES.encrypt( dataBytes, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    } );

    return cipher.toString()
  }

  return { getEncryptionKey }
};


