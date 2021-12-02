import combineReducers from './combineReducers.js';
import createStore from './createStore.js';
import applyMiddleware from './applyMiddleware.js';

const countReducer = (state, action) => {
    const res = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'increase':
            res.count++
            break;

        default:
            break;
    }
    return res;
}

const logMiddleware = ({ store }) => (next) => (action) => {
    console.log('log Middleware', store);
    next(action);
}

const testMiddleware = ({ store }) => (next) => (action) => {
    next(action);
    console.log('test');
}

const enhancer = applyMiddleware(logMiddleware, testMiddleware);
const store = createStore(countReducer, { count: 1 }, enhancer);

store.dispatch({
    type: 'increase'
})

console.log(store.getState());