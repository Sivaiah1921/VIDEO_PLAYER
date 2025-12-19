import React from 'react';
import AccordionSection from './AccordionSection';

export default {
  title: 'Molecules/AccordionSection',
  parameters: {
    component: AccordionSection,
    componentSubtitle: 'The AccordionSection is the content portion for each individual Accordion within the AccordionGroup.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const BasicUsage = ( args ) => {
  return (
    <AccordionSection { ...args } />
  );
}
BasicUsage.args = {
  title: 'Accordion Title',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
  bodyStyle: 'body-1',
  active: true
}

BasicUsage.argTypes = {
  bodyStyle: {
    control: 'select',
    options: ['body-1', 'body-2', 'body-3']
  }
}