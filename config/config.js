const path = require('path');

module.exports = {
    data: path.resolve(__dirname, '../data'),
    theme: '{data}/themes',
    template: path.resolve(__dirname, '../templates'),
    stylus: '{template}/theme.styl', 
    stylusTemplate: '{template}/theme',
}
