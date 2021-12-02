export default function createStore(reducer, initialState, enhancer) {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
        enhancer = initialState;
        initialState = null;
    }

    if (enhancer) {
        return enhancer(createStore)(reducer, initialState);
    }

    let currentReducer = reducer;
    let currentState = initialState;
    let currentListeners = [];
    let nextListeners = currentListeners;

    function getState() {
        return currentState;
    }

    function dispatch(action) {
        currentState = currentReducer(currentState, action);

        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = currentListeners[i];
            listener();
        }

        return currentState;
    }

    function subscribe(listener) {
        nextListeners.push(listener);
        currentListeners = nextListeners;

        return function unsubscribe() {
            const index = nextListeners.indexOf(listener);
            if (index >= 0) {
                nextListeners.splice(index, 1);
            }
            currentListeners = null;
        }
    }

    return {
        dispatch,
        getState,
        subscribe
    }
}