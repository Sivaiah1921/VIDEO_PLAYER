import React from 'react';
import CircularProgressBar from './CircularProgressBar';

export default {
  title: 'Atoms/CircularProgressBar',
  parameters: {
    component: CircularProgressBar,
    componentSubtitle: 'This is circular progress bar to be shown in enxt episode tile',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <CircularProgressBar { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
