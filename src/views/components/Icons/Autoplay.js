import * as React from 'react';

function Autoplay( props ){
  return (
    <svg
      width={ 24 }
      height={ 24 }
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5ZM9.63 6.899l6.931 4.62c.54.36.54 1.14 0 1.5l-6.93 4.62c-.571.39-1.381-.03-1.381-.75V7.65c0-.72.78-1.14 1.38-.75Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Autoplay;
