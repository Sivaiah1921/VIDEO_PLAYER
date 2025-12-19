import * as React from 'react';

function Plus( props ){
  return (
    <svg
      width={ 12 }
      height={ 12 }
      viewBox='0 0 25 24'
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.611 2H11.39v8.889H2.5v2.222h8.889V22h2.222v-8.889H22.5V10.89h-8.889V2Z'
        fill='#F3CBE3'
        strokeWidth='2'
      />
    </svg>
  )
}

export default Plus;
