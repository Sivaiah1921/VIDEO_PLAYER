import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RemoveDevice, { propTypes, defaultProps } from './RemoveDevice';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );



describe( '<RemoveDevice />tests', () => {
  const mockProps = {
    content:'Are you sure you want to remove Briju’s Iphone?',
    iconName: 'RemovePhone',
    buttonLabel:'Yes, Remove Device',
    backButton: 'To Close'
  }

  describe( '<RemoveDevice />tests', () => {
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
            <RemoveDevice
              modalRef={ useRef() }
              handleCancel={ hideModal }
              opener={ useRef() }
              { ...mockProps }
            /> );
        } )
      } );
    } );

  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly modal', () => {
      const modalComponent = mountSnapShot(
        <RemoveDevice
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
