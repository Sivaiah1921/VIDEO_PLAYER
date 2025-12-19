/* eslint-disable no-console */
import { useEffect, useRef, useCallback, useState } from 'react'
import { Centrifuge } from 'centrifuge'

export function useCentrifuge( {
  getToken, // async () => ({ token, expiry, serverUrl })
  onMessage,
  enabled = true
} ){
  const centrifugeRef = useRef( null ) // Centrifuge instance
  const subRef = useRef( null ) // Subscription instance
  const channelRef = useRef( null ) // Track current subscribed channel
  const refreshTimerRef = useRef( null ) // Token refresh timer

  const [isConnected, setIsConnected] = useState( false )
  const [isSubscribed, setIsSubscribed] = useState( false )

  const isConnectingRef = useRef( false ) // prevent parallel connects

  const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000 // 5 minutes

  /* ---------------- helpers ---------------- */

  const clearRefreshTimer = () => {
    if( refreshTimerRef.current ){
      clearTimeout( refreshTimerRef.current )
      refreshTimerRef.current = null
    }
  }

  const getRefreshDelay = expiryIso => {
    const expiryMs = new Date( expiryIso ).getTime()
    const now = Date.now()
    return Math.max( expiryMs - now - TOKEN_REFRESH_BUFFER, 10_000 )
  }

  /* ---------------- init / connect ---------------- */

  const initAndConnect = useCallback( async() => {
  // 1. prevent parallel executions
    if( !enabled || isConnectingRef.current ){
      return
    }
    isConnectingRef.current = true

    try {
    // 2. HARD GUARD: already connected → do nothing
      if( centrifugeRef.current?.state === 'connected' || centrifugeRef.current?.state === 'connecting' ){
        isConnectingRef.current = false
        return
      }

      // 3. fetch fresh token only when needed
      const { token, expiry, serverUrl } = await getToken()
      if( !token || !serverUrl || !expiry ){
        isConnectingRef.current = false
        return
      }

      // 4. init Centrifuge only once
      if( !centrifugeRef.current ){
        centrifugeRef.current = new Centrifuge( serverUrl, {
          transports: ['websocket', 'sse']
        } )

        centrifugeRef.current.on( 'connecting', ctx => {
          setIsConnected( false )
          console.log( '[Centrifuge] connecting', ctx )
        } )

        centrifugeRef.current.on( 'connected', ctx => {
          setIsConnected( true )
          console.log( '[Centrifuge] connected', ctx )
        } )

        centrifugeRef.current.on( 'disconnected', ctx => {
          setIsConnected( false )
          console.warn( '[Centrifuge] disconnected', ctx )
        } )

        centrifugeRef.current.on( 'error', err =>
          console.error( '[Centrifuge] error', err )
        )

        centrifugeRef.current.on( 'closed', ctx => {
          setIsConnected( false )
          console.warn( '[Centrifuge] closed', ctx )
        } )
      }

      // 5. update token & connect
      centrifugeRef.current.setToken( token )
      centrifugeRef.current.connect()

      // 6. schedule token refresh (5 min before expiry)
      clearRefreshTimer()
      refreshTimerRef.current = setTimeout(
        initAndConnect,
        getRefreshDelay( expiry )
      )
    }
    catch ( e ){
      console.error( '[Centrifuge] init/connect failed', e )
    }
    finally {
      isConnectingRef.current = false
    }
  }, [getToken, enabled] )

  const subscribe = useCallback( ( channel ) => { // subscribe to a channel
    if( !centrifugeRef.current || !channel ){
      return
    }

    // avoid duplicate subscription to the same channel
    if( channelRef.current === channel && subRef.current ){
      return
    }

    // clean up previous subscription if present
    if( subRef.current ){
      subRef.current.unsubscribe();
      if( typeof centrifugeRef.current.removeSubscription === 'function' ){
        centrifugeRef.current.removeSubscription( subRef.current );
      }
      subRef.current = null;
      channelRef.current = null;
      setIsSubscribed( false )
    }

    const sub = centrifugeRef.current.newSubscription( channel ) // create new subscription

    console.log( '[Centrifuge] subscribe ->', channel )

    sub.on( 'publication', ctx => {
      console.log( '[Centrifuge] publication', channel, ctx?.data )
      onMessage?.( ctx?.data )
    } )

    sub.on( 'error', err =>
      console.error( '[Centrifuge] subscription error', err )
    )

    sub.subscribe()
    subRef.current = sub
    channelRef.current = channel
    setIsSubscribed( true )
  }, [onMessage] )

  const disconnect = useCallback( () => { // disconnect centrifuge
    clearRefreshTimer()

    if( subRef.current ){
      subRef.current.unsubscribe()
      if( centrifugeRef.current && typeof centrifugeRef.current.removeSubscription === 'function' ){
        centrifugeRef.current.removeSubscription( subRef.current )
      }
      subRef.current = null
      channelRef.current = null
      setIsSubscribed( false )
    }
    centrifugeRef.current?.disconnect()
    centrifugeRef.current = null
    setIsConnected( false )
    isConnectingRef.current = false
  }, [] )

  useEffect( () => { // init & connect on mount
    if( enabled ){
      initAndConnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled] )

  return {
    subscribe,
    disconnect,
    isConnected,
    isSubscribed
  }
}
