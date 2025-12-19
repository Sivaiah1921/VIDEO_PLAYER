import React from 'react';
import MultiLanguageList from './MultiLanguageList';

export default {
  title: 'Molecules/MultiLanguageList',
  parameters: {
    component: MultiLanguageList,
    componentSubtitle: 'This component gives language list of program',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const defaultProps = [
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'English',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Hindi',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Panjabi',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Tamil',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Bengali',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Marathi',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Odia',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Malayalam',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Kannada',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Bhojpuri',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Telugu',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  },
  {
    bgImg: 'https://res.cloudinary.com/uat-main/image/upload/v1646214191/tatasky-uat/cms-ui/images/custom-content/1646214190687.jpg',
    letterImg: 'https://res.cloudinary.com/uat-main/image/upload/v1652176956/tatasky-uat/cms-ui/images/custom-content/1652176951897.png',
    title: 'Gujrati',
    isChecked: false,
    value: 'yes',
    onSelected: ( language ) => {
      console.log( language ) // eslint-disable-line
    }
  }

]

const Template = ( args )=> (
  <div style={ { 'width':'1280px', 'padding': '1rem', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <MultiLanguageList { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  languageList: defaultProps,
  title: 'Select Video Language',
  btnLabel: 'Proceed',
  disabled: false
}

