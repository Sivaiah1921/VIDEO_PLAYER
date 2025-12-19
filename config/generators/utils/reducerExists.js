const fs = require('fs');
const reducers= fs.readdirSync('src/redux/reducers');

/**
 * componentExists
 *
 * Check whether the given component exist in either the reducers or containers directory
 */
function reducerExists(reducer) {
  return reducers.indexOf(reducer) >= 0;
}

module.exports = reducerExists;

