/**
 * This component gives language list of program
 *
 * @module views/components/MultiLanguageList
 * @memberof -Common
 */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './MultiLanguageList.scss';
import MultiLanguageSelection from '../MultiLanguageSelection/MultiLanguageSelection';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { DefaultSelectedLanguageCall, LanguageListCall, SavePreferedLanguagesforGuestUsers, SavePreferedLanguagesforAuthUsers } from '../../../utils/slayer/MultiLanguageService'
import { useHistory, useLocation } from 'react-router-dom';
import Icon from '../Icon/Icon';
import constants, { LANGUAGE_JOURNEY, PAGE_TYPE, PLAYER, VIEDO_LANGAUGE_VERBIAGES } from '../../../utils/constants';
import Loader from '../Loader/Loader';
import { getBaID, getLoginMsg, getRmn, getSubscriberId, setContentLangSet, getAllLoginPath, setAllLoginPath, getAuthToken, getDeviceLaunchCount, setPreferredLanguage, setPreferredLanguageGuest, getPiLevel } from '../../../utils/localStorageHelper';
import Notifications from '../Notifications/Notifications';
import { useNavigationContext } from '../../core/NavigationContextProvider/NavigationContextProvider';
import { useProfileContext } from '../../core/ProfileContextProvider/ProfileContextProvider';
import { clearPILevelWhenComeBackToPI, keyCodeForBackFunctionality, storeAllPaths } from '../../../utils/util';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider';
import { useAppContext } from '../../core/AppContextProvider/AppContextProvider';
import { contentLanguageOpen, contentLanguageProceed, contentLanguageSelect, contentLanguageSkip } from '../../../utils/mixpanel/mixpanelService';
import MIXPANELCONFIG from '../../../utils/mixpanelConfig';

/**
  * Represents a MultiLanguageList component
  * @method
  * @param {object} props - React properties passed from composition
  * @returns MultiLanguageList
  */

