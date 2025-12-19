import * as React from 'react';

function Delete( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='18'
      fill='none'
      viewBox='0 0 14 18'
      { ...props }
    >
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M4.083 0L3.5 2.25H0v1.125h14V2.25h-3.5L9.917 0H4.083zm5.25 2.25H4.667l.583-1.125h3.5l.583 1.125zM.583 4.5h1.4l.934 11.813h8.166L12.018 4.5h1.4L12.25 18H1.75L.583 4.5zm9.074 1.175l-1.165-.05-.413 8.991 1.165.05.413-8.991zm-3.991-.05l-1.166.05.413 8.99 1.166-.049-.413-8.991z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default Delete;
