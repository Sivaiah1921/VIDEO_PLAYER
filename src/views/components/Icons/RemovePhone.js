import * as React from 'react';

function RemovePhone( props ){
  return (
    <svg
      width={ 80 }
      height={ 80 }
      viewBox='0 0 80 80'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        d='M20 6.667V20h6.667v-3.333H60v46.666H26.667V60H20v13.333h46.667V6.667H20Z'
        fill='#8E81A1'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M23.333 53.333c7.364 0 13.334-5.97 13.334-13.333 0-7.364-5.97-13.333-13.334-13.333C15.97 26.667 10 32.637 10 40c0 7.364 5.97 13.333 13.333 13.333ZM30 37.5H16.667v5H30v-5Z'
        fill='#8E81A1'
      />
    </svg>
  );
}
export default RemovePhone;
