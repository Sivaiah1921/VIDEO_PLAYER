import * as React from 'react';

function AutoplayTrailer( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      style={ { width:'2.25rem', height:'2.25rem' } }
      fill='none'
      viewBox='0 0 36 36'
    >
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M18 29.5c6.351 0 11.5-5.149 11.5-11.5S24.351 6.5 18 6.5 6.5 11.649 6.5 18 11.649 29.5 18 29.5zm0 2c7.456 0 13.5-6.044 13.5-13.5S25.456 4.5 18 4.5 4.5 10.544 4.5 18 10.544 31.5 18 31.5z'
        clipRule='evenodd'
      ></path>
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M15 13.5h3.464l2.985 3.326 1.051 1.17-1.05 1.172-2.985 3.332h-3.46l4.033-4.501L15 13.5z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default AutoplayTrailer;
