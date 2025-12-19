import React from 'react';
import BackgroundComponent from './BackgroundComponent';

export default {
  title: 'Molecules/BackgroundComponent',
  parameters: {
    component: BackgroundComponent,
    componentSubtitle: 'Background Component                                                                                                    ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BackgroundComponent { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1648107959/tatasky-uat/cms-ui/images/custom-content/1648107956680.png',
  alt: 'background Background Component image'
}
