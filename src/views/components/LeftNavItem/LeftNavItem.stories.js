import React from 'react';
import LeftNavItem from './LeftNavItem';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Atoms/LeftNavItem',
  parameters: {
    component: LeftNavItem,
    componentSubtitle: 'LeftNavItem component is used by other module as a resuable which  returns the ui for LeftNavItem',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BrowserRouter>
    <LeftNavItem { ...args } />
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  label: 'Search',
  iconImage: 'Search',
  url: ''
}
