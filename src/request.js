import axios from 'axios';
import _ from 'lodash';

function request(url, method = 'get', dataGet = null, dataPost = null) {
    return axios({
        url, 
        method,
        params: dataGet,
        data: dataPost,
    }).then(({data}) => {
        return data;
    });
}

export const api = {
    getVariables: _.partial(request, '/api/getVariables', 'get'),
    save: _.partial(request, '/api/save', 'post', null),
}
