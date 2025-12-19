import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FaQs, { propTypes, defaultProps } from './FaQs';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<FaQs />tests', () => {
  it( 'renders without crashing', () => {
    render( < FaQs /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        title: PropTypes.string,
        questions: PropTypes.string
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of FaQs should have the proper propTypes set', () => {
      expect( FaQs.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of FaQs should have the proper defaultProps', () => {
      expect( FaQs.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < FaQs />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
