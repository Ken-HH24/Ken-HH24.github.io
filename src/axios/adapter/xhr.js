export default function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
        const requestData = config.data;
        const responseType = config.responseType;

        const xhr = new XMLHttpRequest();
        xhr.open(config.method.toUpperCase(), config.url, true);

        function onLoadend() {
            if (!xhr)
                return;

            const responseData = !responseType || responseType === 'text' || responseType === 'json'
                ? xhr.responseText : xhr.response;

            const response = {
                data: responseData,
                status: xhr.status,
                statusText: xhr.statusText,
                config: config,
                request: xhr
            }

            resolve(response);
        }

        if ('onloadend' in config) {
            xhr.onloadend = onLoadend;
        } else {
            xhr.onreadystatechange = function handleLoad() {
                if (!xhr || xhr.readyState !== 4)
                    return;

                if (xhr.status === 0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0))
                    return;

                setTimeout(onLoadend);
            }
        }

        xhr.send(requestData || null);
    })
}