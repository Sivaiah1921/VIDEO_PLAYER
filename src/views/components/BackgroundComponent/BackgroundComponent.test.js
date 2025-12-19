import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BackgroundComponent, { propTypes, defaultProps } from './BackgroundComponent';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  bgImg: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_926,h_462/https://akamaividz2.zee5.com/image/upload/w_1920,h_1080,c_scale/resources/0-0-newsauto_g9keqtrs2100/list/May3v5booglebollywoodlargee0ee9e6d389f49c681fd5b408bf95349.jpg',
  alt: 'background BingeList image'
}
describe( '<BackgroundComponent />tests', () => {
  it( 'renders without crashing', () => {
    render( <BackgroundComponent { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        bgImg: PropTypes.string.isRequired,
        alt: PropTypes.string
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly BackgroundComponent', () => {
      const component = mountSnapShot(
        <BackgroundComponent { ...mockProps } />
      ).toJSON();
      expect( component ).toMatchSnapshot();
    } );
  } );

} );
