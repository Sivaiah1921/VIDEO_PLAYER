import * as React from 'react';

function DividerWithPlusGrey( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='213'
      fill='none'
      viewBox='0 0 24 213'
      { ...props }
    >
      <mask
        id='mask0_14526_59517'
        style={ { maskType: 'alpha' } }
        width='27'
        height='26'
        x='-2'
        y='94'
        maskUnits='userSpaceOnUse'
      >
        <path fill='#C4C4C4'
          stroke='#564372'
          d='M-1 94.5H24V119.5H-1z'
        ></path>
      </mask>
      <g mask='url(#mask0_14526_59517)'>
        <path
          fillRule='evenodd'
          stroke='#564372'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M13.722 105.069h7.468v1.219a2 2 0 01-2 2h-5.469v6.462a2 2 0 01-2 2h-1.419v-8.462H2.834v-1.219a2 2 0 012-2h5.468V99.25a2 2 0 012-2h1.42v7.819z'
          clipRule='evenodd'
        ></path>
      </g>
      <path stroke='#8E81A1'
        d='M12 197.222v-67.055M12 82.833V15.778'
      ></path>
    </svg>
  )
}

export default DividerWithPlusGrey;
