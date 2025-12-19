import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EmptyBingeList, { propTypes, defaultProps } from './EmptyBingeList';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const mockProps = {
  icon: 'BingeListInterset',
  title: 'Your Binge List is empty',
  buttonLabel:'Discover to Add',
  content: 'Browse through exciting Movies and TV Shows and save it in your Binge List',
  bgImg: 'https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1655106967743',
  alt: 'background BingeList image'
}
describe( '<EmptyBingeList />tests', () => {
  it( 'renders without crashing', () => {
    render( <EmptyBingeList { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: 'BingeListInterset',
        title: 'Your Binge List is empty',
        buttonLabel:'Discover to Add',
        content: 'Browse through exciting Movies and TV Shows and save it in your Binge List',
        bgImg: 'https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1655106967743',
        alt: 'background BingeList image'
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly EmptyBingeList', () => {
      const component = mountSnapShot(
        <EmptyBingeList { ...mockProps } />
      ).toJSON();
      expect( component ).toMatchSnapshot();
    } );
  } );

} );
