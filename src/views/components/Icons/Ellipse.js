import * as React from 'react';
function Ellipse( props ){
  return (
    <svg
      width={ 69 }
      height={ 69 }
      viewBox='0 0 69 69'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <circle
        opacity={ 0.5 }
        cx={ 34.2453 }
        cy={ 34.2452 }
        r={ 30.4255 }
        stroke='#8E81A1'
        strokeWidth={ 6.76121 }
      />
    </svg>
  )
}
export default Ellipse;
