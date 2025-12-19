import React from 'react';
import ShuffleMediaCard, { propTypes } from './ShuffleMediaCard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';
import { SHUFFLE_TEXT } from '../../../utils/constants';

const mockProps = {
  title: SHUFFLE_TEXT,
  icon: 'Shuffle'
}

describe( '<ShuffleMediaCard />tests', () => {
  it( 'renders without crashing', () => {
    render( < ShuffleMediaCard /> );
  } );

  describe( 'properties', () => {
    it( 'an instance of ShuffleMediaCard should have the proper propTypes set', () => {
      expect( ShuffleMediaCard.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ShuffleMediaCard { ...mockProps } />
      </BrowserRouter>
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );
