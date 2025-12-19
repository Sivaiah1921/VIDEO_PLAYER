const fs = require('fs');
const components = fs.readdirSync('src/redux/actions');

/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */
function actionExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = actionExists;

