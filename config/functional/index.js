
/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const viewGenerator = require('./generators/view.js');

module.exports = (plop) => {
  plop.setHelper( 'eq', function( a, b ){
    console.log( a, b );
    return a === b;
  } );
  plop.setGenerator('View', viewGenerator );
};
