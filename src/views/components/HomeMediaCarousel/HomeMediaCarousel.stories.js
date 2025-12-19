import React from 'react';
import HomeMediaCarousel from './HomeMediaCarousel';

export default {
  title: 'Organisms/HomeMediaCarousel',
  parameters: {
    component: HomeMediaCarousel,
    componentSubtitle: 'To show media carousel for the home page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <HomeMediaCarousel { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
