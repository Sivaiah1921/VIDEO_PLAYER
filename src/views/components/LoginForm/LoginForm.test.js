import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LoginForm, { propTypes, defaultProps } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';
import renderer from 'react-test-renderer';

const consoleErrorSpy = jest.spyOn( console, 'error' );

jest.mock( '../../core/AppContextProvider/AppContextProvider', () => ( {
  ...jest.requireActual( '../../core/AppContextProvider/AppContextProvider' ),
  useAppContext: () => ( {
    config: {}
  } )
} ) );

const mockProps = {
  onChange: PropTypes.func,
  deleteBtnLabel: PropTypes.string.isRequired,
  clearBtnLabel: PropTypes.string.isRequired,
  onClear: PropTypes.func,
  onRemove: PropTypes.func,
  mobInputLabel: PropTypes.string,
  value: PropTypes.string,
  openModal: PropTypes.func,
  btnLabelModal: PropTypes.string
}
jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useLocation: () => ( {
    args: {
      fromPRMN: ''
    }
  } )
} ) );
describe( '<LoginForm />tests', () => {
  it( 'renders without crashing', () => {
    render( <LoginForm { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( LoginForm.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    beforeAll( () => {
      ReactDOM.createPortal = jest.fn( ( element, node ) => {
        return element
      } )
    } )
    afterEach( () => {
      ReactDOM.createPortal.mockClear()
    } )

    it( 'should render correctly with Node or Function', () => {
      const component = renderer.create(
        <BrowserRouter>
          <LoginForm { ...mockProps }/>
        </BrowserRouter>
      )
      expect( component.toJSON() ).toMatchSnapshot()
    } )
  } )

} );
