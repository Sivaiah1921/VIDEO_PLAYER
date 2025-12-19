import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import BingeListWithData from './BingeListWithData';
import * as jestutils from '../../../utils/jest/jest';

const mockProps = {
  refetch: jest.fn(),
  bingeList: [
    {
      'contentId': 8708,
      'contentType': 'BRAND',
      'title': 'Kathmandu Connection',
      'description': 'The story begins in 1993, a few months after a series of blasts in Mumbai that had shaken the whole country. A senior cop of Delhi police, Samarth Kaushik, gets involved in a mysterious revelation. A parallel investigation is taking place in Allahabad, over the killing of a customs officer a few months back. There are two common connections between all the cases, Bombay Blasts, and Kathmandu.',
      'image': 'https://origin-staticv2.sonyliv.com/landscape_thumb/KathmanduConnection3_Landscape_Thumb.jpg',
      'subTitles': [
        'Thriller'
      ],
      'contractName': null,
      'entitlements': [],
      'airedDate': null,
      'secondsWatched': 0,
      'durationInSeconds': 0,
      'provider': 'SonyLiv',
      'providerContentId': '1700000716',
      'categoryType': 'DEFAULT',
      'partnerId': 14,
      'partnerSubscriptionType': 'premium',
      'freeEpisodesAvailable': false,
      'notificationSentDate': null,
      'timeStamp': '2022-09-01T05:37:21.000+0000'
    }
  ]
};

describe( 'snapshot tests', () => {
  it( 'renders correctly default', () => {
    const bingeListWithDataComponent = mountSnapShot(
      <BrowserRouter>
        <BingeListWithData />
      </BrowserRouter>
    )
      .toJSON();
    expect( bingeListWithDataComponent ).toMatchSnapshot();
  } );
} );
