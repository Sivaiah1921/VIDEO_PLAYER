import React from 'react';
import UserProfileDetail from './UserProfileDetail';

export default {
  title: 'Molecules/UserProfileDetail',
  parameters: {
    component: UserProfileDetail,
    componentSubtitle: 'The UserProfileDetail component is a collection of icon with input fields for a user account or address, containing First Name and Last Name.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <div style={ { 'height': '18rem', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <UserProfileDetail { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  iconImage: 'ProfileFilled',
  profileName: 'Reyansh Damien',
  tvDetails: 'Briju’s Fire TV',
  mobileNumber: '+ 91 90 3323 4365',
  mailId: 'reyansh321@gmail.com'
}

