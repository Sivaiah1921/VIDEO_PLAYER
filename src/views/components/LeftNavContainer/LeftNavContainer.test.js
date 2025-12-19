import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LeftNavContainer, { propTypes, defaultProps } from './LeftNavContainer';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<LeftNavContainer />tests', () => {
  // it( 'renders without crashing', () => {
  //   render( < LeftNavContainer /> );
  // } );

  describe( 'properties', () => {
    it( 'should only have these proptypes and values', () => {
      const props = {
        navList: PropTypes.array,
        openAriaLabel: PropTypes.string,
        closeAriaLabel: PropTypes.string,
        navAriaLabel: PropTypes.string
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
    } );

    it( 'an instance of LeftNavContainer should have the proper propTypes set', () => {
      expect( LeftNavContainer.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'integration tests', () => {

  } );

  describe( 'unit tests', () => {

  } );

  // describe( 'snapshot tests', () => {
  //   const props = {
  //     label: 'Search',
  //     iconImage: 'Search',
  //     url: 'tataplay.com'
  //   }
  //   const component = mountSnapShot(
  //     <BrowserRouter>
  //       <LeftNavContainer { ...props } />
  //     </BrowserRouter>
  //   );
  //   expect( component.toJSON() ).toMatchSnapshot();
  // } );

} );
