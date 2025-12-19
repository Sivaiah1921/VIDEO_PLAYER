/**
 * The UserProfileDetail component is a collection of icon with input fields for a user account or address, containing First Name and Last Name.
 *
 * @module views/components/UserProfileDetail
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import { constants } from '../../../utils/constants';
import './UserProfileDetail.scss';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import get from 'lodash/get';
import Image from '../Image/Image';

/**
 * Represents a UserProfileDetail component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns UserProfileDetail
 */
export const UserProfileDetail = function( props ){
  const { configResponse } = useAppContext();
  const { config } = configResponse;
  const awsBaseUrl = get( config, 'profile.awsUrl' );
  return (
    <div className='UserProfileDetail'>
      <div className='UserProfileDetail__leftPanel'>
        { props.profileImage ? (
          <Image
            src={ `${awsBaseUrl}${props.profileImage}` }
            alt={ constants.USER_PROFILE_DETAILS.PROFILE_IMAGE }
          />
        ) : (
          <Icon
            name={ constants.USER_PROFILE_DETAILS.ICON_IMAGE }
          />
        ) }
      </div>
      <div className='UserProfileDetail__rightPanel'>
        { props.profileName?.length > 0 &&
        <Text
          textStyle='header-4'
          color='white'
        >
          { props.profileName }
        </Text> }
        { props.aliasName &&
        <div className='UserProfileDetail__rightPanel--fireTv'>
          <Icon
            name={ constants.USER_PROFILE_DETAILS.TV_DETAILS_ICON }
            className='TvIcon'
          />
          <Text
            textStyle='header-4'
            color='bingeBlue-25'
          >
            { props.aliasName }
          </Text>
        </div> }
        <Text
          textStyle='autoPlay-subtitle'
          color='bingeBlue-25'
        >
          { props.mobileNumber }
        </Text>
        <Text
          textStyle='body-2'
          color='bingeBlue-25'
        >
          <span className='user_email'>{ props.mailId }</span>
        </Text>
      </div>
    </div>
  )
}



/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} iconImage - set the iconImage to use in icon
 * @property {string} profileName - set the profileName the toBeCalled and the name of the profile use
 * @property {string} tvDetails - set the tvDetails the toBeCalled to use in icon
 * @property {string} mobileNumber - set the mobileNumber the toBeCalled and use
 * @property {string} mailId - set the mailId toBeCalled to use
 */
export const propTypes = {
  iconImage: PropTypes.string,
  profileName: PropTypes.string,
  tvDetailsIcon: PropTypes.string,
  tvDetails: PropTypes.string,
  mobileNumber: PropTypes.string,
  aliasName: PropTypes.string,
  mailId: PropTypes.string
};

UserProfileDetail.propTypes = propTypes;

export default UserProfileDetail;
