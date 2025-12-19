import React from 'react';
import SeasonTab from './SeasonTab';


export default {
  title: 'Molecules/SeasonTab',
  parameters: {
    component: SeasonTab,
    componentSubtitle: 'This component gives the details about SeasonTab',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (

  <div style={ { 'height': '100vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <SeasonTab { ...args } />
  </div>
)

export const BasicUsage = Template.bind( {} );


BasicUsage.args = {
  tabheadList: ['Season 1', 'Season 2', 'Season 3']
}