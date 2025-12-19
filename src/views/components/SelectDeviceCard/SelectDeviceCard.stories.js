import React from 'react';
import SelectDeviceCard from './SelectDeviceCard';
import { BrowserRouter } from 'react-router-dom';


export default {
  title: 'Molecules/SelectDeviceCard',
  parameters: {
    component: SelectDeviceCard,
    componentSubtitle: 'SelectDeviceCard',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

// const Template = ( args )=> ( <SelectDeviceCard { ...args } /> )

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '18rem', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <SelectDeviceCard { ...args } />
    </div>
  </BrowserRouter>
);
export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  iconImage: 'SelectDeviceIcon',
  cardTitle: 'Briju’s Fire TV ',
  iconImageArrow: 'ArrowForward',
  url: '#'
}
