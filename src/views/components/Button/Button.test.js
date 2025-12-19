import React from 'react';
import PropTypes from 'prop-types';
import * as jestutils from './../../../utils/jest/jest';
import Button, { disabledHandler, propTypes } from './Button';

const consoleSpy = jest.spyOn( console, 'error' );
import { render } from '@testing-library/react';

const props = {
  secondary: true,
  label: 'Secondary',
  disabled: false,
  backgroundColor: 'white',
  size: 'small'
}

describe( '<Button /> tests', () => {
  it( 'renders without crashing', () => {
    render(
      <Button label={ 'Button' } />
    );
  } );
  it( 'should have the correct propTypes', () => {
    const keys = Object.keys( Button.propTypes );
    [
      'primary',
      'secondary',
      'backgroundColor',
      'size',
      'label',
      'disabled',
      'onClick',
      'iconLeftImage',
      'iconRightImage',
      'iconLeft',
      'iconRight'
    ].forEach( i => {
      expect( keys.includes( i ) ).toBe( true )
    } );
  } );
  it( 'should have a method to disableHandler', () => {
    expect( typeof disabledHandler ).toBe( 'function' );
    expect( disabledHandler( { preventDefault: jest.fn() } ) ).toBe( false );
  } );
} );

describe( 'snapshot tests', () => {
  it( 'renders Button correctly with proper props', () => {
    const props = {
      secondary: true,
      label: 'Secondary',
      disabled: false,
      backgroundColor: 'white',
      size: 'small'
    }
    const component = mountSnapShot(
      <Button { ...props } />
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );