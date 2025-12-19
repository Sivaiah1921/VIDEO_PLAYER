import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { init } from '@noriginmedia/norigin-spatial-navigation';

import ContextContainer from '../ContextContainer/ContextContainer';
import './AppContainer.scss';
import { getDebugMode } from '../../../utils/localStorageHelper';

init( {
  throttle: 50,
  throttleKeypresses: true,
  debug: getDebugMode()
} );

function AppContainer( { children, context } ){
  const location = global.location.pathname
  return (
    <div className='AppContainer'>
      <ContextContainer
        location={ location }
        context={ context }
      >
        <Router>
          { children }
        </Router>
      </ContextContainer>
    </div>
  );
}

export default AppContainer;