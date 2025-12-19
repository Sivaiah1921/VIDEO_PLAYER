import React from 'react';
import Search from './Search';

export default {
  title: 'Organisms/Search',
  parameters: {
    component: Search,
    componentSubtitle: 'This is the Search page, rendered after clicking on search on the left nav',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Search { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
