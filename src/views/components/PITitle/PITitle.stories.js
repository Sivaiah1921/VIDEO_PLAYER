import React from 'react';
import PITitle from './PITitle';


export default {
  title: 'Molecules/PITitle',
  parameters: {
    component: PITitle,
    componentSubtitle: 'PITitle',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};


const Template = ( args ) => (
  <div style={ { 'height': '18rem', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <PITitle { ...args } />
  </div>
);
export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  iconUrl: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_117,h_117//https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1651821278821?w=0&fmt=webp',
  cardTitle: 'Barot House',
  year:'2021',
  category:['Sci-fi'],
  ageLimit :'18+',
  partnerSubscriptionType: 'premium',
  provider: 'mxplayer',
  nonSubscribedPartnerList: [
    {
      'partnerId': '18',
      'partnerName': 'mxplayer',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1659428200/tatasky-uat/cms-ui/images/custom-content/1659428198654.png',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '21',
      'partnerName': 'apple',
      'iconUrl': 'https://tatasky-staging.s3.ap-south-1.amazonaws.com/cms-ui/images/custom-content/1653913685501',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '2',
      'partnerName': 'Prime',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '2',
      'partnerName': 'Prime',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
      'starterPackHighlightApp': false
    }
  ]
}
