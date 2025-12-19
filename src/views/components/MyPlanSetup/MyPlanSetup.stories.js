import React from 'react';
import MyPlanSetup from './MyPlanSetup';

export default {
  title: 'Organisms/MyPlanSetup',
  parameters: {
    component: MyPlanSetup,
    componentSubtitle: 'This component will provide the information about users subscription plan',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <MyPlanSetup { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  planDetail: {},
  selectCardOptions: []
}