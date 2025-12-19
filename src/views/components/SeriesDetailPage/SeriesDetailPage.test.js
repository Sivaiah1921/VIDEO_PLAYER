import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SeriesDetailPage, { propTypes, defaultProps } from './SeriesDetailPage';
import { ALPHANUMERICKEYBOARD } from '../../../utils/constants';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
let mockProps = {
  alphanumericKeyboardProp: ALPHANUMERICKEYBOARD.KEYBOARD_WITH_SPECIAL_KEYS
};
jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      tabheadList: [],
      alphanumericKeyboardProp: '',
      id: '',
      length: 0,
      season:''

    }
  } )
} ) );
describe( '<SeriesDetailPage />tests', () => {

  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( <SeriesDetailPage /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, mockProps );
      expect( Object.keys( mockProps ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < SeriesDetailPage />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
