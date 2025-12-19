import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopMediaCard from './TopMediaCard';

export default {
  title: 'Molecules/TopMediaCard',
  parameters: {
    component: TopMediaCard,
    componentSubtitle: 'Component to display top 10 type media cards',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps =  {
  position: 1,
  title: 'Road To Sangam',
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-0-movie_2141795233/passport/750x1000/beyondtheclouds783031049283029cc1b2e35dc4a6296625e6e40f05a44.jpg?impolicy=zee5xiomipic_zee5_com-IPM',
  provider: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
  isFocussed: false
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { width: '15.625rem' } }>
      <TopMediaCard { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps }

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };

Playground.argTypes = {
  position: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  provider: {
    control: 'select',
    options: [
      'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
      'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_52/https://res.cloudinary.com/uat-main/image/upload/v1622719547/tatasky-uat/cms-ui/images/custom-content/1622719547209.png'
    ]
  }
}
