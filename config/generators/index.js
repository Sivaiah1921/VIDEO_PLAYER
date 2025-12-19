/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');
const languageGenerator = require('./language/index.js');
const duckGenerator = require('./duck/index.js');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('language', languageGenerator);
  plop.setGenerator('duck', duckGenerator);
  
  plop.addHelper('directory', (comp) => {
    try {
      fs.accessSync(`client/src/containers/${comp}`, fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      return `components/${comp}`;
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
