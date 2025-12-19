import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MediaCard, { propTypes, defaultProps } from './MediaCard';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  type: 'landscape',
  size: 'small',
  title: 'Road To Sangam',
  image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h',
  provider: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_auto,h_68/https://res.cloudinary.com/uat-main/image/upload/v1622719518/tatasky-uat/cms-ui/images/custom-content/1622719517901.png',
  indicator: '40',
  timeBlock: '30m',
  freeEpisodesAvailable: false,
  contractName: 'RENTAL',
  partnerSubscriptionType: 'premium',
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
  ],
  providerName: 'mxplayer'
}
describe( '<MediaCard />tests', () => {
  it( 'renders without crashing', () => {
    jestutils.mountWithRouter( < MediaCard { ...mockProps }/> );
  } );

  describe( 'Properties', () => {
    it( 'should only have these proptypes and values', () => {
      const props = {
        type: PropTypes.oneOf( [
          'landscape',
          'portrait'
        ] ),
        size: PropTypes.oneOf( [
          'small',
          'large',
          'top10'
        ] ),
        image: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string,
        onFocus: PropTypes.func,
        provider: PropTypes.string,
        timeBlock: PropTypes.string,
        indicator: PropTypes.string,
        onClick: PropTypes.func,
        episodeTitle: PropTypes.string,
        freeEpisodesAvailable: PropTypes.bool,
        contractName: PropTypes.string,
        partnerSubscriptionType: PropTypes.string,
        nonSubscribedPartnerList: PropTypes.array,
        providerName: PropTypes.string
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of ProductRail should have the proper propTypes set', () => {
      expect( MediaCard.propTypes ).toBe( propTypes );
    } );

    it( 'an instance of ProductRail should have the proper defaultProps', () => {
      expect( MediaCard.defaultProps ).toBe( defaultProps );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <MediaCard { ...mockProps } />
      </BrowserRouter>
    );
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
