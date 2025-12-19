import React from 'react';
import PropTypes from 'prop-types';
import PISeriesDetails, { propTypes } from './PISeriesDetails';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply.',
  title: 'Episode Name',
  episodeDate:'24 Mar ',
  duration: '3229'
};

describe( '<PISeriesDetails />tests', () => {
  it( 'renders without crashing', () => {
    render(
      < PISeriesDetails { ...mockProps } />
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land’s water supply.',
        title: 'Episode Name',
        episodeDate:'24 Mar ',
        duration: '3229'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( PISeriesDetails.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly PISeriesDetails', () => {
      const modalComponent = mountSnapShot(
        < PISeriesDetails { ...mockProps } /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
