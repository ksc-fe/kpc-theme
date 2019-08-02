const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const resolve = (path) => Path.resolve(__dirname, path);

module.exports = {
    mode: 'development',
    entry: {
        app: resolve('../src/app.js'),
    },
    output: {
        path: resolve('../dist'),
        filename: 'static/js/[name].js',
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
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, 
                        }
                    }
                ]
            },
            {
                test: /\.vdt$/,
                use: [
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
            },
            {
                test: /\/kpc\/.*(kpc|index)\.styl$/,
                include: resolve('../node_modules/kpc/'),
                use: 'null-loader',
            },
            {
                test: /\.styl$/,
                use: [
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
                            // 'import': resolve('../src/theme/index.styl'),
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
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
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg|png)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/media/',
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: resolve('../public/index.html'),
        }),
    ],
    devServer: {
        port: 5678,
        hot: true,
        proxy: {
            '/api': 'http://localhost:8586',
            '**/*.@(ttf|woff)': 'http://localhost:8586',
        }
    },
    watchOptions: {
        // ignored: /node_modules/
    }
}
