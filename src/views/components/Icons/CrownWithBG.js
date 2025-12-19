import * as React from 'react';

function CrownWithBG( props ){
  return (
    <svg
      style={ { width:'1.875rem', height:'1.875rem' } }
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...props }
    >
      <g clipPath='url(#clip0_905_39314)'>
        <rect width='30'
          height='30'
          rx='15'
          fill='#220046'
        />
        <g filter='url(#filter0_d_905_39314)'>
          <path fillRule='evenodd'
            clipRule='evenodd'
            d='M15.8681 6.6845C15.8681 7.16794 15.4794 7.55985 15 7.55985C14.5206 7.55985 14.1319 7.16794 14.1319 6.6845C14.1319 6.20105 14.5206 5.80914 15 5.80914C15.4794 5.80914 15.8681 6.20105 15.8681 6.6845ZM23.6806 12.1864L20.4984 13.2866L18.2552 14.0622L16.5281 11.0766L15 8.43491L13.4719 11.0766L11.7448 14.0622L9.50161 13.2866L6.31944 12.1864L7.42346 15.3673L9.57465 21.5652H20.4254L22.5766 15.3673L23.6806 12.1864ZM20.4254 22.4405H9.57465V24.1912H20.4254V22.4405ZM5.45155 11.9367C5.93097 11.9367 6.31961 11.5448 6.31961 11.0614C6.31961 10.5779 5.93097 10.186 5.45155 10.186C4.97214 10.186 4.5835 10.5779 4.5835 11.0614C4.5835 11.5448 4.97214 11.9367 5.45155 11.9367ZM24.5489 11.9367C25.0284 11.9367 25.417 11.5448 25.417 11.0614C25.417 10.5779 25.0284 10.186 24.5489 10.186C24.0695 10.186 23.6809 10.5779 23.6809 11.0614C23.6809 11.5448 24.0695 11.9367 24.5489 11.9367Z'
            fill='url(#paint0_linear_905_39314)'
          />
        </g>
        <path fillRule='evenodd'
          clipRule='evenodd'
          d='M12.6853 20.1412L15.2388 20.1412L16.7745 18.0024L17.3149 17.2497L16.775 16.4964L15.2395 14.3542L12.688 14.3542L14.7624 17.2483L12.6853 20.1412Z'
          fill='#E10092'
        />
      </g>
      <defs>
        <filter id='filter0_d_905_39314'
          x='-2.08317'
          y='0.809144'
          width='34.1668'
          height='31.7154'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feColorMatrix in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dy='1.66667'/>
          <feGaussianBlur stdDeviation='3.33333'/>
          <feComposite in2='hardAlpha'
            operator='out'
          />
          <feColorMatrix type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'
          />
          <feBlend mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_905_39314'
          />
          <feBlend mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_905_39314'
            result='shape'
          />
        </filter>
        <linearGradient id='paint0_linear_905_39314'
          x1='27.4589'
          y1='14.3875'
          x2='2.5416'
          y2='14.3875'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFA800'/>
          <stop offset='0.453125'
            stopColor='#FFF389'
          />
          <stop offset='1'
            stopColor='#FFA800'
          />
        </linearGradient>
        <clipPath id='clip0_905_39314'>
          <rect width='30'
            height='30'
            fill='white'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CrownWithBG;
