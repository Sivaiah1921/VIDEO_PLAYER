import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AutoCompleteSuggestions, { propTypes, defaultProps } from './AutoCompleteSuggestions';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<AutoCompleteSuggestions />tests', () => {
  it( 'renders without crashing', () => {
    render( < AutoCompleteSuggestions /> );
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

    it( 'an instance of AutoCompleteSuggestions should have the proper propTypes set', () => {
      expect( AutoCompleteSuggestions.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of AutoCompleteSuggestions should have the proper defaultProps', () => {
      expect( AutoCompleteSuggestions.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < AutoCompleteSuggestions />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
