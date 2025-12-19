import React from 'react';
import PropTypes from 'prop-types';
import PreviouslyUsedLoginPane, { propTypes } from './PreviouslyUsedLoginPane';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = [{
  mobileNumbersList: [
    {
      'mobileNumber': '8885559999',
      'premiumUser': false
    },
    {
      'mobileNumber': '8000009999',
      'premiumUser': false
    },
    {
      'mobileNumber': '7788899999',
      'premiumUser': false
    },
    {
      'mobileNumber': '8888899999',
      'premiumUser': false
    }]
}]

describe( '<PreviouslyUsedLoginPane />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < PreviouslyUsedLoginPane mobileNumbersList={ mockProps } />
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
        mobileNumbersList: PropTypes.array
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( PreviouslyUsedLoginPane.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        <BrowserRouter>
          < PreviouslyUsedLoginPane userDetails={ mockProps } />
        </BrowserRouter> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
