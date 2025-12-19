import React from 'react';
import PropTypes from 'prop-types';
import RadioButton, { propTypes, defaultProps } from './RadioButton';
import * as jestutils from '../../../utils/jest/jest';

const consoleSpy = jest.spyOn( console, 'error' );

describe( '<RadioButton />tests', () => {
  it( 'renders without crashing', () => {
    render(
      <RadioButton
        id={ 'radio-btn' }
        name={ 'radio-btn' }
        value={ 'string' }
      />
    );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        isChecked: PropTypes.bool,
        isDisabled: PropTypes.bool,
        id: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        tabIndex: PropTypes.number,
        value: PropTypes.string.isRequired,
        name: PropTypes.string,
        hideInput: PropTypes.bool
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )

    } );

    it( 'should have the proper "value" Proptypes', () => {
      ['string'
      ].forEach( ( value )=>{
        expect( PropTypes.checkPropTypes(
          propTypes,
          {
            'value': value,
            'id': 'id'
          }
        ) );
      } );
      expect( consoleSpy ).not.toBeCalled();
      consoleSpy.mockClear();
    } );

    it( 'should have the proper defaultProps', () => {
      expect(
        JSON.stringify( {
          isDisabled: false,
          hideInput: false
        } )
      ).toEqual( JSON.stringify( defaultProps ) );
    } );

    it( 'an instance of RadioButton should have the proper propTypes set', () => {
      expect( RadioButton.propTypes ).toBe( propTypes );
    } );

    it( 'an instance of RadioButton should have the proper defaultProps', () => {
      expect( RadioButton.defaultProps ).toBe( defaultProps );
    } );

    it( 'should call the user provided change Event Handler when it is passed', async() => {
      const eHandle = jest.fn();
      render(
        <RadioButton
          onChange={ eHandle }
          id='radio-btn1'
          name='radio-btn1'
          value='string'
          children='Radio ButtonText'
        />
      );
      const radioBtn = testScreen.getByLabelText( 'Radio ButtonText' );
      fireEvent.click( radioBtn );
      expect( eHandle ).toHaveBeenCalled();
    } );

    it( 'renders the tabIndex number attribute of the element', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn2'
          name='radio-btn2'
          value='string'
          tabIndex={ 0 }
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).tabIndex ).toEqual( 0 );
    } );

    it( 'renders the RadioButton as the id attribute as string of the element', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn3'
          name='radio-btn3'
          value='string'
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).id ).toEqual( 'radio-btn3' );
    } );
  } );

  describe( 'integration tests', () => {} );

  describe( 'When radioButton Enable', () => {
    it( 'the type is set by the prop', () => {
      const { container } = render(
        <RadioButton
          type='radio'
          id='radio-btn'
          name='radio-btn'
          value='radio'
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).type ).toBe( 'radio' );
    } );

    it( 'name is present', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn'
          name='InputField'
          value='radio'
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).name ).toBe( 'InputField' );
    } );

    it( 'value should be set', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn'
          name='radio-btn'
          value='string'
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).value ).toBe( 'string' );
    } );
  } );

  describe( 'When radioButton Disable', () => {
    it( 'does not allow invalid types to be set for isDisabled', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn'
          name='radio-btn'
          value='radio'
          isDisabled={ false }
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).disabled ).not.toBe( 'test' );
    } );

    it( 'does not allow invalid types to be set for onClick', () => {
      const { container } = render(
        <RadioButton
          id='radio-btn'
          name='radio-btn'
          value='radio'
          onClick='invalid'
        />
      );
      expect( container.querySelector( '.RadioButton__input' ).onClick ).not.toBe( 'invalid' );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly with the default props', () => {
      const radioButtonComponent = mountSnapShot(
        <RadioButton
          id='radio-btn'
          type='radio'
          name='radio-btn'
          value='radio'
        />
      ).toJSON();
      expect( radioButtonComponent ).toMatchSnapshot();
    } );

    it( 'renders correctly with the `type` property submit', () => {
      const radioButtonComponent = mountSnapShot(
        <RadioButton
          id='radio-btn'
          type='radio'
          name='radio-btn'
          value='radio'
        />
      ).toJSON();
      expect( radioButtonComponent ).toMatchSnapshot();
    } );

    it( 'renders radio button with all props ', () => {
      const radioButtonComponent = mountSnapShot(
        <RadioButton
          type='radio'
          id='buttonComponent'
          name='buttonComponent'
          aria-labelledby='buttonComponent'
          tabIndex={ 0 }
          value='radio'
        />
      )
        .toJSON();
      expect( radioButtonComponent ).toMatchSnapshot();
    } );

    it( 'renders with hideInput props to hide radio button', () => {
      const radioButtonComponent = mountSnapShot(
        <RadioButton
          type='radio'
          id='buttonComponent'
          name='buttonComponent'
          aria-labelledby='buttonComponent'
          tabIndex={ 0 }
          value='radio'
          hideInput={ true }
        />
      )
        .toJSON();
      expect( radioButtonComponent ).toMatchSnapshot();
    } );
  } );
} );