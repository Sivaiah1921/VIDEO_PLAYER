import { useAxios } from './useAxios';
import { serviceConst } from './serviceConst';
import { getAuthToken, getBaID, getDeviceToken, getDthStatus, getSubscriberId, getTVDeviceId } from '../localStorageHelper';
import constants, { COMMON_HEADERS, CHANGE_PLAN_TYPE, SUBSCRIPTION_STATUS } from '../constants';
import { deviceDetailsVerbiage, showCurrentTag } from '../util';
import { getIcon } from '../commonHelper';

export const ProratedBalanceAPICall = ( props ) => {
  let balance = {}
  const param =  {
    url: serviceConst.GET_USER_BALANCE,
    method: 'POST',
    headers: {
      devicetoken: getDeviceToken(),
      authorization: getAuthToken(),
      dthstatus: getDthStatus(),
      subscriberid: getSubscriberId(),
      'content-type': COMMON_HEADERS.CONTENT,
      platform: COMMON_HEADERS.PLATFORM
    },
    data: props
  }
  const { fetchData: proratedFetchBalance, response:  proratedBalanceResponse, error:  proratedBalaceAPIError, loading:  proratedBalaceAPILoading } = useAxios( param, true );
  balance = { proratedFetchBalance: ( newParams ) => proratedFetchBalance( Object.assign( param, { data: newParams } ) ), proratedBalanceResponse, proratedBalaceAPIError, proratedBalaceAPILoading };

  return [balance];
}

export const PackListCall = () => {
  let packList = {}
  const param = {
    url: getAuthToken() ? serviceConst.PACK_LIST + getBaID() : serviceConst.PACK_LIST_GUEST_USER,
    method: 'GET',
    headers: {
      enableFacelift: true,
      assetID: getTVDeviceId(),
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      devicetoken: getDeviceToken()
    }
  }
  const { fetchData, response, error, loading } = useAxios( {}, true );
  packList = { fetchData: ( newParams ) => fetchData( Object.assign( param, { data: newParams } ) ), response, error, loading };

  return [packList];
}

export const PackValidationAPICall = ( props ) => {
  let packValidation = {}
  const param = {
    url: serviceConst.PACK_VALIDATION + '/' + props?.baId + '/' + props?.updatedPackId,
    method: 'GET',
    headers: {
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberId: getSubscriberId()
    }
  }
  const { fetchData: fetchpackvalidation, response: packValidationResponse, error: packValidationError, loading: packValidationLoading } = useAxios( {}, true );
  packValidation = { fetchpackvalidation: ( newParams ) => fetchpackvalidation( Object.assign( param, newParams ) ), packValidationResponse, packValidationError, packValidationLoading };

  return [packValidation];
}

export const AddPackAPI = ( props ) => {
  let addPack = {}
  const param = {
    url: serviceConst.ADD_PACK,
    method: 'POST',
    headers: {
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      'content-type': COMMON_HEADERS.CONTENT,
      deviceid: getTVDeviceId()
    },
    data: props
  }
  const { fetchData: fetchpack, response: addedPackResponse, error: addedPackError, loading: addedPackLoading } = useAxios( {}, true );
  addPack = { fetchpack: ( newParams ) => fetchpack( Object.assign( param, { data: newParams } ) ), addedPackResponse, addedPackError, addedPackLoading };

  return [addPack];
}

export const ModifyPackAPI = ( props ) => {
  let modifyPack = {}
  const param = {
    url: serviceConst.MODIFY_PACK,
    method: 'POST',
    headers: {
      dthstatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberid: getSubscriberId(),
      deviceid: COMMON_HEADERS.DEVICE_ID,
      'Content-Type': COMMON_HEADERS.CONTENT
    },
    data: props
  }
  const { fetchData: modifyPackRequest, response: modifiedPackResponse, error: modifiedPackError, loading: modifiedPackLoading } = useAxios( {}, true );
  modifyPack = { modifyPackRequest: ( newParams ) => modifyPackRequest( Object.assign( param, { data: newParams } ) ), modifiedPackResponse, modifiedPackError, modifiedPackLoading };

  return [modifyPack];
}

export const VerbiagesDetailApi = ( props ) => {
  let verbiageDetails = {}
  const param = {
    url: serviceConst.DETAILS_VERBIAGES_URL,
    method: 'GET',
    headers: {
      dthStatus: getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      baId:  getBaID(),
      deviceId: getTVDeviceId(),
      journey:''
    }
  }
  const { fetchData: fetchverbiageDetails, response: verbiageDetailsResponse, error: verbiageDetailsError, loading: verbiageDetailsLoading } = useAxios( {}, true );
  verbiageDetails = { fetchverbiageDetails: ( newParams ) => fetchverbiageDetails( { ...param, ...Object.assign( param.headers, newParams ) } ), verbiageDetailsResponse, verbiageDetailsError, verbiageDetailsLoading };

  return [verbiageDetails];
}

