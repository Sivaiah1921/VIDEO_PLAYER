import * as React from 'react';

function MobileDevice( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='21'
      fill='none'
      viewBox='0 0 14 21'
      { ...props }
    >
      <path
        fill='#8E81A1'
        fillRule='evenodd'
        d='M0 .5h14v20H0V.5zm2 3h10v13H2v-13zm5 16a1 1 0 100-2 1 1 0 000 2z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default MobileDevice;
