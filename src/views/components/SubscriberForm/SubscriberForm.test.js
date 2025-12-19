import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SubscriberForm, { propTypes, defaultProps } from './SubscriberForm';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  subscriberIdList: [
    {
      statusText: 'Bing Active',
      subscriptionId: '1122334455',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: '',
      subscriptionId: '1122334456',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: 'Bing Active',
      subscriptionId: '1122334457',
      icon: 'ArrowForward',
      url: '#'
    },
    {
      statusText: '',
      subscriptionId: '1122334458',
      icon: 'ArrowForward',
      url: '#'
    }
  ],
  title: 'Select Subscriber ID',
  subscriberInfo: 'You have multiple Subcription IDs linked to your Registered Mobile Number.  Please select the one you wish to continue.'
}

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      subscriberSelected: '',
      accountDetailsDTOList: ''
    }
  } )
} ) );

describe( '<SubscriberForm />tests', () => {
  it( 'renders without crashing', () => {
    mountWithRouter( <SubscriberForm { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        title: PropTypes.string,
        subscriberInfo: PropTypes.string,
        subscriberIdList: PropTypes.arrayOf(
          PropTypes.shape( {
            url: PropTypes.string.isRequired,
            subscriptionId: PropTypes.string.isRequired,
            statusText: PropTypes.string,
            icon: PropTypes.string.isRequired
          } )
        )
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <SubscriberForm { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
