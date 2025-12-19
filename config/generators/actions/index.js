/**
 * Container Generator
 */

const actionExists = require('../utils/actionExists');

module.exports = {
  description: 'Add Actions',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Actions',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return actionExists(value) ? 'Actions with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {
    // Generate index.js and index.test.js

    const actions = [{
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.reducer.js',
        templateFile: './actions/actions.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: '../../src/redux/actions/{{properCase name}}/{{properCase name}}.actions.test.js',
        templateFile: './actions/actions.test.js.hbs',
        abortOnFail: true,
      }];




    return actions;
  },
};
