export const isTizen = !!window.webapis;
export const constants =  {
  INTERSECTION_OBSERVER_OPTIONS:{
    rootMargin:'0px',
    root : null,
    threshold: [0, 0.25, 0.5, 0.75, 1]
  },
  PI_DETAILS:{
    STARRING: 'Starring',
    DIRECTOR: 'Director',
    PRODUCER: 'Producer',
    GENRE: 'Genre'
  },
  MY_ACCOUNT:{
    MYACCOUNT_TITLE: 'My Account',
    MYPLAN: 'My Plan',
    EDIT_PROFILE: 'Edit Profile',
    REFRESH_ACCOUNT: 'Refresh Account',
    RECHARGE: 'Recharge',
    BINGE_LOGO: 'BingeLogo',
    SUBSCRIBE: 'Subscribe',
    VALID_EMAIL_ID: 'Please enter a valid Email ID',
    CHARACTER_LIMIT: `You can't enter anymore characters`,
    EMPTY_RENAME: `Device name can't be empty`,
    CHARACTER_100_LIMIT: 'Device name cannot exceed 100 characters',
    FLEXI_LITE: 'Flexi Lite'
  },
  APP_EXIT_SCREEN:{
    iconName : 'Logout80x81',
    message: 'Exiting Tata Play Binge',
    info: 'Do you want to proceed?',
    buttonLabelYes: 'Yes',
    buttonLabelNo: 'No'
  },
  BINGE_LIST_VERBIAGE: {
    SUBHEADER: 'Browse through exciting Movies and TV Shows and save it in your Binge List',
    EMPTY: 'Your Binge List is empty',
    BUTTON_CTA: 'Discover to Add'
  },
  CONSTACT_US: {
    icon: 'Contact',
    emailText: 'Email : ',
    telephoneText: 'Telephone : ',
    helpText1: 'Please visit <span>tataplaybinge.com</span> for help.',
    helpText2: 'We will be happy to assist you there. ',
    btnTitleFAQ: 'FAQs',
    btnTitleTerms: 'Terms of Use'
  },
  USER_PROFILE_DETAILS:{
    ICON_IMAGE: 'Profile80x80',
    TV_DETAILS: 'Briju’s Fire TV',
    TV_DETAILS_ICON: 'Television',
    PROFILE_IMAGE: 'Profile image'
  },
  USER_ACCOUNT_DETAILS : {
    USER_NAME: 'Tata Play Balance',
    PAYMENT_METHOD: 'Payment Method'
  },
  EDIT_PROFILE_DETAILS: {
    ICON_IMAGE: 'Profile32x32',
    EDIT_PROFILE_TITLE: 'Edit Profile',
    EDIT_PROFILE_NAME:'Name',
    REGISTERED_MOBILE_LABEL:'Registered Mobile Number',
    MOBILE_PREFIX_NUMBER: '+91',
    EMAIL_LABEL: 'Email',
    UPDATE_BUTTON_LABEL: 'Update'
  },
  RENAME_DEVICE: {
    TITLE : 'Rename Device',
    SECTION_INFO: 'Key in preferred device name'
  },
  RELATED_CONTENT: 'RelatedContent',
  CHANGE_PLAN: 'Change Plan',
  CHANGE_TENURE: 'Change Tenure',
  CHOOSE_ONE_APP: 'Choose Apps',
  CANCEL_PLAN: 'Cancel Plan',
  RENEW_PLAN: 'Renew Plan',
  SHOW_FILTER: 'Show Filter',
  HIDE_FILTER: 'Hide Filter',
  FILLED_INPUT_WITH_NO_DATA: 'FILLED_INPUT_WITH_NO_DATA',
  LANGUAGEUPDATEMSG: 'Video Language Successfully Updated.',
  SHUFFLE_TEXT: 'Shuffle',
  LOGINBTN_NAME:'Proceed',
  MAX:10,
  ONLY_CLOSE: 'Close',
  CLOSE: 'To Close',
  RESULTS: 'Results',
  NORESULTS: 'Sorry, we can\'t find what you are looking for. Try again?',
  LOGORECTANGULAR: 'logoRectangular',
  RAILPAGELOGO: 'railPageLogo',
  LOGOCIRCULAR: 'logoCircular',
  LOGOPROVIDERBBA: 'logoProviderBBA',
  GOBACK: 'Go Back',
  TOCLOSE: 'To Close',
  RETRY: 'Retry',
  CLEARBTN_LABEL: 'Clear',
  CONTENT_NOT_FOUND: 'Sorry, content not found!',
  ERROR_MSG: 'Sorry, we are unable to connect you at the moment. Please try again',
  TRY_AGAIN_VERBIAGE: 'Please try again',
  ERROR: 'ERROR',
  DELETEBTN_LABEL: 'Delete',
  SPACEBTN_LABEL: 'Space',
  UPDATE_BUTTON_LABEL: 'Update',
  MORE_LABEL: 'More',
  STARRING: 'Starring',
  DIRECTOR: 'Director',
  PRODUCERS: 'Producers',
  SUBTITLES: 'Subtitles',
  GENRE: 'Genre',
  AUDIO: 'Audio',
  PLAYBTN_LABEL: 'Play',
  SUBSCRIBE_TO_WATCH: 'Subscribe To Watch',
  SUBSCRIBE_TO_WATCH1: 'Subscribe to Watch',
  UPGRADE_TO_WATCH: 'Upgrade To Watch',
  LOGIN_TO_WATCH: 'Login To Watch',
  PLAYBTN_LABEL_LIVE: 'Play Now',
  VIEW_TRAILER: 'View Trailer',
  ADD_TO_BINGE_LIST: 'Add to Binge List',
  REMOVE_FROM_BINGE_LIST: 'Removed from Binge List',
  ADDED_TO_BINGE_LIST: 'Added to Binge List',
  BINGE_LIST: 'Binge List',
  EDIT: 'Edit',
  REMOVE: 'Remove',
  DONE: 'Done',
  VIEW_ALL: 'View All Episodes',
  ENTER_RMN: 'Enter Registered Mobile Number',
  LOGIN: 'Login',
  SUBSCRIBE: 'Subscribe',
  MY_PLAN: 'My Plan',
  TnC_LABEL1: 'I accept the ',
  TnC_LABEL2: 'Terms and Conditions',
  TNC_TEXT: 'By Proceeding, you accept the License Agreement',
  BACK_TO_CLOSE: 'Back to Close',
  NUM_PREFIX: '+91',
  OTP: 'OTP',
  RMN: 'RMN',
  ENTER_OTP: 'Please enter the OTP sent to',
  OTP_EXPIRE: 'Resend OTP in',
  RESEND_OTP: 'Resend OTP',
  SECONDS: 's',
  OTP_SECS: '30',
  LANGUAGE_TITLE: 'Video Language',
  BUTTON_PLAY_TEXT:'Play',
  SUBSCRIBER_LIST_TITLE: 'Select Subscriber ID',
  SUBSCRIBER_MSG: 'You have multiple Subcription IDs linked to your Registered Mobile Number.  Please select the one you wish to continue.',
  DEVICE_LIST_TITLE: 'Select Device',
  DEVICE_MSG: 'You have multiple Subcription IDs linked to your Registered Mobile Number.  Please select the one you wish to continue.',
  DEVICE_MANAGEMENT: 'Device Management',
  DEVICE_MAIN_LOGIN: 'Logged in Devices',
  DEVICE_MAIN_SEC: 'Only 1 large screen can be accessed and 3 small screen can be viewed at a given point of time.',
  PRIMARY_DEVICE_TITLE: 'Primary Device',
  DEVICE_INFO: 'The Primary device cannot be removed',
  DEVICE_COUNT: '1 out of 1',
  OTHER_DEVICES: 'Other Devices',
  LESS_DEVICES: 'You can log into a maximum of 4 devices at a time',
  RENAME: 'Rename',
  OTP_RESENT: 'OTP successfully sent',
  BINGE: 'BINGE',
  BINGE_LOGO: 'BingeLogo',
  TATA_PLAY_BINGE_LOGO: 'TataPlayBingeLogo',
  DIVIDER_WITH_PLUS: 'DividerWithPlus',
  COMBOPACK_APP_TITLE: '12 Entertainment Apps',
  COMBOPACK_TV_CHANNALS: '145 TV Channels',
  COMBOPACK_DICLAIMER: 'Channels are available on TV with your Tata Sky Set Top Box',
  COMBOPACK_FOOTER_MSG1: 'Subscription amount will be deducted from your Tata sky balance every 30 days',
  COMBOPACK_FOOTER_MSG2: 'Please visit tataplay.com to make any changes to the plan.',
  DEFAULT: 'Default',
  ACTIVE: 'ACTIVE',
  PREVIOUSLY_USED_LOGIN: {
    LOG_IN: 'Log In',
    PREVIOUSLY_USED: 'Previously used',
    NEW_LOG_IN: 'New Log In',
    LOG_IN_INTER: 'Choose how to login',
    USE_PHONE: 'Use Phone',
    USE_REMOTE: 'Use Remote',
    RELOAD_QR: 'Reload QR Code',
    ERROR_MESSAGE: 'We are unable to load the QR Code at this moment.',
    RETRY_MESSAGE: 'Retry loading the QR Code',
    OR: 'OR',
    LOGIN_VIA_REMOTE: 'Login via the remote method'
  },
  SEARCH_PAGE: {
    TITLES_RELATED_TO: 'Titles Related To',
    FILTER_BY_LANGUAGE: 'Filter By Language',
    FILTER_BY_GENRE: 'Filter By Genre',
    TRENDING: 'Trending',
    SEARCH_SUGGESTIONS: 'SEARCH-SUGGESTIONS',
    SEARCH_RESULT: 'SEARCH-RESULT'
  },
  PARENTALPIN_SETUP: {
    ICON: 'ParentalLock35x50',
    TITLE: 'Enter PIN',
    SUBTITLE: 'Enter the 4 Digit Parental PIN',
    HELPTEXT: 'Forgot PIN? You can change your Parental PIN from tataplaybinge.com or Tata Play Binge Mobile App',
    BUTTON_LABEL: 'Proceed',
    DELETEBTN_LABEL: 'Delete',
    CLEARBTN_LABEL: 'Clear'
  },
  TRANSACTION_HISTORY_PAGE: {
    ICON: 'TransactionHistory2',
    TITLE: 'Transaction History'
  },
  AUTOPLAY_TITLE: 'Autoplay Trailer',
  AUTOPLAY_MSG: 'When autoplay is on, the trailer will start playing automatically',
  DONE_BTN: 'Done',
  DONE_MSG: 'Your preference has been updated successfully.',
  AUTOPLAY_ERROR_MSG: 'An error occurred while updating',
  DEVICE_LIMIT_EXCEED: 'Device Limit Exceed',
  EP: 'EP',
  placeHolderText: 'Enter Text Here',
  OTP_ERROR: 'Login Failed. Please try again in some time. Please call Tata Play helpline for further details.(Error Code - 0)',
  RAIL_PAGE_LOGO: 'railPageLogo',
  STATIC_PARTNER_PAGE_LOGO: 'staticPartnerPageLogo',
  PROVIDER_PI_PAGE_LOGO: 'providerPiPageLogo',
  FREE: 'FREE',
  EMPTY_API_RESPONSE: 'API Returning null response',
  RENEW_PLAN_VERBIAGE: 'Renew Previous Plan',
  CURRENT_PLAN: 'Current Plan',
  ZEEFIVE:'zeefive',
  RECHARGE_TEXT: 'Recharge',
  LOGOUT_SUCCESS: 'You have been successfully logged out',
  ACCOUNT_REFRESH_SUCCESS: 'Your Account has been refreshed successfully',
  ACCOUNT_REFRESH_LIMIT: 'You have exhausted the maximum number of retries',
  NEW_USER: 'NEW_USER',
  UPDATE_USER: 'UPDATE_USER',
  JWT_TOKEN: 'JWTToken',
  DRM_TOKENAPI: 'DRM_TokenAPI',
  DRM_LICENSED_TOKEN: 'DRM_Licensed_Token',
  AUTH_TYPE_UNKNOWN: 'unknown',
  PREFERENCE_UPDATEMSG: 'Your feed has been personalised as per your preferred languages',
  BINGE_OPEN_LG: 'BINGE_OPEN_LG',
  HOTSTAR_POPUP_LAUNCH_COUNT: 2,
  LOW_BALANCE: 'Your Account has insufficient balance',
  PAYABLE_AMOUNT: 'Payable Amount',
  CONFIRM_PURCHASE_CTA: 'Confirm Purchase',
  LOGIN_MSG: 'Please Login again',
  FOOTER_MSG_TEXT : 'Cancellation',
  REPLAY: 'Replay',
  SIEBEL: 'SIEBEL',
  COMVIVA: 'COMVIVA',
  PREMIUM: 'premium',
  LOGIN_ENTRY: {
    BINGE_LIST: 'BINGE-LIST',
    SUBSCRIPTION_PAGE: 'SUBSCRIPTION-PAGE',
    MY_ACCOUNT: 'MY-ACCOUNT',
    LEFT_MENU: 'LEFT-MENU',
    PLAYBACK: 'PLAYBACK',
    ADD_TO_BINGE_LIST: 'ADD-TO-BINGE-LIST',
    SUBMENU_SUBSCRIBE: 'SUBMENU_SUBSCRIBE'
  },
  CONTENT_VIEW: {
    HOME: 'HOME',
    SEARCH_RESULTS: 'SEARCH-RESULTS',
    BROWSE_BY: 'BROWSE-BY',
    FAVORITE: 'FAVORITE',
    SEARCH: 'SEARCH'
  },
  PLAYER_SOURCE: {
    HOME: 'HOME',
    SEARCH: 'SEARCH',
    BROWSE_BY: 'BROWSE-BY',
    DETAIL_SCREEN: 'DETAIL-SCREEN'
  },
  EXPIRED: 'EXPIRED',
  NONE: 'None',
  UPGRADE_SUBSCRIPTION: 'Upgrade Subscription',
  EPISODE_RAIL: 'EPISODE_RAIL',
  BAD_API_REQUEST: 'bad request',
  NO_RESTRICTION: 'No Restriction',
  PURCHASE_CONFIRMATION: 'Purchase Confirmation',
  SELECT_TENURE: 'Select Tenure',
  ADJUSTMENT_FROM_LAST_PAY: 'Adjustment from last pay',
  CHECK_BALANCE: 'Check Balance',
  LIVE: 'Live',
  ACTIVE_STATUS: 'active',
  ENGLISH: 'ENGLISH',
  NOTE_TEXT: 'Note:',
  FIRST_POINT: '1.',
  SECOND_POINT: '2.',
  BINGELIST_PAGE: 'BINGELIST-PAGE',
  BINGE_LIST_RAIL_TYPE: 'BINGE-LIST',
  BUTTON_EXPLORE: 'BUTTON_EXPLORE',
  SUBSCRIPTION_PACKAGE_TITLE: 'Choose a plan and start watching',
  SUBSCRIPTION_PACKAGE_SUBTITLE: 'Select your preferred plan & start watching.',
  LIVE_CHANNELS_ALL: 'all',
  APPLE_TV_VARBIAGE: 'Use Binge to seamlessly discover',
  NEWS_GENRE: 'News',
  LANGUAGE: 'Language',
  UC_BBL: 'UC_BBL',
  UC_BBG: 'UC_BBG',
  SUBSCRIBER_NOT_FOUND: 'Subscriber not found.',
  SOMETHING_WENT_WRONG: 'Something Went Wrong. Please try again later',
  CONTRACT_NAME: 'RENTAL',
  OK: 'OK',
  DOWNLOAD_NOW: 'Download Now',
  PROCEED: 'Proceed',
  EMAIL_CHANGE_SUCCESSFULLY: 'Email changed successfully!',
  HERO_BANNER: 'HERO-BANNER',
  SERIES_CONTENT: 'SeriesContent',
  HOME: 'HOME',
  BROWSE_BY_APP: 'BROWSE-BY-APP',
  LANGUAGES: 'Languages',
  VIDEOQUALITY: 'Video Quality',
  ACTIVATION_POPUP_HEADER: 'ACTIVATION_POPUP_HEADER',
  ACTIVATION_POPUP_SUBHEADER: 'ACTIVATION_POPUP_SUBHEADER',
  EMPTY_IMAGE: 'Empty Image',
  QRCODE: 'QRCODE',
  SUCCESS: 'SUCCESS',
  OKAY: 'Okay',
  DEEPLINK: 'DEEPLINK',
  STATUS_CODE: 'Error Failed with status code',
  BROWSER_NOT_SUPPORTED: 'Browser not supported !',
  TYPE_ERROR: 'TypeError',
  REFERENCE_ERROR: 'ReferenceError',
  CONTENT_NOT_AVAILABLE: 'No Content available to watch',
  YOU_ARE_OFFLINE: 'You are offline. Please check your internet connection.',
  COMPLETED: 'completed',
  ERROR_APPLE_MSG: 'Error occurred while creating apple subscription',
  BACK_TEXT: 'GoBack',
  OR: 'OR',
  RETRY_CTA_BUTTON_CLICK: 'RETRY_CTA_BUTTON_CLICK',
  RETRY_CTA_CANCEL: 'RETRY_CTA_CANCEL',
  AUTO: 'Auto',
  CANCEL: 'Cancel',
  SEARCH_LA_PLACEHOLDER: 'BINGE/SEARCH/UC_SEARCH_PLACEHOLDER',
  DEVICE_LIMIT_EXCEEDED: 'Device Limit Exceeded',
  REMOVE_DEVICE: 'Remove Device',
  DEVICE_REMOVED_SUCCESS_MESSAGE: 'Device removed successfully!',
  THIS_DEVICE: 'This Device',
  NO_DEVICE_ICON:'noDeviceIcon',
  LIVE_RAILS: 'LIVE_RAILS',
  AD: 'Ad',
  ADS: 'Ads',
  COMPLEMENTARY_SECTION_ROW_MAX_APPS: 7,
  PLUS_ICON: 'Plus',
  MINUS_ICON: 'Minus',
  TICK_ICON: 'Tick',
  WATCH_NOW: 'Watch Now',
  VIEW_DETAILS:'View Details',
  SUCCESS_ICON: 'Success',
  MY_BINGE_LIST: 'My Binge List',
  SDK_SCRIPT_ERROR_MSG : 'Error in loading sdk script of',
  INITIAL_TIME: '00:00',
  CLASS_A : 'classA',
  CLASS_B : 'classB',
  CLASS_C : 'classC',
  CLASS_D : 'classD',
  CLASS_E : 'classE',
  CLASS_F : 'classF',
  LOGO_SQUARE : 'logoSquare',
  QR_JOURNEY : 'QR_JOURNEY',
  BROWSE_BY_CHANNEL: 'BROWSE-BY-CHANNEL',
  CATALOG_CHANNEL: 'catalogchannel',
  COMPOSITE_CHANNEL_RAIL: 'COMPOSITE-CHANNEL-RAIL',
  STANDALONE_CHANNEL_RAIL: 'STANDALONE-CHANNEL-RAIL',
  INDIA: 'IND',
  BESTOF: 'Best Of ',
  BESTOFAPP: 'Best of APP',
  JIOHOTSTAR: 'jiohotstar',
  UC_BEST_OF_PARTNER: 'UC_BEST_OF_PARTNER',
  SPORTS: 'SPORTS',
  TEAMS: 'TEAMS',
  SEARCH_PAGES: 'SEARCH_PAGES',
  BEST_OF_PARTNER: 'BEST_OF_PARTNER',
  BESTOF_APP: 'BESTOF_APP',
  VIDEO_1440: 1440,
  VIDEO_2160: 2160,
  ESPANOL_CODE:'es',
  SPANISH:'Spanish',
  PRIME_MARKETING_VALUE: 'Prime',
  DRM_ACCESS_TOKEN: 'DRM_Access_Token',
  MORE_FROM: 'More From ',
  HB_VIEW_ALL_PAGE_FOCUS: 'HB_VIEW_ALL_PAGE_FOCUS',
  API: 'API',
  OTHERS: 'OTHERS',
  TRAILER:'TRAILER',
  NEW: 'NEW',
  SEARCH_CLICK_USE_CASE:'BINGE/LIVE/UC_SEARCH_CLICK',
  LIVE_CLICK_USE_CASE:'BINGE/LIVE/LA/UC_CLICK_LIT',
  LIVE_WATCH_USE_CASE:'BINGE/LIVE/LA/UC_WATCH_LIT',
  LIVE_TV:'Live TV',
  CENTRIFUGO: 'centrifugo',
  PUBNUB: 'pubnub'
}
export const HERO_BANNER_LAYOUT = {
  TYPE_1: 'type-1',
  TYPE_2: 'type-2',
  TYPE_3: 'type-3'
}
export default constants

