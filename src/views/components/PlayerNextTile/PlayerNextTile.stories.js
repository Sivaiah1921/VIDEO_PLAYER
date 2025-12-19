import React from 'react';
import PlayerNextTile from './PlayerNextTile';

export default {
  title: 'Atoms/PlayerNextTile',
  parameters: {
    component: PlayerNextTile,
    componentSubtitle: 'This component will show the information of next episode and time in which it will start',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <PlayerNextTile { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
