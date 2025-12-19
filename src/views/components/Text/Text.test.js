import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Text, { propTypes, defaultProps } from './Text';
import * as jestutils from '../../../utils/jest/jest';
import renderer from 'react-test-renderer';

const consoleSpy = jest.spyOn( console, 'error' );

describe( '<Text />tests', () => {
  it( 'renders without crashing', () => {
    render( <Text /> );
  } );
} );

describe( 'properties', () => {
  it( 'should have the proper "textStyle" PropTypes', () => {
    ['body-1',
      'body-2',
      'body-3',
      'title-1',
      'title-2',
      'title-3'
    ].forEach( ( textStyle ) => {
      expect( PropTypes.checkPropTypes(
        propTypes,
        { 'textStyle': textStyle }
      ) );
    } );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();

  } );

  it( 'should have the proper "htmlTag" PropTypes', () => {
    ['p',
      'span',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ].forEach( ( htmlTag ) => {
      expect( PropTypes.checkPropTypes(
        propTypes,
        { 'htmlTag': htmlTag }
      ) );
    } );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();

  } );
  consoleSpy.mockClear();



  it( 'should have the proper "textAlign" Proptypes', () => {
    ['left',
      'center',
      'right'
    ].forEach( ( textAlign ) => {
      expect( PropTypes.checkPropTypes(
        propTypes,
        { 'textAlign': textAlign }
      ) );
    } );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();

  } );


  it( 'should have the proper "color" Proptypes', () => {
    ['white',
      'neutral-25',
      'neutral-50',
      'neutral-100',
      'neutral-200',
      'neutral-300',
      'neutral-400',
      'neutral-500',
      'neutral-600',
      'neutral-700',
      'neutral-800',
      'neutral-900',
      'black',
      'pink-100',
      'pink-75',
      'pink-50',
      'pink-25',
      'pink-10',
      'pink-5',
      'bingeBlue-100',
      'bingeBlue-75',
      'bingeBlue-50',
      'bingeBlue-25',
      'bingeBlue-10',
      'bingeBlue-5',
      'purple-100',
      'purple-75',
      'purple-50',
      'purple-25',
      'purple-10',
      'purple-5'
    ].forEach( ( color ) => {
      expect( PropTypes.checkPropTypes(
        propTypes,
        { 'color': color }
      ) );
    } );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();

  } );
  it( 'should have the proper "fontStyle" Proptypes', () => {
    expect( PropTypes.checkPropTypes(
      propTypes,
      { 'fontStyle': 'italic' }
    ) );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();
  } );
  it( 'should have the proper "textDecoration" Proptypes', () => {
    ['underline',
      'line-through'
    ].forEach( ( textDecoration ) => {
      expect( PropTypes.checkPropTypes(
        propTypes,
        { 'textDecoration': textDecoration }
      ) );
    } );
    expect( consoleSpy ).not.toBeCalled();
    consoleSpy.mockClear();
  } );

  it( 'should have the proper defaultProps', () => {
    expect(
      JSON.stringify( {
        textStyle: 'body-1',
        htmlTag: 'p',
        textAlign: 'left'
      } )
    ).toEqual( JSON.stringify( defaultProps ) );
  } );

  it( 'an instance of Text should have the proper propTypes set', () => {
    expect( Text.propTypes ).toBe( propTypes );
  } );

  it( 'an instance of Text should have the proper defaultProps', () => {
    expect( Text.defaultProps ).toBe( defaultProps );
  } );

} );

describe( 'snapshot tests', () => {
  it( 'renders Address correctly with proper props', () => {
    const component = mountSnapShot(
      <Text />
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );





