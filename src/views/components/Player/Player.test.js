import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Player, { propTypes } from './Player';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args : {
      src: ''
    }
  } )
} ) );
describe( '<Player />tests', () => {
  it( 'renders without crashing', () => {
    render( < Player /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const props = {
        src: 'someurl', // PropTypes.string
        deepLinkUrl: 'deeplinkurl' // PropTypes.string
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );

      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();
    } );

    it( 'an instance of Player should have the proper propTypes set', () => {
      expect( Player.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'integration tests', () => {} );

  describe( 'unit tests', () => {} );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < Player />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
