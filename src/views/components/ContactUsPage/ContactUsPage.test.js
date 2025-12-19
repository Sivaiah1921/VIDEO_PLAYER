/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ContactUsPage, { propTypes, defaultProps } from './ContactUsPage';
import { BrowserRouter } from 'react-router-dom';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps =  {
  icon: 'Contact',
  title: 'Contact Us',
  infoText:  'Call or Email us directly to speak with Customer Care representative.',
  email:  'help@tatasky.coom',
  telephone: `1800 208 6633`,
  emailText: 'Email : ',
  telephoneText: 'Telephone : ',
  helpLinkTitle: 'Helpful Links ',
  helpText: 'Please visit tataplaybinge.com for help. We will be happy to assist you there. ',
  btnTitleFAQ: 'FAQs',
  btnTitleTerms: 'Terms of Use',
  onClick: () => console.log(),
  onClickFAQ: () => console.log()
}
describe( '<ContactUsPage />tests', () => {
  it( 'renders without crashing', () => {
    render( <ContactUsPage { ...mockProps } /> );
  } );

  describe( 'properties', () => {
    it( 'should have the proper propTypes', () => {
      const proptypeArray = Object.keys( propTypes ).map( ( key, index ) =>{
        return key
      } );
      expect( ( Object.keys( {
        icon: PropTypes.string,
        title: PropTypes.string,
        infoText: PropTypes.string,
        email: PropTypes.string,
        emailText: PropTypes.string,
        telephoneText: PropTypes.string,
        telephone: PropTypes.string,
        helpLinkTitle: PropTypes.string,
        helpText: PropTypes.string,
        btnTitleFAQ: PropTypes.string,
        btnTitleTerms: PropTypes.string,
        onClickTerms: PropTypes.func,
        onClickFAQ: PropTypes.func
      } ) ).map( ( key, index ) =>{
        return key
      } ) ).toEqual( expect.arrayContaining( proptypeArray ) )
    } );
  } );

  describe( 'snapshot tests', () => {
    const component = mountSnapShot(
      <BrowserRouter>
        <ContactUsPage { ...mockProps } />
      </BrowserRouter>
    )
    expect( component.toJSON() ).toMatchSnapshot();
  } );

} );
