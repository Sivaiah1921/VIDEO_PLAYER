import React from 'react';
import Divider from './Divider';

export default {
  title: 'Atoms/Divider',
  parameters: {
    component: Divider,
    componentSubtitle: 'The Divider component is used to delineate sections of the page. Commonly gray inside page content, it can also be a multi-colored bar, as used in various footers for both desktop and mobile. Margin and bottom padding values can also be passed as props for specific spacing.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const BasicUsage = ( args ) => (
  <div style={ { 'height': '8rem', 'padding': '1rem', 'backgroundColor': 'purple' } } >
    <Divider { ...args } />
  </div>
);

BasicUsage.args = {
  spacerValue: '01',
  vertical: true
};

BasicUsage.argTypes = {
  spacerValue: {
    control: 'select',
    options: ['00', '01', '02', '03', '04', '05', '06', '07', '08']
  }
}

export const HorizontalGradient = ( args ) => (
  <div style={ { 'height': '13rem', 'padding-left': '8rem', 'backgroundColor': 'black' } } >
    <Divider { ...args } />
  </div>
);

HorizontalGradient.args = {
  spacerValue: '01',
  horizontalGradient: true
};