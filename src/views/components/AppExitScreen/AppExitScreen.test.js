import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AppExitScreen, { propTypes } from './AppExitScreen';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<AppExitScreen />tests', () => {
  const mockProps = {
    iconName : 'Logout80x81',
    message: 'Exiting Tata Play Binge',
    info: 'Do you want to proceed',
    buttonLabelYes: 'Yes',
    buttonLabelNo: 'No'
  }

  describe( '<AppExitScreen />tests', () => {
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
            <AppExitScreen
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
          buttonLabelYes: PropTypes.string,
          buttonLabelNo: PropTypes.string
        } ) ).map( ( key, index ) =>{
          return key
        } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
      } );

      it( 'an instance of AppExitScreen should have the proper propTypes set', () => {
        expect( AppExitScreen.propTypes ).toBe( propTypes );
      } );
    } );

  } );


  describe( 'snapshot tests', () => {
    it( 'renders correctly modal', () => {
      const modalComponent = mountSnapShot(
        <AppExitScreen
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );


} );
