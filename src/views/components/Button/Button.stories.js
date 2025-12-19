import React from 'react';
import Button from './Button';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Atoms/Button',
  parameters: {
    component: Button,
    componentSubtitle: 'Button component with different styles based on props passed',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '18rem', 'padding': '1rem', 'backgroundColor': 'purple' } } >
      <Button { ...args } />
    </div>
  </BrowserRouter>
);


export const TataPlayPrimaryButton = Template.bind( {} );
TataPlayPrimaryButton.args = {
  primary: true,
  label: 'Primary',
  disabled: false,
  size: 'medium'
};

export const TataPlaySecondaryButton = Template.bind( {} );
TataPlaySecondaryButton.args = {
  secondary: true,
  label: 'Secondary',
  disabled: false,
  size: 'medium'
};


export const TataPlayButtonWithLeftIcon = Template.bind( {} );
TataPlayButtonWithLeftIcon.args = {
  primary: true,
  label: 'Edit Profile',
  disabled: false,
  size: 'medium',
  iconLeftImage: 'Profile',
  iconLeft: true
};

export const TataPlayButtonWithRightIcon = Template.bind( {} );
TataPlayButtonWithRightIcon.args = {
  primary: true,
  label: 'Edit Profile',
  disabled: false,
  size: 'medium',
  iconRightImage: 'Profile',
  iconRight: true
};

export const TataPlayButtonWithPlatinumUser = Template.bind( {} );
TataPlayButtonWithPlatinumUser.args = {
  secondary: true,
  label: 'My Plan',
  disabled: false,
  size: 'medium',
  iconLeftImage: 'CrownGoldSheen',
  iconLeft: true,
  iconRightImage: 'PlatinumUser',
  iconRight: true
};