export const LAYOUT_TYPE = {
  PORTRAIT: 'PORTRAIT',
  LANDSCAPE: 'LANDSCAPE',
  CIRCULAR: 'CIRCULAR',
  TOP_PORTRAIT: 'TOP_PORTRAIT',
  HERO_BANNER: 'HERO_BANNER',
  HERO_BANNER_SYNOPSIS: 'HERO_BANNER_SYNOPSIS',
  TOP_LANDSCAPE: 'TOP_LANDSCAPE',
  BANNER_LOGO: 'BANNER_LOGO',
  SEARCH_PAGE: 'LANDSCAPE_SEARCH_PAGE',
  PROMO_IMAGES: 'PROMO_IMAGES',
  PROMO_LOGO: 'PROMO_LOGO',
  PRIME_LITE_BENEFIT: 'PRIME_LITE_BENEFIT',
  FLEXI_PACKAGE_CARD: 'FLEXI_PACKAGE_CARD',
  DISTRO_POWERED_IMAGE: 'DISTRO_POWERED_IMAGE',
  PRIME_BANNER_IMAGES: 'PRIME_BANNER_IMAGES',
  PRIME_BANNER_LOGO: 'PRIME_BANNER_LOGO',
  SQUARE: 'SQUARE',
  DEVICE_MANAGEMENT_IMAGES: 'DEVICE_MANAGEMENT_IMAGES'
};

