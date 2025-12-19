/**
 * This component has some new design changes
 *
 * @module views/components/ComboPack
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import './ComboPack.scss';
import Text from '../Text/Text';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
import parse from 'html-react-parser';
import AppMediaCard from '../AppMediaCard/AppMediaCard';

/**
  * Represents a ComboPack component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns ComboPack
  */
export const ComboPack = function( props ){
  return (
    <div className='ComboPack'>
      <div className='ComboPack__header'>
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
      <div className='ComboPack__container'>
        <div className='ComboPack__container--header'>
          <div className='ComboPack__container--crown'>
            <Icon name={ 'CrownWithBG' } />
            <Text
              textAlign='left'
              textStyle='body-3'
              color='bingeBlue-75'
            >
              { props.upgradeMyPlanType }
            </Text>
          </div>

          <div className='ComboPack__container--amount'>
            <span className='ComboPack__container--amountFirst'> { parse( `&#8377;${ Number( props.amountValue ).toFixed( 0 ) }` ) }</span><span className='ComboPack__container--amountLast'>{ props.amountTimePeriod }</span>
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
        <div className='ComboPack__container--section'>
          <div className='ComboPack__container--apps'>
            {
              props.apps.length > 16 ? props.apps.slice( 0, 16 )?.map( ( elm, index ) => (
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
              props.apps.length > 16 && (
                <div className='ComboPack__container--remainingApps'>
                  <Text>{ `+${props.apps.length - 16} More` }</Text>
                </div>
              )
            }
          </div>

          <>
            <Icon name={ 'DividerWithPlusGrey' }
              className='ComboPack__container--dividerSVG'
            />
            <div className='ComboPack__container--tvChannelsBox'>
              <div className={ 'ComboPack__container--tvChannelsBox--title' }>
                <Text
                  textAlign='left'
                  textStyle='subtitle-2'
                  color='bingeBlue-75'
                >
                  { props.comboInfo?.ottChannels }
                </Text>
              </div>
              <div className='ComboPack__container--tvHDSDBox'>
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
        classNames( 'ComboPack__diclaimer', {
          'ComboPack__diclaimerSuperComboPackApps': props.supperComboPack
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
      <div className='ComboPack__footer'>
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

ComboPack.propTypes = propTypes;
ComboPack.defaultProps = defaultProps;

export default ComboPack;
