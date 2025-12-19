import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PiDetailsDescription, { propTypes } from './PiDetailsDescription';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<PiDetailsDescription />tests', () => {
  const props = {
    description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls.',
    btnLabel: 'More',
    iconImage: 'Plus'
  };
  it( 'renders without crashing', () => {
    render( <BrowserRouter>
      < PiDetailsDescription { ...props } />
    </BrowserRouter> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const requiredProps = {
        description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls.',
        btnLabel: 'More',
        iconImage: 'Plus'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props, requiredProps );

      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();

    } );

    it( 'an instance of PiDetailsDescription should have the proper propTypes set', () => {
      expect( PiDetailsDescription.propTypes ).toBe( propTypes );
    } );

  } );

  describe( 'snapshot tests', () => {
    const props = {
      description: 'In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls.',
      btnLabel: 'More',
      iconImage: 'Plus'
    };
    const component = mountSnapShot(
      <BrowserRouter>
        < PiDetailsDescription { ...props } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
