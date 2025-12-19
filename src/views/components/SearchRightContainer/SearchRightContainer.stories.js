import React from 'react';
import SearchRightContainer from './SearchRightContainer';

export default {
  title: 'Organisms/SearchRightContainer',
  parameters: {
    component: SearchRightContainer,
    componentSubtitle: 'This is the right side container of the Search Page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <SearchRightContainer { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
