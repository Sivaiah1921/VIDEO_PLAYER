import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LanguageList, { propTypes, defaultProps } from './LanguageList';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  LanguageList: ['English', 'Hindi', 'Tamil', 'Bengali']
}
describe( '<LanguageList />tests', () => {
  it( 'renders without crashing', () => {
    render( <LanguageList { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        LanguageList: PropTypes.array
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <LanguageList { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
