import React from 'react';
import PropTypes from 'prop-types';
import TermsOfUse, { propTypes } from './TermsOfUse';
import * as jestutils from '../../../utils/jest/jest';

const consoleErrorSpy = jest.spyOn( console, 'error' );
const mockProps = {
  title: 'Terms of Use',
  headercontent:'What information does Tata Sky Binge collect ?',
  bodycontent: 'We collect information relating to you that you have provided to us (for example, on an application or registration form, when you enter a competition or promotion sponsored by us or through the way you use our products and services) or that we may have obtained from another source (such as our suppliers or from marketing organisations and credit agencies). Where possible, we will collect the information directly from you. However the method of collecting this information may vary depending on which one of our services you are using (for example our mobile services or our internet services).This information may include, your name, address, telephone numbers, information on how you use our products and services (such as the type, date, time, location and duration of calls or messages, the numbers you call, how much you spend, and information on you and the browsing and viewing activity that happens while you use internet services (including the internet sites and pages visited, your Internet Protocol (IP) address and the dates and times you or anyone using your internet services logs on and off, and the channels accessed through your TV services with us)), the location of your mobile phone, lifestyle information and any other information collected in relation to your use of our products and services. This information may be held by us while you are using our services and for a period of time afterwards, but only for so long as we are legally entitled to use the information in accordance with this Privacy Policy.We may also monitor and record your calls to us and our calls to you.'
};

describe( '<TermsOfUse />tests', () => {
  it( 'renders without crashing', () => {
    render(
      < TermsOfUse { ...mockProps } />
    );
  } );

  describe( 'properties', () => {
    beforeEach( () => {
      consoleErrorSpy.mockClear();
    } )
    it( 'should only have these proptypes and values', () => {
      const props = {
        title: 'Terms of Use',
        headercontent:'What information does Tata Sky Binge collect ?',
        bodycontent: 'We collect information relating to you that you have provided to us (for example, on an application or registration form, when you enter a competition or promotion sponsored by us or through the way you use our products and services) or that we may have obtained from another source (such as our suppliers or from marketing organisations and credit agencies). Where possible, we will collect the information directly from you. However the method of collecting this information may vary depending on which one of our services you are using (for example our mobile services or our internet services).This information may include, your name, address, telephone numbers, information on how you use our products and services (such as the type, date, time, location and duration of calls or messages, the numbers you call, how much you spend, and information on you and the browsing and viewing activity that happens while you use internet services (including the internet sites and pages visited, your Internet Protocol (IP) address and the dates and times you or anyone using your internet services logs on and off, and the channels accessed through your TV services with us)), the location of your mobile phone, lifestyle information and any other information collected in relation to your use of our products and services. This information may be held by us while you are using our services and for a period of time afterwards, but only for so long as we are legally entitled to use the information in accordance with this Privacy Policy.We may also monitor and record your calls to us and our calls to you.'
      };
      jestutils.testProps( ( testObj, key, val ) => {
        expect( PropTypes.checkPropTypes( propTypes, testObj, key, val ) )
      }, props );
      expect( Object.keys( props ).length ).toEqual( Object.keys( propTypes ).length )
      expect( consoleErrorSpy ).not.toBeCalled();
    } );

    it( 'an instance of Link should have the proper propTypes set', () => {
      expect( TermsOfUse.propTypes ).toBe( propTypes );
    } );
  } );

  describe( 'snapshot tests', () => {
    it( 'renders correctly TermsOfUse ', () => {
      const modalComponent = mountSnapShot(
        < TermsOfUse { ...mockProps } /> ).toJSON();
      expect( modalComponent ).toMatchSnapshot();
    } );
  } );
} );
