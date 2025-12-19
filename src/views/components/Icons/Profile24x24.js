import * as React from 'react';

function Profile24x24( props ){
  return (
    <svg
      style={ { width:'1.5rem', height:'1.5rem' } }
      viewBox='0 0 80 80'
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M53.333 32.095c0 7.364-5.97 13.334-13.333 13.334-7.364 0-13.333-5.97-13.333-13.334S32.637 18.762 40 18.762c7.364 0 13.333 5.97 13.333 13.333ZM40.235 52.094C51.173 51.968 60 43.062 60 32.095c0-11.046-8.954-20-20-20s-20 8.954-20 20c0 10.965 8.824 19.87 19.759 19.999l-.871.307L15 60.833v7.07l24.997-8.824L65 67.904v-7.07l-23.894-8.433-.87-.307Z'
        fill='#fff'
      />
    </svg>
  )
}

export default Profile24x24;
