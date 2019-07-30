import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

const req = require.context('kpc-demo', true, /^\.\/components\/(?!(code|tabs))\w+\/demos\/.*index\.js$/);

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

    _mount() {
        const style = document.createElement('style');
        document.head.appendChild(style);
        top.addEventListener('update:style', (e) => {
            style.textContent = '';
            style.appendChild(document.createTextNode(e.detail));
        });
    }
}
