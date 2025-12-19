import React from 'react';
import AutoCompleteSuggestions from './AutoCompleteSuggestions';

export default {
  title: 'Molecules/AutoCompleteSuggestions',
  parameters: {
    component: AutoCompleteSuggestions,
    componentSubtitle: 'This component will be used in the search screen to show the list of suggestions when something is entered by the user.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <AutoCompleteSuggestions { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
