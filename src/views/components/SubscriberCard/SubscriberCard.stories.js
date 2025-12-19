import React from 'react';
import SubscriberCard from './SubscriberCard';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Molecules/SubscriberCard',
  parameters: {
    component: SubscriberCard,
    componentSubtitle: 'This component gives info about subscription',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};
const mockProps = [
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
  }
]

const Template = ( ) => (
  mockProps.map( ( records ) => (
    <BrowserRouter>
      <div style={ { 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
        <SubscriberCard { ...records } />
      </div>
    </BrowserRouter>
  ) )

);

export const BasicUsage = Template.bind( {} );

