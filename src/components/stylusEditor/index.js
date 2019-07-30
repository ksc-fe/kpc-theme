import Intact from 'intact';
import template from './index.vdt';

export default class StylusEditor extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            collapseValue: ['$0', '$1'],
            variables: [{}],
            code: '',
            availableVariables: [],
        }
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
}