export const CHANNEL_RAIL_TYPE = {
  STANDALONE: 'STANDALONE',
  COMPOSITE : 'COMPOSITE',
  EDITORIAL: 'EDITORIAL',
  TITLE: 'TITLE',
  BINGE_TOP_10: 'BINGE_TOP_10'
}

export const APPIDS = {
  PLAYSTORE: 'com.webos.app.discovery',
  REDIRECT_PATH: 'category/GAME_APPS/'
}
export const SECTION_SOURCE = {
  PRIME: 'PRIME',
  TITLE_RAIL: 'TITLE_RAIL',
  RECOMMENDATION: 'RECOMMENDATION',
  LANGUAGE: 'LANGUAGE',
  GENRE: 'GENRE',
  BINGE_TOP_10_RAIL: 'BINGE_TOP_10_RAIL',
  EDITORIAL: 'EDITORIAL',
  PROVIDER: 'PROVIDER',
  CONTINUE_WATCHING: 'CONTINUE_WATCHING',
  TVOD: 'TVOD',
  SEARCH: 'SEARCH',
  WATCHLIST: 'WATCHLIST',
  FREE_TRIAL: 'FREE_TRIAL',
  PAID_TRIAL: 'PAID_TRIAL',
  FREE_TRIAL_UPGRADE: 'FREE_TRIAL_UPGRADE',
  SHUFFLE_RAIL: 'SHUFFLE_RAIL',
  BACKGROUND_BANNER_RAIL: 'BACKGROUND_BANNER_RAIL',
  PROVIDER_BROWSE_APPS: 'PROVIDER_BROWSE_APPS',
  SEASONS: 'SEASONS',
  LANGUAGE_NUDGE: 'LANGUAGE_NUDGE',
  PLAYER: 'PLAYER',
  BINGE_CHANNEL: 'BINGE_CHANNEL',
  DARSHAN_CHANNEL: 'DARSHAN_CHANNEL',
  BROWSE_BY_APP_RAIL: 'Browse by app rail',
  BROWSE_BY_APPS: 'Browse By Apps',
  BBG: 'Browse By Genre',
  LIVE_EVENT_RAIL: 'LIVE_EVENT_RAIL',
  TPSAMSUNG: 'TPSAMSUNG',
  TPLG: 'TPLG',
  PROMO_BANNER: 'PROMO_BANNER',
  HERO_BANNER_NEW: 'HERO_BANNER_NEW',
  SPECIAL_BANNER_RAIL: 'SPECIAL_BANNER_RAIL',
  SERIES_SPECIAL_RAIL: 'SERIES_SPECIAL_RAIL',
  BROWSE_BY_CHANNEL: 'BROWSE_BY_CHANNEL',
  BROWSE_BY_SPORTS: 'BROWSE_BY_SPORTS',
  MARKETING_ASSET: 'MARKETING_ASSET',
  BINGE_CHIP_RAIL: 'BINGE_CHIP_RAIL',
  HB_SEE_ALL: 'HB_SEE_ALL',
  HERO_BANNER_CAROSEL: 'HERO_BANNER',
  HERO_BANNER: 'HERO_BANNER'
};
export const SECTION_SOURCE_LIST = [SECTION_SOURCE.LANGUAGE_NUDGE, SECTION_SOURCE.PROVIDER_BROWSE_APPS, SECTION_SOURCE.PROMO_BANNER]
export const SECTION_SOURCE_LIST_DEFAULT_METADATA = [SECTION_SOURCE.GENRE, SECTION_SOURCE.BINGE_TOP_10_RAIL, SECTION_SOURCE.PROVIDER_BROWSE_APPS, SECTION_SOURCE.PROVIDER, SECTION_SOURCE.LANGUAGE]

