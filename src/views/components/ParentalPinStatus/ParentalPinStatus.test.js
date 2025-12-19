import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ParentalPinStatus, { propTypes, defaultProps } from './ParentalPinStatus';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  id:'switcher',
  name:'switcher',
  toggleButton: true,
  icon: 'ParentalLock14x20',
  title: 'Parental Pin',
  pinStatusLabel: 'PIN Status',
  category : ' U/A 16+',
  categoryLabel : 'Viewing Restrictions',
  subtitle : 'Want to modify Parental PIN?',
  content :'You can change your Parental PIN and Viewing Restrictions from www.tataplaybinge.com or from Tata Play Binge Mobile App'
}
describe( '<ParentalPinStatus />tests', () => {
  it( 'renders without crashing', () => {
    render( <ParentalPinStatus { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        categoryLabel: PropTypes.string,
        pinStatusLabel: PropTypes.string,
        category: PropTypes.string,
        subtitle: PropTypes.string,
        content: PropTypes.string,
        name: PropTypes.string,
        id: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
        toggleButton: PropTypes.bool
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly ParentalPinStatus', () => {
      const component = mountSnapShot(
        <ParentalPinStatus { ...mockProps } />
      ).toJSON();
      expect( component ).toMatchSnapshot();
    } );
  } );

} );
