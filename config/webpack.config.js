const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HappyPack = require('happypack');

const resolve = (path) => Path.resolve(__dirname, path);

module.exports = {
    mode: 'development',
    entry: {
        app: resolve('../src/app.js'),
    },
    output: {
        path: resolve('../dist'),
        filename: 'static/js/[name].[hash].js',
        chunkFilename: 'static/js/[name].[hash].js',
    },
    devtool: '#inline-source-map',
    resolve: {
        alias: {
            '@': resolve('../src'),
            'kpc': 'kpc/@stylus',
            '~': resolve('../node_modules/kpc-demo')
        }
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                include: [
                    resolve('../src'), 
                    resolve('../node_modules/kpc-demo'),
                ],
                use: 'happypack/loader?id=js',
                // use: [
                    // {
                        // loader: 'babel-loader',
                        // options: {
                            // cacheDirectory: true, 
                        // }
                    // }
                // ]
            },
            {
                test: /\.vdt$/,
                use: 'happypack/loader?id=vdt',
                // use: [
                    // {
                        // loader: 'babel-loader',
                        // options: {
                            // cacheDirectory: true, 
                        // }
                    // },
                    // {
                        // loader: 'vdt-loader',
                        // options: {
                            // delimiters: ['{{', '}}'],
                            // skipWhitespace: true,
                        // }
                    // }
                // ]
            },
            {
                test: /\.styl$/,
                use: 'happypack/loader?id=styl',
                // use: [
                    // {
                        // loader: 'style-loader',
                    // },
                    // {
                        // loader: 'css-loader', 
                        // options: {
                            // url: true,
                        // }
                    // },
                    // {
                        // loader: 'stylus-loader', 
                        // options: {
                            // 'include css': true,
                            // 'resolve url': true,
                            // sourceMap: false,
                            // 'import': resolve('../src/theme/index.styl'),
                        // }
                    // }
                // ]
            },
            {
                test: /\.css$/,
                use: 'happypack/loader?id=css',
                // use: [
                    // {
                        // loader: 'style-loader',
                    // },
                    // {
                        // loader: 'css-loader',
                        // options: {
                            // url: true
                        // }
                    // }
                // ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg|png)(\?.*)?$/,
                use: 'happypack/loader?id=file',
                // use: [
                    // {
                        // loader: 'file-loader',
                        // options: {
                            // outputPath: 'static/media/',
                        // }
                    // }
                // ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: resolve('../public/index.html'),
        }),
        new HappyPack({
            id: 'js',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, 
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'vdt',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, 
                    }
                },
                {
                    loader: 'vdt-loader',
                    options: {
                        delimiters: ['{{', '}}'],
                        skipWhitespace: true,
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'styl',
            loaders: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader', 
                    options: {
                        url: true,
                    }
                },
                {
                    loader: 'stylus-loader', 
                    options: {
                        'include css': true,
                        'resolve url': true,
                        sourceMap: false,
                        'import': resolve('../src/theme/index.styl'),
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'css',
            loaders: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        url: true
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'file',
            loaders: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/media/',
                    }
                }
            ]
        }),
    ],
    devServer: {
        port: 5678,
        hot: true,
    },
    watchOptions: {
        ignored: /node_modules/
    }
}
