import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import components from '@/data/components';

export default class Index extends Intact {
    @Intact.template()
    static template = template; 

    defaults() {
        return {
            components,
            lastSize: '500px',
            collapseValue: ['$0', '$1'],
        };
    }
}
