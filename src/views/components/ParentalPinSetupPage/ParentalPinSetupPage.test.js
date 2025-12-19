/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ParentalPinSetupPage, { propTypes, defaultProps } from './ParentalPinSetupPage';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  onChange: ( e ) => console.log( e ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  onClear:( e ) => console.log( e ),
  onRemove: ( e ) => console.log( e ),
  icon: 'ParentalLock35x50',
  title: 'Enter PIN',
  subtitle: 'Enter the 4 Digit Parental PIN',
  count: 4,
  helpText: 'Forgot PIN? You can change your Parental PIN from tataplaybinge.com or Tata Play Binge Mobile App',
  btnLabel: 'Proceed'
}
jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      pageType: '',
      title: '',
      image: ''
    }
  } )
} ) );
describe( '<ParentalPinSetupPage />tests', () => {
  it( 'renders without crashing', () => {
    render( <ParentalPinSetupPage { ...mockProps } /> );
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
        inputValue: PropTypes.array,
        onChange: PropTypes.func,
        onClear: PropTypes.func,
        onRemove: PropTypes.func,
        deleteBtnLabel: PropTypes.string.isRequired,
        clearBtnLabel: PropTypes.string.isRequired
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ParentalPinSetupPage { ...mockProps }/>
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
