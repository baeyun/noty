var path = require('path'),
	webpack = require('webpack');

const MINIFY = false;

module.exports = {
	entry: path.resolve(__dirname) + '/index.js',
	
	output: {
		path: path.resolve(__dirname) + '/dist',
		publicPath: '/dist',
		filename: MINIFY ? 'bundle.min.js' : 'bundle.js'
	},
	
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: { presets: ['react', 'es2015'] }
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},

	// plugins: [
	// 	new webpack.optimize.UglifyJsPlugin({
	// 		include: /\.min\.js$/,
	// 		minimize: true,
	// 		compress: true
	// 	})
	// ]
};
