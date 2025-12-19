import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import LanguageSelection, { propTypes } from './LanguageSelection';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const defaultProps = {
  bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
  letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
  title: 'Telugu',
  isChecked: false,
  value: 'yes'
}

describe( '<LanguageSelection />tests', () => {
  it( 'renders without crashing', () => {
    render( < LanguageSelection { ...defaultProps } /> );
  } );

  describe( 'properties', () => {

    it( 'an instance of LanguageSelection should have the proper propTypes set', () => {
      expect( LanguageSelection.propTypes ).toBe( propTypes );
    } );

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <LanguageSelection { ...defaultProps } />
      </BrowserRouter>
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
