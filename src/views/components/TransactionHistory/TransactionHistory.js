/**
 * Transaction History
 *
 * @module views/components/TransactionHistory
 * @memberof -Common
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';
import Divider from '../Divider/Divider';
import './TransactionHistory.scss';
import { useAxios } from '../../../utils/slayer/useAxios';
import serviceConst from '../../../utils/slayer/serviceConst';
import { COMMON_HEADERS, constants } from '../../../utils/constants';
import Button from '../Button/Button';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { getAnonymousId, getAuthToken, getBaID, getDeviceToken, getDthStatus, getProfileId, getSubscriberId } from '../../../utils/localStorageHelper';
import InfiniteScroll from 'react-infinite-scroll-component';
import { modalDom } from '../../../utils/util';

/**
 * Represents a TransactionHistory component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns TransactionHistory
 */
const TransactionHistoryListComponent = ( { responseList, handleScroll } )=> {
  const scrollRef = useRef( null )
  const initRef = useRef( 1 )
  const { ref, focusSelf } = useFocusable( {
    onArrowPress:( direction )=>{
      const toTalHeight = document.querySelector( '.TransactionHistory__left' )?.clientHeight
      const el = document.querySelector( '.TransactionHistory__contentScroll' )
      if( direction === 'down' && initRef.current <= ( toTalHeight - ( 4 * 175 ) ) ){ // 175 is the height of the row, 4 is the no. of rows
        initRef.current = initRef.current + 175
        if( el ){
          el.scrollTop = initRef.current
        }

        handleScroll( toTalHeight, initRef.current )
      }
      if( direction === 'up' && initRef.current > 1 ){
        initRef.current = initRef.current - 175
        if( el ){
          el.scrollTop = initRef.current
        }
        handleScroll( toTalHeight, initRef.current )
      }
    }

  } );

  useEffect( ()=>{
    if( !modalDom() ){
      focusSelf()
    }
  }, [] )

  return (
    <div className='TransactionHistory__contentScroll'
      ref={ scrollRef }
    >
      <div className='TransactionHistory__left'>
        { responseList?.data?.map( ( elm, i ) => (
          <div key={ i }
            className='TransactionHistory__list'
          >
            <div className='TransactionHistory__row'>
              <Text
                textStyle='header-3'
                color='white'
              >
                { 'ID ' + elm.transactionId }
              </Text>
              <Text
                textStyle='header-3'
                color='white'
              >
                { '\u20B9 ' + elm.transactionAmount }
              </Text>
            </div>
            <div className='TransactionHistory__row'>
              <Text
                textStyle='subtitle-2'
                color='bingeBlue-50'
              >
                { elm.paymentModeVerbiage }
              </Text>
              <Text
                textStyle='subtitle-2'
                color='white'
              >
                { elm.paymentMethodType }
              </Text>
            </div>
            {
              elm.remarks && (
                <Text
                  textStyle='subtitle-2'
                  color='bingeBlue-50'
                >{ elm.remarks }
                </Text>
              )
            }
            { elm.expiryDate && <div className='TransactionHistory__row dueOn'>
              <Text
                textStyle='subtitle-2'
                color='white'
              >
                { 'Due On: ' + elm.expiryDate }
              </Text>

            </div> }
            <div className='TransactionHistory__row'>
              <Text
                textStyle='subtitle-2'
                color='bingeBlue-50'
              >
                { elm.transactionDate }
              </Text>
            </div>
            <Divider horizontal={ true } />
          </div>
        ) ) }
      </div>
    </div>
  )
}


