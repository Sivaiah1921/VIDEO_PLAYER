import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ParentalPin, { propTypes, defaultProps } from './ParentalPin';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  icon: 'ParentalLock48x68',
  title: 'Setup Parental Pin',
  content: 'You can setup your Parental PIN and viewing restrictions from tataplaybinge.com or Tata Play Binge Mobile App'
}
describe( '<ParentalPin />tests', () => {
  it( 'renders without crashing', () => {
    render( <ParentalPin { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly ParentalPin', () => {
      const component = mountSnapShot(
        <ParentalPin { ...mockProps } />
      ).toJSON();
      expect( component ).toMatchSnapshot();
    } );
  } );

} );
