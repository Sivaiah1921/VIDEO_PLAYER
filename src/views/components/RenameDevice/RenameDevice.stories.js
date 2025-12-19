/* eslint-disable no-console */
import React from 'react';
import { ALPHANUMERICKEYBOARD } from '../../../utils/constants';
import RenameDevice from './RenameDevice';

export default {
  title: 'Molecules/RenameDevice',
  parameters: {
    component: RenameDevice,
    componentSubtitle: 'This component will allow user to rename the device',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'width':'1280px', 'height': '100vh', 'padding': '4rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <RenameDevice { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  alphanumericKeyboardProp: {
    keys: ALPHANUMERICKEYBOARD.KEYBOARD_WITHOUT_SPECIAL_KEYS,
    onChange: a => console.log( a ),
    onClear: a => console.log( a ),
    onRemove: a => console.log( a ),
    onSpace: a => console.log( a ),
    clearBtnLabel: 'Clear',
    deleteBtnLabel: 'Delete',
    spaceBtnLabel:'Space'
  },
  title : 'Rename Device',
  sectionInfo: 'Key in preferred device name',
  btnLabel: 'Update',
  inputValue: 'Briju’s iPhone'
}
