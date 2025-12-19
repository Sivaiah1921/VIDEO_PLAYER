import React from 'react';
import BannerComponent from './BannerComponent';

export default {
  title: 'Molecules/BannerComponent',
  parameters: {
    component: BannerComponent,
    componentSubtitle: 'This component will show BannerComponent page page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BannerComponent { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  bgImg: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_926,h_462/https://akamaividz2.zee5.com/image/upload/w_1920,h_1080,c_scale/resources/0-0-newsauto_g9keqtrs2100/list/May3v5booglebollywoodlargee0ee9e6d389f49c681fd5b408bf95349.jpg',
  alt: 'background BannerComponent image'
}

