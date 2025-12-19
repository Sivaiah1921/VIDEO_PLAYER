import React from 'react';
import PreviouslyUsedLoginPane from './PreviouslyUsedLoginPane';
import { BrowserRouter } from 'react-router-dom';


export default {
  title: 'Molecules/PreviouslyUsedLoginPane',
  parameters: {
    component: PreviouslyUsedLoginPane,
    componentSubtitle: 'PreviouslyUsedLoginPane',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockProps = [{
  mobileNumbersList: [
    {
      'mobileNumber': '8885559999',
      'premiumUser': false
    },
    {
      'mobileNumber': '8000009999',
      'premiumUser': false
    },
    {
      'mobileNumber': '7788899999',
      'premiumUser': false
    },
    {
      'mobileNumber': '8888899999',
      'premiumUser': false
    }]
}]

// const Template = ( args )=> ( <PreviouslyUsedLoginPane { ...args } /> )

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <PreviouslyUsedLoginPane { ...args } />
    </div>
  </BrowserRouter>
);
export const BasicUsage = Template.bind( {} );

BasicUsage.args = { ...mockProps }
