import React from 'react';
import Splash from '../../views/components/Splash/Splash';

export const renderApplication = function( config ){
  const { renderer, targetElementId } = config;

  renderer(
    <Splash config={ config } />,
    document.getElementById( targetElementId ) )
}