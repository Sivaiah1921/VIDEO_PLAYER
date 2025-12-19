import React from 'react';
import TransactionHistory from './TransactionHistory';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Molecules/TransactionHistory',
  parameters: {
    component: TransactionHistory,
    componentSubtitle: 'Transaction History                                                                                                                      ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockprops = {
  authorization: 'dVLVJ5AGom8aAIboppIBRhoimmePUEyH',
  deviceToken: 'ZPW769cJB0w70IHqoQAFsqrl2hhtVAo8',
  subscriberId: '3001581564',
  profileId: 'baecf8e3-f47b-45cb-b308-39312f7e2a14',
  baId: '5000204193',
  deviceId: '8539b44d253647e6'
}

const Template = ( args ) => (
  <BrowserRouter>
    <div style={ { 'padding': '1rem', 'height': '125vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
      <TransactionHistory { ...args } />
    </div>
  </BrowserRouter>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  titleIcon: 'TransactionHistory2',
  title: 'Transaction History',
  profileId:'baecf8e3-f47b-45cb-b308-39312f7e2a14',
  authorization:'g4vq0kcwBhMP09HPThW3PKeA2SliFEbd',
  dthStatus:'DTH With Binge Old Stack',
  platform:'BINGE_ANYWHERE',
  deviceToken:'kuNCppg2PHllMH5uKGUAyhzon0YpBiW2',
  beforeLogin:'false',
  subscriberId:'3001581564',
  ...mockprops
}
