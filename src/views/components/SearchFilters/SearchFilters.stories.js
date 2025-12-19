import React from 'react';
import SearchFilters from './SearchFilters';

export default {
  title: 'Molecules/SearchFilters',
  parameters: {
    component: SearchFilters,
    componentSubtitle: 'This is the show and hide filters of search page consisting of language and genre filters',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <SearchFilters { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
