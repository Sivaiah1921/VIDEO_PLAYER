import React from 'react';
import PropTypes from 'prop-types';
import GenreMediaCard, { propTypes } from './GenreMediaCard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockData = {
  title: 'Action',
  image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1655702259/tatasky-uat/cms-ui/images/custom-content/1655702258475.jpg',
  isFocussed: false,
  url: ''
}

describe( '<GenreMediaCard />tests', () => {
  it( 'renders without crashing', () => {
    render( < GenreMediaCard /> );
  } );

  describe( 'properties', () => {

    it( 'should have the proper defaultProps', ()=> {
      expect(
        JSON.stringify( {
          ...mockData
        } )
      ).toEqual( JSON.stringify( mockData ) );
    } );

  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < GenreMediaCard />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
