/* eslint-disable no-console */
import React from 'react';
import SeriesDetailPage from './SeriesDetailPage';
import { ALPHANUMERICKEYBOARD } from '../../../utils/constants';

export default {
  title: 'Organisms/SeriesDetailPage',
  parameters: {
    component: SeriesDetailPage,
    componentSubtitle: 'This component will provide all the episodes related information and search ',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};

const Template = ( args )=> (
  <div style={ { 'height': '150vh', width:'1280px', 'background': 'linear-gradient(146.32deg, #020005 0%, #220046 100%)' } } >
    <SeriesDetailPage { ...args } />
  </div>
);


export const BasicUsage = Template.bind( {} );
BasicUsage.args = {
  tabheadList:  ['Season 1', 'Season 2', 'Season 3'],
  mediaCardList:
   [
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     },
     {
       type: 'landscape',
       title: 'Road To Sangam',
       image: 'https://img.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/old_images/MOVIE/5978/1770015978/1770015978-h'
     }

   ],
  alphanumericKeyboardProp: {
    onChange: a => console.log( a ),
    onClear: a => console.log( a ),
    onRemove: a => console.log( a ),
    onSpace: a => console.log( a ),
    clearBtnLabel: 'Clear',
    deleteBtnLabel: 'Delete',
    spaceBtnLabel:'Space',
    keys: ALPHANUMERICKEYBOARD.KEYBOARD_WITHOUT_SPECIAL_KEYS
  }
}


