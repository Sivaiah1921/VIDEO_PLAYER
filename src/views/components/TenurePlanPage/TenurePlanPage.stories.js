import React from 'react';
import AppContextProvider from '../../core/AppContextProvider/AppContextProvider';
import TenurePlanPage from './TenurePlanPage';

export default {
  title: 'Molecules/TenurePlanPage',
  parameters: {
    component: TenurePlanPage,
    componentSubtitle: 'Free trial card                                                                                             ',
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
    title: 'Hotstar',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  },
  {
    title: 'Shemaroome',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  }
  ,
  {
    title: 'epicOn',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  },
  {
    title: 'CuriosityStream',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  }
]
const records = [
  {
    icon : 'Monthly',
    plan: 'Monthly',
    amount:  '₹350',
    savings:''
  },
  {
    icon : 'Quarterly',
    plan: 'Quarterly',
    amount:  '₹600',
    savings:'15%'
  },
  {
    icon : 'Yearly',
    plan: 'Yearly',
    amount:  '₹1350',
    savings:'25%'
  }
]


const Template = ( args ) => (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <AppContextProvider>
      <TenurePlanPage { ...args } />
    </AppContextProvider>
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  headTitle:'Select Tenure',
  title: 'Premium',
  apps: mockAppProps,
  records: records
}
