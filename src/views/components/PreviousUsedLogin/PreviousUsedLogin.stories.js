import React from 'react';
import PreviousUsedLogin from './PreviousUsedLogin';

export default {
  title: 'Molecules/PreviousUsedLogin',
  parameters: {
    component: PreviousUsedLogin,
    componentSubtitle: 'The component each previously used logged in rmns for the previously used login screen',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockProps = {
  'user': {
    'mobileNumber': '8888899999',
    'premiumUser': false
  },
  'index': 1
}

const Template = ( args )=> (
  <PreviousUsedLogin { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockProps }

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
