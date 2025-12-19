import React from 'react';
import Synopsis from './Synopsis';

export default {
  title: 'Molecules/Synopsis',
  parameters: {
    component: Synopsis,
    componentSubtitle: 'This component will provide the content info on focus',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Synopsis { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  metaData: {},
  config: {}
}
