import React from 'react';
import PropTypes from 'prop-types';
import LeftNavItem, { propTypes } from './LeftNavItem';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';
import { PAGE_TYPE } from '../../../utils/constants';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<LeftNavItem />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < LeftNavItem />
      </BrowserRouter> );
  } );

  describe( 'Properties', () => {
    it( 'should only have these proptypes and values', () => {
      const props = {
        label: PropTypes.string,
        pageType: PropTypes.string,
        activeImage: PropTypes.string,
        inActiveImage: PropTypes.string
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of LeftNavItem should have the proper propTypes set', () => {
      expect( LeftNavItem.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const props = {
      label: 'Home',
      pageType: PAGE_TYPE.DONGLE_HOMEPAGE,
      activeImage: 'https://res.cloudinary.com/tatasky/image/upload/v1602149806/tatasky-production-cms/cms-ui/images/custom-content/1602149804970.png',
      inActiveImage: 'https://res.cloudinary.com/tatasky/image/upload/v1602149806/tatasky-production-cms/cms-ui/images/custom-content/1602149804970.png'
    }
    const component = mountSnapShot(
      <BrowserRouter>
        <LeftNavItem { ...props } />
      </BrowserRouter>
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
