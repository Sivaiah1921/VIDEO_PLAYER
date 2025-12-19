import React from 'react';
import LoginOtpEnteringPane from './LoginOtpEnteringPane';

export default {
  title: 'Molecules/LoginOtpEnteringPane',
  parameters: {
    component: LoginOtpEnteringPane,
    componentSubtitle: 'As an anonymous or authenticated, I should see onboarding login OTP entering apne if received from the back end services.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <LoginOtpEnteringPane { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: 'Login',
  mobileNumber:'8884756375',
  resendBtnLabel:'Resend OTP',
  errorMsg:'Incorrect OTP'
}

