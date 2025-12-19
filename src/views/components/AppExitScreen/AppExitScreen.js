/**
 *
 *
 * @module views/components/AppExitScreen
 * @memberof -Common
 */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import './AppExitScreen.scss';
import { constants } from '../../../utils/constants';
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { exitApp, keyCodeForBackFunctionality } from '../../../utils/util';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';

/**
 * Represents a AppExitScreen component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AppExitScreen
 */
export const AppExitScreen = function( props ){
  const { screenSaverVisible } = useMaintainPageState()
  const history = useHistory();
  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } )
  const previousPathName = useNavigationContext()

  useEffect( () => {
    setTimeout( ()=> setFocus( 'NO_BUTTON' ), 10 )
    previousPathName.navigationRouting = null
  }, [] );

  const noButtonClicked = () => {
    history.goBack()
  };

  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( keyCodeForBackFunctionality( keyCode ) ){
      if( screenSaverVisible.current ){
        return null;
      }
      history.goBack()
      previousPathName.navigationRouting = null
    }
  }, [screenSaverVisible] );

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => window.removeEventListener( 'keydown', onKeyPress );
  }, [] );

  return (
    <div className='AppExitScreen'
      ref={ ref }
    >
      <FocusContext.Provider value={ focusKey }>
        <div className='AppExitScreen__content'>
          {
            <Icon className='AppExitScreen__icon'
              name={ constants.APP_EXIT_SCREEN.iconName }
            />
          }
          {
            <Text
              textStyle='title-1'
              color='white'
              textAlign='center'
            >
              { constants.APP_EXIT_SCREEN.message }
            </Text> }

          {
            <Text
              textStyle='body-2'
              color='white'
              textAlign='center'
            >
              { constants.APP_EXIT_SCREEN.info }
            </Text> }

          {
            <div className='AppExitScreen__button'>
              <Button
                label={ constants.APP_EXIT_SCREEN.buttonLabelYes }
                onClick={ exitApp }
                focusKeyRefrence='YES_BUTTON'
                onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'YES_BUTTON' }
              />
              <Button
                label={ constants.APP_EXIT_SCREEN.buttonLabelNo }
                onClick={ noButtonClicked }
                focusKeyRefrence={ 'NO_BUTTON' }
                onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = 'NO_BUTTON' }
              />
            </div> }
        </div>
      </FocusContext.Provider>
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} iconName - Sets the icon for the AppExitScreen
 * @property {string} message - Sets the message for the AppExitScreen
 * @property {string} info - Sets the info for the AppExitScreen
 * @property {string} additionalInfo - Sets the additionalInfo for the AppExitScreen
 * @property {string} buttonLabelYes - Sets the button label for the AppExitScreen
 * @property {string} buttonLabelNo - Sets the button label for the AppExitScreen
 */
export const propTypes =  {
  iconName: PropTypes.string,
  message: PropTypes.string,
  info: PropTypes.string,
  additionalInfo: PropTypes.string,
  buttonLabelYes: PropTypes.string,
  buttonLabelNo: PropTypes.string
};


AppExitScreen.propTypes = propTypes;

export default AppExitScreen;
