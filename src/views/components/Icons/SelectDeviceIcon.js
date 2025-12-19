import * as React from 'react';

function SelectDeviceIcon( props ){
  return (
    <svg
      width={ 18 }
      height={ 20 }
      viewBox='0 0 20 21'
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M.5.5v14.785h19V.5H.5Zm17 12.785h-15V2.5h15v10.785Zm-7.871 2.274-6.952 2.779v2.153l7.325-2.928 7.453 2.936v-2.15l-7.089-2.792-.369-.146-.368.148Z'
        fill='#8E81A1'
      />
    </svg>
  );
}

export default SelectDeviceIcon;
