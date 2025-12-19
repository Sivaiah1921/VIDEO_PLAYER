import React, { useRef } from 'react';
import AutoPlayTrailer from './AutoPlayTrailer';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Organisms/AutoPlayTrailer',
  parameters: {
    component: AutoPlayTrailer,
    componentSubtitle: 'Component for displaying detailed info about the AutoPlayTrailer ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockprops = {
  iconName: 'AutoplayTrailer80x80',
  authorization: 'TJ0hANNwZ59Pkh6Yr8hCbQDwU7U7b5pr',
  deviceId: 'e6yPwUJ2RusXKQhF1dOOOWGd7cN0DfSr',
  subscriberId: '3001581564',
  profileId: 'baecf8e3-f47b-45cb-b308-39312f7e2a14',
  baId: '5000204193'
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
        <AutoPlayTrailer
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