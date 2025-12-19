/**
 * This component will show parantal pin information page
 *
 * @module views/components/ParentalPin
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ParentalPin.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import { constants } from '../../../utils/constants';
import { parental_pin_init } from '../../../utils/mixpanel/mixpanelService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

/**
 * Represents a ParentalPin component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ParentalPin
 */
export const ParentalPin = function( props ){

  const history = useHistory();

  useEffect( ()=>{
    /* Mixpanel-event */
    parental_pin_init()
  }, [] )

  const { icon, title, content } = {
    icon: 'ParentalLock48x68',
    title: 'Setup Parental Pin',
    content: 'You can setup your Parental PIN and viewing restrictions from tataplaybinge.com or Tata Play Binge Mobile App'
  }
  return (
    <div className='ParentalPin'>
      <div className='ParentalPin__header'>
        <Button
          onClick={ ()=> history.goBack() }
          iconLeftImage='GoBack'
          iconLeft={ true }
          secondary={ true }
          label={ constants.GOBACK }
        />
        <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
      </div>
      <div className='ParentalPin__container'>
        <div className='ParentalPin__icon'>
          <Icon name={ icon }></Icon>
        </div>
        <div className='ParentalPin__title'>
          <Text
            textStyle='header-1'
            htmlTag='span'
          >
            { title }
          </Text>
        </div>
        <div className='ParentalPin__content'>
          <Text
            textStyle='body-1'
            htmlTag='span'
          >
            { content }
          </Text>
        </div>
      </div>

    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} icon - provides the icon name
 * @property {string} title - provides parental pin title
 * @property {string} content - provides parental pin content
 */
export const propTypes =  {
  icon: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string
};


ParentalPin.propTypes = propTypes;
export default ParentalPin;
