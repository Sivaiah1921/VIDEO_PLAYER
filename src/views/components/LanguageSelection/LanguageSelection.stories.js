import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LanguageSelection from './LanguageSelection';

const defaultProps = {
  bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
  letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
  title: 'Telugu',
  isChecked: false,
  value: 'yes',
  onSelected: ( language ) => {
    console.log( language ) // eslint-disable-line
  }
}

export default {
  title: 'Molecules/LanguageSelection',
  parameters: {
    component: LanguageSelection,
    componentSubtitle: 'Component for single language card for selection',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { width: '13.75rem' } }>
      <LanguageSelection { ...args } />
    </div>
  </BrowserRouter>
);

export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps };

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };
