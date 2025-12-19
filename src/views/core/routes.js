import React from 'react';
import Home from '../components/Home/Home';
import { Redirect, Route, Switch } from 'react-router-dom';
import Catalog from '../components/Catalog/Catalog';
import CatalogPartner from '../components/CatalogPartner/CatalogPartner';
import PlaybackInfo from '../components/PlaybackInfo/PlaybackInfo';
import SeriesDetailPage from '../components/SeriesDetailPage/SeriesDetailPage';
import MyAccount from '../components/MyAccount/MyAccount';
import LoginForm from '../components/LoginForm/LoginForm';
import MultiLanguageList from '../components/MultiLanguageList/MultiLanguageList';
import SubscriberForm from '../components/SubscriberForm/SubscriberForm';
import DeviceManagementPage from '../components/DeviceManagementPage/DeviceManagementPage';
import SubscriptionPackage from '../components/SubscriptionPackage/SubscriptionPackage';
import EditProfile from '../components/EditProfile/EditProfile';
import MyPlanSetup from '../components/MyPlanSetup/MyPlanSetup';
import ConfirmPurchase from '../components/ConfirmPurchase/ConfirmPurchase';
import TermsOfUse from '../components/TermsOfUse/TermsOfUse';
import ContactUsPage from '../components/ContactUsPage/ContactUsPage';
import RenameDevice from '../components/RenameDevice/RenameDevice';
import TenurePlanPage from '../components/TenurePlanPage/TenurePlanPage';
import FaQs from '../components/FaQs/FaQs';
import BingeListPage from '../components/BingeListPage/BingeListPage';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';
import ParentalPinSetupPage from '../components/ParentalPinSetupPage/ParentalPinSetupPage';
import OtherCategories from '../components/OtherCategories/OtherCategories';
import Search from '../components/Search/Search';
import AppExitScreen from '../components/AppExitScreen/AppExitScreen';
import ParentalPinStatus from '../components/ParentalPinStatus/ParentalPinStatus';
import ParentalPin from '../components/ParentalPin/ParentalPin';
import Splash from '../components/Splash/Splash';
import { ErrorPage } from '../components/ErrorPage/ErrorPage';
import MxPlayer from '../components/MxPlayer/MxPlayer';
import OTP from '../components/OTP/otp';
import RMN from '../components/RMN/RMN';
import PlayerSonLiv from '../components/PlayerSonLiv/PlayerSonLiv';
import HeroBannerDetailView from '../components/HeroBannerDetailView/HeroBannerDetailView';
import PlayerSunNxt from '../components/PlayerSunNxt/PlayerSunNxt';
import PlayerComposer from '../components/Player/playerComposer';
import PrimeInterstitialScreen from '../components/PrimeInterstitialScreen/PrimeInterstitialScreen';
import AppleInterstitialScreen from '../components/AppleInterstitialScreen/AppleInterstitialScreen';

const config = {
  ModuleRoutes: null,
  renderer: null,
  targetElementId: null
};

