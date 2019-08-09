import axios from 'axios';
import _ from 'lodash';
import Message from 'kpc/components/message';
import Intact from 'intact';

function request(url, method = 'get', dataGet = null, dataPost = null) {
    return new Promise((resolve, reject) => {
        axios({
            url, 
            method,
            params: dataGet,
            data: dataPost,
        }).then(({data}) => {
            if (data.status) {
                Message.error(data.data);
                reject(new Error('request failed'));
            } else {
                resolve(data);
            }
        }, err => {
            const message = `<pre style="text-align: left; margin: 0;">${err.response.data.message}</pre>`;
            Message.error(message);
            reject(err);
        });
    })
}

export const api = {
    getVariables: _.partial(request, '/api/getVariables', 'get'),
    save: _.partial(request, '/api/save', 'post', null),
    getStylus: _.partial(request, '/api/getStylus', 'get'),
    getCss: _.partial(request, '/api/getCss', 'get'),
    getStylusCode: _.partial(request, '/api/getStylusCode', 'get'),
}
