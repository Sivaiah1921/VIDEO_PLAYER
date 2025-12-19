/* eslint-disable no-console */
import React, { useRef } from 'react';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
const { LOGINBTN_NAME } = require( '../../../utils/constants' ).default;

export default {
  title: 'Molecules/LoginForm',
  parameters: {
    component: LoginForm,
    componentSubtitle: 'This component provides the login facility with number keyboard',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> {
  const modalRef = useRef();
  const buttonRef = useRef();
  const openModal = () => {
    modalRef.current.showModal();
  };
  const hideModal = () => {
    modalRef.current.close();
  };

  return (
    <BrowserRouter>
      <div style={ { 'height':'100vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
        <LoginForm
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
BasicUsage.args = {
  openModal: () => {
    modalRef.current.showModal();
  },
  onChange: a => console.log( a ),
  clearBtnLabel: 'Clear',
  deleteBtnLabel: 'Delete',
  onClear:  a => console.log( a ),
  onRemove:  a => console.log( a ),
  mobInputLabel: 'Enter Registered Mobile Number',
  loginTitle: 'Login',
  proceedBtnLabel: 'I accept the  ',
  proceedBtnLabel2: 'Terms and Conditions',
  prefixValue: '+91',
  btnLabel: LOGINBTN_NAME,
  disabled: true,
  value: '',
  content:'Login form',
  modaltitle:'Terms & Conditions'
}


