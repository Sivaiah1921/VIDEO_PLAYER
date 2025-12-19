const fs = require('fs');
const pageComponents = fs.readdirSync('src/components');
const pageContainers = fs.readdirSync('src/containers');
const components = pageComponents.concat(pageContainers);

/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */
function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;

