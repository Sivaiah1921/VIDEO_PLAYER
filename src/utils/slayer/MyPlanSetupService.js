
import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import constants, { CHANGE_PLAN_TYPE, COMMON_HEADERS, SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE, USERS, getPlatformTypeForTA } from '../constants';
import { getAuthToken, getBaID, getDeviceToken, getDthStatus, getProfileId, getSubscriberId, getZeroAppPlanPopupOnRefresh } from '../localStorageHelper';
import { deviceDetailsVerbiage } from '../util';

let title = ''
let subTitle = ''
let subTitle2 = ''
let lowerPlanApps = ''

export const MyPlanSetupService = ( skip ) => {
  let skipRequest = skip;
  if( !getAuthToken() ){
    skipRequest = true
  }
  let currentPlan = {}
  const param = {
    url: serviceConst.CURRENT_SUBSCRIPTION_PLAN,
    method: 'POST',
    headers: {
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      devicetoken: getDeviceToken(),
      'x-authenticated-userid': getSubscriberId(),
      myPlanScreen: true,
      unlocked: false,
      enableFacelift: true,
      contentType: COMMON_HEADERS.CONTENT,
      profileid: getProfileId(),
      device: getPlatformTypeForTA()
    },
    data: {
      'baId': getBaID(),
      'dthStatus': getDthStatus(),
      'accountId': getSubscriberId()
    }
  }
  const { fetchData, response, error, loading } = useAxios( param, skipRequest );
  currentPlan = { fetchData: ( newParams ) => fetchData( Object.assign( param, { data: newParams } ) ), response, error, loading };

  return [currentPlan];
}