export const TransactionHistory = function( props ){

  const [arrowDown, setArrowDown] = useState( false );
  const history = useHistory()

  const { ref, focusKey } = useFocusable( {
    isFocusBoundary: true
  } );
  const { TRANSACTION_HISTORY } = serviceConst;
  const titleRef = useRef( null );
  const contentRef = useRef( null );
  const histContentRef = useRef( null );
  const arrowRef = useRef( null );
  const [noData, setNoData] = useState( false );
  const [transactions, setTransactions] = useState( [] );
  const [hasMore, setHasMore] = useState( true );

  const [pageData, setPageData] = useState( {
    pageLimit: 10,
    pageOffset: 0
  } );

  const transactionParams = {
    url: TRANSACTION_HISTORY,
    method: 'POST',
    headers: {
      rule: COMMON_HEADERS.RULE,
      profileId: getProfileId(),
      authorization: getAuthToken(),
      dthStatus:getDthStatus(),
      platform: COMMON_HEADERS.PLATFORM,
      deviceToken: getDeviceToken(),
      beforeLogin: 'false',
      subscriberId: getSubscriberId(),
      deviceId: COMMON_HEADERS.DEVICE_ID,
      source:'',
      anonymousId: getAnonymousId(),
      deviceName:COMMON_HEADERS.DEVICE_NAME
    },
    data: {
      baId: getBaID()
    }
  };

  const { response, error, loading } = useAxios( transactionParams );


  useEffect( () => {
    if( response?.data.length === 0 ){
      setNoData( true )
    }
    else {
      const data = response?.data;
      if( data && data?.items ){
        setTransactions( [...transactions, ...data.items] );
        setPageData( {
          ...pageData,
          pageOffset: parseInt( data.offset, 10 ),
          totalItems: parseInt( data.total, 10 )
        } );
        setHasMore( parseInt( data.offset, 10 ) < parseInt( data.total, 10 ) )
      }

    }
  }, [response] );

  const loadMore = () => {
    const tempPageData = { ...pageData, pageOffset: transactions.length };
    setPageData( { ...tempPageData } );
    fetchData( { params: tempPageData } );
  }

  const handleScroll = ( event, initValue ) => {
    initValue >= 20 ? setArrowDown( true ) : setArrowDown( false )
  };

  const MouseWheelHandler = ( e ) => {
    const event = window.event || e;
    const delta = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
    delta >= 1 ? setArrowDown( true ) : setArrowDown( false )
    return false;
  }
  useEffect( ()=>{
    window.addEventListener( 'wheel', MouseWheelHandler );
    return () => {
      window.removeEventListener( 'wheel', MouseWheelHandler );
    }
  }, [] )

  return (
    <div ref={ ref }>
      { loading && <Loader /> }
      { !loading &&
      <FocusContext.Provider value={ focusKey }>
        <>
          <div className='TransactionHistory'>
            <div className='TransactionHistory__header'>
              <Button
                onClick={ ()=> history.goBack() }
                iconLeftImage='GoBack'
                iconLeft={ true }
                secondary={ true }
                label={ constants.TOCLOSE }
              />
              <Icon name={ constants.MY_ACCOUNT.BINGE_LOGO } />
            </div>
            <div className='TransactionHistory__title'
              ref={ titleRef }
            >
              <Icon
                name={ constants.TRANSACTION_HISTORY_PAGE.ICON }
              />
              <Text
                textStyle='header-2'
                color='white'
              >
                { constants.TRANSACTION_HISTORY_PAGE.TITLE }
              </Text>
            </div>
            <div
              id='transaction_scrollContainer'
              className='TransactionHistory__scrollContainer'
            >
              <InfiniteScroll
                dataLength={ transactions.length }
                scrollableTarget='transaction_scrollContainer'
                next={ loadMore }
                hasMore={ hasMore }
              >
                <div className='TransactionHistory__content'>

                  { !noData &&
                  <TransactionHistoryListComponent responseList={ response }
                    handleScroll={ handleScroll }
                  /> }
                  { /* { !noData && response?.data?.length > 3 && */ }
                  { !noData &&
                  <div className='TransactionHistory__right'
                    ref={ arrowRef }
                  >
                    <Divider vertical={ true } />
                    <Icon name='ArrowDown'
                      className={
                        classNames( {
                          'TransactionHistory__arrowDownRotate180': arrowDown
                        } )
                      }
                    />
                  </div>
                  }
                  <div className='TransactionHistory__gradient'></div>
                </div>
              </InfiniteScroll>
              { noData && <h2> no transaction found. </h2> }
            </div>
          </div>
          <div className='TransactionHistory__background'></div>
        </>
      </FocusContext.Provider>
      }
    </div>

  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {array} titleIcon - set of titleIcon properties
 * @property {array} title - set of title properties
 * @property {array} transactionHistory - set of transaction history properties
 */
export const propTypes = {
  titleIcon: PropTypes.string,
  title: PropTypes.string,
  transactionHistory: PropTypes.array
};


TransactionHistory.propTypes = propTypes;

export default TransactionHistory;
