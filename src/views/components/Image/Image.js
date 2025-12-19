/**
 * renders an image to the calling component. It typically is used for rendering media images. It has an intersection observer which is used for lazyloading.
 *
 * @module views/components/Image
 * @memberof -Common
 */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Image.scss';

/**
 * Represents a Image component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Image
 */
export const Image = ( props ) => {

  const imgRef = useRef( null );
  const [imgSrc, setImgSrc] = useState( null );

  let {
    width: metaDataWidth,
    height: metaDataHeight
  } = props.metaData

  useEffect( () => {
    let imageParams;
    let imageWidth =  Math.round( ( props.width || imgRef.current.offsetWidth ) );
    imageWidth = ( metaDataWidth && imageWidth > metaDataWidth ) ? metaDataWidth : imageWidth;
    imageParams = `w=${ imageWidth }`;

    let newImgSetSrc = `${ props.src }?${ imageParams }`;
    if( props.isFuse && props.src && props.src.includes( 'width=' ) ){
      newImgSetSrc = `${ props.src.split( '?' )[0] }?${ imageParams }`
    }
    props.isPlayflix || props.isHungama ? setImgSrc( props.src ) : setImgSrc( props.src ? newImgSetSrc : '' );
  }, [props.src] );

  const imageStyles = {
    ...( props.width && { width: `${ props.width }px` } ),
    ...( props.height && { height: `${ props.height }px` } )
  }

  return (
    <div className={ 'Image' }
      ref={ imgRef }
      { ...( ( props.width || props.height ) && { style: imageStyles } ) }
      { ...( props.isBackground && { style: { ...imageStyles, backgroundImage: `url( ${ `${ imgSrc }&fmt=webp` } )` } } ) }
      { ...( props.isGenreBackground && { style: { ...imageStyles, background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url( ${ `${ imgSrc }&fmt=webp` } ) no-repeat top left / cover` } } ) }
      { ...( props.fousedImage && { className : 'activeImageClass' } ) }
    >
      {
        props.isGenreBackground ? null : !props.isBackground &&
        <img
          alt={ '' }
          src={ imgSrc }
          { ...( props.id && { id: props.id } ) }
          { ...( props.metaData?.width && { width: metaDataWidth } ) }
          { ...( props.metaData?.height && { height: metaDataHeight } ) }
          { ...( imgSrc && { srcSet: `${ imgSrc }${props.isPlayflix || props.isHungama ? '?fmt=webp' : '&fmt=webp' }` } ) }
        />
      }
    </div>
  )
}

/**
  * property type definitions
  * @type object
  * @property {string} src - sets the image src for image display
  * @property {string} alt - sets the alt text for image. Required for all images. If decorative image pass ''
  * @property {number} width - sets the image width
  */
export const propTypes =  {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  metaData: PropTypes.object,
  isBackground: PropTypes.bool,
  isGenreBackground: PropTypes.bool
};

/**
  * property type definitions
  * @type object
  * @property {string} [rootMargin='200px 200px'] - Margin around the root. If the image gets within 50px in the Y axis, start the download.
  * @property {object} [root = null] - The element that is used as the viewport for checking visiblity of the target.
  */
export const defaultProps = {

  // If the image gets within 200px in the Y axis, start the download.
  rootMargin: '200px 200px',
  root : null,

  alt:'',
  metaData: {
    width: undefined,
    height: undefined
  },
  isBackground: false,
  isGenreBackground: false
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default React.memo( Image );
