/**
 * Component for displaying detailed info about the media content i.e Detailed Program Info, Starrer, Director, Producer and content subtitles
 *
 * @module views/components/PIDetails
 * @memberof -Common
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
import classNames from 'classnames';
import Button from '../Button/Button';
import './PIDetails.scss';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';

const RoleComponent = role => {
  return (
    <>
      <Text textStyle='subtitle-2'>
        { role.title }
      </Text>
      <div className={ `PIDetails__${role}--details` }>
        {
          role.details?.map( ( el, idx ) => (
            <Text
              key={ idx }
              htmlTag='span'
              textStyle='subtitle-2'
            >
              { idx ? ' | ' + el : el }
            </Text>
          )
          ) }
      </div>
    </>
  )
}

const PIDeatilsContent = ( { description, title, starring, director, producers, subtitles, audio, setArrowDown, focusKeyRefrence, scrollBar } ) => {
  const scrollRef = useRef( null )
  const initScrollValueRef = useRef( 0 )
  const totalScrollValueRef = useRef( 0 )

  const { ref, focused } = useFocusable( {
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onArrowPress:( direction )=>{
      handleScroll( direction )
    }
  } );

  const handleScroll = ( direction ) => {
    if( scrollRef.current ){
      const el = document.querySelector( '.PIDetails__left' )
      const contentTotalHeight = scrollRef.current.scrollHeight
      const contentViewPortHeight = scrollRef.current.clientHeight

      if( direction === 'up' ){
        if( contentTotalHeight === contentViewPortHeight ){
          return false
        }
        if( el && initScrollValueRef.current > 0 ){
          initScrollValueRef.current = initScrollValueRef.current - 40
          el.scrollTop = initScrollValueRef.current
          totalScrollValueRef.current = totalScrollValueRef.current - 40
        }
      }
      if( direction === 'down' ){
        if( contentTotalHeight === contentViewPortHeight ){
          return false
        }
        if( el && totalScrollValueRef.current < contentTotalHeight ){
          initScrollValueRef.current = initScrollValueRef.current + 40
          el.scrollTop = initScrollValueRef.current
          totalScrollValueRef.current = contentViewPortHeight + initScrollValueRef.current
        }
      }
      initScrollValueRef.current > 40 ? setArrowDown( true ) : setArrowDown( false )
    }
  };

  const MouseWheelHandler = ( e ) => {
    const deltaY = e.deltaY;
    let scrollMoment = ''

    if( deltaY > 0 ){
      scrollMoment = 'down'
    }
    else if( deltaY < 0 ){
      scrollMoment = 'up'
    }
    handleScroll( scrollMoment )
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler )
    }
  }, [] )

  return (
    <div ref={ ref }
      className={ focused && 'PIDetails__leftwithFocus' }
    >
      <div
        className={
          classNames( 'PIDetails__left',
            { 'PIDetails__left--withNoScrollBar': !scrollBar
            } )
        }
        // onScroll={ handleScroll }
        ref={ scrollRef }
      >
        { title &&
        <div className='PIDetails__title'>
          <Text
            textAlign='left'
            textStyle='title-2'
          >
            { title }
          </Text>
        </div> }
        { description &&
        <div className='PIDetails__description'>
          <Text
            textAlign='left'
            textStyle='subtitle-2'
          >
            { description }
          </Text>
        </div>
        }
        { starring.details && starring.details.filter( ( str ) => str !== '' ).length > 0 &&
        <div className='PIDetails__starring'>
          { RoleComponent( starring ) }
        </div>
        }
        { director.details && director.details.filter( ( str ) => str !== '' ).length > 0 &&
        <div className='PIDetails__director'>
          { RoleComponent( director ) }
        </div>
        }
        { producers.details && producers.details.filter( ( str ) => str !== '' ).length > 0 &&
        <div className='PIDetails__producers'>
          { RoleComponent( producers ) }
        </div>
        }
        { subtitles.details && subtitles.details.filter( ( str ) => str !== '' ).length > 0 &&
        <div className='PIDetails__subtitles'>
          { RoleComponent( subtitles ) }
        </div> }
        { audio.details && audio.details.filter( ( str ) => str !== '' ).length > 0 &&
        <div className='PIDetails__audios'>
          { RoleComponent( audio ) }
        </div> }
      </div>

    </div>
  )
}

/**
  * Represents a PIDetails component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns PIDetails
  */

export const PIDetails = function( props ){
  const { title, backtitle, description, starring, director, producers, subtitles, audio } = props;
  const [isScrollBar, setScrollBar] = useState( false );
  const [arrowDown, setArrowDown] = useState( false );

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );


  useEffect( ()=>{
    setTimeout( ()=> setFocus( 'MODAL_CONTENT' ), 100 )
  }, [] )

  useEffect( ()=>{
    const modalHeight = document.querySelector( '.PIDetails__description > p' )?.offsetHeight;
    if( modalHeight > 560 ){
      setScrollBar( true );
    }
    else {
      setScrollBar( false );
    }
  }, [document.querySelector( '.PIDetails__description > p' )] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='PIDetails'
        ref={ ref }
      >
        <Modal
          id='PIModalId'
          customClassName='PIModal'
          ref={ props.modalRef }
          opener={ props.opener }
          closeModalFn={ props.handleCancel }
        >

          <div className='PIDetails__content'>

            <PIDeatilsContent
              description={ description }
              title={ title }
              backtitle={ backtitle }
              starring={ starring }
              director={ director }
              producers={ producers }
              subtitles={ subtitles }
              audio={ audio }
              setArrowDown={ setArrowDown }
              focusKeyRefrence={ 'MODAL_CONTENT' }
              scrollBar={ isScrollBar }
            />
            { isScrollBar &&
            <div className='PIDetails__right'>
              <Divider vertical={ true } />
              <Icon name='ArrowDown'
                className={
                  classNames( 'PIDetails__arrow',
                    { 'PIDetails__arrowDownRotate180': arrowDown
                    } )
                }
              />
            </div> }
          </div>
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='PIDetails__closeButton' >
              <Button
                label={ backtitle }
                iconLeft={ true }
                iconLeftImage='Path'
                size='medium'
                onClick={ props.handleCancel }
              />
            </div>
          </FocusContext.Provider>
        </Modal>
      </div>
    </FocusContext.Provider>
  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} title - set the starring Ttitle
  * @property {string} description - set the description
  * @property {object} starring - set the starring details
  * @property {object} director - set the director details
  * @property {object} producers - set the producers details
  * @property {object} subtitles - set the subtitles details
  */

export const propTypes =  {
  title: PropTypes.string,
  description: PropTypes.string,
  starring: PropTypes.object,
  director: PropTypes.object,
  producers: PropTypes.object,
  subtitles: PropTypes.object
};

PIDetails.propTypes = propTypes;

export default PIDetails;
