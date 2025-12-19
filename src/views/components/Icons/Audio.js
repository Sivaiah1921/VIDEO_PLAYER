import React from 'react';

function Audio( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='25'
      fill='none'
      viewBox='0 0 24 25'
      { ...props }
    >
      <path stroke='#FFFFFF'
        strokeWidth='2'
        d='M3 3.5H21V21.5H3z'
      ></path>
      <path fill='#FFFFFF'
        d='M6 9.5H7V15.5H6z'
      ></path>
      <path fill='#FFFFFF'
        d='M8 9.5l4-2v10l-4-2v-6z'
      ></path>
      <mask
        id='mask0_2057_8090'
        style={ { maskType: 'alpha' } }
        width='10'
        height='11'
        x='8'
        y='7'
        maskUnits='userSpaceOnUse'
      >
        <path
          fill='#000'
          fillRule='evenodd'
          d='M17 12.5a4 4 0 11-8 0 4 4 0 018 0zm1 0a5 5 0 11-10 0 5 5 0 0110 0zm-3.25 0a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm1 0a2.75 2.75 0 11-5.5 0 2.75 2.75 0 015.5 0z'
          clipRule='evenodd'
        ></path>
      </mask>
      <g mask='url(#mask0_2057_8090)'>
        <path
          fill='#FFFFFF'
          d='M14.71 17.198a5 5 0 00-.332-9.504L13 12.5l1.71 4.698z'
        ></path>
      </g>
    </svg>
  );
}

export default Audio;
