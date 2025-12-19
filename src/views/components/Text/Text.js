/**
 * This is the new Text component. It accepts parameters for HTML tag, formatting 'textStyle', text alignment, font style, decoration and color override.
 *
 * @module views/Atoms/Text
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Text.scss';


/**
  * Represents a Huge Text component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Text
  */
export const Text = function( props ){
  const Tag = props.htmlTag;
  const textBody = props.text || props.children;
  const textStyle = props.style || props.textStyle;

  return (
    !!textBody &&
    <Tag
      className={ classNames( `Text`, {
        ...( props.spacerValue && { [`Text__bottomSpacer--${props.spacerValue}`]: props.spacerValue } ),
        ...( textStyle && { [`Text--${textStyle}`]: textStyle } ),
        ...( props.textAlign && { [`Text--${props.textAlign}`]: props.textAlign } ),
        ...( props.color && { [`Text--${props.color}`]: props.color } ),
        ...( props.fontStyle && { [`Text--${props.fontStyle}`]: props.fontStyle } ),
        ...( props.textDecoration && { [`Text--${props.textDecoration}`]: props.textDecoration } )
      } ) }
      { ...( props.ariaHidden && { [`aria-hidden`]: 'true' } ) }
      { ...( props.ariaCurrent && { [`aria-current`]: props.ariaCurrent } ) }
    >
      { textBody }
    </Tag>
  )
}

/**
  * Property type definitions
  * @type {object}
  * @property {string} textStyle - Sets the palette design display configuration
  * @property {string} htmlTag - Sets the HTML tag for the container
  * @property {string} textAlign - Sets the text alignment
  * @property {string} color - Sets the text color from Ulta palette
  * @property {string} fontStyle - Sets the text style (italic)
  * @property {string} textDecoration - Sets the text decoration (underline / strike through)
  * @property {boolean} ariaHidden - Sets the aria hidden if true
  * @property {string} ariaCurrent - Sets the aria current if present
  */
export const propTypes = {
  /** Type name that defines the tag (optional) and global className to apply */
  textStyle: PropTypes.oneOf( [
    'body-1',
    'body-2',
    'body-3',
    'body-4',
    'body-5',
    'title-1',
    'title-2',
    'title-3',
    'title-4',
    'subtitle-1',
    'subtitle-2',
    'header-1',
    'numberInput-2',
    'rail-title',
    'subtitle-3',
    'subtitle-4',
    'header-2',
    'header-3',
    'header-4',
    'header-5',
    'header-6',
    'languageTitle',
    'autoPlay-subtitle',
    'numberInput',
    'planCard-subtitle',
    'age-limit',
    'pi-title',
    'pi-description',
    'inputText',
    'buttonInputText',
    'rail-heading',
    'rail-sub-heading',
    'seasionTabText-2',
    'seriesDetail-title',
    'year-category',
    'pi-media-carousel-heading',
    'account-cards-text',
    'edit-profile-heading',
    'crown-subscription-text',
    'faq-heading',
    'appleTv-header',
    'appleTv-content',
    'lang-text',
    'promo-text',
    'flexi-heading',
    'flexi-subHeading',
    'autoPlay-title',
    'bingeList-subtitle',
    'header-genere',
    'pi-distroText',
    'seriesDetail-subtitle',
    'prime-heroBanner-title'
  ] ),
  /** Sets the HTML tag for the container */
  htmlTag: PropTypes.oneOf( [
    'p',
    'span',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'div'
  ] ),
  /** Sets the text alignment */
  textAlign: PropTypes.oneOf( [
    'left',
    'center',
    'right'
  ] ),
  /** Optional color overrides */
  color: PropTypes.oneOf( [
    'white',
    'neutral-25',
    'neutral-50',
    'neutral-100',
    'neutral-200',
    'neutral-300',
    'neutral-400',
    'neutral-500',
    'neutral-600',
    'neutral-700',
    'neutral-800',
    'neutral-900',
    'black',
    'pink-100',
    'pink-75',
    'pink-50',
    'pink-25',
    'pink-10',
    'pink-5',
    'bingeBlue-100',
    'bingeBlue-75',
    'bingeBlue-50',
    'bingeBlue-25',
    'bingeBlue-10',
    'bingeBlue-5',
    'purple-100',
    'purple-75',
    'purple-50',
    'purple-25',
    'purple-10',
    'purple-5',
    'railTitle',
    'railSubHeading',
    'error-600',
    'purple-40',
    'red',
    'focus-color'
  ] ),
  /** Optional font styles */
  fontStyle: PropTypes.oneOf( [
    'italic'
  ] ),
  /** Optional text decorations */
  textDecoration: PropTypes.oneOf( [
    'underline',
    'line-through'
  ] ),
  /** Optional bottom margin */
  spacerValue: PropTypes.oneOf( [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08'
  ] ),
  ariaHidden: PropTypes.bool,
  /** Sets the aria current if present */
  ariaCurrent: PropTypes.string
};

/**
  * Default values for passed properties
  * @type {object}
  * @property {string} textStyle - The default class of the palette design display configuration
  * @property {string} htmlTag - The default HTML tag for the container
  * @property {string} textAlign - The default value for text alignment
  */
export const defaultProps = {
  textStyle: 'body-1',
  htmlTag: 'p',
  textAlign: 'left'
};

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;
export default Text;
