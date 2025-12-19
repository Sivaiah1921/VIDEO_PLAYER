import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TransactionHistory, { propTypes, defaultProps } from './TransactionHistory';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<TransactionHistory />tests', () => {
  const mockProps = {
    titleIcon: 'Profile',
    title: 'Transaction History',
    transactionHistory: [{
      id: '4564364556',
      amounts: '₹ 1999.00',
      paymentModeLabel: 'Payment Mode',
      paymentModeValue: 'Credit Card',
      shortDescription: 'Tata Sky Binge Premium Trial',
      dueOnLabel: 'Due On',
      dueOn: '09/07/21',
      date: '01/01/2020  10:00:54'
    },
    {
      id: '4564364556',
      amounts: '₹ 1999.00',
      paymentModeLabel: 'Payment Mode',
      paymentModeValue: 'Credit Card',
      shortDescription: 'Tata Sky Binge Premium Trial',
      dueOnLabel: 'Due On',
      dueOn: '09/07/21',
      date: '01/01/2020  10:00:54'
    },
    {
      id: '4564364556',
      amounts: '₹ 1999.00',
      paymentModeLabel: 'Payment Mode',
      paymentModeValue: 'Credit Card',
      shortDescription: 'Tata Sky Binge Premium Trial',
      dueOnLabel: 'Due On',
      dueOn: '09/07/21',
      date: '01/01/2020  10:00:54'
    },
    {
      id: '4564364556',
      amounts: '₹ 1999.00',
      paymentModeLabel: 'Payment Mode',
      paymentModeValue: 'Credit Card',
      shortDescription: 'Tata Sky Binge Premium Trial',
      dueOnLabel: 'Due On',
      dueOn: '09/07/21',
      date: '01/01/2020  10:00:54'
    }
    ]
  }
  it( 'renders without crashing', () => {
    render( <BrowserRouter>
      < TransactionHistory { ...mockProps } />
    </BrowserRouter> );
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
      expect( TransactionHistory.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < TransactionHistory { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
