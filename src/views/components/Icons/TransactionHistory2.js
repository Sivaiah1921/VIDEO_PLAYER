import * as React from 'react';

function TransactionHistory2( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      style={ { width:'2rem', height:'2rem' } }
      fill='none'
      viewBox='0 0 36 36'
    >
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M7.071 18c0-6.627 5.47-12 12.215-12S31.5 11.373 31.5 18s-5.47 12-12.214 12c-3.38 0-6.42-1.347-8.632-3.52l1.927-1.893a9.508 9.508 0 006.705 2.746c5.252 0 9.5-4.173 9.5-9.333s-4.248-9.333-9.5-9.333c-5.253 0-9.5 4.173-9.5 9.333H7.07zm10.857 1.333v-6.667h2.036V18.2l4.777 2.786-1.045 1.707-5.768-3.36z'
        clipRule='evenodd'
      ></path>
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M11.6 15v3.31L9.382 20.3l-.78.7-.781-.7L5.6 18.31v-3.307l3 2.689 3-2.692z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default TransactionHistory2;
