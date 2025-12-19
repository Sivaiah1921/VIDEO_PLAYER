import React from 'react';
import HomeMediaCard from './HomeMediaCard';

export default {
  title: 'Atoms/HomeMediaCard',
  parameters: {
    component: HomeMediaCard,
    componentSubtitle: 'Media card to show on home screen for LG',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <HomeMediaCard { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
