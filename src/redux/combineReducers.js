export default function combineReducers(reducers) {
    const reducersKeys = Object.keys(reducers);
    const finalReducer = {};

    for (let i = 0; i < reducersKeys.length; i++) {
        const key = reducersKeys[i];
        if (typeof reducers[key] === 'function') {
            finalReducer[key] = reducers[key];
        }
    }

    const finalReducerKeys = Object.keys(finalReducer);

    return function combine(state, action) {
        let hasChanged = false;
        const nextState = {};

        for (let i = 0; i < finalReducerKeys.length; i++) {
            const key = finalReducerKeys[i];
            const reducer = finalReducer[key];
            const oldStateForKey = state[key];
            const newStateForKey = reducer(oldStateForKey, action);

            hasChanged = hasChanged || newStateForKey !== oldStateForKey;
            nextState[key] = newStateForKey;
        }

        return hasChanged ? nextState : state;
    }
}