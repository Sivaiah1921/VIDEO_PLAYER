import * as React from 'react';

function ArrowDown( props ){
  return (
    <svg
      width={ 25 }
      height={ 25 }
      viewBox='0 0 25 25'
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M25 12.5 12.5 25 0 12.5l2.193-2.193 8.772 8.699V0h3.07v19.006l8.772-8.699L25 12.5Z'
        fill='#fff'
      />
    </svg>
  )
}

export default ArrowDown;
