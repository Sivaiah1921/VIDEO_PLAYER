import * as React from 'react';

function Refresh24x24( props ){
  return (
    <svg
      style={ { width:'1.25rem', height:'1.25rem' } }
      viewBox='0 0 24 25'
      fill='none'
      { ...props }
    >
      <g clipPath='url(#a)'
        fill='#fff'
      >
        <path d='M4.51 7.255c3.042-3.626 8.596-3.976 12.403-.781L15.69 7.933c-2.964-2.488-7.278-2.216-9.647.607-2.37 2.824-1.888 7.119 1.077 9.607 2.964 2.487 7.278 2.216 9.647-.608.925-1.102 1.406-2.438 1.49-3.798l1.972-.11c-.042 1.855-.669 3.69-1.93 5.194-3.042 3.626-8.597 3.975-12.404.78-3.807-3.194-4.427-8.725-1.385-12.35Z' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='m15.801 4.5 1.91 1.103.41 1.944.145.684-.664.218-1.89.619-1.909-1.103 2.553-.836L15.8 4.5Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff'
            transform='translate(0 .5)'
            d='M0 0h24v24H0z'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Refresh24x24;
