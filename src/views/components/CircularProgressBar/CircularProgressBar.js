/**
 * This is circular progress bar to be shown in enxt episode tile
 *
 * @module views/components/CircularProgressBar
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './CircularProgressBar.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

/**
 * Represents a CircularProgressBar component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns CircularProgressBar
 */
export const CircularProgressBar = function( props ){
  const strokeWidth  = 10;

  // console.log( props.value ) // eslint-disable-line
  let counter = 20;
  return (
    <div className='CircularProgressBar'>
      <CircularProgressbar value={ props.value * counter }
        strokeWidth={ strokeWidth }
        styles={ buildStyles( {
          // How long animation takes to go from one percentage to another, in seconds
          // Can specify path transition in more detail, or remove it entirely
          pathTransition: '0.8s',

          // Colors
          pathColor: '#E10092',
          trailColor: '#8E81A1',
          backgroundColor: '#3e98c7'
        } ) }
      />
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};


CircularProgressBar.propTypes = propTypes;

export default CircularProgressBar;
