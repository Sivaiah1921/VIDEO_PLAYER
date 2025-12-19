import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Carousel, { propTypes } from './Carousel';
import * as jestutils from '../../../utils/jest/jest';
import renderer from 'react-test-renderer';

const consoleSpy = jest.spyOn( console, 'error' );

const carouselItems = [{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1653184194814'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1652986972915'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1652867520937'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1651662604896'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1651662652867'
}];

describe( '<Carousel />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithProviders(
      <Carousel { ...carouselItems } />
    );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        ImageSrc: PropTypes.string,
        altText: PropTypes.string,
        items: PropTypes.array.isRequired,
        spacerValue: PropTypes.string,
        isLinearGradient: PropTypes.bool,
        isOverlayBackground: PropTypes.bool
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( ' Carousel should have the proper propTypes set', () => {
      expect( Carousel.propTypes ).toBe( propTypes );
    } );

  } );
} );

describe( 'snapshot tests', () => {
  it( 'renders Carousel correctly with proper props', () => {
    const component = mountSnapShot(
      <Carousel { ...carouselItems } />
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );
