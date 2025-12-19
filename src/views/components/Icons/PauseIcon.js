import * as React from 'react';

function PauseIcon( props ){
  return (
    <svg
      width={ 102 }
      height={ 102 }
      viewBox='0 0 102 102'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_b_20399_2)'>
        <g filter='url(#filter1_b_20399_2)'>
          <path d='M102 50.9998C102 79.1663 79.1665 102 51 102C22.8335 102 0 79.1663 0 50.9998C0 22.8332 22.8335 -0.000244141 51 -0.000244141C79.1665 -0.000244141 102 22.8332 102 50.9998Z'
            fill={ props.primaryfill }
            fill-opacity='0.7'
          />
        </g>
        <path fillRule='evenodd'
          clipRule='evenodd'
          d='M51 97.2185C76.5259 97.2185 97.2188 76.5257 97.2188 50.9998C97.2188 25.4738 76.5259 4.78101 51 4.78101C25.4741 4.78101 4.78125 25.4738 4.78125 50.9998C4.78125 76.5257 25.4741 97.2185 51 97.2185ZM51 102C79.1665 102 102 79.1663 102 50.9998C102 22.8332 79.1665 -0.000244141 51 -0.000244141C22.8335 -0.000244141 0 22.8332 0 50.9998C0 79.1663 22.8335 102 51 102Z'
          fill={ props.secondaryfill }
        />
        <path fillRule='evenodd'
          clipRule='evenodd'
          d='M65.6878 30H59.7976C58.5253 30 57.4927 31.4474 57.4927 33.2308V68.7692C57.4927 70.5526 58.5253 72 59.7976 72H65.6878C66.9601 72 67.9927 70.5526 67.9927 68.7692V33.2308C67.9927 31.4474 66.9601 30 65.6878 30Z'
          fill={ props.secondaryfill }
        />
        <path fillRule='evenodd'
          clipRule='evenodd'
          d='M42.2015 30H36.3112C35.0389 30 34.0063 31.4474 34.0063 33.2308V68.7692C34.0063 70.5526 35.0389 72 36.3112 72H42.2015C43.4738 72 44.5063 70.5526 44.5063 68.7692V33.2308C44.5063 31.4474 43.4738 30 42.2015 30Z'
          fill={ props.secondaryfill }
        />
      </g>
      <defs>
        <filter id='filter0_b_20399_2'
          x='-50'
          y='-50.0002'
          width='202'
          height='202'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feGaussianBlur in='BackgroundImageFix'
            stdDeviation='25'
          />
          <feComposite in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_20399_2'
          />
          <feBlend mode='normal'
            in='SourceGraphic'
            in2='effect1_backgroundBlur_20399_2'
            result='shape'
          />
        </filter>
        <filter id='filter1_b_20399_2'
          x='-30'
          y='-30.0002'
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
            result='effect1_backgroundBlur_20399_2'
          />
          <feBlend mode='normal'
            in='SourceGraphic'
            in2='effect1_backgroundBlur_20399_2'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default PauseIcon;
