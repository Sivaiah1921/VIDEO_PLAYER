import * as React from 'react';

function Icon1( props ){
  return (
    <svg
      width={ 88 }
      height={ 223 }
      fill='none'
      { ...props }
    >
      <path
        opacity={ 0.4 }
        fillRule='evenodd'
        clipRule='evenodd'
        d='M87.46 112.577H50.306V42.061L9.864 61.13a25.855 25.855 0 0 1-7.234-8.878C.877 48.746 0 45.35 0 42.061c0-7.672 3.836-13.7 11.508-18.084L58.855.96H87.46v111.616Z'
        fill='#DB62AB'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M50.285 124.275v96.323c1.754.439 4.384.768 7.891.987 3.508.438 7.015.657 10.522.657 7.014 0 11.837-1.424 14.467-4.274 2.85-3.069 4.274-6.795 4.274-11.179v-82.514H50.285Z'
        fill='#564372'
      />
    </svg>
  )
}

export default Icon1;
