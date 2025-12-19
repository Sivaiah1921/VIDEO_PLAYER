import * as React from 'react';

function Search( props ){
  return (
    <svg
      style={ { width:'1.5rem', height:'1.5rem' } }
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.296 14.578h-.908l-.315-.313a7.397 7.397 0 0 0 1.793-4.833A7.432 7.432 0 0 0 9.433 2a7.432 7.432 0 1 0 0 14.865 7.4 7.4 0 0 0 4.831-1.79l.316.313v.905L20.295 22 22 20.295l-5.704-5.717ZM9.5 15a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Search;
