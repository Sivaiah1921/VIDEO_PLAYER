import React from 'react';
import { keyCodeForBackFunctionality, sendExecptionToSentry } from '../../../utils/util';
import constants, { SENTRY_LEVEL, SENTRY_TAG } from '../../../utils/constants';

class ErrorBoundary extends React.Component{

  constructor( props ){
    super( props );
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError( error ){
    return { hasError: true };
  }

  componentDidCatch( error, errorInfo ){
    console.log( error ); // eslint-disable-line
    this.setState( {
      error,
      errorInfo
    } )
    if( error.name === constants.TYPE_ERROR || error.name === constants.REFERENCE_ERROR ){
      sendExecptionToSentry( error, `${ SENTRY_TAG.ERROR_BOUNDARY }`, SENTRY_LEVEL.FATAL );
    }
    else if( error.message.ToLowerCase().includes( 'warning' ) ){
      sendExecptionToSentry( error, `${ SENTRY_TAG.ERROR_BOUNDARY }`, SENTRY_LEVEL.WARNING );
    }
    else {
      sendExecptionToSentry( error, `${ SENTRY_TAG.ERROR_BOUNDARY }`, SENTRY_LEVEL.ERROR );
    }
  }

  componentDidMount(){
    // eslint-disable-next-line no-console
    console.log( 'errorInfo', this.state.errorInfo )
    window.addEventListener( 'keydown', this.onKeyPress );
  }

  componentWillUnmount(){
    window.removeEventListener( 'keydown', this.onKeyPress )
  }

  onKeyPress = ( { keyCode } ) => {
    if( keyCodeForBackFunctionality( keyCode ) ){
      if( this.state.errorInfo ){
        this.setState( { errorInfo: null } )
        if( window.webapis ){
          window.tizen.application.getCurrentApplication().exit();
        }
        else {
          window.close();
        }
        window.removeEventListener( 'keydown', this.onKeyPress )
      }
    }
  }

  render(){
    if( this.state.errorInfo ){
      return (
        <div>
          <h1 style={ { color: 'white', textAlign: 'center', marginTop: '19rem' } }>Something Went Wrong. Please press remote back button to exit the app.</h1>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary;