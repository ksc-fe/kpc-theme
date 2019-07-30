import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import components from '@/data/components';
import {api} from '@/request';

export default class Index extends Intact {
    @Intact.template()
    static template = template; 

    defaults() {
        return {
            components,
            lastSize: '500px',
            collapseValue: ['$0', '$1'],
            variables: [{}],
            globalVariables: [{}],
            component: 'button',
            tab: 'component',
        };
    }

    _init() {
        const qs = location.search.substring(1).split('&').reduce((acc, item) => {
            const [key, value] = item.split('=');
            acc[key] = value;
            return acc;
        }, {});
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
        return api.getVariables().then(res => {
            this.set('globalAvailableVariables', res.data);
        });
    }

    _fetch() {
        return api.getVariables({component: this.get('component')}).then(res => {
            this.set('availableVariables', res.data);
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
            }
            // dispatch event for iframe update style
            const event = new CustomEvent('update:style', {detail: css});
            window.dispatchEvent(event);
        });
    }
}
