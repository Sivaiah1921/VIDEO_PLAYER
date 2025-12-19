import React from 'react';
import LanguageList from './LanguageList';

export default {
  title: 'Molecules/LanguageList',
  parameters: {
    component: LanguageList,
    componentSubtitle: 'This component provides the list of languages can be supported for the program',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <LanguageList { ...args } />
  </div>

);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  LanguageList: ['English', 'Hindi', 'Tamil', 'Bengali']
}
