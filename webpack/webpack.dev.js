var webpack = require('webpack');
var path = require("path");
var externals = require("./externals");

module.exports = {
    devtool: 'sourcemap',
    debug: true,
    entry: {
        index: ['webpack-hot-middleware/client?path=http://localhost:8086/__webpack_hmr', './index.tsx']
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['babel-loader', 'ts-loader'],
                exclude: [
                    "node_modules"
                ]
            }
        ],
        noParse: Object.keys(externals)
    },
	output: {
        filename: '[name].js',
        path: __dirname + "/static/",
        publicPath: "/static/",
        include: __dirname
	},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.ProgressPlugin(function handler(percentage, msg) {
            var line = "Processing " + msg + "\t" + Math.floor(percentage * 100) + "%";
            console.log(line);
        })
    ],
    resolve: {
        extensions: ['', '.jsx', '.js', '.tsx', '.ts']
    },
    externals: externals
};
