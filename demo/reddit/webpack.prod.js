const {resolve} = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
  entry: resolve(__dirname, 'src', 'main.js'),

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'public', 'static', 'js'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'SIMPLE',
      },
      jsCompiler: true,
    }),
  ],
};
