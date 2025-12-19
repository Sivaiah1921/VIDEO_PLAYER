/**
 * Confetti
 *
 * @module views/components/Confetti
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import './Confetti.scss';

/**
 * Represents a Confetti component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Confetti
 */
export const Confetti = function( props ){
  const [windowDimension, setDimension] = useState( { width: window.innerWidth, height: window.innerHeight } );

  const detectSize = () => {
    setDimension( { width: window.innerWidth, height: window.innerHeight } );
  };

  useEffect( () =>{
    window.addEventListener( 'resize', detectSize );
    return () => {
      window.removeEventListener( 'resize', detectSize );
    };
  }, [windowDimension] );

  return (
    <div className='Confetti'>
      <ReactConfetti
        width={ windowDimension.width }
        height={ windowDimension.height }
        colors={ [
          '#FFD700'
        ] }
        tweenDuration={ 5000 }
        scalar={ 5000 }
        particleCount={ 5000 }
        resize
        spread={ 360 }
        startVelocity={ 45 }
        ticks={ 600 }
        useWorker
        recycle={ false }
        numberOfPieces={ 400 }
        shapes={ [
          'square'
        ] }
        onConfettiComplete={ props.onConfettiComplete }
      />
    </div>
  )
}

export default Confetti;
