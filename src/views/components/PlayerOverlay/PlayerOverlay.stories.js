import React from 'react';
import PlayerOverlay from './PlayerOverlay';

export default {
  title: 'Molecules/PlayerOverlay',
  parameters: {
    component: PlayerOverlay,
    componentSubtitle: 'Contains common controls ui for all player',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <PlayerOverlay { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
