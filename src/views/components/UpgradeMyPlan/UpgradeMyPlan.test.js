import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UpgradeMyPlan, { propTypes, defaultProps } from './UpgradeMyPlan';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<UpgradeMyPlan />tests', () => {
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
  ];

  it( 'renders without crashing', () => {
    render( < UpgradeMyPlan /> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        upgradeMyPlanTitle: 'My Plan',
        upgradeMyPlanType: 'Standard',
        upgradeMyPlan: '₹200/month',
        upgradeMyPlanExpire: 'Expires on 20/05/2022',
        apps: mockAppProps
      };
      jestutils.testProps( ( testObj, key, val ) => {
        PropTypes.checkPropTypes( propTypes, testObj, key, val )
        expect( Object.keys( propTypes ) ).toContain( key );
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( UpgradeMyPlan.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        < UpgradeMyPlan
          upgradeMyPlanTitle='My Plan'
          upgradeMyPlanType='Standard'
          upgradeMyPlan='₹200/month'
          upgradeMyPlanExpire='Expires on 20/05/2022'
          apps={ mockAppProps }
        />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
