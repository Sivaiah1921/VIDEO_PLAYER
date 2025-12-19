import * as React from 'react';

function CrownGoldForward40x40( props ){
  return (
    <svg
      style={ { width:'2.875rem', height:'3.125rem' } }
      viewBox='0 0 50 46'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <g filter='url(#a)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M26.389 7.695c0 .774-.622 1.4-1.39 1.4a1.395 1.395 0 0 1-1.388-1.4c0-.773.622-1.4 1.389-1.4s1.389.627 1.389 1.4Zm12.5 8.803-3.819 1.32-4.862 1.681-3.374-5.833L25 10.496l-1.834 3.17-3.374 5.834-4.862-1.681-3.819-1.32 1.325 3.816 3.883 11.19h17.362l3.883-11.19 1.325-3.817ZM33.68 32.905H16.32v2.801h17.36v-2.801ZM9.723 16.099c.767 0 1.39-.627 1.39-1.4 0-.774-.623-1.401-1.39-1.401-.767 0-1.388.627-1.388 1.4 0 .774.621 1.4 1.388 1.4Zm30.556 0c.767 0 1.39-.627 1.39-1.4 0-.774-.623-1.401-1.39-1.401-.767 0-1.389.627-1.389 1.4 0 .774.622 1.4 1.39 1.4Z'
          fill='url(#b)'
        />
      </g>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.296 29.226h4.086l2.457-3.422.865-1.205-.864-1.205-2.457-3.427h-4.082l3.319 4.63-3.324 4.629Z'
        fill='#E10092'
      />
      <defs>
        <linearGradient
          id='b'
          x1={ 44.934 }
          y1={ 20.02 }
          x2={ 5.066 }
          y2={ 20.02 }
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFA800' />
          <stop offset={ 0.453 }
            stopColor='#FFF389'
          />
          <stop offset={ 1 }
            stopColor='#FFA800'
          />
        </linearGradient>
        <filter
          id='a'
          x={ 0.333 }
          y={ 0.295 }
          width={ 49.334 }
          height={ 45.411 }
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={ 0 }
            result='BackgroundImageFix'
          />
          <feColorMatrix
            in='SourceAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dy={ 2 } />
          <feGaussianBlur stdDeviation={ 4 } />
          <feComposite in2='hardAlpha'
            operator='out'
          />
          <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0' />
          <feBlend
            in2='BackgroundImageFix'
            result='effect1_dropShadow_924_43129'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_924_43129'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )

}
export default CrownGoldForward40x40;
