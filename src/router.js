import Router from 'universal-router';
import components from './data/components'

export default new Router([
    {
        path: '/',
        async action() {
            return {Page: (await import('./pages/index')).default}
        },
    },
    {
        path: '/components/:name',
        async action(context) {
            return {
                Page: (await import('./pages/index')).default,
                data: context.params,
            }
        }
    }
]);
