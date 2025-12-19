import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ParentalPinSetup, { propTypes, defaultProps } from './ParentalPinSetup';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  icon: 'ParentalLock35x50',
  title: 'Enter PIN',
  subtitle: 'Enter the 4 Digit Parental PIN',
  count: 4,
  helpText: 'Forgot PIN? You can change your Parental PIN from tataplaybinge.com or Tata Play Binge Mobile App',
  btnLabel: 'Proceed',
  disabled: false,
  inputValue: []
}
describe( '<ParentalPinSetup />tests', () => {
  it( 'renders without crashing', () => {
    render( <ParentalPinSetup { ...mockProps } /> );
  } );


  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        count: PropTypes.number,
        helpText: PropTypes.string,
        btnLabel: PropTypes.string,
        disabled: PropTypes.bool,
        inputValue: PropTypes.array
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );


  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ParentalPinSetup { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
