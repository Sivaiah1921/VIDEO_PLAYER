import React from 'react';
import NeflixComboPlan from './NeflixComboPlan';

export default {
  title: 'Atoms/NeflixComboPlan',
  parameters: {
    component: NeflixComboPlan,
    componentSubtitle: 'This component has some new design changes',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <NeflixComboPlan { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
