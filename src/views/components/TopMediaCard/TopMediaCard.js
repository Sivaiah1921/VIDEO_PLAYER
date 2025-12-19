/**
 * Component to display top 10 type media cards
 *
 * @module views/components/TopMediaCard
 * @memberof -Common
 */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TopMediaCard.scss';
import HomeMediaCard from '../HomeMediaCard/HomeMediaCard';
import Image from '../Image/Image';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { LAYOUT_TYPE } from '../../../utils/constants';
import { cloudinaryCarousalUrl } from '../../../utils/util';

/**
 * Represents a TopMediaCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns TopMediaCard
 */
export const TopMediaCard = function( props ){
  const { configResponse, url } = useAppContext();
  const { config } = configResponse;
  const [iconFront, setIconFront] = useState( true )
  const bingeTopImages = useMemo( () => config?.new_images_binge_top_10, [config] ) || []
  return (
    props.position && bingeTopImages.length > 0 &&
    <div
      className={
        classNames( 'TopMediaCard',
          {
            'TopMediaCard--withFocus': props.isFocussed,
            'TopMediaCard--posTen': ( props.position === 10 )
          }
        ) }
    >
      <div className={
        classNames( 'TopMediaCard__indexIcon',
          { 'icon-front' : iconFront,
            'TopMediaCard__indexIcon--posTen': ( props.position === 10 )
          } ) }
      >
        <Image
          src={ `${ cloudinaryCarousalUrl( LAYOUT_TYPE.PORTRAIT, url, '', ( props.position === 10 ) ) }/${ bingeTopImages[props.position - 1] }` }
          alt='top-10'
        />
      </div>
      <div
        className={
          classNames( 'TopMediaCard__rightMedia', {
            'TopMediaCard__rightMedia--posOne': ( props.position === 1 ),
            'TopMediaCard__rightMedia--posTen': ( props.position === 10 )
          } )
        }
      >
        <div className='TopMediaCard__rightMedia--media'>
          <HomeMediaCard
            { ...props }
            setIconFront={ setIconFront }
            type={ 'portrait' }
            size={ 'top10' }
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {number} position - Top 10 card number to display left side of the content poster
 * @property {string} title - Card title
 * @property {string} image - Card image URL
 * @property {string} provider - Card content provider image URL
 * @property {string} url - redirection URL
 * @property {bool} isFocussed - If card is focussed or not
 */
export const propTypes =  {
  position: PropTypes.number,
  title: PropTypes.string,
  image: PropTypes.string,
  provider: PropTypes.string,
  isFocussed: PropTypes.bool,
  url: PropTypes.string
};

TopMediaCard.propTypes = propTypes;

export default TopMediaCard;