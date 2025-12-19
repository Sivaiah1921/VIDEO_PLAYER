import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {{ properCase componentName }}, { propTypes, defaultProps } from './{{ properCase componentName }}';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<{{ properCase componentName }} />tests', () => {
  it( 'renders without crashing', () => {
    {{#if isReduxNeeded}}
      jestutils.mountWithProvider( <{{ properCase componentName }} /> );
    {{else}}
      render( < {{ properCase componentName }} /> );
    {{/if}}
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const props = {
        example: 'someValue', // PropTypes.string
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

    it( 'an instance of {{ properCase componentName }} should have the proper propTypes set', () => {
      expect( {{ properCase componentName }}.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of {{ properCase componentName }} should have the proper defaultProps', () => {
      expect( {{ properCase componentName }}.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < {{ properCase componentName }} />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
