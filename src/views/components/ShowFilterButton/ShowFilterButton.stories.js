import React from 'react';
import ShowFilterButton from './ShowFilterButton';

export default {
  title: 'Molecules/ShowFilterButton',
  parameters: {
    component: ShowFilterButton,
    componentSubtitle: 'This is teh button to show or hide filters',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <ShowFilterButton { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
