import React from 'react';
import PropTypes from 'prop-types';
import AppMediaCard, { propTypes } from './AppMediaCard';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const defaultProps =  {
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
  title: 'Hotstar',
  isFocussed: false
};

describe( '<AppMediaCard />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( < AppMediaCard /> );
  } );

  describe( 'properties', () => {
    it( 'should only have these proptypes and values', () => {
      const props = {
        image: PropTypes.string,
        title: PropTypes.string,
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

    it( 'should have the proper defaultProps', ()=> {
      expect(
        JSON.stringify( { ...defaultProps } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <AppMediaCard { ...defaultProps } />
      </BrowserRouter>
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
