import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import QrCodePopUp, { propTypes, defaultProps } from './QrCodePopUp';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );


describe( '<QrCodePopUp />tests', () => {
  const mockProps = {
    url:'https://www.google.com/',
    size:'136',
    goBack:'Go Back',
    heading:'Scan QR Code To Recharge',
    info:'Your current balance is 100. Need a minimal balance of 600.',
    additionalInfo:'In case post recharge, your balance does not update, then please refresh your balance from My Plan page.'
  }

  describe( '<QrCodePopUp />tests', () => {
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
            <QrCodePopUp
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
          modalRef: PropTypes.object,
          opener: PropTypes.object,
          goBack: PropTypes.string,
          heading: PropTypes.string,
          url: PropTypes.string,
          size: PropTypes.string,
          additionalInfo: PropTypes.string
        } ) ).map( ( key, index ) =>{
          return key
        } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
      } );

      it( 'should have the proper defaultProps', ()=> {
        expect(
          JSON.stringify( {
            size: '136'
          } )
        ).toEqual( JSON.stringify( defaultProps ) );
      } );

      it( 'an instance of QrCodePopUp should have the proper propTypes set', () => {
        expect( QrCodePopUp.propTypes ).toBe( propTypes );
      } );

      it( 'an instance of QrCodePopUp should have the proper defaultProps', () => {
        expect( QrCodePopUp.defaultProps ).toBe( defaultProps );
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
        <QrCodePopUp
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );

} );
