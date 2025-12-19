/**
 * The UserAccountetail component is a collection of icon with input fields for a user account or address, containing First Name and Last Name.
 *
 * @module views/components/UserAccountDetail
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import { constants, USERS } from '../../../utils/constants';
import './UserAccountDetail.scss';
import { getDthStatus } from '../../../utils/localStorageHelper';
import { useSubscriptionContext } from '../../core/SubscriptionContextProvider/SubscriptionContextProvider';

/**
 * Represents a UserAccountDetail component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns UserAccountDetail
 */
export const UserAccountDetail = function( props ){
  const { responseData } = useSubscriptionContext( );
  const myPlanProps = responseData.currentPack
  return (
    <div className='UserAccountDetail'>
      { getDthStatus() === USERS.NON_DTH_USER && myPlanProps && Object.keys( myPlanProps ).length > 0 && myPlanProps.paymentMethod &&
      <div className='UserAccountDetail__row'>
        <Text
          textStyle='autoPlay-subtitle'
          color='bingeBlue-25'
        >
          { constants.USER_ACCOUNT_DETAILS.PAYMENT_METHOD }
        </Text>
        <Text
          textStyle='autoPlay-subtitle'
          color='white'
        >
          { myPlanProps.paymentMethod }
        </Text>
      </div>
      }
      { getDthStatus() !== USERS.NON_DTH_USER &&
      <div className='UserAccountDetail__row'>
        <Text
          textStyle='autoPlay-subtitle'
          color='bingeBlue-25'
        >
          { constants.USER_ACCOUNT_DETAILS.USER_NAME }
        </Text>
        <Text
          textStyle='autoPlay-subtitle'
          color='white'
        >
          { props.balance }
        </Text>
      </div> }
      {
        props.lastRefreshtime && (
          <div className='UserAccountDetail__row'>
            <Text
              textStyle='autoPlay-subtitle'
              color='bingeBlue-25'
            >
              { props.lastRefreshtime }
            </Text>
          </div>
        )
      }
      {
        props.rechargeDueDate && (
          <div className='UserAccountDetail__row'>
            <Text
              textStyle='autoPlay-subtitle'
              color='bingeBlue-25'
            >
              { `Recharge Due On ${ props.rechargeDueDate }` }
            </Text>
          </div>
        )
      }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} userName - set the userName to use in icon
 * @property {string} balance - set the balance the toBeCalled and the name of the profile use
 * @property {string} lastRefreshtime - set the lastRefreshtime the toBeCalled and use
 * @property {string} rechargeDueDate - set the rechargeDueDate toBeCalled to use
 */
export const propTypes = {
  userName: PropTypes.string,
  balance: PropTypes.string,
  lastRefreshtime: PropTypes.string,
  rechargeDueDate: PropTypes.string
};

export const defaultProps = {
  userName: 'Tata Play Balance'
};

UserAccountDetail.propTypes = propTypes;
UserAccountDetail.defaultProps = defaultProps;

export default UserAccountDetail;
