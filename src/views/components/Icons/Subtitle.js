import * as React from 'react';
import './Subtitle.scss'

function Subtitle( props ){
  return (
    <svg
      width='100'
      height='100'
      viewBox='0 0 200 200'
    >
      <defs>
        <pattern id='pattern'
          preserveAspectRatio='xMidYMid slice'
          width='100%'
          height='100%'
          viewBox='0 0 959 1013'
        >
          <image width='959'
            height='1013'
            xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA78AAAP1CAMAAACe/aiiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LmE4ZDQ3NTM0OSwgMjAyMy8wMy8yMy0xMzowNTo0NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk3QjUxQkY4MzJCODExRUU4QkY1REE1RDYxOEE4NzE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk3QjUxQkY5MzJCODExRUU4QkY1REE1RDYxOEE4NzE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTdCNTFCRjYzMkI4MTFFRThCRjVEQTVENjE4QTg3MTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTdCNTFCRjczMkI4MTFFRThCRjVEQTVENjE4QTg3MTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7kfi9QAAAABlBMVEX/////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'
          />
        </pattern>
        <clipPath id='clip-iPhone_14_Pro_Max_1'>
          <rect width='200'
            height='200'
          />
        </clipPath>
      </defs>
      <g id='iPhone_14_Pro_Max_1'
        data-name='iPhone 14 Pro Max – 1'
        clipPath='url(#clip-iPhone_14_Pro_Max_1)'
      >
        <rect id='chatboat-active'
          width='193'
          height='204'
          transform='translate(5)'
          fill='url(#pattern)'
        />
        <path id='Icon_material-chat-bubble'
          data-name='Icon material-chat-bubble'
          d='M156.43,3H20.048A17.1,17.1,0,0,0,3,20.048v153.43l34.1-34.1H156.43a17.1,17.1,0,0,0,17.048-17.048V20.048A17.1,17.1,0,0,0,156.43,3Z'
          transform='translate(12.674 10)'
          fill='none'
          stroke='#fff'
          strokeWidth='13'
        />
      </g>
    </svg>

  )
}
export default Subtitle;