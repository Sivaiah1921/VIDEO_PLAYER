/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RenameDevice, { propTypes, defaultProps } from './RenameDevice';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  alphanumericKeyboardProp: {
    keys :['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    onChange: a => console.log( a ),
    onClear: a => console.log( a ),
    onRemove: a => console.log( a ),
    onSpace: a => console.log( a ),
    clearBtnLabel: 'Clear',
    deleteBtnLabel: 'Delete',
    spaceBtnLabel:'Space'
  },
  title : 'Rename Device',
  sectionInfo: 'Key in preferred device name',
  btnLabel: 'Update',
  inputValue: 'Briju’s iPhone'
}

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      pageType: '',
      title: '',
      image: ''
    }
  } )
} ) );

describe( '<RenameDevice />tests', () => {
  it( 'renders without crashing', () => {
    render( <RenameDevice { ...mockProps } /> );
  } );
  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        alphanumericKeyboardProp: PropTypes.shape( {
          keys : PropTypes.array,
          onChange:PropTypes.func,
          onClear: PropTypes.func,
          onRemove: PropTypes.func,
          onSpace:PropTypes.func,
          clearBtnLabel: PropTypes.string,
          deleteBtnLabel: PropTypes.string,
          spaceBtnLabel:PropTypes.string
        } ).isRequired,
        title: PropTypes.string.isRequired,
        sectionInfo :PropTypes.string.isRequired,
        btnLabel: PropTypes.string.isRequired,
        inputValue: PropTypes.string.isRequired
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <RenameDevice { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
