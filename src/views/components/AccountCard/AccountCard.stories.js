import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AccountCard from './AccountCard';

export default {
  title: 'Molecules/AccountCard',
  parameters: {
    component: AccountCard,
    componentSubtitle: 'As an anonymous or authenticated, when on my account page I should see account card component if received from the back end services.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};


const mockProps = {
  title: 'Parental PIN',
  iconName: 'ParentalLock28x36',
  url: '#'
};

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { 'height': '18rem', 'padding': '1rem' } } >
      <AccountCard { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockProps }
