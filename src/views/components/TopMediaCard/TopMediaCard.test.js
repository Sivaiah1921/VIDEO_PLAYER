import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopMediaCard, { propTypes } from './TopMediaCard';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  position: 1,
  title: 'Road To Sangam',
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-0-movie_2141795233/passport/750x1000/beyondtheclouds783031049283029cc1b2e35dc4a6296625e6e40f05a44.jpg?impolicy=zee5xiomipic_zee5_com-IPM',
  provider: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
  isFocussed: false,
  url: ''
}

describe( '<TopMediaCard />tests', () => {
  // it( 'renders without crashing', () => {
  //   jestutils.mountWithRouter( < TopMediaCard /> );
  // } );

  describe( 'properties', () => {
    it( 'should only have these proptypes and values', () => {
      const props = {
        position: PropTypes.number,
        title: PropTypes.string,
        image: PropTypes.string,
        provider: PropTypes.string,
        isFocussed: PropTypes.bool,
        url: PropTypes.string
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of TopMediaCard should have the proper propTypes set', () => {
      expect( TopMediaCard.propTypes ).toBe( propTypes );
    } );

  } );

  // describe( 'snapshot tests', () => {
  //   const component = mountSnapShot(
  //     <BrowserRouter>
  //       <TopMediaCard { ...mockProps } />
  //     </BrowserRouter>
  //   );
  //   expect( component.toJSON() ).toMatchSnapshot();
  // } );
} );
