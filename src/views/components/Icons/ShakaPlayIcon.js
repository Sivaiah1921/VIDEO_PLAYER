import * as React from 'react';

function ShakaPlayIcon( props ){
  return (
    <svg
      width={ 50 }
      height={ 50 }
      viewBox='0 0 21 20'
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.798 1.963c-.35-.395-1.242-.395-1.242 0v16.074c0 .395.895.395 1.246 0l11.708-7.322a1.105 1.105 0 0 0 .006-1.43L4.798 1.963Z'
        fill='#fff'
      />
    </svg>
  )
}

export default ShakaPlayIcon;
