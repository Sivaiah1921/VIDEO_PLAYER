import React from 'react';
import RadioButton from './RadioButton';

export default {
  title: 'Atoms/RadioButton',
  parameters: {
    component: RadioButton,
    componentSubtitle: 'common radiobutton component used by other mudules as a reusable component which returns ui for radio button and required fields can be passed as props',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <RadioButton { ...args } />
);

export const RadioBasicUsage = Template.bind( {} );
RadioBasicUsage.args = {
  id: 'subscribe',
  name: 'radiosubscribe',
  value: 'yes',
  label: 'Subscribe',
  role: 'radiogroup',
  children: 'Radio ButtonText',
  tabIndex: 0,
  ariaChecked: true,
  isChecked: true,
  isDisabled: false,
  hideInput:false
}