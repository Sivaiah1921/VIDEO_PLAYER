import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DeviceManagementPage, { propTypes, defaultProps } from './DeviceManagementPage';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  title: 'Device Management',
  sectionTitle: 'Logged in Devices',
  sectionText: 'Only 1 large screen can be accessed and 3 small screen can be viewed at a given point of time.',
  deviceInfoText: 'The Primary device cannot be removed',
  deviceCountInfo: '1 out of 1',
  primaryDeviceTitle: 'Primary Device',
  otherDeviceTitle: 'Other Device',
  deviceList: [
    {
      iconImage: 'MobileDevice',
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

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      pageType: '',
      title: '',
      image: ''
    }
  } )
} ) );

describe( '<DeviceManagementPage />tests', () => {
  it( 'renders without crashing', () => {
    render( <DeviceManagementPage { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        title: PropTypes.string.isRequired,
        sectionTitle: PropTypes.string.isRequired,
        sectionText: PropTypes.string.isRequired,
        primaryDeviceTitle: PropTypes.string.isRequired,
        deviceInfoText: PropTypes.string.isRequired,
        deviceCountInfo: PropTypes.string.isRequired,
        otherDeviceTitle: PropTypes.string.isRequired,
        deviceList: PropTypes.arrayOf(
          PropTypes.shape( {
            iconImage: PropTypes.string.isRequired,
            cardTitle: PropTypes.string.isRequired,
            iconImageArrow: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            btnLabel: PropTypes.string.isRequired,
            isPrimary: PropTypes.bool.isRequired
          } )
        )
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );
  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <DeviceManagementPage { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
