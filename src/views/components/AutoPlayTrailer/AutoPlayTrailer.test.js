import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AutoPlayTrailer from './AutoPlayTrailer';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );



describe( '<AutoPlayTrailer />tests', () => {
  const mockProps = {
    iconName: 'AutoplayTrailer80x80'
  }

  describe( '<AutoPlayTrailer />tests', () => {
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
            <AutoPlayTrailer
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
        <AutoPlayTrailer
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
