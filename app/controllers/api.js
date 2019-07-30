const Advanced = require('advanced');
const stylus = require('stylus');
const Fs = require('fs');
const fsExtra = require('fs-extra');
const shortId = require('shortid');

const fs = Fs.promises;
const {Utils} = Advanced;

module.exports = Advanced.Controller.extend({
    async getVariables() {
        const {component} = this.req.query; 

        const file = component ? 
            `${Utils.c('kpcStylus')}/${component}/variables.styl` : 
            Utils.c('kpcGlobalStylusFile');
        
        const contents = await fs.readFile(file, 'utf-8');
        const variables = contents.split('\n').reduce((acc, line) => {
            if (line[0] === '$') {
                const [name, value] = line.split(':=');
                if (name && value) {
                    acc[name.trim()] = value.trim();
                }
            }
            return acc;
        }, {});

        this._success(variables);
    },

    async save() {
        const {variables, code, component, globalVariables, globalCode, id} = this.req.body;

        const {path: themePath, id: _id} = await this._initTemplateById(id); 
        const indexFile = `${themePath}/index.styl`;

        const [content] = await Promise.all([
            fs.readFile(Utils.c('stylus'), {encoding: 'utf-8'}),
            this._writeVariables(`${component}.variables.styl`, themePath, variables, indexFile),
            this._writeVariables(`global.variables.styl`, themePath, globalVariables, indexFile),
            this._writeExtraStylus(`reset.styl`, themePath, globalCode),
            this._writeExtraStylus(`${component}.styl`, themePath, code),
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

    async _writeVariables(filename, themePath, variables, indexFile) {
        const file = `${themePath}/${filename}`;

        const contents = variables.reduce((acc, item) => {
            if (item.name && item.value) {
                acc.push(`${item.name} := ${item.value}`);
            }
            return acc;
        }, []).join('\n');

        if (!await fsExtra.pathExists(file)) {
            // add @require in index.styl for creating variables file first time
            await fs.writeFile(indexFile, `\n@require('./${filename}')`, {flag: 'a'});
        }
        await fs.writeFile(file, contents);
    },

    async _writeExtraStylus(filename, themePath, contents) {
        if (contents) {
            await fs.writeFile(`${themePath}/${filename}`, contents);
        }
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
