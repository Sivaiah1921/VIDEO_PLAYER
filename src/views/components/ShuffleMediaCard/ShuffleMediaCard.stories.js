import React from 'react';
import ShuffleMediaCard from './ShuffleMediaCard';
import { BrowserRouter } from 'react-router-dom';
const { SHUFFLE_TEXT } = require( '../../../utils/constants' ).default;

export default {
  title: 'Molecules/ShuffleMediaCard',
  parameters: {
    component: ShuffleMediaCard,
    componentSubtitle: 'Shuffle media card molecule to display at first of every rails',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { height: '15rem', width: '10rem' } }>
    <BrowserRouter>
      <ShuffleMediaCard { ...args } />
    </BrowserRouter>
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: SHUFFLE_TEXT,
  icon: 'Shuffle'
}

export const Playground = Template.bind( {} );
Playground.args = {
  title: SHUFFLE_TEXT,
  icon: 'Shuffle'
};
