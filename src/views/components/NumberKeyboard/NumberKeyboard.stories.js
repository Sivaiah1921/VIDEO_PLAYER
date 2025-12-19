/* eslint-disable no-console */
import React from 'react';
import NumberKeyboard from './NumberKeyboard';

export default {
  title: 'Molecules/NumberKeyboard',
  parameters: {
    component: NumberKeyboard,
    componentSubtitle: 'As an anonymous or authenticated, when on onboarding page I should see number keyboard component if received from the back end services',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <NumberKeyboard { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  onChange: a => console.log( a ),
  onClear: a => console.log( a ),
  onRemove: a => console.log( a ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete'
}
