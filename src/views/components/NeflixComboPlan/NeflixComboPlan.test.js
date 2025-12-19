import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NeflixComboPlan, { propTypes, defaultProps } from './NeflixComboPlan';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<NeflixComboPlan />tests', () => {
  it( 'renders without crashing', () => {
    render( < NeflixComboPlan /> );
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

    it( 'an instance of NeflixComboPlan should have the proper propTypes set', () => {
      expect( NeflixComboPlan.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of NeflixComboPlan should have the proper defaultProps', () => {
      expect( NeflixComboPlan.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < NeflixComboPlan />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
