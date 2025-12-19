import React from 'react';
import ParentalPinSetup from './ParentalPinSetup';

export default {
  title: 'Molecules/ParentalPinSetup',
  parameters: {
    component: ParentalPinSetup,
    componentSubtitle: 'This component will allow user to enter parental pin number',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'width': '485px', 'padding': '2rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <ParentalPinSetup { ...args } />
  </div>

);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  icon: 'ParentalLock35x50',
  title: 'Enter PIN',
  subtitle: 'Enter the 4 Digit Parental PIN',
  count: 4,
  helpText: 'Forgot PIN? You can change your Parental PIN from tataplaybinge.com or Tata Play Binge Mobile App',
  btnLabel: 'Proceed',
  disabled: false,
  inputValue: []
}

