import React, { useRef } from 'react';
import PIDetails from './PIDetails';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Organisms/PIDetails',
  parameters: {
    component: PIDetails,
    componentSubtitle: 'Component for displaying detailed info about the media content i.e Detailed Program Info, Starrer, Director, Producer and content subtitles',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const mockprops = {
  title: 'Barot House',
  backtitle:'To Close',
  description: `In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply. In a post-apocalyptic wasteland, Max, a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply. a drifter and survivor, unwillingly joins Imperator Furiosa, a rebel warrior, in a quest to overthrow a tyrant who controls the land's water supply.  `,
  starring:{
    title: 'Starring',
    details: ['Chris Pratt', 'Bryce Dallas', 'Nick', 'Robinson Timothy Kennedy']
  },
  director: {
    title: 'Director',
    details: ['Colin Trevorrow']
  },
  producers: {
    title: 'Producers',
    details: ['Patrick Crowley', 'Frank Marshall']
  },
  subtitles: {
    title: 'Subtitles',
    details: ['English', 'Hindi']
  }
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
        <PIDetails
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