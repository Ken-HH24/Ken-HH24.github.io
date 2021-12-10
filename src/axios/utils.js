function extend(a, b, context) {
    for (const key in b) {
        if (b.hasOwnProperty(key)) {
            if (typeof b[key] === 'function') {
                a[key] = b[key].bind(context);
            } else {
                a[key] = b[key];
            }
        }
    }
}

const utils = {
    extend
}

export default utils;