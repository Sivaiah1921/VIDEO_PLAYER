import React from 'react';
import PropTypes from 'prop-types';
import PlanCard, { propTypes } from './PlanCard';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  focusKeyRefrence: 'TENURE_KEY',
  productId: '123',
  type:'Tenure',
  icon : 'Monthly',
  plan: 'Monthly',
  amount:  '₹350',
  savings:'',
  onSelected: ( value ) => {
    console.log( value ) // eslint-disable-line
  }
}

describe( '<PlanCard />tests', () => {
  it( 'renders without crashing', () => {
    render(
      < PlanCard { ...mockProps } />
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, mockProps );
      expect( Object.keys( mockProps ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( PlanCard.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        < PlanCard { ...mockProps } />
      ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
