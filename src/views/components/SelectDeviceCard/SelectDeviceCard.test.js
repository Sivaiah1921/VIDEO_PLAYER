import React from 'react';
import PropTypes from 'prop-types';
import SelectDeviceCard, { propTypes } from './SelectDeviceCard';
import * as jestutils from './../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  iconImage: 'SelectDeviceIcon',
  cardTitle: 'Briju’s Fire TV',
  iconImageArrow: 'RightIcon',
  url: '#'
};

describe( '<SelectDeviceCard />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < SelectDeviceCard { ...mockProps } />
      </BrowserRouter>
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        deviceName: PropTypes.string,
        iconImage: PropTypes.string,
        iconImageArrow: PropTypes.string,
        url: PropTypes.string,
        deviceType: PropTypes.string
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( SelectDeviceCard.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        <BrowserRouter>
          < SelectDeviceCard { ...mockProps } />
        </BrowserRouter> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
