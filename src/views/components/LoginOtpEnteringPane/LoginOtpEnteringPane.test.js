import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LoginOtpEnteringPane, { propTypes, defaultProps } from './LoginOtpEnteringPane';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<LoginOtpEnteringPane />tests', () => {
  it( 'renders without crashing', () => {
    render( < LoginOtpEnteringPane /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } );

    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        title: PropTypes.string,
        mobileNumber: PropTypes.string,
        resendBtnLabel: PropTypes.string,
        errorMsg: PropTypes.string,
        onResentClick: PropTypes.func
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Text should have the proper propTypes set', () => {
      expect( LoginOtpEnteringPane.propTypes ).toBe( propTypes );
    } );

    it( 'an instance of Text should have the proper defaultProps', () => {
      expect( LoginOtpEnteringPane.defaultProps ).toBe( defaultProps );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < LoginOtpEnteringPane />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
