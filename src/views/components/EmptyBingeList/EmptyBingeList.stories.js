import React from 'react';
import EmptyBingeList from './EmptyBingeList';

export default {
  title: 'Organisms/EmptyBingeList',
  parameters: {
    component: EmptyBingeList,
    componentSubtitle: 'This component will show EmptyBingeList page page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height': '100vh', 'background': 'linear-gradient(146.32deg, #020005 58.81%, #220046 100%)' } } >
    <EmptyBingeList { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  icon: 'BingeListInterset',
  title: 'Your Binge List is empty',
  buttonLabel:'Discover to Add',
  content: 'Browse through exciting Movies and TV Shows and save it in your Binge List',
  bgImg: 'https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1655106967743',
  alt: 'background BingeList image'
}

