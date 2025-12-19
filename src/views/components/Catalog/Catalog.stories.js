import React from 'react';
import Catalog from './Catalog';
import { mockPropsRails } from './__test_data/mockData';

export default {
  title: 'Organisms/Catalog',
  parameters: {
    component: Catalog,
    componentSubtitle: 'The Catalog page shows various genre or languages etc, consisting of Banner and rails.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <Catalog { ...args } />
);

const defaultProps = {}

export const BasicUsage = Template.bind( {} );
BasicUsage.args = { ...defaultProps }

export const Playground = Template.bind( {} );
Playground.args = { ...defaultProps }
