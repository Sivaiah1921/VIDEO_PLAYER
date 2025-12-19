import React from 'react';
import Carousel from './Carousel';

export default {
  title: 'Molecules/Carousel',
  parameters: {
    component: Carousel,
    componentSubtitle: 'The Image component is used to display Image.Alt, Width, Height and src values can also be passed as props for specific Alt,Width,Height and Src.',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> {
  return (
    <Carousel { ...args } />
  )
}



export const carousel = Template.bind( {} );

const carouselItems = [{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1653184194814'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1652986972915'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1652867520937'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1651662604896'
},
{
  altText: 'Basic usage image',
  ImageSrc: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_2550,h_850/https://tatasky-production-cms.s3.amazonaws.com/cms-ui/images/custom-content/1651662652867'
}];

carousel.args = {
  items: carouselItems,
  isLinearGradient: true,
  spacerValue: '01'
}

carousel.argTypes = {
  spacerValue: {
    control: 'select',
    options: ['00', '01', '02', '03', '04', '05', '06', '07', '08']
  }
}



