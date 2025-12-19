module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'include',
          'keyframes',
          'mixin',
          'if',
          'else',
          'function',
          'return',
          'each',
          'use',
          'for',
          'at-root'
        ]
      }
    ],
    indentation: 2,
    'function-parentheses-space-inside': 'always',
    'no-missing-end-of-source-newline': null,
    'number-leading-zero': null,
    'order/properties-alphabetical-order': true,
    'property-no-unknown': [true, { ignoreSelectors: [':export'] }],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'import', 'global', 'local', 'external']
      }
    ],
    'unit-allowed-list': ['fr', 'rem', 'px', '%', 's', 'ms', 'em', 'deg', 'vh', 'vw']
  }
};
