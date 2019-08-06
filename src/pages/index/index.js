import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import components from '@/data/components';
import {api} from '@/request';
import Message from 'kpc/components/message';

window.qs = location.search.substring(1).split('&').reduce((acc, item) => {
    const [key, value] = item.split('=');
    acc[key] = value;
    return acc;
}, {});

export default class Index extends Intact {
    @Intact.template()
    static template = template; 

    defaults() {
        return {
            components,
            lastSize: '500px',
            variables: [{}],
            code: '',
            globalVariables: [{}],
            globalCode: '',
            component: 'button',
            tab: 'component',
        };
    }

    _init() {
        this.set('id', qs.id);

        this._watch();

        return Promise.all([this._fetchGlobalVariables(), this._fetch()]);
    }

    _watch() {
        this.on('$change:component', (c, v) => {
            this._fetch();
        });
    }

    _fetchGlobalVariables() {
        return Promise.all([
            api.getVariables().then(res => {
                this.set('globalAvailableVariables', res.data);
            }),
            this._fetchStylus(),
        ]);
    }

    _fetch() {
        const component = this.get('component');
        return Promise.all([
            api.getVariables({component}).then(res => {
                this.set('availableVariables', res.data);
            }),
            this._fetchStylus(component),
            api.getStylusCode({component}).then(res => {
                this.set({
                    originalVariables: res.data.variables,
                    originalCode: res.data.code,
                });
            }),
        ]);
    }

    _fetchStylus(component) {
        const id = this.get('id');
        if (!id) return;

        return api.getStylus({id, component}).then(res => {
            let {variables, code} = res.data;
            variables = _.size(variables) ? _.map(variables, (value, key) => {
                return {name: key, value: value};
            }) : [{}];

            if (component) {
                this.set({variables, code});
            } else {
                this.set({globalVariables: variables, globalCode: code});
            }
        });
    }

    _save() {
        const {variables, code, component, globalVariables, globalCode, id} = this.get();
        return api.save({
            variables, code, component, globalVariables, globalCode, id,
        }).then(res => {
            const {id, css} = res.data;
            if (id !== this.get('id')) {
                history.pushState(null, null, `?id=${id}${location.hash}`);
                this.set('id', id, {silent: true});
                Message.success('主题已保存，请记住当前页面URL，以便下次修改');
            }
            this._dispachUpdateStyle(css);
        });
    }

    _dispachUpdateStyle(css) {
        // dispatch event for iframe update style
        const event = new CustomEvent('update:style', {detail: css});
        window.dispatchEvent(event);
    }

    _download() {
        window.open(`/api/download?id=${this.get('id')}`);
    }

    async _helper() {
        const Dialog = await import('@/components/usage');
        const dialog = new Dialog.default();
        dialog.show();
    }
}
