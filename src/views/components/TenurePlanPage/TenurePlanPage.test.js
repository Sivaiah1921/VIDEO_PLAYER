import React from 'react';
import PropTypes from 'prop-types';
import TenurePlanPage, { propTypes } from './TenurePlanPage';
import * as jestutils from '../../../utils/jest/jest';
import { BrowserRouter } from 'react-router-dom';

const consoleErrorSpy = jest.spyOn( console, 'error' );
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
    title: 'Hotstar',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  },
  {
    title: 'Shemaroome',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  }
  ,
  {
    title: 'epicOn',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  },
  {
    title: 'CuriosityStream',
    image: 'https://res.cloudinary.com/tatasky/image/fetch/f_auto,fl_lossy,q_auto,w_180,h_180/https://res.cloudinary.com/uat-main/image/upload/v1643717596/tatasky-uat/cms-ui/images/custom-content/1643717595748.png',
    isFocussed: false
  }
]
const records = [
  {
    icon : 'Monthly',
    plan: 'Monthly',
    amount:  '₹350',
    savings:''
  },
  {
    icon : 'Quarterly',
    plan: 'Quarterly',
    amount:  '₹600',
    savings:'15%'
  },
  {
    icon : 'Yearly',
    plan: 'Yearly',
    amount:  '₹1350',
    savings:'25%'
  }
]

const mockProps = {
  headTitle:'Select Tenure',
  title: 'Premium',
  apps: mockAppProps,
  records: records
};

jest.mock( 'react-router-dom', () => ( {
  ...jest.requireActual( 'react-router-dom' ),
  useParams: () => ( {
    productId: 'mega',
    type: 'TENURE'
  } )
} ) );

describe( '<TenurePlanPage />tests', () => {

  it( 'renders without crashing', () => {
    render( <BrowserRouter> < TenurePlanPage { ...mockAppProps } /></BrowserRouter> );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        headTitle:'Select Tenure',
        title: 'Premium',
        apps: mockAppProps,
        records: records
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( TenurePlanPage.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly TenurePlanPage ', () => {
      const modalComponent = mountSnapShot(
        < TenurePlanPage { ...mockProps } /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
