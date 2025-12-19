import React from 'react';
import PropTypes from 'prop-types';
import Checkbox, { propTypes, defaultProps } from './Checkbox';
import * as jestutils from './../../../utils/jest/jest';
import renderer from 'react-test-renderer';
const consoleSpy = jest.spyOn( console, 'error' );

describe( '<Checkbox />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <Checkbox name='checkBox' />
    );
  } );

  describe( 'properties', () => {

    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key
      } );
      expect( ( Object.keys( {
        disabled: PropTypes.bool,
        name: PropTypes.string.isRequired,
        id: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
        tabIndex: PropTypes.number,
        labelPositionLeft: PropTypes.bool,
        checked: PropTypes.bool,
        toggleButton: PropTypes.bool,
        children: PropTypes.node
      } ) ).map( ( key, index ) => {
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) );

    } );


    it( 'should have the proper "id" PropTypes either having passing string and number id to check compatibility with id prop', () => {
      [
        'test-id',
        4
      ].forEach( ( id ) => {
        expect( PropTypes.checkPropTypes(
          propTypes,
          {
            'id': id,
            'name': 'name'
          }
        ) );
      } );

      expect( consoleSpy ).not.toBeCalled();
      consoleSpy.mockClear();

    } );


    it( 'should have the proper defaultProps', () => {

      expect(
        JSON.stringify( {
          tabIndex: 0,
          labelPositionLeft: false,
          toggleButton: false
        } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

    it( ' Checkbox should have the proper propTypes set', () => {
      expect( Checkbox.propTypes ).toBe( propTypes );
    } );

    it( 'Checkbox should have the proper defaultProps', () => {
      expect( Checkbox.defaultProps ).toBe( defaultProps );
    } );

  } );
} );

describe( 'snapshot tests', () => {
  it( 'renders checkBox correctly with proper props', () => {
    const component = mountSnapShot(
      <Checkbox name='checkBox' />
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );


