/**
 * The AccordionSection is the content portion for each individual Accordion within the AccordionGroup.
 *
 * @module views/components/AccordionSection
 * @memberof -Common
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AccordionSection.scss';
import classNames from 'classnames';

/**
 * Represents a AccordionSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AccordionSection
 */
export const AccordionSection = function( props ){
  const [isActive, setIsActive] = useState( props.active );
  return (
    <div className={ classNames( 'AccordionSection', {
      'AccordionSection--detailAccordion': props.detailAccordion
    } ) }
    >
      { props.title &&
        <button className='AccordionSection__title'
          tabIndex={ props.index }
          onClick={ () => setIsActive( !isActive ) }
        >
          <div>
            { props.title }
          </div>
          <div className='AccordionSection__icon'>
            { isActive ? '-' : '+' }
          </div>
        </button>
      }
      { isActive && props.body &&
        <div className='AccordionSection__body'>
          { props.body }
        </div>
      }

    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - sets the title value
 * @property {string} body - Sets the body value
 * @property {string} bodyStyle - Sets the body style tag
 * @property {boolean} isActive - Sets the active element
 */

export const propTypes =  {
  title: PropTypes.string,
  body: PropTypes.string,
  active: PropTypes.bool
};

/**
 * Default values for passed properties
 * @type {object}
 * @property {boolean} spellCheck=true - Flag to trigger spellcheck in the field, default is 'true'
 */
export const defaultProps = {
  active: false
};

AccordionSection.propTypes = propTypes;
AccordionSection.defaultProps = defaultProps;

export default AccordionSection;
