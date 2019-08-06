import Dialog from 'kpc/components/dialog';
import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

export default class extends Dialog {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            ...super.defaults(),
            title: '使用说明',
        };
    }
}
