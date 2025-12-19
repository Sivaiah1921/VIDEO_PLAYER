import * as React from 'react';

function AmazonPrime( props ){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='128'
      height='25'
      fill='none'
      viewBox='0 0 128 25'
    >
      <path fill='url(#pattern0)'
        d='M0 0H128V25H0z'
      ></path>
      <defs>
        <pattern
          id='pattern0'
          width='1'
          height='1'
          patternContentUnits='objectBoundingBox'
        >
          <use
            transform='scale(.00781 .04)'
            xlinkHref='#image0_2181_2322'
          ></use>
        </pattern>
        <image
          id='image0_2181_2322'
          width='128'
          height='25'
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAZCAYAAAD5VyZAAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAgKADAAQAAAABAAAAGQAAAACUmEEWAAAH3klEQVRoBe2ZCZDOdRjH33WfsdtGRWwRaihNVJSsqNBoUCJXjSliKlOp1BSLqZkcO8ho5BhGJcfQmGlo3KSMI8e4cs0akbPWfcX2+b5+v9fTv13Wer22vM/M532e3/O7nv/v+h9vKBSXmI5AVlbWzbAczsNcKBbTAOKdXd8RYMK7gJXm1zOiAtez8xu07y3mus9hbzfpmJsJMe8x3mGI7f8Ew1AXFiUkJCyLD8l/aASYvESoCIVjETb9FIE7oGywP3xFoRIkBvOCacqUhBRIDuZpRSbDMNgOZ+AsLIMXbGHSn8B3MAqqwEzYBUugLhSEj2AT7ICBUCTQxgP4psNekBwGpWsGyqnthTkQiYv8MjAINoBimQMtAm11wKe41U85SAfFtxl62bLexl8ZVsAa6AGtYS14UdzqN3h9i/Cpzki1hW4PP8M+aACaTN+uxriUK1cNeyWobld4EGbAKfCih8by0BRka6686Lpv8fF7je95WOULOa15fiVcBiMRtrmM7FRn05iCkxyB9WHr4s8BzCEXkxEr3dRvhNcGHSmEoTYrm7I2L2inqRzOJNgYzHTp901bQ02Zycb2Zkdf1msyavtM9AljB83Jvo60ydR1jjRpmS3BtitfiquXqoQTjYXeErITjXNOEoxlQE4Fnb+bAu5jCk3FfhK0w70sUYASHGu8E306kPZZuzH2+wR614Xa4fp6/ZGcg97QDH4BL3bShuMc79Bqt/Ksi+cL45yErZ2unS35C8KnCnqoHEbWYWsHe5npY/SajOBEabcq5m6wAKw0NvWsP2g3xxFsN0V18acGCm8mPQh6QXCRa/N95vK2oL0cM3E09E60Fk0n0Ck9ELxkqONXYRYshZIumGRsLxmmUbsAwscwhYb5gmhNpu5Zqn8WJJmmvhbWAhhhfO1Jexnq/V6TUQAW+wLoScpDl4Djzn8UXdT5dXx6GeZ8dgFMd77HfSH0avms4AtOVOQeTJ6u8VfwMt7X9Q6nx6I1sRWgEuhagu2mqC5+lbNi+2tpM7BtXjubZ+LQ7c6LvWUW907pQjyFjqbSaGwNYB10DXQKXE4WuwJrTcH5tHeG9EHaOYQub/JC5HVTmjwd3U0xq0AqXEp0j27gCuxG93B2bXQJZ2+g7dPOtvE0dD6rZrjECuO8orchXSPxz6J+NdeGYslOJlJ2oc2gnk3m1s68RMG9OeSlGv8++k0hXQw6Gf/uQmTo4t+Gj6GMybycecoVOG8KRo4gfD4/kk1fWrnD4UUoFMnIwaD8fWQNMNkvM6B/uvRtxn/C2PuMXcHY3gzn085J2ve+vOjfTSVdV74RrksTbd8MFuYQXJo+BPWEwaDJ3wwvQX24FjKVRrUCNfkz4BnQ4vuXcBE6kSaCf8oezqTNNQXtwtN1ZCfZ7WydUNEQu4BPRqPBKLZhx0PjpHk9DEdhJ0yDJoznGF3EG+ClFU49fCR7B9o2ZtxXZtKmHsiauFr6GvYcfeHOsjvZDmo/yugEkOyB9LB18WfXRTNUztj2VciWMUWiYlY1rVzLfkw3uTMZV7216DQuBZq/VHz2ZIw0pMy7IqlQyN9PGhnfrTRW2qTzat5pKh7U5Lt0Q+OvLpv+7kW9a/y3Y2fg15P7FNDCWAda1ZK78SVdMEP1nJaab+yrNX37iq8SjbUyDc4zdn4xF5lA+hJzgklHTO24g+B3vJ5afyT9YaREKKQvXn3ATojJzrW535SsRz99Sd8E9qGkCX4tvsqQ3cmj8m0giQWksqOw3wNdxzTSs9G9QXIaRoat6Pxsov2lNKWdpUWrWCRahGPDVv76GUo4usVKukMq8a9EK349G9WFCRq4z6EfSFo7jqC/hg5wFtbB1YqeuhVAHdBqTAPJGtA9VDv3N9DDlRaAROU16Dq+SkEtaAyKWzIAUuEh0MIRkix4nUWyPZyK3o9v37eoselIPwe9I79oYtK3E23c/i6me9DCSmENpAZRu7Ml6IFrA6RDBuyAJTQ2By2ZApow7S6tJMlqmBC2QqGfnJb6CiqCXgf1CniegJ7C/AC0+tSGjs4RoMn9FNIopw9JWoC1sNej/yHklcURvm2Rf4y0dqMeZFuAduVG0AOjjWUxPtXTwsgAL6Mw9MS81TsuoRuQ1xnqQ3FYBYPpR+NhZQiJZDgP2S3Anfi/hKJwBvaAZBOMAZ24x0Fj4CWY5299ylfs46AgWL/GXF8CF+F/DbRJFFcmKAaNvfq7vNBIdShw+ZLRK0F/OuK/ge2QCfrO/wMkRq+XnFuin+AHGy2g/53kdlK1u/SHQrNYjAD9PEI/XUAn00TQTlWsOkEqQFxiPQJMSlvQp1ctBH2+1RF2TYU+SsPToE+o+vZ9Dkpf005d4/RzQ5wAVzSWDEoNWA6SQ6A/bPRNXfefqAht6Tu7/u4cB/rGvxVKgo7/JVHpJBeN0Nf9YEXPKXFhRPT5uCf8YUZHi0Hv52/Cw5DrwaKs/hd4DHrDbNCDnUR/JqWD/vQpC6ehXaxmgL506tQCnQQ1YtVvrPtJyGuHDIoext6C7qCny6DolU7shmNwAnQf1+LQMV4OqkESWDlL4lvoz1PsNmXQV1dUW9DnSz3JxyW/jACTo78XO8H3oF2bV1lBxXegfPDa8LUB/VcRlyiPQJ5PgOziYJK0sx911ERXBX0L0K4vBBKdBDoZMkAfmFbBPHb2AXRcYjwCfwOrJv1Lo7qyjAAAAABJRU5ErkJggg=='
        ></image>
      </defs>
    </svg>
  )
}

export default AmazonPrime;
