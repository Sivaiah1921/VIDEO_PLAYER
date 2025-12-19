import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ComboPack, { propTypes } from './ComboPack';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';


const consoleErrorSpy = jest.spyOn( console, 'error' );

describe( '<ComboPack />tests', () => {
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
    }
  ]

  it( 'renders without crashing', () => {
    render( <BrowserRouter>< ComboPack /></BrowserRouter> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) => {
        return key
      } );
      expect( ( Object.keys( {
        comboPackTitle: 'My Plan',
        comboPackSubTitle: 'Malyalam Hindi English Basic HD',
        amountValue: '&#8377;299/month',
        comboPlanExpire: 'Renewal on 20/05/2020',
        hdText: '45',
        sdText: '100',
        apps: mockAppProps
      } ) ).map( ( key, index ) => {
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ComboPack
          comboPackTitle='My Plan'
          comboPackSubTitle='Malyalam Hindi English Basic HD'
          amountValue='&#8377;299/month'
          comboPlanExpire='Renewal on 20/05/2020'
          hdText='45'
          sdText='100'
          apps={ mockAppProps }
        />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