const ProceedButtonComponent = ( { onhandleClick, disabled, previousPathName, btnText, defaultFocus, setDefaultFocus } )=>{
  const previousPath = previousPathName

  const handleFocus = () => {
    previousPath.previousMediaCardFocusBeforeSplash = 'BUTTON_PROCEED'
    setDefaultFocus( true )
  }

  return (
    <div
      className='MultiLanguageList__proceedButton'
    >
      <Button
        label={ btnText }
        secondary={ !defaultFocus }
        disabled={ disabled }
        size='large'
        className='MultiLanguageList__proceedButton--text'
        onClick={ () => onhandleClick() }
        focusKeyRefrence='BUTTON_PROCEED'
        onFocus={ ()=> handleFocus() }
      ></Button>
    </div>
  )

}
export const MultiLanguageList = function( props ){
  const { disabled } =  props;
  const [languageList, setlanguageList] = useState( [] )
  const [selectedLength, setSelectedLength] = useState( 0 )
  const [showNotification, setShowNotification] = useState( false );
  const [message, setMessage] = useState( '' );
  const [defaultSelectList, setDefaultSelectList] = useState( null )
  const [emptyLanguage, setEmptyLanguage] = useState( false )
  const [defaultFocus, setDefaultFocus] = useState( true )

  const listRef = useRef( null )
  const keyPositionRef = useRef( '' )

  const { launchCount, setLaunchCount } = useHomeContext()
  const previousPathName = useNavigationContext()
  const { setProfileAPIResult } = useProfileContext()

  const location = useLocation();
  const { fromAccount } = location.args || {};

  const [langaugeList] = LanguageListCall();
  const { fetchLanguageList, getLanguagesResponse, getLanguagesError, getLanguagesLoading } = langaugeList;

  const [authUserlanguages] = SavePreferedLanguagesforAuthUsers();
  const { saveAuthUserLanguage, authUserLanguage, authUserLanguageError, authUserLanguageLoading } = authUserlanguages

  const [defaultLanguages] = DefaultSelectedLanguageCall();
  const { fetchDefaultLangaues, selectedLanguagesResponse, selectedLanguagesError, selectedLanguagesLoading } = defaultLanguages

  const [updateLanguage] = SavePreferedLanguagesforGuestUsers();
  const { saveLanguagesPostData, saveLanguagesResponse, saveLanguagesError, saveLanguagesLoading } = updateLanguage

  useEffect( () => {
    if( saveLanguagesResponse?.code === 0 ){
      const filteredList = languageList?.filter( ( item )=> item.isChecked )
      setPreferredLanguageGuest( filteredList.map( item => JSON.stringify( item.id ) ) )
      window.location.pathname.includes( PAGE_TYPE.CONTENT_LANGUAGE ) ? history.goBack() : setLaunchCount( getDeviceLaunchCount() + 1 )
    }

  }, [saveLanguagesResponse] );

  useEffect( ()=>{
    if( Number( launchCount ) === 1 ){
      contentLanguageOpen( MIXPANELCONFIG.VALUE.APP_LAUNCH )
    }
    else if( Number( launchCount ) > 1 ){
      contentLanguageOpen( MIXPANELCONFIG.VALUE.NUDGE )
    }
  }, [launchCount] )

  const history = useHistory();
  const bLoggedIn = getLoginMsg( )
  const showBackButton =  history.location.pathname === PAGE_TYPE.CONTENT_LANGUAGE && !bLoggedIn

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );

  const { configResponse } = useAppContext();
  const { config } = configResponse;

  const languageVerbiages = config && config.videoLanguageVerbiages ? ( getAuthToken() ? config.videoLanguageVerbiages.languageSetting : config.videoLanguageVerbiages.languageDrawer ) || VIEDO_LANGAUGE_VERBIAGES.languageDrawer : VIEDO_LANGAUGE_VERBIAGES.languageDrawer

  useEffect( ()=>{
    if( getLanguagesResponse && getLanguagesResponse.data && getLanguagesResponse.data.contentList ){
      if( Array.isArray( getLanguagesResponse.data.contentList ) && getLanguagesResponse.data.contentList.length === 0 ){
        if( fromAccount ){
          setEmptyLanguage( true )
        }
        else {
          history.replace( '/' )
        }
        return
      }

      if( getAuthToken() ){
        const updatedListResponse = getLanguagesResponse.data.contentList.map( ( value )=> {
          return { ...value, isChecked:false }
        } )
        updatedListResponse !== undefined && setlanguageList( updatedListResponse )

        if( getBaID() && updatedListResponse ){
          fetchDefaultLangaues( {
            baId: getBaID(),
            'bingeSubscriberId': getSubscriberId(),
            'mobileNumber': getRmn()
          } )
        }
      }
      else {
        setlanguageList( getLanguagesResponse.data.contentList )
      }

    }

  }, [getLanguagesResponse] )

  useEffect( ()=>{
    storeAllPaths( window.location.pathname )
    setTimeout( ()=> setFocus( 'BUTTON_PRIMARY_0' ), 50 )
  }, [] )


  useEffect( () => {
    if( selectedLanguagesResponse ){
      const getLanguageList = selectedLanguagesResponse.data?.profileList
      const defaultSection = getLanguageList?.filter( ( { profileType } )=> profileType === 'Default' )
      const defaultSectionList  = defaultSection !== undefined && defaultSection[0]?.preferredLanguages
      setDefaultSelectList( defaultSectionList?.length )
      setSelectedLength( defaultSectionList?.length )

      if( defaultSectionList?.length > 0 ){
        previousPathName.previousMediaCardFocusBeforeSplash = 'BUTTON_PROCEED'
        setFocus( 'BUTTON_PROCEED' )
        const updatedList = languageList?.map( ( language, index )=> {
          var found = defaultSectionList.find( ( selectedLanguage, i )=> selectedLanguage.id === language.id );
          if( found ){
            return Object.assign( language, { isChecked: true } );
          }
          return language
        } )
        setlanguageList( updatedList )
      }
    }
  }, [selectedLanguagesResponse] )

  useEffect( ()=>{
    if( showNotification ){
      setTimeout( ()=> setShowNotification( false ), 5000 )
    }
  }, [showNotification] )

  useEffect( () => {
    if( selectedLanguagesError ){
      setShowNotification( true )
      setMessage( selectedLanguagesError.message )
    }

  }, [selectedLanguagesError] )


  const onhandleClick = () => {
    const filteredList = languageList?.filter( ( item )=> item.isChecked === true ? item.id : '' )
    if( filteredList.length === 0 ){
      setShowNotification( true )
      setMessage( languageVerbiages.preferenceErrorMsg )
      return
    }
    contentLanguageProceed()
    contentLanguageSelect( filteredList.map( item => item.title ), launchCount )
    saveAuthUserLanguage( filteredList.map( item => JSON.stringify( item.id ) ) )
    setProfileAPIResult( {
      data: 'languageUpdateCall'
    } )
    if( bLoggedIn ){
      const route = previousPathName.current || previousPathName.navigationRouting
      const indexRouter = getAllLoginPath().length
      history.go( -indexRouter )
      setAllLoginPath( [] )
      const piLevelClear = getPiLevel()
      clearPILevelWhenComeBackToPI( piLevelClear, route )
      previousPathName.current = null
    }
    else {
      setContentLangSet( true )
      history.goBack()
    }
  }

  const handleGuestJourney = () => {
    previousPathName.guestJourneyCTA = LANGUAGE_JOURNEY.LOGGED_IN_USER_JOURNEY
    const filteredList = languageList?.filter( ( item )=> item.isChecked === true ? item.id : '' )
    if( filteredList.length === 0 ){
      setShowNotification( true )
      setMessage( languageVerbiages.preferenceErrorMsg )
      return
    }
    contentLanguageProceed()
    contentLanguageSelect( filteredList.map( item => item.title ), launchCount )
    saveLanguagesPostData( filteredList.map( item => JSON.stringify( item.id ) ) );
  }

  const onSelected = ( language, cheked, index ) => {
    const UpdatedList = languageList?.map( ( item )=> {
      if( item.id === index ){
        return { ...item, isChecked: cheked }
      }
      return item
    } )
    const filteredList = UpdatedList?.filter( ( item )=> item.isChecked === true )
    setSelectedLength( filteredList.length )
    setlanguageList( UpdatedList )
  }

  const onMouseEnterCallBackFn = ( id ) => {
    previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${id}`
    setFocus( `BUTTON_PRIMARY_${id}` )
  }

  const handleNotNowClick = () =>{
    contentLanguageSkip()
    setPreferredLanguageGuest( '' )
    previousPathName.guestJourneyCTA = LANGUAGE_JOURNEY.GUEST_JOURNEY
    setLaunchCount( getDeviceLaunchCount() + 1 )
  }

  const onRailFocus = useCallback( ( { y } ) => {
    if( listRef.current ){
      const scrollValue = 140
      if( keyPositionRef.current === 'up' ){
        listRef.current.scrollTop = y - scrollValue
      }
      else {
        listRef.current.scrollTop = y - scrollValue
      }
    }
  }, [listRef] );

  const onKeyPress = useCallback( ( { keyCode } ) => {
    if( keyCodeForBackFunctionality( keyCode ) ){
      handleNotNowClick()
    }
    if( keyCode === PLAYER.UP ){
      keyPositionRef.current = 'up'
    }
    else if( keyCode === PLAYER.DOWN ){
      keyPositionRef.current = 'down'
    }
  } );

  const RenderBottomSection = () => {

    const { ref, focusKey } = useFocusable( {
      isFocusBoundary: true,
      focusBoundaryDirections:['left', 'right']
    } );

    return (
      <FocusContext.Provider value={ focusKey }>
        <div className='MultiLanguageList__bottomContainer'
          ref={ ref }
        >
          <ProceedButtonComponent onhandleClick={ getAuthToken() ? onhandleClick : handleGuestJourney }
            disabled={ disabled }
            previousPathName={ previousPathName }
            btnText={ languageVerbiages.buttonTitle }
            defaultFocus={ defaultFocus }
            setDefaultFocus={ setDefaultFocus }
          />
          { launchCount === 1 &&
          <div className='MultiLanguageList__notNowButton'>
            <Button
              label={ languageVerbiages.exitButtonTitle }
              secondary={ true }
              disabled={ false }
              size='large'
              className='MultiLanguageList__notNowButton--text'
              onClick={ () => handleNotNowClick() }
              focusKeyRefrence='BUTTON_NOT_NOW_PROCEED'
              onFocus={ ()=> {
                previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_NOT_NOW_PROCEED`
                setDefaultFocus( false )
              } }
            ></Button>
          </div> }
        </div>
      </FocusContext.Provider>
    )
  }

  useEffect( () => {
    window.addEventListener( 'keydown', onKeyPress );
    return () => {
      window.removeEventListener( 'keydown', onKeyPress );
    }
  }, [] );

  return (
    <>
      <FocusContext.Provider value={ focusKey }>
        <div ref={ ref }>
          {
            Boolean( getAuthToken() && ( getLanguagesLoading || selectedLanguagesLoading ) ) ? (
              <FocusContext.Provider focusable={ false }
                value=''
              >
                <Loader />
              </FocusContext.Provider>
            ) : (
              <div className='MultiLanguageList'>
                <FocusContext.Provider focusable={ false }
                  value=''
                >
                  <div className='MultiLanguageList__header'>
                    { showBackButton && (
                      <Button
                        onClick={ ()=> history.goBack() }
                        iconLeftImage='GoBack'
                        iconLeft={ true }
                        label={ constants.GOBACK }
                      />
                    ) }
                    <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
                  </div>
                </FocusContext.Provider>
                <div className='MultiLanguageList__title'>
                  <Text
                    textStyle='title-2'
                    color='white'
                  >{ languageVerbiages.header }</Text>
                </div>
                <div className='MultiLanguageList__subTitle'>
                  { languageVerbiages.subHeader }
                </div>
                <div className='MultiLanguageList__container'
                  ref={ listRef }
                >
                  { languageList?.map( ( args, index ) => (
                    <React.Fragment key={ args.title }>
                      <MultiLanguageSelection
                        celebrityImage={ args.celebrityImage }
                        vernacularLanguageImage={ args.vernacularLanguageImage }
                        bgImg={ args.backgroundImage }
                        letterImg={ args.image }
                        title={ args.title }
                        isChecked={ args.isChecked }
                        value={ args.value }
                        id={ args.id }
                        onSelected={ onSelected }
                        languageSelectedLen={ selectedLength }
                        focusKeyRefrence={ `BUTTON_PRIMARY_${index}` }
                        onMouseEnterCallBackFn={ () => onMouseEnterCallBackFn( index ) }
                        setShowNotification={ setShowNotification }
                        setMessage={ setMessage }
                        defaultSelectList={ defaultSelectList }
                        onFocus={ ( e )=> {
                          previousPathName.previousMediaCardFocusBeforeSplash = `BUTTON_PRIMARY_${index}`
                          setDefaultFocus( true )
                          onRailFocus( e )
                        } }
                      />
                    </React.Fragment>
                  ) ) }
                </div>
                {
                  emptyLanguage ? (
                    <div className='MultiLanguageList__noLanguageContainer'>
                      <Text textStyle='title-2'
                        color='white'
                      >
                        No Languages Found
                      </Text>
                    </div>
                  ) : (
                    <RenderBottomSection />
                  ) }
              </div>

            )
          }
        </div>
      </FocusContext.Provider>
      { showNotification &&
      <div className='MultiLanguageList__notification'>
        <Notifications
          message={ message }
        />
      </div>
      }
    </>
  )
}

/**
  * Property type definitions
  * @type {object}
  * @property {array} languageList - array of object for MultiLanguageSelection
  * @property {string} title - Language list page title
  * @property {bool} disabled - proceed button disable state
  */
export const propTypes =  {
  languageList: PropTypes.arrayOf(
    PropTypes.shape( {
      bgImg: PropTypes.string,
      letterImg: PropTypes.string,
      title: PropTypes.string,
      isChecked: PropTypes.bool
    } )
  ),
  title: PropTypes.string,
  disabled: PropTypes.bool
};

MultiLanguageList.propTypes = propTypes;

export default MultiLanguageList;
