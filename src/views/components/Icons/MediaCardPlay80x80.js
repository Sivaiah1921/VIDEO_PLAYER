import * as React from 'react';

function MediaCardPlay80x80( props ){
  return (
    <svg
      width={ 50 }
      height={ 50 }
      viewBox='0 0 50 50'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        opacity={ 0.5 }
        fillRule='evenodd'
        clipRule='evenodd'
        d='M25 41.6667C34.2047 41.6667 41.6666 34.2048 41.6666 25.0001C41.6666 15.7953 34.2047 8.33341 25 8.33341C15.7952 8.33341 8.33329 15.7953 8.33329 25.0001C8.33329 34.2048 15.7952 41.6667 25 41.6667ZM25 45.8334C36.5059 45.8334 45.8333 36.506 45.8333 25.0001C45.8333 13.4941 36.5059 4.16675 25 4.16675C13.494 4.16675 4.16663 13.4941 4.16663 25.0001C4.16663 36.506 13.494 45.8334 25 45.8334Z'
        fill='white'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.3705 18.0557H25.716L30.3232 23.1888L31.9446 24.9953L30.3248 26.8032L25.7184 31.9446H20.3785L26.6018 24.9985L20.3705 18.0557Z'
        fill='white'
      />
    </svg>
  )
}

export default MediaCardPlay80x80;
