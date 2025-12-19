/**
 * This component is used to show various notifications on a screen like success, warning etc.
 *
 * @module views/components/Notifications
 * @memberof -Common
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './Notifications.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import classNames from 'classnames';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';

/**
 * Represents a Notifications component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Notifications
 */
export const Notifications = function( props ){
  const { iconName, message } = props;

  const { configResponse } = useAppContext();
  const { config } = configResponse;

  const isPrimeNudgeMsg = useMemo( () => {
    return message?.includes( config?.primeVerbiages?.primeActivationVerbiage ) ||
           message?.includes( config?.primeVerbiages?.primeSubProcessMessage );
  }, [message, config] );

  return (
    <div className={ classNames( 'Notifications', {
      'Notifications--withPrimeNudge': isPrimeNudgeMsg
    } ) }
    >
      <Icon className='Notifications__icon'
        name={ iconName }
      />
      <Text
        textStyle='body-3'
        color='white'
        textAlign='center'
      >
        { message }
      </Text>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} iconName - Sets the iconName for notification
 * @property {string} message - Sets the message for notification
 */
export const propTypes =  {
  iconName: PropTypes.string,
  message: PropTypes.string
};

Notifications.propTypes = propTypes;

export default Notifications;
