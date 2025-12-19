import * as React from 'react';

function Quarterly( props ){
  return (
    <svg
      style={ { width:'1.875rem', height:'1.667rem' } }
      xmlns='http://www.w3.org/2000/svg'
      width='50'
      height='48'
      fill='none'
      viewBox='0 0 50 48'
      { ...props }
    >
      <path
        fill='#220046'
        d='M7.732 14.693H14.482V21.442999999999998H7.732z'
      ></path>
      <path
        fill='#8E81A1'
        d='M16.995 14.693H23.745V21.442999999999998H16.995z'
      ></path>
      <path fill='#8E81A1'
        d='M16.995 23.95H23.745V30.7H16.995z'
      ></path>
      <path fill='#220046'
        d='M7.732 23.95H14.482V30.7H7.732z'
      ></path>
      <path fill='#8E81A1'
        d='M16.995 33.2H23.745V39.95H16.995z'
      ></path>
      <path fill='#220046'
        d='M7.732 33.2H14.482V39.95H7.732z'
      ></path>
      <path
        fill='#8E81A1'
        d='M26.255 14.693H33.004999999999995V21.442999999999998H26.255z'
      ></path>
      <path
        fill='#8E81A1'
        d='M26.255 23.95H33.004999999999995V30.7H26.255z'
      ></path>
      <path
        fill='#8E81A1'
        d='M26.255 33.2H33.004999999999995V39.95H26.255z'
      ></path>
      <path
        fill='#8E81A1'
        d='M35.518 14.693H42.268V21.442999999999998H35.518z'
      ></path>
      <path fill='#8E81A1'
        d='M35.518 23.95H42.268V30.7H35.518z'
      ></path>
      <path fill='#8E81A1'
        d='M35.518 33.2H42.268V39.95H35.518z'
      ></path>
      <path
        stroke='#8E81A1'
        strokeWidth='4.5'
        d='M2.25 5H47.75V45.5H2.25z'
      ></path>
      <path fill='#8E81A1'
        d='M10 0.25H15V10.25H10z'
      ></path>
      <path fill='#8E81A1'
        d='M22.5 0.25H27.5V10.25H22.5z'
      ></path>
      <path fill='#8E81A1'
        d='M35 0.25H40V10.25H35z'
      ></path>
    </svg>
  )
}

export default Quarterly;
