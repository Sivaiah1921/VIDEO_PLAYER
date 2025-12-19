import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PlaybackInfo, { propTypes, defaultProps } from './PlaybackInfo';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<PlaybackInfo />tests', () => {
  it( 'renders without crashing', () => {
    // render( < PlaybackInfo /> );
    jestutils.mountWithRouter( < PlaybackInfo /> );
  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < PlaybackInfo />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
