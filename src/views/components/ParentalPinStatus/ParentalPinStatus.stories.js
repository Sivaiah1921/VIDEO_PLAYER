import React from 'react';
import ParentalPinStatus from './ParentalPinStatus';

export default {
  title: 'Organisms/ParentalPinStatus',
  parameters: {
    component: ParentalPinStatus,
    componentSubtitle: '',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height':'50rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <ParentalPinStatus { ...args } />
  </div>

);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  id:'switcher',
  name:'switcher',
  toggleButton: true,
  icon: 'ParentalLock14x20',
  title: 'Parental Pin',
  pinStatusLabel: 'PIN Status',
  category : ' U/A 16+',
  categoryLabel : 'Viewing Restrictions',
  subtitle : 'Want to modify Parental PIN?',
  content :'You can change your Parental PIN and Viewing Restrictions from www.tataplaybinge.com or from Tata Play Binge Mobile App'
}


