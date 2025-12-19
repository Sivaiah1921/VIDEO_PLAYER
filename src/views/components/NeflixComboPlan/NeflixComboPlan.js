/**
 * This component has some new design changes
 *
 * @module views/components/NeflixComboPlan
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './NeflixComboPlan.scss';
import Text from '../Text/Text';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
import parse from 'html-react-parser';
import AppMediaCard from '../AppMediaCard/AppMediaCard';

/**
 * Represents a NeflixComboPlan component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns NeflixComboPlan
 */
export const NeflixComboPlan = function( props ){
  return (
    <div className='NeflixComboPlan'>
      <div className='NeflixComboPlan__header'>
        <Text
          textAlign='center'
          textStyle='title-1'
          color='white'
          htmlTag='span'
        >
          { props.comboInfo?.planTitle }
        </Text>
        <Text
          textAlign='center'
          textStyle='body-3'
          color='white'
          htmlTag='span'
        >
          { props.comboInfo?.netflixDTO?.netflixHeader }
        </Text>
      </div>
      <div className='NeflixComboPlan__container'>
        <div className='NeflixComboPlan__container--header'>
          <div className='NeflixComboPlan__container--crown'>
            <Icon name={ 'CrownWithBG' } />
            <Text
              textAlign='left'
              textStyle='body-3'
              color='bingeBlue-75'
            >
              { props.upgradeMyPlanType }
            </Text>
          </div>

          <div className='NeflixComboPlan__container--amount'>
            <span className='NeflixComboPlan__container--amountFirst'> { parse( `&#8377;${ Number( props.amountValue ).toFixed( 0 ) }` ) }</span><span className='NeflixComboPlan__container--amountLast'>{ props.amountTimePeriod }</span>
          </div>
        </div>
        <div>
          <Text
            textAlign='left'
            textStyle='body-5'
            color='bingeBlue-75'
          >
            { props.upgradeMyPlanExpire }
          </Text>
        </div>
        <div className='NeflixComboPlan__container--section'>
          <div className='NeflixComboPlan__container--apps'>
            {
              props.apps.length > 18 ? props.apps.slice( 0, 18 )?.map( ( elm, index ) => (
                <AppMediaCard
                  title={ elm.title }
                  image={ elm.image }
                  isSubscritionModule={ true }
                />
              ) ) : (
                props.apps.map( ( elm, index ) => (
                  <AppMediaCard
                    title={ elm.title }
                    image={ elm.image }
                    isSubscritionModule={ true }
                  />
                ) )
              ) }
            {
              props.apps.length > 18 && (
                <div className='NeflixComboPlan__container--remainingApps'>
                  <Text>{ `+${props.apps.length - 18} More` }</Text>
                </div>
              )
            }
          </div>

          <>
            <Icon name={ 'DividerWithPlusGrey' }
              className='NeflixComboPlan__container--dividerSVG'
            />
            <div className={ 'NeflixComboPlan__container--centerBox' }>
              <div className={ 'NeflixComboPlan__container--centerBoxBanner' }>
                <Icon name='Netflix' />
                <Text
                  textAlign='left'
                  textStyle='subtitle-2'
                  color='white'
                >
                  { props.netflixData?.deviceVerbiage }
                </Text>
              </div>
              <Text
                textAlign='left'
                textStyle='subtitle-2'
                color='bingeBlue-75'
              >
                { props.netflixData?.verbiage }
              </Text>
            </div>
          </>
          <>
            <Icon name={ 'DividerWithPlusGrey' }
              className='NeflixComboPlan__container--dividerSVG'
            />
            <div className='NeflixComboPlan__container--tvChannelsBox'>
              <div className={ 'NeflixComboPlan__container--tvChannelsBox--title' }>
                <Text
                  textAlign='left'
                  textStyle='subtitle-2'
                  color='bingeBlue-75'
                >
                  { props.comboInfo?.ottChannels }
                </Text>
              </div>
              <div className='NeflixComboPlan__container--tvHDSDBox'>
                <Icon name={ 'ComboHD' } />
                <Text
                  textAlign='right'
                  textStyle='subtitle-2'
                  color='bingeBlue-75'
                >
                  { props.comboInfo?.channels.find( d => d.name === 'HD' ) ? props.comboInfo?.channels.find( d => d.name === 'HD' ).count : 0 }
                </Text>
                <Icon name={ 'ComboSD' } />
                <Text
                  textAlign='right'
                  textStyle='subtitle-2'
                  color='bingeBlue-75'
                >
                  { props.comboInfo?.channels.find( d => d.name === 'SD' ) ? props.comboInfo?.channels.find( d => d.name === 'SD' ).count : 0 }
                </Text>
              </div>
            </div>
          </>
        </div>


      </div>
      <div className={
        classNames( 'NeflixComboPlan__diclaimer', {
          'NeflixComboPlan__diclaimerSuperComboPackApps': props.supperComboPack
        } )
      }
      >
        <Text
          textAlign='left'
          textStyle='subtitle-2'
          color='purple-25'
        >
          { props.comboInfo.verbiage }
        </Text>
      </div>
      <div className='NeflixComboPlan__footer'>
        <Text
          textAlign='center'
          textStyle='subtitle-2'
          color='purple-25'
        >
          { props.comboInfo?.footerVerbiageFirst }
        </Text>
        <Text
          textAlign='center'
          textStyle='subtitle-2'
          color='purple-25'
        >
          { props.comboInfo?.footerVerbiageSecond }
        </Text>
      </div>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} example - refactor or delete
 */
export const propTypes =  {
  example: PropTypes.string
};

/**
 * Default values for passed properties
 *
 * @type {object}
 * @property {string} example='hello world' - The default refactor or delete
 */
export const defaultProps =  {
  example: 'hello world'
};

NeflixComboPlan.propTypes = propTypes;
NeflixComboPlan.defaultProps = defaultProps;

export default NeflixComboPlan;