export const SECTION_TYPE = {
  HERO_BANNER: 'HERO_BANNER',
  RAIL: 'RAIL'
};

export const RAIL_DIMENION = {
  PORTRAIT: 160,
  LANDSCAPE: 230,
  CIRCULAR: 140,
  TOP_PORTRAIT: 274,
  LANGUAGE: 128
}

export const RAIL_POSITION = {
  PREPEND: 'PREPEND'
}
export const ALPHANUMERICKEYBOARD = {
  KEYBOARD_WITHOUT_SPECIAL_KEYS :['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  KEYBOARD_WITH_SPECIAL_KEYS :  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '^', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '@', '.', '.com', '!#$']
}

export const MIXPANEL_CONTENT_TYPE = {
  EDITORIAL: 'EDITORIAL',
  RECOMMENDED: 'RECOMMENDED',
  AUTOMATED: 'AUTOMATED',
  SEARCH: 'SEARCH',
  MARKETING_ASSET: 'Marketing Asset'
}

export const CONTENT_TYPE = {
  MOVIE: 'MOVIE',
  MOVIES: 'MOVIES',
  BRAND: 'BRAND',
  SERIES: 'SERIES',
  TV_SHOWS: 'TV_SHOWS',
  SUB_PAGE: 'SUB_PAGE',
  WEB_SHORTS: 'WEB_SHORTS',
  LIVE: 'LIVE',
  VOD: 'VOD',
  HB_SEE_ALL: 'HB_SEE_ALL',
  CUSTOM_STATIC_HB: 'CUSTOM_STATIC_HB',
  HB_SEE_ALL_BINGE_CHANNEL: 'HB_SEE_ALL_BINGE_CHANNEL',
  CUSTOM_MOVIES_DETAIL: 'CUSTOM_MOVIES_DETAIL',
  CUSTOM_LIVE_DETAIL: 'CUSTOM_LIVE_DETAIL',
  APPLE_HB: 'APPLE_HB',
  HB_BINGE_OFFER: 'HB_BINGE_OFFER'
}

export const NON_HB_CONTENTS_TYPES = [CONTENT_TYPE.HB_SEE_ALL, CONTENT_TYPE.CUSTOM_STATIC_HB, CONTENT_TYPE.HB_SEE_ALL_BINGE_CHANNEL, CONTENT_TYPE.APPLE_HB]

export const CONTENTTYPE_SERIES = [CONTENT_TYPE.SERIES, CONTENT_TYPE.BRAND, CONTENT_TYPE.TV_SHOWS];

export const PROVIDERDISPLAYNAME = 'providerDisplayName'
export const CHANGE_PLAN_TYPE = {
  TENURE:  'TENURE',
  UPGRADE: 'UPGRADE',
  RENEWAL: 'RENEWAL'
}

export const PROVIDER_LIST = {
  SHEMAROO_ME: 'shemaroome',
  CURIOSITY_STREAM: 'curiositystream',
  EPIC_ON: 'epicon',
  PLANET_MARATHI: 'planetmarathi',
  DOCUBAY: 'docubay',
  NAMMA_FLIX: 'nammaflix',
  CHAUPAL: 'chaupal',
  KOODE: 'koode',
  REELDRAMA: 'reeldrama',
  TATAPLAY: 'tataplay',
  SHORSTTV: 'shortstv',
  TATASKY: 'tatasky',
  MANORAMAMAX: 'manoramamax',
  TRAVELXP: 'travelxp',
  VROTT: 'vrott',
  AHA: 'aha',
  HUNGAMA: 'hungama',
  SONYLIV: 'sonyliv',
  MXPLAYER: 'mxplayer',
  HOTSTAR: 'hotstar',
  ZEE5: 'zee5',
  JIO_CINEMA: 'jiocinema',
  HALLMARKMOVIESNOW: 'hallmarkmoviesnow',
  FUSE: 'fuse',
  ISTREAM: 'istream',
  APPLETV: 'appletv',
  PLAYFLIX: 'playflix',
  KLIKK: 'klikk',
  SUNNXT: 'sunnxt',
  LIONSGATE: 'lionsgate',
  FANCODE: 'fancode',
  PTCPLAY: 'ptcplay',
  DISTRO_TV: 'distrotv',
  ANIMAX: 'animax',
  PRIME: 'prime',
  DISCOVERYPLUS: 'discoveryplus',
  TATAPLAYSPECIALS: 'tataplayspecials',
  WAVES:'waves',
  STAGE:'stage',
  TIMESPLAY:'timesplay',
  ULTRAJHAKAAS: 'ultrajhakaas',
  TARANGPLUS: 'tarangplus',
  ULTRAPLAY: 'ultraplay'
}

/* Provider checklist for filtering partner with 1% goback logic in player js */
export const PROVIDERCHECKLIST = [
  PROVIDER_LIST.ISTREAM,
  PROVIDER_LIST.REELDRAMA,
  PROVIDER_LIST.VROTT,
  PROVIDER_LIST.KOODE,
  PROVIDER_LIST.HALLMARKMOVIESNOW,
  PROVIDER_LIST.ANIMAX,
  PROVIDER_LIST.PLAYFLIX
]

export const PLAYER = {
  ENTER: 13,
  RETURN: isTizen ? 10009 : 461,
  SAMSUNG_RETURN: 10009,
  LG_RETURN: 461,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  RW: 412,
  PAUSE: 19,
  FF: 417,
  REC: 416,
  PLAY: 415,
  STOP: 413,
  SEEK_INTERVAL: 10,
  SEEK_10: 3,
  SEEK_30: 5,
  SEEK_60: 8,
  SEEK_90: 10,
  SEEK_120: 12,
  SEEK_180: 15,
  SEEK_others: 18,
  SAMSUNG_PLAY_PAUSE: 10252
}

const getHungamaDeviceType = () => {
  if( isTizen ){
    return 'SAMSUNG';
  }
  else {
    return 'LG';
  }
}


export const APPLETV = {
  MEGA_PLAN:'mega',
  PROVIDER_NAME:'appletv',
  BUTTON:'Activate Apple TV+',
  NON_DTH_USER:'Non DTH User',
  UPGRADE:'apple-upgrade-popup',
  ACTIVATE: 'apple-activation-popup',
  ACTIVATE_CTA: 'apple-activation-cta',
  CLAIM_STATUS: {
    NOTINITIATED: 'NotInitiated',
    PENDING: 'Pending',
    CONSUMED: 'Consumed',
    APPLE_NOT_CLAIMED :'Apple Not Claimed',
    APPLE_PENDING : 'Apple Pending',
    CODE_GENERATED: 'CODE-GENERATED',
    CODE_REDEEMDED: 'CODE-REDEEMDED',
    ENTITLED: 'ENTITLED',
    ACTIVATED: 'ACTIVATED',
    ENTITLEMENT_INITIATED: 'ENTITLEMENT_INITIATED',
    REACTIVATION_RENEW: 'REACTIVATION_RENEW',
    REACTIVATION_MIGRATION: 'REACTIVATION_MIGRATION',
    CANCEL_INITIATED: 'CANCEL_INITIATED',
    PENDING_CANCEL: 'PENDING_CANCEL',
    CANCELLED: 'CANCELLED',
    IN_POOLED_STATE: ''
  },
  PLAYBUTTON: 'playButton',
  ACTIVEPLUS: 'activePlus',
  UPGRADEBUTTON: 'upgradeButton',
  WATCH_APPLE_TV_NOW: 'watch-apple-tv-now',
  APPLE_ACTIVATION_POPUP_NEW: 'apple-activation-popup-new',
  WATCH_APPLE_TV_VIDEO: 'watch-apple-tv-video',
  APPLE_UPGRADE_POPUP: 'apple-upgrade-popup',
  MIGRATION: 'MIGRATION',
  REACTIVATION: 'REACTIVATION',
  ACTIVATION: 'ACTIVATION',
  ERROR_REASON: 'Please hold on while we process your subscription'
}

export const PRIME = {
  CLAIM_PRIME: 'Claim Amazon Prime',
  PACK_STATUS: {
    ENTITLED: 'ENTITLED',
    PENDING: 'PENDING',
    SUSPEND: 'SUSPEND',
    ACTIVATED: 'ACTIVATED',
    CANCELLED: 'CANCELLED',
    EMPTY: '',
    NOT_ELIGIBLE: 'NOT-ELIGIBLE' // Only for MixPanel
  },
  ACTIVATED_MSG: 'Amazon Prime subscription activated.',
  PENIDNG_MSG: 'Please hold on while we process your subscription',
  QRCODE_HEADER: 'Scan the below QR code with your mobile to Know Your Account',
  QRCODE_SUB_HEADER: 'Then click back on your remote and you can proceed to watch content'
}

export const PLAYER_PARTNERS = {
  HUNGAMA_APP_KEY: '612cdc7f714bba8eb592c1e137fb0146',
  SHEMAROO_ME_APP_KEY: 'ywVXaTzycwZ8agEs3ujx',
  SHEMAROO_ME_SERVICE_ID: '118',
  HUNGAMA_DEVICE_TYPE: getHungamaDeviceType(),
  HOTSTAR_DEEPLINK_SCHEMA: 'https://livingroom.hotstar.com/'
}
export const getPlatformType = ( isMP ) => {
  if( isTizen ){
    return isMP ? 'SAMSUNG-TV' : 'BINGE_OPEN_SAMSUNG'
  }
  else {
    return isMP ? 'LG-TV' : 'BINGE_OPEN_LG'
  }
}
export const getPlatformTypeForTA = () => {
  if( isTizen ){
    return 'samsung'
  }
  else {
    return 'lg'
  }
}
export const getSourceValue = () => {
  if( isTizen ){
    return SECTION_SOURCE.TPSAMSUNG;
  }
  else {
    return SECTION_SOURCE.TPLG;
  }
}

export const COMMON_HEADERS = {
  PLATFORM: getPlatformType( false ),
  CONTENT: 'application/json',
  DEVICE_ID: '',
  DEVICE_NAME:'',
  DEVICE_TYPE: getPlatformType( false ),
  RECO_PLATFORM: getPlatformTypeForTA(),
  // RULE:'VRTABINGEFILTER',
  // RULE: 'VRTABINGELIVEBBAFILTER',
  // RULE: 'VRTABINGELIVEBBASCFILTER',
  // RULE: 'VRTABINGEDISTROFILTER',
  // RULE: 'VRTABINGEHBFILTER',
  RULE: 'VRCHIPRAILFILTER', // Need To Check
  DEVICE_TYPE_MIXPANEL: getPlatformTypeForTA().toUpperCase() + 'TV',
  NEW_PLATFORM: 'BINGE_OPEN_FS',
  VERSION: '2.3.33',
  MP_PLATFORM: getPlatformType( true ),
  WO: 'Y',
  SOURCE: getSourceValue(),
  LOCALE: 'IND',
  YES: 'yes'
}

export const USERS = {
  DTH_NEW_STACK_USER:'DTH With Binge New Stack',
  DTH_OLD_STACK_USER:'DTH With Binge Old Stack',
  NON_DTH_USER:'Non DTH User',
  DTH_WITHOUT_BINGE: 'DTH Without Binge'
}
export const PACK_LIST = ['Mega', 'Platinum VIP', 'Premium']

export const PAGE_NAME = {
  HOME: 'Home',
  MOVIES: 'Movies',
  TV_SHOWS: 'TV Shows',
  KNOWLEDGE: 'Knowledge and Learning',
  ENTERTAINMENT: 'Entertainment',
  OTHER_CATEGORIES: 'Content Category',
  CONTENT_DETAIL: 'Content Detail',
  BROWSE_BY_GENRE: 'Browse By Genre',
  BROWSE_BY_LANGUAGE: 'Browse By Language',
  VIEW_CONTENT_DETAIL: 'View Content Detail',
  MY_PLAN: 'My Plan',
  SUBSCRIBE: 'Subscribe',
  REGIONAL: 'Regional',
  SPORTS: 'Sports',
  SEARCH: 'Search',
  BINGE_LIST: 'Binge List',
  ACCOUNT: 'Account',
  CONFIRM_PURCHASE: 'Confirm Purchase',
  CATALOG: 'Catalog',
  CATALOG_PARTNER: 'Catalog Partner',
  SERIES_DETAIL: 'Series Detail',
  CATALOG_PRTNR: 'CatalogPartner',
  LIVE: 'LIVE_RAILS'
}

export const PAGE_TYPE = {
  DONGLE_HOMEPAGE: 'DONGLE_HOMEPAGE',
  CONFIRM_PURCHASE: 'CONFIRM_PURCHASE',
  ACCOUNT: 'Account',
  ACCOUNT_URL: '/Account',
  BINGE_LIST: 'binge-list',
  LOGIN: 'login',
  ACCOUNT_LOGIN: 'Account-Login',
  SEARCH: 'Search',
  OTHER_CATEGORIES: 'other-categories',
  SUBSCRIPTION: 'plan/subscription',
  CURRENT_SUBSCRIPTION: 'plan/current',
  CURRENT_SUBSCRIPTION_AFTER_LOGIN: 'CURRENT_SUBSCRIPTION_AFTER_LOGIN',
  HOME: '/discover',
  APP_EXIT_SCREEN: '/app-exit-screen',
  CONTENT_DETAIL: '/detail',
  RENAME_DEVICE: '/device/setting/device-management',
  SPLASH: '/splash',
  CONFIRM_PIRCHASES: '/plan/purchase',
  TENURE: '/plan/change-tenure',
  SUBSCRIPTION_PAGE: '/plan/subscription',
  PLAYER: '/player',
  SHAKAPLAYER: '/shakaplayer',
  SUNNXT: '/sunnxt',
  PARENTAL_PIN: '/device/fourDigitParentalPinSetup',
  DO_NOT_REDIRECT: 'DO_NOT_REDIRECT',
  PI_SCREEN: 'PI_SCREEN',
  PLAYER_SCREEN: 'PLAYER_SCREEN',
  DEVICE_MANAGEMENT: '/device-management',
  DEVICE_MANAGEMENT_SCEEN: 'DEVICE_MANAGEMENT_SCEEN',
  DEVICE_MANAGEMENT_ACCOUNT_SCREEN: 'DEVICE_MANAGEMENT_ACCOUNT_SCREEN',
  SCREEN_SAVER: 'SCREEN_SAVER',
  CONTENT_LANGUAGE: '/content/languages',
  CONTENT_LANGUAGE_SCREEN: 'CONTENT_LANGUAGE_SCREEN',
  MXPLAYER_SCREEN: '/mxplayer',
  SONY_PLAYER_SCREEN: '/sonylivPlayer',
  MENU_ITEM_STATE: 'MENU_ITEM_STATE',
  PI_SCREEN_CATALOG_SEARCH: 'PI_SCREEN_CATALOG_SEARCH',
  SERIES_DETAIL: '/content/episode',
  ROUTE_CHANGE_ON_PI: 'ROUTE_CHANGE_ON_PI',
  BROSWSE_BY: '/browse-by',
  TRAILER: '/Trailor',
  FROM_SIDE_MENU_SUBSCRIBE: 'FROM_SIDE_MENU_SUBSCRIBE',
  CURRENT_SUBSCRIPTION_RENEW: '/plan/renew/current',
  NEW_RMN: '/new-rmn',
  FROM_PRIME_MARKETING_ASSET: 'FROM_PRIME_MARKETING_ASSET',
  PARTNER_PAGE: 'PARTNER_PAGE'
}

export const CUSTOM_PAGE_TYPE = {
  DONGLE_CATEGORIES: 'DONGLE_CATEGORIES',
  DONGLE_SEARCH: 'DONGLE_SEARCH',
  DONGLE_ACCOUNTS: 'DONGLE_ACCOUNTS',
  DONGLE_WATCHLIST: 'DONGLE_WATCHLIST'
}

export const MXPLAYER_IDENTIFIER = {
  MX_IDENTIFIER_UAT: 'tataplay_identifier',
  MX_IDENTIFIER_PROD: 'fJraV38MHU4bosdzJarW'
}

export const MX_PLAYER_CONTENT_TYPE = {
  MOVIE: 'movie',
  SHORTS: 'short',
  EPISODE: 'episode'
}
export const PARTNER_SUBSCRIPTION_TYPE = {
  FREE: 'free',
  FREMIUM: 'freemium',
  TVOD: 'TVoD',
  FREE_ADVERTISEMENT: 'free_advertisement'
};

export const AVAILABLE_PROVIDER_LIST = [
  'tatasky',
  'hungama',
  'sunnxt',
  'hotstar',
  'erosnow',
  'zee5',
  'hallmarkmoviesnow',
  'shemaroome',
  'sonyliv',
  'vootkids',
  'vootselect',
  'curiositystream',
  'epicon',
  'docubay',
  'hoichoi',
  'chaupal',
  'planetmarathi',
  'mxplayer',
  'lionsgate',
  'fitness',
  'fuse',
  'klikk',
  'playflix',
  'aha',
  'sunnxt',
  'travelxp',
  'nammaflix',
  'vrott',
  'fancode',
  'prime'
]

export const keyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
export const forwardRwKeys = [37, 39, 417, 412]

export const PROVIDER_LIST_NEW_HEIGHT = [
  'sunnxt',
  'hotstar',
  'erosnow',
  'hallmarkmoviesnow',
  'shemaroome',
  'sonyliv',
  'vootkids',
  'vootselect',
  'hoichoi',
  'planetmarathi',
  'mxplayer',
  'lionsgate',
  'fitness',
  'jiocinema',
  'travelxp',
  'manaramamax'
]

export const PROVIDER_LIST_MORE_HEIGHT = [
  'ptcplay',
  'playflix',
  'tarangplus',
  'zee5',
  'distrotv',
  'prime'
]

export const SONY_CONSTANTS = {
  SHORT_TOKEN: '73Wi8uC1MJJIQ5kHM7k7DnKJujTkYL6D', // 'UvdvldZnmcNowlfanKsljAOFMtj6lHDm',
  UNIQUE_ID: 'TATASky',
  DEVICE_TYPE: 'TPLG',
  DEVICE_TOKEN: '1675156660606'
}

export const SUNNXT_CONSTANTS = {
  UNIQUE_ID: 'TATASky',
  SPY: 'TATAPLAY',
  TPSAMSUNG: 'TPSAMSUNG',
  TPLG: 'TPLG'
}

export const LIONSGATE_CONSTANTS = {
  source: 'TPLG',
  referenceId: '2d81d7c6b5154d8bbf7a9f93437a56496110225393',
  deviceType: 'OPEN'
}

export const deepLinkPartners = [PROVIDER_LIST.ZEE5, PROVIDER_LIST.HOTSTAR, PROVIDER_LIST.JIO_CINEMA, PROVIDER_LIST.LIONSGATE, PROVIDER_LIST.APPLETV, PROVIDER_LIST.PRIME]
export const samsungRemoteKeys = ['MediaPlay', 'MediaPause', 'MediaRewind', 'MediaStop', 'MediaFastForward', 'MediaPlayPause', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const deepLinkPartnersForSamsung = ( providerName ) => {
  let allProviderList = [PROVIDER_LIST.ZEE5, PROVIDER_LIST.HOTSTAR, PROVIDER_LIST.JIO_CINEMA, PROVIDER_LIST.LIONSGATE, PROVIDER_LIST.APPLETV, PROVIDER_LIST.PRIME]
  return allProviderList.indexOf( providerName?.toLowerCase() ) >= 0
}
export const NOTIFICATION_RESPONSE = {
  iconName: 'AlertRed',
  message:   constants.message,
  buttonLabel: 'Try Again',
  info: 'Unable to play content right now. Please try again later.',
  errorInfo: 'No Data Found',
  alertIcon: 'Alert'
}

export const getSunNxtSDKPath = () => {
  if( isTizen ){
    return process.env.REACT_APP_SUNNXT_SDK_PATH_SAMSUNG;
  }
  else {
    return process.env.REACT_APP_SUNNXT_SDK_PATH_LG;
  }
}

export const getMxPlayerSDKPath = () => {
  if( isTizen ){
    return process.env.REACT_APP_MXPLAYER_SAMSUNG_SDK_PATH;
  }
  else {
    return process.env.REACT_APP_MXPLAYER_LG_SDK_PATH;
  }
}

export const getMxPlayerIdentifier = () => {
  if( isTizen ){
    return process.env.REACT_APP_MXPLAYER_SAMSUNG_IDENTIFIER;
  }
  else {
    return process.env.REACT_APP_MXPLAYER_LG_IDENTIFIER;
  }
}

export const APPFLYER_UAT = {
  appId: process.env.REACT_APP_APPFLYER_APP_ID,
  devKey: process.env.REACT_APP_APPFLYER_DEV_KEY,
  isDebug: false,
  isSandbox: false
}

export const LANGUAGE_JOURNEY = {
  LOGGED_IN_USER_JOURNEY: 'PROCEED',
  GUEST_JOURNEY: 'NOT_NOW'
}

export const VIEDO_LANGAUGE_VERBIAGES = {
  'languageDrawer': {
    'buttonTitle': 'Proceed',
    'exitButtonTitle': 'Not Now',
    'preferenceErrorMsg': 'Select at-least one language to proceed',
    'header': 'Video Language',
    'preferenceUpdatedMsg': 'Your feed has been personalised as per your preferred languages',
    'subHeader': 'Watch movies & shows in your language'
  }

}

export const PACKS = {
  FREEMIUM: 'Freemium',
  ADD_PACK_FREEMIUM: 'FREEMIUM',
  FREE_TRAIL: 'Free Trial',
  GUEST: 'Guest',
  SUBSCRIBED: 'Subscribed'
}

export const LANGUAGE_NUDGE = {
  PERSONALISED_MESSAGE: 'Personalise your content with your preferred languages',
  SELECT_LANGUAGE: 'Select Languages'
}

export const SUBSCRIPTION_STATUS = {
  DEACTIVE: 'DEACTIVE',
  ACTIVE: 'ACTIVE'
}

export const SUBSCRIPTION_PACK_TYPE = {
  STANDALONE: 'STANDALONE',
  FREEMIUM: 'FREEMIUM',
  BINGE_COMBO: 'BINGE_COMBO'
}

export const PAYMENT_METHOD = {
  OPEL_ONE_TIME : 'OPEL_ONE_TIME',
  OPEL_RECURRING: 'OPEL_RECURRING',
  DTH_WALLET : 'DTH WALLET'
}

export const SUBSCRIPTION_TYPE = {
  ANDROID_STICK : 'ANDROID_STICK',
  ATV: 'atv',
  ANYWHERE: 'ANYWHERE',
  FREEMIUM: 'FREEMIUM'
}

export const PAYMENT_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
}

export const FAQ_QUESTION = {
  QUES_1: 'how can i downgrade',
  QUES_2: 'how can i upgrade',
  QUES_3: 'do i need to be a tata play dth'
}

export const ENCRYPTED_PLAYER_LIST = [PROVIDER_LIST.CHAUPAL, PROVIDER_LIST.TATASKY, PROVIDER_LIST.CURIOSITY_STREAM, PROVIDER_LIST.PTCPLAY]
export const AUTH_TYPE = [constants.JWT_TOKEN, constants.DRM_TOKENAPI, constants.DRM_LICENSED_TOKEN]
export const DRM_AUTH_TYPE = [constants.DRM_TOKENAPI, constants.DRM_LICENSED_TOKEN]
export const CUSTOM_CONTENT_TYPE = [CONTENT_TYPE.HB_SEE_ALL, CONTENT_TYPE.CUSTOM_STATIC_HB, CONTENT_TYPE.LIVE]

export const SECURITY_CHECKSUM_VERBIAGES = {
  restrictPlayBackUIAlert : 'You are not authorized to play this content',
  restrictPlayBackMixPanelReason : '4005 : You are not authorized to play this content',
  label: 'OK',
  icon1: 'AlertRed',
  icon2: 'GoBack'
}

export const MEDIA_CARD_TYPE = {
  WATCHLIST: 'WATCHLIST'
}

export const CHECKSUM_SECRET_KEY = '0123456789abcdef'

export const DISTRO_CHANNEL = {
  PLATFORM: {
    SAMSUNG: 'SAMSUNG',
    LG: 'LG'
  },
  LOCATION: 'IN',
  DOMAIN: 'distro.tv',
  APP_NAME: isTizen ? 'tataplaybinge.wgt' : process.env.REACT_APP_BINGE_APP_ID,
  LG_STORE_URL: 'https://in.lgappstv.com/main/tvapp/detail?appId=1219521',
  APP_ID: isTizen ? process.env.REACT_APP_SAMSUNG_APP_ID : process.env.REACT_APP_BINGE_APP_ID,
  EVENTS: {
    ff: 'ff',
    vplay: 'vplay',
    vs: 'vs',
    err: 'err'
  },
  appType : 'DistroTV',
  APP_CATEGORY: 'entertainment',
  PARTNER_NAME: 'tataplay',
  DEVICE_CATEGORY: 'ctv'
}

export const FORCE_UPDATE_POPUP = {
  header: 'New Version Available',
  header1: 'Update',
  btn1: 'Update',
  btn2: 'Exit',
  btn3: 'Not Now',
  info: 'A new version is available for download. Please update the app.'
}

export const PLAYBACK_TYPES = {
  DASH : 'application/dash+xml',
  X_MPEG: 'application/x-mpegURL'
}

export const TRACK_MODE = {
  NONE: 'None',
  HIDDEN: 'hidden',
  SHOWING: 'showing',
  DISABLED: 'disabled'
}

export const TRACK_KIND = {
  CAPTIONS: 'captions',
  SUBTITLES: 'subtitles',
  METADATA: 'metadata',
  SUBTITLE: 'subtitle'
}

export const TRACK_FORMAT = {
  VTT: '.vtt',
  SRT: '.srt'
}

export const TRACK_LANGUAGE = {
  CODE: 'en',
  LABEL: 'English'
}

export const TRACK_TYPE = {
  VTT:'text/vtt'
}

export const hotstarverbiage = {
  category: 'hotstar-watch-popup',
  header: 'Please play content on JioHotstar app',
  subHeader: null,
  others: {
    verbiagelogo: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1702375630515.png',
    buttonHeader: 'OK',
    steps: [
      {
        text1: 'Step 1',
        text2: 'Open JioHotstar on your Samsung TV'
      },
      {
        text1: 'Step 2',
        text2: 'Ensure you are logged in with your Tata Play Binge \nMobile Number'
      },
      {
        text1: 'Step 3',
        text2: 'Play the desired content on JioHotstar app'
      }
    ]
  }
}

export const zee5verbiage = {
  category: 'zee5-watch-popup',
  header: 'Please open Zee5 Play App on this TV and play the content',
  subHeader: null,
  others: {
    verbiagelogo: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1702366333736.png',
    buttonHeader: 'OK'
  }
}

export const lionsgateverbiage = {
  category: 'lionsgate-watch-popup',
  header: 'Please open Lionsgate Play App on this TV and play the content',
  subHeader: null,
  others: {
    verbiagelogo: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1702366445833.png',
    buttonHeader: 'OK'
  }
}

export const appleVerbiage = [{
  category: 'apple-watch-content',
  header: 'Watch Content On Apple TV+ App',
  subHeader: null,
  others: {
    buttonHeader: 'OK',
    appleverbiagelogo: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1694768044112.png',
    steps: [
      {
        text1: 'Step 1',
        text2: 'Open Apple TV+ on your Samsung TV'
      },
      {
        text1: 'Step 2',
        text2: 'Please ensure you are logged in using the same Apple \nID for activating Apple TV+ on Tata Play binge App'
      },
      {
        text1: 'Step 3',
        text2: 'Play the desired content on Apple TV+ App'
      }
    ]
  }
}]

export const primeVerbiage = {
  category: '',
  header: 'Please play content on Prime Video app',
  subHeader: null,
  others: {
    verbiagelogo: 'https://uat.tstatic.videoready.tv/cms-ui/images/custom-content/1707383274849.png',
    buttonHeader: 'Okay',
    steps: [
      {
        text1: 'Step 1',
        text2: 'Open Prime Video on your Samsung TV'
      },
      {
        text1: 'Step 2',
        text2: 'Please login using your existing account details',
        text3: 'Please login with the details used during activation'
      },
      {
        text1: 'Step 3',
        text2: 'Play the desired content on Prime Video app'
      }
    ]
  }
}

export const FIBRE_PLAN = {
  iconName:'CrownGoldForward60x60',
  header: 'About Binge Plans',
  message: 'Please visit https://www.tataplayfiber.com/ website and upgrade to a plan that has [partnername]as part of the plan on respective platform',
  buttonLabel: 'DONE',
  backIcon: 'GoBack'
}

export const InterstitialPage_Routes = {
  prime: '/prime',
  apple: '/apple'
}
export const ZERO_PLAN_APPS_VERBIAGE = {
  DURING_LOGIN_POPUP: 'DURING-LOGIN-POPUP',
  POPUP_HEADER: 'Apps Added Successful!',
  POPUP_INFO: 'Your selected apps have been added to your Binge'
}

export const APPLE_PRIME_ACTIVATION_JOURNEY = {
  PRIME: 'Prime',
  APPLE_TV: 'AppleTV',
  SUBSCRIPTION_SUCCESS: 'SUBSCRIBE-SUCCESS',
  DONE_CTA_CLICKED: 'DONE-CTA-CLICKED',
  APPLE_PRIME_POPUP_INITIATED: 'APPLE-PRIME-POPUP-INITIATED',
  PI_PAGE: 'PI-PAGE',
  APPLE: 'apple',
  HERO_BANNER: constants.HERO_BANNER
}

export const SENTRY_LEVEL = {
  ERROR: 'error',
  WARNING: 'warning',
  FATAL: 'fatal',
  LOG: 'log',
  INFO: 'info',
  DEBUG: 'debug'
}

export const SENTRY_TAG = {
  LAUNCH_STORE_ERROR: 'LAUNCH-STORE-ERROR',
  APPSFLYER_NOT_SUPPORTED: 'APPSFLYER-NOT-SUPPORTED',
  APPSFLYER_API_RESPONSE_ERROR: 'APPSFLYER-API-RESPONSE-ERROR',
  APPSFLYER_LOG_EVENT_ERROR: 'APPSFLYER-LOG-EVENT-ERROR',
  KIND_NOT_CREATED: 'KIND-NOT-CREATED',
  OBJECTS_NOT_ADDED: 'OBJECTS-NOT-ADDED',
  PERMISSION_NOT_SET: 'PERMISSION-NOT-SET',
  DEEP_LINK_ERROR: 'DEEP-LINK-ERROR',
  API_ERROR: 'API-ERROR',
  DECRYPTED_LIVE_URL_ERROR: 'DECRYPTED-LIVE-URL-ERROR',
  APP_INSTALLATION_FAILED: 'APP-INSTALLATION-FAILED',
  ERROR_BOUNDARY: 'ERROR-BOUNDARY',
  DEVICE_ID_ERROR: 'DEVICE-ID-ERROR',
  DEVICE_NAME_ERROR: 'DEVICE-NAME-ERROR',
  NETWORK_STATUS_ERROR: 'NETWORK-STATUS-ERROR',
  WEBOS_VERSION_ERROR: 'WEBOS-VERSION-ERROR'
}

export const FFRWALLOWEDKEYS = ['PROGRESSBAR_INAPP', 'PLAYPAUSEICON'];

export const REMOVE_DEVICE = {
  buttonLabel: 'Yes, Remove Device',
  backButton: 'To Close',
  message: 'Are you sure you want to remove'
}

export const SUBMENU_MIXPANEL = {
  SUBMENU_PARENTALCONTROL: 'SUBMENU-PARENTALCONTROL',
  SUBMENU_VIDEOLANGUAGE: 'SUBMENU-VIDEOLANGUAGE',
  SUBMENU_TRANSACTION_HISTORY: 'SUBMENU-TRANSACTION-HISTORY',
  SUBMENU_MANAGEDEVICES: 'SUBMENU-MANAGEDEVICES',
  SUBMENU_LOGOUT: 'SUBMENU-LOGOUT',
  SUBMENU_ACCOUNTREFRESH: 'SUBMENU-ACCOUNTREFRESH',
  SUBMENU_EDITPROFILE: 'SUBMENU-EDITPROFILE',
  SUBMENU_MYPLAN: 'SUBMENU-MYPLAN',
  SUBMENU_SUBSCRIBE: 'SUBMENU-SUBSCRIBE',
  SUBMENU_RECHARGE: 'SUBMENU-RECHARGE',
  SUBMENU_LOGIN: 'SUBMENU-LOGIN',
  SUBMENU_BINGELIST: 'SUBMENU-BINGELIST',
  SUBMENU_AUTOPLAYTRAILER_OFF: 'SUBMENU-AUTOPLAYTRAILER-OFF',
  SUBMENU_AUTOPLAYTRAILER_ON: 'SUBMENU-AUTOPLAYTRAILER-ON'
}

export const SDK_PARTNERS = [PROVIDER_LIST.SUNNXT, PROVIDER_LIST.MXPLAYER, PROVIDER_LIST.SONYLIV]
export const APPLE_REDIRECTION_KEYS = [APPLETV.CLAIM_STATUS.ENTITLED, APPLETV.CLAIM_STATUS.IN_POOLED_STATE]
export const APPLE_ERROR_STATUS_KEYS = [APPLETV.CLAIM_STATUS.PENDING_CANCEL, APPLETV.CLAIM_STATUS.CANCEL_INITIATED, APPLETV.CLAIM_STATUS.CANCELLED, APPLETV.CLAIM_STATUS.ENTITLEMENT_INITIATED];
export const APPLE_REACTIVATION_KEYS = [APPLETV.CLAIM_STATUS.REACTIVATION_RENEW, APPLETV.CLAIM_STATUS.REACTIVATION_MIGRATION];
export const APPLE_SAMSUNG_HOW_TO_WATCH_KEYS = [APPLETV.CLAIM_STATUS.PENDING_CANCEL, APPLETV.CLAIM_STATUS.CANCEL_INITIATED, APPLETV.CLAIM_STATUS.CANCELLED, APPLETV.CLAIM_STATUS.ACTIVATED];

export const SubscriptionNotFoundData = {
  code: 23000,
  message: 'Subscription Not Found',
  skipSteps: true
}

export const CARD_SIZE = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  DEFAULT: 'DEFAULT'
}
export const excludedRails = [
  SECTION_SOURCE.SPECIAL_BANNER_RAIL,
  SECTION_SOURCE.BINGE_CHANNEL,
  SECTION_SOURCE.DARSHAN_CHANNEL,
  SECTION_SOURCE.BROWSE_BY_APPS,
  SECTION_SOURCE.BROWSE_BY_APP_RAIL,
  SECTION_SOURCE.BBG,
  SECTION_SOURCE.LIVE_EVENT_RAIL,
  SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
  SECTION_SOURCE.PROVIDER_BROWSE_APPS,
  SECTION_SOURCE.PROVIDER,
  SECTION_SOURCE.BINGE_TOP_10_RAIL,
  constants.EPISODE_RAIL,
  SECTION_SOURCE.SHUFFLE_RAIL,
  SECTION_SOURCE.SERIES_SPECIAL_RAIL,
  SECTION_SOURCE.GENRE,
  SECTION_SOURCE.LANGUAGE,
  SECTION_SOURCE.BROWSE_BY_CHANNEL,
  SECTION_SOURCE.BINGE_CHIP_RAIL
]


