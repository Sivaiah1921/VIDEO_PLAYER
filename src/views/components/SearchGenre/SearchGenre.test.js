import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SearchGenre, { propTypes, defaultProps } from './SearchGenre';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<SearchGenre />tests', () => {
  it( 'renders without crashing', () => {
    render( < SearchGenre /> );
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

    it( 'an instance of SearchGenre should have the proper propTypes set', () => {
      expect( SearchGenre.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of SearchGenre should have the proper defaultProps', () => {
      expect( SearchGenre.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < SearchGenre />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
