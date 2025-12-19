const jsdoc2md = require('jsdoc-to-markdown')

console.log('get started');

jsdoc2md.render({ files: 'src/**/*.js' }).then(console.log('dope'))