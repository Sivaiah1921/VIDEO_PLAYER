import React from 'react';
import PlanCard from './PlanCard';

export default {
  title: 'Atoms/PlanCard',
  parameters: {
    component: PlanCard,
    componentSubtitle: 'This component shows the subscription plan for users like monthly,quarterly &amp; yearly',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <PlanCard { ...args } />
  </div>
)

export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  focusKeyRefrence: 'TENURE_KEY',
  productId: '123',
  type:'Tenure',
  icon : 'Monthly',
  plan: 'Monthly',
  amount:  '₹350',
  savings:'',
  onSelected: ( value ) => {
    console.log( value ) // eslint-disable-line
  }
};


