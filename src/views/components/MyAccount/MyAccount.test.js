import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MyAccount, { propTypes, defaultProps } from './MyAccount';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<MyAccount />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BrowserRouter>
        < MyAccount />
      </BrowserRouter>
    );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < MyAccount />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );
} );