export const isExcludedRail = ( sectionSource ) => {
  if( excludedRails.includes( sectionSource ) ){
    return true;
  }
  else {
    return false;
  }
}

export const excludedTitleRails = [
  SECTION_SOURCE.LANGUAGE_NUDGE,
  SECTION_SOURCE.PROMO_BANNER,
  SECTION_SOURCE.BACKGROUND_BANNER_RAIL,
  SECTION_SOURCE.SPECIAL_BANNER_RAIL,
  SECTION_SOURCE.SERIES_SPECIAL_RAIL,
  SECTION_SOURCE.GENRE
]

export const isExcludedTitleRail = ( sectionSource ) => {
  if( excludedTitleRails.includes( sectionSource ) ){
    return false;
  }
  else {
    return true;
  }
}

export const nonLiveTagProvidersOnPartnerPages = [PROVIDER_LIST.DISTRO_TV, PROVIDER_LIST.PTCPLAY]

export const CHIP_RAIL_TYPE = ['EDITORIAL', 'TITLE', 'BINGE_TOP_10', 'COMPOSITE']

export const ABMainFeature = {
  searchFeature: 'SEARCH-FEATURE',
  railRecommendation: 'RAIL-RECOMMENDATION-FEATURE',
  railGuestRecommendation:'RAIL-RECOMMENDATION-FEATURE-GUEST',
  liveRelatedRecommendation:'LIVE-RELATED-RAIL-RECOMMENDATION-FEATURE',
  webShortRelatedRecommendation:'WEB-SHORT-RELATED-RAIL-RECOMMENDATION-FEATURE'
};

export const ABSearchVariants = {
  elastic: 'Variant-1',
  gemeni: 'Variant-2',
  hybridElastic: 'Variant-3',
  currentSearchVariant: 'Variant-1',
  currentRecommendationVariant: 'Variant-1',
  currentliveRelatedRecommendationVariant:'Variant-1',
  currentwebShortRelatedRecommendationVariant:'Variant-1',
  isSearchExperimentON: false,
  isRecommendationExperimentON: false
};

export const recommendationUrlSuffixes = {
  UC_PL: 'language/UC_PL',
  UC_BBG: 'UC_BBG',
  UC_BBL: 'UC_BBL',
  UC_GET_GENRE: 'genre/UC_GET_GENRE_PROFILE_1'

}

export const ALLOWED_HERO_BANNER_LIST = [
  'APPLE_HB',
  'CUSTOM_PRIME',
  'HB_SEE_ALL',
  'HB_SEE_ALL_BINGE_CHANNEL',
  'LIVE',
  'CONTENT_TYPE_CUSTOM_LIVE_DETAIL',
  'CUSTOM_STATIC_HB',
  ''
];

export const ALLOWED_HERO_BANNER_LAYOUT_LIST = [
  'Type-1',
  'Type-3'
];
