const Advanced = require('advanced');
const stylus = require('stylus');
const Fs = require('fs');
const fsExtra = require('fs-extra');
const shortId = require('shortid');
const getStylusVariables = require('../utils/getStylusVariables');

const fs = Fs.promises;
const {Utils} = Advanced;

module.exports = Advanced.Controller.extend({
    async getVariables() {
        const {component} = this.req.query; 

        const file = component ? 
            `${Utils.c('kpcStylus')}/${component}/variables.styl` : 
            Utils.c('kpcGlobalStylusFile');
        
        const variables = await getStylusVariables(file); 

        this._success(variables);
    },

    async getStylus() {
        const {id, component} = this.req.query;

        const path = Utils.c('theme') + '/' + id;
        const variablesFile = component ? 
            `${path}/${component}.variables.styl` : 
            `${path}/global.variables.styl`;
        const codeFile = component ? `${path}/${component}.styl` : `${path}/reset.styl`;
        const readCode = () => {
            return fs.readFile(codeFile, 'utf-8').then(c => c, e => {
                console.log('getStylus', e);
                return '';
            });
        };
        const [variables, code] = await Promise.all([
            getStylusVariables(variablesFile),
            readCode(),
        ]);

        this._success({variables, code});
    },

    async save() {
        const {variables, code, component, globalVariables, globalCode, id} = this.req.body;

        const {path: themePath, id: _id} = await this._initTemplateById(id); 
        const indexFile = `${themePath}/index.styl`;

        await Promise.all([
            this._writeVariables(`${component}.variables.styl`, themePath, variables, indexFile),
            this._writeVariables(`global.variables.styl`, themePath, globalVariables, indexFile),
            this._writeExtraStylus(`reset.styl`, themePath, globalCode),
            this._writeExtraStylus(`${component}.styl`, themePath, code),
        ]);

        await this._compileToCss(id);
    },

    async getCss() {
        const {id} = this.req.query;
        await this._compileToCss(id);
    },

    async getStylusCode() {
        const {component} = this.req.query; 
        const [variables, code] = await Promise.all([
            fs.readFile(Utils.c('kpcStylus') + `/${component}/variables.styl`, 'utf-8'),
            fs.readFile(Utils.c('kpcStylus') + `/${component}/index.styl`, 'utf-8'),
        ]);

        this._success({variables, code});
    },

    async _compileToCss(id) {
        if (!id) return this._success({css: '', id});

        const content = await fs.readFile(Utils.c('stylus'), {encoding: 'utf-8'});

        stylus(content, {
            filename: Utils.c('stylus'),
            'include css': true,
            'resolve url': true,
        })
        .import(Utils.c('theme') + '/' + id + '/index.styl')
        .render((err, css) => {
            if (err) return this._error(err);
            this._success({css, id});
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
