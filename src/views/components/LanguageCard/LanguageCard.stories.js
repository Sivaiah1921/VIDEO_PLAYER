import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LanguageCard from './LanguageCard';

export default {
  title: 'Molecules/LanguageCard',
  parameters: {
    component: LanguageCard,
    componentSubtitle: 'Component to display single Language card',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps = {
  title: 'Kannada',
  image: 'https://res.cloudinary.com/uat-main/image/upload/v1649845184/tatasky-uat/cms-ui/images/custom-content/1649845183633.png',
  isFocussed: false
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { width: '7.9rem', height: '7.3rem' } }>
      <LanguageCard { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps }

export const Playground = Template.bind( {} );
Playground.args = {
  ...defaultProps
};
