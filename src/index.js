/* eslint-disable no-console */
import 'react-app-polyfill/stable';
import 'promise.allsettled/auto';
import ReactDOM from 'react-dom';
import Routes from './views/core/AppRoutes/AppRoutes';
import { renderApplication } from './utils/dom/dom';
import './global.scss';
import { appsflyerInit } from './utils/appsflyer/appsflyer';
import { getAppVersion } from './utils/util';

if( process.env.REACT_APP_NODE_ENV === 'production' ){
  console.log = () => { }
  console.error = () => { }
  console.debug = () => { }
}

async function initializeApp(){
  appsflyerInit();
  await getAppVersion();
}

export function render(){
  renderApplication( {
    ModuleRoutes: Routes,
    renderer: ReactDOM.render,
    targetElementId: 'root'
  } );
}

render();
initializeApp();