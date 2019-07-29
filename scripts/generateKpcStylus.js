const madge = require('madge');
const Path = require('path');

madge(Path.resolve(__dirname, '../node_modules/kpc/index.js')).then(res => {
    console.log(res);
});
