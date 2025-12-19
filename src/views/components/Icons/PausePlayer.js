import * as React from 'react';

function PausePlayer( props ){
  return (
    <svg
      width='3.333rem'
      height='3.333rem'
      viewBox='0 0 80 80'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M40 70.667c16.937 0 30.666-13.73 30.666-30.667 0-16.936-13.73-30.666-30.666-30.666C23.063 9.334 9.333 23.064 9.333 40c0 16.937 13.73 30.667 30.667 30.667Zm0 2.667c18.41 0 33.333-14.924 33.333-33.334C73.333 21.59 58.41 6.667 40 6.667 21.59 6.667 6.666 21.591 6.666 40 6.666 58.41 21.59 73.334 40 73.334Z'
        fill='#fff'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M32.593 28.89h8.553l7.371 8.213 2.594 2.89-2.591 2.893-7.37 8.226h-8.544l9.957-11.114-9.97-11.108Z'
        fill='#fff'
      />
    </svg>
  );
}
export default PausePlayer;
