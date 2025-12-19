import React from 'react';
import SubscriptionPackage from './SubscriptionPackage';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '../../core/AppContextProvider/AppContextProvider';

export default {
  title: 'Organisms/SubscriptionPackage',
  parameters: {
    component: SubscriptionPackage,
    componentSubtitle: 'Subscription Package                                                                ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockPropsSubscriptionPackages = [
  {
    title: 'Maxi',
    titleIcon: 'CrownGoldForward',
    titlePremium: false,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    balanceDetails: '₹200 will be deducted from balance on 05/03/2022',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  },
  {
    title: 'Standard',
    titleIcon: 'CrownGoldForward',
    titlePremium: false,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    balanceDetails: '₹200 will be deducted from balance on 05/03/2022',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  },
  {
    title: 'Premium',
    titleIcon: 'CrownGoldForward',
    titlePremium: true,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    balanceDetails: '₹200 will be deducted from balance on 05/03/2022',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  }];

const mockPropsMonthlyPlanPackages = [
  {
    tag: 'Current Plan',
    title: 'Standard',
    titleIcon: 'CrownGoldForward',
    titlePremium: false,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    monthlyPlan: '₹200/month',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  },
  {
    title: 'Maxi',
    titleIcon: 'CrownGoldForward',
    titlePremium: false,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    monthlyPlan: '₹150/month',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  },
  {
    title: 'Premium',
    titleIcon: 'CrownGoldForward',
    titlePremium: true,
    appLabel: 'Apps',
    deviceDetails: 'TV, Mobile & Web',
    deviceIcon: 'Devices',
    trialEndDate: 'Free trial ends on 04/05/2022',
    monthlyPlan: '₹300/month',
    apps: [
      {
        title: 'Hotstar',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'CuriosityStream',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'docubay',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }, {
        title: 'SunNxt',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Hungama',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'epicOn',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      },
      {
        title: 'Shemaroome',
        image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
        isFocussed: false
      }
    ]
  }];

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <AppContextProvider>
        <SubscriptionPackage { ...args } />
      </AppContextProvider>
    </div>
  </BrowserRouter>
);


export const SubscriptionPackages = Template.bind( {} );
SubscriptionPackages.args = {
  subscriptionPackageTitleIcon: 'CrownGoldForward40x40',
  subscriptionPackageTitle: 'Start Your 30 Days Free Trial Today!',
  subscriptionPackageSubTitle: 'Select your preferred plan & start watching.',
  subscriptionPackages: mockPropsSubscriptionPackages
}

export const ChangePlanPackages = Template.bind( {} );
ChangePlanPackages.args = {
  subscriptionPackageTitleIcon: 'CrownGoldForward40x40',
  subscriptionPackageTitle: 'Change Plan',
  subscriptionPackageSubTitle: 'Choose your plan. Simple pricing for everyone!',
  subscriptionPackages: mockPropsMonthlyPlanPackages
}

