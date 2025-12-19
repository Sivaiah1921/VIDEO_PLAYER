import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppMediaCard from './AppMediaCard';
import { AppContextProvider } from '../../core/AppContextProvider/AppContextProvider';

export default {
  title: 'Molecules/AppMediaCard',
  parameters: {
    component: AppMediaCard,
    componentSubtitle: 'Component to display App/provider media card.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps = {
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
  title: 'Hotstar',
  isFocussed: false
};

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { width: '118px' } }>
      <AppContextProvider>
        <AppMediaCard { ...args } />
      </AppContextProvider>
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps, image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717764/tatasky-uat/cms-ui/images/custom-content/1643717763418.png' }

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };
