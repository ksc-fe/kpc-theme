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
        };
    }

    _init() {
        const qs = location.search.substring(1).split('&').reduce((acc, item) => {
            const [key, value] = item.split('=');
            acc[key] = value;
            return acc;
        }, {});
        this.set('id', qs.id);

        return this._fetch();
    }

    _fetch() {
        return api.getVariables({component: this.get('name')}).then(res => {
            this.set('availableVariables', res.data);
        });
    }

    _addVariable(index) {
        const variables = this.get('variables').slice(0);
        variables.splice(index + 1, 0, {});
        this.set({variables});
    }

    _removeVariable(index) {
        const variables = this.get('variables').slice(0);
        variables.splice(index, 1);
        this.set({variables});
    }

    _save() {
        return api.save({
            variables: this.get('variables'),
            component: this.get('name'),
            id: this.get('id'),
        }).then(res => {
            console.log(res.data.css);
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
