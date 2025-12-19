import React from 'react';
import TermsOfUse from './TermsOfUse';

export default {
  title: 'Organisms/TermsOfUse',
  parameters: {
    component: TermsOfUse,
    componentSubtitle: 'This component will show TermsOfUse information page',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <TermsOfUse { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  title: 'Terms of Use',
  headercontent:'What information does Tata Sky Binge collect ?',
  bodycontent: 'We collect information relating to you that you have provided to us (for example, on an application or registration form, when you enter a competition or promotion sponsored by us or through the way you use our products and services) or that we may have obtained from another source (such as our suppliers or from marketing organisations and credit agencies). Where possible, we will collect the information directly from you. However the method of collecting this information may vary depending on which one of our services you are using (for example our mobile services or our internet services).This information may include, your name, address, telephone numbers, information on how you use our products and services (such as the type, date, time, location and duration of calls or messages, the numbers you call, how much you spend, and information on you and the browsing and viewing activity that happens while you use internet services (including the internet sites and pages visited, your Internet Protocol (IP) address and the dates and times you or anyone using your internet services logs on and off, and the channels accessed through your TV services with us)), the location of your mobile phone, lifestyle information and any other information collected in relation to your use of our products and services. This information may be held by us while you are using our services and for a period of time afterwards, but only for so long as we are legally entitled to use the information in accordance with this Privacy Policy.We may also monitor and record your calls to us and our calls to you.'
}

