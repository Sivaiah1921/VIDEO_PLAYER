import * as React from 'react';

function Television( props ){
  return (
    <svg
      style={ { width:'1.5rem', height:'1.5rem' } }
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.938 5.009v-2h18v14h-18v-12Zm2 10h14v-10h-14v10ZM5 19.843l6.566-2.624.369-.148.369.146L19 19.854v2.15l-7.06-2.78L5 21.996v-2.154Z'
        fill='#C7C0CF'
      />
    </svg>
  )
}

export default Television;
