import React from 'react';
import Splash from './Splash';

export default {
  title: 'Molecules/Splash',
  parameters: {
    component: Splash,
    componentSubtitle: 'This component will be used to show the animated splash logo on the loading of the app.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Splash { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
