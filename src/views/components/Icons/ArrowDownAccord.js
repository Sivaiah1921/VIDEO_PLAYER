import * as React from 'react';

function ArrowDownAccord( props ){
  return (
    <svg
      width={ 22 }
      height={ 12 }
      viewBox='0 0 22 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11 12 .69 3.64A1.763 1.763 0 0 1 2.91.9L11 7.46 19.09.9a1.763 1.763 0 1 1 2.22 2.74L11 12Z'
        fill='#F3CBE3'
      />
    </svg>
  );
}

export default ArrowDownAccord;
