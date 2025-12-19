/**
 *  Accordion component will expand and collapse on click of arrow which shows and hides details under a heading.
 *
 * @module views/components/Accordion
 * @memberof -Common
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';
import Icon from '../../components/Icon/Icon';
import classNames from 'classnames';
import Text from '../Text/Text';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';


/**
 * Represents a Accordion component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Accordion
 */
export const Accordion = function( props ){
  const { onFocus, focusKeyRefrence, onMouseEnter } = props;

  const { title, description, keyIndex } = props;
  const { ref, focused, focusKey } = useFocusable( {
    onFocus,
    onEnterPress:()=>{
      props.toggle()
    },
    onArrowPress: ( direction ) => {
      if( direction === 'down' || direction === 'up' ){
        props.accordionCloseFn()
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  useEffect( ()=>{
    setFocus( 'ACCORDION_FOCUS_0' )
  }, [] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='Accordion'
        ref={ ref }
        onMouseEnter={ onMouseEnter }
      >
        { title && description &&
        <button
          tabIndex={ keyIndex }
          onClick={ props.toggle }
          className={
            classNames( 'Accordion__title',
              { 'Accordion__title--focused': focused } )
          }
        >
          <div className='Accordion__question'>
            <Text textStyle='faq-heading'>
              { title }
            </Text>
            <Icon className={
              classNames( 'Button__icon', {
                'Button__icon--withIconLeft': true
              } ) }
            name={ props.isOpen ? 'ArrowUp' : 'ArrowDownAccord' }
            />
          </div>

          { props.isOpen && description &&
          <div className='Accordion__description' >
            <Text textStyle='body-5'
              htmlTag='div'
            >
              { description?.split( '\n' )?.map( ( text, index ) => <p key={ text + '_' + index }> { text }</p> ) }
            </Text>
          </div>
          }
        </button>
        }
      </div>
    </FocusContext.Provider>
  )

}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title -sets the title of the accordion
 * @property {string} description -sets the description of the accordion
 * @property {number} keyIndex-sets the keyIndex of the accordion
 */
export const propTypes =  {
  title: PropTypes.string,
  description: PropTypes.string,
  keyIndex: PropTypes.number
};

Accordion.propTypes = propTypes;

export default Accordion;
