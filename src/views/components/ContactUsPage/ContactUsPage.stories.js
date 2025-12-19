/* eslint-disable no-console */
import React from 'react';
import ContactUsPage from './ContactUsPage';

export default {
  title: 'Molecules/ContactUsPage',
  parameters: {
    component: ContactUsPage,
    componentSubtitle: 'This component will provide contact information',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height':'100vh', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <ContactUsPage { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  icon: 'Contact',
  title: 'Contact Us',
  infoText:  'Call or Email us directly to speak with Customer Care representative.',
  email:  'help@tatasky.coom',
  telephone: `1800 208 6633`,
  emailText: 'Email : ',
  telephoneText: 'Telephone : ',
  helpLinkTitle: 'Helpful Links ',
  helpText: 'Please visit tataplaybinge.com for help. We will be happy to assist you there. ',
  btnTitleFAQ: 'FAQs',
  btnTitleTerms: 'Terms of Use',
  onClick: () => console.log(),
  onClickFAQ: () => console.log()
}
