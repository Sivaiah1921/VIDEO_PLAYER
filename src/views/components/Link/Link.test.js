import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Link from './Link';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';
const { propTypes, defaultProps } = Link;
const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<Link />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( < Link /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        id: 'someString',
        title: 'sometitle',
        tabIndex: 1,
        url: 'someurl',
        target: '_self',
        ariaLabel: 'Label',
        withHover: false,
        compact: false,
        secondary: false,
        disabled: false,
        onClick: PropTypes.func,
        iconImage: 'ArrowDown',
        iconRight: true,
        iconSize: 's'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'should have the proper defaultProps', () => {
      expect( {
        target: '_self',
        withHover: false,
        compact: false,
        secondary: false,
        disabled: false,
        iconRight: false
      }
      ).toEqual( defaultProps );
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( Link.propTypes ).toBe( propTypes );
    } );

    it( 'an instance of Link should have the proper defaultProps', () => {
      expect( Link.defaultProps ).toBe( defaultProps );
    } );

    it( 'should have the proper "target" PropTypes either _blank, _self to check compatibility with target prop', () => {
      [
        '_blank',
        '_self'
      ].forEach( ( value ) => {
        expect( PropTypes.checkPropTypes(
          propTypes,
          {
            'target': value
          }
        ) );
      } );
      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();
    } );

    it( 'should render the id when provided', () => {
      const { container } = jestutils.mountWithRouter( <Link id='fancyid' /> );
      expect( container.querySelector( '.Link' ).id ).toBe( 'fancyid' );
    } );
  } );

  describe( 'unit tests', () => {
    it( 'should render tabindex for Link', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          tabIndex={ 0 }
        /> );
      expect( container.querySelector( '.Link' ).tabIndex ).toEqual( 0 );

    } );

    it( 'renders the Link with the `Link and renders the Link with withHover Class', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          withHover
        /> );

      expect( container.querySelector( '.Link--withHover' ) ).toBeInTheDocument();
    } );
    it( 'should not redirect to url when link is disabled ', ()=>{
      const { container } = jestutils.mountWithRouter(
        <Link
          withHover
          compact
          disabled
          url='someUrl'
        /> );
      expect( container.querySelector( 'a' ).href ).toBeFalsy();
    } )

    it( 'renders the Link with withHover with disabled ', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          withHover
          disabled
        /> );
      expect( container.querySelector( '.Link--disabled' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with the `Link', () => {
      const { container } = jestutils.mountWithRouter( <Link compact /> );
      expect( container.querySelector( '.Link' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with compact Class', () => {
      const { container } = jestutils.mountWithRouter( <Link compact /> );
      expect( container.querySelector( '.Link--compact' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with compact with disabled ', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          compact
          disabled
        /> );
      expect( container.querySelector( '.Link--disabled' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with secondary Class', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          secondary
        /> );
      expect( container.querySelector( '.Link--secondary' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link like Button Primary Style with withHover props', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          likeButtonPrimary
          likeButtonWithHover
        /> );
      expect( container.querySelector( '.Link--likeButtonPrimary' ) ).toBeInTheDocument();
      expect( container.querySelector( '.Link--likeButtonWithHover' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link like Button Secondary Style with withHover props', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          likeButtonSecondary
          likeButtonWithHover
        /> );
      expect( container.querySelector( '.Link--likeButtonSecondary' ) ).toBeInTheDocument();
      expect( container.querySelector( '.Link--likeButtonWithHover' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link like Button Outline Style with withHover props', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          likeButtonOutline
          likeButtonWithHover
        /> );
      expect( container.querySelector( '.Link--likeButtonOutline' ) ).toBeInTheDocument();
      expect( container.querySelector( '.Link--likeButtonWithHover' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link like Button Compact Style with withHover props', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          likeButtonCompact
          likeButtonWithHover
        /> );
      expect( container.querySelector( '.Link--likeButtonCompact' ) ).toBeInTheDocument();
      expect( container.querySelector( '.Link--likeButtonWithHover' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with right icon', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          url='someurl'
          iconImage={ 'Account' }
          iconRight={ true }
        /> );
      expect( container.querySelector( '.Link__icon--withIconRight' ) ).toBeInTheDocument();
    } );

    it( 'renders the Link with no icon', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          url='someurl'
        /> );
      expect( container.querySelector( '.Link__icon--withIconRight' ) ).not.toBeInTheDocument();
    } );

    it( 'renders the Link with left icon', () => {
      const { container } = jestutils.mountWithRouter(
        <Link
          url='someurl'
          iconImage={ 'ArrowDown' }
          iconSize={ 's' }
          iconRight={ false }
        /> );
      expect( container.querySelector( '.Link__icon--withIconRight' ) ).not.toBeInTheDocument();
    } );

    it( 'renders the handleNavigation on click event', async() => {
      let windowProxy = {
        open: jest.fn()
      }
      let mockEvt = {
        preventDefault: jest.fn()
      }
      global.location = {
        origin : 'http://ulta.com'
      }
      let handleNavigation  = Link.handleNavigation( {}, 'http://test.com', windowProxy, mockEvt )
      const { container } = jestutils.mountWithRouter(
        <Link
          url='someurl'
          title='title'
        /> );
      fireEvent.click( container.querySelector( '.Link' ) )
      await wait( () => {
        expect( handleNavigation ).toHaveBeenCalled();
      } );
    } );

    describe( 'handleNavigation', () => {
      it( ' should call the window proxy when the url has http', () => {
        let windowMock = {
          open: jest.fn()
        }
        let mockEvt = {
          preventDefault: jest.fn()
        }
        global.location = {
          origin : 'http://test.com'
        }
        Link.handleNavigation( {}, 'http://test.com', windowMock, mockEvt )
        expect( mockEvt.preventDefault ).toHaveBeenCalled();
        expect( windowMock.open ).toHaveBeenCalledWith( 'http://test.com', '_blank' )
      } )

      it( ' should call props.Onclick method if Onclick is passed in the props', async() => {
        let mockEvt = {
          preventDefault: jest.fn()
        }
        const props = {
          onClick : jest.fn()
        }
        const { container } = jestutils.mountWithRouter(
          <Link
            url='someurl'
            title='title'
          /> );
        fireEvent.click( container.querySelector( '.Link' ) )
        await wait( () => {
          expect( props.onClick ).toHaveBeenCalledWith( mockEvt );
        } );
      } )
      it( ' should not call props.Onclick method if Onclick is not passed in the props', async() => {
        let mockEvt = {
          preventDefault: jest.fn()
        }
        const { container } = jestutils.mountWithRouter(
          <Link
            url='someurl'
            title='title'
          /> );
        fireEvent.click( container.querySelector( '.Link' ) )
        await wait( () => {
          expect( props.onClick ).not.toHaveBeenCalled();
        } );
      } )
    } )
  } );


  describe( 'snapshot tests', () => {
    it( 'renders correctly default', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link />
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with withHover props', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link withHover>Now you see text with default properties</Link>
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with withHover and disabled props', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link withHover
            diabled
          />
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with compact props', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link compact>Now you see text with default properties</Link>
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with compact and disabled props', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link compact
            diabled
          />
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with secondary', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link secondary />
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with secondary and disabled', () => {
      const linkComponent = mountSnapShot(
        <BrowserRouter>
          <Link secondary
            diabled
          />
        </BrowserRouter>
      )
        .toJSON();
      expect( linkComponent ).toMatchSnapshot();
    } );

  } );
} );