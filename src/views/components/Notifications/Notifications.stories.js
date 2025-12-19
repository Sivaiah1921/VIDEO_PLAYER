import React from 'react';
import Success from '../Icons/Success';
import Notifications from './Notifications';

export default {
  title: 'Molecules/Notifications',
  parameters: {
    component: Notifications,
    componentSubtitle: 'This component is used to show various notifications on a screen like success, warning etc.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps = {
  iconName : 'Success',
  message: 'Device renamed successfully!'
}

const Template = ( args )=> (
  <Notifications { ...defaultProps } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps }

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };
