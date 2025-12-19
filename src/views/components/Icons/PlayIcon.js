import * as React from 'react';

function PlayIcon( props ){

  return (
    <svg
      width={ 102 }
      height={ 102 }
      viewBox='0 0 102 102'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <g filter='url(#filter0_b_20399_122)'>
        <g filter='url(#filter1_b_20399_122)'>
          <path d='M102 51C102 79.1665 79.1665 102 51 102C22.8335 102 0 79.1665 0 51C0 22.8335 22.8335 0 51 0C79.1665 0 102 22.8335 102 51Z'
            fill={ props.primaryfill }
            fill-opacity='0.7'
          />
        </g>
        <path fillRule='evenodd'
          clipRule='evenodd'
          d='M51 97.2188C76.5259 97.2188 97.2188 76.5259 97.2188 51C97.2188 25.4741 76.5259 4.78125 51 4.78125C25.4741 4.78125 4.78125 25.4741 4.78125 51C4.78125 76.5259 25.4741 97.2188 51 97.2188ZM51 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 51 0C22.8335 0 0 22.8335 0 51C0 79.1665 22.8335 102 51 102Z'
          fill={ props.secondaryfill }
        />
        <path d='M40.3027 74.3317C39.012 75.1707 37.7057 75.2197 36.384 74.4788C35.0622 73.7379 34.4 72.5917 34.3975 71.0402V30.9617C34.3975 29.4128 35.0596 28.2666 36.384 27.5231C37.7083 26.7796 39.0146 26.8287 40.3027 27.6703L71.8621 47.7095C73.0238 48.484 73.6047 49.5811 73.6047 51.001C73.6047 52.4208 73.0238 53.518 71.8621 54.2924L40.3027 74.3317Z'
          fill={ props.secondaryfill }
        />
      </g>
      <defs>
        <filter id='filter0_b_20399_122'
          x='-30'
          y='-30'
          width='162'
          height='162'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feGaussianBlur in='BackgroundImageFix'
            stdDeviation='15'
          />
          <feComposite in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_20399_122'
          />
          <feBlend mode='normal'
            in='SourceGraphic'
            in2='effect1_backgroundBlur_20399_122'
            result='shape'
          />
        </filter>
        <filter id='filter1_b_20399_122'
          x='-30'
          y='-30'
          width='162'
          height='162'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feGaussianBlur in='BackgroundImageFix'
            stdDeviation='15'
          />
          <feComposite in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_20399_122'
          />
          <feBlend mode='normal'
            in='SourceGraphic'
            in2='effect1_backgroundBlur_20399_122'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default PlayIcon;
