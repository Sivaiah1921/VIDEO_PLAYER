import React from 'react';
import AppContextProvider from '../../core/AppContextProvider/AppContextProvider';
import { BrowserRouter } from 'react-router-dom';
import ComboPack from './ComboPack';


export default {
  title: 'Molecules/ComboPack',
  parameters: {
    component: ComboPack,
    componentSubtitle: 'Combo Pack                                                                       ',
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

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <AppContextProvider>
        <ComboPack { ...args } />
      </AppContextProvider>
    </div>
  </BrowserRouter>
);

export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  comboPackTitle: 'My Plan',
  comboPackSubTitle: 'Malyalam Hindi English Basic HD',
  amountValue: '&#8377;299/month',
  comboPlanExpire: 'Renewal on 20/05/2020',
  hdText: '45',
  sdText: '100',
  apps: mockAppProps
}

export const Playground = Template.bind( {} );
Playground.args = {
  comboPackTitle: 'My Plan',
  comboPackSubTitle: 'Malyalam Hindi English Basic HD',
  superComboPackSubTitle: 'You have access to 13 Entertainment Apps with your Binge Combo',
  amountValue: '&#8377;299/month',
  comboPlanExpire: 'Renewal on 20/05/2020',
  hdText: '45',
  sdText: '100',
  apps: mockAppProps,
  supperComboPack: true
};
