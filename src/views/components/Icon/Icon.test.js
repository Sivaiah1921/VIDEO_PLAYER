import React from 'react';
import * as jestutils from './../../../utils/jest/jest';
import Icon, { propTypes } from './Icon';
import renderer from 'react-test-renderer';

const consoleSpy = jest.spyOn( console, 'error' );

describe( '<Icon />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <Icon size='s'
        name='Account'
      /> );
  } );
} );

describe( 'properties', () => {
  it( 'an instance of Text should have the proper propTypes set', () => {
    expect( Icon.propTypes ).toBe( propTypes );
  } );
} );

describe( 'snapshot tests', () => {
  it( 'renders properly if correct name and size are passed', () => {
    const textComponent = renderer
      .create(
        <Icon size='s'
          name='Account'
        /> )
      .toJSON();
    expect( textComponent ).toMatchSnapshot();
  } );
} );
