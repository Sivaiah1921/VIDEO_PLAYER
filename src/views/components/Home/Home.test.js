import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Home, { propTypes } from './Home';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      message: '', iconName: ''
    }
  } )
} ) );

describe( '<Home />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithProviders( <Home /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
    } );

    it( 'an instance of Home should have the proper propTypes set', () => {
      expect( Home.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < Home />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
