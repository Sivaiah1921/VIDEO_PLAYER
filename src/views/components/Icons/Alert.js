import * as React from 'react';

function Alert( props ){
  return (
    <svg
      width={ 68 }
      height={ 68 }
      viewBox='0 0 68 68'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M34 0.83667L36.9794 6.77614L64.9223 62.4793L67.3442 67.3072H61.9428H6.05712H0.655762L3.07765 62.4793L31.0205 6.77614L34 0.83667ZM56.5415 60.6405L34 15.7048L11.4585 60.6405H56.5415ZM30.5914 30.667H37.258V47.3337H30.5914V30.667ZM37.3334 50.6665H30.6668V57.3332H37.3334V50.6665Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Alert;
