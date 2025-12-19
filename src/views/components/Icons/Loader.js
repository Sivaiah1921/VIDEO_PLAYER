import React from 'react';

function SvgLoader(){
  return (
    <svg
      id='loader'
      viewBox='0 0 36 36'
      width={ 37 }
      height={ 37 }
    >

      <style>
        { `.cls-1{fill:none}
            .cls-2{clipPath:url(#clipPath)}
            .cls-3{clipPath:url(#clipPath-2)}
            #loader{
              animation-name: rotate;
              animation-duration: 0.7s;
              animation-iteration-count: infinite;
              transform-origin: 50% 50%;
          }
          @keyframes rotate {
              0% {
                  transform: rotate(0deg);
                  -ms-transform: rotate(0deg);
                  -moz-transform: rotate(0deg);
                  -webkit-transform: rotate(0deg);
              }
              100% {
                  transform: rotate(360deg);
                  -ms-transform: rotate(360deg);
                  -moz-transform: rotate(360deg);
                  -webkit-transform: rotate(360deg);
              }
          }
            ` }
      </style>
      <defs>
        <clipPath id='clipPath'
          transform='translate(0 0)'
        >
          <path class='cls-1'
            d='M18,.5A17.47,17.47,0,1,0,34.94,13.58a1.5,1.5,0,0,0-2.91.76A14.5,14.5,0,1,1,18,3.5a1.5,1.5,0,0,0,0-3Z'
          />

        </clipPath>
        <clipPath id='clipPath-2'
          transform='translate(0 0)'
        >
          <rect class='cls-1'
            width='36'
            height='36'
          />
        </clipPath>
      </defs>
      <title>Asset 1</title>
      <g id='Layer_2'
        data-name='Layer 2'
      >
        <g id='Layer_1-2'
          data-name='Layer 1'
        >
          <g class='cls-2'>
            <g class='cls-3'>
              <image width='36'
                height='36'
                transform='translate(36 36) rotate(180)'
                xlinkHref='data:image/png;base64,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'
              >
              </image>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default SvgLoader;