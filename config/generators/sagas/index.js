/**
 * Container Generator
 */

const sagaExists = require('../utils/sagaExists');

module.exports = {
  description: 'Add a Saga',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Saga',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return sagaExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {
    // Generate index.js and index.test.js

    const actions = [{
        type: 'add',
        path: '../../src/redux/sagas/{{properCase name}}/{{properCase name}}.sagas.js',
        templateFile: './sagas/sagas.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: '../../src/redux/sagas/{{properCase name}}/{{properCase name}}.sagas.test.js',
        templateFile: './sagas/sagas.test.js.hbs',
        abortOnFail: true,
      }];

    return actions;
  },
};
