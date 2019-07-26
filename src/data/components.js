const docJson = require('kpc-demo/doc.json');

module.exports = docJson['组件'].reduce((acc, value) => {
    const [, name] = value.path.match(/components\/([^\/]+)/); 

    // ignore app
    if (name === 'app') return acc;

    acc.push({name, title: value.title});
    return acc;
}, []).sort((a, b) => {
    return a.name > b.name ? 1 : -1;
});
