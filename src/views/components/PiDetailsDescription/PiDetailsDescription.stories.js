import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PiDetailsDescription from './PiDetailsDescription';

export default {
  title: 'Molecules/PiDetailsDescription',
  parameters: {
    component: PiDetailsDescription,
    componentSubtitle: 'PI details description                                                                                                                                                                                   ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <PiDetailsDescription { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls.',
  btnLabel: 'More',
  iconImage: 'Plus'
}

