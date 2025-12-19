/**
 * A modal window is a graphical control element subordinate to an application&amp;#x27;s main window. It creates a mode that disables the main window but keeps it visible, with the dialog window as a child window in front of it
 *
 * @module views/components/Modal
 * @memberof -Common
 */
import React, { forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import './Modal.scss';
import Confetti from '../Confetti/Confetti';
import { keyCodeForBackFunctionality } from '../../../utils/util';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';

export const detectDialogState = ( [openMutation] ) => {
  if( openMutation.oldValue === null ){
    // Setting the current scroll position to body
    global.document.body.style.top = `-${global.scrollY}px`;
    global.document.body.classList.add( 'modal-blocked' );
  }
  else {
    const scrollY = global.document.body.style.top;
    global.document.body.classList.remove( 'modal-blocked' );
    global.document.body.style.top = '';
    // Restoring the scroll positon which was set earlier
    if( global.screenTop ){
      global.scrollTop = parseInt( scrollY || '0', 10 ) * -1;
    }
  }
};

const Modal = forwardRef(
  ( { children, opener, modalAlign, closeModalFn, isVideoModal, callBackFunc, videoMeta, customClassName, customWrapperClass, showConfetti, onConfettiComplete, zeroAppsPlanCloseQrCode }, modalRef ) => {
    const ref = modalRef;
    const { screenSaverVisible } = useMaintainPageState()
    if( typeof HTMLDialogElement !== 'function' ){
      import( 'dialog-polyfill' ).then( ( { default: { registerDialog } } ) =>
        registerDialog( ref.current )
      );
    }

    const onKeyPress = useCallback( ( { keyCode } ) => {
      if( keyCodeForBackFunctionality( keyCode ) ){
        if( screenSaverVisible.current ){
          return null;
        }
        closeModalFn && closeModalFn()
        zeroAppsPlanCloseQrCode && zeroAppsPlanCloseQrCode()
      }
    }, [screenSaverVisible] );

    useEffect( () => {
      window.addEventListener( 'keydown', onKeyPress );
      return () => window.removeEventListener( 'keydown', onKeyPress );
    }, [] );


    useEffect( () => {
      const dialogObserver = new MutationObserver( detectDialogState );
      dialogObserver.observe( ref.current, {
        attributeFilter: ['open'],
        attributeOldValue: true
      } );

      if( ref.current ){
        ref.current.onclose = ( e ) => {
          opener?.current?.focus();
          if( callBackFunc ){
            callBackFunc();
          }
        };
      }
      document.onclick = ( e ) => {
        // This prevents issues with forms
        if( e.target.tagName !== 'DIALOG' ){
          return;
        }
        const rect = e.target.getBoundingClientRect();

        const clickedInDialog =
           rect.top <= e.clientY &&
           e.clientY <= rect.top + rect.height &&
           rect.left <= e.clientX &&
           e.clientX <= rect.left + rect.width;

        if( clickedInDialog === false ){
          // ..
        }
      };
    }, [] );


    return createPortal(
      <div
        className={ classNames( 'Modal__wrapper', {
          ...( customWrapperClass && { [`${customWrapperClass}`]: customWrapperClass } )
        } ) }
        role='dialog'
        aria-modal='true'
      >
        <dialog
          ref={ ref }
          className={ classNames( `Modal`, {
            ...( modalAlign && { [`Modal--${modalAlign}`]: modalAlign } ),
            ...( isVideoModal && { [`Modal--modalVideo`]: isVideoModal } ),
            ...( customClassName && { [`${customClassName}`]: customClassName } )
          } ) }
          {
            ...( videoMeta ? { style: { width: `${ videoMeta.width }px`, height: `${ videoMeta.height }px` } } : {} )
          }
        >
          { showConfetti && <Confetti onConfettiComplete={ ()=> onConfettiComplete() } /> }
          <form method='dialog'>
            { children }
          </form>


        </dialog>
      </div>,
      document.body
    )
  }
);

export default Modal;
