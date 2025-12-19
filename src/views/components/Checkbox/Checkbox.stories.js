import React, { useState } from 'react';
import Checkbox from './Checkbox';

export default {
  title: 'Atoms/Checkbox',
  parameters: {
    component: Checkbox,
    componentSubtitle: 'The Checkbox component is to display either a checkbox or toggle button form element.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};




export const CheckBox = ( args ) => {
  const [checked, setChecked] = useState( false );

  const onChange = () => {
    setChecked( !checked );
  };

  return (
    <Checkbox
      onChange={ onChange }
      checked={ checked }
      { ...args }
    > { 'CheckBox' }
    </Checkbox>
  )
}
CheckBox.args = {
  id:'CheckBox',
  name:'CheckBox',
  tabIndex: 0,
  disabled: false,
  labelPositionLeft: true,
  toggleButton: false,
  isCustom: false
}

const Template = ( args ) => (
  <div style={ { 'padding': '2rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <Checkbox { ...args } />
  </div>
);


export const Switcher = Template.bind( {} );
Switcher.args = {
  id:'switcher',
  name:'switcher',
  tabIndex: 0,
  disabled: false,
  labelPositionLeft: true,
  toggleButton: true
}

const CustomCheckboxTemplate = ( args ) => (
  <div>
    <Checkbox { ...args } >{ 'Checkbox' }</Checkbox>
  </div>
);

export const CustomCheckbox = CustomCheckboxTemplate.bind( {} );
CustomCheckbox.args = {
  id:'CheckBox',
  name:'CheckBox',
  tabIndex: 0,
  disabled: false,
  labelPositionLeft: true,
  toggleButton: false,
  isCustom: true
}