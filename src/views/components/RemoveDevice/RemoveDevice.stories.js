import React, { useRef } from 'react';
import RemoveDevice from './RemoveDevice';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Organisms/RemoveDevice',
  parameters: {
    component: RemoveDevice,
    componentSubtitle: 'Component for displaying detailed info about the RemoveDevice ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockprops = {
  content:'Are you sure you want to remove Briju’s Iphone?',
  iconName: 'RemovePhone',
  buttonLabel:'Yes, Remove Device',
  backButton: 'To Close'
}

const Template = ( args )=> {
  const modalRef = useRef();
  const buttonRef = useRef();
  const openModal = () => {
    modalRef.current?.showModal();
  };
  const hideModal = () => {
    modalRef.current.close();
  };
  return (
    <BrowserRouter>
      <div>
        <button
          onClick={ openModal }
          ref={ buttonRef }
        >
          Open Modal
        </button>
        <RemoveDevice
          modalRef={ modalRef }
          handleCancel={ hideModal }
          opener={ buttonRef }
          { ...args }
        />
      </div>
    </BrowserRouter>
  )
};

export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...mockprops }