import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SubscriberCard, { propTypes, defaultProps } from './SubscriberCard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  statusText: 'Bing Active',
  subscriptionId: '1122334455',
  icon: 'ArrowForward',
  url: '#',
  accountDetailsDTOList: []
}

describe( '<SubscriberCard />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        <SubscriberCard { ...mockProps } />
      </BrowserRouter>
    );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        accountStatus: PropTypes.string,
        subscriberId: PropTypes.string.isRequired
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <SubscriberCard { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
