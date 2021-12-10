import xhrAdapter from './adapter/xhr';

function getDefaultAdapter() {
    let adapter;

    if (typeof XMLHttpRequest !== undefined)
        adapter = xhrAdapter;
    else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]')
        adapter = {}  // TODO: impletementation

    return adapter;
}

const defaults = {
    adapter: getDefaultAdapter(),
    
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },

    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*'
        }
    }
}

export default defaults;