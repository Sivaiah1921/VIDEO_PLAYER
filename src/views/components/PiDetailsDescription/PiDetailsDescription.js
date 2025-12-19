/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/**
 * PI details description
 *
 * @module views/components/PiDetailsDescription
 * @memberof -Common
 */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import './PiDetailsDescription.scss';
import classNames from 'classnames';
import { useParams, useHistory } from 'react-router-dom';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import constants, { isTizen } from '../../../utils/constants';
import { isLiveContentType } from '../../../utils/slayer/PlayerService';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';

/**
 * Represents a PiDetailsDescription component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns PiDetailsDescription
 */
export const PiDetailsDescription = function( props ){
  const { onFocus, modalRef, focusKeyRefrence, cardTitle, durationLive, iconUrl, year, time, category, ageLimit, partnerSubscriptionType, provider, contractName, language, showExpiredText, contentType, descriptionLive, freeEpisodesAvailable, showLiveUI, newRailSectionSource, secondaryText, description, renderSencondaryText, liveContent } = props;
  const history = useHistory();
  const { configResponse, url } = useAppContext();
  const { parentContentType } = useParams();
  const { config } = configResponse;

  const type = useMemo( () => {
    return parentContentType || contentType
  }, [parentContentType, contentType] );

  const [isSamsungTV, setSamsungTV] = useState( false );
  const { ref, focused } = useFocusable( {
    onEnterPress: ( ) => {
      props.openModal()
    },
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onFocus
  } );

  const onMouseEnterCallBackFn = ( ) => {
    setFocus( 'BUTTON_MODAL' )
  }
  const onMouseEnterFn = ( ) => {
    setTimeout( ()=>{
      props.openModal()
    }, 100 )
  }

  useEffect( ()=>{
    isTizen ? setSamsungTV( true ) : setSamsungTV( false );
  }, [] );

  return (
    props?.fromPlaybackInfo ? (
      <div
        ref={ ref }
        className={
          classNames( 'PiDetailsDescription' )
        }
      >
        <div className={
          classNames( 'PiDetailsDescription__content', {
            'PiDetailsDescription__content--otherTv': !isSamsungTV
          } ) }
        >
          <Text
            textStyle='pi-description'
            color='white'
            htmlTag='div'
          >
            { props.description }
            { props.btnLabel &&
            <div
              className={
                classNames( 'PiDetailsDescription__link', {
                  'PiDetailsDescription__link--focused': focused
                } )
              }
            >
              <div style={ { 'display': 'flex', alignItems: 'center' } }
                onMouseUp={ onMouseEnterFn }
                onMouseOver={ onMouseEnterCallBackFn }
              >
                <Icon
                  className='PiDetailsDescription__Icon'
                  name={ props.iconImage }
                />
                <Text
                  textStyle='body-2'
                  color='pink-25'
                >
                  { props.btnLabel }
                </Text>
              </div>

            </div> }
          </Text>
        </div>
      </div>
    ) : (
      <div
        ref={ ref }
        className={
          classNames( 'PiDetailsDescriptionHome' )
        }
      >
        <div className={
          classNames( 'PiDetailsDescriptionHome__content', {
            'PiDetailsDescriptionHome__content--otherTv': !isSamsungTV
          } ) }
        >
          <Text textStyle='pi-description'
            color='white'
            htmlTag='div'
          >
            { renderSencondaryText ? secondaryText : description }

            { props.btnLabel &&
            <div
              className={
                classNames( 'PiDetailsDescriptionHome__link', {
                  'PiDetailsDescriptionHome__link--focused': focused
                } )
              }
            >
              <div style={ { 'display': 'flex', alignItems: 'center' } }
                onMouseUp={ onMouseEnterFn }
                onMouseOver={ onMouseEnterCallBackFn }
              >
                <Icon
                  className='PiDetailsDescriptionHome__Icon'
                  name={ props.iconImage }
                />
                <Text
                  textStyle='body-2'
                  color='pink-25'
                >
                  { props.btnLabel }
                </Text>
              </div>

            </div> }
          </Text>
        </div>
        <div className={ classNames( 'PiDetailsDescriptionHome__tag', {
          'PiDetailsDescriptionHome__tags--row': props.tagInfoDTO?.length > 2
        } ) }
        >
          { isLiveContentType( type ) || liveContent ? (
            <div className='PiDetailsDescriptionHome__tags PiDetailsDescriptionHome__tags--live'>

              <div className='PlaybackInfo__liveContent'>
                <div className='PlaybackInfo__liveCircle' />
                <Text color='white'>{ constants.LIVE }</Text>
              </div>
              { props.tagInfoDTO?.map( ( tag, index ) => (
                <div key={ index }
                  className='PiDetailsDescriptionHome__tagItem'
                >
                  <img src={ tag.tagImage }
                    alt={ tag.tagText }
                    className='PiDetailsDescriptionHome__tagImage'
                  />
                  <Text textStyle='body-3'
                    color='white'
                  >{ tag.tagText || 'TAG' }</Text>
                </div>
              ) ) }
            </div>
          ) : (
            <div className='PiDetailsDescriptionHome__tags'>
              { props.tagInfoDTO?.map( ( tag, index ) => (
                <div key={ index }
                  className='PiDetailsDescriptionHome__tagItem'
                >
                  <img src={ tag.tagImage }
                    alt=''
                    className='PiDetailsDescriptionHome__tagImage'
                  />
                  <div className='PiDetailsDescriptionHome__tagText'>
                    <Text
                      color='white'
                    >{ tag.tagText || 'TAG' }</Text>
                  </div>
                </div>
              ) ) }
            </div>
          ) }
        </div>

      </div>
    )
  );
};

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} description - set the description
 * @property {string} iconImage - set the iconImage
 * @property {string} description - set the btnLabel
 */
export const propTypes = {
  description: PropTypes.any,
  iconImage: PropTypes.string,
  btnLabel: PropTypes.string
};

PiDetailsDescription.propTypes = propTypes;

export default PiDetailsDescription;
