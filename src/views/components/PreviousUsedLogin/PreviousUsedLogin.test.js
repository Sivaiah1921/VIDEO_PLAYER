import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PreviousUsedLogin, { propTypes, defaultProps } from './PreviousUsedLogin';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  'user': {
    'mobileNumber': '8888899999',
    'premiumUser': false
  },
  'index': 1
}

describe( '<PreviousUsedLogin />tests', () => {
  it( 'renders without crashing', () => {
    render( < PreviousUsedLogin { ...mockProps }/> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        user: PropTypes.object,
        index: PropTypes.number
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of PreviousUsedLogin should have the proper propTypes set', () => {
      expect( PreviousUsedLogin.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of PreviousUsedLogin should have the proper defaultProps', () => {
      expect( PreviousUsedLogin.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < PreviousUsedLogin { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
