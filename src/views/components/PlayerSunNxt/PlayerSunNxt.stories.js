import React from 'react';
import PlayerSunNxt from './PlayerSunNxt';

export default {
  title: 'Molecules/PlayerSunNxt',
  parameters: {
    component: PlayerSunNxt,
    componentSubtitle: 'This will be responsible for SunNxt play content',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <PlayerSunNxt { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
