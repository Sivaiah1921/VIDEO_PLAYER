import React from 'react';
import UserAccountDetail from './UserAccountDetail';

export default {
  title: 'Molecules/UserAccountDetail',
  parameters: {
    component: UserAccountDetail,
    componentSubtitle: 'The UserAccountetail component is a collection of icon with input fields for a user account or address, containing First Name and Last Name.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <div style={ { 'height': '18rem', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <UserAccountDetail { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  userName: 'Tata Sky Balance',
  balance: '₹1999.00',
  lastRefreshtime: 'Last refreshed 3:50 PM',
  rechargeDueDate: 'Recharge Due On 09/10/2021'
}
