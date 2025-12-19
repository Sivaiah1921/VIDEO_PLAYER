import React from 'react';
import Loader from './Loader';

export default {
  title: 'Atoms/Loader',
  parameters: {
    component: Loader,
    componentSubtitle: 'loader                                                                                                    ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Loader { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
