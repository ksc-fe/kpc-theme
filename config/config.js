const path = require('path');

module.exports = {
    data: path.resolve(__dirname, '../data'),
    theme: '{data}/themes',
    template: path.resolve(__dirname, '../templates'),
    stylus: '{template}/theme.styl', 
    stylusTemplate: '{template}/theme',

    kpcStylus: path.resolve(__dirname, '../node_modules/kpc/components'),
    kpcGlobalStylusFile: path.resolve(__dirname, '../node_modules/kpc/styles/themes/default.styl'),

    env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}
