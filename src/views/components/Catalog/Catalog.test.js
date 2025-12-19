import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Catalog, { propTypes, defaultProps } from './Catalog';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      title: '',
      listType: '',
      image: ''
    }
  } )
} ) );
describe( '<Catalog />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( < Catalog /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Catalog should have the proper propTypes set', () => {
      expect( Catalog.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of Catalog should have the proper defaultProps', () => {
      expect( Catalog.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < Catalog />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
