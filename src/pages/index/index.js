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
        }).then(res => {
            console.log(res.data);
        });
    }
}
