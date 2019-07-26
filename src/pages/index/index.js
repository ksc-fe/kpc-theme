import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import components from '@/data/components';

const req = require.context('kpc-demo', true, /^\.\/components\/\w+\/demos\/.*index\.js$/);

export default class Index extends Intact {
    @Intact.template()
    static template = template; 

    defaults() {
        return {
            components,
        };
    }

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
