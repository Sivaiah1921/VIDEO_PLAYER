/**
 * PI Series details description
 *
 * @module views/components/PISeriesDetails
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import './PISeriesDetails.scss';
/**
  * Represents a PISeriesDetails component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns PISeriesDetails
  */
export const PISeriesDetails = function( props ){
  return (
    <div className='PISeriesDetails'>
      <div className='PISeriesDetails__content'>
        <div className='PISeriesDetails__duration'>
          <Text
            textStyle='seriesDetail-title'
          >
            { props.episodeDate ? ( `${ props.episodeDate } |  ${ props.duration }m` ) : `${ props.duration }m` }
          </Text>
        </div>
        <div className='PISeriesDetails__title'>
          <Text
            textStyle='seriesDetail-title'
            color='white'
          >
            { props.title }
          </Text>
        </div>
        <div className='PISeriesDetails__description'>
          <Text
            textStyle='seriesDetail-subtitle'
            color='white'
          >
            { props.description }
          </Text>
        </div>
      </div>
    </div>
  );
};

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} description - set the description
  * @property {any} duration - set the duration
  * @property {string} episodeDate - set the episodeDate
  * @property {string} title - set the btnLabel
  */
export const propTypes = {
  description: PropTypes.string.isRequired,
  duration: PropTypes.any,
  episodeDate: PropTypes.string,
  title: PropTypes.string.isRequired
};

PISeriesDetails.propTypes = propTypes;

export default PISeriesDetails;
