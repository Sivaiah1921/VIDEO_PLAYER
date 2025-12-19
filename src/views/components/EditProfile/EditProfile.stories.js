import React from 'react';
import EditProfile from './EditProfile';
import { BrowserRouter } from 'react-router-dom';
import { ALPHANUMERICKEYBOARD } from '../../../utils/constants';

export default {
  title: 'Organisms/EditProfile',
  parameters: {
    component: EditProfile,
    componentSubtitle: 'Edit Profile Page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '300vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <EditProfile { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  spaceBtnLabel: 'Space',
  url: '#',
  iconImage: 'Profile32x32',
  editProfileTitle: 'Edit Profile',
  editProfileName:'Name',
  editProfileLabel:'Reyansh Demian',
  registeredMobileLabel:'Registered Mobile Number',
  registeredMobilePrefixNumber: '+91',
  registeredMobileValue:'8364738725',
  emailLabel: 'Email',
  emailValue: 'reyanshdamian@gmail.com',
  btnLabel:'Update',
  keys: ALPHANUMERICKEYBOARD.KEYBOARD_WITH_SPECIAL_KEYS
}