import React from 'react';
import Accordion from './Accordion';

export default {
  title: 'Molecules/Accordion',
  parameters: {
    component: Accordion,
    componentSubtitle: ' Accordion component will expand and collapse on click of arrow which shows and hides details under a heading.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Accordion { ...args } />
);

const defaultProps =  {
  key: 1,
  title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
}

export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps };

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };
