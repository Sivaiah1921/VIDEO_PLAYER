import React from 'react';
import {{ properCase componentName }} from './{{ properCase componentName }}';
{{#if isGridNeeded}}
{{/if}}

export default {
  title: '{{ viewType }}/{{ properCase componentName }}',
  parameters: {
    component: {{ properCase componentName }},
    componentSubtitle: '{{ componentDescription }}',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <{{ properCase componentName }} { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
