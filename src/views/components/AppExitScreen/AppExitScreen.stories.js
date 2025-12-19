import React from 'react';
import AppExitScreen from './AppExitScreen';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Molecules/AppExitScreen',
  parameters: {
    component: AppExitScreen,
    componentSubtitle: '                                                    ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockProps = {
  iconName : 'Logout80x81',
  message: 'Exiting Tata Play Binge',
  info: 'Do you want to proceed',
  buttonLabelYes: 'Yes',
  buttonLabelNo: 'No'
}

const Template = ( args )=> (
  <BrowserRouter>
    <AppExitScreen { ...args } />
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockProps };
