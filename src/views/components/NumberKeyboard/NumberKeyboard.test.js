/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NumberKeyboard, { propTypes } from './NumberKeyboard';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );


const mockProps = {
  onChange: a => console.log( a ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  onClear: a => console.log( a ),
  onRemove: a => console.log( a )
}

describe( '<NumberKeyboard />tests', () => {
  it( 'renders without crashing', () => {
    render( <NumberKeyboard { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key;
      } );
      expect(
        Object.keys( {
          onChange: PropTypes.func,
          deleteBtnLabel: PropTypes.string.isRequired,
          clearBtnLabel: PropTypes.string.isRequired,
          onClear: PropTypes.func,
          onRemove: PropTypes.func
        } ).map( ( key, index ) => {
          return key;
        } )
      ).toEqual( expect.arrayContaining( proptypeArray ) );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const component = mountSnapShot(
        <NumberKeyboard { ...mockProps } />
      ).toJSON();
      expect( component ).toMatchSnapshot();
    } );
  } );
} );
