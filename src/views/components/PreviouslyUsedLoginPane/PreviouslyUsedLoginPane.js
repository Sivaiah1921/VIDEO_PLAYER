/* eslint-disable no-console */
/**
 * PreviouslyUsedLoginPane card molecule
 *
 * @module views/components/PreviouslyUsedLoginPane
 * @memberof -Common
 */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text/Text';
import './PreviouslyUsedLoginPane.scss';
import Button from '../Button/Button';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import PreviousUsedLogin from '../PreviousUsedLogin/PreviousUsedLogin';
import { constants } from '../../../utils/constants';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';

/**
  * Represents a PreviouslyUsedLoginPane component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns PreviouslyUsedLoginPane
  */

const PreviouslyUsedLoginPane = ( props ) => {

  const previousPathName = useNavigationContext()
  const { ref, focusKey, focusSelf } = useFocusable();

  useEffect( () => {
    if( !props.fromQRLogin ){
      setTimeout( ()=> focusSelf(), 100 )
    }

  }, [focusSelf] );

  const onMouseEnterCallBackFn = ( id ) => {
    setFocus( `LOGIN_CARD_${id}` )
  }

  const [arrowDown, setArrowDown] = useState( false );
  const onRailFocus = useCallback( ( { y, ...rest }, index ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `LOGIN_CARD_${index}`
    rest.top > 550 ? setArrowDown( true ) : setArrowDown( false );
    if( ref.current ){
      ref.current.scrollTop = rest.top - 550
    }
  }, [ref] );

  return (
    <FocusContext.Provider value={ focusKey }>
      <div
        className={ props.enableQrLoginJourney && !props.QrError ? 'PreviouslyUsedLoginPane--QRLogin' : 'PreviouslyUsedLoginPane' }
      >
        <div className='PreviouslyUsedLoginPane__container'
          id='scrollContainer'
        >
          <div className='PreviouslyUsedLoginPane__left'>
            { ( !props.enableQrLoginJourney || props.QrError ) && (
              <div className='PreviouslyUsedLoginPane__headingInfo'>
                <div className='PreviouslyUsedLoginPane__title'>
                  <Text textStyle='header-2'>
                    { props.loginVerbiage?.logInVerbiage || constants.PREVIOUSLY_USED_LOGIN.LOG_IN }
                  </Text>
                </div>
                <div className='PreviouslyUsedLoginPane__info'>
                  <Text textStyle='body-3'>
                    { props.loginVerbiage?.logInPrevVerbiage || constants.PREVIOUSLY_USED_LOGIN.PREVIOUSLY_USED }
                  </Text>
                </div>
              </div>
            ) }
            <div className='PreviouslyUsedLoginPane__content'
              id='scrollContainer'
              ref={ ref }
            >
              <InfiniteScroll
                dataLength={ Number( props?.mobileNumbersList.length ) }
                scrollableTarget='scrollContainer'
                className='PreviouslyUsedLoginPane__multiRMN'
              >
                { props?.mobileNumbersList?.map( ( user, index ) => (
                  <PreviousUsedLogin
                    key={ index }
                    user={ user }
                    index={ index }
                    onFocus={ ( e ) => onRailFocus( e, index ) }
                    onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
                    focusKeyRefrence={ `LOGIN_CARD_${index}` }
                    enableQrLoginJourney={ props.enableQrLoginJourney }
                    QrError={ props.QrError }
                  />
                ) )
                }
              </InfiniteScroll>
              <div className={ props?.mobileNumbersList?.length > 6 ? 'PreviouslyUsedLoginPane__contentButton' : 'PreviouslyUsedLoginPane__parentRMNList' }>
                <Button
                  onFocus={ ()=>{
                    previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PROCEED'
                  } }
                  label={ props.loginVerbiage?.logInNewVerbiage || constants.PREVIOUSLY_USED_LOGIN.NEW_LOG_IN }
                  size={ 'medium' }
                  onClick={ () => props.newLoginClicked() }
                  focusKeyRefrence='BUTTON_PROCEED'
                />
              </div>
            </div>
          </div>

          { props?.mobileNumbersList?.length > 6 &&
            <div className='PreviouslyUsedLoginPane__right'>
              <Divider vertical={ true } />
              <Icon name='ArrowDown'
                className={
                  classNames( 'PreviouslyUsedLoginPane__arrow',
                    { 'PreviouslyUsedLoginPane__arrowDownRotate180': arrowDown
                    } )
                }
              />
            </div>
          }

        </div>
      </div>
    </FocusContext.Provider>
  );
};

/**
  * Property type definitions
  *
  * @type {object}
  * @property {array} mobileNumbersList - set perviously used user details
  */

export const propTypes = {
  mobileNumbersList: PropTypes.array
};

PreviouslyUsedLoginPane.propTypes = propTypes;

export default PreviouslyUsedLoginPane;
