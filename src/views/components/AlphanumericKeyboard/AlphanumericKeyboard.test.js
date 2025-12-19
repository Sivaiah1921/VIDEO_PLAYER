/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AlphanumericKeyboard, { propTypes } from './AlphanumericKeyboard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<AlphanumericKeyboard />tests', () => {
  const mockProps = {
    keys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '^', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '@', '.', '.com', '!#$'],
    onChange: a => console.log( a ),
    clearBtnLabel: 'Clear',
    deleteBtnLabel: 'Delete',
    onClear: a => console.log( a ),
    onRemove: a => console.log( a ),
    onSpace: a => console.log( a )
  }

  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < AlphanumericKeyboard { ...mockProps } />
      </BrowserRouter>
    );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key;
      } );
      expect(
        Object.keys( {
          keys: PropTypes.array.isRequired,
          onChange: PropTypes.func,
          deleteBtnLabel: PropTypes.string.isRequired,
          clearBtnLabel: PropTypes.string.isRequired,
          onClear: PropTypes.func,
          onRemove: PropTypes.func,
          onSpace: PropTypes.func
        } ).map( ( key, index ) => {
          return key;
        } )
      ).toEqual( expect.arrayContaining( proptypeArray ) );
    } );
  } );


  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <AlphanumericKeyboard { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
