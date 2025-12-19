import * as React from 'react';

function CrownGoldForward( props ){
  return (
    <svg
      style={ { width:'2.25rem', height:'2.25rem' } }
      viewBox='0 0 36 35'
      fill='none'
      { ...props }
    >
      <g filter='url(#a)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M18.833 7.517c0 .464-.373.84-.833.84a.837.837 0 0 1-.834-.84c0-.464.374-.84.834-.84.46 0 .833.376.833.84Zm7.5 5.282-3.818 1.32-1.39.48-1.291-2.232L18 9.197l-1.834 3.17-1.291 2.233-1.39-.48-3.819-1.321 1.325 3.817 1.8 5.187h10.417l1.8-5.187 1.325-3.817Zm-3.125 9.844H12.792v1.68h10.416v-1.68ZM8.833 12.559c.46 0 .834-.376.834-.84a.837.837 0 0 0-.834-.84.837.837 0 0 0-.833.84c0 .464.373.84.833.84Zm18.334 0c.46 0 .833-.376.833-.84a.837.837 0 0 0-.833-.84.837.837 0 0 0-.834.84c0 .464.374.84.834.84Z'
          fill='url(#b)'
        />
      </g>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.778 20.436h2.451l1.474-2.054.52-.722-.52-.724-1.473-2.056h-2.45l1.992 2.778-1.994 2.777Z'
        fill='#E10092'
      />
      <defs>
        <linearGradient
          id='b'
          x1={ 29.96 }
          y1={ 14.912 }
          x2={ 6.04 }
          y2={ 14.912 }
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
          x={ 0 }
          y={ 0.677 }
          width={ 36 }
          height={ 33.647 }
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
            result='effect1_dropShadow_2013_8084'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_2013_8084'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )

}
export default CrownGoldForward;
