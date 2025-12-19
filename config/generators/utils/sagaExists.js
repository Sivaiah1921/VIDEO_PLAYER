const fs = require('fs');
const sagas= fs.readdirSync('src/redux/sagas');

/**
 * componentExists
 *
 * Check whether the given component exist in either the sagas or containers directory
 */
function sagaExists(saga) {
  return sagas.indexOf(saga) >= 0;
}

module.exports = sagaExists;

