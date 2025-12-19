import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MultiLanguageList, { propTypes, defaultProps } from './MultiLanguageList';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

const records = [
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
const mockProps = {
  languageList: records,
  title: 'Select Video Language',
  btnLabel: 'Proceed',
  disabled: false
}
describe( '<MultiLanguageList />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( <MultiLanguageList { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const props = {
        languageList: PropTypes.arrayOf(
          PropTypes.shape( {
            bgImg: PropTypes.string,
            letterImg: PropTypes.string,
            title: PropTypes.string,
            isChecked: PropTypes.bool
          } )
        ),
        title: PropTypes.string,
        disabled: PropTypes.bool
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
    } );

    it( 'an instance of MultiLanguageList should have the proper propTypes set', () => {
      expect( MultiLanguageList.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <MultiLanguageList { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
