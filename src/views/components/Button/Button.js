/* eslint-disable no-console */
/**
 * Button component with different styles based on props passed
 *
 * @module views/components/Button
 * @memberof -Common
 */
import React, { forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';
import './Button.scss';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import Text from '../Text/Text';
import constants, { CONTENT_TYPE, PACK_LIST, PAGE_TYPE, SECTION_SOURCE } from '../../../utils/constants';
import { truncateWithThreeDotsAutoSuggestion } from '../PlaybackInfo/PlaybackInfo';
import Highlighter from 'react-highlight-words';
import { autoSuggestionScrolled, channelBroadcasterClick, rail_chip_click } from '../../../utils/mixpanel/mixpanelService';
import { useMaintainPageState } from '../../core/MaintainPageStateProvoder/MaintainPageStateProvoder';
import { getSourceForMixPanel } from '../../../utils/util';
import Image from '../Image/Image';
import { useLottieAnimation } from '../../../utils/customHooks/useLottieAnimation';
import { useContentFilter } from '../../../utils/slayer/useContentFilter';
/**
  * A click handler for a the disabled button
  * @method
  * @param {Object} event
  * @returns false
  */
export const disabledHandler = ( event ) => {
  event.preventDefault();
  return false;
};

export const handleOnClick = ( props ) => {
  return function( e ){
    e.preventDefault()
    if( props.onClick ){
      props.onClick( e )
    }
  }
};

/**
  * Represents a Button component
  *
  * @method
  * @param {object} props - React properties passed from composition
  * @returns Button
  */

let timeOut;

const Button = forwardRef( ( props, _ref ) => {
  const {
    value,
    primary,
    secondary,
    disabled,
    clear,
    className,
    type,
    backgroundColor,
    size,
    label,
    iconRight,
    iconLeft,
    iconLeftImage,
    focusediconLeftImage,
    iconRightImage,
    onFocus,
    onBlur,
    focusKeyRefrence,
    totalLengthOfTabs,
    buttonFromDetailPage,
    rightTextSubscription,
    callBackFnTopPos,
    setShowBannerComp,
    catlalogcarsLength,
    textStyle,
    catalogLoader,
    piSeasonList,
    seasonsFrom,
    profileLoading,
    focusedButton,
    catalogWidth,
    styledCatalogSpan,
    languageNudgeCallBack,
    longKeyPressed = false,
    autoSuggestion,
    setShowKeyboardIcon,
    searchKeyBoardLastFocuskey,
    leftMostButton,
    carouselIndexInfo,
    channelData,
    sectionSource,
    contentIndex,
    setHomeCaroselInfo,
    railId,
    isPrimeEntitled,
    imageLeft,
    image,
    chipContentFetchData,
    chipsContentList,
    currentSelectedChipdata,
    selectedPartnerChipIndex,
    isKeyReleased,
    setActiveRailSelections,
    mouseEntered,
    hasPageContainCarouselList,
    chipLoaderState
  } = props;

  const { topPositionRailValueContext } = useMaintainPageState() || null
  const imageLeftContainer = useLottieAnimation( channelData?.chipIcon )
  const { filterChipRailList } = useContentFilter()
  const { ref, focused, focusKey, focusSelf } = useFocusable( {
    onBlur,
    onFocus,
    onEnterPress: ( e, languageGenreItem ) => {
      // if( mouseEntered && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){ // keeping for Mouse Reference
      //   chipContentFetchData?.( chipsContentList[contentIndex], contentIndex, railId, sectionSource )
      // }
      if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
        ( currentSelectedChipdata?.appContentList !== undefined && filterChipRailList( currentSelectedChipdata?.appContentList ).length > 0 ) && setFocus( `BUTTON_FOCUS_${railId}_0` )
        rail_chip_click( channelData, props?.railTitle, props?.railPosition - 1 )
        return
      }
      !longKeyPressed && props.onClick && props.onClick( e, languageGenreItem )
    },
    isFocusBoundary:true,
    focusKey: !focusKeyRefrence ? null : `${focusKeyRefrence}`,
    onArrowPress:( direction )=>{
      if( sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
        if( direction === 'down' ){
          return !chipLoaderState // Need To Work
        }
        if( direction === 'up' ){
          const isTopPositionedRail = props.totalRailList && props.totalRailList.length > 0 && props.parentFocusKey ? `BUTTON_FOCUS_${props.totalRailList[0].title}_${props.totalRailList[0].id}` === props.parentFocusKey : false;
          if( direction === 'up' && ( topPositionRailValueContext.current === 0 || isTopPositionedRail ) && hasPageContainCarouselList ){
            setHomeCaroselInfo && setHomeCaroselInfo( true )
            setFocus( 'CAROSEL_FOCUS' )
          }
        }
        if( direction === 'right' ){
          if( chipsContentList.length - 1 === contentIndex ){
            return false
          }
        }
        else if( direction === 'left' ){
          if( contentIndex === 0 && window.location.pathname.includes( PAGE_TYPE.HOME ) ){
            setFocus( 'LEFT_NAV_CONTAINER' )
          }
        }
        return true
      }
      focusKeyRefrence?.includes( 'CAROSEL' ) && props?.handleNavigationForCarosel( direction )
      if( focusKeyRefrence?.includes( 'CAROSEL' ) ){
        if( carouselIndexInfo !== 0 ){
          return true
        }
      }
      if( direction === 'right' ){
        if( label === constants.SHOW_FILTER || label === constants.HIDE_FILTER ){
          return false;
        }
        else if( ( Number( focusKeyRefrence ) === totalLengthOfTabs ) && buttonFromDetailPage ){
          return false
        }
        else if( catalogLoader ){
          return false
        }
        else if( focusKeyRefrence === constants.BUTTON_EXPLORE ){
          return false
        }
        else {
          return true
        }
      }
      if( direction === 'up' ){
        /* Mixpanel-event */
        autoSuggestion && autoSuggestionScrolled( props.inputValue )
        if( Boolean( label === '1' || label === '2' || label === '3' ) && window.location.pathname.includes( PAGE_TYPE.PARENTAL_PIN ) ){
          return false
        }
        else if( profileLoading ){
          return false
        }
        else if( label === constants.UPGRADE_SUBSCRIPTION ){
          return false;
        }
        else if( autoSuggestion && setShowKeyboardIcon && focusKeyRefrence === 'BUTTON_FOCUSED_0' ){
          setShowKeyboardIcon( false )
          setFocus( searchKeyBoardLastFocuskey )
          return false
        }
        callBackFnTopPos && callBackFnTopPos()
        languageNudgeCallBack && languageNudgeCallBack( true )
      }
      if( direction === 'left' ){
        if( Boolean( label === '1' || label === '4' || label === '7' || label === 'Delete' ) && window.location.pathname.includes( PAGE_TYPE.PARENTAL_PIN ) ){
          return false
        }
        else if( catalogLoader ){
          return false
        }
        else if( focusKeyRefrence === leftMostButton ){
          return false
        }
      }
      if( direction === 'down' ){
        if( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL || sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL ){
          if( currentSelectedChipdata?.appContentList?.length > 0 ){
            setFocus( `BUTTON_FOCUS_${railId}_0` )
            return false
          }
          else {
            return true
          }
        }
        /* Mixpanel-event */
        autoSuggestion && autoSuggestionScrolled( props.inputValue )
        setShowBannerComp && setShowBannerComp( false )
        if( !( piSeasonList && piSeasonList.length > 0 ) && seasonsFrom === 'piSeasonList' ){
          return false
        }
        else if( profileLoading ){
          return false
        }
        else if( catlalogcarsLength === 0 ){
          return false
        }
      }
    }
  } )

  const onMouseEnterCallBackFn = ( e ) => {
    if( e.target.innerText === 'Go Back' || e.target.innerText === 'To Close' ){
      return null
    }
    else if( props?.notFossabeButton ){
      return null
    }
    else if( e.target.innerText === constants.PLAYBTN_LABEL && window.location.pathname.includes( CONTENT_TYPE.LIVE ) ){
      return null
    }
    else {
      focusSelf()
    }
  }

  useEffect( () => {
    focusedButton?.( focused );
    if( isKeyReleased && focused && sectionSource === SECTION_SOURCE.BINGE_CHIP_RAIL && selectedPartnerChipIndex !== contentIndex ){
      if( !mouseEntered ){
        setActiveRailSelections( prevState => ( {
          ...prevState,
          [railId]: {
            content: currentSelectedChipdata,
            selectedIndex: contentIndex
          }
        } ) )
      }
      chipContentFetchData?.( chipsContentList[contentIndex], contentIndex, railId, sectionSource )
    }
  }, [focused, isKeyReleased] )

  useEffect( ()=>{
    if( sectionSource === SECTION_SOURCE.BROWSE_BY_CHANNEL && contentIndex === 0 ){
      channelBroadcasterClick( { railTitle: props?.railTitle }, constants.COMPOSITE_CHANNEL_RAIL, getSourceForMixPanel( window.location.pathname ), channelData?.title, 1 ) // mixpanel event
    }
  }, [] )

  return (
    <FocusContext.Provider value={ focusKey }>
      <button
        onClick={ disabled ? disabledHandler : handleOnClick( props ) }
        style={ backgroundColor && { backgroundColor } }
        className={
          classNames( 'Button', {
            [className]: className,
            'Button--clear': clear,
            'Button--disabled': disabled,
            'Button--secondary': secondary,
            'Button--icon': iconLeftImage || iconRightImage,
            'Button--withLeftRightIcon': iconLeftImage && iconRightImage,
            'Button--primary': primary,
            [`Button--${size}`]: true,
            'Button--focused': focused,
            'Button--focusedPrimeEntitledCta': focused && isPrimeEntitled,
            'Button--chipsImages': imageLeft
          } )
        }
        ref={ ref }
        type={ type }
        onMouseEnter={ onMouseEnterCallBackFn }
        data-label={ label }
      >
        { iconLeftImage && iconLeft &&
        <Icon className={
          classNames( 'Button__icon', {
            'Button__icon--withIconLeft': iconLeft
          } ) }
        name={ focused && focusediconLeftImage ? focusediconLeftImage : iconLeftImage }
        />
        }
        {
          imageLeft && ( channelData?.chipIcon?.endsWith( '.json' ) ? (
            <div
              className='Button__lottieAnimation'
              ref={ imageLeftContainer }
            >
            </div>
          ) :
            (
              <Image src={ image }
                alt={ 'ChipLogo' }
                ariaLabel='ChipLogo'
              />
            )
          )
        }
        {
          props.autoSuggestion ? (
            <Highlighter
              highlightClassName='PlaybackInfo__bold_suggestion'
              searchWords={ [props.inputValue] }
              autoEscape={ true }
              textToHighlight={ truncateWithThreeDotsAutoSuggestion( label, 30 ) }
            />
          ) : (
            textStyle ? (
              <Text
                htmlTag='span'
                textStyle={ textStyle }
              >{ label }</Text>
            ) : (
              <span
                className={
                  classNames( 'Button__insideContentLabel', {
                    'Button__insideContentLabel--withBackLeftIcon': iconLeft && ( label === constants.GOBACK || label === constants.TOCLOSE )
                  } ) }
                style={ catalogWidth && { width: `max-content`, display: 'block', position: 'relative', letterSpacing: '0.02em', transition: 'font-weight 0.15s ease, transform 0.15s ease' } }
              >{ label }
                { focused && styledCatalogSpan && <span style={ styledCatalogSpan } > { label } </span> }
              </span>
            )
          )
        }
        { iconRightImage && iconRight &&
        <Icon className={
          classNames( 'Button__icon', {
            'Button__icon--withIconRight': iconRight
          } ) }
        name={ focused && focusediconLeftImage ? focusediconLeftImage : iconRightImage }
        />
        }
        {
          rightTextSubscription &&
          <div className={ PACK_LIST.includes( rightTextSubscription ) ? 'Button__subscriptionTextYellow' : 'Button__subscriptionText' }>
            <Text>{ rightTextSubscription }</Text>
          </div>
        }
      </button>
    </FocusContext.Provider>
  );
} );

