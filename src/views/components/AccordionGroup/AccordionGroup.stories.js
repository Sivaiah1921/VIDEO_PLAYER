import React from 'react';
import AccordionGroup from './AccordionGroup';

export default {
  title: 'Organisms/AccordionGroup',
  parameters: {
    component: AccordionGroup,
    componentSubtitle: 'The section accordion is used when the content spans the whole width of the container, like page sections.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const props = {
  detailAccordion: false,
  accordionList : [{
    title : 'Sample Title 1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'None',
    active: true
  },
  {
    title : 'Sample Title 2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-2',
    active: false
  },
  {
    title : 'Sample Title 3',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-3',
    active: false
  },
  {
    title : 'Sample Title 4',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-1',
    active: false
  }],
  spacerValue:'01'
}

export const BasicUsage = ( args ) => {
  return (
    <AccordionGroup { ...args } />
  );
};

BasicUsage.args = {
  detailAccordion: props.detailAccordion,
  accordionList: props.accordionList,
  spacerValue: props.spacerValue,
  bodyStyle: props.bodyStyle
}

BasicUsage.argTypes = {
  spacerValue: {
    control: 'select',
    options: ['00', '01', '02', '03', '04', '05', '06', '07', '08']
  },
  bodyStyle: {
    control: 'select',
    options: ['none', 'body-1', 'body-2', 'body-3', 'body-4']
  }
}
