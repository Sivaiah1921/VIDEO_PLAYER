import * as React from 'react';

function Last7DaysTV( props ){
  return (
    <svg
      width={ 24 }
      height={ 24 }
      fill='none'
      { ...props }
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.895 2c.333 0 .605.251.605.56v18.88c0 .309-.272.56-.605.56H2.605C2.271 22 2 21.749 2 21.44V2.56c0-.309.271-.56.605-.56h13.29ZM3.5 20.5H15v-17H3.5v17ZM22 4.218c0-.397-.336-.718-.75-.718H17.5v1.106h3.345v15.287H17.5V21h3.75c.414 0 .75-.322.75-.718V4.218Z'
        fill='#8E81A1'
      />
    </svg>
  )
}

export default Last7DaysTV;
