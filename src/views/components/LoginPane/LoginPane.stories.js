import React from 'react';
import LoginPane from './LoginPane';
import { BrowserRouter } from 'react-router-dom';
const { LOGINBTN_NAME } = require( '../../../utils/constants' ).default;


export default {
  title: 'Molecules/LoginPane',
  parameters: {
    component: LoginPane,
    componentSubtitle: 'As an anonymous or authenticated, It should be seen onboarding login page if received from the back end services',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <LoginPane { ...args } />
    </div>
  </BrowserRouter>

);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  mobInputLabel: 'Enter Registered Mobile Number',
  loginTitle: 'Login',
  proceedBtnLabel: 'I accept the ',
  proceedBtnLabel2: 'Terms and Conditions',
  prefixValue: '+91',
  btnLabel: LOGINBTN_NAME,
  disabled: true,
  value: ''
}
