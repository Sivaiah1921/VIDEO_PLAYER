import React from 'react';
import PlaybackInfo from './PlaybackInfo';

export default {
  title: 'Organisms/PlaybackInfo',
  parameters: {
    component: PlaybackInfo,
    componentSubtitle: 'This component will provide the playback information of movies &amp; series',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <PlaybackInfo { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
