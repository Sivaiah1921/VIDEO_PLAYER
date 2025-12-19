/* eslint-disable no-console */
import React from 'react';
import { ALPHANUMERICKEYBOARD } from '../../../utils/constants';
import AlphanumericKeyboard from './AlphanumericKeyboard';

export default {
  title: 'Molecules/AlphanumericKeyboard',
  parameters: {
    component: AlphanumericKeyboard,
    componentSubtitle: 'alphanumeric keyboard',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <AlphanumericKeyboard { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  onChange: a => console.log( a ),
  onClear: a => console.log( a ),
  onRemove: a => console.log( a ),
  onSpace: a => console.log( a ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  spaceBtnLabel:'Space',
  keys: ALPHANUMERICKEYBOARD.KEYBOARD_WITH_SPECIAL_KEYS
}
