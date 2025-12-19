/**
 * FAQs page is used to see frequently asked questions and their answers. This consists of various accordion style question and answer cards.
 *
 * @module views/components/FaQs
 * @memberof -Common
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FaQs.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import Accordion from '../Accordion/Accordion';
import Text from '../Text/Text';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import Button from '../../components/Button/Button';
import { useHistory } from 'react-router-dom';
import { PLAYER, constants, isTizen } from '../../../utils/constants';
import TSMoreService from '../../../utils/slayer/TSMoreService';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Loader from '../Loader/Loader';
import { faq_init, faq_view } from '../../../utils/mixpanel/mixpanelService';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { modalDom } from '../../../utils/util';
/**
 * Represents a FAQs component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns FaQs
 */
export const FaQs = function( props ){
  const history = useHistory();
  const [arrowDown, setArrowDown] = useState( false );
  const [isOpen, setIsOpen] = useState( null );
  const keyPositionRef = useRef( '' )
  const storePrevScrollValue = useRef( null )
  const previousPathName = useNavigationContext()
  const { tSMoreLoading, tSMoreResponse } = TSMoreService();
  const tSMoreDetails = isTizen ? tSMoreResponse?.data?.samsung_faqs : tSMoreResponse?.data?.lg_faqs;

  const { ref, focusKey, focusSelf } = useFocusable( {
    isFocusBoundary:true
  } );

  useEffect( () => {
    /* MixPanel-Event */
    faq_init();
  }, [] )

  useEffect( () => {
    if( !tSMoreLoading && !modalDom() ){
      focusSelf()
    }
  }, [tSMoreLoading] );

  const onKeyPress = useCallback( ( e ) => {
    if( e.keyCode === PLAYER.UP ){
      keyPositionRef.current = 'up'
    }
    else if( e.keyCode === PLAYER.DOWN ){
      keyPositionRef.current = 'down'
    }
  } );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  const onRailFocus = useCallback( ( { y, ...rest }, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_FOCUS_${index}`
    Boolean( index >= 7 || y > 550 ) ? setArrowDown( true ) : setArrowDown( false ); // TODO - handle it ouside of rail focus
    if( ref.current ){
      if( keyPositionRef.current === 'up' ){
        ref.current.scrollTop = y - 210
      }
      else {
        ref.current.scrollTop = y - 210
      }
      storePrevScrollValue.current = y
    }
  }, [ref] );

  const toggleOpen = ( id, question, answer ) => () => {

    if( !isOpen ){
      /* MixPanel-Event */
      faq_view( id, question )
    }
    setIsOpen(
      isOpen => isOpen === id ? null : id,
    );
  }

  const accordionCloseFn = ( ) => {
    setIsOpen( null )
  }

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `ACCORDION_FOCUS_${id}` )
  }

  return (
    <div ref={ ref }>
      { tSMoreLoading ? <Loader /> : (
        <>
          <div className='FaQs'>
            <FocusContext.Provider value={ focusKey }>
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <div className='FaQs__header'>
                  <Button
                    onClick={ ()=> history.goBack() }
                    iconLeftImage='GoBack'
                    iconLeft={ true }
                    secondary={ true }
                    label={ constants.TOCLOSE }
                  />
                  <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
                </div>
              </FocusContext.Provider>
              <div className='FaQs__list'>
                <div className='FaQs__title'>
                  <Text textStyle='header-2'>
                    { tSMoreDetails?.title }
                  </Text>
                </div>
                <div className='FaQs__listContent'>
                  <div
                    ref={ ref }
                    id='scrollContainer'
                    className='FaQs__listScoll'
                  >
                    <InfiniteScroll
                      dataLength={ 1 }
                      scrollableTarget='scrollContainer'
                      style={ {
                        marginBottom: '20rem'
                      } }
                    >
                      { tSMoreDetails?.content.length > 0 && tSMoreDetails?.content.map( ( faq, index ) => (
                        <Accordion
                          title={ faq.question }
                          description={ faq.answer }
                          onFocus={ ( e )=> onRailFocus( e, index ) }
                          isOpen={ isOpen === index }
                          toggle={ toggleOpen( index, faq.question, faq.answer ) }
                          accordionCloseFn={ () => accordionCloseFn( index ) }
                          key={ index }
                          keyIndex={ index }
                          focusKeyRefrence={ `ACCORDION_FOCUS_${index}` }
                          onMouseEnter={ () => onMouseEnterCallBackFn( index ) }
                        />
                      ) )
                      }
                    </InfiniteScroll>
                  </div>
                  { /*
                todo - will reverify once figma is available
                <div className={
                  classNames( { 'FaQs__list--bGcontentTop': arrowDown } )
                }
                ></div>
                <div className='FaQs__list--bGcontentBottom'></div>
                */ }
                </div>
                <div className='FaQs__list--scroll'>
                  <Divider vertical={ true } />
                  <Icon
                    name='ArrowDown'
                    className={
                      classNames( '',
                        { 'FaQs__list--arrowDownRotate180': arrowDown
                        } )
                    }
                  />
                </div>
              </div>
            </FocusContext.Provider>
          </div>
          <div className='FaQs__background'></div>
        </>
      ) }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - sets the tile of the page
 * @property {array} questions - sets the questions' title and description for the FAQ
 */
export const propTypes =  {
  title: PropTypes.string,
  questions: PropTypes.array
};

FaQs.propTypes = propTypes;

export default FaQs;
