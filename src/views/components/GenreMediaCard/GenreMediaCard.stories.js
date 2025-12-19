import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GenreMediaCard from './GenreMediaCard';

export default {
  title: 'Molecules/GenreMediaCard',
  parameters: {
    component: GenreMediaCard,
    componentSubtitle: 'Media card component for Genres rail item',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockData = {
  title: 'Action',
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1655702259/tatasky-uat/cms-ui/images/custom-content/1655702258475.jpg',
  isFocussed: false,
  url: ''
}

const Template = ( args )=> (
  <div style={ { width: '192px', height: '127px' } }>
    <BrowserRouter>
      <GenreMediaCard { ...args } />
    </BrowserRouter>
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockData }

export const Playground = Template.bind( {} );
Playground.args = { ...mockData };
