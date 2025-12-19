import React, { useRef } from 'react';
import QrCodePopUp from './QrCodePopUp';
import { BrowserRouter } from 'react-router-dom';


export default {
  title: 'Organisms/QrCodePopUp',
  parameters: {
    component: QrCodePopUp,
    componentSubtitle: 'This component is used to show the QR popup where we can scan the QR',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockProps = {
  url:'https://www.google.com/',
  size:'136',
  goBack:'Go Back',
  heading:'Scan QR Code To Recharge',
  info:'Your current balance is 100. Need a minimal balance of 600.',
  additionalInfo:'In case post recharge, your balance does not update, then please refresh your balance from My Plan page.'
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
        <QrCodePopUp
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
BasicUsage.args = { ...mockProps }

export const Playground = Template.bind( {} );
Playground.args = { ...mockProps }
