import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

export default class CodePreview extends Intact {
    @Intact.template()
    static template = template;
}
