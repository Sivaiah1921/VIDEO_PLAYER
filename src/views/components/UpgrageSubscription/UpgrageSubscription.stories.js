import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '../../core/AppContextProvider/AppContextProvider';
import UpgrageSubscription from './UpgrageSubscription';

export default {
  title: 'Molecules/UpgrageSubscription',
  parameters: {
    component: UpgrageSubscription,
    componentSubtitle: 'Upgrage Subscription                                   ',
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
  }
]

const Template = ( args )=> (
  <BrowserRouter>
    <AppContextProvider>
      <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
        <UpgrageSubscription { ...args } />
      </div>
    </AppContextProvider>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: 'Upgrade your Taga Play Binge Subscription',
  subTitle: 'Your are currently on Elite.',
  subTitle2: 'Change your plan to watch on TV and enjoy some additional benefits',
  apps: mockAppProps
}
