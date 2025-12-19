import React from 'react';
import ParentalPin from './ParentalPin';

export default {
  title: 'Organisms/ParentalPin',
  parameters: {
    component: ParentalPin,
    componentSubtitle: 'This component will show parantal pin information page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <ParentalPin { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  icon: 'ParentalLock48x68',
  title: 'Setup Parental Pin',
  content: 'You can setup your Parental PIN and viewing restrictions from tataplaybinge.com or Tata Play Binge Mobile App'
}

