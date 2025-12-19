import React from 'react';
import MediaCarousel from './MediaCarousel';

export default {
  title: 'Organisms/MediaCarousel',
  parameters: {
    component: MediaCarousel,
    componentSubtitle: 'Carousel wraper component for all media card rails',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <MediaCarousel { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
