/* eslint-disable indent */
import * as React from 'react';

function CiruclarArrowForward( props ){
    return (
      <svg
      style={ { width:'1.5rem', height:'1.5625rem' } }
            viewBox='0 0 31 30'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
      >
        <path fillRule='evenodd'
                clipRule='evenodd'
                d='M18.5 15L14.32 20.1553C13.9671 20.5905 13.3031 20.5905 12.9503 20.1553C12.6878 19.8316 12.6878 19.3684 12.9503 19.0447L16.2297 15L12.9503 10.9553C12.6878 10.6316 12.6878 10.1684 12.9503 9.84469C13.3031 9.40947 13.9671 9.40947 14.32 9.84469L18.5 15Z'
                fill='#F3CBE3'
        />
        <rect x='1.5'
                y='1'
                width='28'
                height='28'
                rx='14'
                stroke='#F3CBE3'
                strokeWidth='2'
        />
      </svg>

    );
}
export default CiruclarArrowForward;
