const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: './',
        clean: true
    },
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: 'all'
        }
    }
});