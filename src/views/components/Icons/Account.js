import * as React from 'react';

function Account( props ){
  return (
    <svg
      width={ 19 }
      height={ 20 }
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.25 5.273C4.25 2.366 6.605 0 9.5 0s5.25 2.366 5.25 5.273c0 2.908-2.355 5.274-5.25 5.274S4.25 8.18 4.25 5.273Zm6.417 6.446c2.022 0 3.928.807 5.365 2.273a7.703 7.703 0 0 1 2.218 5.422.585.585 0 0 1-.583.586H1.333a.585.585 0 0 1-.583-.586c0-2.038.788-3.963 2.218-5.422 1.437-1.466 3.343-2.273 5.365-2.273h2.334Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Account;
