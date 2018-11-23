const MinifyPlugin = require('babel-minify-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        'main': './src/assets/js/main.js',
    },
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['latest', { modules: true }],
                        "stage-0",
                    ],
                },
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};