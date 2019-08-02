import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {api} from '@/request';

const req = require.context('kpc-demo', true, /^\.\/components\/(?!(code|tabs))\w+\/demos\/.*index\.js$/);
const style = document.createElement('style');
document.head.appendChild(style);
const update = (css) => {
    const stylesheet = document.getElementById('stylesheet');
    if (stylesheet) {
        stylesheet.parentNode.removeChild(stylesheet);
    }
    style.textContent = '';
    style.appendChild(document.createTextNode(css));
}
top.addEventListener('update:style', (e) => {
    update(e.detail);
});
api.getCss({id: top.qs.id}).then(res => {
    update(res.data.css);
});

export default class Index extends Intact {
    @Intact.template()
    static template = template; 

    _init() {
        const componentName = this.get('name');

        const Demos = [];
        req.keys().forEach(key => {
            if (key.startsWith(`./components/${componentName}/`)) {
                const Demo = req(key);
                Demos.push({
                    Demo: Demo.default,
                    data: Demo.data.setting,
                    index: Demo.data.index,
                });
            }
        });
        this.set({Demos: Demos.sort((a, b) => {
            return a.data.order - b.data.order;
        })});
    }
}
