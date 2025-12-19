/**
 * This component gives info about subscription
 *
 * @module views/components/SubscriberCard
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './SubscriberCard.scss';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import constants from '../../../utils/constants';

/**
 * Represents a SubscriberCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns SubscriberCard
 */
export const SubscriberCard = function( props ){
  const { icon, focusKeyRefrence, onCardClick, onFocus, statusType, subscriptionProfileName, aliasName } = props;
  let subscriberSelected = false;
  const { ref, focused } = useFocusable(
    {
      onEnterPress:( ) => {
        subscriberSelected = true
        onCardClick()
      },
      focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null,
      onFocus
    }
  );

  const onMouseUpCallBackFn = () =>{
    subscriberSelected = true
    onCardClick()
  }

  return (
    <div
      className={
        classNames( 'SubscriberCard', {
          'SubscriberCard--withFocus': focused
        } ) }
      key={ props.index }
      ref={ ref }
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseUp={ onMouseUpCallBackFn }
      role='button'
      tabIndex='0'
    >
      <div className='SubscriberCard__container'>
        {
          statusType && (
            <div className={ statusType.toLowerCase() === constants.ACTIVE_STATUS ? 'SubscriberCard__container__Text SubscriberCard__container__Active' : 'SubscriberCard__container__Text SubscriberCard__container__Inactive' }>
              <Text>
                { statusType }
              </Text>
            </div>
          )
        }
        <div className='SubscriberCard__container__Packname'>
          <Text>
            { subscriptionProfileName }
          </Text>
        </div>
        <div className='SubscriberCard__container__Aliasname'>
          <Text>
            { aliasName }
          </Text>
        </div>
      </div>
      { icon &&
        <Icon className='SubscriberCard__icon'
          name={ icon }
        />
      }

    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} icon - provides icon name
 * @property {string} url - provides redirect url
 * @property {string} accountStatus - provides subscription accountStatus, optional
 * @property {string} subscriberId - provides subscription id
 */
export const propTypes =  {
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  accountStatus: PropTypes.string,
  subscriberId: PropTypes.string.isRequired
};


SubscriberCard.propTypes = propTypes;

export default SubscriberCard;
