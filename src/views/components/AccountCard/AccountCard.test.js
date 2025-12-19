import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AccountCard, { propTypes } from './AccountCard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  title: 'Parental PIN',
  iconName: 'ParentalLock28x36',
  url: '#'
};

describe( '<AccountCard />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < AccountCard { ...mockProps } />
      </BrowserRouter>
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        title: 'Parental PIN',
        iconName: 'ParentalLock28x36',
        url: '#'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( AccountCard.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        <BrowserRouter>
          < AccountCard { ...mockProps } />
        </BrowserRouter> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );

} );
