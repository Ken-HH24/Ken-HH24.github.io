import compose from './utils/compose.js';

export default function applyMiddleware(...middlewares) {
    return (createStore) => {
        return (reducer, initialState) => {
            const store = createStore(reducer, initialState);

            const middlewareAPI = {
                store: store.getState()
            }

            const chain = middlewares.map(middleware => middleware(middlewareAPI));

            const dispatch = compose(...chain)(store.dispatch);
            // let dispatch = store.dispatch;
            // chain.reverse().forEach(middleware => {
            //     dispatch = middleware(dispatch)
            // })

            return {
                ...store,
                dispatch
            }
        }
    }
}