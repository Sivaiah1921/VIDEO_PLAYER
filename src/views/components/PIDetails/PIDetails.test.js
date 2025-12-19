import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PIDetails, { propTypes, defaultProps } from './PIDetails';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';

const consoleErrorSpy = jest.spyOn( console, 'error' );



describe( '<PIDetails />tests', () => {
  const mockProps = {
    title: 'Barot House',
    backtitle:'To Close',
    description: `In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply. In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply. a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply.  `,
    starring:{
      title: 'Starring',
      details: ['Chris Pratt', 'Bryce Dallas', 'Nick', 'Robinson Timothy Kennedy']
    },
    director: {
      title: 'Director',
      details: ['Colin Trevorrow']
    },
    producers: {
      title: 'Producers',
      details: ['Patrick Crowley', 'Frank Marshall']
    },
    subtitles: {
      title: 'Subtitles',
      details: ['English', 'Hindi']
    }
  }

  describe( '<PIDetails />tests', () => {
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
            <PIDetails
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
        <PIDetails
          { ...mockProps }
        /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
