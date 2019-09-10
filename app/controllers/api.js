const Advanced = require('advanced');
const stylus = require('stylus');
const Fs = require('fs');
const fsExtra = require('fs-extra');
const shortId = require('shortid');
const getStylusVariables = require('../utils/getStylusVariables');
const Archiver = require('archiver');

const fs = Fs.promises;
const {Utils} = Advanced;

const inputRegExp = /^[a-zA-Z0-9\-\_]*$/;

module.exports = Advanced.Controller.extend({
    async getVariables() {
        const {component} = this.req.query; 

        this._validate(component);

        const file = component ? 
            `${Utils.c('kpcStylus')}/${component}/variables.styl` : 
            Utils.c('kpcGlobalStylusFile');
        
        const variables = await getStylusVariables(file); 

        this._success(variables);
    },

    async getStylus() {
        const {id, component} = this.req.query;

        this._validate(id, component);

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

        this._validate(id, component);

        const {path: themePath, id: _id} = await this._initTemplateById(id); 
        const indexFile = `${themePath}/index.styl`;

        await Promise.all([
            this._writeVariables(`${component}.variables.styl`, themePath, variables, indexFile),
            this._writeVariables(`global.variables.styl`, themePath, globalVariables, indexFile),
            this._writeExtraStylus(`reset.styl`, themePath, globalCode),
            this._writeExtraStylus(`${component}.styl`, themePath, code),
        ]);

        try {
            const css = await this._compileToCss(_id);
            this._success({css, id: _id});
        } catch (e) {
            this._error(e);
        }
    },

    async getCss() {
        const {id} = this.req.query;

        this._validate(id);

        try {
            const css = await this._compileToCss(id);
            this._success({css, id});
        } catch (e) {
            this._error(e);
        }
    },

    async getStylusCode() {
        const {component} = this.req.query; 
        
        this._validate(component);

        const [variables, code] = await Promise.all([
            fs.readFile(Utils.c('kpcStylus') + `/${component}/variables.styl`, 'utf-8'),
            fs.readFile(Utils.c('kpcStylus') + `/${component}/index.styl`, 'utf-8'),
        ]);

        this._success({variables, code});
    },

    async download() {
        const {id} = this.req.query;
        if (!id) return this._error('theme id is required');

        this._validate(id);

        const path = `${Utils.c('theme')}/${id}`;
        if (!await fsExtra.pathExists(path)) {
            return this._error('theme id does not exist');
        }

        let css;
        try { 
            css = await this._compileToCss(id);
        } catch (e) {
            return this._error(e);
        }

        this.res.writeHead(200, {
            'content-type': 'application/tar',
            'content-disposition': `attachment; filename=${id}.tar.gz`,
        });

        const tar = Archiver('tar', {gzip: true});
        tar.pipe(this.res);
        tar.glob(`!(index).*`, {cwd: path})
            .append(
                (await fs.readFile(`${path}/index.styl`, 'utf-8'))
                    .replace('../../../node_modules/', '~'),
                {name: 'index.styl'}
            )
            .append(css, {name: 'index.css'})
            .finalize();
    },

    async _compileToCss(id) {
        if (!id) return '';

        const content = await fs.readFile(Utils.c('stylus'), {encoding: 'utf-8'});

        return new Promise((resolve, reject) => {
            stylus(content, {
                filename: Utils.c('stylus'),
                'include css': true,
                'resolve url': true,
            })
            .import(Utils.c('theme') + '/' + id + '/index.styl')
            .render((err, css) => {
                if (err) {
                    err = new Error(err.message.replace(new RegExp(Utils.c('root'), 'g'), ''));
                    return reject(err);
                }
                resolve(css);
            });
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

        const isMaterial = id === 'material';
        const shouldCopy = !id || isMaterial; 
        if (shouldCopy) id = shortId();
        const path = Utils.c('theme') + '/' + id;

        if (shouldCopy) {
            await fsExtra.copy(
                isMaterial ? 
                   Utils.c('theme') + '/material' : 
                   Utils.c('stylusTemplate'),
                path
            );
        } else if (!await fsExtra.pathExists(path)) {
            throw `ID: ${id} does not exist.`;
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
            message: data instanceof Error ? data.message : data
        });
        throw data;
    },

    _validate(...args) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] && !inputRegExp.test(args[i])) {
                return this._error('invalid parameter');
            }
        }
    }
});
