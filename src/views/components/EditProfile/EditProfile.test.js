import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditProfile, { propTypes, defaultProps } from './EditProfile';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<EditProfile />tests', () => {
  const mockProps = {
    clearBtnLabel: 'Clear',
    deleteBtnLabel: 'Delete',
    spaceBtnLabel: 'Space',
    url: '#',
    iconImage: 'Profile',
    editProfileTitle: 'Edit Profile',
    editProfileName:'Name',
    editProfileLabel:'Reyansh Demian',
    registeredMobileLabel:'Registered Mobile Number',
    registeredMobilePrefixNumber: '+91',
    registeredMobileValue:'8364738725',
    emailLabel: 'Email',
    emailValue: 'reyanshdamian@gmail.com',
    btnLabel:'Update',
    keys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '^', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '@', '.', '.com', '!#$']
  }

  it( 'renders without crashing', () => {
    render( <BrowserRouter>< EditProfile { ...mockProps } /></BrowserRouter> );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <EditProfile { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
