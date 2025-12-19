import React from 'react';
import LanguageCard, { propTypes } from './LanguageCard';
import * as jestutils from '../../../utils/jest/jest';
import * as intersectionMethods from '../../../utils/useIntersectionObserver/useIntersectionObserver';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const defaultProps = {
  title: 'Kannada',
  image: 'https://res.cloudinary.com/uat-main/image/upload/v1649845184/tatasky-uat/cms-ui/images/custom-content/1649845183633.png',
  isFocussed: false
};

describe( '<LanguageCard />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter(
      <LanguageCard { ...defaultProps } />
    );
  } );

  describe( 'properties', () => {

    it( 'should have the proper defaultProps', ()=> {
      expect(
        JSON.stringify( {
          ...defaultProps
        } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

    it( 'an instance of LanguageCard should have the proper propTypes set', () => {
      expect( LanguageCard.propTypes ).toBe( propTypes );
    } );

  } );

} );

describe( 'snapshot tests', () => {
  it( 'renders correctly with the default props', () => {
    intersectionMethods.useIntersectionObserver = jest.fn( () => {
      return { hasIntersected: true }
    } );
    const component = jestutils.mountSnapShot(
      <BrowserRouter>
        <LanguageCard { ...propTypes } />
      </BrowserRouter>
    )
      .toJSON();
    expect( component ).toMatchSnapshot();
  } );
} );