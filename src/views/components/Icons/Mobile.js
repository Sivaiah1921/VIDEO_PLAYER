import * as React from 'react';

function Mobile( props ){
  return (
    <svg
      width={ 24 }
      height={ 25 }
      viewBox='0 0 24 25'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 2.5h14v20H5v-20Zm2 3h10v13H7v-13Zm5 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Mobile;
