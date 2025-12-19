import * as React from 'react';

function AvailableLanguages( props ){
  return (
    <svg
      width={ 26 }
      height={ 26 }
      fill='none'
      { ...props }
    >
      <path
        d='m9.762 15.43-.147-.147H5.044v-4.47h4.701l.147-.148 4.242-4.272v13.412L9.762 15.43Zm4.412-9.132ZM21 .5H5A4.5 4.5 0 0 0 .5 5v16A4.5 4.5 0 0 0 5 25.5h16a4.5 4.5 0 0 0 4.5-4.5V5A4.5 4.5 0 0 0 21 .5Z'
        stroke='#A3A6C2'
      />
    </svg>
  )
}

export default AvailableLanguages;
