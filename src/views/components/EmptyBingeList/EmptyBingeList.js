/**
 * This component will show EmptyBingeList page
 *
 * @module views/components/EmptyBingeList
 * @memberof -Common
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './EmptyBingeList.scss';
import Icon from '../Icon/Icon';
import Text from '../Text/Text';
import Button from '../Button/Button';
import constants, { PAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { modalDom, navigateToHome } from '../../../utils/util';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';


/**
  * Represents a EmptyBingeList component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns EmptyBingeList
  */
export const EmptyBingeList = function( props ){
  const { icon, title, content, buttonLabel, bgImg, alt } = props;
  const { setCustomPageType, bingeListFlag } = useHomeContext()
  const history = useHistory()
  const previousPathName = useNavigationContext()
  const { ref, focusKey, focusSelf } = useFocusable( {
    focusable: true,
    autoRestoreFocus: true,
    isFocusBoundary: true
  } );
  useEffect( () => {
    if( !bingeListFlag && !modalDom() ){
      focusSelf()
    }
  }, [bingeListFlag] )
  return (
    <div className='EmptyBingeList'
      ref={ ref }
    >
      <FocusContext.Provider value={ focusKey }>
        <div className='EmptyBingeList__content'>
          <FocusContext.Provider focusable={ false }
            value=''
          >
            <div className='EmptyBingeList__topHeader'>
              <Button
                onClick={ ()=> history.goBack() }
                iconLeftImage='GoBack'
                iconLeft={ true }
                secondary={ true }
                label={ constants.GOBACK }
              />
              <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
            </div>
          </FocusContext.Provider>
          <div className='EmptyBingeList__content__icon'>
            <Icon name={ icon } />
          </div>
          <div className='EmptyBingeList__content__title'>
            <Text
              textStyle='bingeList-subtitle'
              htmlTag='span'
            >
              { title }
            </Text>
          </div>
          <div className='EmptyBingeList__content__subtitle'>
            <Text
              textStyle='header-2'
              htmlTag='span'
            >
              { content }
            </Text>
          </div>
          <div className='EmptyBingeList__content__button'>
            <Button
              onClick={ ()=>{
                setCustomPageType( PAGE_TYPE.DONGLE_HOMEPAGE )
                previousPathName.discoverToHome = true
                previousPathName.dongeAPI = PAGE_TYPE.DONGLE_HOMEPAGE
                navigateToHome( history )
              } }
              label={ buttonLabel }
              focusKeyRefrence={ `BUTTON_${ buttonLabel }` }
              onFocus={ ()=> previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_${ buttonLabel }` }
            />
          </div>
        </div>
        <BackgroundComponent
          bgImg={ bgImg }
          alt='EmptyBingeList BackgroundImage'
          isGradient={ false }
        />
      </FocusContext.Provider>
    </div>

  )
}

/**
  * Property type definitions
  *
  * @type {object}
  * @property {string} icon - provides the icon name
  * @property {string} title - provides BingeList title
  * @property {string} content - provides BingeList content bgImg
  * @property {string} bgImg - provides BingeList  bgImg
  * @property {string} alt - provides BingeList  alt background image
  */
export const propTypes =  {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  bgImg: PropTypes.string.isRequired,
  alt: PropTypes.string
};

EmptyBingeList.propTypes = propTypes;
export default EmptyBingeList;