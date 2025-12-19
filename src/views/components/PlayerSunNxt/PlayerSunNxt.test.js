import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PlayerSunNxt, { propTypes, defaultProps } from './PlayerSunNxt';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<PlayerSunNxt />tests', () => {
  it( 'renders without crashing', () => {
    render( < PlayerSunNxt /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const props = {
        example: 'someValue' // PropTypes.string
      };
      const requiredProps = {
        // someRequiredProp: 'someValue' // PropTypes.string.required
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props, requiredProps );

      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();

    } );

    it( 'should have the proper defaultProps', ()=> {
      expect(
        JSON.stringify( {
          example: 'hello world'
        } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

    it( 'an instance of PlayerSunNxt should have the proper propTypes set', () => {
      expect( PlayerSunNxt.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of PlayerSunNxt should have the proper defaultProps', () => {
      expect( PlayerSunNxt.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < PlayerSunNxt />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
