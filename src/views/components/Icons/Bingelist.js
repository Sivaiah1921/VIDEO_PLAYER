import * as React from 'react';

function Bingelist( props ){
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
        d='m15.487 11.446 2.49-1.329 2.49 1.329-.484-2.811L22 6.642l-2.783-.414-1.24-2.561-1.24 2.56-2.783.415 2.016 1.993-.483 2.81Zm6.435 6.971H2v3.487h19.922v-3.487ZM2 11.042h8.965v3.486H2v-3.486Zm8.965-7.375H2v3.486h8.965V3.667Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Bingelist;
