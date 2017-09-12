'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const TextPlugin = require('extract-text-webpack-plugin');
const {NODE_ENV = 'development'} = process.env;

function getConfig(env) {
    const isDevelopment = env === 'development';

    return {
        bail: !isDevelopment, // exit on error with status code 1
        context: path.join(__dirname, 'app'),

        entry: [
            'babel-polyfill',
            './components/bootstrap/index.js',
        ],
        output: {
            filename: isDevelopment ? 'build.js' : 'build.min.js',
            path: `${__dirname}/build`,
            publicPath: '/',
            pathinfo: isDevelopment,
        },
        resolve: {
            extensions: ['.js'],
            modules: [
                path.join(__dirname, 'app'),
                'node_modules',
            ],
        },

        devtool: 'source-map',

        module: {
            rules: [{
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                },
            }, {
                test: /\.css$/,
                use: TextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                                minimize: isDevelopment ? false : {
                                    autoprefixer: false,
                                    core: true,
                                    convertValues: true,
                                    discardComments: true,
                                    discardEmpty: true,
                                    mergeRules: true,
                                    minifyGradients: true,
                                    minifySelectors: true,
                                    normalizeString: true,
                                    normalizeUrl: true,
                                    reduceBackgroundRepeat: true,
                                    reducePositions: true,
                                    reduceTransforms: true,
                                    svgo: false,
                                    styleCache: true,
                                    reduceTimingFunctions: true,
                                    reduceInitial: true,
                                    orderedValues: true,
                                    normalizeCharset: true,
                                    minifyParams: true,
                                    minifyFontValues: true,
                                    mergeLonghand: true,
                                    functionOptimiser: true,
                                    filterOptimiser: true,
                                    discardOverridden: true,
                                    discardDuplicates: true,
                                    colormin: true,
                                    zindex: false,
                                },
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                    ],
                }),
            }, {
                test: /\.(gif|jpe?g|png)$/,
                loader: 'url-loader?limit=1&name=images/[hash].[ext]',
            }],
        },
        plugins: [
            !isDevelopment && new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
            }),
            new TextPlugin(isDevelopment ? 'styles.css' : 'styles.min.css'),
            new HtmlPlugin({
                template: 'layouts/template.html',
                filename: 'index.html',
                inject: true,
                hash: !isDevelopment,
                minify: !isDevelopment && {
                    html5: true,
                    collapseBooleanAttributes: true,
                    removeComments: true,
                },
            }),
        ].filter(Boolean),

        watchOptions: {
            aggregateTimeout: 100,
        },
    };
}

module.exports = getConfig(NODE_ENV);

