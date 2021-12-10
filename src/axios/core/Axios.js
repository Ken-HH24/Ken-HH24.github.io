import InterceptorManager from './InterceptorManager';

function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    }
}

Axios.prototype.request = function request(config) {
    const dispatchRequest = this.defaults.adapter;

    const chain = [dispatchRequest, undefined];

    this.interceptors.request.handlers.forEach(interceptor => {
        chain.unshift(interceptor.fullfilled, interceptor.rejected);
    })

    this.interceptors.response.handlers.forEach(interceptor => {
        chain.push(interceptor.fullfilled, interceptor.rejected);
    })

    config = { ...this.defaults, config };

    let promise = Promise.resolve(config);
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
}

const methodsWithoutData = ['get', 'delete', 'head', 'options'];
methodsWithoutData.forEach(method => {
    Axios.prototype[method] = function (url, config) {
        return this.request({
            url: url,
            method: method,
            data: (config || {}).data
        })
    }
})

const methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(method => {
    Axios.prototype[method] = function (url, data, config) {
        return this.request({
            url: url,
            method: method,
            data: data || {},
        })
    }
})

export default Axios;