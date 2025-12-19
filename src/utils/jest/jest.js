/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import I18nProvider from '../../views/core/I18nProvider/I18nProvider';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '../../views/core/AppContextProvider/AppContextProvider';

const defaultOptions = { baseInflection: 'Desktop', locale: 'en-US' }
// Make react-testing-library functions available in all test files without importing
global.render = render;
global.testScreen = screen;
global.fireEvent = fireEvent;

export const mountWithProviders = ( view, options = defaultOptions ) => {
  return render( useProviders( view, options ) )// eslint-disable-line
}
global.mountWithProviders = mountWithProviders;

export const mountWithRouter = ( view, options = defaultOptions ) => {
  return mountWithProviders(
    <BrowserRouter>
      { view }
    </BrowserRouter>,
    options
  )
}
global.mountWithRouter = mountWithRouter;

export const useProviders = ( view, options = defaultOptions ) => {
  const {
    locale = 'en-US'
  } = options;

  return (
    <I18nProvider locale={ locale }>
      <AppContextProvider>
        { view }
      </AppContextProvider>
    </I18nProvider>
  )
}
global.useProviders = useProviders;

// Add global intersection observer so unit tests do not fail when <Image /> component is used
global.IntersectionObserver = class IntersectionObserver{
  observe(){
    return null;
  }
  unobserve(){
    return null;
  }
};

export function wait( amount = 0 ){
  return new Promise( resolve => setTimeout( ()=>{
    resolve( 'success' )
  }, amount ) );
}
global.wait = wait;

export const mountSnapShot = ( view, options = defaultOptions ) => {
  return renderer.create( useProviders( view, options ) )// eslint-disable-line
}
global.mountSnapShot = mountSnapShot;

export const testProps = ( callback, props, requiredProps = {} ) => {
  return Object.entries( props )?.forEach( ( item ) => {
    const [key, val] = item;
    const testItem = { [key] : val };
    let testObj = { ...requiredProps, ...testItem };
    return callback( testObj, key, val );
  } );
}

Object.defineProperty( window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation( query => ( {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecatedwow
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  } ) )
} );
