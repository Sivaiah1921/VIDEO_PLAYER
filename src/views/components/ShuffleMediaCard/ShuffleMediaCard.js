/**
 * Shuffle media card molecule to display at first of every rails
 *
 * @module views/components/ShuffleMediaCard
 * @memberof -Common
 */
import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './ShuffleMediaCard.scss';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { shuffle_click } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';


/**
 * A click handler for the shuffle card
 * @method
 * @param {Object} event
 * @returns false
 */
export const handleOnClick = ( props ) => {
  return function( e ){
    if( props.onClick ){
      props.onClick( e );
    }
    shuffle_click( props.mixPanelTitle, props.railPosition )
  }
};

/**
 * Represents a ShuffleMediaCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ShuffleMediaCard
 */
const ShuffleMediaCard = forwardRef( ( props, _ref ) => {
  const { title, icon, onPressHandleFn, onBlur, onFocus, focusKeyRefrence, setHomeCaroselInfo, topPositionRailValue, setShuffleCurrent, setShuffleCardFocus } = props;
  const previousPathName = useNavigationContext()
  const { topPositionRailValueContext } = useMaintainPageState() || null
  const { ref, focused } = useFocusable( {
    onBlur,
    onFocus,
    onEnterPress:()=>{
      shuffle_click( props.mixPanelTitle, props.railPosition )
      onPressHandleFn()
    },
    onArrowPress:( direction )=>{
      if( direction === 'up' && topPositionRailValueContext.current === 0 ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
        setShuffleCurrent( true )
      }
      if( direction === 'up' || direction === 'down' || direction === 'right' ){
        setShuffleCardFocus( false )
      }
      if( direction === 'left' ){
        setShuffleCardFocus( true )
      }
    },
    isFocusBoundary: true,
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const onMouseEnterFn = () => {
    onPressHandleFn()
  }

  const onMouseLeaveFn = () => {
    setShuffleCardFocus( false )
  }

  return (
    <div
      className={ focused ? 'ShuffleMediaCardFocus' : 'ShuffleMediaCard' }
      ref={ ref }
      onClick={ handleOnClick( props ) }
      aria-hidden='true'
      onMouseEnter={ props?.onMouseEnterCallBackShuffleFn }
      onMouseUp={ onMouseEnterFn }
      onMouseLeave={ onMouseLeaveFn }
    >
      <Icon
        className={ focused ? 'ShuffleMediaCardFocus__Icon' : 'ShuffleMediaCard__Icon' }
        name={ icon }
      />
      <Text
        textStyle='numberInput'
        textAlign='center'
      >
        { title }
      </Text>
    </div>
  )
} );

/**
 * Property type definitions
 *
 * @type {object}
 * @property {function} onClick - on click handler to fire API request to shuffle card
 * @property {string} title - title to display on shuffle card
 * @property {string} icon - icon name
 */
export const propTypes =  {
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

ShuffleMediaCard.propTypes = propTypes;

export default ShuffleMediaCard;
