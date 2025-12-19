/**
 * React hook to track the visibility of a functional component based on IntersectionVisible Observer. This is used for lazy loading of the image component.
 *
 * @module utils/IntersectionObserver
 */
import { useState, useEffect, useRef } from 'react';

/**
 *
 * sets visible and hasIntersected to true once the elements is in viewport
 * visible flag indicates if the element is in viewport or not
 * hasIntersected flag indicates if the element has been in viewport atleast once
 * @param  { Function } setVisibility
 * @param  { boolean } visible
 * @param  { Function } setHasIntersected
 */
export const handleIntersectionObserver =  ( setVisibility, visible, setHasIntersected ) => entries => {
  entries?.forEach( entry => {
    if( entry.intersectionRatio > 0 ){
      setVisibility( true );
      setHasIntersected( true );
    }
    else if( visible ){
      // resets visible flag once the element is out not in the viewport
      setVisibility( false );
    }
  } );
}
/**
 * Method to clean the Observe objects created
 * @param  { Object } observer
 * @param  { Object } element
 */
export const cleanOb = ( observer, element ) => {
  if( observer.current ){
    observer.current.unobserve( element )
  }
}
/**
 * Method to observe element intersection and return the flag the accordingly
 * handleIntersection is a call back method to handle the intersection events
 * @param  { Object } node
 * @param  { Object } options={}
 * @param  { Function } handleIntersection
 * @return { Object }
 */
export const useIntersectionObserver = function( node, options = {}, handleIntersection ){
  const [visible, setVisibility] = useState( false );
  const [element, setElement] = useState( null );
  const [hasIntersected, setHasIntersected] = useState( false );
  const observer = useRef( null );
  // create a new intersection observer and pass in intersection observer options.
  observer.current = new IntersectionObserver( handleIntersectionObserver( setVisibility, visible, setHasIntersected ), options );

  useEffect( () => {
    setElement( node.current );
  }, [node?.current] );

  useEffect( () => {
    if( !element ){
      return
    }
    cleanOb( observer, element );
    observer.current.observe( element );
    // Should continue to observe the element and
    // invoke handleIntersection once the element is visible
    if( visible && handleIntersection ){
      handleIntersection( element );
    }
    return () => {
      cleanOb( observer, element );
    };
  }, [element, visible] );
  return { visible, hasIntersected };
}