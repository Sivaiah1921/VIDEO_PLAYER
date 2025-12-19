module.exports = function( api ){
  const isProd = process.env.REACT_APP_NODE_ENV === 'production' || process.env.REACT_APP_NODE_ENV === 'stage'
  api.cache( true );
  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ],
    plugins: [
      ...( isProd ? [
        'transform-react-remove-prop-types',
        'transform-remove-console'
      ] : [] )
    ]
  };
};
