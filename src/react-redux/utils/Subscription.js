function createListenerCollection() {
    let first = null;
    let last = null;

    function clear() {
        first = null;
        last = null;
    }

    function notify() {
        let listener = first;

        while (listener) {
            listener.callback();
            listener = listener.next;
        }
    }

    function get() {
        const listeners = [];
        let listener = first;
        while (listener) {
            listeners.push(listener);
            listener = listener.next;
        }
        return listeners;
    }

    function subscribe(callback) {
        let isSubscribe = true;

        const listener = {
            callback,
            prev: null,
            next: last
        }

        last = listener;
        if (listener.prev) {
            listener.prev.next = listener
        } else {
            first = listener
        }

        return function unSubscribe() {
            if (!isSubscribe)
                return;

            isSubscribe = false;
            if (listener.prev) {
                listener.prev.next = listener.next;
            } else {
                first = listener.next;
            }

            if (listener.next) {
                listener.next.prev = listener.prev;
            } else {
                last = listener.prev;
            }
        }
    }

    return {
        clear,
        notify,
        get,
        subscribe
    }
}

export default function createSubscription(store, parentSub) {
    let unSubscribe = null;
    let listeners = null;

    function addNestedSub(listener) {
        trySubscribe();
        return listeners.subscribe(listener);
    }

    function notifyNestedSubs() {
        listeners.notify();
    }

    function handleChangeWrapper() {
        if (subscription.onStateChange) {
            subscription.onStateChange();
        }
    }

    function isSubscribe() {
        return Boolean(unSubscribe);
    }

    function trySubscribe() {
        if (!unSubscribe) {
            listeners = createListenerCollection();
            unSubscribe = parentSub
                ? parentSub.addNestedSub(handleChangeWrapper)
                : store.subscribe(handleChangeWrapper);
        }
    }

    function tryUnSubscribe() {
        if (unSubscribe) {
            unSubscribe();
            unSubscribe = undefined;
            listeners.clear();
            listeners = null;
        }
    }

    const subscription = {
        addNestedSub,
        notifyNestedSubs,
        handleChangeWrapper,
        isSubscribe,
        trySubscribe,
        tryUnSubscribe,
        getListeners: () => listeners,
    }

    return subscription;
}