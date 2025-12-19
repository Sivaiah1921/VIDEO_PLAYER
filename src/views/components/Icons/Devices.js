import * as React from 'react';

function Devices( props ){
  return (
    <svg
      style={ { width:'1.25rem', height:'1.25rem' } }
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <g clipPath='url(#a)'
        fillRule='evenodd'
        clipRule='evenodd'
        fill='#D6C6F4'
      >
        <path d='M2.175 2.82V1.667h14.939V13.9H6.342v-1.153h9.62V2.82H3.327v6.919H2.175v-6.92Zm4.167 14.09 3.302-1.39 5.86 2.43v-1.248l-5.641-2.339-.222-.092-.222.093-3.077 1.294v1.252Z' />
        <path d='M0 10.203h5.405v8.13H-.001v-8.13Zm.77 1.22h3.861v5.284H.771v-5.284Zm2.113 6.717a.412.412 0 1 0 0-.823.412.412 0 0 0 0 .823Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff'
            d='M0 0h20v20H0z'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Devices;
