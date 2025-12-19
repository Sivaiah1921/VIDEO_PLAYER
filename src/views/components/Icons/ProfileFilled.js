import * as React from 'react';

function ProfileFilled( props ){
  return (
    <svg
      width={ 80 }
      height={ 80 }
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        d='M40 0C17.92 0 0 17.92 0 40s17.92 40 40 40 40-17.92 40-40S62.08 0 40 0Zm0 12c6.64 0 12 5.36 12 12s-5.36 12-12 12-12-5.36-12-12 5.36-12 12-12Zm0 56.8a28.8 28.8 0 0 1-24-12.88c.12-7.96 16-12.32 24-12.32 7.96 0 23.88 4.36 24 12.32A28.801 28.801 0 0 1 40 68.8Z'
        fill='#fff'
      />
    </svg>
  )
}

export default ProfileFilled;
