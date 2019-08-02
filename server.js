// define root path
global.__ROOT = __dirname;

const Advanced = require('advanced');
const Utils = Advanced.Utils;
const Path = require('path');
const Vdt = require('vdt');

const app = Advanced(function(app) {
    app.engine('vdt', Vdt.__express);
    app.set('views', Path.resolve(process.cwd(), 'views'));
    app.set('view engine', 'vdt');
    Vdt.configure('delimiters', ['{{', '}}']);

    // const webpack = require('webpack');
    // const webpackConfig = require('./config/webpack.config');
    // const webpackDevMiddleware = require('webpack-dev-middleware');
    // const webpackHotMiddleware = require('webpack-hot-middleware');
    // webpackConfig.entry = Object.keys(webpackConfig.entry).reduce((acc, key) => {
        // acc[key] = [
            // 'webpack-hot-middleware/client?reload=true',
            // webpackConfig.entry[key],
        // ];
        // return acc;
    // }, {});
    // const compiler = webpack(webpackConfig);

    // app.use(webpackDevMiddleware(compiler, {
        // publicPath: '/',
        // stats: {
            // colors: true
        // }
    // }));
    // app.use(webpackHotMiddleware(compiler));
    app.use(Advanced.Express.static(Path.resolve(__dirname, './node_modules/kpc/styles/fonts')));
    // app.use((req, res, next) => {
        // Utils.proxy(req, res, next, {
            // baseUrl: 'http://localhost:5678'
        // }); 
    // });
});

app.listen(Utils.c('port'), function() {
    Advanced.Logger.log('App is listening on the port ' + Utils.c('port'));
});
