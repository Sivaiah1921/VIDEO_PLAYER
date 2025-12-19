import React from 'react';
import UpgradeMyPlan from './UpgradeMyPlan';
import AppContextProvider from '../../core/AppContextProvider/AppContextProvider';

export default {
  title: 'Organisms/UpgradeMyPlan',
  parameters: {
    component: UpgradeMyPlan,
    componentSubtitle: 'Upgrade My Plan                                                                                                                        ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockAppProps = [
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
];

const Template = ( args ) => (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <AppContextProvider>
      <UpgradeMyPlan { ...args } />
    </AppContextProvider>
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  upgradeMyPlanTitle: 'My Plan',
  upgradeMyPlanType: 'Standard',
  upgradeMyPlan: '₹200/month',
  upgradeMyPlanExpire: 'Expires on 20/05/2022',
  apps: mockAppProps
}