/**
  * Property type definitions
  *
  * @type {object}
  * * property type definitions
   * @type {object}
   * @property {boolean} clear - Flag to render the Icon circle with clear variation
   * @property {boolean} disabled - Flag to render the disabled variation
   * @property {boolean} withHover - Flag to render the withHover variation
   * @property {function} onClick - Function as the event handler
   * @property {boolean} secondary - Flag to render the Outline button
   * @property {boolean} primary - Flag to render the primary button
   * @property {string} backgroundColor - Name of the backgroundColor to render
   * @property {string} iconLeftImage - Name of icon used for accessibility
   * @property {string} iconRightImage - Name of icon used for accessibility
   * @property {boolean} iconLeft - Flag to render the icon to the left of the label
   * @property {boolean} iconRight - Flag to render the icon to the right of the label
  */
export const propTypes = {
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf( ['small', 'medium', 'large'] ),
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  iconLeftImage: PropTypes.string,
  iconRightImage: PropTypes.string,
  iconLeft: PropTypes.bool,
  iconRight: PropTypes.bool
};

/**
  * Default values for passed properties
  *
  * @type {object}
  * @property {boolean} primary=false - Default compact variation
  * @property {boolean} secondary=false - Default secondary variation
  * @property {boolean} disabled=false - Default disabled variation
  * @property {string} iconLeftImage='' - Default iconLeftImage
  * @property {string} iconRightImage='' - Default iconRightImage
  * @property {boolean} iconLeft=false - Default iconLeft
  * @property {boolean} iconRight=false - Default iconRight
  * @property {string} type='button' - Default type
  * @property {string} backgroundColor=null - Default backgroundColor
  * @property {string} size='medium' - Default size
  * @property {function} onClick=undefined - Default onClick
  */
export const defaultProps = {
  backgroundColor: null,
  primary: false,
  secondary: false,
  size: 'small',
  disabled: false,
  onClick: undefined,
  iconLeftImage: null,
  iconRightImage: null,
  iconLeft: false,
  iconRight: false
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
