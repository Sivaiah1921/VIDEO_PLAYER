import React from 'react';
import DeviceManagementPage from './DeviceManagementPage';

export default {
  title: 'Molecules/DeviceManagementPage',
  parameters: {
    component: DeviceManagementPage,
    componentSubtitle: 'This component provides Device management details',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <div style={ { 'width': '1280px', 'padding': '4rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <DeviceManagementPage { ...args } />
  </div>

);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: 'Device Management',
  sectionTitle: 'Logged in Devices',
  sectionText: 'Only 1 large screen can be accessed and 3 small screen can be viewed at a given point of time.',
  deviceInfoText: 'The Primary device cannot be removed',
  deviceCountInfo: '1 out of 1',
  primaryDeviceTitle: 'Primary Device',
  otherDeviceTitle: 'Other Devices',
  deviceList: [
    {
      iconImage: 'SelectDeviceIcon',
      cardTitle: 'Briju’s Fire TV ',
      iconImageArrow: '',
      url: '#',
      btnLabel: 'Rename',
      isPrimary: true
    },
    {
      iconImage: 'MobileDevice',
      cardTitle: 'Briju’s Fire TV ',
      iconImageArrow: '',
      url: '#',
      btnLabel: 'Rename',
      isPrimary: false
    },
    {
      iconImage: 'MobileDevice',
      cardTitle: 'Briju’s Fire TV ',
      iconImageArrow: '',
      url: '#',
      btnLabel: 'Rename',
      isPrimary: false
    },
    {
      iconImage: 'MobileDevice',
      cardTitle: 'Briju’s Fire TV ',
      iconImageArrow: '',
      url: '#',
      btnLabel: 'Rename',
      isPrimary: false
    }
  ]


}

