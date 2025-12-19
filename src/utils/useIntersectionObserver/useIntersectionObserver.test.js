
import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import * as jestutils from '../jest/jest';
import * as intersectionMethods from './useIntersectionObserver';

global.IntersectionObserver = class IntersectionObserver{
  observe(){
    return null;
  }

  unobserve(){
    return null;
  }
};


describe( 'IntersectionObserver', () => {
  describe( 'handleIntersectionObserver', () => {
    it( ' should call setVisiblity and setHasIntersected with true when intersection is found', () => {
      const elem = {
        intersectionRatio: 11
      }
      const mockstSetVisibility = jest.fn()
      const mockstsetHasIntersected = jest.fn()
      const handleCurry = intersectionMethods.handleIntersectionObserver( mockstSetVisibility, true, mockstsetHasIntersected )
      handleCurry( [elem] );
      expect( mockstSetVisibility ).toHaveBeenCalledWith( true );
      expect( mockstsetHasIntersected ).toHaveBeenCalledWith( true );
    } )

    it( ' should not call setVisiblity when intersection is not found', () => {
      const elem = {
        intersectionRatio: 0
      }
      const mockstSetVisibility = jest.fn()
      const handleCurry = intersectionMethods.handleIntersectionObserver( mockstSetVisibility )
      handleCurry( [elem] );
      expect( mockstSetVisibility ).not.toHaveBeenCalled( );
    } )

    it( ' should call setVisiblity with false and setHasIntersected with true when intersection is found and element is moved out of viewport', () => {
      let elem = {
        intersectionRatio: 11
      }
      const mockstSetVisibility = jest.fn()
      const mockstsetHasIntersected = jest.fn()
      const handleCurry = intersectionMethods.handleIntersectionObserver( mockstSetVisibility, true, mockstsetHasIntersected )
      handleCurry( [elem] );
      expect( mockstSetVisibility ).toHaveBeenCalledWith( true );
      expect( mockstsetHasIntersected ).toHaveBeenCalledWith( true );
      elem.intersectionRatio = 0 ;

      handleCurry( [elem] );
      expect( mockstSetVisibility ).toHaveBeenCalledWith( false );
      expect( mockstsetHasIntersected ).toHaveBeenCalledWith( true );
    } )
  } )

  describe( 'useIntersectionObserver', () => {
    it( 'should return true if node is intersecting intersectionObserverHandler', async() => {
      const TestComponent = ()=> {
        const ref = useRef()
        const visible = intersectionMethods.useIntersectionObserver( ref, { rootMargin:'0px 0px',
          root : null,
          threshold: 0.01 } );
        return (
          <div className={ visible }
            ref={ ref }
          ></div>
        )
      }

      const { container } = render( <TestComponent/> );
      const expectedResponse = { 'visible': false, 'hasIntersected': false };
      expect( container.getElementsByClassName( expectedResponse )[0] ).toBeTruthy();
    } );
  } );

  describe( 'cleanOb', () => {
    it( ' should call unobserve method when cleanOb method is invoked', () => {
      const element = {
        intersectionRatio: 11
      }
      const observer = {
        current: {
          unobserve: jest.fn()
        }
      }
      intersectionMethods.cleanOb( observer, element )
      expect( observer.current.unobserve ).toHaveBeenCalledWith( element );
    } )
  } );
} );

