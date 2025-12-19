import React from 'react';
import SearchGenre from './SearchGenre';

export default {
  title: 'Molecules/SearchGenre',
  parameters: {
    component: SearchGenre,
    componentSubtitle: 'This is the genre rail of search page after show filter',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <SearchGenre { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
