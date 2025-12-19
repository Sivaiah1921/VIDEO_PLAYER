/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 * As an anonymous or authenticated, when on my account page I should see account card component if received from the back end services.
 *
 * @module views/components/AccountCard
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import './AccountCard.scss';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

/**
 * Represents a AccountCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AccountCard
 */
export const AccountCard = function( props ){
  const { title, iconName, url, onFocus, onPressHandleFn, focusKeyRefrence, textStyle, profileLoading } = props;
  const { ref, focused, focusKey } = useFocusable( { onFocus,
    onEnterPress:( )=>{
      onPressHandleFn()
    },
    onArrowPress:( direction )=>{
      if( profileLoading ){
        return false
      }
      else {
        return true
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } )

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className={ classNames( 'AccountCard', {
        'AccountCard--withFocus': focused
      } ) }
      ref={ ref }
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseUp={ props?.onMouseUpCallBackFn }
      >
        <Icon
          name={ iconName }
          className='AccountCard__icon'
        />
        <Text
          textStyle={ textStyle }
          color='white'
          textAlign='center'
        >
          { title }
        </Text>
      </div>
    </FocusContext.Provider>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - language card title
 * @property {string} image - language card image src
 * @property {string} url - language card redirection url
 */
export const propTypes =  {
  title: PropTypes.string,
  iconName: PropTypes.string,
  url: PropTypes.string
};


AccountCard.propTypes = propTypes;

export default AccountCard;
