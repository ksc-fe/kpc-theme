const Advanced = require('advanced');
const stylus = require('stylus');
const Fs = require('fs');
const fsExtra = require('fs-extra');

const fs = Fs.promises;
const {Utils} = Advanced;

module.exports = Advanced.Controller.extend({
    getVariables() {
        const {component} = this.req.query; 

        this._success({
            '$btn-color': '$light-black',
            '$btn-bg-color': '#fff',
        });
    },

    save() {
        const {variables, component} = this.req.body;
        console.log(variables);

        const themePath = Utils.c('theme') + '/demo';
        const indexFile = `${themePath}/index.styl`;
        const variablesFilename = `${component}.variables.styl`;
        const variablesFile = `${themePath}/${variablesFilename}`;

        const variablesContent = variables.map(item => {
            return `${item.name} := ${item.value}`;
        }).join('\n');

        // firstly copy template file
        fsExtra.pathExists(themePath).then(exists => {
            if (!exists) {
                return fsExtra.copy(Utils.c('stylusTemplate'), themePath);
            }
        }).then(() => {
            return fsExtra.pathExists(variablesFile);
        }).then(exists => {
            if (!exists) {
                // add @require in index.styl for creating variables file first time
                return fs.writeFile(indexFile, `\n@require('./${variablesFilename}')`, {flag: 'a'});
            }
        }).then(() => {
            return Promise.all([
                fs.readFile(Utils.c('stylus'), {encoding: 'utf-8'}),
                fs.writeFile(variablesFile, variablesContent),
            ]);
        }).then(([content]) => {
            stylus(content, {
                filename: Utils.c('stylus'),
                'include css': true,
                'resolve url': true,
            }).import(indexFile).render((err, css) => {
                if (err) return this._error(err);
                this._success(css);
            });
        });
    },

    _success(data) {
        this.res.json({
            status: 0,
            data
        });
    },

    _error(data) {
        this.res.status(500).json({
            status: 1,
            data
        });
        throw data;
    },
});
