import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Synopsis, { propTypes, defaultProps } from './Synopsis';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  metaData: {},
  config: {}
}
jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useParams: () => ( {
    type: 'SERIES',
    id: 899988
  } )
} ) );
describe( '<Synopsis />tests', () => {
  it( 'renders without crashing', () => {
    render( <Synopsis { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        metaData: PropTypes.object,
        config: PropTypes.object
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( Synopsis.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <Synopsis { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
