import Intact from 'intact';
import template from './index.vdt';
import hljs from 'highlight.js/lib/highlight';
import stylus from 'highlight.js/lib/languages/stylus';
import js from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/color-brewer.css';

hljs.registerLanguage('stylus', stylus);
hljs.registerLanguage('js', js);
hljs.registerLanguage('html', html);

export default class Code extends Intact {
    @Intact.template()
    static template = template; 

    defaults() {
        return {
            language: 'stylus',
        };
    }

    _mount() {
        this.on('$changed:code', () => {
            hljs.highlightBlock(this.refs.code);
        });
        hljs.highlightBlock(this.refs.code);
    }
}

