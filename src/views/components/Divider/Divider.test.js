import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Divider, { propTypes, defaultProps } from './Divider';
import * as jestutils from '../../../utils/jest/jest';
import renderer from 'react-test-renderer';

const consoleSpy = jest.spyOn( console, 'error' );

describe( '<Divider />tests', () => {
  it( 'renders without crashing', () => {
    render( < Divider /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper amount of propTypes', () => {
      let keys = ['horizontal', 'vertical', 'horizontalGradient', 'spacerValue'];
      expect( Object.keys( propTypes ).length ).toBe( keys.length );
      keys.forEach( ( i ) => {
        expect( propTypes[i] ).toBeTruthy();
      } )
    } )

    it( 'should have the proper defaultProps', () => {
      expect(
        JSON.stringify( {
          horizontal: true,
          vertical: false
        } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

    it( 'an instance of Divider should have the proper propTypes set', () => {
      expect( Divider.propTypes ).toBe( propTypes );
    } );

    it( 'an sintance of Divider should have the proper defaultProps', () => {
      expect( Divider.defaultProps ).toBe( defaultProps );
    } );

  } );



  describe( 'snapshot tests', () => {

    it( 'renders correctly with the default prop', () => {
      const dividerComponent = mountSnapShot( <Divider /> )
        .toJSON();
      expect( dividerComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with the `type` property set', () => {
      const dividerComponent = mountSnapShot( <Divider type='gray' /> )
        .toJSON();
      expect( dividerComponent ).toMatchSnapshot();
    } );

  } );

} );