export const ChargeRequestAPI = ( props ) => {
  let chargeRequest = {}
  const param = {
    url: serviceConst.CHARGE_REQUEST,
    method: 'POST',
    headers: {
      'content-type': COMMON_HEADERS.CONTENT,
      authorization: getAuthToken()
    },
    data: props
  }
  const { fetchData: chargeRequestAPI, response: chargeRequestResponse, error: chargeRequestError, loading: chargeRequestLoading } = useAxios( {}, true );
  chargeRequest = { chargeRequestAPI: ( newParams ) => chargeRequestAPI( Object.assign( param, { data: newParams } ) ), chargeRequestResponse, chargeRequestError, chargeRequestLoading };

  return [chargeRequest];
}

export const PaymentStatusAPICall = ( props ) => {
  let paymentStatus = {}
  const param = {
    url: serviceConst.PAYMENT_STATUS,
    method: 'POST',
    headers: {
      dthStatus: getDthStatus(),
      authorization: getAuthToken(),
      subscriberId: getSubscriberId(),
      'content-type': COMMON_HEADERS.CONTENT,
      unlocked: false
    },
    data: props
  }
  const { fetchData: fetchPaymentStatus, response: paymentStatusResponse, error: paymentStatusError, loading: paymentStatusLoading } = useAxios( {}, true );
  paymentStatus = { fetchPaymentStatus: ( newParams ) => fetchPaymentStatus( Object.assign( param, { data: newParams } ) ), paymentStatusResponse, paymentStatusError, paymentStatusLoading };

  return [paymentStatus];
}

export const CancelSubscription = ( ) => {
  let cancelSubscriptionObj = {}
  const params = {
    url: serviceConst.CANCEL_SUBSCRIPTION,
    method: 'POST',
    headers: {
      dthstatus: getDthStatus(),
      authorization: getAuthToken(),
      platform: COMMON_HEADERS.PLATFORM,
      'content-type': COMMON_HEADERS.CONTENT,
      'x-authenticated-userid': getSubscriberId()
    },
    data: {
      baId:  getBaID(),
      accountId:  getSubscriberId(),
      primeCancellation: false,
      bingeCancellation:true
    }
  }
  const { fetchData: cancelSubsription, response: cancelSubscriptionResponse, error: cancelSubscriptionError, loading: cancelSubscriptionLoading } = useAxios( {}, true );
  cancelSubscriptionObj = { cancelSubsription: ( newParams ) => cancelSubsription( params ), cancelSubscriptionResponse, cancelSubscriptionError, cancelSubscriptionLoading };

  return [cancelSubscriptionObj];
}

