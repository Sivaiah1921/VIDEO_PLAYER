import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UserAccountDetail, { propTypes, defaultProps } from './UserAccountDetail';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<UserAccountDetail />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < UserAccountDetail />
      </BrowserRouter> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        userName: 'Tata Sky Balance',
        balance: '₹1999.00',
        lastRefreshtime: 'Last refreshed 3:50 PM',
        rechargeDueDate: 'Recharge Due On 09/10/2021'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( UserAccountDetail.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly UserAccountDetail', () => {
      const modalComponent = mountSnapShot(
        < UserAccountDetail /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );

} );
