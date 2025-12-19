/**
 * This component will show parantal pin status page
 *
 * @module views/components/ParentalPinStatus
 * @memberof -Common
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './ParentalPinStatus.scss';
import Button from '../Button/Button';
import { constants, USERS } from '../../../utils/constants';
import { getAgeRating, getDthStatus, getProfileId, setAgeRating } from '../../../utils/localStorageHelper';
import { usePubNubContext } from '../../core/PubNubContextProvider/PubNubContextProvider';
import { getOldStackAgeRating, getOtherStackAgeRating, getPubnubChannelName } from '../../../utils/util';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

/**
 * Represents a ParentalPinStatus component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ParentalPinStatus
 */
export const ParentalPinStatus = function( props ){
  const { messages } = usePubNubContext()
  const history = useHistory();
  const [rating, setRating] = useState( getAgeRating() )

  useEffect( ()=>{
    setRating( rating )
  }, [rating] )
  const { icon, title, categoryLabel, category, subtitle, content } = {
    icon: 'ParentalLock14x20',
    title: 'Parental Pin',
    pinStatusLabel: 'PIN Status',
    category : rating,
    categoryLabel : 'Viewing Restrictions',
    subtitle : 'Want to modify Parental PIN?',
    content :'You can change your Parental PIN and Viewing Restrictions from www.tataplaybinge.com or from Tata Play Binge Mobile App'
  }

  const onChangeAgeRating = ( findProfileId ) => {
    findProfileId.ageRatingMasterMapping && setAgeRating( findProfileId.ageRatingMasterMapping )
    findProfileId.ageRatingMasterMapping && setRating( findProfileId.ageRatingMasterMapping )
  }

  useEffect( () =>{
    if( messages[getPubnubChannelName()]?.message ){
      const pubnubPush = messages[getPubnubChannelName()].message
      if( getDthStatus() === USERS.DTH_OLD_STACK_USER ){
        const oldStackAgeRating = getOldStackAgeRating( pubnubPush )
        if( oldStackAgeRating && Array.isArray( oldStackAgeRating ) ){
          const findProfileId = oldStackAgeRating.find( data=> data.profileId === getProfileId() )
          if( findProfileId ){
            onChangeAgeRating( findProfileId )
          }
        }
      }
      else if( getDthStatus() !== USERS.DTH_OLD_STACK_USER ){
        const otherStackAgeRating = getOtherStackAgeRating( pubnubPush )
        if( otherStackAgeRating && Array.isArray( otherStackAgeRating ) ){
          const findProfileId = otherStackAgeRating.find( data=> data.profileId === getProfileId() )
          if( findProfileId ){
            onChangeAgeRating( findProfileId )
          }
        }
      }
    }
  }, [messages[getPubnubChannelName()]?.message] )

  return (
    <div className='ParentalPinStatus'>
      <div className='ParentalPinStatus__header'>
        <Button
          onClick={ ()=> history.goBack() }
          iconLeftImage='GoBack'
          iconLeft={ true }
          secondary={ true }
          label={ constants.GOBACK }
        />
        <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
      </div>
      <div className='ParentalPinStatus__topPanel'>
        <Icon className='ParentalPinStatus__topPanel__Icon'
          name={ icon }
        />
        <Text textStyle='header-2'>
          { title }
        </Text>
      </div>
      <div className='ParentalPinStatus__centerPanel'>
        <div className='ParentalPinStatus__centerPanel__bottom'>
          <Text textStyle='header-2'>
            { categoryLabel }
          </Text>
          <Text textStyle='parental-subtitle-3'>
            { category }
          </Text>
        </div>

      </div>
      <div className='ParentalPinStatus__bottomPanel'>
        <div className='ParentalPinStatus__bottomPanel__header'>
          <Text textStyle='parental-subtitle-1'>
            { subtitle }
          </Text>
        </div>
        <div className='ParentalPinStatus__bottomPanel__content'>
          <Text
            textStyle='parental-subtitle-2'
            htmlTag='span'
          >
            { content }
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
 * @property {boolean} toggleButton - Sets checkbox or toggle button display
 * @property {string} name - Sets the name attribute which is required field
 * @property {string} id - Sets id attribute for toggle button
 * @property {string} icon - provides the icon name
 * @property {string} title - provides parental pin title
 * @property {string} subtitle - provides parental pin subtitle
 * @property {string} categoryLabel - provides parental pin categoryLabel
 * @property {string} category - provides parental pin category
 * @property {string} pinStatusLabel - provides parental pin StatusLabel
 * @property {string} content - provides parental pin content
 */
export const propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  categoryLabel: PropTypes.string,
  pinStatusLabel: PropTypes.string,
  category: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.oneOfType( [PropTypes.string, PropTypes.number] ),
  toggleButton: PropTypes.bool
};

ParentalPinStatus.propTypes = propTypes;

export default ParentalPinStatus;
