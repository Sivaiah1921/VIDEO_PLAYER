/**
 * Reducer Generator
 */

const reducerExists = require('../utils/reducerExists');

module.exports = {
  description: 'Add a redux reducer',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Reducer',
    validate: (value) => {
			//TODO change regex to only look inside of the reducer folder intstead of the entire proejct
      if ((/.+/).test(value)) {
        return reducerExists(value) ? 'A reducer with this name already exists' : true;
      }

      return 'The name is required';
    },
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
      }];

    return actions;
  },
};
