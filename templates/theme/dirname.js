const path = require('path');

module.exports = function() {
    return function(style) {
        style.define('__dirname', function() {
            return path.dirname(style.nodes.filename);
        });
    };
};
