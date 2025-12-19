import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import { act } from 'react-dom/test-utils';
import * as jestutils from './../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<Modal />tests', () => {
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
          <Modal ref={ ref }
            isVideoModal={ true }
            modalAlign={ true }
            callBackFunc={ mockFn }
            { ...props }
          >
            <h1>Sample Modal</h1>
          </Modal> );
      } )
    } );
  } );

  describe( 'snapshot tests', () => {

    it( 'renders correctly modal', () => {
      const modalComponent = mountSnapShot(
        <Modal>
          <h1>Sample Modal</h1>
        </Modal> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );