const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    entry: `${path.resolve(__dirname, '../src')}/index.tsx`,
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        }),
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: 'bundle-report.json'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src/')
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    }
};

