import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PackageCard, { propTypes, defaultProps } from './PackageCard';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<PackageCard />tests', () => {
  const mockAppProps = [
    {
      title: 'Hotstar',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'CuriosityStream',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'docubay',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'SunNxt',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'docubay',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    }, {
      title: 'SunNxt',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'Hungama',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'epicOn',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    },
    {
      title: 'Shemaroome',
      image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
      isFocussed: false
    }
  ]

  it( 'renders without crashing', () => {
    render( <BrowserRouter>< PackageCard /></BrowserRouter> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key
      } );
      expect( ( Object.keys( {
        tag: 'Current Plan',
        title: 'Standard',
        titleIcon: 'CrownGoldForward',
        titlePremium: 'Premium',
        appLabel: 'Apps',
        deviceDetails: 'TV, Mobile & Web',
        deviceIcon: 'Devices',
        trialEndDate: 'Free trial ends on 04/05/2022',
        balanceDetails: '₹200 will be deducted from balance on 05/03/2022',
        apps: mockAppProps
      } ) ).map( ( key, index ) => {
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <PackageCard
          tag='Current Plan'
          title='Standard'
          titleIcon='CrownGoldForward'
          titlePremium='Premium'
          appCounts='9 Apps'
          deviceDetails='TV, Mobile and Web'
          deviceIcon='Devices'
          trialEndDate='Free trial ends on 04/05/2022'
          balanceDetails='₹200 will be deducted from balance on 05/03/2022'
          apps={ mockAppProps }
        />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
