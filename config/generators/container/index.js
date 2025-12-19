/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const sagaExists = require('../utils/sagaExists');
const reducerExists = require('../utils/reducerExists');
const actionExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Container',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantSASS',
    default: false,
    message: 'Do you want SASS for this container?',
  },{
    type: 'confirm',
    name: 'wantActions',
    default: true,
    message: 'Do you want actions for this container?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return actionExists(value) ? 'An action with this name already exists' : true;
      }

      return 'The name is required';
    },
  },{
    type: 'confirm',
    name: 'wantReducers',
    default: true,
    message: 'Do you want a reducer created for this container?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return reducerExists(value) ? 'A reducer with this name already exists' : true;
      }

      return 'The name is required';
    }
  }, {
    type: 'confirm',
    name: 'wantSagas',
    default: false,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return sagaExists(value) ? 'A reducer with this name already exists' : true;
      }

      return 'The name is required';
    }
  }, 
  {
    type: 'confirm',
    name: 'wantMessages',
    default: false,
    message: 'Do you want i18n messages (i.e. will this component use text)?',
  }],
  actions: (data) => {
    // Generate index.js and index.test.js
    const actions = [{
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.jsx',
      templateFile: './container/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.test.js',
      templateFile: './container/test.js.hbs',
      abortOnFail: true,
    }];

    // If component wants sass
    if (data.wantSASS) {
      actions.push({
          type: 'add',
          path: '../../src/containers/{{properCase name}}/{{properCase name}}.scss',
          templateFile: './scss/scss.js.hbs',
          abortOnFail: true,
        });
    }

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/{{properCase name}}.messages.js',
        templateFile: './messages/messages.js.hbs',
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantReducers) {
      // Reducer
      actions.push({
        type: 'add',
        path: '../../src/redux/reducers/{{properCase name}}/{{properCase name}}.reducer.js',
        templateFile: './reducer/reducer.js.hbs',
        abortOnFail: true,
      });

      // Reducer Test
      actions.push({
        type: 'add',
        path: '../../src/redux/reducers/{{properCase name}}/{{properCase name}}.reducer.test.js',
        templateFile: './reducer/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

     if (data.wantActions) {
      // actions
      actions.push({
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.js',
        templateFile: './actions/actions.js.hbs',
        abortOnFail: true,
      });

      // actions Test
      actions.push({
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.test.js',
        templateFile: './actions/actions.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSagas) {
      actions.push({
        type: 'add',
        path: '../../src/redux/sagas/{{properCase name}}/{{properCase name}}.sagas.js',
        templateFile: './sagas/sagas.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/redux/sagas/{{properCase name}}/{{properCase name}}.sagas.test.js',
        templateFile: './sagas/sagas.test.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
