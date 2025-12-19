import React from 'react';
import MyAccount from './MyAccount';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Molecules/MyAccount',
  parameters: {
    component: MyAccount,
    componentSubtitle: 'MyAccount Page                                                                                                                    ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'height': '100vh', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <MyAccount { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: 'My Account',
  iconImage: 'Profile80x80',
  profileName: 'Reyansh Damien',
  tvDetails: 'Briju’s Fire TV',
  mobileNumber: '+ 91 90 3323 4365',
  mailId: 'reyansh321@gmail.com',
  userName: 'Tata Sky Balance',
  balance: '₹1999.00',
  lastRefreshtime: 'Last refreshed 3:50 PM',
  rechargeDueDate: 'Recharge Due On 09/10/2021',
  accountRail: [{
    title: 'Parental PIN',
    iconName: 'ParentalLock28x36',
    url: '#'
  }, {
    title: 'Video Language',
    iconName: 'ContentLanguage',
    url: '#'
  }, {
    title: 'Get 1 month free trial of Amazon Prime',
    iconName: 'AmazonPrime',
    url: '#'
  }, {
    title: 'Transaction History',
    iconName: 'TransactionHistory2',
    url: '#'
  }, {
    title: 'Device Management',
    iconName: 'DeviceManagement',
    url: '#'
  }, {
    title: 'Autoplay Trailer',
    iconName: 'AutoplayTrailer',
    url: '#'
  }]
}
