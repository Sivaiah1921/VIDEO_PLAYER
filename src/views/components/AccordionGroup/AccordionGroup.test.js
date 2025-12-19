import React from 'react';
import PropTypes from 'prop-types';
import AccordionGroup, { propTypes } from './AccordionGroup';
import * as jestutils from './../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  detailAccordion: false,
  accordionList : [{
    title : 'Sample Title 1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'None'
  },
  {
    title : 'Sample Title 2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-2'
  },
  {
    title : 'Sample Title 3',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-3'
  },
  {
    title : 'Sample Title 4',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    bodyStyle: 'body-1'
  }],
  spacerValue:'01'
}

describe( '<AccordionGroup />tests', () => {
  it( 'renders without crashing', () => {
    render( < AccordionGroup /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key
      } );
      expect( ( Object.keys( {
        detailAccordion: PropTypes.bool,
        accordionList: PropTypes.arrayOf(
          PropTypes.shape( {
            title: PropTypes.string,
            body: PropTypes.string,
            bodyStyle: PropTypes.string
          } )
        ),
        spacerValue: PropTypes.string,
        expandAccessibilityLabel: PropTypes.string,
        collapseAccessibilityLabel: PropTypes.string
      } ) ).map( ( key, index ) => {
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )

    } );

    it( 'an instance of AccordionGroup should have the proper propTypes set', () => {
      expect( AccordionGroup.propTypes ).toBe( propTypes );
    } );

  } );

  describe( 'snapshot tests', () => {
    it( 'renders Section correctly with proper props', () => {
      const AccordionComponent = mountSnapShot(
        <AccordionGroup
          { ...mockProps }
        />
      );
      expect( AccordionComponent.toJSON() ).toMatchSnapshot();
    } );

  } );

} );
