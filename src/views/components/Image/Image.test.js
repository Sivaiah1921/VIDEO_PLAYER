import React from 'react';
import PropTypes from 'prop-types';
import Image, { propTypes } from './Image';
import * as jestutils from './../../../utils/jest/jest';
import * as intersectionMethods from '../../../utils/useIntersectionObserver/useIntersectionObserver';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<Image />tests', () => {

  it( 'renders without crashing', () => {

    intersectionMethods.useIntersectionObserver = jest.fn( () => {
      return true
    } );

    // if we're expecting an error, we should suppress these and write an expectation
    // eslint-disable-next-line no-console
    console.error = jest.fn();

    render( < Image /> );

    // console.error was called twice for the 2 required attributes src and alt
    // eslint-disable-next-line no-console
    expect( console.error ).toHaveBeenCalledTimes( 1 )
  } );

  describe( 'properties', () => {
    const props = {
      src: 'PropTypes.string.isRequired',
      alt: 'PropTypes.string.isRequired',
      width: 0,
      aspectRatio: '1:1',
      metaData: {
        width: 1,
        height: 4
      },
      ariaHidden: false,
      ariaLabel: 'aria-label',
      isBackground: false
    };
    const required = {
      src: 'PropTypes.string.isRequired',
      alt: 'PropTypes.string.isRequired'
    };
    it( 'should have the proper propTypes', () => {
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props, required );
      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();
    } );
    it( 'should have the proper number of props', () => {
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length );
    } );

    it( 'an instance of Image should have the proper propTypes set', () => {
      expect( Image.propTypes ).toBe( propTypes );
    } );

  } );

  describe( 'integration tests', () => {} );

  describe( 'unit tests', () => {

    it( 'should display an image', () => {
      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
        />
      );
      expect( testScreen.getByRole( 'img' ) ).toBeInTheDocument();
    } )

    it( 'should display an image tag with a transparent placeholder src attribute on initial render', async() => {

      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: false }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
        />
      );
      expect( container.querySelector( 'img' ).src ).toBe( 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' );

    } )

    it( 'should have alt text', () => {

      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          width={ 100 }
        />
      );
      expect( container.querySelector( 'img' ).alt ).toBe( 'ADA friendly text' );
    } );

    it( 'should have width if width is passed in should be a number', () => {
      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          ariaHidden={ true }
          width={ 100 }
        />
      );
      expect( container.getElementsByClassName( 'Image' )[0].style.width ).toBe( '100px' );
    } );

    it( 'should have calculate and set the height of the image if an aspect ratio is passed to it of 1:1', () => {
      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          width={ 100 }
          aspectRatio='1:1'
        />
      );
      expect( container.querySelector( 'img' ).src.includes( 'h=100' ) ).toBe( true );
    } );

    it( 'should have calculate and set the height of the image if an aspect ratio is passed to it of 3:4', () => {
      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          width={ 100 }
          aspectRatio='3:4'
        />
      );
      expect( container.querySelector( 'img' ).src.includes( 'h=133' ) ).toBe( true );
    } );

    it( 'should not set a height for dynamic media if an aspect ratio is not passed', () => {

      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );

      let { container } = render(
        <Image
          src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          width={ 100 }
        />
      );
      expect( container.querySelector( 'img' ).src.includes( 'h=133' ) ).toBe( false );
    } );

    // it( 'should have background image with fmt auto', () => {
    //   intersectionMethods.useIntersectionObserver = jest.fn( () => {
    //     return { hasIntersected: true }
    //   } );

    //   let imageTemplate = 'Green100BG';
    //   let { container } = render(
    //     <Image
    //       alt='ADA friendly text'
    //       src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
    //       width={ 100 }
    //       isBackground={ true }
    //       metaData={ {
    //         imageTemplate
    //       } }
    //     />
    //   );
    //   expect( container.getElementsByClassName( 'Image' )[0].style.backgroundImage).toBe( 'url( https://images.ulta.com/is/image/Ulta/2505430?id=-UIa83&fmt=jpg?w=100&$Green100BGLight$&fmt=auto )' );
    // } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly with the default props', () => {
      intersectionMethods.useIntersectionObserver = jest.fn( () => {
        return { hasIntersected: true }
      } );
      const imageComponent = jestutils.mountSnapShot( useProviders(
        <Image src='https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM'
          alt='ADA friendly text'
          width={ 100 }
        />
      )
      )
        .toJSON();
      expect( imageComponent ).toMatchSnapshot();
    } );
  } );
} );