import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SubscriberForm from './SubscriberForm';

export default {
  title: 'Molecules/SubscriberForm',
  parameters: {
    component: SubscriberForm,
    componentSubtitle: 'This component gives the details about subscription',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { 'padding': '1rem', 'height':'100vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <SubscriberForm { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  subscriberIdList: [
    {
      statusText: 'Bing Active',
      subscriptionId: '1122334455',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: '',
      subscriptionId: '1122334456',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: 'Bing Active',
      subscriptionId: '1122334457',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: '',
      subscriptionId: '1122334458',
      icon: 'ArrowForward',
      url: '#'
    }
  ],
  title: 'Select Subscriber ID',
  subscriberInfo: 'You have multiple Subcription IDs linked to your Registered Mobile Number.  Please select the one you wish to continue.'
}

