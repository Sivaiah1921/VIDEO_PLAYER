import React from 'react';
import PISeriesDetails from './PISeriesDetails';

export default {
  title: 'Molecules/PISeriesDetails',
  parameters: {
    component: PISeriesDetails,
    componentSubtitle: 'PI details description                                                                                                                                                                                   ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <PISeriesDetails { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply.',
  title: 'Episode Name',
  episodeDate:'24 Mar ',
  duration: '3229'
}

