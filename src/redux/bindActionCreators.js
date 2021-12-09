function bindActionCreator(actionCreator, dispatch) {
    return function (this, ...args) {
        return dispatch(actionCreator.apply(this, ...args));
    }
}

export default function bindActionCreators(actionCreators, dispatch) {
    const boundActionCreators = {};
    for (const key of actionCreators) {
        const actionCreator = actionCreators[key];
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
    return boundActionCreators;
}