const getCurrentPlanDetails = ( currentPackResponse, tenureId ) => {
  let obj = {}
  const item = currentPackResponse && currentPackResponse.data;
  if( !item ){
    return obj;
  }
  if( item ){
    const selectedTenure =  tenureId ? item.tenure?.find( ( tenure ) => tenure.tenureId === tenureId ) : null
    const appList = []
    obj = {
      title: item.productName,
      titleIcon: 'CrownGoldForward',
      titlePremium: false,
      appLabel: 'apps',
      deviceDetails: selectedTenure ? selectedTenure.totalAppCountText : deviceDetailsVerbiage( item ),
      deviceIcon: 'Devices',
      monthlyPlan: item.amount,
      apps: appList,
      productId: item.productId,
      tenure: item.tenure,
      amountValue: item.amountValue,
      packCycle: item.packCycle,
      nonAvailablePartners: item.nonAvailablePartners,
      ahaFooterMessage: item.ahaFooterMessage,
      jioCinemaFooterMessage: item.jioCinemaFooterMessage,
      nonAvailablePartnersSamsung: item.nonAvailablePartnersSamsung,
      currentTenure: item.currentTenure,
      amountWithoutTimePeriod: item.amountWithoutTimePeriod,
      flexiPlan: item.flexiPlan
    }
    if( selectedTenure && selectedTenure.partnerList?.length > 0 ){
      selectedTenure.partnerList?.map( ( partner ) => {
        appList.push( {
          title: partner.partnerName,
          image: partner.squareImageUrl,
          isFocussed: false
        } )
      } )
    }
    else {
      item.componentList?.map( ( apps ) => {
        apps.partnerList.map( ( partner ) => {
          appList.push( {
            title: partner.partnerName,
            image: partner.squareImageUrl,
            isFocussed: false
          } )
        } )
      } )
    }
  }

  return obj

}
export const formatResponse = ( packResponse, myplan ) => {
  const subscriptionPackagesList = [];
  let appList = [];
  const packs =  !getAuthToken() ? packResponse?.data : packResponse?.data?.eligibleListDTOList
  packs && Array.isArray( packs ) && packs.map( ( item ) => {
    appList = []
    subscriptionPackagesList.push( {
      title: item.productName,
      titleIcon: 'CrownWithBG',
      titlePremium: false,
      appLabel: 'apps',
      deviceDetails: deviceDetailsVerbiage( item ),
      deviceIcon: 'Devices',
      monthlyPlan: item.amount,
      apps: appList,
      tag:  showCurrentTag( myplan, item ) ? constants.CURRENT_PLAN : '',
      productId: item.productId,
      tenure: item.tenure,
      amountValue: item.amountValue,
      packCycle: item.packCycle,
      nonAvailablePartners: item.nonAvailablePartners || '',
      ahaFooterMessage: item.ahaFooterMessage || '',
      jioCinemaFooterMessage: item.jioCinemaFooterMessage || '',
      nonAvailablePartnersSamsung: item.nonAvailablePartnersSamsung || '',
      flexiPlan: item.flexiPlan,
      flexiPlanImageUrl: item.flexiPlanImageUrl
    } )
    item.componentList?.map( ( apps ) => {
      apps.partnerList.map( ( partner ) => {
        if( partner.included ){
          appList.push( {
            title: partner.partnerName,
            image: partner.squareImageUrl,
            isFocussed: false,
            soureReferenceId: partner.partnerId
          } )
        }
      } )

    } )
  } )
  let plancard = {}
  if( packResponse && packResponse.data ){
    plancard = {
      subscriptionPackageTitleIcon: 'CrownGoldForward40x40',
      subscriptionPackageTitle: myplan?.productId && myplan?.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE ? packResponse.data.changePlanHeader : packResponse.data.header || constants.SUBSCRIPTION_PACKAGE_TITLE,
      subscriptionPackageSubTitle: packResponse.data.subHeader ? packResponse.data.subHeader : constants.SUBSCRIPTION_PACKAGE_SUBTITLE,
      subscriptionPackages: subscriptionPackagesList,
      deactivateStatusVerbiage: packResponse.data.deactivateStatusVerbiage
    }
  }
  return { packResponse, plancard }
}

export const formatBalanceResponse = ( response, amount ) => {
  let balanceProps = {};
  if( response && response.data ){
    balanceProps = {
      adjustmentText:  response.data.currentBalanceVerbiage ? response.data.currentBalanceVerbiage : constants.ADJUSTMENT_FROM_LAST_PAY,
      adjustmentAmount: response.data.currentBalance ? response.data.currentBalance : '₹0',
      payableAmountText: response.data.payableAmountVerbiage ? response.data.payableAmountVerbiage : constants.PAYABLE_AMOUNT,
      payableAmount: response.data.payableAmount ? response.data.payableAmount : amount || '₹0',
      payableAmountNew: response.data.amount ? response.data.amount : 0,
      btnLabel:  constants.CONFIRM_PURCHASE_CTA,
      proRateFooterMessage: response.data.proRateFooterMessage,
      currentBalance: response.data.currentBalance
    }
  }

  return { balanceProps }
}

export const fetchTenure = ( plancard, productId, type, currentPlanResponse, location ) => {
  if( !plancard || !productId ){
    return;
  }
  let selectedPlan = plancard.subscriptionPackages?.find( ( item ) => item.productId === productId )
  if( currentPlanResponse && location ){
    const item = getCurrentPlanDetails( currentPlanResponse, null )
    selectedPlan = item || {}
  }
  const tenure = [];
  const selectedTenure =  selectedPlan?.tenure?.filter( ( tenure ) => tenure.enable === true )
  selectedTenure?.map( ( item ) => {
    tenure.push( {
      icon : getIcon( item.tenureType ),
      plan: item.tenureType,
      tenureId: item.tenureId,
      amount: item.offeredPrice,
      savings:'',
      productId: item.tenureId,
      amountWithoutCurrency: item.offeredPriceValue
    } )
  } )
  const planDetail = {
    title: selectedPlan?.title,
    headTitle: type === CHANGE_PLAN_TYPE.UPGRADE ? constants.SELECT_TENURE : constants.CHANGE_TENURE,
    records: tenure,
    apps: selectedPlan?.apps,
    headerVerbiage: currentPlanResponse?.data?.planOption?.tenureScreenHeading || '',
    deviceDetails: selectedPlan?.deviceDetails,
    nonAvailablePartners: selectedPlan?.nonAvailablePartners || currentPlanResponse?.data?.nonAvailablePartners,
    ahaFooterMessage: selectedPlan?.ahaFooterMessage,
    jioCinemaFooterMessage: selectedPlan?.jioCinemaFooterMessage,
    nonAvailablePartnersSamsung: selectedPlan?.nonAvailablePartnersSamsung || currentPlanResponse?.data?.nonAvailablePartnersSamsung,
    flexiPlan: selectedPlan?.flexiPlan
  }
  return planDetail;
}

