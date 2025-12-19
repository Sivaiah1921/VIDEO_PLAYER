import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Accordion, { propTypes, defaultProps } from './Accordion';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<Accordion />tests', () => {
  it( 'renders without crashing', () => {
    render( < Accordion /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        title: PropTypes.string,
        description: PropTypes.string,
        key: PropTypes.number
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Accordion should have the proper propTypes set', () => {
      expect( Accordion.propTypes ).toBe( propTypes );
    } );

    it( 'an instance of Accordion should have the proper defaultProps', () => {
      expect( Accordion.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < Accordion />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
