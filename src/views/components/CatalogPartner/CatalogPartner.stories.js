import React from 'react';
import CatalogPartner from './CatalogPartner';
import { mockPropsHeroHeader } from './__test_data/mockData';

export default {
  title: 'Organisms/CatalogPartner',
  parameters: {
    component: CatalogPartner,
    componentSubtitle: 'This Catalog page is for Partner consisting of partner title, hero banner and different rails',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps = {}

const Template = ( args )=> (
  <CatalogPartner { ...defaultProps } />
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {}

export const Playground = Template.bind( {} );
Playground.args = {
  title: 'properCase Component'
};
