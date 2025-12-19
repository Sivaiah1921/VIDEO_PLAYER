import * as React from 'react';

function CapsArrow( props ){
  return (
    <svg
      width={ 20 }
      height={ 20 }
      viewBox='0 0 20 20'
      fill='none'
      { ...props }
    >
      <path d='m10 2 7 7h-4v9H7V9H3l7-7Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default CapsArrow;
