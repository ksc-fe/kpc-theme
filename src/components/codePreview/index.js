import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import hljs from 'highlight.js/lib/highlight';
import stylus from 'highlight.js/lib/languages/stylus';
import 'highlight.js/styles/color-brewer.css';

hljs.registerLanguage('stylus', stylus);

class Code extends Intact {
    @Intact.template()
    static template = `<pre><code ref="code" class="stylus">{self.get('code')}</code></pre>`;

    _mount() {
        this.on('$changed:code', () => {
            hljs.highlightBlock(this.refs.code);
        });
        hljs.highlightBlock(this.refs.code);
    }
}

export default class CodePreview extends Intact {
    @Intact.template()
    static template = template;

    _init() {
        this.Code = Code;
    }
}
