import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ConfirmPurchase, { propTypes, defaultProps } from './ConfirmPurchase';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  selectedPlan:  {},
  adjustmentText: 'Adjustment amount',
  adjustmentAmount: '200',
  PayableAmountText: 'Payable amount',
  PayableAmount: '200',
  btnLabel: 'Confirm Purchase'
}
jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useParams: () => ( {
    title: 'mega'
  } )
} ) );

describe( '<ConfirmPurchase />tests', () => {
  it( 'renders without crashing', () => {
    render( <ConfirmPurchase { ...mockProps } /> );
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
      expect( ConfirmPurchase.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ConfirmPurchase { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
