const path = require('path');

module.exports = {
    data: path.resolve(__dirname, '../data'),
    theme: '{data}/themes',
    stylus: '{theme}/theme.styl', 
    stylusTemplate: '{theme}/template',
}
