/**
 * @jest-environment jsdom
 */

import { useToggle } from './useToggle';
import { renderHook, act } from '@testing-library/react';

describe( 'Toggle Hook', () => {

  describe( 'toggleUtility', () => {

    it( 'should set the state to false intially', done => {
      const { result } = renderHook( () => useToggle( false ) )
      let [state, toggle] = result.current
      expect( state ).toEqual( false )
      done()
    } )
    it( 'should toggle the state of the hook with false', done => {
      const { result } = renderHook( () => useToggle( false ) )
      let [state, toggle] = result.current
      act( () => {
        toggle( )
      } );
      [state, toggle] = result.current
      expect( state ).toEqual( true )
      done()
    } )

    it( 'should toggle the state of the hook with true', done => {
      const { result } = renderHook( () => useToggle( true ) )
      let [state, toggle] = result.current
      act( () => {
        toggle( )
      } );
      [state, toggle] = result.current
      expect( state ).toEqual( false )
      done()
    } )

    it( 'UseToggle Hook should use toggle function ', () => {
      const { result }   = renderHook( () => useToggle( false ) )
      let [state, toggle] = result.current
      expect( typeof toggle ).toBe( 'function' )
    } )

    it( 'should toggle the value when initial value is not provided', done => {
      const { result } = renderHook( () => useToggle( ) )
      let [state, toggle] = result.current

      act( () => {
        toggle( )
      } );
      [state, toggle] = result.current
      expect( state ).toBe( true )
      done()
    } )
  } )
} )
