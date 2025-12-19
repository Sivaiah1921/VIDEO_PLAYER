import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MediaCarousel, { propTypes } from './MediaCarousel';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  railData: {
    title: '',
    layoutType: '',
    sectionSource: '',
    contentList: [{
      'id': 692926,
      'title': 'The Kapil Sharma Show S2 E135 - Your Honor Haazir Ho!',
      'image': 'https://origin-staticv2.sonyliv.com/landscape_thumb/show_set_TKSS_ep135_clean.jpg',
      'contentType': 'TV_SHOWS',
      'contentShowType': 'VOD_TV_SHOWS',
      'provider': 'SonyLiv',
      'providerContentId': '1000055313',
      'summary': 'The fun quotient on The Kapil Sharma Show increases on this episode as Kapil welcomes the Your Honor actors, Jimmy Sheirgill, Mita Vasisht and Varun Badola. With Kapil’s tongue-in-cheek questions and witty replies by the celebs, this is a crazy laughter ride that you must not miss. So, watch it right away!'
    },
    {
      'id': 928620,
      'title': 'Tu Saubhagyavati Ho S1 E65 - Stay In Your Limits Rangrao',
      'image': 'https://origin-staticv2.sonyliv.com/landscape_thumb/show_marathi_tusaubhagyvati_ep65_Landscape_Thumb.jpg',
      'contentType': 'TV_SHOWS',
      'contentShowType': 'VOD_TV_SHOWS',
      'provider': 'SonyLiv',
      'providerContentId': '1000121721',
      'summary': 'Baiji warns Rangrao to stay away from Surya\'s children as he blackmails her. She also insists Rangrao to show her the video that reveals the real story behind Vikas\'s death.'
    }
    ]
  }
}

describe( '<MediaCarousel />tests', () => {
  // it( 'renders without crashing', () => {
  //   jestutils.mountWithProviders( <MediaCarousel { ...mockProps } /> );
  // } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const props = {
        railData: PropTypes.object
      };

      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );

      expect( consoleErrorSpy ).not.toBeCalled();
      consoleErrorSpy.mockClear();
    } );

    it( 'an instance of MediaCarousel should have the proper propTypes set', () => {
      expect( MediaCarousel.propTypes ).toBe( propTypes );
    } );
  } );

  // describe( 'snapshot tests', () => {
  //   const component = mountSnapShot(
  //     <BrowserRouter>
  //       <MediaCarousel { ...mockProps } />
  //     </BrowserRouter>
  //   )
  //   expect( component.toJSON() ).toMatchSnapshot();
  // } );

} );
