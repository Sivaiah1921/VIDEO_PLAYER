import * as React from 'react';

function SemiAnnually( props ){
  return (
    <svg
      style={ {
        // width:'1.875rem', height:'1.667rem',
        marginLeft: '-0.1rem', marginTop: '-0.2rem'
      } }
      xmlns='http://www.w3.org/2000/svg'
      width='50'
      height='50'
      fill='none'
      viewBox='0 0 24 24'
      { ...props }
    >
      <path d='M5.0929 8.27734H7.7929V10.9773H5.0929V8.27734Z'
        fill='#564372'
      />
      <path d='M8.79797 8.27734H11.498V10.9773H8.79797V8.27734Z'
        fill='#564372'
      />
      <path d='M8.79797 11.98H11.498V14.68H8.79797V11.98Z'
        fill='#564372'
      />
      <path d='M5.0929 11.98H7.7929V14.68H5.0929V11.98Z'
        fill='#564372'
      />
      <path d='M8.79797 15.6801H11.498V18.3801H8.79797V15.6801Z'
        fill='#564372'
      />
      <path d='M5.0929 15.6801H7.7929V18.3801H5.0929V15.6801Z'
        fill='#564372'
      />
      <path d='M12.5021 8.27734H15.2021V10.9773H12.5021V8.27734Z'
        fill='#8E81A1'
      />
      <path d='M12.5021 11.98H15.2021V14.68H12.5021V11.98Z'
        fill='#8E81A1'
      />
      <path d='M12.5021 15.6801H15.2021V18.3801H12.5021V15.6801Z'
        fill='#8E81A1'
      />
      <path d='M16.2072 8.27734H18.9072V10.9773H16.2072V8.27734Z'
        fill='#8E81A1'
      />
      <path d='M16.2072 11.98H18.9072V14.68H16.2072V11.98Z'
        fill='#8E81A1'
      />
      <path d='M16.2072 15.6801H18.9072V18.3801H16.2072V15.6801Z'
        fill='#8E81A1'
      />
      <path fill-rule='evenodd'
        clip-rule='evenodd'
        d='M20 5.5H4V19.5H20V5.5ZM2 3.5V21.5H22V3.5H2Z'
        fill='#8E81A1'
      />
      <path d='M16 2.5H18V6.5H16V2.5Z'
        fill='#8E81A1'
      />
      <path d='M11 2.5H13V6.5H11V2.5Z'
        fill='#8E81A1'
      />
      <path d='M6 2.5H8V6.5H6V2.5Z'
        fill='#8E81A1'
      />
    </svg>

  );
}

export default SemiAnnually;
