/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const sagaExists = require('../utils/sagaExists');
const reducerExists = require('../utils/reducerExists');
const actionExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a Duck module',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Duck',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A duck with this name already exists' : true;
      }

      return 'The name is required';
    },
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
  }],
  actions: (data) => {
    // Generate index.js and index.test.js
    const actions = [{
        type: 'add',
        path: '../../src/redux/reducers/{{properCase name}}/{{properCase name}}.reducer.js',
        templateFile: './reducer/reducer.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: '../../src/redux/reducers/{{properCase name}}/{{properCase name}}.reducer.test.js',
        templateFile: './reducer/reducer.test.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.js',
        templateFile: './actions/actions.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.test.js',
        templateFile: './actions/actions.test.js.hbs',
        abortOnFail: true,
      }];


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
