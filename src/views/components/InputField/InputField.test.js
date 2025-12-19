import React from 'react';
import PropTypes from 'prop-types';
import InputField, { propTypes } from './InputField';
import * as jestutils from '../../../utils/jest/jest';
import { render } from '@testing-library/react';

const consoleSpy = jest.spyOn( console, 'error' );

jest.useFakeTimers();

describe( '<InputField />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <InputField name='testInput' />
    );
  } );

  describe( 'properties', () => {

    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        type: PropTypes.oneOf( ['text', 'number', 'password', 'email', 'tel', 'date'] ),
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        tabIndex: PropTypes.number,
        placeholder: PropTypes.string,
        maxLength: PropTypes.number,
        autoComplete: PropTypes.string,
        autoCorrect: PropTypes.string,
        autoCapitalize: PropTypes.string,
        spellCheck: PropTypes.bool,
        disablePaste: PropTypes.bool,
        showValueText: PropTypes.string,
        hideValueText: PropTypes.string,
        clearValueText: PropTypes.string,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        displayCheck: PropTypes.bool,
        value: PropTypes.string,
        searchBox: PropTypes.bool
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )

    } );

    it( 'should have the proper "type" PropTypes', () => {

      ['text',
        'number',
        'password',
        'email',
        'tel',
        'date'
      ].forEach( ( type )=>{
        expect( PropTypes.checkPropTypes(
          propTypes,
          { 'type': type, 'name': 'test' }
        ) );
      } )

      expect( consoleSpy ).not.toBeCalled();
      consoleSpy.mockClear();
    } );

  } );

} );
