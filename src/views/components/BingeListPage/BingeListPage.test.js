import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import BingeListPage from './BingeListPage';
import * as jestutils from '../../../utils/jest/jest';

const mockProps = {};

describe( '<BingeListPage />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <BingeListPage { ...mockProps } />
    );
  } );
} );

describe( 'snapshot tests', () => {
  it( 'renders correctly default', () => {
    const bingeListComponent = mountSnapShot(
      <BrowserRouter>
        <BingeListPage />
      </BrowserRouter>
    )
      .toJSON();
    expect( bingeListComponent ).toMatchSnapshot();
  } );
} );
