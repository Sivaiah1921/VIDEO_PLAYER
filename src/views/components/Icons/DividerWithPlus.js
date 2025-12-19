import * as React from 'react';

function DividerWithPlus( props ){
  return (
    <svg
      style={ { width:'1.5rem' } }
      viewBox='0 0 24 208'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <mask
        id='a'
        style={ {
          maskType: 'alpha',
          width:'1.6875rem',
          height:'1.625rem'

        } }
        maskUnits='userSpaceOnUse'
        x={ -2 }
        y={ 91 }
      >
        <path fill='#C4C4C4'
          stroke='#D6C6F4'
          d='M-1 91.5h25v25H-1z'
        />
      </mask>
      <g mask='url(#a)'>
        <path
          clipRule='evenodd'
          d='M13.721 102.069h7.469v1.219a2 2 0 0 1-2 2h-5.47v6.462a2 2 0 0 1-2 2H10.3v-8.462H2.834v-1.219a2 2 0 0 1 2-2h5.469V96.25a2 2 0 0 1 2-2h1.42v7.819Z'
          stroke='#D6C6F4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <path d='M12 193v-71m0-36V15'
        stroke='#EFE8FB'
      />
    </svg>
  )
}

export default DividerWithPlus;
