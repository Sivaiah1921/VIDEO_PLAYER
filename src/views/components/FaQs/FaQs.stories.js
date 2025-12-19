import React from 'react';
import FaQs from './FaQs';

export default {
  title: 'Organisms/FaQs',
  parameters: {
    component: FaQs,
    componentSubtitle: 'FAQs page is used to see frequently asked questions and their answers. This consists of various accordion style question and answer cards.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'padding': '1rem', 'height':'100vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <FaQs { ...args } />
  </div>
);

const defaultProps =  {
  title: 'FAQs',
  questions: [
    {
      title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
    },
    {
      title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
    },
    {
      title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
    },
    {
      title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
    },
    {
      title: 'Can I download movies or TVs or watch content in offline mode in Tata Sky Binge?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
    }
  ]
}


export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps };

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps };

