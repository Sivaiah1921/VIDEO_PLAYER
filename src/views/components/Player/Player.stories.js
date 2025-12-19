
import React from 'react';
import Player from './Player';

export default {
  title: 'Organisms/Player',
  parameters: {
    component: Player,
    componentSubtitle: 'This component will add Playback functionality for all media across the appusing Video.js',
    docs: {
      description: {
        component: ' '
      }
    }
  }
};
const mockPropsShemaroo = {
  deepLinkUrl: 'https://cdn-s3-akm.curiositystream.com/bitmovin-outputs/Doclights_Deserts_ENG_f25_HD_4596.mp4/709d7277f4d335fba651261c15d93c69.mpd'
}

const Template = ( args )=> (
  <Player { ...args } />
);

export const ShemarooMe = Template.bind( {} );
ShemarooMe.args = { ...mockPropsShemaroo };

export const Playground = Template.bind( {} );
Playground.args = {
  src: 'https://latestlyvd-mmd-cust.lldns.net/lyvod/2022/02/Lakhimpur_Kheri_Violence_Case_Ashish_Mishra_Accused_Of_Running_Over_Farmers_Gets_Bail_10feb_171739/stream.ismd/manifest.m3u8?stream=720;480;320;240&hls_client_manifest_version=1&s=1644522002&h=b34b1a496cfd4ae33539128513f25800'
};