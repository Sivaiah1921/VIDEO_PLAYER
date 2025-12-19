import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LoginPane, { propTypes, defaultProps } from './LoginPane';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<LoginPane />tests', () => {
  it( 'renders without crashing', () => {
    render( <BrowserRouter><LoginPane /></BrowserRouter> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        mobInputLabel: 'Enter Registered Mobile Number',
        loginTitle: 'Login',
        proceedBtnLabel: 'I accept the ',
        proceedBtnLabel2: 'Terms and Conditions',
        checkedValue: false,
        btnLabel: PropTypes.string,
        value: PropTypes.string,
        openModal: PropTypes.func
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( LoginPane.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly LoginPane', () => {
      const modalComponent = mountSnapShot(
        <LoginPane /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );

} );
