/**
 * The HTML element, or anchor element, along with its href attribute, creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL
 *
 * @module views/components/Link
 * @memberof -Common
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import Icon from '../Icon/Icon';
import './Link.scss';

/**
  * Method to handle navigation on click of link
  * @param  { Object } history
  * @param  { String } url
  * @param  { Object } windoxProxy=window
  */
export const handleNavigation = function( history, url, windoxProxy = global, event ){
  event.preventDefault();
  if( url?.includes( 'http' ) && !url?.includes( global.location.origin ) ){
    if( windoxProxy && windoxProxy.open ){
      windoxProxy.open( url, '_blank' );
    }
    else {
      window.open( url, '_blank' );
    }
  }
  else {
    setTimeout(
      () => {
        url && history?.push( url );
      }
    )
  }
}

/**
  * Represents a Link component
  *
  * @method
  * @param { Object } props - React properties passed from composition
  * @returns Link
  */
const Link = function( props ){
  const history = useHistory();
  const linkUrl = props.url;
  const aRef = useRef();

  return (
    <a
      ref={ aRef }
      className={
        classNames( 'Link', {
          [props.className]: props.className,
          'Link--withHover': props.withHover,
          'Link--secondary': props.secondary && !props.withHoverBtnSytle,
          'Link--compact': props.compact && !props.withHoverBtnSytle,
          'Link--disabled': props.disabled,
          'Link--likeButtonWithHover': props.likeButtonWithHover,
          'Link--likeButtonPrimary': props.likeButtonPrimary && !props.withHover,
          'Link--likeButtonSecondary': props.likeButtonSecondary && !props.withHover,
          'Link--likeButtonOutline': props.likeButtonOutline && !props.withHover,
          'Link--likeButtonCompact': props.likeButtonCompact && !props.withHover
        } )
      }
      { ...( Number.isInteger( props.tabIndex ) && { 'tabIndex': props.tabIndex } ) }
      { ...( props.id && { 'id': props.id } ) }
      { ...( props.target && { 'target': props.target } ) }
      { ...( props.title && { 'title': props.title } ) }
      { ...( props.ariaLabel && { 'aria-label' : props.ariaLabel } ) }
      { ...( linkUrl && props.onClick ? {
        onClick: function( e ){
          e.preventDefault();
          props.onClick( e );
        } } :
        { onClick: ( e ) => {
          Link.handleNavigation( history, linkUrl, props, e )
        } } ) }
    >
      { props.iconImage && !props.iconRight &&
        <Icon className={
          classNames( 'Link__icon', {
            'Link__icon--withIcon': !props.iconRight
          } ) }
        size={ props.iconSize }
        name={ props.iconImage }
        aria-hidden={ true }
        />
      }
      { props.children }
      { props.iconImage && props.iconRight &&
        <Icon className={
          classNames( 'Link__icon', {
            'Link__icon--withIconRight': props.iconRight
          } ) }
        size={ props.iconSize }
        name={ props.iconImage }
        aria-hidden={ true }
        />
      }
    </a>
  )
}

/**
  * property type definitions
  * @type object
  * @property { string } id - sets the id
  * @property { string } title - sets the text for display
  * @property { string } url - sets the url as href of anchor element to redirect
  * @property { number } tabIndex - sets the tabIndex, typically 0 or -1, for Aria support
  * @property { ( '_blank' | '_self' ) } target - A string, representing where to open the linked document
  * @property { string } ariaLabel - Sets the string in cases where text label is not visible on the screen
  * @property { bool } withHover - Flag to render the withHover variation
  * @property { bool } compact - Flag to render the compact variation
  * @property { bool } secondary - Flag to render the secondary variation
  * @property { bool } disabled - Flag to render the disabled variation
  * @property {string} iconImage - Name of the Icon to render, renders the Icon
  * @property {boolean} iconRight - Flag to render the icon to the right of the label
  * @property {string} iconSize - Size of the Icon to render, it's value matches the viewports naming: s, m, l
  */
export const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
  tabIndex: PropTypes.number,
  target: PropTypes.oneOf( [
    '_blank',
    '_self'
  ] ),
  ariaLabel: PropTypes.string,
  withHover: PropTypes.bool,
  compact: PropTypes.bool,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  iconImage: PropTypes.string,
  iconRight: PropTypes.bool,
  iconSize: PropTypes.string
};

/**
  * Default values for passed properties
  * @type object
  * @property { string } [ target='_self' ] - sets the target, typically _self or _blank, specifies where to open the linked document
  * @property { bool } [ withHover=false ] defaultProps.withHover -  false
  * @property { bool } [ compact=false ] defaultProps.compact -  false
  * @property { bool } [ secondary=false ] defaultProps.secondary -  false
  * @property { bool } [ disabled=false ] defaultProps.disabled -  false
  * @property { bool } [ iconRight=false ] defaultProps.iconRight -  false
  */
export const defaultProps = {
  target: '_self',
  withHover: false,
  compact: false,
  secondary: false,
  disabled: false,
  iconRight: false
};

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;
Link.handleNavigation = handleNavigation;

export default Link;