import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Notifications, { propTypes, defaultProps } from './Notifications';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<Notifications />tests', () => {
  const mockProps = {
    iconName : 'Success',
    message: 'Device renamed successfully!'
  }

  it( 'renders without crashing', () => {
    render( < Notifications { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        iconName: PropTypes.string,
        message: PropTypes.string
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Notifications should have the proper propTypes set', () => {
      expect( Notifications.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of Notifications should have the proper defaultProps', () => {
      expect( Notifications.defaultProps ).toBe( defaultProps );
    } );

  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < Notifications { ...mockProps }/>
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
