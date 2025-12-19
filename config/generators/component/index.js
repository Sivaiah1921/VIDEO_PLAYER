/**
 * Component Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add an unconnected component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Component',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantMessages',
    default: true,
    message: 'Do you want i18n messages (i.e. will this component use text)?',
  }],
  actions: (data) => {
    // Generate index.js and index.test.js

    const actions = [{
      type: 'add',
      path: '../../src/components/{{properCase name}}/{{properCase name}}.jsx',
      templateFile: './component/es6.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/components/{{properCase name}}/{{properCase name}}.test.js',
      templateFile: './component/test.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/components/{{properCase name}}/{{properCase name}}.scss',
      templateFile: './scss/scss.js.hbs',
      abortOnFail: true,
    }];

    // If they want a i18n messages file
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../src/components/{{properCase name}}/{{properCase name}}.messages.js',
        templateFile: './messages/messages.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
