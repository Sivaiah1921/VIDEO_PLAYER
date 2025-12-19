
import constants, { PAGE_TYPE } from '../../../utils/constants'
import './ErrorPage.scss'
import Text from '../Text/Text'
import Button from '../Button/Button'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useEffect } from 'react'
import { modalDom } from '../../../utils/util'
import { useHistory } from 'react-router-dom'
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import { setAllLoginPath, getCatalogFlag, getSearchFlag, getBingeListFlag, getLiveFlagLocal, setPiLevel } from '../../../utils/localStorageHelper';
import { useHomeContext } from '../../core/HomePageContextProvider/HomePageContextProvider'

export const ErrorPage = ( props ) => {
  const { error, hideHeader } = props;
  const { setCatalogFlag, setSearchFlag, setBingeListFlag } = useHomeContext()
  const history = useHistory()
  const { ref, focusKey, focusSelf } = useFocusable( {
  } );

  useEffect( ()=>{
    if( document.querySelector( '.LeftNavContainer__divider' ) === null && !window.location.pathname.includes( 'other-categories' ) && !window.location.pathname.includes( 'discover' ) && !modalDom() ){
      focusSelf()
    }
  }, [] )

  const handleBackPress = ()=>{
    if( Boolean( getCatalogFlag() === 'true' || getSearchFlag() === 'true' || getBingeListFlag() === 'true' || getLiveFlagLocal() === 'true' ) && Boolean( window.location.pathname.includes( PAGE_TYPE.SEARCH ) || window.location.pathname.includes( PAGE_TYPE.BROSWSE_BY ) || window.location.pathname.includes( PAGE_TYPE.BINGE_LIST ) ) ){
      setCatalogFlag( false );
      setSearchFlag( false );
      setBingeListFlag( false );
      setAllLoginPath( [] );
      setPiLevel( 0 );
    }
    else if( props.onBack ){
      props.onBack();
    }
    else {
      history?.goback?.();
    }
  }

  return (
    <FocusContext.Provider value={ focusKey }>
      <div className='ErrorPage'
        ref={ ref }
      >
        { !hideHeader &&
        <FocusContext.Provider
          value=''
          focusable={ false }
        >
          <div className='ErrorPage__header'>
            <Button
              onClick={ ()=> handleBackPress() }
              iconLeftImage='GoBack'
              iconLeft={ true }
              secondary={ true }
              label={ constants.GOBACK }
            />
            <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
          </div>
        </FocusContext.Provider>
        }

        <div className={
          classNames( 'ErrorPage__container', {
            'ErrorPage__containerHeightWithoutHeader': hideHeader
          } ) }
        >
          <Text
            textStyle='autoPlay-title'
            color='white'
            textAlign='center'
          >
            {
              error ? error : constants.ERROR_MSG
            }
          </Text>
          <div className='ErrorPage--closeBtn'>
            <Button
              focusKeyRefrence={ 'CLOSE' }
            />
          </div>

        </div>
      </div>
    </FocusContext.Provider>
  )
}