import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MediaCard from './MediaCard';

export default {
  title: 'Molecules/MediaCard',
  parameters: {
    component: MediaCard,
    componentSubtitle: 'Common MediaCard component used by other modules as a reusable component which returns the ui for a media card.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const TemplatePortrait = ( args )=> (
  <div style={ { width: '228px' } }>
    <BrowserRouter>
      <MediaCard { ...args } />
    </BrowserRouter>
  </div>
);

export const BasicUsagePortrait = TemplatePortrait.bind( {} );
BasicUsagePortrait.args = {
  type: 'portrait',
  title: 'Road To Sangam',
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-0-movie_2141795233/passport/750x1000/beyondtheclouds783031049283029cc1b2e35dc4a6296625e6e40f05a44.jpg?impolicy=zee5xiomipic_zee5_com-IPM',
  provider: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
  indicator: '40',
  timeBlock: '30m',
  editable: false,
  freeEpisodesAvailable: false,
  contractName: 'RENTAL',
  partnerSubscriptionType: 'premium',
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
  ],
  providerName: 'mxplayer',
  tag: 'News'
}

const Template = ( args )=> (
  <BrowserRouter>
    <div style={ { width: '228px' } }>
      <MediaCard { ...args } />
    </div>
  </BrowserRouter>
);
export const BasicUsageLandscape = Template.bind( {} );
BasicUsageLandscape.args = {
  type: 'landscape',
  title: 'Road To Sangam',
  image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h',
  provider: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
  indicator: '40',
  timeBlock: '30m',
  editable: false,
  freeEpisodesAvailable: false,
  contractName: 'RENTAL',
  partnerSubscriptionType: 'premium',
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
  ],
  providerName: 'mxplayer',
  tag: 'News'
}