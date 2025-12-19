import * as React from 'react';

function Home( props ){
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
        d='M1.5 10.512 12 1.5l10.5 9.012L21.42 12 12 3.914 2.58 12 1.5 10.512ZM3.6 22.5V12.486L12 5.7l8.4 6.786V22.5h-6.28v-6.176H9.88V22.5H3.6Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Home;
