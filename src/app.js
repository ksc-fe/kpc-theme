import App from 'kpc/components/app';
import router from './router';
import {createBrowserHistory} from 'history';
// import '@/all.styl';

const history = createBrowserHistory();
const app = new App({container: document.getElementById('app')});

let unlisten;
function init(router) {
    if (unlisten) unlisten();

    unlisten = history.listen(async ({hash}) => {
        app.showLoading();
        const {Page, data} = await router.resolve({pathname: hash.substring(1)});
        await app.load(Page, data);
    });
    history.replace(location);
}
init(router);

if (module.hot) {
    module.hot.accept('./router', () => {
        const router = require('./router').default;
        init(router);
    });
}
