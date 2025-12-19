import React from 'react';
import PropTypes from 'prop-types';
import PITitle, { propTypes } from './PITitle';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  iconImage: 'ErosNowLoop',
  cardTitle: 'Barot House',
  year:'2021',
  category:['Sci-fi'],
  ageLimit :'18+',
  partnerSubscriptionType: 'premium',
  provider: 'mxplayer',
  nonSubscribedPartnerList: [
    {
      'partnerId': '18',
      'partnerName': 'mxplayer',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1659428200/tatasky-uat/cms-ui/images/custom-content/1659428198654.png',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '21',
      'partnerName': 'apple',
      'iconUrl': 'https://tatasky-staging.s3.ap-south-1.amazonaws.com/cms-ui/images/custom-content/1653913685501',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '2',
      'partnerName': 'Prime',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
      'included': false,
      'starterPackHighlightApp': false
    },
    {
      'partnerId': '2',
      'partnerName': 'Prime',
      'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
      'starterPackHighlightApp': false
    }
  ]
};

describe( '<PITitle />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <PITitle { ...mockProps } />
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        iconImage: 'ErosNowLoop',
        cardTitle: 'Barot House',
        year:'2021',
        category:['Sci-fi'],
        ageLimit :'18+',
        partnerSubscriptionType: 'premium',
        provider: 'mxplayer',
        nonSubscribedPartnerList: [
          {
            'partnerId': '18',
            'partnerName': 'mxplayer',
            'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1659428200/tatasky-uat/cms-ui/images/custom-content/1659428198654.png',
            'included': false,
            'starterPackHighlightApp': false
          },
          {
            'partnerId': '21',
            'partnerName': 'apple',
            'iconUrl': 'https://tatasky-staging.s3.ap-south-1.amazonaws.com/cms-ui/images/custom-content/1653913685501',
            'included': false,
            'starterPackHighlightApp': false
          },
          {
            'partnerId': '2',
            'partnerName': 'Prime',
            'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
            'included': false,
            'starterPackHighlightApp': false
          },
          {
            'partnerId': '2',
            'partnerName': 'Prime',
            'iconUrl': 'https://res.cloudinary.com/uat-main/image/upload/v1623317994/tatasky-uat/cms-ui/images/custom-content/1623317993066.png',
            'starterPackHighlightApp': false
          }
        ]
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( PITitle.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly AccountCard', () => {
      const modalComponent = mountSnapShot(
        <PITitle { ...mockProps } /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
