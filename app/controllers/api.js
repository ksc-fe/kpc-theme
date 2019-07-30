const Advanced = require('advanced');
const stylus = require('stylus');
const Fs = require('fs');
const fsExtra = require('fs-extra');
const shortId = require('shortid');

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

    async save() {
        const {variables, component, id} = this.req.body;

        const {path: themePath, id: _id} = await this._initTemplateById(id); 
        const indexFile = `${themePath}/index.styl`;
        const variablesFilename = `${component}.variables.styl`;
        const variablesFile = `${themePath}/${variablesFilename}`;

        const variablesContent = variables.reduce((acc, item) => {
            if (item.name && item.value) {
                acc.push(`${item.name} := ${item.value}`);
            }
            return acc;
        }, []).join('\n');
    
        if (!await fsExtra.pathExists(variablesFile)) {
            // add @require in index.styl for creating variables file first time
            await fs.writeFile(indexFile, `\n@require('./${variablesFilename}')`, {flag: 'a'});
        }
        const [content] = await Promise.all([
            fs.readFile(Utils.c('stylus'), {encoding: 'utf-8'}),
            fs.writeFile(variablesFile, variablesContent),
        ]);

        stylus(content, {
            filename: Utils.c('stylus'),
            'include css': true,
            'resolve url': true,
        }).import(indexFile).render((err, css) => {
            if (err) return this._error(err);
            this._success({css, id: _id});
        });
    },

    async _initTemplateById(id) {
        const _id = id;

        if (!id) id = shortId();
        const path = Utils.c('theme') + '/' + id;

        if (_id && !await fsExtra.pathExists(path)) {
            throw `ID: ${id} does not exist.`;
        } else if (!_id) {
            await fsExtra.copy(Utils.c('stylusTemplate'), path);
        }

        return {path, id};
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
