import React from 'react';
import Image from './Image';

export default {
  title: 'Atoms/Image',
  parameters: {
    component: Image,
    componentSubtitle: 'The Image component is used to display an image. Alt text, width, height and src values can be passed as props.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args ) => (
  <Image { ...args } />
)

export const ImageBasicUsage = Template.bind( {} );
ImageBasicUsage.args = {
  alt: 'Basic usage image',
  width: 200,
  height: 200,
  src: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_620,h_824/https://zee5xiomipic.zee5.com/resources/0-6-1634/passport/750x1000/061634list73362374.jpg?impolicy=zee5xiomipic_zee5_com-IPM',
  ariaLabel: 'Image',
  isBackground: false
}

export const Playground = Template.bind( {} );
Playground.args = {
  ...ImageBasicUsage.args,
  isBackground: false
};