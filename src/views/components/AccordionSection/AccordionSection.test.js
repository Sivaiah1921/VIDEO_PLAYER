import React from 'react';
import PropTypes from 'prop-types';
import AccordionSection from './AccordionSection';
import * as jestutils from './../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  title: 'Accordion Title',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  bodyStyle: 'body-2',
  ative: false
}

describe( '<AccordionSection />tests', () => {
  it( 'renders without crashing', () => {
    render( < AccordionSection { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( AccordionSection.propTypes, testObj, key, val ) )
      }, mockProps );
      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();
    } );

  } );

  describe( 'snapshot tests', () => {
    it( 'renders Section correctly with proper props', () => {
      const AccordionComponent = mountSnapShot(
        <AccordionSection
          { ...mockProps }
        />
      );
      expect( AccordionComponent.toJSON() ).toMatchSnapshot();
    } );
  } );
} );
