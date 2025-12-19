import React, { useRef } from 'react';
import Modal from './Modal';


export default {
  title: 'Atoms/Modal',
  parameters: {
    component: Modal,
    componentSubtitle: 'The Modal component is a graphical control element subordinate to an application&apos;s main window. It creates a mode that disables the main window but keeps it visible, with the modal window as a child window in front of it.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

export const BasicUsage = ( args ) => {
  const modalRef = useRef();
  const buttonRef = useRef();
  const openModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div>
      <button
        onClick={ openModal }
        ref={ buttonRef }
      >
        Open Modal
      </button>
      <Modal ref={ modalRef }
        opener={ buttonRef }
        { ...args }
      >
        <div>
          <h1 style={ { 'text-align': 'center' } }>Sample Modal</h1>
          <h3>This is subtitle</h3>
          <p>In 1920, fate brings together two revolutionaries fighting their individual battles against the British empire far away from home.</p>
          <h3>Starring:</h3>
          <p>N.T. Rama Rao Jr. | Ram Charan | Ajay Devgn | Alia Bhatt | Olivia Morris | Shriya Saran</p>
        </div>
      </Modal>
    </div>
  )
}

