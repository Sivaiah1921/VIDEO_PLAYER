import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

export default {
  title: 'Organisms/Home',
  parameters: {
    component: Home,
    componentSubtitle: 'Application home page consisting of left naviagtion, hero banner and different kind of rails',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BrowserRouter>
    <Home { ...args } />
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
