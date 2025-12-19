const validations = require( './../utils/validations' );

module.exports = {
  description: 'Component Generator',
  prompts: [
    {
      type: 'input',
      name: 'componentName',
      message: 'Name of your component (e.g. My Component)?',
      validate: value => {
        const validation = validations.minimumCharacters( 3, value );
        return validation;
      }
    },
    {
      type: 'input',
      name: 'componentDescription',
      message: 'Please add a description for this component',
      validate: value => {
        const validation = validations.minimumCharacters( 40, value );
        return validation;
      }
    },
    {
      type: 'confirm',
      name: 'isCSSNeeded',
      message: 'Does this component require CSS?',
      default: true
    },
    {
      type: 'list',
      name: 'viewType',
      message: 'What type of component is this? (e.g. Atom, Molecule, Organism)',
      choices: [
        { name: 'Atom, the smallest possible component', value: 'Atoms' },
        { name: 'Molecule, usually containing one or more Atoms', value: 'Molecules' },
        { name: 'Organism, usually containing one or more Molecules', value: 'Organisms' },
      ]
    },
    {
      type: 'confirm',
      name: 'isGridNeeded',
      message: 'Does this component require the usage of the Grid?',
      default: false
    }
  ],
  actions: function( data ){
    const actionArray = [];
    actionArray.push({
      type: 'add',
      path: `../../src/views/components/{{ properCase componentName }}/{{ properCase componentName }}.js`,
      templateFile: 'templates/view/view.js'
    });
    actionArray.push({
      type: 'add',
      path: `../../src/views/components/{{ properCase componentName }}/{{ properCase componentName }}.stories.js`,
      templateFile: 'templates/view/view.stories.js'
    });
    actionArray.push({
      type: 'add',
      path: `../../src/views/components/{{ properCase componentName }}/{{ properCase componentName }}.test.js`,
      templateFile: 'templates/view/view.test.js'
    });
    if( data.isCSSNeeded ){
      actionArray.push({
        type: 'add',
        path: `../../src/views/components/{{ properCase componentName }}/{{ properCase componentName }}.scss`,
        templateFile: 'templates/view/view.scss'
      });
    }
    return actionArray;
  }
}
