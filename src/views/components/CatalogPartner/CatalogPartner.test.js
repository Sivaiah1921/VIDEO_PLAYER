import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CatalogPartner, { propTypes } from './CatalogPartner';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      pageType: '',
      title: '',
      image: ''
    }
  } )
} ) );

describe( '<CatalogPartner />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( <CatalogPartner /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( { } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of CatalogPartner should have the proper propTypes set', () => {
      expect( CatalogPartner.propTypes ).toBe( propTypes );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < CatalogPartner />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
