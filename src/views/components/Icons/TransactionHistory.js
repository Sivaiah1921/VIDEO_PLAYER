import * as React from 'react';

function TransactionHistory( props ){
  return (
    <svg
      style={ { width:'1.5rem', height:'1.5rem' } }
      fill='none'
      viewBox='0 0 24 24'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22.893 3.54h-21.6a1.2 1.2 0 1 1 0-2.4h21.6a1.2 1.2 0 0 1 0 2.4Zm-14.4 2.4a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Zm0 14.4a6 6 0 1 1 .001-12 6 6 0 0 1 0 12Zm14.4-14.4h-4.8a1.199 1.199 0 1 0 0 2.4h4.8a1.2 1.2 0 0 0 0-2.4Zm0 4.8h-2.4a1.2 1.2 0 0 0 0 2.4h2.4a1.2 1.2 0 0 0 0-2.4Zm-2.4 4.8h2.4a1.2 1.2 0 0 1 0 2.4h-2.4a1.2 1.2 0 1 1 0-2.4Zm2.4 4.8h-4.8a1.199 1.199 0 1 0 0 2.4h4.8a1.2 1.2 0 0 0 0-2.4Zm-15.6-8.4a1.2 1.2 0 1 1 2.4 0v2.4a1.21 1.21 0 0 1-.36.853v-.002l-1.2 1.2a1.196 1.196 0 0 1-.865.42 1.196 1.196 0 0 1-1.245-1.246c.012-.334.164-.647.418-.865l.852-.852V11.94Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default TransactionHistory;
