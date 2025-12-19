export const serviceConst = {
  // Section Types
  sectionType: {
    HERO_BANNER: 'HERO_BANNER',
    RAIL: 'RAIL'
  },
  apiVersion: 'v1',
  apiVersion2: 'v2',
  apiVersion3: 'v3',

  // Config API
  TSMORE_CONFIG: 'binge-mobile-config/pub/v1/api/config/tsmore',

  // Regiseter Device API
  REGISTER_USER: 'binge-mobile-services/pub/api/v1/user/guest/register',

  // Parental Pin API's
  PARENTAL_PIN_URL: 'binge-mobile-services/api/v1/validate/content_rating',
  PARENTAL_PIN_VALIDATE: 'binge-mobile-services/api/v1/validate/parental/pin',

  // Binge List API's
  ADD_REMOVE_BINGELIST: 'action-data-provider/subscriber/favourite',
  ADD_REMOVE_BINGELIST_TATAPLAY: 'event-processor/api/v1/subscriber/favourites',
  BINGE_LIST_SERVICE: 'action-data-provider/subscriber/favourite/listing', // TODO: This API has multiple custom Methods, Need to combine by checking diff
  LA_BINGE_LIST: 'ta-recommendation/api/v1/binge/learn/FAVOURITE',
  BULK_REMOVE: 'action-data-provider/subscriber/favourite/bulk/remove',

  // Login API's
  PREVIOUSLY_USED_RMN: 'binge-mobile-services/pub/api/v1/user/login/rmn',
  GENERATE_OTP_URL: 'binge-mobile-services/pub/api/v1/user/authentication/generateOTP',
  VALIDATE_OTP_URL: 'binge-mobile-services/pub/api/v1/user/authentication/validateOTP',
  SUBSCRIBER_LIST: 'binge-mobile-services/api/v4/subscriber/details',
  CREATE_USER: 'binge-mobile-services/api/v3/create/new/user',
  UPDATE_USER: 'binge-mobile-services/api/v3/update/exist/user',
  SSO_LOGIN_SAMSUNG_DEEPLINK: 'binge-service/api/v1/samsung/secureLogin', // SAMSUNG SSO LOGIN
  GENERATE_LOGIN_QR: 'binge-mobile-services/pub/api/v1/generateLoginQr',
  GENERATE_LOGIN_QR_STATUS: 'binge-mobile-services/pub/api/v1/loginQrStatus',
  ALL_FEATURE:'control-node/pub/api/v1/feature',
  ASSIGNED_VARIANT : 'control-node/api/v1/feature/assigned-variants',
  // My account API's
  GET_PROFILE: 'binge-mobile-services/api/v3/subscriber/fetch/profile',
  LANGUAGE_LIST_URL: 'homescreen-client/pub/api/v2/search/language',
  GET_DEFAULT_SELECTED: 'binge-mobile-services/api/v1/user/profile',
  TRANSACTION_HISTORY: 'binge-mobile-services/api/v2/subscription/transaction/history',
  TSMORE: 'rest-api/pub/api/v1/help/tsmore',
  AUTO_TRAILER_TOGGLE: 'binge-mobile-services/api/v2/change/notificationTrailer/status',
  DEVICE_LIST: 'binge-mobile-services/api/v2/subscriber/devices/',
  REMOVE_DEVICE: 'binge-mobile-services/api/v3/remove/devices',
  RENAME_DEVICE: 'binge-mobile-services/pub/api/v2/device/rename',
  REFRESH_ACCOUNT: 'binge-mobile-services/api/v1/accountRefresh',
  EDIT_PROFILE_V2: 'binge-mobile-services/api/v2/subscriber/update/email',
  EDIT_PROFILE_V3: 'binge-mobile-services/api/v3/subscriber/update/email/name',
  RECHARGE_URL: 'binge-mobile-services/api/v1/fetch/qrcode/url',
  GET_BALANCE: 'binge-mobile-services/api/v3/accountInfo/getBalance',
  LOGOUT_URL: 'binge-mobile-services/api/v2/logout',
  POST_SELECTED_LANGUAGE_LIST: 'binge-mobile-services/pub/api/v1/user/login/preferredLanguage',
  LOGGED_IN_USER_SAVE_LANGUAGES: '/binge-mobile-services/api/v1/loggedIn/user/preferredLanguage/',

  // Home Page API's
  LEFT_MENU_URL: 'homescreen-client/pub/api/v3/pages/LG',
  HOME_URL: 'homescreen-client/pub/api/v1/page/$pageType',
  HOME_TICKTICK_URL: 'homescreen-client/api/v1/page/$pageType',
  TVOD: 'content-subscriber-detail/api/v1/monetization/tvod/subscriber/list',
  TVOD_EXPIRY: 'content-detail/api/v1/tvod/digital/playback/expiry/',
  RECENTLY_WATCHED: 'event-processor/api/v1/partner/watch/history',

  LANGUAGE_GENRE_LIST_URL: 'homescreen-client/pub/api/v2/search/landing?', // NOT_USING
  GENRE_LIST_URL: 'homescreen-client/pub/api/v2/search/genre',
  DYNAMIC_RAIL_INFO: 'homescreen-client/pub/api/v2/rail',
  CHANNEL_LIST_URL: 'homescreen-client/pub/api/v1/provider/channel',
  CHIP_RAIL_URL: 'homescreen-client/pub/api/v1/chip',

  TA_RECOMMENDATION_GUEST_URL: 'ta-recommendation/api/v1/binge/guest/recommend/',
  TA_LANGUAGE_RECOMMENDATION_URL_GUEST_URL: 'ta-recommendation/api/v1/binge/guest/recommend/language/UC_PL',
  TA_GENRE_RECOMMENDATION_GUEST_URL: 'ta-recommendation/api/v1/binge/guest/recommend/genre/UC_GET_GENRE_PROFILE_1',
  TA_CONTENT_GENRE_RECOMMENDATION_GUEST_URL: 'ta-recommendation/api/v1/binge/guest/recommend/UC_BBG',
  TA_CONTENT_LANGUAGE_RECOMMENDATION_GUEST_URL: 'ta-recommendation/api/v1/binge/guest/recommend/UC_BBL',
  TA_BROWSE_BY_APPS_GUEST : 'ta-recommendation/api/v1/binge/guest/recommend/$useCase',

  TA_RECOMMENDATION_URL: 'ta-recommendation/api/v1/binge/recommend/',
  TA_LANGUAGE_RECOMMENDATION_URL: 'ta-recommendation/api/v1/binge/recommend/language/UC_PL',
  TA_GENRE_RECOMMENDATION_URL: 'ta-recommendation/api/v1/binge/recommend/genre/UC_GET_GENRE_PROFILE_1',
  TA_CONTENT_GENRE_RECOMMENDATION_URL: 'ta-recommendation/api/v1/binge/recommend/UC_BBG',
  TA_CONTENT_LANGUAGE_RECOMMENDATION_URL: 'ta-recommendation/api/v1/binge/recommend/UC_BBL',
  TA_BROWSE_BY_APPS: 'ta-recommendation/api/v1/binge/recommend/$useCase',


  SCRREN_SAVER_URL: 'homescreen-client/pub/api/v1/page/DONGLE_SCREENSAVER',
  // Subscription API's
  PACK_LIST_GUEST_USER: 'binge-mobile-services/pub/api/v4/subscription/packs',

  PACK_LIST: 'binge-mobile-services/api/v3/subscription/openFS/packs/',
  CURRENT_SUBSCRIPTION_PLAN: 'binge-mobile-services/api/v4/subscription/current',
  GET_USER_BALANCE: 'binge-mobile-services/api/v2/account/prorated/balance',
  PACK_VALIDATION: 'binge-mobile-services/api/v1/pack/validation',
  ADD_PACK: 'binge-mobile-services/api/v1/subscription/add/pack',
  MODIFY_PACK: 'binge-mobile-services/api/v1/subscription/modify/pack',
  CHARGE_REQUEST: 'binge-mobile-services/api/v1/post/charge/request',
  PAYMENT_STATUS: 'binge-mobile-services/api/v1/payment/status',
  CANCEL_SUBSCRIPTION: 'binge-mobile-services/api/v1/subscription/cancel',
  UPGRADE_QRCODE: 'binge-mobile-services/api/v1/third-party/rechargeurl',
  UPGRADE_PAYMENT_STATUS: 'binge-mobile-services/api/v1/openfs/payment/status',
  DETAILS_VERBIAGES_URL: 'binge-mobile-services/api/v1/verbiages/details',

  // Search Page API's
  SEARCH_URL: 'search-connector/freemium/search/results',
  SEARCH_DATA_URL: '/search-connector/freemium/episode/data',
  SEARCH_RAILS: '/homescreen-client/pub/api/v2/search/landing', // NOT_USING TODO:  This is duplicate of LANGUAGE_GENRE_LIST_URL, Verify & combine
  AUTOCOMPLETE_SUGGESTION: 'search-connector/v3/binge/search',
  ADD_SEARCH: 'action-data-provider/api/v1/search/add/text',
  FETCH_SEARCH: 'action-data-provider/api/v1/search/fetch/text',
  CLEAR_ALL: 'action-data-provider/api/v1/search/clear/text',
  SEARCH_LA: 'ta-recommendation/api/v1/binge/learn/SEARCH/',
  SEARCH_LA_GUEST: 'ta-recommendation/api/v1/binge/guest/learn/SEARCH/',
  LIVE_PLAY_LA: 'ta-recommendation/api/v1/binge/learn/WATCH',

  // PI page API's
  SERIES_LIST: 'content-subscriber-detail/pub/api/v1/content-detail/series/',
  SERIES_LIST_TRAILER_MORE: 'content-subscriber-detail/pub/api/v1/content-detail/shorts/',
  RELATED_SHOWS: '/search-connector/binge/recommendations',
  LAST_WATCH: 'action-data-provider/api/v1/last-watch',
  LAST_WATCH_TATAPLAY: 'event-processor/api/v1/last-watch',
  PLAYBACK_EVENTS: 'action-listener/api/v1/events',
  BOX_SUBSET: 'content-subscriber-detail/pub/api/v1/box-subset/',
  BOX_SET: 'content-subscriber-detail/pub/api/v1/',
  BOX_SET_LIVE: 'content-detail/pub/api/v6/channels',
  // BOX_SET_LIVE: 'content-detail-binge/pub/api/v5/channels', // NOT-USING, keeping this for reference
  LIVE_DECRYPTED_PLAY_URLS:  'content-detail/api/partner/cdn/player/details/',
  CONTENT_LIST: 'content-subscriber-detail/pub/api/v1/content-detail/', // NOT-USING, PI_URL & GET_CONTENT_DATA_PI is duplicate
  FETCH_DETAILS: 'content-subscriber-detail/pub/api/v1/fetch/details/',
  PLAY_LA: 'ta-recommendation/api/v1/binge/learn/CLICK',
  LIVE_CLICK_LA : 'ta-recommendation/api/v1/binge/learn/CLICK',
  LIVE_WATCH_LA : 'ta-recommendation/api/v1/binge/learn/WATCH',
  LIVE_SEARCH_LA : 'ta-recommendation/api/v1/binge/learn/SEARCH',
  NEXT_EPISODE: 'content-subscriber-detail/api/content/episode/info',
  DIGITAL_FEED: 'https://tm.tapi.videoready.tv/digital-feed-services/api/partner/player/details/', // Currently not using this API, Keeping it for reference
  LIVE_RECOMMENDATION: 'search-connector/pub/freemium/search/livedata', // Live Recommendation API's
  CONTENT_INFO_SUBTITLE: 'content-subscriber-detail/api/content/info/vod/',

  // Other Categories API's
  OTHER_CATEGORIES: 'homescreen-client/pub/api/v3/categoriesPage/LG', // This has been removed from requirement

  // Playback API's
  PLANET_MARATHI_PLAYURL: 'binge-mobile-services/api/v1/pm/play/url',
  CHAUPAL_PLAYURL: 'binge-mobile-services/api/v1/content/playback/',
  JWT_TOKEN_URL: 'auth-service-binge/v2/oauth/token-service/',
  GENERIC_PARTNER_URL: 'zee5-playback-api/generic-playback-Info-api/token',
  HUNGAMA_URL: 'https://teststaging.salthungama.com/sngapi/cd_service_metasea2_tatabinge_stream_url_api.php?content_id=$providerContentId&user_id=$profileID',
  SONY_FETCH_URL: 'zee5-playback-api/sony/fetch/token',
  HUNGAMA_CALLBACK_URL: 'https://callback.hungama.com/tata_binge/sdp_callback.php',
  ZEE_FETCH_URL: 'zee5-playback-api/v2/tag/fetch',
  TAG_API_PATH: 'zee5-playback-api/v1/lgtv/tag/fetch',
  APPLE_REDEMPTION_URL: 'binge-service/admin/api/v1/appletv/redemption/url',
  APPLE_ACTIVATION_URL: 'binge-mobile-services/api/v1/appletv/activate',
  ZEE_TRAILER_URL: 'zee5-playback-api/generic-playback-Info-api/trailer',
  ZEE_TRAILER_PUBLIC_URL: 'zee5-playback-api/pub/generic-playback-Info-api/trailer',
  // AMAZON PRIME URL
  PRIME_NUDGE: 'binge-mobile-services/api/v1/prime/entitlement/prime-nudge',
  // AMAZON PRIME And APPLE URL
  APPLE_PRIME_ENTITLEMENT_STATUS_URL: 'binge-mobile-services/api/v2/entitlement/status',
  PRIME_ACCOUNT_RECOVERY_URL: 'binge-mobile-services/api/v1/prime/account-recovery',
  PRIME_FETCH_RECOVERY_URL: 'binge-mobile-services/api/v1/prime/fetch-recovery',

  // Distro Tracking URL
  DISTRO_TRACKING_URL: 'https://i.jsrdn.com/i/1.gif?dpname=<partner_name>&r=<random>&e=<event_name>&u=<device_or_adver/sing_id>&i=<dai_session_id>&v=<dai_session_id>&f=<dai_asset_key>&m=<partner_name>&p=<content_provider_id>&show=<show_id>&ep=<episode_id>&dv=<device_category>',

  // Pubnub
  PUBNUB_HANDLING: 'binge-mobile-services/api/v1/global/config',
  PUBNUB_WRAPPER: 'binge-mobile-services/api/v1/pubnub/details',

  // Log Tracking
  LOG_TRACKING_GUEST_USER: 'binge-ops-suite/pub/v1/log/user/errors',
  LOG_TRACKING_AUTH_USER: 'binge-ops-suite/v1/log/user/errors',

  // Device Last Activity Tracking
  DEVICE_LAST_ACTIVITY:'binge-mobile-services/api/v1/last/device/activity/',

  // CleverTap
  CLEVER_PUSH_GUEST_USER: 'binge-ops-suite/pub/v1/cleverTap/push',
  CLEVER_PUSH_AUTH_PUSH: 'binge-ops-suite/v1/cleverTap/push',

  // Centrifugo Token Generator
  CENTRIFUGO_TOKEN_GENARATOR: 'centrifugo-connector/api/token/generate'

}

export default serviceConst;