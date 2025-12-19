import * as React from 'react';

function DeleteNumber( props ){
  return (
    <svg
      style={ { width:'1.5rem', height:'1.5rem' } }
      viewBox='0 0 24 24'
      { ...props }
    >
      <g clipPath='url(#a)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='m3 12 8.527-6v12L3 12Zm9.474 0L21 6v12l-8.526-6Z'
          fill='#F3CBE3'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff'
            transform='translate(3 3)'
            d='M0 0h18v18H0z'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default DeleteNumber;
