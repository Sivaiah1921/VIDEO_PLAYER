/**
 * This component will show TermsOfUse information page
 *
 * @module views/components/TermsOfUse
 * @memberof -Common
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TermsOfUse.scss';
import Button from '../../components/Button/Button';
import Icon from '../Icon/Icon';
import Divider from '../Divider/Divider';
import Text from '../Text/Text';
import TSMoreService from '../../../utils/slayer/TSMoreService';
import parse from 'html-react-parser';
import { PLAYER, constants } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import Loader from '../Loader/Loader';
import { term_condition, term_privacy_policy } from '../../../utils/mixpanel/mixpanelService';
/**
  * Represents a TermsOfUse component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns TermsOfUse
  */
const TermsoFUseContent = ( { tSMoreDetails, handleScroll } ) => {
  const scrollRef = useRef( null )
  const initRef = useRef( 1 )

  const html = parse( '' + tSMoreDetails?.content );


  const onKeyPress = useCallback( ( { keyCode } ) => {
    const toTalHeight = document.querySelector( '.TermsOfUse__leftPanel' )?.clientHeight
    const el =  document.querySelector( '.TermsOfUse__contentScroll' )
    if( keyCode === PLAYER.UP ){
      if( initRef.current >= 10 ){
        initRef.current = initRef.current - document.querySelector( '.TermsOfUse__content' ).clientHeight + 300
        if( el ){
          el.scrollTop = initRef.current
        }
        handleScroll( toTalHeight, initRef.current )
      }
    }
    if( keyCode === PLAYER.DOWN ){
      if( initRef.current <= toTalHeight ){
        initRef.current = initRef.current + document.querySelector( '.TermsOfUse__content' ).clientHeight - 300
        if( el ){
          el.scrollTop = initRef.current
        }
        handleScroll( toTalHeight, initRef.current )
      }
    }
  } );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => window.removeEventListener( 'keydown', onKeyPress );
  }, [] );

  return (
    <div
      ref={ scrollRef }
      className='TermsOfUse__contentScroll'
    >
      <div
        className='TermsOfUse__leftPanel'
      >
        { html }
      </div>
    </div>
  )
}
export const TermsOfUse = function( props ){
  const history = useHistory();
  const [arrowDown, setArrowDown] = useState( false );
  const { tSMoreLoading, tSMoreError, tSMoreResponse } = TSMoreService();
  const tSMoreDetails = tSMoreResponse?.data?.terms;

  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary:true
  } );

  useEffect( () => {
    /* Mixpanel-events */
    term_condition();
    term_privacy_policy()
  }, [] )

  useEffect( () => {
    focusSelf()
  }, [focusSelf] );

  const handleScroll = ( event, initValue ) => {
    initValue > 2 ? setArrowDown( true ) : setArrowDown( false )
  };

  const MouseWheelHandler = ( e ) => {
    const event = window.event || e;
    const delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
    delta >= 1 ? setArrowDown( true ) : setArrowDown( false )
    return false;
  }

  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )

  return (
    <div ref={ ref }>
      { tSMoreLoading ? <Loader /> : (
        <>
          <div className='TermsOfUse'>
            <FocusContext.Provider value={ focusKey }>
              <div className='TermsOfUse__header'>
                <Button
                  onClick={ ()=> history.goBack() }
                  iconLeftImage='GoBack'
                  iconLeft={ true }
                  secondary={ true }
                  label={ constants.TOCLOSE }
                />
                <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
              </div>
              <div className='TermsOfUse__title'>
                <Text
                  textStyle='title-2'
                  htmlTag='span'
                >
                  { tSMoreDetails?.title }
                </Text>
              </div>
              <div className='TermsOfUse__content'>

                <TermsoFUseContent tSMoreDetails={ tSMoreDetails }
                  handleScroll={ handleScroll }
                />

                <div className='TermsOfUse__rightPanel'>
                  <Divider vertical={ true } />
                  <Icon name='ArrowDown'
                    className={
                      classNames( {
                        'TermsOfUse__arrowDownRotate180': arrowDown
                      } )
                    }
                  />
                </div>
              </div>
            </FocusContext.Provider>
          </div>
          <div className='TermsOfUse__background'></div>
        </>
      ) }
    </div>
  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} title - provides the TermsOfUse title
  * @property {string} headercontent - provides TermsOfUse content
  * @property {string} bodycontent - provides TermsOfUse content
  */
export const propTypes =  {
  title: PropTypes.string,
  headercontent: PropTypes.string,
  bodycontent: PropTypes.string
};


TermsOfUse.propTypes = propTypes;
export default TermsOfUse;
