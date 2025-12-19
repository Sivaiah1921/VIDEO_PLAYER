import React from 'react';
import LanguageListComponent from './LanguageListComponent';

export default {
  title: 'Molecules/LanguageListComponent',
  parameters: {
    component: LanguageListComponent,
    componentSubtitle: 'This is the rail for language list, used in Search etc.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <LanguageListComponent { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