export const getPlanDetail = ( plancard, productId, tenureId, myPlanProps, currentPlanResponse, type, flexiPlanVerbiagesContext ) => {
  if( !plancard || !productId ){
    return;
  }
  const id =  type === CHANGE_PLAN_TYPE.TENURE ? tenureId : productId
  let selectedPlan;
  if( !window.location.pathname.includes( 'TENURE/my-plan' ) ){
    selectedPlan = plancard.subscriptionPackages?.find( ( item ) => item.productId === id )
  }
  if( !selectedPlan && currentPlanResponse ){
    const item = getCurrentPlanDetails( currentPlanResponse, tenureId )
    selectedPlan = item || {}
  }
  else if( selectedPlan && currentPlanResponse?.data?.flexiPlan && type === CHANGE_PLAN_TYPE.RENEWAL ){
    const item = getCurrentPlanDetails( currentPlanResponse, tenureId )
    selectedPlan = item || {}
  }
  const selectedTenure =  selectedPlan?.tenure?.filter( ( tenure ) => tenure.enable === true )
  let planDetail = {
    apps: selectedPlan?.apps,
    upgradeMyPlanTitle: constants.PURCHASE_CONFIRMATION,
    upgradeMyPlan: selectedPlan?.title,
    tenure: selectedTenure,
    deviceDetails: selectedPlan?.deviceDetails,
    nonAvailablePartners: selectedPlan?.nonAvailablePartners || currentPlanResponse?.data?.nonAvailablePartners,
    ahaFooterMessage: selectedPlan?.ahaFooterMessage,
    jioCinemaFooterMessage: selectedPlan?.jioCinemaFooterMessage,
    nonAvailablePartnersSamsung: selectedPlan?.nonAvailablePartnersSamsung || currentPlanResponse?.data?.nonAvailablePartnersSamsung
  }

  if( currentPlanResponse?.data?.appSelectionRequired && ( type === CHANGE_PLAN_TYPE.RENEWAL || type === CHANGE_PLAN_TYPE.TENURE ) ){
    let appListZeroApps = []
    for ( let i = 1 ; i <= flexiPlanVerbiagesContext.current?.data.myPlanVerbiages?.numberOfApps ; i++ ){
      appListZeroApps.push( {
        title: `${constants.EMPTY_IMAGE} ${i}`,
        image: currentPlanResponse?.data?.zeroAppBlankBoxImage,
        isFocussed: false
      } )
    }
    planDetail = { ...planDetail, apps: appListZeroApps }
  }

  let tenure =  selectedPlan && selectedPlan.tenure && selectedPlan.tenure.find( ( item ) => item.tenureId === tenureId )
  const currentResponse = getCurrentPlanDetails( currentPlanResponse, tenureId )
  if( !tenure && currentResponse ){
    if( selectedPlan && selectedPlan.tenure && Array.isArray( selectedPlan.tenure ) && selectedPlan.tenure.length > 0 ){
      tenure = selectedPlan.tenure[0]
    }
    else {
      tenure = {
        tenureType: currentResponse.currentTenure,
        tenureId: productId,
        offeredPrice: `&#8377;` + currentResponse.amountValue,
        offeredPriceValue: currentResponse.amountWithoutTimePeriod
      }
    }

  }

  const records = {
    ...( tenure && {
      icon : tenure.tenureType,
      plan: tenure.tenureType,
      amount: tenure.offeredPrice,
      savings:''
    } )
  }

  const params = {
    accountId: getSubscriberId(),
    baId: getBaID(),
    currentPackId: productId,
    ...( tenure && {
      updatedPackId: tenure.tenureId,
      amount: tenure.offeredPrice,
      amountWithoutCurrency: tenure.offeredPriceValue,
      productName: tenure.tenureType,
      subscriptionType: tenure.tenureType
    } )

  }

  const data = {
    planDetail: planDetail,
    records: records,
    params: params,
    currentTenure: tenure
  }
  return data;
}