const ROUTES = [
  // {
  //   path: '/discover',
  //   key: 'HOME',
  //   exact: true,
  //   hideMenu: false,
  //   component: ( props ) => <Home key={ props.match.params.pagetype } />
  // },
  // {
  //   path:'/discover/:pagetype',
  //   key: 'HOME',
  //   exact: true,
  //   hideMenu: false,
  //   component: ( props ) => <Home key={ props.match.params.pagetype } />
  // },
  {
    path: '/Account',
    key: 'PROFILE',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/Account',
        key: 'PROFILE',
        exact: true,
        component: () => <MyAccount />
      },
      {
        path: '/account/profile/edit',
        key: 'EDIT_PROFILE',
        exact: true,
        component: () => <EditProfile />
      }
    ]
  },
  {
    path: '/plan',
    key: 'PLAN',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/plan/current',
        key: 'CURRENT_PLAN',
        exact: true,
        component: () => <MyPlanSetup />
      },
      {
        path: '/plan/purchase/:title/:type/:tenure',
        key: 'PURCHASE_PLAN',
        component: () => <ConfirmPurchase />
      },
      {
        path: '/plan/change-tenure/:productId/:type/:location?',
        key: 'CHANGE_TENURE',
        hideMenu: true,
        component: () => <TenurePlanPage />
      },
      {
        path: '/plan/subscription',
        key: 'PACKAGE_DETAILS',
        hideMenu: true,
        component: () => <SubscriptionPackage />
      },
      {
        path: '/plan/renew/:option',
        key: 'PACKAGE_RENEW',
        hideMenu: true,
        component: () => <SubscriptionPackage />
      }
    ]
  },
  {
    path: '/browse-by',
    key: 'BROWSE_BY',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/browse-by/:listType',
        key: 'BROWSE_BY_CONTENT',
        hideMenu: true,
        component: ( props ) => <Catalog key={ props.match.params.listType } />
      }
    ]
  },
  {
    path: '/browse-by-app',
    key: 'BROWSE_BY_APP',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/browse-by-app/:title/:pageType/:railType',
        key: 'BROWSE_BY_PROVIDER',
        hideMenu: true,
        component: ( props ) => <CatalogPartner key={ props.match.params.pageType } />
      }
    ]
  },
  {
    path: '/device',
    key: 'DEVICE',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/device/details/:baId',
        key: 'DEVICE',
        hideMenu: true,
        component: () => <SubscriberForm />
      },
      {
        path: '/device/setting/device-management/:baId/:subscriberId',
        key: 'DEVICE_MANAGEMENT',
        hideMenu: true,
        component: () => <DeviceManagementPage />
      },
      {
        path: '/device/renameDevice',
        key: 'RENAME_DEVICE',
        hideMenu: true,
        component: () => <RenameDevice />
      },
      {
        path: '/device/subscriber',
        key: 'SUBSCRIBER_FORM',
        hideMenu: true,
        component: () => <SubscriberForm />
      },
      {
        path: '/device/transactionHistory',
        key: 'TRANSACTION_HISTORY',
        hideMenu: true,
        component: () => <TransactionHistory />
      },
      {
        path: '/device/parentalPinSetup',
        key: 'PARENTALPIN_SETUP',
        hideMenu: true,
        component: () => <ParentalPinStatus />
      },
      {
        path: '/device/fourDigitParentalPinSetup',
        key: 'PARENTALPIN_FOUR_SETUP',
        hideMenu: true,
        component: () => <ParentalPinSetupPage />
      },
      {
        path: '/device/no-parentalPinSetup',
        key: 'NO_PARENTALPIN_SETUP',
        hideMenu: true,
        component: () => <ParentalPin />
      }
    ]
  },
  {
    path: '/content',
    key: 'CONTENT',
    hideMenu: true,
    component: RenderRoutes,
    routes: [
      {
        path: '/content/detail/:parentContentType/:parentContentId',
        key: 'PI_CONTENT',
        hideMenu: true,
        component: ( props ) => <PlaybackInfo key={ props.match.params.parentContentId } />


      },
      {
        path: '/content/episode/:type/:id',
        key: 'SERIES_DETAIL_PAGE',
        hideMenu: true,
        component: () => <SeriesDetailPage />
      },
      {
        path: '/content/languages',
        key: 'LANGUAGE_LIST',
        component: () => <MultiLanguageList />
      },
      {
        path: '/content/hero-banner-rail/:HBID',
        key: 'HERO_BANNER_RAIL',
        component: () => <HeroBannerDetailView />
      }
    ]
  },
  {
    path: '/faqs',
    key: 'FAQ',
    hideMenu: true,
    component: () => <FaQs />
  },
  {
    path: '/login',
    key: 'LOGIN',
    hideMenu: true,
    component: () => <LoginForm />
  },
  {
    path: '/verify-otp',
    key: 'OTP',
    hideMenu: true,
    component: () => <OTP />
  },
  {
    path: '/new-rmn',
    key: 'OTP',
    hideMenu: true,
    component: () => <RMN />
  },
  {
    path: '/app-exit-screen',
    key: 'APP_EXIT_SCREEN',
    hideMenu: true,
    component: () => <AppExitScreen />
  },
  {
    path: '/terms-of-use',
    key: 'TERMOSFUSE',
    hideMenu: true,
    component: () => <TermsOfUse />
  },
  {
    path: '/contact',
    key: 'CONTACT',
    hideMenu: true,
    component: () => <ContactUsPage />
  },
  {
    path: '/player',
    key: 'PLAYER',
    hideMenu: true,
    component: () => <PlayerComposer />
  },
  {
    path: '/sunnxt',
    key: 'PLAYER_SUNNXT',
    hideMenu: true,
    component: () => <PlayerSunNxt />
  },
  {
    path: '/mxplayer',
    key: 'MXPLAYER',
    hideMenu: true,
    component: () => <MxPlayer /> // TODO: pingtest is not stopped on unmount, Ram to chek with partner
  },
  {
    path: '/sonylivPlayer',
    key: 'SONYLIVPLAYER',
    hideMenu: true,
    component: () => <PlayerSonLiv />
  },
  { path: '/Search',
    key: 'SEARCH',
    hideMenu: true,
    component: () => <Search />
  },
  {
    path: '/Trailor',
    key: 'TRAILOR',
    hideMenu: true,
    component: () => <PlayerComposer watchTrailor />
  },
  {
    path: '/change-tenure/:productId/:type',
    key: 'CHANGE_TENURE',
    hideMenu: true,
    component: () => <TenurePlanPage />
  },
  {
    path: '/binge-list',
    key: 'BINGE_LIST',
    hideMenu: true,
    component: () => <BingeListPage />
  },
  {
    path: '/other-categories',
    key: 'OTHER_CATEGORIES',
    hideMenu: false,
    component: () => <OtherCategories />
  },
  {
    path: '/splash',
    key: 'SPLASH',
    hideMenu: true,
    component: () => <Splash config={ config }/>
  },
  {
    path: '/error',
    key: 'ERROR',
    hideMenu: false,
    component: () => <ErrorPage />
  },
  {
    path: '/DONGLE',
    key: 'APPS',
    component: RenderRoutes,
    routes: [
      {
        path: '/app',
        key: 'APP_ROOT',
        exact: true,
        component: () => <h1>App Index</h1>
      },
      {
        path: '/app/page',
        key: 'APP_PAGE',
        exact: true,
        component: () => <h1>App Page</h1>
      }
    ]
  },
  {
    path: '/prime',
    key: 'PRIME',
    hideMenu: true,
    component: () => <PrimeInterstitialScreen />
  },
  {
    path: '/apple',
    key: 'APPLE',
    hideMenu: true,
    component: () => <AppleInterstitialScreen />
  }
];

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
const RouteWithSubRoutes = React.memo(
  ( route ) => {
    return (
      <Route
        path={ route.path }
        exact={ route.exact }
        render={ ( props ) => (
          <route.component { ...props }
            routes={ route.routes }
          />
        ) }
      />
    );
  },
  ( prevProps, nextProps ) => {
    // Custom comparison function to check if the props are actually different
    // This prevents re-renders if `route.component` and `route.routes` are the same
    return (
      prevProps.path === nextProps.path &&
      prevProps.exact === nextProps.exact &&
      prevProps.routes === nextProps.routes &&
      prevProps.component === nextProps.component
    );
  }
);

/**
 * Use this component for any new section of routes (any config object that has a "routes" property)
 */
export function RenderRoutes( { routes } ){
  return (
    <Switch>
      { routes.map( ( route, i ) => {
        return (
          <RouteWithSubRoutes key={ route.key }
            { ...route }
          />
        );
      } ) }
      <Redirect to='/discover' />
    </Switch>
  );
}

export default ROUTES;