import React from 'react';
import PropTypes from 'prop-types';
import UserProfileDetail, { propTypes } from './UserProfileDetail';
import * as jestutils from '../../../utils/jest/jest';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<UserProfileDetail />tests', () => {
  it( 'renders without crashing', () => {
    render( <BrowserRouter>< UserProfileDetail /></BrowserRouter> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        iconImage: 'ProfileFilled',
        profileName: 'Reyansh Damien',
        tvDetails: 'Briju’s Fire TV',
        mobileNumber: '+ 91 90 3323 4365',
        mailId: 'reyansh321@gmail.com',
        aliasName: 'abc',
        tvDetailsIcon: 'tv'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( UserProfileDetail.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly UserProfileDetail', () => {
      const modalComponent = mountSnapShot(
        < UserProfileDetail /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
