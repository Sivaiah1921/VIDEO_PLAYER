import React from 'react';
import ConfirmPurchase from './ConfirmPurchase';

export default {
  title: 'Molecules/ConfirmPurchase',
  parameters: {
    component: ConfirmPurchase,
    componentSubtitle: 'This component will show view for change plan purchase',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <ConfirmPurchase { ...args } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  adjustmentText: 'Adjustment from last pay',
  adjustmentAmount: '200',
  payableAmountText: 'Payable Amout',
  payableAmount: '200',
  btnLabel: 'Confirm Purchase'
}
