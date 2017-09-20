const {resolve} = require('path');
const webpack = require('webpack');

module.exports = {
	entry: resolve(__dirname, 'src', 'main.js'),

	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'public'),
		publicPath: '/'
	},

	context: resolve(__dirname, 'src'),

	devtool: 'inline-source-maps',

	devServer: {
		contentBase: resolve(__dirname, 'public'),
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader'],
				exclude: /node_modules/
			}
		]
	}
};
