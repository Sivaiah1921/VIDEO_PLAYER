/* eslint-disable no-console */
import React from 'react';
import ParentalPinSetupPage from './ParentalPinSetupPage';

export default {
  title: 'Molecules/ParentalPinSetupPage',
  parameters: {
    component: ParentalPinSetupPage,
    componentSubtitle: 'Component provides parental pin setup info page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'padding': '2rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <ParentalPinSetupPage { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  onChange: ( e ) => console.log( e ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  onClear:( e ) => console.log( e ),
  onRemove: ( e ) => console.log( e ),
  icon: 'ParentalLock35x50',
  title: 'Enter PIN',
  subtitle: 'Enter the 4 Digit Parental PIN',
  count: 4,
  helpText: 'Forgot PIN? You can change your Parental PIN from tataplaybinge.com or Tata Play Binge Mobile App',
  btnLabel: 'Proceed',
  inputValue: []
}


