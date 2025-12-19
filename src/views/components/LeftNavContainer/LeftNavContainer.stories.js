import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LeftNavContainer from './LeftNavContainer';

export default {
  title: 'Organisms/LeftNavContainer',
  parameters: {
    component: LeftNavContainer,
    componentSubtitle: 'Left nav container for smart tv binge pages that will contain menu items',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockedProps = {
  expandedMenu: false,
  'navListPrimary': [
    {
      label: 'Search',
      iconImage: 'Search',
      url: ''
    },
    {
      label: 'Home',
      iconImage: 'Home',
      url: ''
    },
    {
      label: 'Movies',
      iconImage: 'Movies',
      url: ''
    },
    {
      label: 'TV Shows',
      iconImage: 'TVShows',
      url: ''
    },
    {
      label: 'Last 7 Days TV',
      iconImage: 'Last7DaysTV',
      url: ''
    },
    {
      label: 'Categories',
      iconImage: 'Categories',
      url: ''
    },
    {
      label: 'Kids',
      iconImage: 'Kids',
      url: ''
    },
    {
      label: 'Apps',
      iconImage: 'Apps',
      url: ''
    }
  ],
  'navListSecondary': [
    {
      label: 'Bingelist',
      iconImage: 'Bingelist',
      url: ''
    },
    {
      label: 'Account',
      iconImage: 'Account',
      url: ''
    }
  ],
  'closeAriaLabel': 'Close Menu',
  'openAriaLabel': 'Open Menu',
  'navAriaLabel': 'Menu'
}

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { 'backgroundColor': 'black' } }>
      <LeftNavContainer { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockedProps }

export const Playground = Template.bind( {} );
Playground.args = { ...mockedProps };

Playground.argTypes = {
  expandedMenu: true
}