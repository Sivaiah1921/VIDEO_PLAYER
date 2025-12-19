import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NotificationsPopUp, { propTypes, defaultProps } from './NotificationsPopUp';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<NotificationsPopUp />tests', () => {
  const mockProps = {
    iconName : 'Success',
    message: 'Plan Renewal Successful',
    info: 'Your plan has been renewed from Standard (monthly) to Premium (monthly)',
    additionalInfo: 'You will be charged 200 from 01/05/2022',
    buttonLabel: 'Done'
  }

  describe( '<NotificationsPopUp />tests', () => {
    beforeAll( () => {
      ReactDOM.createPortal = jest.fn( ( element, node ) => {
        return element
      } )
    } )

    it( 'renders without crashing', () => {
      const { result } = render( () => {
        const ref = useRef();
        const mockFn = jest.fn();
        act( () => {
          render(
            <NotificationsPopUp
              modalRef={ useRef() }
              handleCancel={ hideModal }
              opener={ useRef() }
              { ...mockProps }
            /> );
        } )
      } );
    } );

    describe( 'properties', () => {
      it( 'should have the proper propTypes', () => {
        const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
          return key
        } );
        expect( ( Object.keys( {
          iconName: PropTypes.string,
          message: PropTypes.string,
          info: PropTypes.string,
          additionalInfo: PropTypes.string,
          buttonLabel: PropTypes.string,
          backButton: PropTypes.string,
          backIcon: PropTypes.string
        } ) ).map( ( key, index ) =>{
          return key
        } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
      } );

      it( 'an instance of NotificationsPopUp should have the proper propTypes set', () => {
        expect( NotificationsPopUp.propTypes ).toBe( propTypes );
      } );

      it( 'an instance of NotificationsPopUp should have the proper defaultProps', () => {
        expect( NotificationsPopUp.defaultProps ).toBe( defaultProps );
      } );

    } );

    describe( 'integration tests', () => {

    } );

    describe( 'unit tests', () => {

    } );

  } );


  describe( 'snapshot tests', () => {
    it( 'renders correctly modal', () => {
      const modalComponent = mountSnapShot(
        <NotificationsPopUp
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );


} );