export const formatResponse = ( response, flexiPlanVerbiagesContext ) =>{
  const appList = [];
  const lowerPlanAppList = [];
  let selectCard = [];
  let myPlanProps = {};
  let myPlanPropsForNonSubscribe = {};
  let selectCardProps = [];
  let nonComplementaryAppsList = []
  let complementaryAppsList = []
  if( response && response.data ){
    let data = response.data;
    if( data ){
      const partnerList = data.componentList?.[0]?.partnerList || []
      if( partnerList.length > 0 ){
        // nonComplementaryAppsList = partnerList.filter( item => !item.isComplimentary );
        // complementaryAppsList = partnerList.filter( item => item.isComplimentary );

        // commenting above code for codeRevert on Dec Release and adding some dummy key value as noComplementaryValue
        nonComplementaryAppsList = partnerList.filter( item => !item.noComplementaryValue );
        complementaryAppsList = partnerList.filter( item => item.noComplementaryValue );
      }

      if( data.appSelectionRequired ){
        const numberOfApps = flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.numberOfApps || data.componentList?.[0]?.numberOfApps
        for ( let i = 1 ; i <= numberOfApps ; i++ ){
          appList.push( {
            title: `${constants.EMPTY_IMAGE} ${i}`,
            image: data.zeroAppBlankBoxImage,
            isFocussed: false
          } )
        }
      }
      else if( !data.appSelectionRequired && ( data.zeroAppBlankBoxImage || data.componentList?.[0]?.partnerList?.length === 0 ) ){
        const numberOfApps = data.componentList?.[0]?.numberOfApps || flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.numberOfApps
        for ( let i = 1 ; i <= numberOfApps ; i++ ){
          appList.push( {
            title: `${constants.EMPTY_IMAGE} ${i}`,
            image: data.zeroAppBlankBoxImage,
            isFocussed: false
          } )
        }
      }
      else if( data.openFSUpgrade ){
        data.componentList?.map( ( apps ) => {
          apps.partnerList.map( ( partner ) => {
            lowerPlanAppList.push( {
              title: partner.partnerName,
              image: partner.squareImageUrl,
              isFocussed: false
            } )
          } )
        } )
      }
      else {
        data.componentList?.map( ( apps ) => {
          apps.partnerList.map( ( partner ) => {
            if( partner.squareImageUrl ){
              appList.push( {
                title: partner.partnerName,
                image: partner.squareImageUrl,
                isFocussed: false
              } )
            }
          } )
        } )
      }
      if( lowerPlanAppList.length > 0 ){
        lowerPlanApps = lowerPlanAppList
        title = data.openFSDetails?.upgradeHeader
        subTitle = data.openFSDetails?.upgradeCurrent
        subTitle2 = data.openFSDetails?.upgradeBenefit
      }
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const differenceMs = Math.abs( new Date( data.expiryDateWithTime ) - new Date() );
      const daysRemaining =  Math.round( differenceMs / ONE_DAY ) + 1 + 'D'
      if( !data.productId ){
        myPlanPropsForNonSubscribe = {
          liveChannelIds: data.liveChannelIds,
          apvDetails: data.apvDetails || {}
        }
        return { myPlanProps, selectCardProps: [], myPlanPropsForNonSubscribe }
      }
      myPlanProps = {
        upgradeMyPlanTitle: 'My Plan',
        upgradeMyPlanType:  data.productName,
        upgradeMyPlan: String( data.amount ), // pack amount
        upgradeMyPlanExpire: data.packValidity,
        expiryDate: data.expiryDate,
        expiryDateWithTime: data.expiryDateWithTime,
        nonSubscribedPartnerList: data.nonSubscribedPartnerList || [],
        apps: appList,
        tenure: data.tenure || [],
        subscriptionType: data.subscriptionType,
        subscriptionStatus: data.subscriptionStatus,
        isNetflixCombo: data.netflixCombo,
        comboInfo: data.comboInfo || {},
        netflixData: data.netflixData,
        isCombo: data.combo,
        isLowerPlan: data.openFSUpgrade,
        lowerPlanProps: {
          title,
          subTitle,
          subTitle2,
          apps: lowerPlanApps
        },
        amountValue: data.amountValue,
        amountTimePeriod: data.amountTimePeriod,
        daysRemaining: daysRemaining,
        footerMsg: data.expiryFooterMessage,
        paymentMethod: data.paymentMethod,
        fdoRequested: data.fdoRequested,
        upgradeFDOCheck: data.upgradeFDOCheck,
        productId: data.productId,
        paymentMode: data.paymentMode,
        currentTenure: data.currentTenure,
        currentTenureOpen: data.currentTenureOpen,
        deviceDetails: deviceDetailsVerbiage( data ),
        liveChannelIds: data.liveChannelIds,
        bingeAppleState: data.bingeAppleState,
        nonAvailablePartners: data.nonAvailablePartners || '',
        ahaFooterMessage: data.ahaFooterMessage || '',
        jioCinemaFooterMessage: data.jioCinemaFooterMessage || '',
        nonAvailablePartnersSamsung: data.nonAvailablePartnersSamsung || '',
        shemarromeConfig: data.shemarromeConfig,
        checkSum: data.checkSum,
        subscriptionPackType: data.subscriptionPackType,
        userSelectedApps: data.userSelectedApps || '',
        isFlexiPlan: data.flexiPlan || '',
        myPlanOpenFSDetailsFooterMessage: data.openFSDetails?.footerMessage,
        myPlanOpenFSDetailsRenewalMessage: data.openFSDetails?.renewalmessage,
        apvDetails: data.apvDetails || {},
        appleDetails: data.appleDetails || {},
        fiberVerbiage: data.fiberVerbiage,
        ispEnabled: data.ispEnabled,
        ispHeaderVerbiage: data.ispHeaderVerbiage,
        appSelectionRequired: data.appSelectionRequired || false,
        renewButtonOption: data.planOption?.renewButtonOption,
        downgradeRequested: data.downgradeRequested || false,
        zeroAppBlankBoxImage: data.zeroAppBlankBoxImage,
        complementaryAppsList: complementaryAppsList,
        nonComplementaryAppsList: nonComplementaryAppsList,
        maxCardinalityReached: data.maxCardinalityReached || false,
        primeAddOn: data.primeAddOn || {},
        addonPartnerList: data.addonPartnerList || []
      }

      const currentTenure = data.tenure?.find( subs => subs.currentTenure || subs.lastActiveTenure )
      const isFibrePlan = data.ispEnabled ? ( data.ispEnabled && data.planOption?.changePlanOption ) : data.planOption?.changePlanOption
      selectCard = [
        {
          iconImage: '',
          deviceName:  flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.chooseAppCTAEnable && data.appSelectionRequired ? flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.chooseAppCTA || flexiPlanVerbiagesContext.current?.data.lsAppSelectionPopupVerbiages?.chooseAppCTA || constants.CHOOSE_ONE_APP : null,
          iconImageArrow: 'ArrowForwardNew',
          deviceType: 'NA',
          url: '',
          type: flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.chooseAppCTAEnable && data.appSelectionRequired,
          title: constants.CHOOSE_ONE_APP
        },
        {
          deviceType: 'plan-option',
          iconImage: 'CrownWithBG',
          deviceName: data.subscriptionType !== SUBSCRIPTION_TYPE.ANDROID_STICK && data.subscriptionType !== SUBSCRIPTION_TYPE.ATV && isFibrePlan ? data.planOption?.changePlanMessage || constants.CHANGE_PLAN : null,
          iconImageArrow: 'ArrowForwardNew',
          url: data.subscriptionStatus === SUBSCRIPTION_STATUS.DEACTIVE && getDthStatus() === USERS.DTH_NEW_STACK_USER ? '/plan/renew/current' : '/plan/subscription',
          type: data.subscriptionType === SUBSCRIPTION_TYPE.ANYWHERE,
          title: constants.CHANGE_PLAN
        },
        {
          deviceType: 'plan-option',
          iconImage: 'Calender',
          deviceName: data.planOption?.changeTenureOption ? data.planOption?.changeTenureMessage || constants.CHANGE_TENURE : null,
          iconImageArrow: 'ArrowForwardNew',
          url: '/plan/change-tenure/' + data.productId + '/' + CHANGE_PLAN_TYPE.TENURE + '/my-plan',
          type: data.subscriptionType === SUBSCRIPTION_TYPE.ANYWHERE,
          title: constants.CHANGE_TENURE
        },
        {
          iconImage: '',
          deviceName:   data.planOption?.cancellationOption?.cancelButtonOption ? data.planOption?.cancellationOption.cancelButtonMessage || constants.CANCEL_PLAN : null,
          iconImageArrow: '',
          deviceType: 'NA',
          url: '',
          type: data.planOption?.cancellationOption?.cancelButtonOption,
          title: constants.CANCEL_PLAN
        },
        {
          iconImage: '',
          deviceName:   data.planOption?.renewButtonOption ? data.planOption?.renewButtonMessage || constants.RENEW_PLAN : null,
          iconImageArrow: '',
          deviceType: 'NA',
          url: '/plan/purchase/' + data.productId + '/' + CHANGE_PLAN_TYPE.RENEWAL + '/' + ( currentTenure?.tenureId || data.tenure?.[0]?.tenureId || data.productId ),
          type: false,
          title: constants.RENEW_PLAN
        }
      ]
    }

  }

  selectCardProps = selectCard?.filter( ( item ) => {
    return item.deviceName;
  } );

  return { myPlanProps, selectCardProps, myPlanPropsForNonSubscribe }

}


