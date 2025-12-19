import React from 'react';
import PropTypes from 'prop-types';
import SeasonTab, { propTypes } from './SeasonTab';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  tabheadList:  ['Season 1', 'Season 2', 'Season 3']
};

describe( '<SeasonTab />tests', () => {
  it( 'renders without crashing', () => {
    render(
      < SeasonTab { ...mockProps } />
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        tabheadList:  ['Season 1', 'Season 2', 'Season 3']
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( SeasonTab.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        < SeasonTab { ...mockProps } /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
