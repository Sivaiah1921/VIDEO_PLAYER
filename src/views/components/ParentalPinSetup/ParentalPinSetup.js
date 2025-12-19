/**
 * This component will allow user to enter parental pin number
 *
 * @module views/components/ParentalPinSetup
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ParentalPinSetup.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import InputField from '../InputField/InputField'
import Button from '../Button/Button'
import { FocusContext, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';

/**
 * Represents a ParentalPinSetup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ParentalPinSetup
 */
export const ParentalPinSetup = function( props ){
  const { ref } = useFocusable( )
  const { icon, title, count, subtitle, helpText, btnLabel, disabled, inputValue, fourDigitPin, wrongPin } = props;
  useEffect( ()=>{
    fourDigitPin && setFocus( 'PARETNTAL_PROCEED' )
  }, [fourDigitPin] )
  const handleChange = ( ( elmnt ) => {
    if( elmnt.key === 'Delete' || elmnt.key === 'Backspace' ){
      const next = elmnt.target.tabIndex - 2;
      if( next > -1 ){
        elmnt.target.form.elements[next].focus()
      }
    }
    else {
      const next = elmnt.target.tabIndex + 1;
      if( next < count ){
        elmnt.target.form.elements[next].focus()
      }
    }
  } )
  return (
    <form className='ParentalPinSetup'
      id='ParentalPinSetupID'
    >
      <div className='ParentalPinSetup__icon'>
        <Icon name={ icon } />
      </div>
      <div className='ParentalPinSetup__title'>
        <Text
          textStyle='title-2'
          color='white'
        >
          { title }
        </Text>
      </div>
      <div className='ParentalPinSetup__subtitle'>
        <Text
          textStyle='subtitle-4'
          color='white'
        >
          { subtitle }
        </Text>
      </div>
      <FocusContext.Provider focusable={ false }
        value=''
      >
        <div className='ParentalPinSetup__inputCotainer'>
          {
            [...Array( count )].map( ( x, i ) => (
              <div key={ i }>
                <InputField
                  key={ i }
                  maxLength={ 1 }
                  tabIndex={ i }
                  otpValue={ inputValue }
                  onOTPChange={ ( e )=> handleChange( e ) }
                  value={ inputValue[i] >= 0 ? inputValue[i] : '' }
                  type='password'
                  wrongPin={ wrongPin }
                  pointerNavigation={ true }
                />
              </div>
            )
            )

          }
        </div>
      </FocusContext.Provider>
      {
        wrongPin && (
          <div className='ParentalPinSetup__incorrectPIN'>
            <Text
              textStyle='autoPlay-subtitle'
              color='white'
            >
              Incorrect PIN
            </Text>
          </div>
        )
      }
      <Text
        textStyle='autoPlay-subtitle'
        color='white'
        textAlign='center'
      >
        { helpText }
      </Text>
      {
        fourDigitPin ? (
          <div className='ParentalPinSetup__proceedButton'>
            <Button
              focusKeyRefrence={ 'PARETNTAL_PROCEED' }
              label={ btnLabel }
              primary={ true }
              disabled={ disabled }
              onClick={ props?.proceedSubmitFn }
              size='large'
              className='ParentalPinSetup__proceedButton--text'
            ></Button>
          </div>
        ) : (
          <FocusContext.Provider value=''
            focusable={ false }
          >
            <div className='ParentalPinSetup__proceedButton'>
              <Button
                label={ btnLabel }
                primary={ true }
                disabled={ disabled }
                onClick={ props?.proceedSubmitFn }
                size='large'
                className='ParentalPinSetup__proceedButton--text'
              ></Button>
            </div>
          </FocusContext.Provider>
        ) }
    </form>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} icon - parental pin icon
 * @property {string} title - parental pin title
 * @property {string} subtitle - parental pin subtitle
 * @property {string} helpText - parental pin help text
 * @property {number} count - no of digits code
 * @property {string} btnLabel - button label
 * @property {bool} disabled - button disabled
 * @property {number} inputValue - input value
 */
export const propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  count: PropTypes.number,
  helpText: PropTypes.string,
  btnLabel: PropTypes.string,
  disabled: PropTypes.bool,
  inputValue: PropTypes.array
};



ParentalPinSetup.propTypes = propTypes;

export default ParentalPinSetup;