export const UpgradeRechargeURL = ( ) => {
  let QRCode = {}
  const params = {
    url: serviceConst.UPGRADE_QRCODE,
    method: 'POST',
    headers: {
      dsn: getBaID(),
      platform: COMMON_HEADERS.PLATFORM,
      deviceid: COMMON_HEADERS.DEVICE_ID,
      authorization: getAuthToken(),
      cl_subscriberid: getSubscriberId(),
      profileid: getProfileId()
    },
    data: {
      'baId': getBaID(),
      'dsn': getBaID(),
      'sid': getSubscriberId()
    }
  }
  const { fetchData : fetchQRCode, response: QRcodeResponse, error: QRCodeError, loading: QRcodeLoading } = useAxios( {}, true );
  QRCode = { fetchQRCode: ( newParams ) => fetchQRCode( { ...params, ...Object.assign( params.data, newParams ) } ), QRcodeResponse, QRCodeError, QRcodeLoading };

  return [QRCode];
}

export const UpgradeFlowStatus = ( ) => {
  let upgradeLowerPack = {}
  const params = {
    url: serviceConst.UPGRADE_PAYMENT_STATUS,
    method: 'POST',
    headers: {
      dsn: getBaID(),
      platform: COMMON_HEADERS.PLATFORM,
      deviceid: COMMON_HEADERS.DEVICE_ID,
      authorization: getAuthToken(),
      cl_subscriberid: getSubscriberId(),
      profileid: getProfileId(),
      chooseApps: !!getZeroAppPlanPopupOnRefresh()
    },
    data: {
      'baId': getBaID(),
      'dthStatus': getDthStatus()
    }
  }
  const { fetchData : UpgradePack, response: UpgradePackResponse, error: UpgradePackError, loading: UpgradePackLoading } = useAxios( {}, true );
  upgradeLowerPack = { UpgradePack: ( newParams ) => UpgradePack( params ), UpgradePackResponse, UpgradePackError, UpgradePackLoading };

  return [upgradeLowerPack];
}