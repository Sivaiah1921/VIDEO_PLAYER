import React, { useRef } from 'react';
import NotificationsPopUp from './NotificationsPopUp';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Organisms/NotificationsPopUp',
  parameters: {
    component: NotificationsPopUp,
    componentSubtitle: 'This component is used to show various notification popup messages. This consists of message and done button.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockProps = {
  iconName : 'Success',
  message: 'Plan Renewal Successful',
  info: 'Your plan has been renewed from Standard (monthly) to Premium (monthly)',
  additionalInfo: 'You will be charged 200 from 01/05/2022',
  buttonLabel: 'Done'
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
          Open Notification Modal
        </button>
        <NotificationsPopUp
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

export const BasicUsageForAlert = Template.bind( {} );
BasicUsageForAlert.args = {
  iconName: 'Alert',
  message: 'We are sad to see you go!',
  info: 'If you cancel your plan, you will loose all the content viewing benefits from different apps.',
  additionalInfo: 'Plan cancellation will be effective from 05/09/2022',
  buttonLabel: 'Yes, Cancel Plan',
  backButton: 'To Close',
  backIcon: 'GoBack'
}

export const BasicUsageForPlanCancellationScheduled = Template.bind( {} );
BasicUsageForPlanCancellationScheduled.args = {
  iconName: 'Success',
  message: 'Plan Cancellation Scheduled',
  info: 'You plan cancellation request has been scheduled and will be cancelled after the your current billing cycle.',
  additionalInfo: 'Plan cancellation will be effective from 05/09/2022',
  buttonLabel: 'Done'
}

export const BasicUsageForAutoRenewal = Template.bind( {} );
BasicUsageForAutoRenewal.args = {
  iconName: 'AutoRenewal',
  message: 'A link has been sent to your Registered Mobile Number +9191111167543',
  buttonLabel: 'Done'
}

export const Playground = Template.bind( {} );
Playground.args = { ...mockProps };
