/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useHistory } from 'react-router-dom';
import './SelectLanguage.scss';
import { getAuthToken, getPrefferedLanguageGuest } from '../../../utils/localStorageHelper';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import Button from '../Button/Button';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import { LANGUAGE_NUDGE } from '../../../utils/constants';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';

function SelectLanguage( props ){
  const { onFocus, focusKeyRefrence, setHomeCaroselInfo, topPositionRailValue, setCaroselPageView } = props;
  const history = useHistory();
  const preferredLanguageGuest = getPrefferedLanguageGuest();
  const profileContext = useProfileContext();
  const { profileAPIResult } = profileContext;
  const { setLastFocusFrom, lastFocusFrom, homeDonglePageData, topPositionRailValueContext } = useMaintainPageState() || null
  const { setContentInfo } = useHomeContext()

  const { ref, focused } = useFocusable( {
    onFocus,
    onEnterPress: () => {
      onSelectLanguageClick()
    },
    onArrowPress:( direction )=>{
      lastFocusFrom && setLastFocusFrom( false )
      if( direction === 'up' && topPositionRailValueContext.current === 0 ){
        setHomeCaroselInfo && setHomeCaroselInfo( true )
      }
    },
    focusKey: focusKeyRefrence ? `${focusKeyRefrence}` : null
  } );

  const onSelectLanguageClick = () => {
    history.push( {
      pathname: '/content/languages',
      args: {
        fromNudge: true
      } } );
  }
  const showLanguageNudge = () => {
    if( getAuthToken() ){
      return !profileAPIResult?.data?.languageList?.length > 0
    }
    else {
      return !preferredLanguageGuest
    }
  }

  if( showLanguageNudge() ){
    return (
      <div
        ref={ ref }
        className='SelectLanguage'
      >
        <div className='SelectLanguage__subContainer'>
          <Icon name='PersonalisedLanguage'
            className='SelectLanguage__subContainer--langSvg'
          />

          <div>
            <div
              className={
                classNames( 'SelectLanguage__subContainer--langMessage',
                  { 'SelectLanguage__subContainer--withFocus': focused },
                ) }
            >
              <Button
                label={ LANGUAGE_NUDGE.SELECT_LANGUAGE }
                primary={ true }
                className={ 'SelectLanguage__subContainer--Btn' }
                languageNudgeCallBack={ setCaroselPageView }
                onClick={ onSelectLanguageClick }
                onFocus={ ()=> {
                  homeDonglePageData.current = null
                  setContentInfo( {} )
                } }
              />
              <Text
                textStyle='lang-text'
              >
                { LANGUAGE_NUDGE.PERSONALISED_MESSAGE }
              </Text>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SelectLanguage;