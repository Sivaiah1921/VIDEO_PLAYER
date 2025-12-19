import React from 'react';
import MxPlayer from './MxPlayer';

export default {
  title: 'Molecules/MxPlayer',
  parameters: {
    component: MxPlayer,
    componentSubtitle: 'This will be responsible for MxPlayer play content',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <MxPlayer { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
