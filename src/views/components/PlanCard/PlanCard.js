/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * This component shows the subscription plan for users like monthly,quarterly &amp; yearly
 *
 * @module views/components/PlanCard
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './PlanCard.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import parse from 'html-react-parser';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
 * Represents a PlanCard component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PlanCard
 */
export const PlanCard = function( props ){
  const { onSelected, savings, icon, plan, amount, focusKeyRefrence, productId, type, tenureId, onFocus, flexiPlan } = props;
  const previousPathName = useNavigationContext();
  const history = useHistory();
  const { ref, focused, focusKey } = useFocusable(
    {
      focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
      isFocusBoundary: true,
      onEnterPress:() => {
        onSelected && onSelected( plan )
        if( flexiPlan ){
          props.handleFlexiTenureClick?.();
        }
        else if( productId ){
          history.push( {
            pathname: '/plan/purchase/' + productId + '/' + type + '/' + tenureId
          } )
        }
      },
      onFocus
    }
  );

  const onMouseUpCallBackFn = () =>{
    if( flexiPlan ){
      props.handleFlexiTenureClick?.();
    }
    else if( productId ){
      previousPathName.selectedtenure = plan
      history.push( {
        pathname: '/plan/purchase/' + productId + '/' + type + '/' + tenureId
      } )
    }
  }

  const PlancardDetails = (
    <div className={ focused ? 'PlanCard PlanCard--withFocus ' : 'PlanCard' }
      role='button'
      tabIndex={ 0 }
      onClick={ () => onSelected( plan ) }
      ref={ ref }
      onMouseEnter={ props?.onMouseEnterCallBackFn }
      onMouseUp={ onMouseUpCallBackFn }
    >
      { savings !== '' && (
        <div className='PlanCard__savings'>
          <Text
            textStyle='planCard-subtitle'
            color='white'
          >
            Save { savings }
          </Text>
        </div>
      ) }
      <div className='PlanCard__container'>
        <div className='PlanCard__icon'>
          <Icon
            name={ icon }
          />
        </div>
        <Text
          textStyle='body-2'
          color='bingeBlue-100'
        >
          { plan }
        </Text>
      </div>
      <div className='PlanCard__amount'>
        { amount &&
        <Text
          textStyle='body-2'
          color='bingeBlue-100'
        >
          { parse( amount ) }
        </Text> }
      </div>
    </div>
  )

  return PlancardDetails
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {func} onSelected - func to select plancard
 * @property {string} savings - offer string
 * @property {string} icon - icon class
 * @property {string} plan - plan info
 * @property {string} amount - plan amount
 * @property {string} focusKeyRefrence - ref for spatial navigation
 * @property {string} productId - pack Id
 * @property {string} type - type either tenure/upgrade
 */
export const propTypes = {
  onSelected:PropTypes.func,
  savings: PropTypes.string,
  icon: PropTypes.string,
  plan: PropTypes.string,
  amount: PropTypes.string,
  focusKeyRefrence: PropTypes.string,
  productId: PropTypes.string,
  type:PropTypes.string
};

PlanCard.propTypes = propTypes;

export default PlanCard;
